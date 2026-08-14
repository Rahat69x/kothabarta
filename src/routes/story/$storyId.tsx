import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark, BookOpen, MessageCircle, Pencil } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import {
  authorName,
  categoryName,
  fetchCategories,
  fetchProfile,
  readingMinutes,
  storyGenres,
  storyCategoryIds,
  resolveCoverUrl,
} from "@/lib/data";
import { fetchParts, fetchStory } from "@/lib/stories";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/ShareButton";
import { ReactionBar } from "@/components/ReactionBar";
import { DeleteStoryButton } from "@/components/DeleteStoryButton";
import { WriterRating } from "@/components/WriterRating";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/story/$storyId")({
  head: () => ({
    meta: [
      { title: "গল্প — গল্পঘর" },
      { name: "description", content: "Read this story part by part on গল্পঘর." },
      { property: "og:title", content: "Story — গল্পঘর" },
      { property: "og:description", content: "Read Bangla stories part by part." },
    ],
  }),
  component: StoryPage,
});

function StoryPage() {
  const { storyId } = Route.useParams();
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: story } = useQuery({ queryKey: ["story", storyId], queryFn: () => fetchStory(storyId) });
  const { data: parts } = useQuery({
    queryKey: ["parts", storyId, "public"],
    queryFn: () => fetchParts(storyId),
  });
  const { data: writer } = useQuery({
    queryKey: ["profile", story?.writer_id],
    queryFn: () => fetchProfile(story!.writer_id),
    enabled: !!story,
  });
  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });

  const { data: bookmarked } = useQuery({
    queryKey: ["bookmark", storyId, user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("bookmarks")
        .select("story_id")
        .eq("story_id", storyId)
        .eq("user_id", user!.id)
        .maybeSingle();
      return !!data;
    },
    enabled: !!user,
  });

  const storyCats = story
    ? storyCategoryIds(story)
        .map((id) => categories?.find((c) => c.id === id))
        .filter(Boolean)
    : [];


  async function toggleBookmark() {
    if (!user) return toast.error(t("loginRequired"));
    if (bookmarked)
      await supabase.from("bookmarks").delete().eq("story_id", storyId).eq("user_id", user.id);
    else await supabase.from("bookmarks").insert({ story_id: storyId, user_id: user.id });
    qc.invalidateQueries({ queryKey: ["bookmark", storyId] });
  }

  if (!story) return null;

  return (
    <article className="mx-auto max-w-4xl px-4 py-10">
      <div className="grid gap-8 sm:grid-cols-[minmax(0,1fr)_18rem]">
        <div>
          <div className="flex flex-wrap gap-2">
            {storyGenres(story).map((g) => (
              <Badge key={g} variant="secondary">
                {t(g)}
              </Badge>
            ))}
            {storyCats.map((c) => (
              <Badge key={c!.id} variant="outline">
                {categoryName(c!, lang)}
              </Badge>
            ))}
            <Badge variant="outline">{story.is_regional ? t("regional") : t("nonRegional")}</Badge>
            <Badge variant="outline">{t(story.status)}</Badge>
          </div>
          <h1 className="mt-4 font-display text-4xl leading-tight font-semibold">{story.title}</h1>
          <p className="mt-2 text-muted-foreground">
            {t("by")}{" "}
            {writer ? (
              <Link to="/writer/$handle" params={{ handle: writer.handle }} className="underline">
                {authorName(writer, story)}
              </Link>
            ) : (
              authorName(null, story)
            )}
          </p>
          {writer && <WriterRating writerId={writer.id} className="mt-2" />}
          {story.description && <p className="mt-4 leading-relaxed">{story.description}</p>}
          {story.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {story.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <ReactionBar storyId={story.id} />
            <Button variant={bookmarked ? "default" : "outline"} size="sm" onClick={toggleBookmark}>
              <Bookmark className="mr-1 h-4 w-4" />
              {bookmarked ? t("readingList") : t("bookmark")}
            </Button>
            <ShareButton title={story.title} path={`/story/${story.id}`} />
            {parts && parts.length > 0 && (
              <Button variant="outline" size="sm" asChild>
                <Link to="/read/$partId" params={{ partId: parts[0].id }} hash="comments">
                  <MessageCircle className="mr-1 h-4 w-4" />
                  {t("goToComments")}
                </Link>
              </Button>
            )}
            {parts && parts.length > 0 && (
              <Button size="sm" asChild>
                <Link to="/read/$partId" params={{ partId: parts[0].id }}>
                  <BookOpen className="mr-1 h-4 w-4" />
                  {t("startReading")}
                </Link>
              </Button>
            )}
            {user?.id === story.writer_id && (
              <>
                <Button variant="secondary" size="sm" asChild>
                  <Link to="/dashboard/$storyId" params={{ storyId: story.id }}>
                    <Pencil className="mr-1 h-4 w-4" />
                    {t("edit")}
                  </Link>
                </Button>
                <DeleteStoryButton
                  storyId={story.id}
                  title={story.title}
                  redirectTo="/dashboard"
                  className="text-destructive"
                />
              </>
            )}
          </div>
        </div>

        <div className="order-first overflow-hidden rounded-lg bg-secondary paper-texture sm:order-last">
          {resolveCoverUrl(story.cover_url) ? (
            <img src={resolveCoverUrl(story.cover_url)!} alt={story.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex aspect-[3/4] items-center justify-center">
              <BookOpen className="h-10 w-10 text-muted-foreground" />
            </div>
          )}
        </div>
      </div>

      <h2 className="mt-12 font-display text-2xl font-semibold">{t("parts")}</h2>
      <div className="mt-4 space-y-2">
        {(parts ?? []).length === 0 && <p className="text-muted-foreground">{t("noParts")}</p>}
        {(parts ?? []).map((p) => (
          <Link key={p.id} to="/read/$partId" params={{ partId: p.id }} className="block">
            <Card className="transition-colors hover:border-primary/50">
              <CardContent className="flex flex-wrap items-center gap-3 py-4">
                <span className="font-medium">
                  {p.part_number}. {p.title}
                </span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {p.word_count} {t("words")} · {readingMinutes(p.word_count)} {t("minRead")}
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </article>
  );
}
