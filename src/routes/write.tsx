import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PenLine, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { countWords, fetchCategories, fetchProfile, type Genre } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GenrePicker } from "@/components/GenrePicker";
import { CategoryPicker } from "@/components/CategoryPicker";


export const Route = createFileRoute("/write")({
  head: () => ({
    meta: [
      { title: "দ্রুত পোস্ট — গল্পঘর" },
      {
        name: "description",
        content: "Write a title and your text, then publish your Bangla story in one click.",
      },
      { property: "og:title", content: "Quick post — গল্পঘর" },
      { property: "og:description", content: "Publish a Bangla story or blog post in one click." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://amrjaicchalikhmu.lovable.app/write" },
    ],
    links: [{ rel: "canonical", href: "https://amrjaicchalikhmu.lovable.app/write" }],
  }),
  component: QuickWrite,
});

function QuickWrite() {
  const { t, lang } = useI18n();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [genre, setGenre] = useState<Genre>("experience");
  const [categoryIds, setCategoryIds] = useState<string[]>([]);

  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => fetchProfile(user!.id),
    enabled: !!user,
  });

  useEffect(() => {
    if (!profileLoading && user && profile === null) navigate({ to: "/profile" });
  }, [profileLoading, profile, user, navigate]);

  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
  const catOptions = (categories ?? []).filter((c) => c.genre_type === genre);

  async function post(publish: boolean) {
    if (!user) return toast.error(t("loginRequired"));
    if (!title.trim() || !body.trim()) return toast.error(t("title") + " + " + t("body"));
    setBusy(true);
    const { data: story, error } = await supabase
      .from("stories")
      .insert({
        writer_id: user.id,
        title: title.trim(),
        genre,
        genres: [genre],
        category_ids: categoryIds,
        category_id: categoryIds[0] ?? null,
        is_published: publish,
      })

      .select()
      .single();
    if (error || !story) {
      setBusy(false);
      return toast.error(error?.message ?? "Failed");
    }
    const { error: partErr } = await supabase.from("parts").insert({
      story_id: story.id,
      part_number: 1,
      title: title.trim(),
      body: body.trim(),
      word_count: countWords(body),
      is_draft: !publish,
      published_at: publish ? new Date().toISOString() : null,
    });
    setBusy(false);
    if (partErr) return toast.error(partErr.message);
    toast.success(publish ? t("published") : t("draft"));
    navigate(
      publish
        ? { to: "/story/$storyId", params: { storyId: story.id } }
        : { to: "/dashboard/$storyId", params: { storyId: story.id } },
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Card className="relative">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Close"
          className="absolute right-3 top-3 h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
          onClick={() => {
            if (window.history.length > 1) window.history.back();
            else navigate({ to: "/" });
          }}
        >
          <X className="h-4 w-4" />
        </Button>
        <CardHeader>
          <h1 className="font-display flex items-center gap-2 pr-10 text-2xl leading-none font-semibold">
            <PenLine className="h-5 w-5 text-primary" />
            {t("quickPost")}
          </h1>
          <p className="text-sm text-muted-foreground">{t("quickPostLead")}</p>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="q-title">{t("title")}</Label>
            <Input
              id="q-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="q-body">
              {t("body")} <span className="text-xs text-muted-foreground">({t("bodyHint")})</span>
            </Label>
            <Textarea
              id="q-body"
              rows={16}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="prose-reader"
            />
            <p className="text-xs text-muted-foreground">
              {countWords(body)} {t("words")}
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("genre")}</Label>
              <GenrePicker
                value={genre}
                onChange={(next) => {
                  setGenre(next);
                  setCategoryIds([]);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>
                {t("category")}{" "}
                <span className="text-xs text-muted-foreground">({t("optional")})</span>
              </Label>
              <CategoryPicker
                options={catOptions}
                value={categoryIds}
                onChange={setCategoryIds}
              />
            </div>
          </div>


          <div className="flex flex-wrap gap-2">
            <Button onClick={() => post(true)} disabled={busy}>
              {busy ? t("saving") : t("publishNow")}
            </Button>
            <Button variant="outline" onClick={() => post(false)} disabled={busy}>
              {t("saveDraft")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
