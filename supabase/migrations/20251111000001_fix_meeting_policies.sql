-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their meetings" ON public.meetings;
DROP POLICY IF EXISTS "Users can create meetings" ON public.meetings;
DROP POLICY IF EXISTS "Users can update their meetings" ON public.meetings;
DROP POLICY IF EXISTS "Users can delete their meetings" ON public.meetings;

-- Recreate policies with proper definitions
CREATE POLICY "Users can view their meetings"
  ON public.meetings FOR SELECT
  USING (auth.uid() = host_id);

CREATE POLICY "Users can create meetings"
  ON public.meetings FOR INSERT
  WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Users can update their meetings"
  ON public.meetings FOR UPDATE
  USING (auth.uid() = host_id);

CREATE POLICY "Users can delete their meetings"
  ON public.meetings FOR DELETE
  USING (auth.uid() = host_id);