import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AIAutomation = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    ai_summarizer_enabled: true,
    summary_detail_level: "detailed",
    ai_followup_enabled: true,
    voice_command_enabled: false,
    voice_keyword: "Hey MeetAI",
  });

  useEffect(() => {
    loadSettings();

    // Set up real-time subscription for AI settings changes
    const channel = supabase
      .channel('ai_settings_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ai_settings',
        },
        (payload) => {
          setSettings({
            ai_summarizer_enabled: payload.new.ai_summarizer_enabled ?? true,
            summary_detail_level: payload.new.summary_detail_level || "detailed",
            ai_followup_enabled: payload.new.ai_followup_enabled ?? true,
            voice_command_enabled: payload.new.voice_command_enabled ?? false,
            voice_keyword: payload.new.voice_keyword || "Hey MeetAI",
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'ai_settings',
        },
        (payload) => {
          setSettings({
            ai_summarizer_enabled: payload.new.ai_summarizer_enabled ?? true,
            summary_detail_level: payload.new.summary_detail_level || "detailed",
            ai_followup_enabled: payload.new.ai_followup_enabled ?? true,
            voice_command_enabled: payload.new.voice_command_enabled ?? false,
            voice_keyword: payload.new.voice_keyword || "Hey MeetAI",
          });
        }
      )
      .subscribe();

    // Clean up subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadSettings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("ai_settings")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setSettings({
        ai_summarizer_enabled: data.ai_summarizer_enabled ?? true,
        summary_detail_level: data.summary_detail_level || "detailed",
        ai_followup_enabled: data.ai_followup_enabled ?? true,
        voice_command_enabled: data.voice_command_enabled ?? false,
        voice_keyword: data.voice_keyword || "Hey MeetAI",
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("ai_settings")
        .upsert({
          user_id: user.id,
          ...settings,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({ title: "AI settings saved successfully" });
    } catch (error: any) {
      toast({
        title: "Error saving settings",
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
        <h2 className="text-2xl font-bold mb-6">AI Summarization</h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable AI Summarizer</Label>
              <p className="text-sm text-muted-foreground">Generate AI summaries for meetings</p>
            </div>
            <Switch
              checked={settings.ai_summarizer_enabled}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, ai_summarizer_enabled: checked })
              }
            />
          </div>

          <div>
            <Label htmlFor="detailLevel">Summary Detail Level</Label>
            <Select
              value={settings.summary_detail_level}
              onValueChange={(value) => setSettings({ ...settings, summary_detail_level: value })}
            >
              <SelectTrigger className="glass-effect">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="brief">Brief - Key points only</SelectItem>
                <SelectItem value="detailed">Detailed - Comprehensive summary</SelectItem>
                <SelectItem value="action-focused">Action-Focused - Tasks and decisions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>AI Follow-up Generation</Label>
              <p className="text-sm text-muted-foreground">Automatically generate follow-up emails</p>
            </div>
            <Switch
              checked={settings.ai_followup_enabled}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, ai_followup_enabled: checked })
              }
            />
          </div>
        </div>
      </Card>

      <Card className="glass-effect p-6">
        <h2 className="text-2xl font-bold mb-6">Voice Commands</h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Voice Commands</Label>
              <p className="text-sm text-muted-foreground">Control meetings with voice</p>
            </div>
            <Switch
              checked={settings.voice_command_enabled}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, voice_command_enabled: checked })
              }
            />
          </div>

          <div>
            <Label htmlFor="keyword">Wake Word</Label>
            <Input
              id="keyword"
              value={settings.voice_keyword}
              onChange={(e) => setSettings({ ...settings, voice_keyword: e.target.value })}
              className="glass-effect"
              placeholder="Hey MeetAI"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Say this phrase to activate voice commands
            </p>
          </div>
        </div>
      </Card>

      <Card className="glass-effect p-6">
        <h2 className="text-2xl font-bold mb-6">Automation Workflows</h2>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Configure automated actions after meetings end
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
              <span className="text-sm">Auto-create tasks in project management tools</span>
              <Switch />
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
              <span className="text-sm">Send summaries to Slack/Teams</span>
              <Switch />
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
              <span className="text-sm">Smart meeting cancellation (AI detects duplicates)</span>
              <Switch />
            </div>
          </div>
        </div>
      </Card>

      <Button onClick={handleSave} disabled={loading} className="w-full">
        Save AI Settings
      </Button>
    </div>
  );
};

export default AIAutomation;