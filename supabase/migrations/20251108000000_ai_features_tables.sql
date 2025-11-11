-- Create table for meeting translations
create table if not exists meeting_translations (
  id uuid default gen_random_uuid() primary key,
  meeting_id uuid not null,
  speaker text not null,
  original_text text not null,
  translated_text text not null,
  source_language text not null,
  target_language text not null,
  created_at timestamp with time zone default now()
);

-- Create table for meeting notes
create table if not exists meeting_notes (
  id uuid default gen_random_uuid() primary key,
  meeting_id uuid not null,
  content text not null,
  created_at timestamp with time zone default now()
);

-- Create table for QA suggestions
create table if not exists qa_suggestions (
  id uuid default gen_random_uuid() primary key,
  meeting_id uuid not null,
  question text not null,
  answer text not null,
  category text not null,
  created_at timestamp with time zone default now()
);

-- Add indexes for better query performance
create index if not exists idx_meeting_translations_meeting_id on meeting_translations(meeting_id);
create index if not exists idx_meeting_notes_meeting_id on meeting_notes(meeting_id);
create index if not exists idx_qa_suggestions_meeting_id on qa_suggestions(meeting_id);