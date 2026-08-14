
CREATE TYPE public.genre_type AS ENUM ('fiction','nonfiction','experience');
CREATE TYPE public.story_status AS ENUM ('ongoing','completed','hiatus');

CREATE TABLE public.writer_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  handle TEXT NOT NULL UNIQUE,
  real_name TEXT,
  default_pen_name TEXT,
  use_pen_name BOOLEAN NOT NULL DEFAULT false,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.writer_profiles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.writer_profiles TO authenticated;
GRANT ALL ON public.writer_profiles TO service_role;
ALTER TABLE public.writer_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles public read" ON public.writer_profiles FOR SELECT USING (true);
CREATE POLICY "own profile insert" ON public.writer_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile update" ON public.writer_profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name_bn TEXT NOT NULL,
  name_en TEXT NOT NULL,
  genre_type public.genre_type NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon;
GRANT SELECT ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories public read" ON public.categories FOR SELECT USING (true);

CREATE TABLE public.stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  writer_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  cover_url TEXT,
  description TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  genre public.genre_type NOT NULL DEFAULT 'fiction',
  status public.story_status NOT NULL DEFAULT 'ongoing',
  category_id UUID REFERENCES public.categories ON DELETE SET NULL,
  is_regional BOOLEAN NOT NULL DEFAULT false,
  pen_name_override TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ON public.stories (writer_id);
CREATE INDEX ON public.stories (category_id);
GRANT SELECT ON public.stories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stories TO authenticated;
GRANT ALL ON public.stories TO service_role;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "published stories readable" ON public.stories FOR SELECT USING (is_published OR auth.uid() = writer_id);
CREATE POLICY "writer inserts own stories" ON public.stories FOR INSERT TO authenticated WITH CHECK (auth.uid() = writer_id);
CREATE POLICY "writer updates own stories" ON public.stories FOR UPDATE TO authenticated USING (auth.uid() = writer_id) WITH CHECK (auth.uid() = writer_id);
CREATE POLICY "writer deletes own stories" ON public.stories FOR DELETE TO authenticated USING (auth.uid() = writer_id);

CREATE TABLE public.parts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID NOT NULL REFERENCES public.stories ON DELETE CASCADE,
  part_number INTEGER NOT NULL DEFAULT 1,
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  word_count INTEGER NOT NULL DEFAULT 0,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  is_draft BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ON public.parts (story_id);
GRANT SELECT ON public.parts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.parts TO authenticated;
GRANT ALL ON public.parts TO service_role;
ALTER TABLE public.parts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "published parts readable" ON public.parts FOR SELECT USING (
  (NOT is_draft) OR EXISTS (SELECT 1 FROM public.stories s WHERE s.id = story_id AND s.writer_id = auth.uid())
);
CREATE POLICY "writer manages own parts" ON public.parts FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.stories s WHERE s.id = story_id AND s.writer_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.stories s WHERE s.id = story_id AND s.writer_id = auth.uid()));

CREATE TABLE public.likes (
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  story_id UUID NOT NULL REFERENCES public.stories ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, story_id)
);
GRANT SELECT ON public.likes TO anon;
GRANT SELECT, INSERT, DELETE ON public.likes TO authenticated;
GRANT ALL ON public.likes TO service_role;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "likes public read" ON public.likes FOR SELECT USING (true);
CREATE POLICY "own likes insert" ON public.likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own likes delete" ON public.likes FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.bookmarks (
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  story_id UUID NOT NULL REFERENCES public.stories ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, story_id)
);
GRANT SELECT, INSERT, DELETE ON public.bookmarks TO authenticated;
GRANT ALL ON public.bookmarks TO service_role;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own bookmarks read" ON public.bookmarks FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own bookmarks insert" ON public.bookmarks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own bookmarks delete" ON public.bookmarks FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.follows (
  follower_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  writer_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (follower_id, writer_id)
);
GRANT SELECT ON public.follows TO anon;
GRANT SELECT, INSERT, DELETE ON public.follows TO authenticated;
GRANT ALL ON public.follows TO service_role;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "follows public read" ON public.follows FOR SELECT USING (true);
CREATE POLICY "own follows insert" ON public.follows FOR INSERT TO authenticated WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "own follows delete" ON public.follows FOR DELETE TO authenticated USING (auth.uid() = follower_id);

CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  part_id UUID NOT NULL REFERENCES public.parts ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ON public.comments (part_id);
GRANT SELECT ON public.comments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.comments TO authenticated;
GRANT ALL ON public.comments TO service_role;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "comments public read" ON public.comments FOR SELECT USING (true);
CREATE POLICY "own comments insert" ON public.comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own comments delete" ON public.comments FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.writer_profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_stories_updated BEFORE UPDATE ON public.stories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_parts_updated BEFORE UPDATE ON public.parts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "covers auth read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'covers');
CREATE POLICY "covers auth upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'covers');
CREATE POLICY "covers owner update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'covers' AND owner = auth.uid());
CREATE POLICY "covers owner delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'covers' AND owner = auth.uid());

INSERT INTO public.categories (slug, name_bn, name_en, genre_type) VALUES
('romance','রোমান্স','Romance','fiction'),
('thriller-mystery','থ্রিলার/রহস্য','Thriller/Mystery','fiction'),
('horror','হরর','Horror','fiction'),
('scifi','কল্পবিজ্ঞান','Sci-Fi','fiction'),
('fantasy','ফ্যান্টাসি','Fantasy','fiction'),
('folk-tales','রূপকথা/লোককথা','Folk Tales','fiction'),
('mythology','পৌরাণিক','Mythology','fiction'),
('historical-fiction','ঐতিহাসিক কল্পকাহিনি','Historical Fiction','fiction'),
('liberation-war','মুক্তিযুদ্ধ','Liberation War Fiction','fiction'),
('social-drama','সামাজিক গল্প','Social Drama','fiction'),
('school-life','স্কুল/ক্যাম্পাস লাইফ','School Life','fiction'),
('rural-life','গ্রামীণ জীবন','Rural Life','fiction'),
('urban-life','শহুরে জীবন','Urban Life','fiction'),
('satire','রম্য/স্যাটায়ার','Satire','fiction'),
('crime','সাসপেন্স/ক্রাইম','Crime','fiction'),
('adventure','অ্যাডভেঞ্চার','Adventure','fiction'),
('poetry','কবিতা','Poetry','fiction'),
('short-stories','ছোটগল্প','Short Stories','fiction'),
('regional-history','ইতিহাস-আঞ্চলিক','Regional History','nonfiction'),
('world-history','ইতিহাস-জাতীয়/আন্তর্জাতিক','National/World History','nonfiction'),
('biography','জীবনী','Biography','nonfiction'),
('self-help','আত্ম-উন্নয়ন','Self Help','nonfiction'),
('political-essays','রাজনীতি','Political Essays','nonfiction'),
('travel-writing','ভ্রমণ কাহিনি','Travel Writing','nonfiction'),
('essays','প্রবন্ধ','Essays','nonfiction'),
('religious','ধর্মীয়','Religious','nonfiction'),
('science-tech','বিজ্ঞান ও প্রযুক্তি','Science & Tech','nonfiction'),
('educational','শিক্ষামূলক','Educational','nonfiction'),
('daily-life','দৈনন্দিন জীবন','Daily Life','experience'),
('life-reflections','জীবনের গল্প','Life Reflections','experience'),
('family-relationships','পরিবার ও সম্পর্ক','Family & Relationships','experience'),
('work-life','কর্মজীবন','Work Life','experience'),
('health-wellbeing','স্বাস্থ্য ও মানসিক সুস্থতা','Health & Wellbeing','experience');
