-- Migration: Create Tasks and Task Claims schema for GreenFeed
-- This script creates the necessary tables for Phase 1: Core Task System

-- Create enum for task categories
CREATE TYPE task_category AS ENUM ('cleanup', 'segregation', 'planting', 'awareness');

-- Create enum for task status
CREATE TYPE task_status AS ENUM ('draft', 'published', 'completed', 'expired');

-- Create enum for task claim status
CREATE TYPE claim_status AS ENUM ('claimed', 'pending_verification', 'approved', 'rejected');

-- Tasks Table
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category task_category NOT NULL,
    location_lat DECIMAL(9,6),
    location_lng DECIMAL(9,6),
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    max_claimants INTEGER NOT NULL DEFAULT 1,
    points_reward INTEGER NOT NULL DEFAULT 10,
    status task_status NOT NULL DEFAULT 'published',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Task Claims Table (tracks users claiming and completing tasks)
CREATE TABLE IF NOT EXISTS public.task_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status claim_status NOT NULL DEFAULT 'claimed',
    proof_image_url TEXT,
    proof_lat DECIMAL(9,6),
    proof_lng DECIMAL(9,6),
    claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submitted_at TIMESTAMP WITH TIME ZONE,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES auth.users(id),
    UNIQUE(task_id, user_id) -- A user can only claim a specific task once
);

-- Enable RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_claims ENABLE ROW LEVEL SECURITY;

-- Policies for tasks
CREATE POLICY "Tasks are viewable by everyone" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Admins can insert tasks" ON public.tasks FOR INSERT WITH CHECK (true); -- Note: In a real app, restrict this to admin role
CREATE POLICY "Admins can update tasks" ON public.tasks FOR UPDATE USING (true); -- Note: Restrict to admin

-- Policies for task_claims
CREATE POLICY "Users can view their own claims" ON public.task_claims FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own claims" ON public.task_claims FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own claims (submit proof)" ON public.task_claims FOR UPDATE USING (auth.uid() = user_id);

-- Create a view for task details including claim counts
CREATE OR REPLACE VIEW task_details AS
SELECT 
    t.*,
    (SELECT count(*) FROM task_claims tc WHERE tc.task_id = t.id) as current_claimants
FROM tasks t;
