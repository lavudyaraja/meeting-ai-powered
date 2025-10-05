import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles,
  Calendar,
  CheckCircle,
  FileText,
  Zap,
  Brain,
  Settings,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";
import { AutoCalendarBlockOptimizer, PostMeetingTaskAutomation, SmartDocumentGenerator } from "./";

const AIMeetingDashboard = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleProcessMeetings = () => {
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      alert("Meetings processed successfully!");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            AI Meeting Assistant
          </h1>
          <p className="text-muted-foreground">
            Automate your meetings with world-first practical AI features
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleProcessMeetings}
            disabled={isProcessing}
            className="gap-2"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Process Meetings
              </>
            )}
          </Button>
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      <Tabs defaultValue="quick-wins" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full md:w-[600px]">
          <TabsTrigger value="quick-wins" className="gap-2">
            <Zap className="h-4 w-4" />
            Quick Wins
          </TabsTrigger>
          <TabsTrigger value="game-changers" className="gap-2">
            <Brain className="h-4 w-4" />
            Game Changers
          </TabsTrigger>
          <TabsTrigger value="differentiators" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Differentiators
          </TabsTrigger>
          <TabsTrigger value="all-features" className="gap-2">
            <Settings className="h-4 w-4" />
            All Features
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quick-wins" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <AutoCalendarBlockOptimizer />
              <PostMeetingTaskAutomation />
            </div>
            <div className="space-y-6">
              <SmartDocumentGenerator />
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Quick Wins Dashboard
                  </CardTitle>
                  <CardDescription>
                    Your most impactful automation features
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-secondary/20 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Time Saved</h3>
                      <span className="text-primary font-bold">4.2 hrs</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      This week from automated calendar blocking
                    </p>
                  </div>
                  
                  <div className="p-4 bg-secondary/20 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Tasks Created</h3>
                      <span className="text-primary font-bold">24</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Automatically from meeting transcripts
                    </p>
                  </div>
                  
                  <div className="p-4 bg-secondary/20 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Documents Generated</h3>
                      <span className="text-primary font-bold">8</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Meeting minutes and action items
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="game-changers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Game Changer Features
              </CardTitle>
              <CardDescription>
                High-impact features that transform how you work
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Vendor/Client Portal Integration
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Automatically update external stakeholders after meetings
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
                    Coming Soon
                  </span>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Hardware Integration Suite
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Connect meeting AI to physical devices for seamless automation
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
                    Coming Soon
                  </span>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Meeting Cost Tracker & Budget Alert
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Track real-world budget impact of meetings
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
                    Coming Soon
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="differentiators" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Unique Differentiators
              </CardTitle>
              <CardDescription>
                Features that set us apart from the competition
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Instant Meeting Room Cleanup
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Automatically reset meeting rooms after each session
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
                    Coming Soon
                  </span>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium flex items-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Auto-Cancel Optimizer
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Suggest canceling unnecessary meetings to reclaim time
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
                    Coming Soon
                  </span>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Hardware Integration Suite
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Connect meeting AI to physical devices for seamless automation
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
                    Coming Soon
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all-features" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Auto-Calendar Block Optimizer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Automatically blocks focus time on calendars based on meeting patterns
                </p>
                <Button className="w-full mt-4" variant="outline">
                  Configure
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Post-Meeting Task Automation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Automatically creates and assigns tasks in your project management tool
                </p>
                <Button className="w-full mt-4" variant="outline">
                  Configure
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Smart Document Generator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Creates required documents automatically from meeting discussions
                </p>
                <Button className="w-full mt-4" variant="outline">
                  Configure
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Smart Participant Auto-Invite
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Suggests and auto-invites relevant people based on discussion topics
                </p>
                <Button className="w-full mt-4" variant="outline" disabled>
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Automatic Expense & Booking System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Handles meeting-related logistics automatically
                </p>
                <Button className="w-full mt-4" variant="outline" disabled>
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Live Translation Subtitles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Real-time translation overlay for multilingual meetings
                </p>
                <Button className="w-full mt-4" variant="outline" disabled>
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIMeetingDashboard;