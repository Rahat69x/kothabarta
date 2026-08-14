WITH ranked AS (
  SELECT id, (row_number() OVER (ORDER BY created_at, id) - 1) AS rn
  FROM public.stories
  WHERE genre::text IN ('nonfiction','experience')
)
UPDATE public.stories s
SET cover_url = (ARRAY[
  '/covers/cover-7.jpg',
  '/covers/cover-8.jpg',
  '/covers/cover-1.jpg',
  '/covers/cover-5.jpg'
])[(r.rn % 4) + 1]
FROM ranked r
WHERE s.id = r.id;