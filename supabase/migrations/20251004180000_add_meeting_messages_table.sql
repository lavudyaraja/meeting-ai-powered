-- Create meeting_messages table for video conference chat
CREATE TABLE IF NOT EXISTS public.meeting_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_name TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS meeting_messages_meeting_id_idx ON public.meeting_messages (meeting_id);
CREATE INDEX IF NOT EXISTS meeting_messages_timestamp_idx ON public.meeting_messages (timestamp);

-- Enable RLS
ALTER TABLE public.meeting_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view meeting messages" ON public.meeting_messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.meetings m 
    WHERE m.id = meeting_id 
    AND (m.host_id = auth.uid() OR auth.uid() IN (
      SELECT user_id FROM public.meeting_participants WHERE meeting_id = m.id
    ))
  )
);

CREATE POLICY "Users can insert meeting messages" ON public.meeting_messages FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.meetings m 
    WHERE m.id = meeting_id 
    AND (m.host_id = auth.uid() OR auth.uid() IN (
      SELECT user_id FROM public.meeting_participants WHERE meeting_id = m.id
    ))
  )
);

-- Add updated_at column and trigger
ALTER TABLE public.meeting_messages ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();
CREATE TRIGGER update_meeting_messages_updated_at 
  BEFORE UPDATE ON public.meeting_messages 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();