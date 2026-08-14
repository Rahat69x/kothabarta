WITH urls AS (
  SELECT * FROM (VALUES
    (0,'/__l5e/assets-v1/58e505e6-a947-4350-ae1a-077e7f34ea28/cover-1.jpg'),
    (1,'/__l5e/assets-v1/6999da20-4a71-4a7b-bc02-25e96755e91f/cover-2.jpg'),
    (2,'/__l5e/assets-v1/29946b9c-e2fa-47e1-be1d-081d8627d904/cover-3.jpg'),
    (3,'/__l5e/assets-v1/91d06a14-8a6c-4321-b605-8ac19afbf3c0/cover-4.jpg'),
    (4,'/__l5e/assets-v1/2ded20dd-d2ea-4a1e-9bc4-2777569f0933/cover-5.jpg'),
    (5,'/__l5e/assets-v1/ddd3e1bc-a173-4e22-a791-5855ea9fb0bd/cover-6.jpg')
  ) AS v(i, url)
),
ranked AS (
  SELECT id, genre, (row_number() OVER (ORDER BY created_at, id) - 1) AS rn
  FROM public.stories
  WHERE cover_url IS NULL OR cover_url = ''
)
UPDATE public.stories s
SET cover_url = CASE
  WHEN r.genre::text = 'nonfiction' THEN '/__l5e/assets-v1/00ea3a6b-b564-451d-9852-bffe9e84fced/cover-7.jpg'
  WHEN r.genre::text = 'experience' THEN '/__l5e/assets-v1/93ceaedf-4621-48d2-ae96-00e6b0e4d387/cover-8.jpg'
  ELSE (SELECT url FROM urls WHERE i = r.rn % 6)
END
FROM ranked r
WHERE s.id = r.id;