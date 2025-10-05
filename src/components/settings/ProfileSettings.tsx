import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";

const ProfileSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    avatar_url: "",
  });
  const [settings, setSettings] = useState({
    theme: "light",
    language: "en",
    timezone: "UTC",
    working_hours_start: "09:00:00",
    working_hours_end: "17:00:00",
  });

  useEffect(() => {
    loadProfile();
    loadSettings();

    // Set up real-time subscription for profile changes
    const profileChannel = supabase
      .channel('profile_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
        },
        (payload) => {
          setProfile({
            full_name: payload.new.full_name || "",
            email: payload.new.email || "",
            avatar_url: payload.new.avatar_url || "",
          });
        }
      )
      .subscribe();

    // Set up real-time subscription for settings changes
    const settingsChannel = supabase
      .channel('settings_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_settings',
        },
        (payload) => {
          setSettings({
            theme: payload.new.theme || "light",
            language: payload.new.language || "en",
            timezone: payload.new.timezone || "UTC",
            working_hours_start: payload.new.working_hours_start || "09:00:00",
            working_hours_end: payload.new.working_hours_end || "17:00:00",
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_settings',
        },
        (payload) => {
          setSettings({
            theme: payload.new.theme || "light",
            language: payload.new.language || "en",
            timezone: payload.new.timezone || "UTC",
            working_hours_start: payload.new.working_hours_start || "09:00:00",
            working_hours_end: payload.new.working_hours_end || "17:00:00",
          });
        }
      )
      .subscribe();

    // Clean up subscriptions
    return () => {
      supabase.removeChannel(profileChannel);
      supabase.removeChannel(settingsChannel);
    };
  }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
      setProfile({
        full_name: data.full_name || "",
        email: data.email || "",
        avatar_url: data.avatar_url || "",
      });
    }
  };

  const loadSettings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setSettings({
        theme: data.theme || "light",
        language: data.language || "en",
        timezone: data.timezone || "UTC",
        working_hours_start: data.working_hours_start || "09:00:00",
        working_hours_end: data.working_hours_end || "17:00:00",
      });
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({ title: "Profile updated successfully" });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("user_settings")
        .upsert({
          user_id: user.id,
          ...settings,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      // Apply theme
      document.documentElement.classList.toggle("dark", settings.theme === "dark");

      toast({ title: "Settings saved successfully" });
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
        <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
        
        <div className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback>{profile.full_name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Photo
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="glass-effect"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={profile.email}
                disabled
                className="glass-effect"
              />
            </div>
          </div>

          <Button onClick={handleSaveProfile} disabled={loading}>
            Save Profile
          </Button>
        </div>
      </Card>

      <Card className="glass-effect p-6">
        <h2 className="text-2xl font-bold mb-6">Appearance & Preferences</h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Dark Mode</Label>
              <p className="text-sm text-muted-foreground">Toggle dark mode theme</p>
            </div>
            <Switch
              checked={settings.theme === "dark"}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, theme: checked ? "dark" : "light" })
              }
            />
          </div>

          <div>
            <Label htmlFor="language">Language</Label>
            <Select
              value={settings.language}
              onValueChange={(value) => setSettings({ ...settings, language: value })}
            >
              <SelectTrigger className="glass-effect">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="zh">Chinese</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="timezone">Timezone</Label>
            <Select
              value={settings.timezone}
              onValueChange={(value) => setSettings({ ...settings, timezone: value })}
            >
              <SelectTrigger className="glass-effect">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="America/New_York">Eastern Time</SelectItem>
                <SelectItem value="America/Chicago">Central Time</SelectItem>
                <SelectItem value="America/Denver">Mountain Time</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                <SelectItem value="Europe/London">London</SelectItem>
                <SelectItem value="Europe/Paris">Paris</SelectItem>
                <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="workStart">Working Hours Start</Label>
              <Input
                id="workStart"
                type="time"
                value={settings.working_hours_start}
                onChange={(e) => setSettings({ ...settings, working_hours_start: e.target.value })}
                className="glass-effect"
              />
            </div>
            <div>
              <Label htmlFor="workEnd">Working Hours End</Label>
              <Input
                id="workEnd"
                type="time"
                value={settings.working_hours_end}
                onChange={(e) => setSettings({ ...settings, working_hours_end: e.target.value })}
                className="glass-effect"
              />
            </div>
          </div>

          <Button onClick={handleSaveSettings} disabled={loading}>
            Save Settings
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProfileSettings;