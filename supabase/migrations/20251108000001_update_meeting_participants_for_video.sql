-- Update meeting_participants table for video conference functionality
ALTER TABLE public.meeting_participants
ADD COLUMN IF NOT EXISTS user_name TEXT,
ADD COLUMN IF NOT EXISTS joined_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS left_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS is_moderator BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_present BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_meeting_participants_joined_at ON public.meeting_participants(joined_at);
CREATE INDEX IF NOT EXISTS idx_meeting_participants_is_present ON public.meeting_participants(is_present);
CREATE INDEX IF NOT EXISTS idx_meeting_participants_is_moderator ON public.meeting_participants(is_moderator);

-- Update RLS policies to support video conference functionality
DROP POLICY IF EXISTS "Users can view participants in their meetings" ON public.meeting_participants;

CREATE POLICY "Users can view participants in their meetings"
  ON public.meeting_participants FOR SELECT
  USING (
    user_id = auth.uid() OR 
    meeting_id IN (SELECT id FROM public.meetings WHERE host_id = auth.uid()) OR
    meeting_id IN (SELECT meeting_id FROM public.meeting_participants WHERE user_id = auth.uid())
  );

-- Add updated_at trigger
CREATE TRIGGER update_meeting_participants_updated_at 
  BEFORE UPDATE ON public.meeting_participants 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();