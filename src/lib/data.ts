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
  // 99 Literary Collection Covers
  "c1010001-0000-4000-8000-000000000001": "/covers/cover-nondito-noroke.svg",
  "c1010001-0000-4000-8000-000000000002": "/covers/cover-shonkhonil-karagar.svg",
  "c1010001-0000-4000-8000-000000000003": "/covers/cover-debi.svg",
  "c1010001-0000-4000-8000-000000000004": "/covers/cover-sowrobh.svg",
  "c1010001-0000-4000-8000-000000000005": "/covers/cover-amar-ache-jol.svg",
  "c1010001-0000-4000-8000-000000000006": "/covers/cover-ochinpur.svg",
  "c1010001-0000-4000-8000-000000000007": "/covers/cover-opekkha.svg",
  "c1010001-0000-4000-8000-000000000008": "/covers/cover-oronno.svg",
  "c1010001-0000-4000-8000-000000000009": "/covers/cover-onnodin.svg",
  "c1010001-0000-4000-8000-000000000010": "/covers/cover-oporahnho.svg",
  "c1010001-0000-4000-8000-000000000011": "/covers/cover-onil-bagchir-ekdin.svg",
  "c1010001-0000-4000-8000-000000000012": "/covers/cover-agun-er-poroshmoni.svg",
  "c1010001-0000-4000-8000-000000000013": "/covers/cover-shyamol-chhaya.svg",
  "c1010001-0000-4000-8000-000000000014": "/covers/cover-ekattor-1971.svg",
  "c1010001-0000-4000-8000-000000000015": "/covers/cover-jochna-o-jononir-golpo.svg",
  "c1010001-0000-4000-8000-000000000016": "/covers/cover-deyal.svg",
  "c1010001-0000-4000-8000-000000000017": "/covers/cover-moddhanho.svg",
  "c1010001-0000-4000-8000-000000000018": "/covers/cover-matal-hawa.svg",
  "c1010001-0000-4000-8000-000000000019": "/covers/cover-krishnopokkho.svg",
  "c1010001-0000-4000-8000-000000000020": "/covers/cover-shrabon-megher-din.svg",
  "c1010001-0000-4000-8000-000000000021": "/covers/cover-kothao-keu-nei.svg",
  "c1010001-0000-4000-8000-000000000022": "/covers/cover-nokkhotrer-raat.svg",
  "c1010001-0000-4000-8000-000000000023": "/covers/cover-gouripur-junction.svg",
  "c1010001-0000-4000-8000-000000000024": "/covers/cover-dure-kothao.svg",
  "c1010001-0000-4000-8000-000000000025": "/covers/cover-shajghor.svg",
  "c1010001-0000-4000-8000-000000000026": "/covers/cover-basor.svg",
  "c1010001-0000-4000-8000-000000000027": "/covers/cover-bohubrihi.svg",
  "c1010001-0000-4000-8000-000000000028": "/covers/cover-phera.svg",
  "c1010001-0000-4000-8000-000000000029": "/covers/cover-leelaboti.svg",
  "c1010001-0000-4000-8000-000000000030": "/covers/cover-megh-boleche-jabo-jabo.svg",
  "c1010001-0000-4000-8000-000000000031": "/covers/cover-brishti-bilas.svg",
  "c1010001-0000-4000-8000-000000000032": "/covers/cover-dighir-jole-kar-chhaya-go.svg",
  "c1010001-0000-4000-8000-000000000033": "/covers/cover-tetul-bone-jochna.svg",
  "c1010001-0000-4000-8000-000000000034": "/covers/cover-badol-diner-prothom-kodom-ful.svg",
  "c1010001-0000-4000-8000-000000000035": "/covers/cover-badol-diner-ditiyo-kodom-ful.svg",
  "c1010001-0000-4000-8000-000000000036": "/covers/cover-tumi-amay-dekechile-chhutir-nimontrone.svg",
  "c1010001-0000-4000-8000-000000000037": "/covers/cover-aaj-chitrar-biye.svg",
  "c1010001-0000-4000-8000-000000000038": "/covers/cover-aaj-ami-kothao-jabo-na.svg",
  "c1010001-0000-4000-8000-000000000039": "/covers/cover-noboni.svg",
  "c1010001-0000-4000-8000-000000000040": "/covers/cover-nirbashon.svg",
  "c1010001-0000-4000-8000-000000000041": "/covers/cover-priyotomeshu.svg",
  "c1010001-0000-4000-8000-000000000042": "/covers/cover-mrinmoyi.svg",
  "c1010001-0000-4000-8000-000000000043": "/covers/cover-mrinmoyir-mon-bhalo-nei.svg",
  "c1010001-0000-4000-8000-000000000044": "/covers/cover-chander-aloy-koyekjon-jubok.svg",
  "c1010001-0000-4000-8000-000000000045": "/covers/cover-sobai-geche-bone.svg",
  "c1010001-0000-4000-8000-000000000046": "/covers/cover-rupar-palongko.svg",
  "c1010001-0000-4000-8000-000000000047": "/covers/cover-jol-jochna.svg",
  "c1010001-0000-4000-8000-000000000048": "/covers/cover-ekjon-mayaboti.svg",
  "c1010001-0000-4000-8000-000000000049": "/covers/cover-somudra-bilas.svg",
  "c1010001-0000-4000-8000-000000000050": "/covers/cover-ke-kotha-koy.svg",
  "c1010001-0000-4000-8000-000000000051": "/covers/cover-oyomoy.svg",
  "c1010001-0000-4000-8000-000000000052": "/covers/cover-daruchini-dwip.svg",
  "c1010001-0000-4000-8000-000000000053": "/covers/cover-rupali-dwip.svg",
  "c1010001-0000-4000-8000-000000000054": "/covers/cover-bipod.svg",
  "c1010001-0000-4000-8000-000000000055": "/covers/cover-pakhi-amar-ekla-pakhi.svg",
  "c1010001-0000-4000-8000-000000000056": "/covers/cover-akash-jora-megh.svg",
  "c1010001-0000-4000-8000-000000000057": "/covers/cover-ondhokarer-gaan.svg",
  "c1010001-0000-4000-8000-000000000058": "/covers/cover-angul-kata-joglu.svg",
  "c1010001-0000-4000-8000-000000000059": "/covers/cover-ononto-nokkhotro-beethi.svg",
  "c1010001-0000-4000-8000-000000000060": "/covers/cover-ashabori.svg",
  "c1010001-0000-4000-8000-000000000061": "/covers/cover-asmanira-tin-bon.svg",
  "c1010001-0000-4000-8000-000000000062": "/covers/cover-aynaghor.svg",
  "c1010001-0000-4000-8000-000000000063": "/covers/cover-bhoy.svg",
  "c1010001-0000-4000-8000-000000000064": "/covers/cover-ballpoint.svg",
  "c1010001-0000-4000-8000-000000000065": "/covers/cover-brihonnola.svg",
  "c1010001-0000-4000-8000-000000000066": "/covers/cover-chhayabeethi.svg",
  "c1010001-0000-4000-8000-000000000067": "/covers/cover-poka.svg",
  "c1010001-0000-4000-8000-000000000068": "/covers/cover-jadukor.svg",
  "c1010001-0000-4000-8000-000000000069": "/covers/cover-rodonbhora-e-bosonto.svg",
  "c1010001-0000-4000-8000-000000000070": "/covers/cover-tithir-neel-towale.svg",
  "c1010001-0000-4000-8000-000000000071": "/covers/cover-istishon.svg",
  "c1010001-0000-4000-8000-000000000072": "/covers/cover-epitaph.svg",
  "c1010001-0000-4000-8000-000000000073": "/covers/cover-openti-bioscope.svg",
  "c1010001-0000-4000-8000-000000000074": "/covers/cover-badshah-namdar.svg",
  "c1010001-0000-4000-8000-000000000075": "/covers/cover-kohen-kobi-kalidas.svg",
  "c1010001-0000-4000-8000-000000000076": "/covers/cover-omanush.svg",
  "c1010001-0000-4000-8000-000000000077": "/covers/cover-tondrabilas.svg",
  "c1010001-0000-4000-8000-000000000078": "/covers/cover-se-o-nortoki.svg",
  "c1010001-0000-4000-8000-000000000079": "/covers/cover-tomader-jonno-bhalobasha.svg",
  "c1010001-0000-4000-8000-000000000080": "/covers/cover-fiha-somikoron.svg",
  "c1010001-0000-4000-8000-000000000081": "/covers/cover-irina.svg",
  "c1010001-0000-4000-8000-000000000082": "/covers/cover-oniloy-chande.svg",
  "c1010001-0000-4000-8000-000000000083": "/covers/cover-omega-point.svg",
  "c1010001-0000-4000-8000-000000000084": "/covers/cover-tara-tinjon.svg",
  "c1010001-0000-4000-8000-000000000085": "/covers/cover-newton.svg",
  "c1010001-0000-4000-8000-000000000086": "/covers/cover-kudduser-ekdin.svg",
  "c1010001-0000-4000-8000-000000000087": "/covers/cover-bhoot-somogro.svg",
  "c1010001-0000-4000-8000-000000000088": "/covers/cover-amar-priyo-bhoutik-golpo.svg",
  "c1010001-0000-4000-8000-000000000089": "/covers/cover-odbhut-sob-golpo.svg",
  "c1010001-0000-4000-8000-000000000090": "/covers/cover-neel-hati.svg",
  "c1010001-0000-4000-8000-000000000091": "/covers/cover-surjer-din.svg",
  "c1010001-0000-4000-8000-000000000092": "/covers/cover-hijibiji.svg",
  "c1010001-0000-4000-8000-000000000093": "/covers/cover-payer-tolay-khorom.svg",
  "c1010001-0000-4000-8000-000000000094": "/covers/cover-enga.svg",
  "c1010001-0000-4000-8000-000000000095": "/covers/cover-benga.svg",
  "c1010001-0000-4000-8000-000000000096": "/covers/cover-chenga.svg",
  "c1010001-0000-4000-8000-000000000097": "/covers/cover-jokhon-namibe-andhar.svg",
  "c1010001-0000-4000-8000-000000000098": "/covers/cover-darkaker-songsar-kingba-majhe-majhe-tobo-dekha-pai.svg",
  "c1010001-0000-4000-8000-000000000099": "/covers/cover-newyorker-neelakashe-jhokjhoke-rod.svg",

  // Existing Library Books
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
  // 99 Literary Collection Covers
  "নন্দিত নরকে": "/covers/cover-nondito-noroke.svg",
  "শঙ্খনীল কারাগার": "/covers/cover-shonkhonil-karagar.svg",
  "দেবী": "/covers/cover-debi.svg",
  "সৌরভ": "/covers/cover-sowrobh.svg",
  "আমার আছে জল": "/covers/cover-amar-ache-jol.svg",
  "অচিনপুর": "/covers/cover-ochinpur.svg",
  "অপেক্ষা": "/covers/cover-opekkha.svg",
  "অরণ্য": "/covers/cover-oronno.svg",
  "অন্যদিন": "/covers/cover-onnodin.svg",
  "অপরাহ্ন": "/covers/cover-oporahnho.svg",
  "অনিল বাগচীর একদিন": "/covers/cover-onil-bagchir-ekdin.svg",
  "আগুনের পরশমণি": "/covers/cover-agun-er-poroshmoni.svg",
  "শ্যামল ছায়া": "/covers/cover-shyamol-chhaya.svg",
  "১৯৭১": "/covers/cover-ekattor-1971.svg",
  "জোছনা ও জননীর গল্প": "/covers/cover-jochna-o-jononir-golpo.svg",
  "দেয়াল": "/covers/cover-deyal.svg",
  "মধ্যাহ্ন": "/covers/cover-moddhanho.svg",
  "মাতাল হাওয়া": "/covers/cover-matal-hawa.svg",
  "কৃষ্ণপক্ষ": "/covers/cover-krishnopokkho.svg",
  "শ্রাবণ মেঘের দিন": "/covers/cover-shrabon-megher-din.svg",
  "কোথাও কেউ নেই": "/covers/cover-kothao-keu-nei.svg",
  "নক্ষত্রের রাত": "/covers/cover-nokkhotrer-raat.svg",
  "গৌরীপুর জংশন": "/covers/cover-gouripur-junction.svg",
  "দূরে কোথাও": "/covers/cover-dure-kothao.svg",
  "সাজঘর": "/covers/cover-shajghor.svg",
  "বাসর": "/covers/cover-basor.svg",
  "বহুব্রীহি": "/covers/cover-bohubrihi.svg",
  "ফেরা": "/covers/cover-phera.svg",
  "লীলাবতী": "/covers/cover-leelaboti.svg",
  "মেঘ বলেছে যাব যাব": "/covers/cover-megh-boleche-jabo-jabo.svg",
  "বৃষ্টি বিলাস": "/covers/cover-brishti-bilas.svg",
  "দিঘির জলে কার ছায়া গো": "/covers/cover-dighir-jole-kar-chhaya-go.svg",
  "তেঁতুল বনে জোছনা": "/covers/cover-tetul-bone-jochna.svg",
  "বাদল দিনের প্রথম কদম ফুল": "/covers/cover-badol-diner-prothom-kodom-ful.svg",
  "বাদল দিনের দ্বিতীয় কদম ফুল": "/covers/cover-badol-diner-ditiyo-kodom-ful.svg",
  "তুমি আমায় ডেকেছিলে ছুটির নিমন্ত্রণে": "/covers/cover-tumi-amay-dekechile-chhutir-nimontrone.svg",
  "আজ চিত্রার বিয়ে": "/covers/cover-aaj-chitrar-biye.svg",
  "আজ আমি কোথাও যাব না": "/covers/cover-aaj-ami-kothao-jabo-na.svg",
  "নবনী": "/covers/cover-noboni.svg",
  "নির্বাসন": "/covers/cover-nirbashon.svg",
  "প্রিয়তমেষু": "/covers/cover-priyotomeshu.svg",
  "মৃন্ময়ী": "/covers/cover-mrinmoyi.svg",
  "মৃন্ময়ীর মন ভালো নেই": "/covers/cover-mrinmoyir-mon-bhalo-nei.svg",
  "চাঁদের আলোয় কয়েকজন যুবক": "/covers/cover-chander-aloy-koyekjon-jubok.svg",
  "সবাই গেছে বনে": "/covers/cover-sobai-geche-bone.svg",
  "রূপার পালঙ্ক": "/covers/cover-rupar-palongko.svg",
  "জল জোছনা": "/covers/cover-jol-jochna.svg",
  "একজন মায়াবতী": "/covers/cover-ekjon-mayaboti.svg",
  "সমুদ্র বিলাস": "/covers/cover-somudra-bilas.svg",
  "কে কথা কয়": "/covers/cover-ke-kotha-koy.svg",
  "অয়োময়": "/covers/cover-oyomoy.svg",
  "দারুচিনি দ্বীপ": "/covers/cover-daruchini-dwip.svg",
  "রূপালী দ্বীপ": "/covers/cover-rupali-dwip.svg",
  "বিপদ": "/covers/cover-bipod.svg",
  "পাখি আমার একলা পাখি": "/covers/cover-pakhi-amar-ekla-pakhi.svg",
  "আকাশ জোড়া মেঘ": "/covers/cover-akash-jora-megh.svg",
  "অন্ধকারের গান": "/covers/cover-ondhokarer-gaan.svg",
  "আঙুল কাটা জগলু": "/covers/cover-angul-kata-joglu.svg",
  "অনন্ত নক্ষত্রবীথি": "/covers/cover-ononto-nokkhotro-beethi.svg",
  "আশাবরী": "/covers/cover-ashabori.svg",
  "আসমানীরা তিন বোন": "/covers/cover-asmanira-tin-bon.svg",
  "আয়নাঘর": "/covers/cover-aynaghor.svg",
  "ভয়": "/covers/cover-bhoy.svg",
  "বলপয়েন্ট": "/covers/cover-ballpoint.svg",
  "বৃহন্নলা": "/covers/cover-brihonnola.svg",
  "ছায়াবীথি": "/covers/cover-chhayabeethi.svg",
  "পোকা": "/covers/cover-poka.svg",
  "যাদুকর": "/covers/cover-jadukor.svg",
  "রোদনভরা এ বসন্ত": "/covers/cover-rodonbhora-e-bosonto.svg",
  "তিথির নীল তোয়ালে": "/covers/cover-tithir-neel-towale.svg",
  "ইস্টিশন": "/covers/cover-istishon.svg",
  "এপিটাফ": "/covers/cover-epitaph.svg",
  "ওপেনটি বায়োস্কোপ": "/covers/cover-openti-bioscope.svg",
  "বাদশাহ নামদার": "/covers/cover-badshah-namdar.svg",
  "কহেন কবি কালিদাস": "/covers/cover-kohen-kobi-kalidas.svg",
  "অমানুষ": "/covers/cover-omanush.svg",
  "তন্দ্রাবিলাস": "/covers/cover-tondrabilas.svg",
  "সে ও নর্তকী": "/covers/cover-se-o-nortoki.svg",
  "তোমাদের জন্য ভালোবাসা": "/covers/cover-tomader-jonno-bhalobasha.svg",
  "ফিহা সমীকরণ": "/covers/cover-fiha-somikoron.svg",
  "ইরিনা": "/covers/cover-irina.svg",
  "অনিলয় চাঁদে": "/covers/cover-oniloy-chande.svg",
  "ওমেগা পয়েন্ট": "/covers/cover-omega-point.svg",
  "তারা তিনজন": "/covers/cover-tara-tinjon.svg",
  "নিউটন": "/covers/cover-newton.svg",
  "কুদ্দুসের একদিন": "/covers/cover-kudduser-ekdin.svg",
  "ভূতসমগ্র": "/covers/cover-bhoot-somogro.svg",
  "আমার প্রিয় ভৌতিক গল্প": "/covers/cover-amar-priyo-bhoutik-golpo.svg",
  "অদ্ভুত সব গল্প": "/covers/cover-odbhut-sob-golpo.svg",
  "নীল হাতি": "/covers/cover-neel-hati.svg",
  "সূর্যের দিন": "/covers/cover-surjer-din.svg",
  "হিজিবিজি": "/covers/cover-hijibiji.svg",
  "পায়ের তলায় খড়ম": "/covers/cover-payer-tolay-khorom.svg",
  "এংগা": "/covers/cover-enga.svg",
  "বেংগা": "/covers/cover-benga.svg",
  "চেংগা": "/covers/cover-chenga.svg",
  "যখন নামিবে আঁধার": "/covers/cover-jokhon-namibe-andhar.svg",
  "দাঁড়কাকের সংসার কিংবা মাঝে মাঝে তব দেখা পাই": "/covers/cover-darkaker-songsar-kingba-majhe-majhe-tobo-dekha-pai.svg",
  "নিউইয়র্কের নীলাকাশে ঝকঝকে রোদ": "/covers/cover-newyorker-neelakashe-jhokjhoke-rod.svg",

  // Existing Library Books
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

  if (url.startsWith("/covers/")) {
    return url;
  }

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



