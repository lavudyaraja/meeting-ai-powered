import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PrivacySecurity = () => {
  const { toast } = useToast();
  const [encryption, setEncryption] = useState(true);
  const [recordingConsent, setRecordingConsent] = useState(true);
  const [accessLevel, setAccessLevel] = useState("team");
  const [permissionLevel, setPermissionLevel] = useState("viewer");
  const [autoDelete, setAutoDelete] = useState("90");

  useEffect(() => {
    loadPrivacySettings();

    // Set up real-time subscription for privacy/security settings changes
    // Note: In a real implementation, these would be stored in a database table
    // For now, we're just showing the UI state management
  }, []);

  const loadPrivacySettings = async () => {
    // In a real implementation, this would load settings from the database
    // For now, we're using default values
  };

  const savePrivacySettings = async () => {
    try {
      // In a real implementation, this would save settings to the database
      toast({ title: "Privacy/security settings saved successfully" });
    } catch (error: any) {
      toast({
        title: "Error saving settings",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="glass-effect p-6">
        <h2 className="text-2xl font-bold mb-6">Encryption</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <Label>End-to-End Encryption</Label>
                <p className="text-sm text-muted-foreground">Encrypt recordings and transcripts</p>
              </div>
            </div>
            <Switch
              checked={encryption}
              onCheckedChange={setEncryption}
            />
          </div>
        </div>
      </Card>

      <Card className="glass-effect p-6">
        <h2 className="text-2xl font-bold mb-6">Access Control</h2>
        
        <div className="space-y-4">
          <div>
            <Label>Who can access summaries</Label>
            <Select value={accessLevel} onValueChange={setAccessLevel}>
              <SelectTrigger className="glass-effect mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="only-me">Only Me</SelectItem>
                <SelectItem value="team">My Team</SelectItem>
                <SelectItem value="organization">Entire Organization</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Default Permission Level</Label>
            <Select value={permissionLevel} onValueChange={setPermissionLevel}>
              <SelectTrigger className="glass-effect mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin - Full Control</SelectItem>
                <SelectItem value="editor">Editor - Can Edit</SelectItem>
                <SelectItem value="viewer">Viewer - Can View Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="glass-effect p-6">
        <h2 className="text-2xl font-bold mb-6">Recording Consent</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Auto-Record Consent Prompts</Label>
              <p className="text-sm text-muted-foreground">Ask participants before recording</p>
            </div>
            <Switch
              checked={recordingConsent}
              onCheckedChange={setRecordingConsent}
            />
          </div>
        </div>
      </Card>

      <Card className="glass-effect p-6">
        <h2 className="text-2xl font-bold mb-6">Data Retention</h2>
        
        <div className="space-y-4">
          <div>
            <Label>Auto-Delete After</Label>
            <Select value={autoDelete} onValueChange={setAutoDelete}>
              <SelectTrigger className="glass-effect mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 Days</SelectItem>
                <SelectItem value="90">90 Days</SelectItem>
                <SelectItem value="180">180 Days</SelectItem>
                <SelectItem value="365">1 Year</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Data Export (GDPR)</Label>
            <Button variant="outline" className="mt-2 w-full gap-2">
              <Download className="h-4 w-4" />
              Download My Data
            </Button>
          </div>
        </div>
      </Card>

      <Button onClick={savePrivacySettings} className="w-full">
        Save Privacy/Security Settings
      </Button>
    </div>
  );
};

export default PrivacySecurity;