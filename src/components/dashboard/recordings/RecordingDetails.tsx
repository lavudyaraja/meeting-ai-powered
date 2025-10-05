import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Play, 
  Download, 
  Share2, 
  Edit, 
  Trash2, 
  Clock, 
  Calendar, 
  FileText, 
  Users, 
  Tag,
  Star,
  ChevronLeft,
  MoreHorizontal,
  Copy,
  Link,
  Eye,
  MessageSquare,
  Brain
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for a specific recording
const mockRecording = {
  id: "1",
  title: "Product Roadmap Planning",
  description: "Quarterly planning session to discuss product roadmap priorities for Q4 and align on key initiatives.",
  date: "2025-10-05T14:00:00Z",
  duration: 3600, // in seconds
  fileSize: "245 MB",
  status: "ready",
  participants: [
    { id: "1", name: "Alex Johnson", avatar: "", role: "Product Manager", joinTime: 0, leaveTime: 3600 },
    { id: "2", name: "Sarah Williams", avatar: "", role: "UX Designer", joinTime: 300, leaveTime: 3500 },
    { id: "3", name: "Michael Chen", avatar: "", role: "Engineering Lead", joinTime: 0, leaveTime: 3600 },
    { id: "4", name: "Emma Davis", avatar: "", role: "Marketing Lead", joinTime: 600, leaveTime: 3000 }
  ],
  transcript: {
    id: "t1",
    status: "completed",
    language: "en",
    accuracy: 94.5,
    url: "https://example.com/transcript.vtt"
  },
  aiSummary: {
    id: "sum1",
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
        timestamp: 45.2,
        status: "pending"
      },
      {
        id: "a2",
        text: "Sarah to lead mobile navigation redesign",
        assignee: "Sarah Williams",
        dueDate: "2025-10-19",
        timestamp: 62.8,
        status: "in-progress"
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
  },
  highlights: [
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
  ],
  tags: ["product", "roadmap", "q4-planning", "strategy"],
  isFavorite: true,
  views: 24,
  comments: 8,
  permissions: {
    ownerId: "user_123",
    canEdit: true,
    canDownload: true,
    canShare: true
  },
  settings: {
    allowDownload: true,
    allowComments: true,
    watermark: false,
    expirationDate: null
  }
};

const RecordingDetails = () => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(mockRecording.isFavorite);

  // Format duration
  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}m ${secs}s`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle play recording
  const handlePlayRecording = () => {
    // Navigate to the player page
    window.location.hash = "#recordings/player";
  };

  // Toggle favorite status
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In a real app, this would make an API call to update the favorite status
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold flex-1">{mockRecording.title}</h1>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={toggleFavorite}
          >
            <Star className={`h-4 w-4 ${isFavorite ? "fill-yellow-500 text-yellow-500" : ""}`} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Edit Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link className="h-4 w-4 mr-2" />
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Recording Info */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="md:col-span-2 space-y-4">
              <p className="text-muted-foreground">{mockRecording.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {mockRecording.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="text-sm">{formatDate(mockRecording.date)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="text-sm">{formatDuration(mockRecording.duration)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Size</p>
                    <p className="text-sm">{mockRecording.fileSize}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Participants</p>
                    <p className="text-sm">{mockRecording.participants.length}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Button onClick={handlePlayRecording} className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Play Recording
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" disabled={!mockRecording.settings.allowDownload}>
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  <span>{mockRecording.views} views</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  <span>{mockRecording.comments} comments</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="participants">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="summary">AI Summary</TabsTrigger>
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        {/* Participants Tab */}
        <TabsContent value="participants" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Meeting Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecording.participants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{participant.name}</p>
                        <p className="text-sm text-muted-foreground">{participant.role}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Message</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* AI Summary Tab */}
        <TabsContent value="summary" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Executive Summary</CardTitle>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Brain className="h-3 w-3" />
                    AI Generated
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{mockRecording.aiSummary.executive}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transcript Accuracy</span>
                  <span className="font-medium">{mockRecording.transcript.accuracy}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Action Items</span>
                  <span className="font-medium">{mockRecording.aiSummary.actionItems.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Decisions</span>
                  <span className="font-medium">{mockRecording.aiSummary.decisions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Questions</span>
                  <span className="font-medium">{mockRecording.aiSummary.questions.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Discussion Points</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {mockRecording.aiSummary.keyPoints.map((point, index) => (
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
                <CardTitle>Decisions Made</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {mockRecording.aiSummary.decisions.map((decision, index) => (
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
              <CardTitle>Action Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockRecording.aiSummary.actionItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{item.text}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span>Assignee: {item.assignee}</span>
                        <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                        <Badge variant={item.status === "pending" ? "secondary" : "default"}>
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Transcript Tab */}
        <TabsContent value="transcript" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Transcript</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Download</Button>
                  <Button variant="outline" size="sm">Copy Text</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm">
                  The full transcript would be displayed here. In a real implementation, this would 
                  show the complete meeting transcript with speaker identification and timestamps.
                </p>
                <Separator className="my-4" />
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>AJ</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Alex Johnson</span>
                        <span className="text-xs text-muted-foreground">00:12</span>
                      </div>
                      <p className="text-sm mt-1">Let's start the meeting by reviewing our Q4 roadmap. We have several key initiatives we need to prioritize.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>SW</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Sarah Williams</span>
                        <span className="text-xs text-muted-foreground">00:20</span>
                      </div>
                      <p className="text-sm mt-1">I've been working on the user feedback analysis. There are three main areas we should focus on: performance improvements, mobile experience, and feature requests.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Engagement Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground">Above average</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Talk Ratio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">65:35</div>
                <p className="text-xs text-muted-foreground">Moderate balance</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Interruptions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Low frequency</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Sentiment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Positive</div>
                <p className="text-xs text-muted-foreground">87% positive</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Participant Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecording.participants.map((participant, index) => (
                  <div key={participant.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{participant.name}</p>
                        <p className="text-sm text-muted-foreground">{participant.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${80 - index * 15}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-10">{80 - index * 15}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecordingDetails;