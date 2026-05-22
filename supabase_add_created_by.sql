-- 1. Add created_by column if it doesn't exist
ALTER TABLE public.eco_tasks ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- 2. Enable Real-time replication for the eco_tasks table safely
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'eco_tasks'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.eco_tasks;
  END IF;
END $$;

-- 3. Enable FULL replica identity to ensure correct update/delete replication payload
ALTER TABLE public.eco_tasks REPLICA IDENTITY FULL;
