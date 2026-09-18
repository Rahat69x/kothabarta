import { supabase } from "@/integrations/supabase/client";
import {
  resolveCoverUrl,
  storyGenres,
  storyCategoryIds,
  STORY_COVERS,
  TITLE_COVERS,
  type Genre,
  type Part,
  type Profile,
  type Status,
  type Story,
} from "./data";
import { COLLECTION_99_STORIES, COLLECTION_99_PARTS } from "./collection_99";

export const REMOVED_DUPLICATE_STORY_IDS = new Set<string>([
  "d3bbeb63-e53a-45df-a378-bf78b9e26519", // বৃষ্টিভেজা পঙক্তিমালা
  "1305a474-9994-40e6-8dff-f591a9119d2e", // শহরের বারোটা গল্প
  "98caecea-8b2e-4f92-a56d-cd025282c0d0", // রূপকথার শেষ পাতা
  "673e8a64-b454-4e96-bf99-0cf9cac42c9d", // উদ্বেগের সাথে বসবাস
  "87e5fa6a-d5fa-4de2-a967-06acb60915b4", // একজন শিক্ষকের গল্প
  "c5ccd86e-8f83-4431-a510-4560c80cc24e", // বরিশালের জলপথ
  "8a89fae6-d73d-47dd-96cf-5a9b83ef0bcc", // নাগরিকের চোখে নগর
  "2b09dab5-8364-49c1-8fb3-dc830fb2f5eb", // ভোর পাঁচটার অভ্যাস
  "1ff83b31-4c50-4442-870a-5ada8f61ef8c", // শেষ ট্রেনের যাত্রী
  "fd035a30-7353-4ac6-ba9d-aea40ed1439c", // পদ্মাপাড়ের মেয়ে
  "a1de855a-704c-4d76-9630-b2a3a5cbd3d4", // পলাশীর শেষ চিঠি
  "21389dc2-49a0-4bb7-ab42-0c7b381aa38e", // প্রথম চাকরির ছয় মাস
  "2e1b5eb7-44c6-4b3f-a7e0-1b356471403f", // কোয়ান্টাম কম্পিউটার কী
  "cc500032-a4e6-41f5-a486-35ac7058c3fd", // রিকশার হুড তোলা বিকেল
  "92d18c49-a4ea-4427-96d8-bf918be85185", // দুই বিশ্বযুদ্ধের বাংলা
  "a65cfc55-c4be-45f7-a041-5e403677bbe7", // ত্রিশ বছর বয়সে দাঁড়িয়ে
  "5dad2f7e-646d-423d-83c1-6cd49df52c14", // সহজ ভাষায় পরিসংখ্যান
  "36453ed6-1700-44dc-a34d-9c2cfc03564a", // বেহুলার নদীপথ
  "3ba11420-a083-4c9f-af3a-dd0a7267d7b7", // ভাগের সংসার
  "c083bd8b-aecc-4cc3-8498-f2521023caf5", // ২০৭১: ঢাকার আকাশে
  "51b7171b-baff-42d5-9be0-2cec8b558747", // দেবীর তৃতীয় চোখ
  "28f7d86c-dcae-41f4-91f8-6bc3ec53f13d", // টিফিনের ঘণ্টা
  "6d37124b-7eb9-4a52-ac81-2e84fa73e894", // একাত্তরের ভোর
  "ca4edb3a-485e-4ea8-842c-5e186dfc39c8", // অফিসের নতুন স্যার
  "1be7ca4c-c53a-4713-8770-27e7824d4ada", // তেরো নম্বর বাড়ি
]);

export function enrichStoryWithUniqueCover(story: Story): Story {
  const uniqueCover =
    STORY_COVERS[story.id] ||
    TITLE_COVERS[story.title] ||
    resolveCoverUrl(story.cover_url, story.id || story.title);

  return {
    ...story,
    cover_url: uniqueCover ?? story.cover_url,
  };
}

export type StoryFilters = {
  genre?: Genre | "all";
  status?: Status | "all";
  categoryId?: string | "all";
  regional?: "all" | "yes" | "no";
  search?: string;
  limit?: number;
};

