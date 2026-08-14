import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { authorName, fetchProfile, readingMinutes, type Profile } from "@/lib/data";
import { fetchPart, fetchParts, fetchProfilesByIds, fetchStory } from "@/lib/stories";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/ShareButton";
import { ReaderSettings, useReaderPrefs, type ReaderPrefs } from "@/components/ReaderSettings";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/read/$partId")({
  head: () => ({
    meta: [
      { title: "পর্ব — গল্পঘর" },
      { name: "description", content: "Read this part and join the discussion on গল্পঘর." },
      { property: "og:title", content: "Read a part — গল্পঘর" },
      { property: "og:description", content: "Serialized Bangla writing, part by part." },
    ],
  }),
  component: Reader,
});

const IMG = /^https?:\/\/\S+\.(png|jpe?g|gif|webp|avif)(\?\S*)?$/i;

function Body({ text, prefs }: { text: string; prefs: ReaderPrefs }) {
  return (
    <div
      className="mt-8"
      style={{
        fontSize: `${prefs.fontSize}px`,
        lineHeight: prefs.lineHeight,
        fontFamily: prefs.family === "serif" ? "var(--font-display)" : "var(--font-sans)",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      {text.split(/\n{2,}/).map((block, i) => {
        const trimmed = block.trim();
        if (IMG.test(trimmed))
          return (
            <img
              key={i}
              src={trimmed}
              alt=""
              loading="lazy"
              className="w-full rounded-lg"
              style={{ marginBottom: `${prefs.paraGap}em` }}
            />
          );
        return (
          <p key={i} style={{ marginBottom: `${prefs.paraGap}em` }}>
            {block}
          </p>
        );
      })}
    </div>
  );
}

function Reader() {
  const { partId } = Route.useParams();
  const { t } = useI18n();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [comment, setComment] = useState("");
  const { prefs, update, reset } = useReaderPrefs();

  const { data: part } = useQuery({ queryKey: ["part", partId], queryFn: () => fetchPart(partId) });
  const { data: story } = useQuery({
    queryKey: ["story", part?.story_id],
    queryFn: () => fetchStory(part!.story_id),
    enabled: !!part,
  });
  const { data: siblings } = useQuery({
    queryKey: ["parts", part?.story_id, "public"],
    queryFn: () => fetchParts(part!.story_id),
    enabled: !!part,
  });
  const { data: writer } = useQuery({
    queryKey: ["profile", story?.writer_id],
    queryFn: () => fetchProfile(story!.writer_id),
    enabled: !!story,
  });

  const { data: comments } = useQuery({
    queryKey: ["comments", partId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("part_id", partId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      const rows = data ?? [];
      const profiles = await fetchProfilesByIds(rows.map((c) => c.user_id));
      return { rows, profiles: profiles as Record<string, Profile> };
    },
  });

  async function addComment() {
    if (!user) return toast.error(t("loginRequired"));
    if (!comment.trim()) return;
    const { error } = await supabase
      .from("comments")
      .insert({ part_id: partId, user_id: user.id, body: comment.trim() });
    if (error) return toast.error(error.message);
    setComment("");
    qc.invalidateQueries({ queryKey: ["comments", partId] });
  }

  async function removeComment(id: string) {
    const { error } = await supabase.from("comments").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["comments", partId] });
    toast.success(t("deleted"));
  }

  if (!part || !story) return null;

  const idx = (siblings ?? []).findIndex((p) => p.id === part.id);
  const prev = idx > 0 ? siblings![idx - 1] : null;
  const next = siblings && idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null;

  return (
    <div
      className={
        prefs.bg === "sepia" ? "reader-sepia" : prefs.bg === "dark" ? "reader-dark" : undefined
      }
    >
      <div
        className="mx-auto px-4 py-10"
        style={{ maxWidth: `${prefs.width}px` }}
      >
      <Button variant="ghost" size="sm" asChild>
        <Link to="/story/$storyId" params={{ storyId: story.id }}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          {story.title}
        </Link>
      </Button>

      <h1 className="mt-6 font-display text-3xl leading-tight font-semibold">
        {part.part_number}. {part.title}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {t("by")} {authorName(writer ?? null, story)} · {part.word_count} {t("words")} ·{" "}
        {readingMinutes(part.word_count)} {t("minRead")}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <ReaderSettings prefs={prefs} update={update} reset={reset} />
        <ShareButton title={part.title} path={`/read/${part.id}`} />
        {user?.id === story.writer_id && (
          <Button variant="secondary" size="sm" asChild>
            <Link to="/dashboard/$storyId" params={{ storyId: story.id }}>
              <Pencil className="mr-1 h-4 w-4" />
              {t("edit")}
            </Link>
          </Button>
        )}
      </div>

      <Body text={part.body} prefs={prefs} />


      <div className="mt-10 flex justify-between gap-3">
        {prev ? (
          <Button variant="outline" asChild>
            <Link to="/read/$partId" params={{ partId: prev.id }}>
              <ArrowLeft className="mr-1 h-4 w-4" />
              {prev.part_number}
            </Link>
          </Button>
        ) : (
          <span />
        )}
        {next && (
          <Button asChild>
            <Link to="/read/$partId" params={{ partId: next.id }}>
              {next.part_number}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>

      <section id="comments" className="mt-12 scroll-mt-20">
        <h2 className="font-display text-2xl font-semibold">
          {t("comments")} ({comments?.rows.length ?? 0})
        </h2>
        <div className="mt-4 space-y-3">
          <Textarea
            rows={3}
            placeholder={t("writeComment")}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button size="sm" onClick={addComment}>
            {t("send")}
          </Button>
        </div>
        <div className="mt-6 space-y-3">
          {comments?.rows.map((c) => (
            <Card key={c.id}>
              <CardContent className="py-4">
                <div className="flex items-start gap-2">
                  <p className="text-sm font-medium">
                    {authorName(comments.profiles[c.user_id] ?? null)}
                  </p>
                  {(user?.id === c.user_id || user?.id === story.writer_id) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-auto h-7 w-7 text-destructive"
                      aria-label={t("delete")}
                      onClick={() => removeComment(c.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="mt-1 text-sm whitespace-pre-wrap">{c.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      </div>
    </div>
  );
}
