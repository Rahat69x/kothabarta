WITH ranked AS (
  SELECT id, (row_number() OVER (ORDER BY created_at, id) - 1) AS rn
  FROM public.stories
  WHERE genre::text IN ('nonfiction','experience')
)
UPDATE public.stories s
SET cover_url = (ARRAY[
  '/__l5e/assets-v1/00ea3a6b-b564-451d-9852-bffe9e84fced/cover-7.jpg',
  '/__l5e/assets-v1/93ceaedf-4621-48d2-ae96-00e6b0e4d387/cover-8.jpg',
  '/__l5e/assets-v1/58e505e6-a947-4350-ae1a-077e7f34ea28/cover-1.jpg',
  '/__l5e/assets-v1/2ded20dd-d2ea-4a1e-9bc4-2777569f0933/cover-5.jpg'
])[(r.rn % 4) + 1]
FROM ranked r
WHERE s.id = r.id
  AND s.cover_url LIKE '/__l5e/%';