import { supabase } from "@/integrations/supabase/client";
import type { Lang } from "./i18n";

export type Genre = "fiction" | "nonfiction" | "experience";
export type Status = "ongoing" | "completed" | "hiatus";

export type Category = {
  id: string;
  slug: string;
  name_bn: string;
  name_en: string;
  genre_type: Genre;
};

export type Profile = {
  id: string;
  handle: string;
  real_name: string | null;
  default_pen_name: string | null;
  use_pen_name: boolean;
  bio: string | null;
  avatar_url: string | null;
};

export type Story = {
  id: string;
  writer_id: string;
  title: string;
  cover_url: string | null;
  description: string | null;
  tags: string[];
  genre: Genre;
  genres: Genre[] | null;
  status: Status;
  category_id: string | null;
  category_ids: string[] | null;

  is_regional: boolean;
  pen_name_override: string | null;
  is_published: boolean;
  created_at: string;
};

export type Part = {
  id: string;
  story_id: string;
  part_number: number;
  title: string;
  body: string;
  word_count: number;
  is_premium: boolean;
  is_draft: boolean;
  published_at: string | null;
};

export const categoryName = (c: Category | null | undefined, lang: Lang) =>
  !c ? "" : lang === "bn" ? c.name_bn : c.name_en;

export function authorName(
  profile: Pick<Profile, "real_name" | "default_pen_name" | "use_pen_name" | "handle"> | null,
  story?: { pen_name_override?: string | null } | null,
) {
  if (story?.pen_name_override) return story.pen_name_override;
  if (!profile) return "—";
  if (profile.use_pen_name) return profile.default_pen_name || profile.handle;
  return profile.real_name || profile.default_pen_name || profile.handle;
}

/** A story's genres, falling back to the single legacy genre column. */
export const storyGenres = (story: { genre: Genre; genres?: Genre[] | null }): Genre[] =>
  story.genres && story.genres.length ? story.genres : [story.genre];

/** All category (genre) ids on a story, falling back to the single legacy column. */
export const storyCategoryIds = (story: {
  category_id?: string | null;
  category_ids?: string[] | null;
}): string[] =>
  story.category_ids && story.category_ids.length
    ? story.category_ids
    : story.category_id
      ? [story.category_id]
      : [];



export const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

export const readingMinutes = (words: number) => Math.max(1, Math.round(words / 180));

/** Uploads to the private covers bucket and returns a long-lived signed URL. */
export async function uploadCover(file: File, userId: string) {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("covers").upload(path, file);
  if (error) throw error;
  const { data, error: signErr } = await supabase.storage
    .from("covers")
    .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  if (signErr) throw signErr;
  return data.signedUrl;
}

export async function fetchCategories() {
  const { data, error } = await supabase.from("categories").select("*").order("name_en");
  if (error) throw error;
  return (data ?? []) as Category[];
}

export async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from("writer_profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return (data as Profile) ?? null;
}

/** Writer rating derived from reader engagement across their published stories (0–5 stars). */
export async function fetchWriterRating(writerId: string) {
  const { data: stories, error } = await supabase
    .from("stories")
    .select("id")
    .eq("writer_id", writerId)
    .eq("is_published", true);
  if (error) throw error;
  const ids = (stories ?? []).map((s) => s.id);
  if (ids.length === 0) return { rating: 0, likes: 0, followers: 0, stories: 0 };

  const [likeRes, bookmarkRes, followRes] = await Promise.all([
    supabase.from("likes").select("*", { count: "exact", head: true }).in("story_id", ids),
    supabase.from("bookmarks").select("*", { count: "exact", head: true }).in("story_id", ids),
    supabase.from("follows").select("*", { count: "exact", head: true }).eq("writer_id", writerId),
  ]);
  if (likeRes.error) throw likeRes.error;
  if (bookmarkRes.error) throw bookmarkRes.error;
  if (followRes.error) throw followRes.error;

  const likes = likeRes.count ?? 0;
  const bookmarks = bookmarkRes.count ?? 0;
  const followers = followRes.count ?? 0;

  // Engagement points per published story: likes + bookmarks + a bonus for followers.
  const perStory = (likes + bookmarks + followers * 2) / ids.length;
  // Saturating curve: ~2.0★ at 1 pt/story, ~3.5★ at 4, ~4.0★ at 7, ~4.5★ at 15.
  const raw = perStory <= 0 ? 0 : 5 * (1 - 1 / Math.pow(1 + perStory, 0.75));
  const rating = Math.round(Math.min(5, raw) * 10) / 10;
  return { rating, likes, followers, stories: ids.length };
}

