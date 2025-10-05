-- Create settings tables
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  theme TEXT DEFAULT 'light',
  language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  working_hours_start TIME DEFAULT '09:00:00',
  working_hours_end TIME DEFAULT '17:00:00',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.meeting_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  default_duration INTEGER DEFAULT 30,
  buffer_time INTEGER DEFAULT 5,
  default_platform TEXT DEFAULT 'jitsi',
  auto_transcription BOOLEAN DEFAULT true,
  auto_recording BOOLEAN DEFAULT false,
  live_summarization BOOLEAN DEFAULT true,
  speaker_recognition BOOLEAN DEFAULT true,
  real_time_translation BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ai_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  ai_summarizer_enabled BOOLEAN DEFAULT true,
  summary_detail_level TEXT DEFAULT 'detailed',
  ai_followup_enabled BOOLEAN DEFAULT true,
  voice_command_enabled BOOLEAN DEFAULT false,
  voice_keyword TEXT DEFAULT 'Hey MeetAI',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email_notifications BOOLEAN DEFAULT true,
  app_notifications BOOLEAN DEFAULT true,
  slack_notifications BOOLEAN DEFAULT false,
  meeting_reminders BOOLEAN DEFAULT true,
  task_reminders BOOLEAN DEFAULT true,
  summary_notifications BOOLEAN DEFAULT true,
  do_not_disturb_start TIME DEFAULT NULL,
  do_not_disturb_end TIME DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.integration_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  integration_type TEXT NOT NULL,
  integration_name TEXT NOT NULL,
  enabled BOOLEAN DEFAULT false,
  auth_token TEXT,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, integration_type, integration_name)
);

-- Enable RLS
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own settings" ON public.user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON public.user_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON public.user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own meeting preferences" ON public.meeting_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own meeting preferences" ON public.meeting_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own meeting preferences" ON public.meeting_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own ai settings" ON public.ai_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own ai settings" ON public.ai_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ai settings" ON public.ai_settings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own notification settings" ON public.notification_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notification settings" ON public.notification_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notification settings" ON public.notification_settings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own integrations" ON public.integration_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own integrations" ON public.integration_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own integrations" ON public.integration_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own integrations" ON public.integration_settings FOR DELETE USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON public.user_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_meeting_preferences_updated_at BEFORE UPDATE ON public.meeting_preferences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ai_settings_updated_at BEFORE UPDATE ON public.ai_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_notification_settings_updated_at BEFORE UPDATE ON public.notification_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_integration_settings_updated_at BEFORE UPDATE ON public.integration_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();