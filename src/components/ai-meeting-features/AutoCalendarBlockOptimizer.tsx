import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Calendar, 
  Clock, 
  Users, 
  Settings,
  Zap,
  TrendingUp,
  Brain,
  Coffee,
  Moon,
  Sun,
  Target,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Download
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

interface CalendarSettings {
  autoBlockEnabled: boolean;
  breakDuration: number;
  maxConsecutiveMeetings: number;
  blockBeforeDeadlines: boolean;
  meetingFreeZones: TimeZone[];
  aiOptimization: boolean;
}

interface TimeZone {
  id: string;
  name: string;
  start: string;
  end: string;
  enabled: boolean;
}

interface AdvancedCalendarSettings {
  minFocusBlockDuration: number;
  maxFocusBlocksPerDay: number;
  preferredFocusTimeStart: string;
  preferredFocusTimeEnd: string;
  avoidSchedulingBefore: string;
  avoidSchedulingAfter: string;
  enableBufferTime: boolean;
  bufferTimeDuration: number;
  workingDays: string[];
  energyPeakTime: string;
}

interface ScheduleAnalytics {
  totalMeetings: number;
  focusTimeBlocked: number;
  efficiency: number;
  breaksCounted: number;
  overloadDays: number;
}

interface FocusBlock {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  type: string;
  status: 'scheduled' | 'active' | 'completed';
}

