-- 1. Create custom enum with a unique name to avoid type collisions
CREATE TYPE public.glaze_component_layout_type AS ENUM ('M', 'L', 'T');

-- 2. The Isolated Glaze Users Table (Maps to Supabase auth.users UUIDs)
CREATE TABLE public.glaze_users (
    id UUID REFERENCES auth.users(id) ON DELETE RESTRICT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. The Glaze Components Table
CREATE TABLE public.glaze_components (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    author_id UUID REFERENCES public.glaze_users(id) ON DELETE RESTRICT NOT NULL,
    type public.glaze_component_layout_type NOT NULL,
    title VARCHAR(50) NOT NULL,
    physics_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    compiled_code TEXT NOT NULL,
    is_public BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. The Glaze Favorites Table
CREATE TABLE public.glaze_favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.glaze_users(id) ON DELETE CASCADE NOT NULL,
    component_id UUID REFERENCES public.glaze_components(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_glaze_user_favorite UNIQUE (user_id, component_id)
);

-- 5. The Glaze Interaction Logs (Suggestions/Prompts) Table
CREATE TABLE public.glaze_interaction_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.glaze_users(id) ON DELETE RESTRICT NOT NULL,
    component_id UUID REFERENCES public.glaze_components(id) ON DELETE CASCADE NOT NULL,
    prompt_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security (RLS) exclusively on our new tables
ALTER TABLE public.glaze_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.glaze_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.glaze_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.glaze_interaction_logs ENABLE ROW LEVEL SECURITY;

-- Security Policies for Glaze Tables
CREATE POLICY "Glaze Users Public Read" ON public.glaze_users FOR SELECT USING (true);
CREATE POLICY "Glaze Users Self Update" ON public.glaze_users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Glaze Components Read" ON public.glaze_components FOR SELECT USING (is_public = true OR auth.uid() = author_id);
CREATE POLICY "Glaze Components Insert" ON public.glaze_components FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Glaze Components Mutate" ON public.glaze_components FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Glaze Favorites Access" ON public.glaze_favorites FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Glaze Logs Access" ON public.glaze_interaction_logs FOR ALL USING (auth.uid() = user_id);

-- 6. Isolated Sync Trigger Function
CREATE OR REPLACE FUNCTION public.handle_glaze_user_sync()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.glaze_users (id, email, username, name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'user_name', 'glaze_user_' || substring(NEW.id::text from 1 for 6)),
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind the trigger using a unique name
CREATE OR REPLACE TRIGGER on_auth_user_created_glaze
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_glaze_user_sync();

-- 7. OPTION B Routine: Namespaced Ghost Legacy Function
CREATE OR REPLACE FUNCTION public.anonymize_glaze_user_profile(target_user_id UUID)
RETURNS VOID AS $$
DECLARE
    random_hash TEXT;
BEGIN
    random_hash := substring(gen_random_uuid()::text from 1 for 6);

    UPDATE public.glaze_users
    SET 
        email = 'ghost_' || random_hash || '@glaze.ai',
        username = 'glaze_ghost_' || random_hash,
        name = 'Anonymous Creator',
        avatar_url = '/assets/system/default-ghost-avatar.png',
        updated_at = NOW()
    WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- schema.sql
-- Setup file for Supabase PostgreSQL database (Coexistence Mode)
-- Run this in your Supabase SQL editor to scaffold the required tables and user sync triggers.

-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create glaze_users Table
CREATE TABLE IF NOT EXISTS public.glaze_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    username TEXT,
    name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on glaze_users
ALTER TABLE public.glaze_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to profiles" ON public.glaze_users
    FOR SELECT USING (true);

CREATE POLICY "Allow users to update their own profile" ON public.glaze_users
    FOR UPDATE USING (auth.uid() = id);


-- 2. Create glaze_components Table
CREATE TABLE IF NOT EXISTS public.glaze_components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES public.glaze_users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    physics_config JSONB DEFAULT '{}'::jsonb,
    compiled_code TEXT NOT NULL,
    is_public BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on glaze_components
ALTER TABLE public.glaze_components ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to public components" ON public.glaze_components
    FOR SELECT USING (is_public = true);

CREATE POLICY "Allow users to read their own components" ON public.glaze_components
    FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Allow users to insert their own components" ON public.glaze_components
    FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Allow users to update their own components" ON public.glaze_components
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Allow users to delete their own components" ON public.glaze_components
    FOR DELETE USING (auth.uid() = author_id);


-- 3. Create glaze_favorites Table
CREATE TABLE IF NOT EXISTS public.glaze_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.glaze_users(id) ON DELETE CASCADE NOT NULL,
    component_id UUID REFERENCES public.glaze_components(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (user_id, component_id)
);

-- Enable RLS on glaze_favorites
ALTER TABLE public.glaze_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to read their own favorites" ON public.glaze_favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own favorites" ON public.glaze_favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own favorites" ON public.glaze_favorites
    FOR DELETE USING (auth.uid() = user_id);


-- 4. Create glaze_interaction_logs Table
CREATE TABLE IF NOT EXISTS public.glaze_interaction_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.glaze_users(id) ON DELETE CASCADE NOT NULL,
    component_id UUID REFERENCES public.glaze_components(id) ON DELETE CASCADE NOT NULL,
    prompt_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on glaze_interaction_logs
ALTER TABLE public.glaze_interaction_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to read their own interaction logs" ON public.glaze_interaction_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own interaction logs" ON public.glaze_interaction_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);


-- 5. Automatic User Sync Trigger on Sign Up
-- Automatically catches new signups, extracts GitHub metadata, and inserts into public.glaze_users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    github_metadata JSONB;
    v_avatar_url TEXT;
    v_username TEXT;
    v_email TEXT;
    v_name TEXT;
END;
$$;

-- Note: Redefining completely to avoid partial declaration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    github_metadata JSONB;
    v_avatar_url TEXT;
    v_username TEXT;
    v_email TEXT;
    v_name TEXT;
BEGIN
    github_metadata := NEW.raw_user_meta_data;
    
    v_avatar_url := github_metadata->>'avatar_url';
    v_username := COALESCE(
        github_metadata->>'user_name', 
        github_metadata->>'preferred_username', 
        split_part(NEW.email, '@', 1)
    );
    v_email := NEW.email;
    v_name := COALESCE(
        github_metadata->>'full_name', 
        github_metadata->>'name', 
        v_username
    );

    INSERT INTO public.glaze_users (id, email, username, name, avatar_url, created_at)
    VALUES (
        NEW.id,
        v_email,
        v_username,
        v_name,
        v_avatar_url,
        COALESCE(NEW.created_at, now())
    )
    ON CONFLICT (id) DO UPDATE
    SET
        email = EXCLUDED.email,
        username = EXCLUDED.username,
        name = EXCLUDED.name,
        avatar_url = EXCLUDED.avatar_url;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger on auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 6. Anonymization Procedure (Option B Implementation)
-- Overwrites PII data inside glaze_users with safe, generic placeholders without breaking references
CREATE OR REPLACE FUNCTION public.anonymize_user(user_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.glaze_users
    SET
        email = 'deleted_' || substring(user_id::text from 1 for 8) || '@glaze.dev',
        username = 'anon_user_' || substring(user_id::text from 1 for 8),
        name = 'Anonymized User',
        avatar_url = NULL
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
