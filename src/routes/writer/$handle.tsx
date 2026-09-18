import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { authorName, fetchCategories, type Profile, type Story } from "@/lib/data";
import { REMOVED_DUPLICATE_STORY_IDS, enrichStoryWithUniqueCover } from "@/lib/stories";
import { ShareButton } from "@/components/ShareButton";
import { WriterRating } from "@/components/WriterRating";
import { StoryCard } from "@/components/StoryCard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/writer/$handle")({
  head: () => ({
    meta: [
      { title: "লেখক — গল্পঘর" },
      { name: "description", content: "Writer profile and published stories on গল্পঘর." },
      { property: "og:title", content: "Writer profile — গল্পঘর" },
      { property: "og:description", content: "Read everything this writer has published." },
    ],
  }),
  component: WriterPage,
});

function WriterPage() {
  const { handle } = Route.useParams();
  const { t } = useI18n();
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["profile-handle", handle],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("writer_profiles")
        .select("*")
        .eq("handle", handle)
        .maybeSingle();
      if (error) throw error;
      return (data as Profile) ?? null;
    },
  });

  const { data: stories } = useQuery({
    queryKey: ["writer-stories", profile?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .eq("writer_id", profile!.id)
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return ((data ?? []) as Story[])
        .filter((s) => !REMOVED_DUPLICATE_STORY_IDS.has(s.id))
        .map(enrichStoryWithUniqueCover);
    },
    enabled: !!profile,
  });

  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });

  const { data: followers } = useQuery({
    queryKey: ["followers", profile?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("follows")
        .select("follower_id")
        .eq("writer_id", profile!.id);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!profile,
  });

  const isFollowing = !!user && (followers ?? []).some((f) => f.follower_id === user.id);

  async function toggleFollow() {
    if (!user || !profile) return toast.error(t("loginRequired"));
    if (isFollowing)
      await supabase
        .from("follows")
        .delete()
        .eq("writer_id", profile.id)
        .eq("follower_id", user.id);
    else await supabase.from("follows").insert({ writer_id: profile.id, follower_id: user.id });
    qc.invalidateQueries({ queryKey: ["followers", profile.id] });
  }

  if (!profile) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="border-b border-border pb-8">
        <h1 className="font-display text-4xl font-semibold">{authorName(profile)}</h1>
        <p className="mt-1 text-muted-foreground">@{profile.handle}</p>
        <WriterRating writerId={profile.id} className="mt-3" />
        {profile.bio && <p className="mt-4 max-w-2xl leading-relaxed">{profile.bio}</p>}
        <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span>
            {stories?.length ?? 0} {t("stories")}
          </span>
          <span>
            {followers?.length ?? 0} {t("followers")}
          </span>
          {user?.id !== profile.id && (
            <Button size="sm" variant={isFollowing ? "outline" : "default"} onClick={toggleFollow}>
              {isFollowing ? t("following") : t("follow")}
            </Button>
          )}
          <ShareButton title={authorName(profile)} path={`/writer/${profile.handle}`} />
        </div>
      </header>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(stories ?? []).map((s) => (
          <StoryCard
            key={s.id}
            story={s}
            profile={profile}
            category={categories?.find((c) => c.id === s.category_id) ?? null}
          />
        ))}
      </div>
      {stories?.length === 0 && (
        <p className="py-16 text-center text-muted-foreground">{t("noStories")}</p>
      )}
    </div>
  );
}
