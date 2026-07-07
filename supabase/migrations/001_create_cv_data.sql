-- Migration: Create cv_data table for multi-CV management
-- Run this in Supabase SQL Editor

-- 1. Create cv_data table
CREATE TABLE public.cv_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled CV',
  cv_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  cv_settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create indexes for performance
CREATE INDEX idx_cv_data_user_id ON public.cv_data(user_id);
CREATE INDEX idx_cv_data_updated_at ON public.cv_data(updated_at DESC);

-- 3. Enable Row Level Security
ALTER TABLE public.cv_data ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies - Users can only access their own CVs

-- SELECT: Users can view own CVs
CREATE POLICY "Users can view own CVs"
  ON public.cv_data FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Users can create own CVs
CREATE POLICY "Users can insert own CVs"
  ON public.cv_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can update own CVs
CREATE POLICY "Users can update own CVs"
  ON public.cv_data FOR UPDATE
  USING (auth.uid() = user_id);

-- DELETE: Users can delete own CVs
CREATE POLICY "Users can delete own CVs"
  ON public.cv_data FOR DELETE
  USING (auth.uid() = user_id);

-- 5. Admin can view all CVs (for admin dashboard)
CREATE POLICY "Admins can view all CVs"
  ON public.cv_data FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 6. Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_cv_data_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_cv_data_updated_at
  BEFORE UPDATE ON public.cv_data
  FOR EACH ROW
  EXECUTE FUNCTION update_cv_data_updated_at();

-- 7. Ensure only one primary CV per user (optional constraint)
CREATE OR REPLACE FUNCTION ensure_single_primary_cv()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_primary = true THEN
    UPDATE public.cv_data
    SET is_primary = false
    WHERE user_id = NEW.user_id
      AND id != NEW.id
      AND is_primary = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_ensure_single_primary_cv
  BEFORE INSERT OR UPDATE ON public.cv_data
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_primary_cv();