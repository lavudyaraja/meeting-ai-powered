-- Create lesson_plans table
CREATE TABLE IF NOT EXISTS public.lesson_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  content TEXT,
  toc TEXT[],
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.lesson_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their lesson plans"
  ON public.lesson_plans FOR SELECT
  USING (auth.uid() = created_by);

CREATE POLICY "Users can create lesson plans"
  ON public.lesson_plans FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their lesson plans"
  ON public.lesson_plans FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their lesson plans"
  ON public.lesson_plans FOR DELETE
  USING (auth.uid() = created_by);

-- Create whiteboard_notes table
CREATE TABLE IF NOT EXISTS public.whiteboard_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.whiteboard_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their whiteboard notes"
  ON public.whiteboard_notes FOR SELECT
  USING (auth.uid() = created_by);

CREATE POLICY "Users can create whiteboard notes"
  ON public.whiteboard_notes FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their whiteboard notes"
  ON public.whiteboard_notes FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their whiteboard notes"
  ON public.whiteboard_notes FOR DELETE
  USING (auth.uid() = created_by);

-- Add updated_at triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_lesson_plans_updated_at
  BEFORE UPDATE ON public.lesson_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_whiteboard_notes_updated_at
  BEFORE UPDATE ON public.whiteboard_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();