import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, 
  SkipBack, SkipForward, FileText, Brain, MessageSquare,
  Share2, Download, Settings, Search, Clock, ChevronLeft,
  Video, Loader2, BookmarkPlus, Trash2, Send, AlertCircle
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import {
  useRecordingDetails,
  useTranscript,
  useAISummary,
  useHighlights,
  useComments,
  useAnalytics
} from "@/hooks/use-recordings-data";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

const RecordingPlayer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState("transcript");
  const [searchTerm, setSearchTerm] = useState("");
  const [newComment, setNewComment] = useState("");
  const [newHighlight, setNewHighlight] = useState({ title: "", type: "bookmark" as const });
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

  // Fetch data using hooks
  const { recording, loading: recordingLoading, error: recordingError } = useRecordingDetails(recordingId);
  const { segments, loading: transcriptLoading } = useTranscript(recordingId);
  const { summary, actionItems, decisions, loading: summaryLoading, updateActionItemStatus } = useAISummary(recordingId);
  const { highlights, addHighlight, deleteHighlight } = useHighlights(recordingId, user?.id || null);
  const { comments, addComment, deleteComment } = useComments(recordingId);
  const { analytics } = useAnalytics(recordingId);

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
    setCurrentTime(Math.max(0, Math.min(currentTime + seconds, recording?.duration || 0)));
  };

  // Jump to timestamp
  const jumpToTimestamp = (timestamp: number) => {
    setCurrentTime(timestamp);
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp;
    }
  };

  // Filter transcript segments based on search
  const filteredSegments = segments.filter(segment =>
    segment.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    segment.speaker_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle add comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const { error } = await addComment({
      text: newComment,
      timestamp: currentTime
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive"
      });
    } else {
      setNewComment("");
      toast({
        title: "Success",
        description: "Comment added successfully"
      });
    }
  };

  // Handle add highlight
  const handleAddHighlight = async () => {
    if (!newHighlight.title.trim() || !user) return;

    const { error } = await addHighlight({
      recording_id: recordingId!,
      user_id: user.id,
      title: newHighlight.title,
      start_time: currentTime,
      end_time: currentTime + 30,
      type: newHighlight.type,
      importance: 'medium'
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add highlight",
        variant: "destructive"
      });
    } else {
      setNewHighlight({ title: "", type: "bookmark" });
      toast({
        title: "Success",
        description: "Highlight added successfully"
      });
    }
  };

  // Handle share recording
  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied",
        description: "Recording link copied to clipboard"
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive"
      });
    }
  };

  // Handle download
  const handleDownload = async () => {
    if (!recording?.file_url) return;
    
    try {
      const link = document.createElement('a');
      link.href = recording.file_url;
      link.download = `${recording.title}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: "Your recording is being downloaded"
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to download recording",
        variant: "destructive"
      });
    }
  };

  if (recordingLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (recordingError || !recording) {
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
            <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
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
          <h1 className="text-3xl font-bold">{recording.title}</h1>
          <p className="text-muted-foreground">
            {new Date(recording.created_at).toLocaleDateString()} • {formatTime(recording.duration)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleDownload}>
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
            {recording.file_url ? (
              <video
                ref={videoRef}
                src={recording.file_url}
                className="w-full h-full"
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
              />
            ) : (
              <div className="text-center">
                <div className="bg-muted h-32 w-32 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="h-16 w-16 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">Video not available</p>
              </div>
            )}
            
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
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-12 text-right">
                {formatTime(currentTime)}
              </span>
              <Slider
                value={[currentTime]}
                min={0}
                max={recording.duration}
                step={1}
                onValueChange={handleTimelineChange}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground w-12">
                {formatTime(recording.duration)}
              </span>
            </div>
            
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
                  <Button variant="ghost" size="icon" onClick={toggleMute}>
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
                
                <Select value={playbackSpeed.toString()} onValueChange={(value) => setPlaybackSpeed(parseFloat(value))}>
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

                <Button variant="outline" size="sm" onClick={handleAddHighlight}>
                  <BookmarkPlus className="h-4 w-4 mr-2" />
                  Bookmark
                </Button>
              </div>
              
              <Button variant="ghost" size="icon" onClick={() => setIsFullscreen(!isFullscreen)}>
                {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="transcript">
            Transcript
            {transcriptLoading && <Loader2 className="ml-2 h-3 w-3 animate-spin" />}
          </TabsTrigger>
          <TabsTrigger value="summary">
            AI Summary
            {summaryLoading && <Loader2 className="ml-2 h-3 w-3 animate-spin" />}
          </TabsTrigger>
          <TabsTrigger value="comments">
            Comments ({comments.length})
          </TabsTrigger>
          <TabsTrigger value="insights">
            Insights ({highlights.length})
          </TabsTrigger>
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
                      className="border-l-4 border-primary pl-4 py-2 hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => jumpToTimestamp(segment.start_time)}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarFallback>
                            {segment.speaker_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{segment.speaker_name}</span>
                            <Badge variant="secondary" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatTime(segment.start_time)}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {Math.round(segment.confidence * 100)}% confidence
                            </Badge>
                          </div>
                          <p className="text-sm">{segment.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredSegments.length === 0 && !transcriptLoading && (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="mx-auto h-12 w-12 mb-2" />
                      <p>No transcript segments found</p>
                    </div>
                  )}

                  {transcriptLoading && (
                    <div className="text-center py-8">
                      <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                      <p className="mt-2 text-muted-foreground">Loading transcript...</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="summary" className="space-y-4">
          {summary ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Executive Summary</h3>
                      <Badge variant="secondary">
                        <Brain className="h-3 w-3 mr-1" />
                        AI Generated
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{summary.executive_summary}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Key Metrics</h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sentiment</span>
                      <Badge variant={summary.sentiment === 'positive' ? 'default' : 'secondary'}>
                        {summary.sentiment}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sentiment Score</span>
                      <span className="font-medium">{Math.round(summary.sentiment_score * 100)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Action Items</span>
                      <span className="font-medium">{actionItems.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Decisions</span>
                      <span className="font-medium">{decisions.length}</span>
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
                      {summary.key_points.map((point, index) => (
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
                      {decisions.map((decision) => (
                        <li key={decision.id} className="flex items-start gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500 mt-2"></div>
                          <span>{decision.text}</span>
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
                    {actionItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{item.text}</p>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span>Assignee: {item.assignee}</span>
                            {item.due_date && (
                              <span>Due: {new Date(item.due_date).toLocaleDateString()}</span>
                            )}
                            <Badge 
                              variant={
                                item.status === 'completed' ? 'default' : 
                                item.status === 'in-progress' ? 'secondary' : 
                                'outline'
                              }
                              className="cursor-pointer"
                              onClick={() => {
                                const nextStatus = 
                                  item.status === 'pending' ? 'in-progress' :
                                  item.status === 'in-progress' ? 'completed' :
                                  'pending';
                                updateActionItemStatus(item.id, nextStatus);
                              }}
                            >
                              {item.status}
                            </Badge>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => jumpToTimestamp(item.timestamp)}
                        >
                          <Clock className="h-4 w-4 mr-1" />
                          {formatTime(item.timestamp)}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="py-12">
              <CardContent className="text-center">
                {summaryLoading ? (
                  <>
                    <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Generating AI summary...</p>
                  </>
                ) : (
                  <>
                    <Brain className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No AI summary available yet</p>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="comments" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Add a comment..."
                    className="mb-2"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      At {formatTime(currentTime)}
                    </span>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setNewComment("")}
                      >
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleAddComment}>
                        <Send className="h-4 w-4 mr-1" />
                        Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <ScrollArea className="h-[500px]">
            <div className="space-y-4">
              {comments.map((comment) => (
                <Card key={comment.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {comment.user?.email?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {comment.user?.full_name || comment.user?.email || 'Unknown'}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {new Date(comment.created_at).toLocaleString()}
                            </span>
                            {comment.timestamp !== undefined && (
                              <Badge 
                                variant="secondary" 
                                className="cursor-pointer"
                                onClick={() => jumpToTimestamp(comment.timestamp!)}
                              >
                                <Clock className="h-3 w-3 mr-1" />
                                {formatTime(comment.timestamp)}
                              </Badge>
                            )}
                          </div>
                          {user?.id === comment.user_id && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteComment(comment.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <p className="mt-1">{comment.text}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {comments.length === 0 && (
                <Card className="py-12">
                  <CardContent className="text-center">
                    <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Add Highlight</h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Input
                  placeholder="Highlight title..."
                  value={newHighlight.title}
                  onChange={(e) => setNewHighlight({ ...newHighlight, title: e.target.value })}
                />
                <Select 
                  value={newHighlight.type} 
                  onValueChange={(value) => setNewHighlight({ ...newHighlight, type: value as any })}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bookmark">Bookmark</SelectItem>
                    <SelectItem value="important">Important</SelectItem>
                    <SelectItem value="decision">Decision</SelectItem>
                    <SelectItem value="question">Question</SelectItem>
                    <SelectItem value="action">Action</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleAddHighlight}>Add</Button>
              </div>
            </CardContent>
          </Card>

          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-500" />
                    <h3 className="text-lg font-semibold">Meeting Analytics</h3>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Engagement Score</span>
                    <span className="font-medium">{analytics.engagement_score}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Talk Ratio</span>
                    <span className="font-medium">{analytics.talk_ratio}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Interruptions</span>
                    <span className="font-medium">{analytics.interruptions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Questions Asked</span>
                    <span className="font-medium">{analytics.questions_asked}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Smart Highlights</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {highlights.map((highlight) => (
                      <div 
                        key={highlight.id} 
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => jumpToTimestamp(highlight.start_time)}
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{highlight.title}</h4>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{formatTime(highlight.start_time)} - {formatTime(highlight.end_time)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{highlight.type}</Badge>
                          {user?.id === highlight.user_id && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteHighlight(highlight.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}

                    {highlights.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <BookmarkPlus className="mx-auto h-12 w-12 mb-2" />
                        <p>No highlights yet. Add one above!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecordingPlayer;