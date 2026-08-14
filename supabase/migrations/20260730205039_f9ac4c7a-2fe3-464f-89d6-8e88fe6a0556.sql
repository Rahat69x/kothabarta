WITH urls AS (
  SELECT * FROM (VALUES
    (0,'/covers/cover-1.jpg'),
    (1,'/covers/cover-2.jpg'),
    (2,'/covers/cover-3.jpg'),
    (3,'/covers/cover-4.jpg'),
    (4,'/covers/cover-5.jpg'),
    (5,'/covers/cover-6.jpg')
  ) AS v(i, url)
),
ranked AS (
  SELECT id, genre, (row_number() OVER (ORDER BY created_at, id) - 1) AS rn
  FROM public.stories
  WHERE cover_url IS NULL OR cover_url = ''
)
UPDATE public.stories s
SET cover_url = CASE
  WHEN r.genre::text = 'nonfiction' THEN '/covers/cover-7.jpg'
  WHEN r.genre::text = 'experience' THEN '/covers/cover-8.jpg'
  ELSE (SELECT url FROM urls WHERE i = r.rn % 6)
END
FROM ranked r
WHERE s.id = r.id;