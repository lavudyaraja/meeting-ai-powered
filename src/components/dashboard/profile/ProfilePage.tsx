import { useState, useEffect, useRef } from "react";
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
import { Upload, User, Mail, Phone, MapPin, Calendar, Globe, Lock, Bell, Camera, CreditCard, HelpCircle } from "lucide-react";
import ProfileHeader from "./ProfileHeader";
import ProfileTabs from "./ProfileTabs";
import SecuritySettings from "./SecuritySettings";
import NotificationSettings from "./NotificationSettings";

const ProfilePage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    avatar_url: "",
  });
  const [extendedProfile, setExtendedProfile] = useState({
    phone: "",
    location: "",
    bio: "",
    timezone: "UTC",
    language: "en",
  });
  const [settings, setSettings] = useState({
    theme: "dark",
    notifications: true,
    email_notifications: true,
    push_notifications: true,
  });

  const securityRef = useRef(null);
  const notificationsRef = useRef(null);
  const subscriptionsRef = useRef(null);
  const supportRef = useRef(null);

  useEffect(() => {
    loadProfile();
    loadSettings();

    // Handle hash navigation
    const handleHashChange = () => {
      const hash = window.location.hash;
      switch (hash) {
        case "#security":
          setActiveTab("security");
          setTimeout(() => {
            securityRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 100);
          break;
        case "#notifications":
          setActiveTab("notifications");
          setTimeout(() => {
            notificationsRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 100);
          break;
        case "#subscriptions":
          // For now, we'll redirect to settings since we don't have a subscriptions component yet
          window.location.hash = "";
          window.location.href = "/settings";
          break;
        case "#support":
          // For now, we'll redirect to settings since we don't have a support component yet
          window.location.hash = "";
          window.location.href = "/settings";
          break;
        default:
          break;
      }
    };

    // Check initial hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);

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

    // Clean up subscriptions
    return () => {
      supabase.removeChannel(profileChannel);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // First try to get existing profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileData) {
      setProfile({
        full_name: profileData.full_name || "",
        email: profileData.email || "",
        avatar_url: profileData.avatar_url || "",
      });
    } else {
      // Create new profile if it doesn't exist
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          full_name: user.user_metadata?.full_name || "",
          email: user.email || "",
          avatar_url: user.user_metadata?.avatar_url || "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (!insertError) {
        setProfile({
          full_name: user.user_metadata?.full_name || "",
          email: user.email || "",
          avatar_url: user.user_metadata?.avatar_url || "",
        });
      }
    }
  };

  const loadSettings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // First try to get existing settings
    const { data: settingsData } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (settingsData) {
      setSettings({
        theme: settingsData.theme || "dark",
        notifications: true, // Default values since these fields don't exist in the schema
        email_notifications: true,
        push_notifications: true,
      });
    } else {
      // Create new settings if they don't exist
      const { error: insertError } = await supabase
        .from("user_settings")
        .insert({
          user_id: user.id,
          theme: "dark",
          language: "en",
          timezone: "UTC",
          working_hours_start: "09:00:00",
          working_hours_end: "17:00:00",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (!insertError) {
        setSettings({
          theme: "dark",
          notifications: true,
          email_notifications: true,
          push_notifications: true,
        });
      }
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
          theme: settings.theme,
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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, avatar_url: publicUrl });
      toast({ title: "Avatar updated successfully" });
    } catch (error: any) {
      toast({
        title: "Error updating avatar",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <Card className="glass-effect p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <User className="w-6 h-6 text-cyan-400" />
                Personal Information
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profile.avatar_url} />
                      <AvatarFallback>{profile.full_name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <label className="absolute bottom-0 right-0 bg-cyan-500 rounded-full p-2 cursor-pointer hover:bg-cyan-600 transition-colors">
                      <Camera className="w-4 h-4 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Upload a new avatar</p>
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF (max. 2MB)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  {loading ? "Saving..." : "Save Profile"}
                </Button>
              </div>
            </Card>
          </div>
        );
      case "security":
        return (
          <div ref={securityRef}>
            <SecuritySettings />
          </div>
        );
      case "notifications":
        return (
          <div ref={notificationsRef}>
            <NotificationSettings settings={settings} setSettings={setSettings} onSave={handleSaveSettings} loading={loading} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <ProfileHeader 
        fullName={profile.full_name}
        email={profile.email}
        avatarUrl={profile.avatar_url}
        location={extendedProfile.location}
        joinDate="2023-01-15"
      />
      
      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      {renderTabContent()}
    </div>
  );
};

export default ProfilePage;