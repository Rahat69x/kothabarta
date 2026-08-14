ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS category_ids uuid[] NOT NULL DEFAULT '{}';

UPDATE public.stories
SET category_ids = ARRAY[category_id]
WHERE category_id IS NOT NULL AND cardinality(category_ids) = 0;

CREATE INDEX IF NOT EXISTS stories_category_ids_idx ON public.stories USING GIN (category_ids);

CREATE OR REPLACE FUNCTION public.sync_story_categories()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.category_ids IS NOT NULL AND cardinality(NEW.category_ids) > 0 THEN
    NEW.category_id = NEW.category_ids[1];
  ELSIF NEW.category_id IS NOT NULL THEN
    NEW.category_ids = ARRAY[NEW.category_id];
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sync_story_categories_trigger ON public.stories;
CREATE TRIGGER sync_story_categories_trigger
BEFORE INSERT OR UPDATE ON public.stories
FOR EACH ROW EXECUTE FUNCTION public.sync_story_categories();