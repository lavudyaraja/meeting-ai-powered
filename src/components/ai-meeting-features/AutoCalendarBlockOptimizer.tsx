import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Users, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface CalendarSettings {
  autoBlockEnabled: boolean;
  breakDuration: number; // in minutes
  maxConsecutiveMeetings: number;
  blockBeforeDeadlines: boolean;
  meetingFreeZones: string[]; // e.g., ["12:00-13:00", "17:00-18:00"]
}

interface AdvancedCalendarSettings {
  minFocusBlockDuration: number; // in minutes
  maxFocusBlocksPerDay: number;
  preferredFocusTimeStart: string;
  preferredFocusTimeEnd: string;
  avoidSchedulingBefore: string;
  avoidSchedulingAfter: string;
  enableBufferTime: boolean;
  bufferTimeDuration: number; // in minutes
}

const AutoCalendarBlockOptimizer = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<CalendarSettings>({
    autoBlockEnabled: false,
    breakDuration: 30,
    maxConsecutiveMeetings: 3,
    blockBeforeDeadlines: true,
    meetingFreeZones: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isAdvancedSettingsOpen, setIsAdvancedSettingsOpen] = useState(false);
  const [advancedSettings, setAdvancedSettings] = useState<AdvancedCalendarSettings>({
    minFocusBlockDuration: 60, // in minutes
    maxFocusBlocksPerDay: 3,
    preferredFocusTimeStart: "09:00",
    preferredFocusTimeEnd: "17:00",
    avoidSchedulingBefore: "09:00",
    avoidSchedulingAfter: "18:00",
    enableBufferTime: true,
    bufferTimeDuration: 15, // in minutes
  });

  // Load settings from database
  useEffect(() => {
    const loadSettings = async () => {
      if (!user) return;
      
      try {
        // Load basic calendar settings
        const { data: aiSettings, error: aiSettingsError } = await supabase
          .from("ai_settings")
          .select("*")
          .eq("user_id", user.id)
          .single();
        
        if (aiSettingsError && aiSettingsError.code !== 'PGRST116') { // PGRST116 = no rows returned
          throw aiSettingsError;
        }
        
        if (aiSettings) {
          setSettings({
            autoBlockEnabled: aiSettings.ai_followup_enabled || false,
            breakDuration: aiSettings.summary_detail_level ? parseInt(aiSettings.summary_detail_level) : 30,
            maxConsecutiveMeetings: 3,
            blockBeforeDeadlines: aiSettings.ai_summarizer_enabled || true,
            meetingFreeZones: []
          });
        }

        // Load advanced calendar settings from user_settings table
        const { data: userSettings, error: userSettingsError } = await supabase
          .from("user_settings")
          .select("*")
          .eq("user_id", user.id)
          .single();
        
        if (userSettingsError && userSettingsError.code !== 'PGRST116') { // PGRST116 = no rows returned
          throw userSettingsError;
        }
        
        if (userSettings && userSettings.working_hours_start && userSettings.working_hours_end) {
          setAdvancedSettings({
            minFocusBlockDuration: 60,
            maxFocusBlocksPerDay: 3,
            preferredFocusTimeStart: userSettings.working_hours_start,
            preferredFocusTimeEnd: userSettings.working_hours_end,
            avoidSchedulingBefore: userSettings.working_hours_start,
            avoidSchedulingAfter: userSettings.working_hours_end,
            enableBufferTime: true,
            bufferTimeDuration: 15
          });
        }
      } catch (error) {
        console.error("Error loading settings:", error);
        toast({
          title: "Error",
          description: "Failed to load calendar settings",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, [user, toast]);

  // Save basic settings to database
  const saveSettings = async (newSettings: CalendarSettings) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from("ai_settings")
        .upsert({
          user_id: user.id,
          ai_followup_enabled: newSettings.autoBlockEnabled,
          summary_detail_level: newSettings.breakDuration.toString(),
          ai_summarizer_enabled: newSettings.blockBeforeDeadlines,
          updated_at: new Date().toISOString()
        }, {
          onConflict: "user_id"
        });
      
      if (error) throw error;
      
      setSettings(newSettings);
      toast({
        title: "Success",
        description: "Calendar settings saved successfully"
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save calendar settings",
        variant: "destructive"
      });
    }
  };

  // Save advanced settings to database
  const saveAdvancedSettings = async (newAdvancedSettings: AdvancedCalendarSettings) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from("user_settings")
        .upsert({
          user_id: user.id,
          working_hours_start: newAdvancedSettings.preferredFocusTimeStart,
          working_hours_end: newAdvancedSettings.preferredFocusTimeEnd,
          updated_at: new Date().toISOString()
        }, {
          onConflict: "user_id"
        });
      
      if (error) throw error;
      
      setAdvancedSettings(newAdvancedSettings);
      toast({
        title: "Success",
        description: "Advanced calendar settings saved successfully"
      });
    } catch (error) {
      console.error("Error saving advanced settings:", error);
      toast({
        title: "Error",
        description: "Failed to save advanced calendar settings",
        variant: "destructive"
      });
    }
  };

  const handleToggleChange = (checked: boolean) => {
    const newSettings = { ...settings, autoBlockEnabled: checked };
    saveSettings(newSettings);
  };

  const handleBreakDurationChange = (value: string) => {
    const newSettings = { ...settings, breakDuration: parseInt(value) || 30 };
    saveSettings(newSettings);
  };

  const handleMaxMeetingsChange = (value: string) => {
    const newSettings = { ...settings, maxConsecutiveMeetings: parseInt(value) || 3 };
    saveSettings(newSettings);
  };

  const handleDeadlineToggle = (checked: boolean) => {
    const newSettings = { ...settings, blockBeforeDeadlines: checked };
    saveSettings(newSettings);
  };

  const handleAdvancedSettingsSave = async () => {
    await saveAdvancedSettings(advancedSettings);
    setIsAdvancedSettingsOpen(false);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Auto-Calendar Block Optimizer
          </CardTitle>
          <CardDescription>Loading settings...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Auto-Calendar Block Optimizer
        </CardTitle>
        <CardDescription>
          Automatically blocks focus time on your calendar based on meeting patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Enable Auto-Blocking</h3>
            <p className="text-sm text-muted-foreground">
              Automatically block focus time based on your meeting patterns
            </p>
          </div>
          <Switch
            checked={settings.autoBlockEnabled}
            onCheckedChange={handleToggleChange}
          />
        </div>

        {settings.autoBlockEnabled && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Break Duration (minutes)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={settings.breakDuration}
                  onChange={(e) => handleBreakDurationChange(e.target.value)}
                  className="w-24"
                  min="15"
                  max="120"
                />
                <span className="text-sm text-muted-foreground">
                  Default: 30 minutes
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Max Consecutive Meetings</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={settings.maxConsecutiveMeetings}
                  onChange={(e) => handleMaxMeetingsChange(e.target.value)}
                  className="w-24"
                  min="1"
                  max="10"
                />
                <span className="text-sm text-muted-foreground">
                  After this many meetings, a break will be scheduled
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Block Before Deadlines</h3>
                <p className="text-sm text-muted-foreground">
                  Reserve deep work time before project deadlines
                </p>
              </div>
              <Switch
                checked={settings.blockBeforeDeadlines}
                onCheckedChange={handleDeadlineToggle}
              />
            </div>

            <div className="pt-4">
              <h3 className="font-medium mb-2">Meeting-Free Zones</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Automatically create meeting-free time blocks
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-16 flex flex-col gap-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs">Lunch Hours</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col gap-1">
                  <Users className="h-4 w-4" />
                  <span className="text-xs">Team Focus Time</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4">
          <Button 
            className="w-full" 
            variant="outline" 
            onClick={() => setIsAdvancedSettingsOpen(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Advanced Calendar Settings
          </Button>
        </div>

        {/* Advanced Settings Dialog */}
        <Dialog open={isAdvancedSettingsOpen} onOpenChange={setIsAdvancedSettingsOpen}>
          <DialogContent className="glass-effect max-w-2xl">
            <DialogHeader>
              <DialogTitle>Advanced Calendar Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minFocusBlock">Min Focus Block Duration (minutes)</Label>
                  <Input
                    id="minFocusBlock"
                    type="number"
                    value={advancedSettings.minFocusBlockDuration}
                    onChange={(e) => setAdvancedSettings({
                      ...advancedSettings,
                      minFocusBlockDuration: parseInt(e.target.value) || 60
                    })}
                    className="glass-effect"
                  />
                </div>
                <div>
                  <Label htmlFor="maxFocusBlocks">Max Focus Blocks Per Day</Label>
                  <Input
                    id="maxFocusBlocks"
                    type="number"
                    value={advancedSettings.maxFocusBlocksPerDay}
                    onChange={(e) => setAdvancedSettings({
                      ...advancedSettings,
                      maxFocusBlocksPerDay: parseInt(e.target.value) || 3
                    })}
                    className="glass-effect"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="focusStart">Preferred Focus Time Start</Label>
                  <Input
                    id="focusStart"
                    type="time"
                    value={advancedSettings.preferredFocusTimeStart}
                    onChange={(e) => setAdvancedSettings({
                      ...advancedSettings,
                      preferredFocusTimeStart: e.target.value
                    })}
                    className="glass-effect"
                  />
                </div>
                <div>
                  <Label htmlFor="focusEnd">Preferred Focus Time End</Label>
                  <Input
                    id="focusEnd"
                    type="time"
                    value={advancedSettings.preferredFocusTimeEnd}
                    onChange={(e) => setAdvancedSettings({
                      ...advancedSettings,
                      preferredFocusTimeEnd: e.target.value
                    })}
                    className="glass-effect"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="avoidBefore">Avoid Scheduling Before</Label>
                  <Input
                    id="avoidBefore"
                    type="time"
                    value={advancedSettings.avoidSchedulingBefore}
                    onChange={(e) => setAdvancedSettings({
                      ...advancedSettings,
                      avoidSchedulingBefore: e.target.value
                    })}
                    className="glass-effect"
                  />
                </div>
                <div>
                  <Label htmlFor="avoidAfter">Avoid Scheduling After</Label>
                  <Input
                    id="avoidAfter"
                    type="time"
                    value={advancedSettings.avoidSchedulingAfter}
                    onChange={(e) => setAdvancedSettings({
                      ...advancedSettings,
                      avoidSchedulingAfter: e.target.value
                    })}
                    className="glass-effect"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Buffer Time</Label>
                  <p className="text-sm text-muted-foreground">Add buffer time between meetings</p>
                </div>
                <Switch
                  checked={advancedSettings.enableBufferTime}
                  onCheckedChange={(checked) =>
                    setAdvancedSettings({ ...advancedSettings, enableBufferTime: checked })
                  }
                />
              </div>

              {advancedSettings.enableBufferTime && (
                <div>
                  <Label htmlFor="bufferTime">Buffer Time Duration (minutes)</Label>
                  <Input
                    id="bufferTime"
                    type="number"
                    value={advancedSettings.bufferTimeDuration}
                    onChange={(e) => setAdvancedSettings({
                      ...advancedSettings,
                      bufferTimeDuration: parseInt(e.target.value) || 15
                    })}
                    className="glass-effect"
                    min="5"
                    max="60"
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsAdvancedSettingsOpen(false)}>
                Cancel
              </Button>
              <Button variant="hero" onClick={handleAdvancedSettingsSave}>
                Save Settings
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AutoCalendarBlockOptimizer;