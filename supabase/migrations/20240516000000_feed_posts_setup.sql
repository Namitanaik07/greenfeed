-- ============================================================
-- GreenFeed: Feed Posts Table with Media Support
-- Run this SQL in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- 1. Create the feed_posts table
CREATE TABLE IF NOT EXISTS public.feed_posts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content     TEXT NOT NULL DEFAULT '',
  media_urls  TEXT[] DEFAULT '{}',          -- array of Storage public URLs
  media_types TEXT[] DEFAULT '{}',          -- 'image' or 'video' per URL
  hashtags    TEXT[] DEFAULT '{}',
  geo_lat     DOUBLE PRECISION,
  geo_lng     DOUBLE PRECISION,
  like_count  INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  is_hidden   BOOLEAN DEFAULT FALSE,
  author_name TEXT NOT NULL DEFAULT 'Anonymous',
  author_avatar TEXT,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- 2. Create feed_likes table for tracking who liked what
CREATE TABLE IF NOT EXISTS public.feed_likes (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id   UUID NOT NULL REFERENCES public.feed_posts(id) ON DELETE CASCADE,
  user_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- 3. Create feed_comments table
CREATE TABLE IF NOT EXISTS public.feed_comments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id     UUID NOT NULL REFERENCES public.feed_posts(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  author_name TEXT NOT NULL DEFAULT 'Anonymous',
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 4. Enable Row Level Security
ALTER TABLE public.feed_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_comments ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for feed_posts
CREATE POLICY "Anyone can read visible posts"
  ON public.feed_posts FOR SELECT
  USING (is_hidden = false);

CREATE POLICY "Authenticated users can create posts"
  ON public.feed_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON public.feed_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON public.feed_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 6. RLS Policies for feed_likes
CREATE POLICY "Anyone can read likes"
  ON public.feed_likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can like"
  ON public.feed_likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike"
  ON public.feed_likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 7. RLS Policies for feed_comments
CREATE POLICY "Anyone can read comments"
  ON public.feed_comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can comment"
  ON public.feed_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 8. Enable Realtime on feed_posts
ALTER PUBLICATION supabase_realtime ADD TABLE public.feed_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.feed_comments;

-- 9. Create a storage bucket for feed media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'feed-media',
  'feed-media',
  true,
  52428800,  -- 50MB limit
  ARRAY['image/jpeg','image/png','image/gif','image/webp','video/mp4','video/webm','video/quicktime']
) ON CONFLICT (id) DO NOTHING;

-- 10. Storage policies for feed-media bucket
CREATE POLICY "Anyone can view feed media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'feed-media');

CREATE POLICY "Authenticated users can upload feed media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'feed-media');

CREATE POLICY "Users can delete own feed media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'feed-media' AND (storage.foldername(name))[1] = auth.uid()::text);

-- 11. Index for fast feed queries
CREATE INDEX IF NOT EXISTS idx_feed_posts_created ON public.feed_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feed_posts_user ON public.feed_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_feed_likes_post ON public.feed_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_feed_comments_post ON public.feed_comments(post_id);