const AutoCalendarBlockOptimizer = () => {
  const [settings, setSettings] = useState<CalendarSettings>({
    autoBlockEnabled: false,
    breakDuration: 30,
    maxConsecutiveMeetings: 3,
    blockBeforeDeadlines: true,
    aiOptimization: true,
    meetingFreeZones: [
      { id: '1', name: 'Lunch Break', start: '12:00', end: '13:00', enabled: false },
      { id: '2', name: 'Deep Work Morning', start: '09:00', end: '11:00', enabled: false },
      { id: '3', name: 'Focus Afternoon', start: '14:00', end: '16:00', enabled: false },
      { id: '4', name: 'Wind Down', start: '17:00', end: '18:00', enabled: false }
    ]
  });

  const [advancedSettings, setAdvancedSettings] = useState<AdvancedCalendarSettings>({
    minFocusBlockDuration: 60,
    maxFocusBlocksPerDay: 3,
    preferredFocusTimeStart: "09:00",
    preferredFocusTimeEnd: "17:00",
    avoidSchedulingBefore: "09:00",
    avoidSchedulingAfter: "18:00",
    enableBufferTime: true,
    bufferTimeDuration: 15,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    energyPeakTime: 'morning'
  });

  const [analytics, setAnalytics] = useState<ScheduleAnalytics>({
    totalMeetings: 24,
    focusTimeBlocked: 18,
    efficiency: 78,
    breaksCounted: 12,
    overloadDays: 2
  });

  const [focusBlocks, setFocusBlocks] = useState<FocusBlock[]>([
    {
      id: '1',
      date: 'Today',
      startTime: '09:00',
      endTime: '11:00',
      duration: 120,
      type: 'Deep Work',
      status: 'completed'
    },
    {
      id: '2',
      date: 'Today',
      startTime: '14:00',
      endTime: '15:30',
      duration: 90,
      type: 'Focus Time',
      status: 'active'
    },
    {
      id: '3',
      date: 'Tomorrow',
      startTime: '10:00',
      endTime: '12:00',
      duration: 120,
      type: 'Deep Work',
      status: 'scheduled'
    }
  ]);

  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [isSaving, setIsSaving] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastSync(new Date());
      // Simulate analytics updates
      setAnalytics(prev => ({
        ...prev,
        efficiency: Math.min(100, prev.efficiency + Math.random() * 2 - 1)
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleToggleChange = async (checked: boolean) => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setSettings({ ...settings, autoBlockEnabled: checked });
    setIsSaving(false);
  };

  const handleBreakDurationChange = async (value: string) => {
    const newValue = parseInt(value) || 30;
    setSettings({ ...settings, breakDuration: newValue });
  };

  const handleMaxMeetingsChange = async (value: string) => {
    const newValue = parseInt(value) || 3;
    setSettings({ ...settings, maxConsecutiveMeetings: newValue });
  };

  const handleZoneToggle = (zoneId: string, enabled: boolean) => {
    setSettings({
      ...settings,
      meetingFreeZones: settings.meetingFreeZones.map(zone =>
        zone.id === zoneId ? { ...zone, enabled } : zone
      )
    });
  };

  const handleOptimizeSchedule = async () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);

    // Simulate AI optimization process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setOptimizationProgress(i);
    }

    // Generate optimized focus blocks
    const newBlocks: FocusBlock[] = [
      {
        id: Date.now().toString(),
        date: 'Tomorrow',
        startTime: '09:30',
        endTime: '11:00',
        duration: 90,
        type: 'Deep Work',
        status: 'scheduled'
      },
      {
        id: (Date.now() + 1).toString(),
        date: 'Tomorrow',
        startTime: '15:00',
        endTime: '16:30',
        duration: 90,
        type: 'Focus Time',
        status: 'scheduled'
      }
    ];

    setFocusBlocks([...focusBlocks, ...newBlocks]);
    setIsOptimizing(false);

    // Update analytics
    setAnalytics(prev => ({
      ...prev,
      focusTimeBlocked: prev.focusTimeBlocked + 3,
      efficiency: Math.min(100, prev.efficiency + 5)
    }));
  };

  const handleSaveAdvanced = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSaving(false);
    setIsAdvancedOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'active': return 'bg-blue-500';
      case 'scheduled': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4" />;
      case 'active': return <Zap className="h-4 w-4" />;
      case 'scheduled': return <Calendar className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Card with Gradient Header */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6">
          <CardHeader className="p-0">
            <CardTitle className="flex items-center gap-3 text-blue-50 text-2xl">
              <div className="p-2 bg-blue-400/20 rounded-lg backdrop-blur-sm">
                <Brain className="h-6 w-6" />
              </div>
              AI Calendar Optimizer
            </CardTitle>
            <CardDescription className="text-blue-100/90 text-base mt-2">
              Smart scheduling with real-time optimization powered by AI
            </CardDescription>
          </CardHeader>
        </div>

        <CardContent className="p-6 space-y-6">
          {/* Status Bar */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75"></div>
              </div>
              <div>
                <p className="text-sm font-medium">Live Sync Active</p>
                <p className="text-xs text-muted-foreground">
                  Last updated {lastSync.toLocaleTimeString()}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={handleOptimizeSchedule}
              disabled={isOptimizing}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isOptimizing ? (
                <>
                  <Zap className="h-4 w-4 mr-2 animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Optimize Now
                </>
              )}
            </Button>
          </div>

          {/* Optimization Progress */}
          {isOptimizing && (
            <div className="space-y-2 animate-in slide-in-from-top duration-300">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Analyzing your calendar...</span>
                <span className="text-muted-foreground">{optimizationProgress}%</span>
              </div>
              <Progress value={optimizationProgress} className="h-2" />
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <p className="text-xs font-medium text-blue-900">Meetings</p>
              </div>
              <p className="text-2xl font-bold text-blue-600">{analytics.totalMeetings}</p>
              <p className="text-xs text-blue-700 mt-1">This week</p>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-purple-600" />
                <p className="text-xs font-medium text-purple-900">Focus Hours</p>
              </div>
              <p className="text-2xl font-bold text-purple-600">{analytics.focusTimeBlocked}h</p>
              <p className="text-xs text-purple-700 mt-1">Protected</p>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <p className="text-xs font-medium text-green-900">Efficiency</p>
              </div>
              <p className="text-2xl font-bold text-green-600">{Math.round(analytics.efficiency)}%</p>
              <p className="text-xs text-green-700 mt-1">
                {analytics.efficiency > 75 ? '↑ Great!' : '↓ Improve'}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <Coffee className="h-4 w-4 text-orange-600" />
                <p className="text-xs font-medium text-orange-900">Breaks</p>
              </div>
              <p className="text-2xl font-bold text-orange-600">{analytics.breaksCounted}</p>
              <p className="text-xs text-orange-700 mt-1">Scheduled</p>
            </div>
          </div>

          {/* Main Toggle */}
          <div className="p-4 rounded-lg border-2 border-dashed border-purple-200 bg-gradient-to-r from-purple-50/50 to-pink-50/50">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-600" />
                  Auto-Optimization
                </h3>
                <p className="text-sm text-muted-foreground">
                  AI automatically blocks focus time and manages your schedule
                </p>
              </div>
              <Switch
                checked={settings.autoBlockEnabled}
                onCheckedChange={handleToggleChange}
                className="data-[state=checked]:bg-purple-600"
              />
            </div>
          </div>

          {/* Settings Section */}
          {settings.autoBlockEnabled && (
            <div className="space-y-6 animate-in slide-in-from-top duration-500">
              {/* Break Settings */}
              <div className="space-y-4 p-4 rounded-lg border bg-card">
                <h3 className="font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  Break Management
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="break-duration" className="text-sm">
                      Break Duration
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="break-duration"
                        type="number"
                        value={settings.breakDuration}
                        onChange={(e) => handleBreakDurationChange(e.target.value)}
                        className="w-20"
                        min="15"
                        max="120"
                        step="15"
                      />
                      <span className="text-sm text-muted-foreground">minutes</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-meetings" className="text-sm">
                      Max Consecutive Meetings
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="max-meetings"
                        type="number"
                        value={settings.maxConsecutiveMeetings}
                        onChange={(e) => handleMaxMeetingsChange(e.target.value)}
                        className="w-20"
                        min="1"
                        max="10"
                      />
                      <span className="text-sm text-muted-foreground">meetings</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Block Before Deadlines</p>
                    <p className="text-xs text-muted-foreground">
                      Reserve deep work time before project due dates
                    </p>
                  </div>
                  <Switch
                    checked={settings.blockBeforeDeadlines}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, blockBeforeDeadlines: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="space-y-1">
                    <p className="text-sm font-medium flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      AI Smart Scheduling
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Learn from your patterns and optimize automatically
                    </p>
                  </div>
                  <Switch
                    checked={settings.aiOptimization}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, aiOptimization: checked })
                    }
                  />
                </div>
              </div>

              {/* Meeting-Free Zones */}
              <div className="space-y-4 p-4 rounded-lg border bg-card">
                <h3 className="font-semibold flex items-center gap-2">
                  <Target className="h-4 w-4 text-purple-600" />
                  Protected Time Zones
                </h3>
                <p className="text-sm text-muted-foreground">
                  Block specific times for uninterrupted focus work
                </p>

                <div className="grid gap-3">
                  {settings.meetingFreeZones.map((zone) => (
                    <div
                      key={zone.id}
                      className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                        zone.enabled
                          ? 'border-purple-300 bg-purple-50'
                          : 'border-gray-200 bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              zone.enabled ? 'bg-purple-200' : 'bg-gray-200'
                            }`}
                          >
                            {zone.name.includes('Lunch') && <Coffee className="h-4 w-4" />}
                            {zone.name.includes('Morning') && <Sun className="h-4 w-4" />}
                            {zone.name.includes('Afternoon') && <Clock className="h-4 w-4" />}
                            {zone.name.includes('Wind') && <Moon className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{zone.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {zone.start} - {zone.end}
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={zone.enabled}
                          onCheckedChange={(checked) => handleZoneToggle(zone.id, checked)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Focus Blocks */}
              <div className="space-y-4 p-4 rounded-lg border bg-card">
                <h3 className="font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                  Scheduled Focus Blocks
                </h3>

                <div className="space-y-3">
                  {focusBlocks.map((block) => (
                    <div
                      key={block.id}
                      className="p-4 rounded-lg border bg-gradient-to-r from-gray-100 to-gray-200 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${getStatusColor(
                              block.status
                            )} text-blue-50`}
                          >
                            {getStatusIcon(block.status)}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{block.type}</p>
                            <p className="text-xs text-muted-foreground">
                              {block.date} • {block.startTime} - {block.endTime}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-purple-600">
                            {block.duration} min
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {block.status}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {focusBlocks.filter((b) => b.status === 'scheduled').length === 0 && (
                  <div className="text-center py-6">
                    <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No upcoming focus blocks scheduled
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={handleOptimizeSchedule}
                    >
                      Schedule Focus Time
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Advanced Settings Button */}
          <Button
            className="w-full bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600"
            onClick={() => setIsAdvancedOpen(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Advanced Calendar Settings
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>

      {/* Advanced Settings Dialog */}
      <Dialog open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Settings className="h-6 w-6 text-purple-600" />
              Advanced Calendar Settings
            </DialogTitle>
            <DialogDescription>
              Fine-tune your calendar optimization preferences
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Focus Block Settings */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Focus Block Configuration</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Minimum Block Duration</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={advancedSettings.minFocusBlockDuration}
                      onChange={(e) =>
                        setAdvancedSettings({
                          ...advancedSettings,
                          minFocusBlockDuration: parseInt(e.target.value) || 60
                        })
                      }
                      min="30"
                      max="240"
                      step="15"
                    />
                    <span className="text-sm text-muted-foreground">min</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Max Blocks Per Day</Label>
                  <Input
                    type="number"
                    value={advancedSettings.maxFocusBlocksPerDay}
                    onChange={(e) =>
                      setAdvancedSettings({
                        ...advancedSettings,
                        maxFocusBlocksPerDay: parseInt(e.target.value) || 3
                      })
                    }
                    min="1"
                    max="6"
                  />
                </div>
              </div>
            </div>

            {/* Preferred Focus Time */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Preferred Focus Time Window</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={advancedSettings.preferredFocusTimeStart}
                    onChange={(e) =>
                      setAdvancedSettings({
                        ...advancedSettings,
                        preferredFocusTimeStart: e.target.value
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={advancedSettings.preferredFocusTimeEnd}
                    onChange={(e) =>
                      setAdvancedSettings({
                        ...advancedSettings,
                        preferredFocusTimeEnd: e.target.value
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Scheduling Boundaries */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Scheduling Boundaries</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Don't Schedule Before</Label>
                  <Input
                    type="time"
                    value={advancedSettings.avoidSchedulingBefore}
                    onChange={(e) =>
                      setAdvancedSettings({
                        ...advancedSettings,
                        avoidSchedulingBefore: e.target.value
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Don't Schedule After</Label>
                  <Input
                    type="time"
                    value={advancedSettings.avoidSchedulingAfter}
                    onChange={(e) =>
                      setAdvancedSettings({
                        ...advancedSettings,
                        avoidSchedulingAfter: e.target.value
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Buffer Time */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
                <div>
                  <Label className="text-base">Enable Buffer Time</Label>
                  <p className="text-sm text-muted-foreground">
                    Add breathing room between meetings
                  </p>
                </div>
                <Switch
                  checked={advancedSettings.enableBufferTime}
                  onCheckedChange={(checked) =>
                    setAdvancedSettings({ ...advancedSettings, enableBufferTime: checked })
                  }
                />
              </div>

              {advancedSettings.enableBufferTime && (
                <div className="space-y-2 animate-in slide-in-from-top duration-300">
                  <Label>Buffer Duration</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={advancedSettings.bufferTimeDuration}
                      onChange={(e) =>
                        setAdvancedSettings({
                          ...advancedSettings,
                          bufferTimeDuration: parseInt(e.target.value) || 15
                        })
                      }
                      min="5"
                      max="60"
                      step="5"
                    />
                    <span className="text-sm text-muted-foreground">minutes</span>
                  </div>
                </div>
              )}
            </div>

            {/* Energy Peak Time */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Energy Optimization</h3>
              <div className="space-y-2">
                <Label>When is your peak energy time?</Label>
                <Select
                  value={advancedSettings.energyPeakTime}
                  onValueChange={(value) =>
                    setAdvancedSettings({ ...advancedSettings, energyPeakTime: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">
                      <span className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        Morning (9AM - 12PM)
                      </span>
                    </SelectItem>
                    <SelectItem value="afternoon">
                      <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Afternoon (12PM - 5PM)
                      </span>
                    </SelectItem>
                    <SelectItem value="evening">
                      <span className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Evening (5PM - 8PM)
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-2">
                  AI will prioritize scheduling focus blocks during your peak energy hours
                </p>
              </div>
            </div>

            {/* Working Days */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Working Days</h3>
              <div className="grid grid-cols-7 gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                  const fullDay = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][index];
                  const isSelected = advancedSettings.workingDays.includes(fullDay);
                  return (
                    <Button
                      key={day}
                      variant={isSelected ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        if (isSelected) {
                          setAdvancedSettings({
                            ...advancedSettings,
                            workingDays: advancedSettings.workingDays.filter(d => d !== fullDay)
                          });
                        } else {
                          setAdvancedSettings({
                            ...advancedSettings,
                            workingDays: [...advancedSettings.workingDays, fullDay]
                          });
                        }
                      }}
                      className="h-12"
                    >
                      {day}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsAdvancedOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveAdvanced}
              disabled={isSaving}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isSaving ? (
                <>
                  <Zap className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Insights Card */}
      {settings.autoBlockEnabled && settings.aiOptimization && (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 animate-in fade-in duration-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-900">
              <Brain className="h-5 w-5 text-purple-600" />
              AI Insights & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-purple-50/80 backdrop-blur-sm border border-purple-200">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Productivity Peak Detected</h4>
                  <p className="text-sm text-muted-foreground">
                    Your focus is highest between 9-11 AM. We've scheduled 3 deep work blocks during this time this week.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-yellow-50/80 backdrop-blur-sm border border-yellow-200">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-yellow-100">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Meeting Overload Warning</h4>
                  <p className="text-sm text-muted-foreground">
                    Thursday has 6 consecutive meetings. Consider rescheduling 2 meetings to maintain productivity.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-blue-50/80 backdrop-blur-sm border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Weekly Goal Progress</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    You're on track to achieve 18 hours of focused work time this week!
                  </p>
                  <Progress value={72} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">13/18 hours completed</p>
                </div>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full bg-blue-50/50 hover:bg-blue-100/80"
            >
              <Brain className="h-4 w-4 mr-2" />
              View Full AI Analysis
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions Card */}
      {settings.autoBlockEnabled && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-all"
                onClick={() => {
                  // Add logic to sync with calendar
                  alert('Syncing with your calendar...');
                }}
              >
                <Calendar className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">Sync Calendar</span>
              </Button>

              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-green-50 hover:border-green-300 transition-all"
                onClick={() => {
                  // Add logic to export schedule
                  alert('Exporting schedule...');
                }}
              >
                <Download className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">Export Schedule</span>
              </Button>

              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-purple-50 hover:border-purple-300 transition-all"
                onClick={() => {
                  // Add logic to view analytics
                  alert('Opening analytics dashboard...');
                }}
              >
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium">View Analytics</span>
              </Button>

              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-pink-50 hover:border-pink-300 transition-all"
                onClick={() => {
                  // Add logic to share settings
                  alert('Sharing settings with team...');
                }}
              >
                <Users className="h-5 w-5 text-pink-600" />
                <span className="text-sm font-medium">Share Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AutoCalendarBlockOptimizer;