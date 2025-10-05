import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const MeetingPreferences = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    default_duration: 30,
    buffer_time: 5,
    default_platform: "jitsi",
    auto_transcription: true,
    auto_recording: false,
    live_summarization: true,
    speaker_recognition: true,
    real_time_translation: false,
  });

  useEffect(() => {
    loadPreferences();

    // Set up real-time subscription for meeting preferences changes
    const channel = supabase
      .channel('meeting_preferences_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'meeting_preferences',
        },
        (payload) => {
          if (payload.new) {
            setPreferences({
              default_duration: payload.new.default_duration || 30,
              buffer_time: payload.new.buffer_time || 5,
              default_platform: payload.new.default_platform || "jitsi",
              auto_transcription: payload.new.auto_transcription ?? true,
              auto_recording: payload.new.auto_recording ?? false,
              live_summarization: payload.new.live_summarization ?? true,
              speaker_recognition: payload.new.speaker_recognition ?? true,
              real_time_translation: payload.new.real_time_translation ?? false,
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'meeting_preferences',
        },
        (payload) => {
          if (payload.new) {
            setPreferences({
              default_duration: payload.new.default_duration || 30,
              buffer_time: payload.new.buffer_time || 5,
              default_platform: payload.new.default_platform || "jitsi",
              auto_transcription: payload.new.auto_transcription ?? true,
              auto_recording: payload.new.auto_recording ?? false,
              live_summarization: payload.new.live_summarization ?? true,
              speaker_recognition: payload.new.speaker_recognition ?? true,
              real_time_translation: payload.new.real_time_translation ?? false,
            });
          }
        }
      )
      .subscribe();

    // Clean up subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("meeting_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      if (data) {
        setPreferences({
          default_duration: data.default_duration || 30,
          buffer_time: data.buffer_time || 5,
          default_platform: data.default_platform || "jitsi",
          auto_transcription: data.auto_transcription ?? true,
          auto_recording: data.auto_recording ?? false,
          live_summarization: data.live_summarization ?? true,
          speaker_recognition: data.speaker_recognition ?? true,
          real_time_translation: data.real_time_translation ?? false,
        });
      }
    } catch (error: any) {
      console.error("Error loading preferences:", error);
      toast({
        title: "Error loading preferences",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("meeting_preferences")
        .upsert({
          user_id: user.id,
          ...preferences,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({ title: "Meeting preferences saved successfully" });
    } catch (error: any) {
      toast({
        title: "Error saving preferences",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="glass-effect p-6">
        <h2 className="text-2xl font-bold mb-6">Meeting Defaults</h2>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Default Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={preferences.default_duration}
                onChange={(e) => setPreferences({ ...preferences, default_duration: parseInt(e.target.value) || 30 })}
                className="glass-effect"
              />
            </div>
            <div>
              <Label htmlFor="buffer">Buffer Time (minutes)</Label>
              <Input
                id="buffer"
                type="number"
                value={preferences.buffer_time}
                onChange={(e) => setPreferences({ ...preferences, buffer_time: parseInt(e.target.value) || 5 })}
                className="glass-effect"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="platform">Default Video Platform</Label>
            <Select
              value={preferences.default_platform}
              onValueChange={(value) => setPreferences({ ...preferences, default_platform: value })}
            >
              <SelectTrigger className="glass-effect">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jitsi">Jitsi Meet (Built-in)</SelectItem>
                <SelectItem value="zoom">Zoom</SelectItem>
                <SelectItem value="meet">Google Meet</SelectItem>
                <SelectItem value="teams">Microsoft Teams</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="glass-effect p-6">
        <h2 className="text-2xl font-bold mb-6">AI Features</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Auto Transcription</Label>
              <p className="text-sm text-muted-foreground">Automatically transcribe meetings in real-time</p>
            </div>
            <Switch
              checked={preferences.auto_transcription}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, auto_transcription: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Auto Recording</Label>
              <p className="text-sm text-muted-foreground">Automatically record all meetings</p>
            </div>
            <Switch
              checked={preferences.auto_recording}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, auto_recording: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Live Summarization</Label>
              <p className="text-sm text-muted-foreground">Generate AI summaries during meetings</p>
            </div>
            <Switch
              checked={preferences.live_summarization}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, live_summarization: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Speaker Recognition</Label>
              <p className="text-sm text-muted-foreground">Identify and label speakers automatically</p>
            </div>
            <Switch
              checked={preferences.speaker_recognition}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, speaker_recognition: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Real-time Translation</Label>
              <p className="text-sm text-muted-foreground">Translate conversations in real-time</p>
            </div>
            <Switch
              checked={preferences.real_time_translation}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, real_time_translation: checked })
              }
            />
          </div>
        </div>
      </Card>

      <Button onClick={handleSave} disabled={loading} className="w-full">
        Save Preferences
      </Button>
    </div>
  );
};

export default MeetingPreferences;