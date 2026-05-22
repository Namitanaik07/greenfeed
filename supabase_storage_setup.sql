-- Phase 1: Supabase Storage Setup
-- Run these commands in your Supabase SQL Editor to set up the 'task-proofs' storage bucket

-- 1. Create the bucket
insert into storage.buckets (id, name, public)
values ('task-proofs', 'task-proofs', true);

-- 2. Allow authenticated users to upload files to the bucket
create policy "Allow authenticated users to upload proofs"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'task-proofs' );

-- 3. Allow public read access to the proofs (so they can be displayed on dashboards)
create policy "Allow public to view proofs"
on storage.objects for select
to public
using ( bucket_id = 'task-proofs' );

-- 4. Allow users to update their own proofs (optional but good for retries)
create policy "Allow users to update own proofs"
on storage.objects for update
to authenticated
using ( bucket_id = 'task-proofs' and owner = auth.uid() );

-- 5. Allow users to delete their own proofs (optional)
create policy "Allow users to delete own proofs"
on storage.objects for delete
to authenticated
using ( bucket_id = 'task-proofs' and owner = auth.uid() );
