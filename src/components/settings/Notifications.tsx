import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Notifications = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    email_notifications: true,
    app_notifications: true,
    slack_notifications: false,
    meeting_reminders: true,
    task_reminders: true,
    summary_notifications: true,
    do_not_disturb_start: "",
    do_not_disturb_end: "",
  });

  useEffect(() => {
    loadSettings();

    // Set up real-time subscription for notification settings changes
    const channel = supabase
      .channel('notification_settings_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notification_settings',
        },
        (payload) => {
          setSettings({
            email_notifications: payload.new.email_notifications ?? true,
            app_notifications: payload.new.app_notifications ?? true,
            slack_notifications: payload.new.slack_notifications ?? false,
            meeting_reminders: payload.new.meeting_reminders ?? true,
            task_reminders: payload.new.task_reminders ?? true,
            summary_notifications: payload.new.summary_notifications ?? true,
            do_not_disturb_start: payload.new.do_not_disturb_start || "",
            do_not_disturb_end: payload.new.do_not_disturb_end || "",
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notification_settings',
        },
        (payload) => {
          setSettings({
            email_notifications: payload.new.email_notifications ?? true,
            app_notifications: payload.new.app_notifications ?? true,
            slack_notifications: payload.new.slack_notifications ?? false,
            meeting_reminders: payload.new.meeting_reminders ?? true,
            task_reminders: payload.new.task_reminders ?? true,
            summary_notifications: payload.new.summary_notifications ?? true,
            do_not_disturb_start: payload.new.do_not_disturb_start || "",
            do_not_disturb_end: payload.new.do_not_disturb_end || "",
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
      .from("notification_settings")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setSettings({
        email_notifications: data.email_notifications ?? true,
        app_notifications: data.app_notifications ?? true,
        slack_notifications: data.slack_notifications ?? false,
        meeting_reminders: data.meeting_reminders ?? true,
        task_reminders: data.task_reminders ?? true,
        summary_notifications: data.summary_notifications ?? true,
        do_not_disturb_start: data.do_not_disturb_start || "",
        do_not_disturb_end: data.do_not_disturb_end || "",
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("notification_settings")
        .upsert({
          user_id: user.id,
          ...settings,
          do_not_disturb_start: settings.do_not_disturb_start || null,
          do_not_disturb_end: settings.do_not_disturb_end || null,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({ title: "Notification settings saved successfully" });
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
        <h2 className="text-2xl font-bold mb-6">Notification Channels</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive notifications via email</p>
            </div>
            <Switch
              checked={settings.email_notifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, email_notifications: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>App Notifications</Label>
              <p className="text-sm text-muted-foreground">Show in-app notifications</p>
            </div>
            <Switch
              checked={settings.app_notifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, app_notifications: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Slack Notifications</Label>
              <p className="text-sm text-muted-foreground">Send notifications to Slack</p>
            </div>
            <Switch
              checked={settings.slack_notifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, slack_notifications: checked })
              }
            />
          </div>
        </div>
      </Card>

      <Card className="glass-effect p-6">
        <h2 className="text-2xl font-bold mb-6">Notification Types</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Meeting Reminders</Label>
              <p className="text-sm text-muted-foreground">Reminders for upcoming meetings</p>
            </div>
            <Switch
              checked={settings.meeting_reminders}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, meeting_reminders: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Task Reminders</Label>
              <p className="text-sm text-muted-foreground">Reminders for assigned tasks</p>
            </div>
            <Switch
              checked={settings.task_reminders}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, task_reminders: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Summary Ready</Label>
              <p className="text-sm text-muted-foreground">When meeting summaries are ready</p>
            </div>
            <Switch
              checked={settings.summary_notifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, summary_notifications: checked })
              }
            />
          </div>
        </div>
      </Card>

      <Card className="glass-effect p-6">
        <h2 className="text-2xl font-bold mb-6">Do Not Disturb</h2>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Set a time window when you don't want to receive notifications
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dndStart">Start Time</Label>
              <Input
                id="dndStart"
                type="time"
                value={settings.do_not_disturb_start}
                onChange={(e) => setSettings({ ...settings, do_not_disturb_start: e.target.value })}
                className="glass-effect"
              />
            </div>
            <div>
              <Label htmlFor="dndEnd">End Time</Label>
              <Input
                id="dndEnd"
                type="time"
                value={settings.do_not_disturb_end}
                onChange={(e) => setSettings({ ...settings, do_not_disturb_end: e.target.value })}
                className="glass-effect"
              />
            </div>
          </div>
        </div>
      </Card>

      <Button onClick={handleSave} disabled={loading} className="w-full">
        Save Notification Settings
      </Button>
    </div>
  );
};

export default Notifications;