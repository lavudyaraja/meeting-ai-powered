-- Run this SQL in your Supabase SQL editor to add the DELETE policy
-- This will allow meeting hosts to delete their own meetings

CREATE POLICY "Users can delete their meetings"
  ON public.meetings FOR DELETE
  USING (auth.uid() = host_id);