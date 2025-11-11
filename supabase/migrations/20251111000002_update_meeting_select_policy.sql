-- Update the SELECT policy to allow users to see meetings they've been invited to
DROP POLICY IF EXISTS "Users can view their meetings" ON public.meetings;

CREATE POLICY "Users can view their meetings"
  ON public.meetings FOR SELECT
  USING (
    auth.uid() = host_id OR 
    id IN (SELECT meeting_id FROM public.meeting_participants WHERE user_id = auth.uid())
  );