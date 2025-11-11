// types/database.ts
export interface Recording {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  duration: number;
  file_size: number;
  file_url: string;
  thumbnail_url?: string;
  status: 'processing' | 'ready' | 'failed';
  created_at: string;
  updated_at: string;
  is_favorite: boolean;
  views_count: number;
  participants_count: number;
  transcript_url?: string;
  folder_id?: string;
  tags?: string[];
}

export interface TranscriptSegment {
  id: string;
  recording_id: string;
  speaker_id: string;
  speaker_name: string;
  text: string;
  start_time: number;
  end_time: number;
  confidence: number;
  created_at: string;
}

export interface AISummary {
  id: string;
  recording_id: string;
  executive_summary: string;
  key_points: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  sentiment_score: number;
  created_at: string;
  updated_at: string;
}

export interface ActionItem {
  id: string;
  recording_id: string;
  summary_id: string;
  text: string;
  assignee: string;
  assignee_id?: string;
  due_date?: string;
  timestamp: number;
  status: 'pending' | 'in-progress' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface Decision {
  id: string;
  recording_id: string;
  summary_id: string;
  text: string;
  timestamp: number;
  created_at: string;
}

export interface Highlight {
  id: string;
  recording_id: string;
  user_id: string;
  title: string;
  start_time: number;
  end_time: number;
  type: 'important' | 'decision' | 'question' | 'action' | 'bookmark';
  importance: 'low' | 'medium' | 'high';
  notes?: string;
  created_at: string;
}

export interface Comment {
  id: string;
  recording_id: string;
  user_id: string;
  parent_id?: string;
  text: string;
  timestamp?: number;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    email: string;
    full_name?: string;
  };
}

export interface Participant {
  id: string;
  recording_id: string;
  name: string;
  email?: string;
  role?: string;
  join_time: number;
  leave_time: number;
  speaking_time: number;
  created_at: string;
}

export interface Analytics {
  id: string;
  recording_id: string;
  engagement_score: number;
  talk_ratio: string;
  interruptions: number;
  questions_asked: number;
  created_at: string;
  updated_at: string;
}

export interface Folder {
  id: string;
  user_id: string;
  name: string;
  color?: string;
  created_at: string;
  updated_at: string;
}

export interface ShareSettings {
  id: string;
  recording_id: string;
  share_token: string;
  expires_at?: string;
  password?: string;
  allow_download: boolean;
  view_count: number;
  created_at: string;
}