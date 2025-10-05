-- Create recordings table
CREATE TABLE IF NOT EXISTS public.recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  transcript_url TEXT,
  duration INTEGER, -- in seconds
  file_size BIGINT, -- in bytes
  status TEXT DEFAULT 'processing', -- processing, ready, failed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  participants_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  is_favorite BOOLEAN DEFAULT false
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_recordings_meeting_id ON public.recordings(meeting_id);
CREATE INDEX IF NOT EXISTS idx_recordings_created_by ON public.recordings(created_by);
CREATE INDEX IF NOT EXISTS idx_recordings_status ON public.recordings(status);
CREATE INDEX IF NOT EXISTS idx_recordings_created_at ON public.recordings(created_at);

-- Enable RLS
ALTER TABLE public.recordings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own recordings" ON public.recordings FOR SELECT USING (
  created_by = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM public.meetings m 
    WHERE m.id = meeting_id 
    AND (m.host_id = auth.uid() OR auth.uid() IN (
      SELECT user_id FROM public.meeting_participants WHERE meeting_id = m.id
    ))
  )
);

CREATE POLICY "Users can insert their own recordings" ON public.recordings FOR INSERT WITH CHECK (
  created_by = auth.uid()
);

CREATE POLICY "Users can update their own recordings" ON public.recordings FOR UPDATE USING (
  created_by = auth.uid()
);

CREATE POLICY "Users can delete their own recordings" ON public.recordings FOR DELETE USING (
  created_by = auth.uid()
);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_recordings_updated_at 
  BEFORE UPDATE ON public.recordings 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();