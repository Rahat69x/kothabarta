import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import {
  categoryName,
  countWords,
  fetchCategories,
  storyGenres,
  storyCategoryIds,
  uploadCover,
  resolveCoverUrl,
  type Genre,
  type Part,
  type Status,
} from "@/lib/data";
import { GenrePicker } from "@/components/GenrePicker";
import { CategoryPicker } from "@/components/CategoryPicker";
import { fetchParts, fetchStory } from "@/lib/stories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/dashboard/$storyId")({
  head: () => ({
    meta: [
      { title: "লেখা সম্পাদনা — গল্পঘর" },
      { name: "description", content: "Edit your story details and manage its parts." },
      { property: "og:title", content: "Edit story — গল্পঘর" },
      { property: "og:description", content: "Manage story settings, parts and drafts." },
    ],
  }),
  component: StoryEditor,
});

function StoryEditor() {
  const { storyId } = Route.useParams();
  const { t, lang } = useI18n();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  const { data: story } = useQuery({ queryKey: ["story", storyId], queryFn: () => fetchStory(storyId) });
  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
  const { data: parts } = useQuery({
    queryKey: ["parts", storyId, "all"],
    queryFn: () => fetchParts(storyId, true),
  });

  const [form, setForm] = useState({
    title: "",
    description: "",
    cover_url: "",
    tags: "",
    genre: "fiction" as Genre,
    status: "ongoing" as Status,
    category_ids: [] as string[],
    is_regional: false,
    pen_name_override: "",
    is_published: true,
  });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!story) return;
    setForm({
      title: story.title,
      description: story.description ?? "",
      cover_url: story.cover_url ?? "",
      tags: story.tags.join(", "),
      genre: storyGenres(story)[0],
      status: story.status,
      category_ids: storyCategoryIds(story),
      is_regional: story.is_regional,
      pen_name_override: story.pen_name_override ?? "",
      is_published: story.is_published,
    });
  }, [story]);

  async function saveStory() {
    setBusy(true);
    const { error } = await supabase
      .from("stories")
      .update({
        title: form.title,
        description: form.description || null,
        cover_url: form.cover_url || null,
        tags: form.tags
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        genre: form.genre,
        genres: [form.genre],
        status: form.status,
        category_ids: form.category_ids,
        category_id: form.category_ids[0] ?? null,
        is_regional: form.is_regional,
        pen_name_override: form.pen_name_override || null,
        is_published: form.is_published,
      })
      .eq("id", storyId);
    setBusy(false);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["story", storyId] });
    qc.invalidateQueries({ queryKey: ["my-stories"] });
    toast.success("Saved");
  }

  async function onCoverPick(file: File) {
    if (!user) return;
    try {
      setBusy(true);
      const url = await uploadCover(file, user.id);
      setForm((f) => ({ ...f, cover_url: url }));
      toast.success("Uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  const catOptions = (categories ?? []).filter((c) => c.genre_type === form.genre);

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/dashboard">
          <ArrowLeft className="mr-1 h-4 w-4" />
          {t("back")}
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-2xl">{t("edit")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">{t("title")}</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc">{t("description")}</Label>
            <Textarea
              id="desc"
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover">{t("coverImage")}</Label>
            <Input
              id="cover"
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && onCoverPick(e.target.files[0])}
            />
            {resolveCoverUrl(form.cover_url, storyId || form.title) && (
              <img
                src={resolveCoverUrl(form.cover_url, storyId || form.title)!}
                alt={form.title}
                className="mt-2 aspect-[16/9] w-full rounded-md object-cover"
              />
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("genre")}</Label>
              <GenrePicker
                value={form.genre}
                onChange={(next) => setForm({ ...form, genre: next, category_ids: [] })}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("category")}</Label>
              <CategoryPicker
                options={catOptions}
                value={form.category_ids}
                onChange={(next) => setForm({ ...form, category_ids: next })}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("status")}</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm({ ...form, status: v as Status })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ongoing">{t("ongoing")}</SelectItem>
                  <SelectItem value="completed">{t("completed")}</SelectItem>
                  <SelectItem value="hiatus">{t("hiatus")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">
                {t("tags")}{" "}
                <span className="text-xs text-muted-foreground">({t("tagsHint")})</span>
              </Label>
              <Input
                id="tags"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pen">
              {t("penNameOverride")}{" "}
              <span className="text-xs text-muted-foreground">({t("optional")})</span>
            </Label>
            <Input
              id="pen"
              value={form.pen_name_override}
              onChange={(e) => setForm({ ...form, pen_name_override: e.target.value })}
            />
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Switch
                id="regional"
                checked={form.is_regional}
                onCheckedChange={(v) => setForm({ ...form, is_regional: v })}
              />
              <Label htmlFor="regional" className="font-normal">
                {t("regional")}
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="pub"
                checked={form.is_published}
                onCheckedChange={(v) => setForm({ ...form, is_published: v })}
              />
              <Label htmlFor="pub" className="font-normal">
                {t("published")}
              </Label>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={saveStory} disabled={busy}>
              {busy ? t("saving") : t("save")}
            </Button>
            <Button variant="outline" asChild>
              <Link to="/story/$storyId" params={{ storyId }}>
                {t("browse")}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <PartsPanel storyId={storyId} parts={parts ?? []} />
    </div>
  );
}

