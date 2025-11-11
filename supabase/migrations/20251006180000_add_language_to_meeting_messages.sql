-- Add language column to meeting_messages table
ALTER TABLE public.meeting_messages ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en';

-- Update existing records to have a default language
UPDATE public.meeting_messages SET language = 'en' WHERE language IS NULL;

-- Create index for better performance on language column
CREATE INDEX IF NOT EXISTS meeting_messages_language_idx ON public.meeting_messages (language);