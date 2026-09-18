-- Migration: Seed 99 Unique Book Titles with Original Covers
-- Created at: 2026-09-19

DO $$
BEGIN

  -- 01. নন্দিত নরকে
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000001', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'নন্দিত নরকে', '/covers/cover-nondito-noroke.svg', '‘নন্দিত নরকে’ — এক পরিবারের আলো-আঁধারির কথকতা। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'social-drama', ARRAY['social-drama'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-01T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 02. শঙ্খনীল কারাগার
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000002', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'শঙ্খনীল কারাগার', '/covers/cover-shonkhonil-karagar.svg', '‘শঙ্খনীল কারাগার’ — নীল কারাগারের ভেতর মুক্তির তৃষ্ণা। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'social-drama', ARRAY['social-drama'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-02T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 03. দেবী
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000003', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'দেবী', '/covers/cover-debi.svg', '‘দেবী’ — অতিপ্রাকৃতিক রহস্য ও মিসির আলি। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'thriller-mystery', ARRAY['thriller-mystery'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-03T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 04. সৌরভ
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000004', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'সৌরভ', '/covers/cover-sowrobh.svg', '‘সৌরভ’ — হারিয়ে যাওয়া ঘ্রাণের স্মৃতিকথা। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'romance', ARRAY['romance'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-04T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 05. আমার আছে জল
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000005', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'আমার আছে জল', '/covers/cover-amar-ache-jol.svg', '‘আমার আছে জল’ — জলজোছনার প্রেম ও নীরব হাহাকার। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'romance', ARRAY['romance'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-05T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 06. অচিনপুর
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000006', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'অচিনপুর', '/covers/cover-ochinpur.svg', '‘অচিনপুর’ — অচেনা সীমানার মেঠো সুর। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'rural-life', ARRAY['rural-life'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-06T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 07. অপেক্ষা
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000007', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'অপেক্ষা', '/covers/cover-opekkha.svg', '‘অপেক্ষা’ — হারিয়ে যাওয়ার পর ফিরে আসার আকুলতা। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'social-drama', ARRAY['social-drama'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-07T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 08. অরণ্য
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000008', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'অরণ্য', '/covers/cover-oronno.svg', '‘অরণ্য’ — গভীর নিস্তব্ধতার শ্যামল মোহ। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'adventure', ARRAY['adventure'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-08T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 09. অন্যদিন
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000009', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'অন্যদিন', '/covers/cover-onnodin.svg', '‘অন্যদিন’ — নিত্যদিনের মাঝে নতুন ভোর। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'urban-life', ARRAY['urban-life'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-09T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 10. অপরাহ্ন
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000010', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'অপরাহ্ন', '/covers/cover-oporahnho.svg', '‘অপরাহ্ন’ — পড়ন্ত বেলার বিষাদমাখা ছায়া। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'short-stories', ARRAY['short-stories'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-10T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 11. অনিল বাগচীর একদিন
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000011', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'অনিল বাগচীর একদিন', '/covers/cover-onil-bagchir-ekdin.svg', '‘অনিল বাগচীর একদিন’ — একাত্তরের এক ভয়ার্ত যাত্রা। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'liberation-war', ARRAY['liberation-war'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-11T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 12. আগুনের পরশমণি
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000012', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'আগুনের পরশমণি', '/covers/cover-agun-er-poroshmoni.svg', '‘আগুনের পরশমণি’ — রুদ্ধশ্বাস ঢাকা ও গেরিলা আগুন। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'liberation-war', ARRAY['liberation-war'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-12T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 13. শ্যামল ছায়া
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000013', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'শ্যামল ছায়া', '/covers/cover-shyamol-chhaya.svg', '‘শ্যামল ছায়া’ — সবুজ বাংলার মাটিতে মুক্তির শপথ। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'liberation-war', ARRAY['liberation-war'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-13T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 14. ১৯৭১
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000014', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', '১৯৭১', '/covers/cover-ekattor-1971.svg', '‘১৯৭১’ — ইতিহাসের রক্তে রাঙা স্বাধীনতা। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'liberation-war', ARRAY['liberation-war'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-14T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 15. জোছনা ও জননীর গল্প
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000015', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'জোছনা ও জননীর গল্প', '/covers/cover-jochna-o-jononir-golpo.svg', '‘জোছনা ও জননীর গল্প’ — মুক্তিযুদ্ধের মহাকাব্যিক ক্যানভাস। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'historical-fiction', ARRAY['historical-fiction'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-15T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 16. দেয়াল
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000016', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'দেয়াল', '/covers/cover-deyal.svg', '‘দেয়াল’ — ইতিহাসের অলিন্দে রাজনৈতিক চড়াই-উৎরাই। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'nonfiction'], 'nonfiction', ARRAY['nonfiction'::public.genre], 'completed', 'world-history', ARRAY['world-history'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-16T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 17. মধ্যাহ্ন
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000017', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'মধ্যাহ্ন', '/covers/cover-moddhanho.svg', '‘মধ্যাহ্ন’ — বিংশ শতাব্দীর শুরুর দিনগুলি। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'historical-fiction', ARRAY['historical-fiction'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-17T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 18. মাতাল হাওয়া
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000018', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'মাতাল হাওয়া', '/covers/cover-matal-hawa.svg', '‘মাতাল হাওয়া’ — ক্যাম্পাস জীবনের ঝোড়ো বসন্ত। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'school-life', ARRAY['school-life'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-18T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 19. কৃষ্ণপক্ষ
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000019', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'কৃষ্ণপক্ষ', '/covers/cover-krishnopokkho.svg', '‘কৃষ্ণপক্ষ’ — অমাবস্যার অন্ধকারে ভালোবাসার অপেক্ষা। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'social-drama', ARRAY['social-drama'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-19T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 20. শ্রাবণ মেঘের দিন
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000020', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'শ্রাবণ মেঘের দিন', '/covers/cover-shrabon-megher-din.svg', '‘শ্রাবণ মেঘের দিন’ — ভাটি অঞ্চলের গান ও বর্ষার প্রেম। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'rural-life', ARRAY['rural-life'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-20T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 21. কোথাও কেউ নেই
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000021', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'কোথাও কেউ নেই', '/covers/cover-kothao-keu-nei.svg', '‘কোথাও কেউ নেই’ — নিঝুম রাতের একাকী পরিভ্রমণ। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'urban-life', ARRAY['urban-life'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-21T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 22. নক্ষত্রের রাত
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000022', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'নক্ষত্রের রাত', '/covers/cover-nokkhotrer-raat.svg', '‘নক্ষত্রের রাত’ — তারাভরা আকাশের নিচের গল্প। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'social-drama', ARRAY['social-drama'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-22T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 23. গৌরীপুর জংশন
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000023', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'গৌরীপুর জংশন', '/covers/cover-gouripur-junction.svg', '‘গৌরীপুর জংশন’ — রেললাইনের ধারের মানুষের আখ্যান। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'short-stories', ARRAY['short-stories'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-23T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 24. দূরে কোথাও
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000024', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'দূরে কোথাও', '/covers/cover-dure-kothao.svg', '‘দূরে কোথাও’ — অচেনা দিগন্তের উদ্দেশ্যে যাত্রা। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'nonfiction'], 'nonfiction', ARRAY['nonfiction'::public.genre], 'completed', 'travel-writing', ARRAY['travel-writing'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-24T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 25. সাজঘর
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000025', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'সাজঘর', '/covers/cover-shajghor.svg', '‘সাজঘর’ — মঞ্চের পেছনে জীবনের দ্বৈত রূপ। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'social-drama', ARRAY['social-drama'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-25T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 26. বাসর
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000026', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'বাসর', '/covers/cover-basor.svg', '‘বাসর’ — প্রথম রাতের স্তব্ধ ব্যাকুলতা। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'romance', ARRAY['romance'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-26T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 27. বহুব্রীহি
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000027', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'বহুব্রীহি', '/covers/cover-bohubrihi.svg', '‘বহুব্রীহি’ — পারিবারিক রসিকতা ও জীবনের বৈচিত্র্য। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'satire', ARRAY['satire'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-27T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 28. ফেরা
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000028', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'ফেরা', '/covers/cover-phera.svg', '‘ফেরা’ — শিকড়ের টানে ফিরে আসার গল্প। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'social-drama', ARRAY['social-drama'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-28T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 29. লীলাবতী
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000029', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'লীলাবতী', '/covers/cover-leelaboti.svg', '‘লীলাবতী’ — নদী ও নারীর অমলিন উপাখ্যান। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'social-drama', ARRAY['social-drama'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-29T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 30. মেঘ বলেছে যাব যাব
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000030', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'মেঘ বলেছে যাব যাব', '/covers/cover-megh-boleche-jabo-jabo.svg', '‘মেঘ বলেছে যাব যাব’ — বর্ষার মেঘ ও বিরহের গান। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'romance', ARRAY['romance'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-30T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 31. বৃষ্টি বিলাস
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000031', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'বৃষ্টি বিলাস', '/covers/cover-brishti-bilas.svg', '‘বৃষ্টি বিলাস’ — ঝুম বৃষ্টির ছোঁয়ায় আত্মমগ্নতা। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'experience'], 'experience', ARRAY['experience'::public.genre], 'completed', 'daily-life', ARRAY['daily-life'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-31T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 32. দিঘির জলে কার ছায়া গো
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000032', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'দিঘির জলে কার ছায়া গো', '/covers/cover-dighir-jole-kar-chhaya-go.svg', '‘দিঘির জলে কার ছায়া গো’ — গভীর দিঘির জলে রহস্যময় প্রতিবিম্ব। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'thriller-mystery', ARRAY['thriller-mystery'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-32T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 33. তেঁতুল বনে জোছনা
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000033', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'তেঁতুল বনে জোছনা', '/covers/cover-tetul-bone-jochna.svg', '‘তেঁতুল বনে জোছনা’ — বুনো গাছপালার ফাঁকে চাঁদের আলো। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'rural-life', ARRAY['rural-life'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-33T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 34. বাদল দিনের প্রথম কদম ফুল
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000034', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'বাদল দিনের প্রথম কদম ফুল', '/covers/cover-badol-diner-prothom-kodom-ful.svg', '‘বাদল দিনের প্রথম কদম ফুল’ — প্রথম কদমের মিষ্টি সুবাস। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'romance', ARRAY['romance'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-34T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 35. বাদল দিনের দ্বিতীয় কদম ফুল
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000035', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'বাদল দিনের দ্বিতীয় কদম ফুল', '/covers/cover-badol-diner-ditiyo-kodom-ful.svg', '‘বাদল দিনের দ্বিতীয় কদম ফুল’ — বৃষ্টিভেজা স্মৃতির দ্বিতীয় অধ্যায়। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'romance', ARRAY['romance'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-35T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 36. তুমি আমায় ডেকেছিলে ছুটির নিমন্ত্রণে
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000036', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'তুমি আমায় ডেকেছিলে ছুটির নিমন্ত্রণে', '/covers/cover-tumi-amay-dekechile-chhutir-nimontrone.svg', '‘তুমি আমায় ডেকেছিলে ছুটির নিমন্ত্রণে’ — ছুটির বিকেলে ভালোবাসার পত্র। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'romance', ARRAY['romance'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-36T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 37. আজ চিত্রার বিয়ে
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000037', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'আজ চিত্রার বিয়ে', '/covers/cover-aaj-chitrar-biye.svg', '‘আজ চিত্রার বিয়ে’ — সানাইয়ের সুরে এক পরিবারের বিদায়। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'social-drama', ARRAY['social-drama'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-37T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 38. আজ আমি কোথাও যাব না
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000038', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'আজ আমি কোথাও যাব না', '/covers/cover-aaj-ami-kothao-jabo-na.svg', '‘আজ আমি কোথাও যাব না’ — ঘরের কোণে নিস্তব্ধ অবসরে। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'experience'], 'experience', ARRAY['experience'::public.genre], 'completed', 'daily-life', ARRAY['daily-life'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-38T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 39. নবনী
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000039', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'নবনী', '/covers/cover-noboni.svg', '‘নবনী’ — নরম অনুভূতির এক মিষ্টি কাহিনী। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'romance', ARRAY['romance'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-39T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 40. নির্বাসন
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000040', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'নির্বাসন', '/covers/cover-nirbashon.svg', '‘নির্বাসন’ — নিঃসঙ্গতার সুদূর দ্বীপে যাত্রা। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'social-drama', ARRAY['social-drama'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-40T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 41. প্রিয়তমেষু
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000041', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'প্রিয়তমেষু', '/covers/cover-priyotomeshu.svg', '‘প্রিয়তমেষু’ — হৃদয়ের গভীরতম প্রেমের চিঠি। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'romance', ARRAY['romance'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-41T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 42. মৃন্ময়ী
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000042', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'মৃন্ময়ী', '/covers/cover-mrinmoyi.svg', '‘মৃন্ময়ী’ — মাটির কন্যার হাসিকান্নার গল্প। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'social-drama', ARRAY['social-drama'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-42T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 43. মৃন্ময়ীর মন ভালো নেই
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000043', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'মৃন্ময়ীর মন ভালো নেই', '/covers/cover-mrinmoyir-mon-bhalo-nei.svg', '‘মৃন্ময়ীর মন ভালো নেই’ — উদাসীন দুপুরের অভিমানী ছায়া। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'social-drama', ARRAY['social-drama'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-43T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 44. চাঁদের আলোয় কয়েকজন যুবক
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000044', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'চাঁদের আলোয় কয়েকজন যুবক', '/covers/cover-chander-aloy-koyekjon-jubok.svg', '‘চাঁদের আলোয় কয়েকজন যুবক’ — তারুণ্যের স্বপ্ন ও নির্ঘুম রাত। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'urban-life', ARRAY['urban-life'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-44T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 45. সবাই গেছে বনে
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000045', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'সবাই গেছে বনে', '/covers/cover-sobai-geche-bone.svg', '‘সবাই গেছে বনে’ — অরণ্য অভিযানের রোমাঞ্চকর ক্ষণ। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'adventure', ARRAY['adventure'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-45T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 46. রূপার পালঙ্ক
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000046', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'রূপার পালঙ্ক', '/covers/cover-rupar-palongko.svg', '‘রূপার পালঙ্ক’ — অভিজাত অতীতের রূপালী জৌলুস। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'historical-fiction', ARRAY['historical-fiction'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-46T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 47. জল জোছনা
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000047', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'জল জোছনা', '/covers/cover-jol-jochna.svg', '‘জল জোছনা’ — জলের বুকে চাঁদের মায়াবী প্রতিবিম্ব। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'romance', ARRAY['romance'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-47T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 48. একজন মায়াবতী
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000048', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'একজন মায়াবতী', '/covers/cover-ekjon-mayaboti.svg', '‘একজন মায়াবতী’ — মায়াবী এক নারীর রহস্যময় উপস্থিতি। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'romance', ARRAY['romance'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-48T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 49. সমুদ্র বিলাস
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000049', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'সমুদ্র বিলাস', '/covers/cover-somudra-bilas.svg', '‘সমুদ্র বিলাস’ — সমুদ্রের বিশালতায় আত্মনিবেদন। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'nonfiction'], 'nonfiction', ARRAY['nonfiction'::public.genre], 'completed', 'travel-writing', ARRAY['travel-writing'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-49T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 50. কে কথা কয়
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000050', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'কে কথা কয়', '/covers/cover-ke-kotha-koy.svg', '‘কে কথা কয়’ — অন্তরের অস্ফুট বাণীর মূর্ছনা। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'social-drama', ARRAY['social-drama'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-50T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 51. অয়োময়
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000051', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'অয়োময়', '/covers/cover-oyomoy.svg', '‘অয়োময়’ — জমিদারির পতন ও লোহার শৃঙ্খল। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'historical-fiction', ARRAY['historical-fiction'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-51T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 52. দারুচিনি দ্বীপ
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000052', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'দারুচিনি দ্বীপ', '/covers/cover-daruchini-dwip.svg', '‘দারুচিনি দ্বীপ’ — স্বপ্নময় প্রবাল দ্বীপে বন্ধুদের যাত্রা। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'adventure', ARRAY['adventure'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-52T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 53. রূপালী দ্বীপ
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000053', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'রূপালী দ্বীপ', '/covers/cover-rupali-dwip.svg', '‘রূপালী দ্বীপ’ — রূপালী বালুচরের নীরব নির্জনতা। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'adventure', ARRAY['adventure'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-53T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 54. বিপদ
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000054', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'বিপদ', '/covers/cover-bipod.svg', '‘বিপদ’ — অন্ধকার চক্রে আটকা পড়ার আতঙ্ক। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'thriller-mystery', ARRAY['thriller-mystery'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-54T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 55. পাখি আমার একলা পাখি
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000055', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'পাখি আমার একলা পাখি', '/covers/cover-pakhi-amar-ekla-pakhi.svg', '‘পাখি আমার একলা পাখি’ — একলা প্রাণের একাকী সুর। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'social-drama', ARRAY['social-drama'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-55T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 56. আকাশ জোড়া মেঘ
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000056', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'আকাশ জোড়া মেঘ', '/covers/cover-akash-jora-megh.svg', '‘আকাশ জোড়া মেঘ’ — দিকচক্রবাল জুড়ে বাদলের ছায়া। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'rural-life', ARRAY['rural-life'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-56T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 57. অন্ধকারের গান
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000057', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'অন্ধকারের গান', '/covers/cover-ondhokarer-gaan.svg', '‘অন্ধকারের গান’ — রাতের নিস্তব্ধতায় রহস্যের সুর। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'thriller-mystery', ARRAY['thriller-mystery'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-57T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 58. আঙুল কাটা জগলু
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000058', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'আঙুল কাটা জগলু', '/covers/cover-angul-kata-joglu.svg', '‘আঙুল কাটা জগলু’ — শহরের আন্ডারওয়ার্ল্ডের দুর্ধর্ষ আখ্যান। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'crime', ARRAY['crime'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-58T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 59. অনন্ত নক্ষত্রবীথি
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000059', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'অনন্ত নক্ষত্রবীথি', '/covers/cover-ononto-nokkhotro-beethi.svg', '‘অনন্ত নক্ষত্রবীথি’ — মহাজাগতিক গ্যালাক্সির দূর সীমান্তে। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'scifi', ARRAY['scifi'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-59T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 60. আশাবরী
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000060', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'আশাবরী', '/covers/cover-ashabori.svg', '‘আশাবরী’ — সুর আর হৃদয়ের গভীর রাগিণী। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'short-stories', ARRAY['short-stories'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-60T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 61. আসমানীরা তিন বোন
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000061', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'আসমানীরা তিন বোন', '/covers/cover-asmanira-tin-bon.svg', '‘আসমানীরা তিন বোন’ — তিন বোনের জীবনের চড়াই-উৎরাই। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'social-drama', ARRAY['social-drama'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-61T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 62. আয়নাঘর
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000062', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'আয়নাঘর', '/covers/cover-aynaghor.svg', '‘আয়নাঘর’ — আয়নায় প্রতিফলিত বহু রূপের ধাঁধা। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'thriller-mystery', ARRAY['thriller-mystery'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-62T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 63. ভয়
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000063', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'ভয়', '/covers/cover-bhoy.svg', '‘ভয়’ — অচেনা অন্ধকারের শীতল কাঁপুনি। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'horror', ARRAY['horror'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-63T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 64. বলপয়েন্ট
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000064', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'বলপয়েন্ট', '/covers/cover-ballpoint.svg', '‘বলপয়েন্ট’ — লেখক জীবনের স্মৃতি ও অনুভূতির কলম। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'nonfiction'], 'nonfiction', ARRAY['nonfiction'::public.genre], 'completed', 'essays', ARRAY['essays'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-64T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 65. বৃহন্নলা
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000065', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'বৃহন্নলা', '/covers/cover-brihonnola.svg', '‘বৃহন্নলা’ — পরিচয়ের সন্ধানে মানুষের অস্তিত্ব। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'social-drama', ARRAY['social-drama'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-65T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 66. ছায়াবীথি
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000066', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'ছায়াবীথি', '/covers/cover-chhayabeethi.svg', '‘ছায়াবীথি’ — গাছের ছায়ায় ঘেরা স্মৃতিপথ। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'rural-life', ARRAY['rural-life'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-66T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 67. পোকা
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000067', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'পোকা', '/covers/cover-poka.svg', '‘পোকা’ — মানুষের মনের ভেতরের ক্ষতিকর পোকা। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'thriller-mystery', ARRAY['thriller-mystery'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-67T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 68. যাদুকর
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000068', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'যাদুকর', '/covers/cover-jadukor.svg', '‘যাদুকর’ — মায়াবী জাদুর অদ্ভুত খেল। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'fantasy', ARRAY['fantasy'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-68T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 69. রোদনভরা এ বসন্ত
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000069', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'রোদনভরা এ বসন্ত', '/covers/cover-rodonbhora-e-bosonto.svg', '‘রোদনভরা এ বসন্ত’ — বসন্তের ফুলে চোখের জলের দাগ। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'romance', ARRAY['romance'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-69T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 70. তিথির নীল তোয়ালে
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000070', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'তিথির নীল তোয়ালে', '/covers/cover-tithir-neel-towale.svg', '‘তিথির নীল তোয়ালে’ — একটি সাধারণ তোয়ালের পেছনে মায়া। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'romance', ARRAY['romance'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-70T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 71. ইস্টিশন
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000071', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'ইস্টিশন', '/covers/cover-istishon.svg', '‘ইস্টিশন’ — আসা-যাওয়ার প্ল্যাটফর্মে জীবনের মেলা। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'short-stories', ARRAY['short-stories'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-71T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 72. এপিটাফ
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000072', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'এপিটাফ', '/covers/cover-epitaph.svg', '‘এপিটাফ’ — স্মৃতিফলকে খোদাই করা শেষ কথা। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'social-drama', ARRAY['social-drama'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-72T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 73. ওপেনটি বায়োস্কোপ
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000073', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'ওপেনটি বায়োস্কোপ', '/covers/cover-openti-bioscope.svg', '‘ওপেনটি বায়োস্কোপ’ — শৈশবের দুরন্ত আনন্দ ও স্মৃতিকথা। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'school-life', ARRAY['school-life'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-73T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 74. বাদশাহ নামদার
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000074', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'বাদশাহ নামদার', '/covers/cover-badshah-namdar.svg', '‘বাদশাহ নামদার’ — মোগল সম্রাট হুমায়ুনের বিচিত্র জীবন। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'historical-fiction', ARRAY['historical-fiction'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-74T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 75. কহেন কবি কালিদাস
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000075', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'কহেন কবি কালিদাস', '/covers/cover-kohen-kobi-kalidas.svg', '‘কহেন কবি কালিদাস’ — প্রাচীন কাব্যের সুরে আধুনিক রসিকতা। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'satire', ARRAY['satire'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-75T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 76. অমানুষ
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000076', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'অমানুষ', '/covers/cover-omanush.svg', '‘অমানুষ’ — ভেতরের হিংস্র সত্তার জাগরণ। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'horror', ARRAY['horror'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-76T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 77. তন্দ্রাবিলাস
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000077', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'তন্দ্রাবিলাস', '/covers/cover-tondrabilas.svg', '‘তন্দ্রাবিলাস’ — অলস দুপুরের আবেশময় ঘুম। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'experience'], 'experience', ARRAY['experience'::public.genre], 'completed', 'life-reflections', ARRAY['life-reflections'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-77T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 78. সে ও নর্তকী
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000078', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'সে ও নর্তকী', '/covers/cover-se-o-nortoki.svg', '‘সে ও নর্তকী’ — ঘুঙুরের ছন্দে বাঁধা প্রেমোপাখ্যান। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'romance', ARRAY['romance'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-78T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 79. তোমাদের জন্য ভালোবাসা
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000079', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'তোমাদের জন্য ভালোবাসা', '/covers/cover-tomader-jonno-bhalobasha.svg', '‘তোমাদের জন্য ভালোবাসা’ — মহাকাশে দূরবর্তী সভ্যতার প্রেম। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'scifi', ARRAY['scifi'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-79T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 80. ফিহা সমীকরণ
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000080', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'ফিহা সমীকরণ', '/covers/cover-fiha-somikoron.svg', '‘ফিহা সমীকরণ’ — গণিতের সূত্রের ভেতর অচেনা পৃথিবী। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'scifi', ARRAY['scifi'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-80T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 81. ইরিনা
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000081', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'ইরিনা', '/covers/cover-irina.svg', '‘ইরিনা’ — ভবিষ্যতের এক রহস্যময়ী নারী। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'scifi', ARRAY['scifi'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-81T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 82. অনিলয় চাঁদে
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000082', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'অনিলয় চাঁদে', '/covers/cover-oniloy-chande.svg', '‘অনিলয় চাঁদে’ — চাঁদের বুকে মানুষের কলোনি। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'scifi', ARRAY['scifi'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-82T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 83. ওমেগা পয়েন্ট
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000083', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'ওমেগা পয়েন্ট', '/covers/cover-omega-point.svg', '‘ওমেগা পয়েন্ট’ — মহাবিশ্বের শেষ পরিণতির ক্ষণ। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'scifi', ARRAY['scifi'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-83T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 84. তারা তিনজন
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000084', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'তারা তিনজন', '/covers/cover-tara-tinjon.svg', '‘তারা তিনজন’ — তিন বিচিত্র বন্ধুর মজাদার কাণ্ড। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'satire', ARRAY['satire'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-84T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 85. নিউটন
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000085', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'নিউটন', '/covers/cover-newton.svg', '‘নিউটন’ — বিজ্ঞানের মহাবিপ্লবী আইজ্যাক নিউটন। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'nonfiction'], 'nonfiction', ARRAY['nonfiction'::public.genre], 'completed', 'science-tech', ARRAY['science-tech'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-85T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 86. কুদ্দুসের একদিন
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000086', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'কুদ্দুসের একদিন', '/covers/cover-kudduser-ekdin.svg', '‘কুদ্দুসের একদিন’ — সাধারণ এক মানুষের অদ্ভুত দিন। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'satire', ARRAY['satire'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-86T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 87. ভূতসমগ্র
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000087', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'ভূতসমগ্র', '/covers/cover-bhoot-somogro.svg', '‘ভূতসমগ্র’ — গা ছমছমে সব ভূতুড়ে কাহিনীর সমাহার। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'horror', ARRAY['horror'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-87T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 88. আমার প্রিয় ভৌতিক গল্প
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000088', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'আমার প্রিয় ভৌতিক গল্প', '/covers/cover-amar-priyo-bhoutik-golpo.svg', '‘আমার প্রিয় ভৌতিক গল্প’ — মধ্যরাতের গা শিউরে ওঠা গল্প। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'horror', ARRAY['horror'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-88T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 89. অদ্ভুত সব গল্প
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000089', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'অদ্ভুত সব গল্প', '/covers/cover-odbhut-sob-golpo.svg', '‘অদ্ভুত সব গল্প’ — কল্পনার ডানায় উড়ে যাওয়া গল্প। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'fantasy', ARRAY['fantasy'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-89T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 90. নীল হাতি
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000090', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'নীল হাতি', '/covers/cover-neel-hati.svg', '‘নীল হাতি’ — নীল হাতির দেশে রোমাঞ্চকর রূপকথা। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'fantasy', ARRAY['fantasy'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-90T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 91. সূর্যের দিন
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000091', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'সূর্যের দিন', '/covers/cover-surjer-din.svg', '‘সূর্যের দিন’ — কিশোর মনের সোনালী রোদ ও আনন্দ। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'school-life', ARRAY['school-life'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-91T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 92. হিজিবিজি
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000092', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'হিজিবিজি', '/covers/cover-hijibiji.svg', '‘হিজিবিজি’ — হাস্যরসে ভরপুর অদ্ভুত সব কিসসা। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'satire', ARRAY['satire'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-92T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 93. পায়ের তলায় খড়ম
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000093', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'পায়ের তলায় খড়ম', '/covers/cover-payer-tolay-khorom.svg', '‘পায়ের তলায় খড়ম’ — ঐতিহ্যের পদচিহ্ন ও ফেলে আসা দিন। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'nonfiction'], 'nonfiction', ARRAY['nonfiction'::public.genre], 'completed', 'essays', ARRAY['essays'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-93T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 94. এংগা
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000094', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'এংগা', '/covers/cover-enga.svg', '‘এংগা’ — গ্রামের বাঁশবনের কিশোর আখ্যান। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'folk-tales', ARRAY['folk-tales'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-94T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 95. বেংগা
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000095', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'বেংগা', '/covers/cover-benga.svg', '‘বেংগা’ — নদীর চরে ঘুড়ি ওড়ানোর দুরন্তপনা। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'folk-tales', ARRAY['folk-tales'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-95T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 96. চেংগা
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000096', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'চেংগা', '/covers/cover-chenga.svg', '‘চেংগা’ — বটতলার চতুর বালকের লোককাহিনী। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'folk-tales', ARRAY['folk-tales'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-96T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 97. যখন নামিবে আঁধার
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000097', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'যখন নামিবে আঁধার', '/covers/cover-jokhon-namibe-andhar.svg', '‘যখন নামিবে আঁধার’ — সন্ধ্যার আলো ফুরিয়ে এলে রহস্যের আগমন। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'thriller-mystery', ARRAY['thriller-mystery'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-97T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 98. দাঁড়কাকের সংসার কিংবা মাঝে মাঝে তব দেখা পাই
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000098', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'দাঁড়কাকের সংসার কিংবা মাঝে মাঝে তব দেখা পাই', '/covers/cover-darkaker-songsar-kingba-majhe-majhe-tobo-dekha-pai.svg', '‘দাঁড়কাকের সংসার কিংবা মাঝে মাঝে তব দেখা পাই’ — বারান্দায় বসা দাঁড়কাক ও জীবনের দর্শন। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'fiction'], 'fiction', ARRAY['fiction'::public.genre], 'completed', 'short-stories', ARRAY['short-stories'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-98T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

  -- 99. নিউইয়র্কের নীলাকাশে ঝকঝকে রোদ
  INSERT INTO public.stories (id, writer_id, title, cover_url, description, tags, genre, genres, status, category_id, category_ids, is_regional, pen_name_override, is_published, created_at)
  VALUES ('c1010001-0000-4000-8000-000000000099', '00212e97-f3b6-4ad5-921c-ba6ff34ce707', 'নিউইয়র্কের নীলাকাশে ঝকঝকে রোদ', '/covers/cover-newyorker-neelakashe-jhokjhoke-rod.svg', '‘নিউইয়র্কের নীলাকাশে ঝকঝকে রোদ’ — ম্যানহাটনের রোদেলা সকালের স্মৃতিকথা। বাংলা সাহিত্যের অমর কথাশিল্পী হুমায়ূন আহমেদের এক অনন্য সাহিত্যকর্ম।', ARRAY['হুমায়ূন আহমেদ', 'উপন্যাস', 'কালজয়ী', 'nonfiction'], 'nonfiction', ARRAY['nonfiction'::public.genre], 'completed', 'travel-writing', ARRAY['travel-writing'::uuid], false, 'হুমায়ূন আহমেদ', true, '2026-08-99T10:00:00Z')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url;

END $$;