function PartsPanel({ storyId, parts }: { storyId: string; parts: Part[] }) {
  const { t } = useI18n();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Part | null>(null);
  const [draftPart, setDraftPart] = useState({ title: "", body: "", is_draft: true, is_premium: false });

  function openNew() {
    setEditing({
      id: "",
      story_id: storyId,
      part_number: parts.length + 1,
      title: "",
      body: "",
      word_count: 0,
      is_premium: false,
      is_draft: true,
      published_at: null,
    });
    setDraftPart({ title: "", body: "", is_draft: true, is_premium: false });
  }

  function openEdit(p: Part) {
    setEditing(p);
    setDraftPart({ title: p.title, body: p.body, is_draft: p.is_draft, is_premium: p.is_premium });
  }

  async function savePart() {
    if (!editing) return;
    const words = countWords(draftPart.body);
    const payload = {
      story_id: storyId,
      part_number: editing.part_number,
      title: draftPart.title || `${t("parts")} ${editing.part_number}`,
      body: draftPart.body,
      word_count: words,
      is_draft: draftPart.is_draft,
      is_premium: draftPart.is_premium,
      published_at: draftPart.is_draft ? null : (editing.published_at ?? new Date().toISOString()),
    };
    const { error } = editing.id
      ? await supabase.from("parts").update(payload).eq("id", editing.id)
      : await supabase.from("parts").insert(payload);
    if (error) return toast.error(error.message);
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["parts", storyId] });
    toast.success("Saved");
  }

  async function removePart(id: string) {
    const { error } = await supabase.from("parts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["parts", storyId] });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-display text-2xl">{t("parts")}</CardTitle>
        <Button size="sm" onClick={openNew}>
          <Plus className="mr-1 h-4 w-4" />
          {t("addPart")}
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {parts.length === 0 && <p className="text-muted-foreground">{t("noParts")}</p>}
        {parts.map((p) => (
          <div
            key={p.id}
            className="flex flex-wrap items-center gap-3 rounded-md border border-border p-3"
          >
            <button className="text-left" onClick={() => openEdit(p)}>
              <p className="font-medium">
                {p.part_number}. {p.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {p.word_count} {t("words")}
              </p>
            </button>
            <Badge variant={p.is_draft ? "outline" : "secondary"} className="ml-auto">
              {p.is_draft ? t("draft") : t("published")}
            </Badge>
            <Button variant="ghost" size="icon" onClick={() => removePart(p.id)} aria-label={t("delete")}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {t("parts")} {editing?.part_number}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="p-title">{t("partTitle")}</Label>
              <Input
                id="p-title"
                value={draftPart.title}
                onChange={(e) => setDraftPart({ ...draftPart, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-body">
                {t("body")}{" "}
                <span className="text-xs text-muted-foreground">({t("bodyHint")})</span>
              </Label>
              <Textarea
                id="p-body"
                rows={14}
                value={draftPart.body}
                onChange={(e) => setDraftPart({ ...draftPart, body: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                {countWords(draftPart.body)} {t("words")}
              </p>
            </div>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  id="p-pub"
                  checked={!draftPart.is_draft}
                  onCheckedChange={(v) => setDraftPart({ ...draftPart, is_draft: !v })}
                />
                <Label htmlFor="p-pub" className="font-normal">
                  {t("publish")}
                </Label>
              </div>
              <div className="flex items-center gap-2 opacity-60">
                <Switch
                  id="p-prem"
                  checked={draftPart.is_premium}
                  onCheckedChange={(v) => setDraftPart({ ...draftPart, is_premium: v })}
                />
                <Label htmlFor="p-prem" className="font-normal">
                  {t("premiumLater")}
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              {t("cancel")}
            </Button>
            <Button onClick={savePart}>{t("save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
