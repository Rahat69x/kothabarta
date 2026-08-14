import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import {
  fetchCategories,
  fetchProfile,
  storyGenres,
  type Genre,
  type Story,
} from "@/lib/data";
import { GenrePicker } from "@/components/GenrePicker";
import { CategoryPicker } from "@/components/CategoryPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DeleteStoryButton } from "@/components/DeleteStoryButton";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [
      { title: "ড্যাশবোর্ড — গল্পঘর" },
      { name: "description", content: "Manage your stories, parts and drafts on গল্পঘর." },
      { property: "og:title", content: "Writer dashboard — গল্পঘর" },
      { property: "og:description", content: "Create stories and publish parts." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { t } = useI18n();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState<Genre>("fiction");
  const [categoryIds, setCategoryIds] = useState<string[]>([]);

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
  const { data: stories } = useQuery({
    queryKey: ["my-stories", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .eq("writer_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Story[];
    },
    enabled: !!user,
  });

  async function createStory() {
    if (!user || !title.trim()) return;
    const { data, error } = await supabase
      .from("stories")
      .insert({
        writer_id: user.id,
        title: title.trim(),
        genre,
        genres: [genre],
        category_ids: categoryIds,
        category_id: categoryIds[0] ?? null,
      })
      .select()
      .single();
    if (error) return toast.error(error.message);
    setOpen(false);
    setTitle("");
    qc.invalidateQueries({ queryKey: ["my-stories"] });
    navigate({ to: "/dashboard/$storyId", params: { storyId: data.id } });
  }

  const catOptions = (categories ?? []).filter((c) => c.genre_type === genre);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-3xl font-semibold">{t("myStories")}</h1>
        <Button variant="outline" className="ml-auto" asChild>
          <Link to="/write">
            <Plus className="mr-1 h-4 w-4" />
            {t("quickPost")}
          </Link>
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-1 h-4 w-4" />
              {t("newStory")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("newStory")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-title">{t("title")}</Label>
                <Input
                  id="new-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  autoFocus
                />
              </div>
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
                <Label>{t("category")}</Label>
                <CategoryPicker
                  options={catOptions}
                  value={categoryIds}
                  onChange={setCategoryIds}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={createStory}>{t("save")}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-8 space-y-3">
        {(stories ?? []).map((s) => (
          <Card key={s.id} className="transition-colors hover:border-primary/50">
            <CardContent className="flex flex-wrap items-center gap-3">
              <Link to="/dashboard/$storyId" params={{ storyId: s.id }} className="block">
                <p className="font-display text-lg font-semibold">{s.title}</p>
                <p className="text-sm text-muted-foreground">
                  {storyGenres(s).map((g) => t(g)).join(" · ")} · {t(s.status)}
                </p>
              </Link>
              <Badge variant={s.is_published ? "secondary" : "outline"} className="ml-auto">
                {s.is_published ? t("published") : t("draft")}
              </Badge>
              <DeleteStoryButton storyId={s.id} title={s.title} className="text-destructive" />
            </CardContent>
          </Card>
        ))}
        {stories?.length === 0 && (
          <p className="py-16 text-center text-muted-foreground">{t("noStories")}</p>
        )}
      </div>
    </div>
  );
}
