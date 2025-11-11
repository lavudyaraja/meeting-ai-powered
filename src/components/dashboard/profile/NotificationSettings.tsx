import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Mail, Smartphone } from "lucide-react";

interface NotificationSettingsProps {
  settings: {
    theme: string;
    notifications: boolean;
    email_notifications: boolean;
    push_notifications: boolean;
  };
  setSettings: (settings: any) => void;
  onSave: () => void;
  loading: boolean;
}

const NotificationSettings = ({ settings, setSettings, onSave, loading }: NotificationSettingsProps) => {
  return (
    <div className="space-y-6">
      <Card className="glass-effect p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Bell className="w-6 h-6 text-cyan-400" />
          Notification Preferences
        </h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-lg">Enable Notifications</Label>
              <p className="text-sm text-slate-400">Receive notifications for important updates</p>
            </div>
            <Switch
              checked={settings.notifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, notifications: checked })
              }
            />
          </div>
          
          <div className="border-t border-slate-800 pt-6">
            <h3 className="text-lg font-semibold mb-4">Notification Channels</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-slate-400">Receive notifications via email</p>
                  </div>
                </div>
                <Switch
                  checked={settings.email_notifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, email_notifications: checked })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Smartphone className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-slate-400">Receive push notifications on your devices</p>
                  </div>
                </div>
                <Switch
                  checked={settings.push_notifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, push_notifications: checked })
                  }
                />
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-6">
            <h3 className="text-lg font-semibold mb-4">Meeting Notifications</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Upcoming Meeting Reminders</Label>
                  <p className="text-sm text-slate-400">Get reminders before your meetings start</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>New Meeting Invitations</Label>
                  <p className="text-sm text-slate-400">Notify me when I'm invited to meetings</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Recording Available</Label>
                  <p className="text-sm text-slate-400">Notify me when meeting recordings are ready</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
          
          <Button onClick={onSave} disabled={loading}>
            {loading ? "Saving..." : "Save Notification Settings"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default NotificationSettings;