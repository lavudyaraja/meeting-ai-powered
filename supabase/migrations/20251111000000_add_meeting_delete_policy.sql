-- Add DELETE policy for meetings table
CREATE POLICY "Users can delete their meetings"
  ON public.meetings FOR DELETE
  USING (auth.uid() = host_id);