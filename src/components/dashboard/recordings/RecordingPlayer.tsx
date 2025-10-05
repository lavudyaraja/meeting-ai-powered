import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  SkipBack, 
  SkipForward,
  Square,
  FileText,
  Brain,
  MessageSquare,
  Bookmark,
  Share2,
  Download,
  Settings,
  Search,
  Clock,
  ChevronLeft,
  Video
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRecordings } from "@/hooks/use-recordings";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

const RecordingPlayer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const { recordings, loading, error } = useRecordings(user?.id || null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState("transcript");
  const [searchTerm, setSearchTerm] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);

  // Get user session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Get recording ID from URL
  const urlParams = new URLSearchParams(location.search);
  const recordingId = urlParams.get("id");

  // Find the current recording
  const currentRecording = recordings.find(r => r.id === recordingId) || null;

  // Format time
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle play/pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (value[0] === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Handle timeline change
  const handleTimelineChange = (value: number[]) => {
    setCurrentTime(value[0]);
  };

  // Skip forward/backward
  const skip = (seconds: number) => {
    setCurrentTime(Math.max(0, Math.min(currentTime + seconds, currentRecording?.duration || 0)));
  };

  // Jump to timestamp
  const jumpToTimestamp = (timestamp: number) => {
    setCurrentTime(timestamp);
  };

  // Filter transcript segments based on search
  // For now, we'll use mock segments since we don't have real transcript data
  const mockSegments = [
    {
      id: "s1",
      speaker: "Alex Johnson",
      speakerId: "1",
      text: "Let's start the meeting by reviewing our Q4 roadmap. We have several key initiatives we need to prioritize.",
      startTime: 12.5,
      endTime: 18.2,
      confidence: 0.95
    },
    {
      id: "s2",
      speaker: "Sarah Williams",
      speakerId: "2",
      text: "I've been working on the user feedback analysis. There are three main areas we should focus on: performance improvements, mobile experience, and feature requests.",
      startTime: 20.1,
      endTime: 32.8,
      confidence: 0.92
    },
    {
      id: "s3",
      speaker: "Michael Chen",
      speakerId: "3",
      text: "Based on our data, the performance issues are costing us about 15% of our users. If we can reduce load times by 50%, we should see a significant improvement in retention.",
      startTime: 35.4,
      endTime: 48.7,
      confidence: 0.94
    },
    {
      id: "s4",
      speaker: "Emma Davis",
      speakerId: "4",
      text: "For the mobile experience, we should prioritize the navigation redesign. Our user testing shows that 40% of users struggle to find key features.",
      startTime: 52.1,
      endTime: 65.3,
      confidence: 0.89
    }
  ];

  const filteredSegments = mockSegments.filter(segment =>
    segment.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    segment.speaker.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mock AI summary data
  const mockAISummary = {
    executive: "Team discussed Q4 roadmap and prioritized features for the next quarter, focusing on performance improvements, mobile experience, and feature requests.",
    keyPoints: [
      "Performance issues are costing 15% of users",
      "Mobile navigation redesign is a priority",
      "User feedback analysis completed",
      "Q4 roadmap review in progress"
    ],
    actionItems: [
      {
        id: "a1",
        text: "Alex to create performance improvement plan",
        assignee: "Alex Johnson",
        dueDate: "2025-10-12",
        timestamp: 45.2
      },
      {
        id: "a2",
        text: "Sarah to lead mobile navigation redesign",
        assignee: "Sarah Williams",
        dueDate: "2025-10-19",
        timestamp: 62.8
      }
    ],
    decisions: [
      "Approved budget for new performance tools",
      "Prioritize mobile navigation redesign for Q4"
    ],
    questions: [
      "What metrics should we use to measure success?",
      "How will we allocate resources between initiatives?"
    ]
  };

  // Mock highlights data
  const mockHighlights = [
    {
      id: "h1",
      title: "Performance Issue Discussion",
      startTime: 35.4,
      endTime: 48.7,
      type: "important",
      importance: "high"
    },
    {
      id: "h2",
      title: "Mobile Navigation Decision",
      startTime: 52.1,
      endTime: 65.3,
      type: "decision",
      importance: "high"
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !currentRecording) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Recording Not Found</h1>
        </div>
        <Card className="py-12">
          <CardContent className="text-center">
            <Video className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 font-medium">Recording not found</h3>
            <p className="text-muted-foreground">
              The recording you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button className="mt-4" onClick={() => navigate("/dashboard#recordings")}>
              Back to Recordings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/dashboard#recordings")}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{currentRecording.title}</h1>
          <p className="text-muted-foreground">
            {new Date(currentRecording.created_at || "").toLocaleDateString()} • {formatTime(currentRecording.duration || 0)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Player */}
      <Card>
        <CardContent className="p-0">
          <div className="relative bg-black aspect-video flex items-center justify-center">
            {/* Video placeholder */}
            <div className="text-center">
              <div className="bg-muted h-32 w-32 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="h-16 w-16 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Video player would appear here</p>
            </div>
            
            {/* Play button overlay */}
            <Button 
              size="icon" 
              className="absolute inset-0 m-auto h-16 w-16 bg-black/50 hover:bg-black/70"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
            </Button>
          </div>
          
          {/* Controls */}
          <div className="p-4 space-y-4">
            {/* Timeline */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-12 text-right">
                {formatTime(currentTime)}
              </span>
              <Slider
                value={[currentTime]}
                min={0}
                max={currentRecording.duration || 0}
                step={1}
                onValueChange={handleTimelineChange}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground w-12">
                {formatTime(currentRecording.duration || 0)}
              </span>
            </div>
            
            {/* Control buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => skip(-10)}>
                  <SkipBack className="h-5 w-5" />
                </Button>
                <Button size="icon" onClick={togglePlay}>
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => skip(10)}>
                  <SkipForward className="h-5 w-5" />
                </Button>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleMute}
                  >
                    {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={handleVolumeChange}
                    className="w-24"
                  />
                </div>
                
                <Select 
                  value={playbackSpeed.toString()} 
                  onValueChange={(value) => setPlaybackSpeed(parseFloat(value))}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5">0.5x</SelectItem>
                    <SelectItem value="0.75">0.75x</SelectItem>
                    <SelectItem value="1">1x</SelectItem>
                    <SelectItem value="1.25">1.25x</SelectItem>
                    <SelectItem value="1.5">1.5x</SelectItem>
                    <SelectItem value="2">2x</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
          <TabsTrigger value="summary">AI Summary</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transcript" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search in transcript..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Copy Text</Button>
                  <Button variant="outline">Download</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                <div className="p-4 space-y-6">
                  {filteredSegments.map((segment) => (
                    <div 
                      key={segment.id} 
                      className="border-l-4 border-primary pl-4 py-2 hover:bg-muted/50 cursor-pointer"
                      onClick={() => jumpToTimestamp(segment.startTime)}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarFallback>
                            {segment.speaker.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{segment.speaker}</span>
                            <Badge variant="secondary" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatTime(segment.startTime)}
                            </Badge>
                          </div>
                          <p className="text-sm">{segment.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredSegments.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="mx-auto h-12 w-12" />
                      <p className="mt-2">No transcript segments found</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="summary" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Executive Summary</h3>
                  <Badge variant="secondary">AI Generated</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{mockAISummary.executive}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Key Metrics</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Accuracy</span>
                  <span className="font-medium">94.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Action Items</span>
                  <span className="font-medium">{mockAISummary.actionItems.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Decisions</span>
                  <span className="font-medium">{mockAISummary.decisions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Questions</span>
                  <span className="font-medium">{mockAISummary.questions.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Key Discussion Points</h3>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {mockAISummary.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Decisions Made</h3>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {mockAISummary.decisions.map((decision, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500 mt-2"></div>
                      <span>{decision}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Action Items</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockAISummary.actionItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{item.text}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span>Assignee: {item.assignee}</span>
                        <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="comments" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Input placeholder="Add a comment..." className="mb-2" />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Comment</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>AJ</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Alex Johnson</span>
                    <span className="text-sm text-muted-foreground">2 hours ago</span>
                  </div>
                  <p className="mt-1">Great discussion on the roadmap. I think we should prioritize the performance improvements first.</p>
                  <div className="flex items-center gap-4 mt-2">
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Reply
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <Bookmark className="h-4 w-4 mr-1" />
                      Bookmark
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  <h3 className="text-lg font-semibold">AI Insights</h3>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-purple-100 p-2">
                        <Brain className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Sentiment Analysis</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Overall sentiment was positive with 85% engagement.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-blue-100 p-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Meeting Pace</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Optimal pace with good balance of discussion and action items.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Smart Highlights</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockHighlights.map((highlight) => (
                    <div 
                      key={highlight.id} 
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => jumpToTimestamp(highlight.startTime)}
                    >
                      <div>
                        <h4 className="font-medium">{highlight.title}</h4>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{formatTime(highlight.startTime)} - {formatTime(highlight.endTime)}</span>
                        </div>
                      </div>
                      <Badge variant="outline">{highlight.type}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecordingPlayer;