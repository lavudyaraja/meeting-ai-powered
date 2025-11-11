-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create folders table
CREATE TABLE IF NOT EXISTS folders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update recordings table with new fields
ALTER TABLE recordings ADD COLUMN IF NOT EXISTS folder_id UUID REFERENCES folders(id) ON DELETE SET NULL;
ALTER TABLE recordings ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE recordings ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- Create transcript_segments table
CREATE TABLE IF NOT EXISTS transcript_segments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recording_id UUID NOT NULL REFERENCES recordings(id) ON DELETE CASCADE,
  speaker_id TEXT NOT NULL,
  speaker_name TEXT NOT NULL,
  text TEXT NOT NULL,
  start_time NUMERIC NOT NULL,
  end_time NUMERIC NOT NULL,
  confidence NUMERIC NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_summaries table
CREATE TABLE IF NOT EXISTS ai_summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recording_id UUID NOT NULL REFERENCES recordings(id) ON DELETE CASCADE,
  executive_summary TEXT NOT NULL,
  key_points TEXT[] NOT NULL,
  sentiment TEXT NOT NULL CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  sentiment_score NUMERIC NOT NULL CHECK (sentiment_score >= 0 AND sentiment_score <= 1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(recording_id)
);

-- Create action_items table
CREATE TABLE IF NOT EXISTS action_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recording_id UUID NOT NULL REFERENCES recordings(id) ON DELETE CASCADE,
  summary_id UUID NOT NULL REFERENCES ai_summaries(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  assignee TEXT NOT NULL,
  assignee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  due_date DATE,
  timestamp NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create decisions table
CREATE TABLE IF NOT EXISTS decisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recording_id UUID NOT NULL REFERENCES recordings(id) ON DELETE CASCADE,
  summary_id UUID NOT NULL REFERENCES ai_summaries(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  timestamp NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create highlights table
CREATE TABLE IF NOT EXISTS highlights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recording_id UUID NOT NULL REFERENCES recordings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  start_time NUMERIC NOT NULL,
  end_time NUMERIC NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('important', 'decision', 'question', 'action', 'bookmark')),
  importance TEXT NOT NULL CHECK (importance IN ('low', 'medium', 'high')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recording_id UUID NOT NULL REFERENCES recordings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  timestamp NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create participants table
CREATE TABLE IF NOT EXISTS participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recording_id UUID NOT NULL REFERENCES recordings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  role TEXT,
  join_time NUMERIC NOT NULL DEFAULT 0,
  leave_time NUMERIC NOT NULL DEFAULT 0,
  speaking_time NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recording_id UUID NOT NULL REFERENCES recordings(id) ON DELETE CASCADE,
  engagement_score NUMERIC NOT NULL DEFAULT 0 CHECK (engagement_score >= 0 AND engagement_score <= 100),
  talk_ratio TEXT NOT NULL DEFAULT '0:0',
  interruptions INTEGER NOT NULL DEFAULT 0,
  questions_asked INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(recording_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_recordings_user_id ON recordings(user_id);
CREATE INDEX IF NOT EXISTS idx_recordings_folder_id ON recordings(folder_id);
CREATE INDEX IF NOT EXISTS idx_recordings_created_at ON recordings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recordings_status ON recordings(status);
CREATE INDEX IF NOT EXISTS idx_recordings_tags ON recordings USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_transcript_segments_recording_id ON transcript_segments(recording_id);
CREATE INDEX IF NOT EXISTS idx_transcript_segments_start_time ON transcript_segments(start_time);

CREATE INDEX IF NOT EXISTS idx_ai_summaries_recording_id ON ai_summaries(recording_id);

CREATE INDEX IF NOT EXISTS idx_action_items_recording_id ON action_items(recording_id);
CREATE INDEX IF NOT EXISTS idx_action_items_summary_id ON action_items(summary_id);
CREATE INDEX IF NOT EXISTS idx_action_items_status ON action_items(status);
CREATE INDEX IF NOT EXISTS idx_action_items_assignee_id ON action_items(assignee_id);

CREATE INDEX IF NOT EXISTS idx_decisions_recording_id ON decisions(recording_id);
CREATE INDEX IF NOT EXISTS idx_decisions_summary_id ON decisions(summary_id);

CREATE INDEX IF NOT EXISTS idx_highlights_recording_id ON highlights(recording_id);
CREATE INDEX IF NOT EXISTS idx_highlights_user_id ON highlights(user_id);
CREATE INDEX IF NOT EXISTS idx_highlights_type ON highlights(type);

CREATE INDEX IF NOT EXISTS idx_comments_recording_id ON comments(recording_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_participants_recording_id ON participants(recording_id);

CREATE INDEX IF NOT EXISTS idx_analytics_recording_id ON analytics(recording_id);

CREATE INDEX IF NOT EXISTS idx_folders_user_id ON folders(user_id);

-- Enable Row Level Security
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcript_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Folders policies
CREATE POLICY "Users can view their own folders" ON folders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own folders" ON folders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own folders" ON folders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own folders" ON folders
  FOR DELETE USING (auth.uid() = user_id);

-- Transcript segments policies
CREATE POLICY "Users can view transcript segments of their recordings" ON transcript_segments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM recordings
      WHERE recordings.id = transcript_segments.recording_id
      AND recordings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert transcript segments for their recordings" ON transcript_segments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM recordings
      WHERE recordings.id = transcript_segments.recording_id
      AND recordings.user_id = auth.uid()
    )
  );

-- AI summaries policies
CREATE POLICY "Users can view AI summaries of their recordings" ON ai_summaries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM recordings
      WHERE recordings.id = ai_summaries.recording_id
      AND recordings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create AI summaries for their recordings" ON ai_summaries
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM recordings
      WHERE recordings.id = ai_summaries.recording_id
      AND recordings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update AI summaries of their recordings" ON ai_summaries
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM recordings
      WHERE recordings.id = ai_summaries.recording_id
      AND recordings.user_id = auth.uid()
    )
  );

-- Action items policies
CREATE POLICY "Users can view action items of their recordings" ON action_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM recordings
      WHERE recordings.id = action_items.recording_id
      AND recordings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create action items for their recordings" ON action_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM recordings
      WHERE recordings.id = action_items.recording_id
      AND recordings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update action items of their recordings" ON action_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM recordings
      WHERE recordings.id = action_items.recording_id
      AND recordings.user_id = auth.uid()
    )
  );

-- Decisions policies
CREATE POLICY "Users can view decisions of their recordings" ON decisions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM recordings
      WHERE recordings.id = decisions.recording_id
      AND recordings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create decisions for their recordings" ON decisions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM recordings
      WHERE recordings.id = decisions.recording_id
      AND recordings.user_id = auth.uid()
    )
  );

-- Highlights policies
CREATE POLICY "Users can view highlights of their recordings" ON highlights
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM recordings
      WHERE recordings.id = highlights.recording_id
      AND recordings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create highlights" ON highlights
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own highlights" ON highlights
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own highlights" ON highlights
  FOR DELETE USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Users can view comments on their recordings" ON comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM recordings
      WHERE recordings.id = comments.recording_id
      AND recordings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON comments
  FOR DELETE USING (auth.uid() = user_id);

-- Participants policies
CREATE POLICY "Users can view participants of their recordings" ON participants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM recordings
      WHERE recordings.id = participants.recording_id
      AND recordings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create participants for their recordings" ON participants
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM recordings
      WHERE recordings.id = participants.recording_id
      AND recordings.user_id = auth.uid()
    )
  );

-- Analytics policies
CREATE POLICY "Users can view analytics of their recordings" ON analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM recordings
      WHERE recordings.id = analytics.recording_id
      AND recordings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create analytics for their recordings" ON analytics
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM recordings
      WHERE recordings.id = analytics.recording_id
      AND recordings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update analytics of their recordings" ON analytics
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM recordings
      WHERE recordings.id = analytics.recording_id
      AND recordings.user_id = auth.uid()
    )
  );

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_folders_updated_at BEFORE UPDATE ON folders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recordings_updated_at BEFORE UPDATE ON recordings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_summaries_updated_at BEFORE UPDATE ON ai_summaries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_action_items_updated_at BEFORE UPDATE ON action_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_analytics_updated_at BEFORE UPDATE ON analytics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to auto-create analytics when recording is created
CREATE OR REPLACE FUNCTION create_default_analytics()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO analytics (recording_id, engagement_score, talk_ratio, interruptions, questions_asked)
  VALUES (NEW.id, 0, '0:0', 0, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_analytics_on_recording AFTER INSERT ON recordings
  FOR EACH ROW EXECUTE FUNCTION create_default_analytics();