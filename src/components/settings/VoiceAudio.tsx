import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const VoiceAudio = () => {
  const { toast } = useToast();
  const [noiseSuppression, setNoiseSuppression] = useState(true);
  const [voiceSensitivity, setVoiceSensitivity] = useState([50]);
  const [voiceModel, setVoiceModel] = useState("alloy");
  const [voiceLanguage, setVoiceLanguage] = useState("en");

  useEffect(() => {
    loadVoiceSettings();

    // Set up real-time subscription for voice/audio settings changes
    // Note: In a real implementation, these would be stored in a database table
    // For now, we're just showing the UI state management
  }, []);

  const loadVoiceSettings = async () => {
    // In a real implementation, this would load settings from the database
    // For now, we're using default values
  };

  const saveVoiceSettings = async () => {
    try {
      // In a real implementation, this would save settings to the database
      toast({ title: "Voice/audio settings saved successfully" });
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
        <h2 className="text-2xl font-bold mb-6">Voice Model</h2>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="voiceModel">AI Voice Selection</Label>
            <Select value={voiceModel} onValueChange={setVoiceModel}>
              <SelectTrigger className="glass-effect">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alloy">Alloy (Neutral)</SelectItem>
                <SelectItem value="echo">Echo (Warm)</SelectItem>
                <SelectItem value="fable">Fable (Expressive)</SelectItem>
                <SelectItem value="onyx">Onyx (Deep)</SelectItem>
                <SelectItem value="nova">Nova (Bright)</SelectItem>
                <SelectItem value="shimmer">Shimmer (Clear)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="language">Voice Language</Label>
            <Select value={voiceLanguage} onValueChange={setVoiceLanguage}>
              <SelectTrigger className="glass-effect">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="ja">Japanese</SelectItem>
                <SelectItem value="zh">Chinese</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="glass-effect p-6">
        <h2 className="text-2xl font-bold mb-6">Audio Settings</h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Noise Suppression</Label>
              <p className="text-sm text-muted-foreground">Reduce background noise</p>
            </div>
            <Switch
              checked={noiseSuppression}
              onCheckedChange={setNoiseSuppression}
            />
          </div>

          <div>
            <Label>Voice Command Sensitivity</Label>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-sm text-muted-foreground">Low</span>
              <Slider
                value={voiceSensitivity}
                onValueChange={setVoiceSensitivity}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">High</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="glass-effect p-6">
        <h2 className="text-2xl font-bold mb-6">Audio Testing</h2>
        
        <div className="space-y-4">
          <div>
            <Label>Microphone Test</Label>
            <Button variant="outline" className="mt-2 w-full">
              Test Microphone
            </Button>
          </div>

          <div>
            <Label>Speaker Test</Label>
            <Button variant="outline" className="mt-2 w-full">
              Test Speakers
            </Button>
          </div>
        </div>
      </Card>

      <Button onClick={saveVoiceSettings} className="w-full">
        Save Voice/Audio Settings
      </Button>
    </div>
  );
};

export default VoiceAudio;