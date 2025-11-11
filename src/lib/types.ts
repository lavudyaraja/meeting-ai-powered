export interface Meeting {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time?: string;
  host_id: string;
  meeting_link?: string;
  reminder_sent?: boolean; // Made optional since it doesn't exist in DB
  created_at: string;
  updated_at: string;
}

export interface MeetingAttendee {
  id: string;
  meeting_id: string;
  user_id: string;
  status: 'invited' | 'accepted' | 'declined' | 'joined';
  created_at: string;
  // Note: email and name are not directly in meeting_participants table
  // They need to be joined with the profiles table
  email?: string;
  name?: string;
}

export interface ChatMessage {
  id: string;
  meeting_id: string;
  user_id: string;
  user_name: string;
  message: string;
  language: string | null;
  timestamp: string;  // Changed from created_at to match meeting_messages table
  updated_at: string | null;
}

// Since transcripts are stored in the same table as messages,
// we can use the same interface but with a different semantic meaning
export type Transcript = ChatMessage;