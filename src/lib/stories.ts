import { supabase } from "@/integrations/supabase/client";
import type { Genre, Part, Profile, Status, Story } from "./data";

export type StoryFilters = {
  genre?: Genre | "all";
  status?: Status | "all";
  categoryId?: string | "all";
  regional?: "all" | "yes" | "no";
  search?: string;
};

export async function fetchProfilesByIds(ids: string[]) {
  const unique = [...new Set(ids)];
  if (unique.length === 0) return {} as Record<string, Profile>;
  const { data, error } = await supabase.from("writer_profiles").select("*").in("id", unique);
  if (error) throw error;
  return Object.fromEntries(((data ?? []) as Profile[]).map((p) => [p.id, p]));
}

export async function fetchStories(filters: StoryFilters = {}) {
  let q = supabase
    .from("stories")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(60);

  if (filters.genre && filters.genre !== "all") q = q.overlaps("genres", [filters.genre]);
  if (filters.status && filters.status !== "all") q = q.eq("status", filters.status);
  if (filters.categoryId && filters.categoryId !== "all")
    q = q.overlaps("category_ids", [filters.categoryId]);

  if (filters.regional && filters.regional !== "all")
    q = q.eq("is_regional", filters.regional === "yes");
  if (filters.search) q = q.ilike("title", `%${filters.search}%`);

  const { data, error } = await q;
  if (error) throw error;
  const stories = (data ?? []) as Story[];
  const profiles = await fetchProfilesByIds(stories.map((s) => s.writer_id));
  return { stories, profiles };
}

export async function fetchStory(storyId: string) {
  const { data, error } = await supabase.from("stories").select("*").eq("id", storyId).maybeSingle();
  if (error) throw error;
  return (data as Story) ?? null;
}

export async function fetchParts(storyId: string, includeDrafts = false) {
  let q = supabase.from("parts").select("*").eq("story_id", storyId).order("part_number");
  if (!includeDrafts) q = q.eq("is_draft", false);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Part[];
}

export async function fetchPart(partId: string) {
  const { data, error } = await supabase.from("parts").select("*").eq("id", partId).maybeSingle();
  if (error) throw error;
  return (data as Part) ?? null;
}
