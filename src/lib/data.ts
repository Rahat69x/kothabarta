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

export const STORY_COVERS: Record<string, string> = {
  // 1. সাজেক থেকে সেন্টমার্টিন (Longest story winner for cover-1)
  "13babda7-26be-4d9f-994a-711d9c7508e8": "/covers/cover-1.jpg",

  // 2. ধানমন্ডি ৩২ নম্বর ফাইল (Longest story winner for cover-2)
  "a8b21579-d57a-4740-a08c-3d83d56ffbf4": "/covers/cover-2.jpg",

  // 3. সুন্দরবনের শেষ নৌকা (Longest story winner for cover-3)
  "d6a61f12-4f83-4e56-b1a7-5f9e13e9d14f": "/covers/cover-3.jpg",

  // 4. ফ্ল্যাটের চার দেয়াল (Longest story winner for cover-4)
  "7752bfbe-4dd9-41c3-aa0c-951504ddc0f8": "/covers/cover-4.jpg",

  // 5. মায়ের হাতের ভাত (Longest story winner for cover-5)
  "2f0309d4-dba1-4427-98aa-08fa6d2af25e": "/covers/cover-5.jpg",

  // 6. চায়ের কাপে তুমি (Longest story winner for cover-6)
  "30e670b0-38ce-4bc7-bb53-607fc5baf8de": "/covers/cover-6.jpg",

  // 7. ভাষার লড়াই, ভাষার ভবিষ্যৎ (Longest story winner for cover-7)
  "c3eacc74-5bc9-4e1e-8006-4066a817f86a": "/covers/cover-7.jpg",

  // 8. রোজার ত্রিশ দিন (Longest story winner for cover-8)
  "f55a0a37-abd0-4c15-be56-c9ecda3a842e": "/covers/cover-8.jpg",

  // 9. কালো সিল (Unique cover preserved)
  "d6c64c68-5001-496f-be21-4ce0a6e59553":
    "https://rgdgvuswpapenrlrqgqp.supabase.co/storage/v1/object/sign/covers/e0ded4fd-3bc4-45dd-b8a2-5cafd84b1e4c/54dded03-b1cc-44a7-a9a2-77f4b1cad606.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85NjI0Yjc1Ny03NzQ2LTQxMWMtOWM1OC02NzlhZGY2MjE5ZmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjb3ZlcnMvZTBkZWQ0ZmQtM2JjNC00NWRkLWI4YTItNWNhZmQ4NGIxZTRjLzU0ZGRlZDAzLWIxY2MtNDRhNy1hOWEyLTc3ZjRiMWNhZDYwNi5wbmciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg1NDQ4NzAzLCJleHAiOjIxMDA4MDg3MDN9.-hdb0v0AU4Qvfv0V_3_NikFZ8WIrnzFm-8Sb3jMXdXI",

  // 10. The Art of Thinking Clearly (Unique cover preserved)
  "094c3522-8b20-4e43-851a-a7be90a70df2":
    "https://rgdgvuswpapenrlrqgqp.supabase.co/storage/v1/object/sign/covers/00212e97-f3b6-4ad5-921c-ba6ff34ce707/0a130eca-9e70-420b-a14d-fe7e0531a20d.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85NjI0Yjc1Ny03NzQ2LTQxMWMtOWM1OC02NzlhZGY2MjE5ZmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjb3ZlcnMvMDAyMTJlOTctZjNiNi00YWQ1LTkyMWMtYmE2ZmYzNGNlNzA3LzBhMTMwZWNhLTllNzAtNDIwYi1hMTRkLWZlN2UwNTMxYTIwZC5wbmciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg1NDQwNjU1LCJleHAiOjIxMDA4MDA2NTV9.oBLJj74LpwnkDxViRag8IPOf90HANh4VwP_Lz00EiMQ",
};

export const TITLE_COVERS: Record<string, string> = {
  "সাজেক থেকে সেন্টমার্টিন": "/covers/cover-1.jpg",
  "ধানমন্ডি ৩২ নম্বর ফাইল": "/covers/cover-2.jpg",
  "সুন্দরবনের শেষ নৌকা": "/covers/cover-3.jpg",
  "ফ্ল্যাটের চার দেয়াল": "/covers/cover-4.jpg",
  "মায়ের হাতের ভাত": "/covers/cover-5.jpg",
  "চায়ের কাপে তুমি": "/covers/cover-6.jpg",
  "ভাষার লড়াই, ভাষার ভবিষ্যৎ": "/covers/cover-7.jpg",
  "রোজার ত্রিশ দিন": "/covers/cover-8.jpg",
  "কালো সিল":
    "https://rgdgvuswpapenrlrqgqp.supabase.co/storage/v1/object/sign/covers/e0ded4fd-3bc4-45dd-b8a2-5cafd84b1e4c/54dded03-b1cc-44a7-a9a2-77f4b1cad606.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85NjI0Yjc1Ny03NzQ2LTQxMWMtOWM1OC02NzlhZGY2MjE5ZmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjb3ZlcnMvZTBkZWQ0ZmQtM2JjNC00NWRkLWI4YTItNWNhZmQ4NGIxZTRjLzU0ZGRlZDAzLWIxY2MtNDRhNy1hOWEyLTc3ZjRiMWNhZDYwNi5wbmciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg1NDQ4NzAzLCJleHAiOjIxMDA4MDg3MDN9.-hdb0v0AU4Qvfv0V_3_NikFZ8WIrnzFm-8Sb3jMXdXI",
  "The Art of Thinking Clearly":
    "https://rgdgvuswpapenrlrqgqp.supabase.co/storage/v1/object/sign/covers/00212e97-f3b6-4ad5-921c-ba6ff34ce707/0a130eca-9e70-420b-a14d-fe7e0531a20d.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85NjI0Yjc1Ny03NzQ2LTQxMWMtOWM1OC02NzlhZGY2MjE5ZmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjb3ZlcnMvMDAyMTJlOTctZjNiNi00YWQ1LTkyMWMtYmE2ZmYzNGNlNzA3LzBhMTMwZWNhLTllNzAtNDIwYi1hMTRkLWZlN2UwNTMxYTIwZC5wbmciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg1NDQwNjU1LCJleHAiOjIxMDA4MDA2NTV9.oBLJj74LpwnkDxViRag8IPOf90HANh4VwP_Lz00EiMQ",
};

export function resolveCoverUrl(
  url: string | null | undefined,
  storyIdOrTitle?: string | null,
): string | null {
  if (storyIdOrTitle) {
    if (STORY_COVERS[storyIdOrTitle]) return STORY_COVERS[storyIdOrTitle];
    if (TITLE_COVERS[storyIdOrTitle]) return TITLE_COVERS[storyIdOrTitle];
  }

  if (!url) return null;

  // Preserve user custom signed/public upload URLs
  if (url.startsWith("http") && !url.includes("/__l5e/assets-v1/")) {
    return url;
  }

  const match = url.match(/cover-(\d+)\.jpg/);
  if (match) {
    return `/covers/cover-${match[1]}.jpg`;
  }
  return url;
}



