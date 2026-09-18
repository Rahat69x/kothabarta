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
  // 1. কালো সিল (custom signed URL)
  "d6c64c68-5001-496f-be21-4ce0a6e59553": "https://rgdgvuswpapenrlrqgqp.supabase.co/storage/v1/object/sign/covers/e0ded4fd-3bc4-45dd-b8a2-5cafd84b1e4c/54dded03-b1cc-44a7-a9a2-77f4b1cad606.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85NjI0Yjc1Ny03NzQ2LTQxMWMtOWM1OC02NzlhZGY2MjE5ZmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjb3ZlcnMvZTBkZWQ0ZmQtM2JjNC00NWRkLWI4YTItNWNhZmQ4NGIxZTRjLzU0ZGRlZDAzLWIxY2MtNDRhNy1hOWEyLTc3ZjRiMWNhZDYwNi5wbmciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg1NDQ4NzAzLCJleHAiOjIxMDA4MDg3MDN9.-hdb0v0AU4Qvfv0V_3_NikFZ8WIrnzFm-8Sb3jMXdXI",

  // 2. The Art of Thinking Clearly (custom signed URL)
  "094c3522-8b20-4e43-851a-a7be90a70df2": "https://rgdgvuswpapenrlrqgqp.supabase.co/storage/v1/object/sign/covers/00212e97-f3b6-4ad5-921c-ba6ff34ce707/0a130eca-9e70-420b-a14d-fe7e0531a20d.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85NjI0Yjc1Ny03NzQ2LTQxMWMtOWM1OC02NzlhZGY2MjE5ZmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjb3ZlcnMvMDAyMTJlOTctZjNiNi00YWQ1LTkyMWMtYmE2ZmYzNGNlNzA3LzBhMTMwZWNhLTllNzAtNDIwYi1hMTRkLWZlN2UwNTMxYTIwZC5wbmciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg1NDQwNjU1LCJleHAiOjIxMDA4MDA2NTV9.oBLJj74LpwnkDxViRag8IPOf90HANh4VwP_Lz00EiMQ",

  // 3. রূপকথার শেষ পাতা
  "98caecea-8b2e-4f92-a56d-cd025282c0d0": "/covers/cover-1.jpg",

  // 4. ধানমন্ডি ৩২ নম্বর ফাইল
  "a8b21579-d57a-4740-a08c-3d83d56ffbf4": "/covers/cover-2.jpg",

  // 5. সুন্দরবনের শেষ নৌকা
  "d6a61f12-4f83-4e56-b1a7-5f9e13e9d14f": "/covers/cover-3.jpg",

  // 6. তেরো নম্বর বাড়ি
  "1be7ca4c-c53a-4713-8770-27e7824d4ada": "/covers/cover-4.jpg",

  // 7. পলাশীর শেষ চিঠি
  "a1de855a-704c-4d76-9630-b2a3a5cbd3d4": "/covers/cover-5.jpg",

  // 8. বেহুলার নদীপথ
  "36453ed6-1700-44dc-a34d-9c2cfc03564a": "/covers/cover-6.jpg",

  // 9. ভাষার লড়াই, ভাষার ভবিষ্যৎ
  "c3eacc74-5bc9-4e1e-8006-4066a817f86a": "/covers/cover-7.jpg",

  // 10. সহজ ভাষায় পরিসংখ্যান
  "5dad2f7e-646d-423d-83c1-6cd49df52c14": "/covers/cover-8.jpg",

  // 11. একাত্তরের ভোর
  "6d37124b-7eb9-4a52-ac81-2e84fa73e894": "/covers/cover-9.jpg",

  // 12. দেবীর তৃতীয় চোখ
  "51b7171b-baff-42d5-9be0-2cec8b558747": "/covers/cover-10.jpg",

  // 13. বৃষ্টিভেজা পঙক্তিমালা
  "d3bbeb63-e53a-45df-a378-bf78b9e26519": "/covers/cover-11.jpg",

  // 14. চায়ের কাপে তুমি
  "30e670b0-38ce-4bc7-bb53-607fc5baf8de": "/covers/cover-12.jpg",

  // 15. পদ্মাপাড়ের মেয়ে
  "fd035a30-7353-4ac6-ba9d-aea40ed1439c": "/covers/cover-13.jpg",

  // 16. অফিসের নতুন স্যার
  "ca4edb3a-485e-4ea8-842c-5e186dfc39c8": "/covers/cover-14.jpg",

  // 17. টিফিনের ঘণ্টা
  "28f7d86c-dcae-41f4-91f8-6bc3ec53f13d": "/covers/cover-15.jpg",

  // 18. ২০৭১: ঢাকার আকাশে
  "c083bd8b-aecc-4cc3-8498-f2521023caf5": "/covers/cover-16.jpg",

  // 19. শহরের বারোটা গল্প
  "1305a474-9994-40e6-8dff-f591a9119d2e": "/covers/cover-17.jpg",

  // 20. ভাগের সংসার
  "3ba11420-a083-4c9f-af3a-dd0a7267d7b7": "/covers/cover-18.jpg",

  // 21. শেষ ট্রেনের যাত্রী
  "1ff83b31-4c50-4442-870a-5ada8f61ef8c": "/covers/cover-19.jpg",

  // 22. ফ্ল্যাটের চার দেয়াল
  "7752bfbe-4dd9-41c3-aa0c-951504ddc0f8": "/covers/cover-20.jpg",

  // 23. একজন শিক্ষকের গল্প
  "87e5fa6a-d5fa-4de2-a967-06acb60915b4": "/covers/cover-21.jpg",

  // 24. নাগরিকের চোখে নগর
  "8a89fae6-d73d-47dd-96cf-5a9b83ef0bcc": "/covers/cover-22.jpg",

  // 25. বরিশালের জলপথ
  "c5ccd86e-8f83-4431-a510-4560c80cc24e": "/covers/cover-23.jpg",

  // 26. রোজার ত্রিশ দিন
  "f55a0a37-abd0-4c15-be56-c9ecda3a842e": "/covers/cover-24.jpg",

  // 27. কোয়ান্টাম কম্পিউটার কী
  "2e1b5eb7-44c6-4b3f-a7e0-1b356471403f": "/covers/cover-25.jpg",

  // 28. ভোর পাঁচটার অভ্যাস
  "2b09dab5-8364-49c1-8fb3-dc830fb2f5eb": "/covers/cover-26.jpg",

  // 29. সাজেক থেকে সেন্টমার্টিন
  "13babda7-26be-4d9f-994a-711d9c7508e8": "/covers/cover-27.jpg",

  // 30. দুই বিশ্বযুদ্ধের বাংলা
  "92d18c49-a4ea-4427-96d8-bf918be85185": "/covers/cover-28.jpg",

  // 31. রিকশার হুড তোলা বিকেল
  "cc500032-a4e6-41f5-a486-35ac7058c3fd": "/covers/cover-29.jpg",

  // 32. মায়ের হাতের ভাত
  "2f0309d4-dba1-4427-98aa-08fa6d2af25e": "/covers/cover-30.jpg",

  // 33. উদ্বেগের সাথে বসবাস
  "673e8a64-b454-4e96-bf99-0cf9cac42c9d": "/covers/cover-31.jpg",

  // 34. ত্রিশ বছর বয়সে দাঁড়িয়ে
  "a65cfc55-c4be-45f7-a041-5e403677bbe7": "/covers/cover-32.jpg",

  // 35. প্রথম চাকরির ছয় মাস
  "21389dc2-49a0-4bb7-ab42-0c7b381aa38e": "/covers/cover-33.jpg",
};

