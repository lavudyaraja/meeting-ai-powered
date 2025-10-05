-- Add columns for enhanced meeting features
ALTER TABLE public.meetings
ADD COLUMN IF NOT EXISTS recording_url TEXT,
ADD COLUMN IF NOT EXISTS transcript_url TEXT,
ADD COLUMN IF NOT EXISTS summary TEXT;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_meetings_status ON public.meetings(status);
CREATE INDEX IF NOT EXISTS idx_meetings_host_id ON public.meetings(host_id);
CREATE INDEX IF NOT EXISTS idx_meetings_start_time ON public.meetings(start_time);

-- Add indexes for meeting participants
CREATE INDEX IF NOT EXISTS idx_meeting_participants_meeting_id ON public.meeting_participants(meeting_id);
CREATE INDEX IF NOT EXISTS idx_meeting_participants_user_id ON public.meeting_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_meeting_participants_status ON public.meeting_participants(status);