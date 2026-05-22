-- Phase 2: Supabase Eco Tasks Setup
-- Run these commands in your Supabase SQL Editor to set up the 'eco_tasks' table and its policies

-- 1. Create eco_tasks table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.eco_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    location_name TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    category TEXT DEFAULT 'General',
    difficulty TEXT DEFAULT 'Easy',
    reward_points INTEGER DEFAULT 50,
    status TEXT DEFAULT 'open',
    claimed_by UUID REFERENCES auth.users(id),
    claimed_at TIMESTAMP WITH TIME ZONE,
    submitted_at TIMESTAMP WITH TIME ZONE,
    proof_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Add verification columns (added later)
ALTER TABLE public.eco_tasks ADD COLUMN IF NOT EXISTS proof_lat DOUBLE PRECISION;
ALTER TABLE public.eco_tasks ADD COLUMN IF NOT EXISTS proof_lng DOUBLE PRECISION;
ALTER TABLE public.eco_tasks ADD COLUMN IF NOT EXISTS exif_lat DOUBLE PRECISION;
ALTER TABLE public.eco_tasks ADD COLUMN IF NOT EXISTS exif_lng DOUBLE PRECISION;
ALTER TABLE public.eco_tasks ADD COLUMN IF NOT EXISTS verification_score INTEGER;
ALTER TABLE public.eco_tasks ADD COLUMN IF NOT EXISTS verification_verdict TEXT;

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.eco_tasks ENABLE ROW LEVEL SECURITY;

-- 3. Allow public read access to all tasks (so users can see them on the dashboard)
CREATE POLICY "Allow public read access"
ON public.eco_tasks
FOR SELECT
TO public
USING (true);

-- 4. Allow authenticated users to insert tasks (used by admin dashboard)
CREATE POLICY "Allow authenticated insert"
ON public.eco_tasks
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 5. Allow authenticated users to update tasks (used by admin and users claiming/submitting)
CREATE POLICY "Allow authenticated update"
ON public.eco_tasks
FOR UPDATE
TO authenticated
USING (true);

-- 6. Allow authenticated users to delete tasks (used by admin dashboard)
CREATE POLICY "Allow authenticated delete"
ON public.eco_tasks
FOR DELETE
TO authenticated
USING (true);

-- 8. Enable Realtime for eco_tasks
-- Note: You also need to manually enable realtime for this table in the Supabase Dashboard:
-- Database -> Replication -> Source -> toggle eco_tasks
ALTER PUBLICATION supabase_realtime ADD TABLE public.eco_tasks;