export const TITLE_COVERS: Record<string, string> = {
  "কালো সিল": "https://rgdgvuswpapenrlrqgqp.supabase.co/storage/v1/object/sign/covers/e0ded4fd-3bc4-45dd-b8a2-5cafd84b1e4c/54dded03-b1cc-44a7-a9a2-77f4b1cad606.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85NjI0Yjc1Ny03NzQ2LTQxMWMtOWM1OC02NzlhZGY2MjE5ZmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjb3ZlcnMvZTBkZWQ0ZmQtM2JjNC00NWRkLWI4YTItNWNhZmQ4NGIxZTRjLzU0ZGRlZDAzLWIxY2MtNDRhNy1hOWEyLTc3ZjRiMWNhZDYwNi5wbmciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg1NDQ4NzAzLCJleHAiOjIxMDA4MDg3MDN9.-hdb0v0AU4Qvfv0V_3_NikFZ8WIrnzFm-8Sb3jMXdXI",
  "The Art of Thinking Clearly": "https://rgdgvuswpapenrlrqgqp.supabase.co/storage/v1/object/sign/covers/00212e97-f3b6-4ad5-921c-ba6ff34ce707/0a130eca-9e70-420b-a14d-fe7e0531a20d.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85NjI0Yjc1Ny03NzQ2LTQxMWMtOWM1OC02NzlhZGY2MjE5ZmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjb3ZlcnMvMDAyMTJlOTctZjNiNi00YWQ1LTkyMWMtYmE2ZmYzNGNlNzA3LzBhMTMwZWNhLTllNzAtNDIwYi1hMTRkLWZlN2UwNTMxYTIwZC5wbmciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg1NDQwNjU1LCJleHAiOjIxMDA4MDA2NTV9.oBLJj74LpwnkDxViRag8IPOf90HANh4VwP_Lz00EiMQ",
  "রূপকথার শেষ পাতা": "/covers/cover-1.jpg",
  "ধানমন্ডি ৩২ নম্বর ফাইল": "/covers/cover-2.jpg",
  "সুন্দরবনের শেষ নৌকা": "/covers/cover-3.jpg",
  "তেরো নম্বর বাড়ি": "/covers/cover-4.jpg",
  "পলাশীর শেষ চিঠি": "/covers/cover-5.jpg",
  "বেহুলার নদীপথ": "/covers/cover-6.jpg",
  "ভাষার লড়াই, ভাষার ভবিষ্যৎ": "/covers/cover-7.jpg",
  "সহজ ভাষায় পরিসংখ্যান": "/covers/cover-8.jpg",
  "একাত্তরের ভোর": "/covers/cover-9.jpg",
  "দেবীর তৃতীয় চোখ": "/covers/cover-10.jpg",
  "বৃষ্টিভেজা পঙক্তিমালা": "/covers/cover-11.jpg",
  "চায়ের কাপে তুমি": "/covers/cover-12.jpg",
  "পদ্মাপাড়ের মেয়ে": "/covers/cover-13.jpg",
  "অফিসের নতুন স্যার": "/covers/cover-14.jpg",
  "টিফিনের ঘণ্টা": "/covers/cover-15.jpg",
  "২০৭১: ঢাকার আকাশে": "/covers/cover-16.jpg",
  "শহরের বারোটা গল্প": "/covers/cover-17.jpg",
  "ভাগের সংসার": "/covers/cover-18.jpg",
  "শেষ ট্রেনের যাত্রী": "/covers/cover-19.jpg",
  "ফ্ল্যাটের চার দেয়াল": "/covers/cover-20.jpg",
  "একজন শিক্ষকের গল্প": "/covers/cover-21.jpg",
  "নাগরিকের চোখে নগর": "/covers/cover-22.jpg",
  "বরিশালের জলপথ": "/covers/cover-23.jpg",
  "রোজার ত্রিশ দিন": "/covers/cover-24.jpg",
  "কোয়ান্টাম কম্পিউটার কী": "/covers/cover-25.jpg",
  "ভোর পাঁচটার অভ্যাস": "/covers/cover-26.jpg",
  "সাজেক থেকে সেন্টমার্টিন": "/covers/cover-27.jpg",
  "দুই বিশ্বযুদ্ধের বাংলা": "/covers/cover-28.jpg",
  "রিকশার হুড তোলা বিকেল": "/covers/cover-29.jpg",
  "মায়ের হাতের ভাত": "/covers/cover-30.jpg",
  "উদ্বেগের সাথে বসবাস": "/covers/cover-31.jpg",
  "ত্রিশ বছর বয়সে দাঁড়িয়ে": "/covers/cover-32.jpg",
  "প্রথম চাকরির ছয় মাস": "/covers/cover-33.jpg",
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



