ALTER TABLE public.likes ADD COLUMN IF NOT EXISTS reaction text NOT NULL DEFAULT 'like';
ALTER TABLE public.likes DROP CONSTRAINT IF EXISTS likes_reaction_check;
ALTER TABLE public.likes ADD CONSTRAINT likes_reaction_check CHECK (reaction IN ('like','love','haha','wow','sad','angry'));