export async function fetchProfilesByIds(ids: string[]) {
  const unique = [...new Set(ids)];
  if (unique.length === 0) return {} as Record<string, Profile>;
  const { data, error } = await supabase.from("writer_profiles").select("*").in("id", unique);
  if (error) throw error;
  return Object.fromEntries(((data ?? []) as Profile[]).map((p) => [p.id, p]));
}

export async function fetchStories(filters: StoryFilters = {}) {
  let dbStories: Story[] = [];
  try {
    let q = supabase
      .from("stories")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (filters.limit) {
      q = q.limit(filters.limit);
    } else {
      q = q.limit(120);
    }

    if (filters.genre && filters.genre !== "all") q = q.overlaps("genres", [filters.genre]);
    if (filters.status && filters.status !== "all") q = q.eq("status", filters.status);
    if (filters.categoryId && filters.categoryId !== "all")
      q = q.overlaps("category_ids", [filters.categoryId]);

    if (filters.regional && filters.regional !== "all")
      q = q.eq("is_regional", filters.regional === "yes");
    if (filters.search) q = q.ilike("title", `%${filters.search}%`);

    const { data, error } = await q;
    if (!error && data) {
      dbStories = data as Story[];
    }
  } catch (err) {
    console.error("Failed to query Supabase stories:", err);
  }

  // Filter out removed duplicates from DB stories
  const filteredDb = dbStories.filter((s) => !REMOVED_DUPLICATE_STORY_IDS.has(s.id));

  // Filter COLLECTION_99_STORIES according to the same filters
  let filtered99 = [...COLLECTION_99_STORIES];

  if (filters.genre && filters.genre !== "all") {
    filtered99 = filtered99.filter((s) => storyGenres(s).includes(filters.genre!));
  }
  if (filters.status && filters.status !== "all") {
    filtered99 = filtered99.filter((s) => s.status === filters.status);
  }
  if (filters.categoryId && filters.categoryId !== "all") {
    filtered99 = filtered99.filter((s) => storyCategoryIds(s).includes(filters.categoryId!));
  }
  if (filters.regional && filters.regional !== "all") {
    filtered99 = filtered99.filter((s) => (filters.regional === "yes" ? s.is_regional : !s.is_regional));
  }
  if (filters.search) {
    const sTerm = filters.search.toLowerCase();
    filtered99 = filtered99.filter(
      (s) =>
        s.title.toLowerCase().includes(sTerm) ||
        (s.description && s.description.toLowerCase().includes(sTerm))
    );
  }

  // Combined collection and DB stories
  const combined = [...filtered99, ...filteredDb].map(enrichStoryWithUniqueCover);
  const finalStories = filters.limit ? combined.slice(0, filters.limit) : combined;

  const profiles = await fetchProfilesByIds(finalStories.map((s) => s.writer_id));
  return { stories: finalStories, profiles };
}

export async function fetchStory(storyId: string) {
  if (REMOVED_DUPLICATE_STORY_IDS.has(storyId)) return null;

  const found99 = COLLECTION_99_STORIES.find((s) => s.id === storyId);
  if (found99) {
    return enrichStoryWithUniqueCover(found99);
  }

  const { data, error } = await supabase.from("stories").select("*").eq("id", storyId).maybeSingle();
  if (error) throw error;
  return data ? enrichStoryWithUniqueCover(data as Story) : null;
}

export async function fetchParts(storyId: string, includeDrafts = false) {
  if (REMOVED_DUPLICATE_STORY_IDS.has(storyId)) return [];

  if (COLLECTION_99_PARTS[storyId]) {
    const parts = COLLECTION_99_PARTS[storyId];
    return includeDrafts ? parts : parts.filter((p) => !p.is_draft);
  }

  let q = supabase.from("parts").select("*").eq("story_id", storyId).order("part_number");
  if (!includeDrafts) q = q.eq("is_draft", false);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Part[];
}

export async function fetchPart(partId: string) {
  for (const pList of Object.values(COLLECTION_99_PARTS)) {
    const match = pList.find((p) => p.id === partId);
    if (match) return match;
  }

  const { data, error } = await supabase.from("parts").select("*").eq("id", partId).maybeSingle();
  if (error) throw error;
  return (data as Part) ?? null;
}
