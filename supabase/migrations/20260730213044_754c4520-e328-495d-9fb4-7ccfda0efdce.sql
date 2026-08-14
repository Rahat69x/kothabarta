ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS genres public.genre_type[] NOT NULL DEFAULT '{}';

UPDATE public.stories SET genres = ARRAY[genre]::public.genre_type[] WHERE cardinality(genres) = 0;

CREATE OR REPLACE FUNCTION public.sync_story_genres()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.genres IS NULL OR cardinality(NEW.genres) = 0 THEN
    NEW.genres := ARRAY[NEW.genre]::public.genre_type[];
  ELSE
    NEW.genre := NEW.genres[1];
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS stories_sync_genres ON public.stories;
CREATE TRIGGER stories_sync_genres
BEFORE INSERT OR UPDATE ON public.stories
FOR EACH ROW EXECUTE FUNCTION public.sync_story_genres();

CREATE INDEX IF NOT EXISTS stories_genres_idx ON public.stories USING GIN (genres);