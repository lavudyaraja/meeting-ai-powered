import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Play, Download, Share2, Edit, Trash2, Clock, Calendar, 
  FileText, Users, Tag, Star, ChevronLeft, MoreHorizontal,
  Copy, Link, Eye, MessageSquare, Brain, Loader2, AlertCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useRecordingDetails,
  useTranscript,
  useAISummary,
  useParticipants,
  useAnalytics,
  useComments
} from "@/hooks/use-recordings-data";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

const RecordingDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", description: "", tags: "" });

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
  const { segments } = useTranscript(recordingId);
  const { summary, actionItems, decisions } = useAISummary(recordingId);
  const { participants } = useParticipants(recordingId);
  const { analytics } = useAnalytics(recordingId);
  const { comments } = useComments(recordingId);

  // Initialize edit form when recording loads
  useEffect(() => {
    if (recording) {
      setEditForm({
        title: recording.title,
        description: recording.description || "",
        tags: recording.tags?.join(", ") || ""
      });
    }
  }, [recording]);

  // Toggle favorite status
  const toggleFavorite = async () => {
    if (!recording) return;

    const { error } = await supabase
      .from('recordings')
      .update({ is_favorite: !recording.is_favorite })
      .eq('id', recording.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update favorite status",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: recording.is_favorite ? "Removed from favorites" : "Added to favorites"
      });
    }
  };

  // Handle edit recording
  const handleEditRecording = async () => {
    if (!recording) return;

    const tags = editForm.tags
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const { error } = await supabase
      .from('recordings')
      .update({
        title: editForm.title,
        description: editForm.description,
        tags
      })
      .eq('id', recording.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update recording",
        variant: "destructive"
      });
    } else {
      setIsEditDialogOpen(false);
      toast({
        title: "Success",
        description: "Recording updated successfully"
      });
    }
  };

  // Handle duplicate recording
  const handleDuplicate = async () => {
    if (!recording) return;

    const { error } = await supabase
      .from('recordings')
      .insert([{
        user_id: recording.user_id,
        title: `${recording.title} (Copy)`,
        description: recording.description,
        duration: recording.duration,
        file_size: recording.file_size,
        file_url: recording.file_url,
        thumbnail_url: recording.thumbnail_url,
        status: recording.status,
        tags: recording.tags,
        folder_id: recording.folder_id
      }]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to duplicate recording",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Recording duplicated successfully"
      });
    }
  };

  // Handle copy link
  const handleCopyLink = async () => {
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

  // Handle delete recording
  const handleDelete = async () => {
    if (!recording || !confirm("Are you sure you want to delete this recording?")) return;

    const { error } = await supabase
      .from('recordings')
      .delete()
      .eq('id', recording.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete recording",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Recording deleted successfully"
      });
      navigate("/dashboard#recordings");
    }
  };

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

  // Format file size
  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Handle play recording
  const handlePlayRecording = async () => {
    if (!recording) return;
    
    // Increment view count
    await supabase
      .from('recordings')
      .update({ views_count: (recording.views_count || 0) + 1 })
      .eq('id', recording.id);
    
    navigate(`/dashboard#recordings/player?id=${recording.id}`);
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
          onClick={() => navigate(-1)}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold flex-1">{recording.title}</h1>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={toggleFavorite}
          >
            <Star className={`h-4 w-4 ${recording.is_favorite ? "fill-yellow-500 text-yellow-500" : ""}`} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDuplicate}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyLink}>
                <Link className="h-4 w-4 mr-2" />
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Recording</DialogTitle>
            <DialogDescription>
              Update the recording details below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tags (comma separated)</label>
              <Input
                value={editForm.tags}
                onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                placeholder="product, roadmap, planning"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditRecording}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Recording Info */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              {recording.description && (
                <p className="text-muted-foreground">{recording.description}</p>
              )}
              
              {recording.tags && recording.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {recording.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="text-sm">{formatDate(recording.created_at)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="text-sm">{formatDuration(recording.duration)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Size</p>
                    <p className="text-sm">{formatFileSize(recording.file_size)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Participants</p>
                    <p className="text-sm">{participants.length}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Badge variant={recording.status === 'ready' ? 'default' : 'secondary'}>
                  {recording.status}
                </Badge>
                {recording.transcript_url && (
                  <Badge variant="outline">Transcript Available</Badge>
                )}
                {summary && (
                  <Badge variant="outline">
                    <Brain className="h-3 w-3 mr-1" />
                    AI Summary Ready
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button onClick={handlePlayRecording} className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Play Recording
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline"
                  onClick={async () => {
                    const link = document.createElement('a');
                    link.href = recording.file_url;
                    link.download = `${recording.title}.mp4`;
                    link.click();
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={handleCopyLink}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  <span>{recording.views_count || 0} views</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  <span>{comments.length} comments</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="participants">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="participants">
            Participants ({participants.length})
          </TabsTrigger>
          <TabsTrigger value="summary">
            AI Summary
          </TabsTrigger>
          <TabsTrigger value="transcript">
            Transcript ({segments.length})
          </TabsTrigger>
          <TabsTrigger value="analytics">
            Analytics
          </TabsTrigger>
        </TabsList>
        
        {/* Participants Tab */}
        <TabsContent value="participants" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Meeting Participants</CardTitle>
            </CardHeader>
            <CardContent>
              {participants.length > 0 ? (
                <div className="space-y-4">
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{participant.name}</p>
                          {participant.role && (
                            <p className="text-sm text-muted-foreground">{participant.role}</p>
                          )}
                          {participant.email && (
                            <p className="text-xs text-muted-foreground">{participant.email}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <div>Speaking: {formatDuration(participant.speaking_time)}</div>
                        <div className="text-xs">
                          {formatDuration(participant.join_time)} - {formatDuration(participant.leave_time)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="mx-auto h-12 w-12 mb-2" />
                  <p>No participant data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* AI Summary Tab */}
        <TabsContent value="summary" className="space-y-4">
          {summary ? (
            <>
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
                    <p className="text-muted-foreground">{summary.executive_summary}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Key Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sentiment</span>
                      <Badge variant={summary.sentiment === 'positive' ? 'default' : 'secondary'}>
                        {summary.sentiment}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Score</span>
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
                    <CardTitle>Key Discussion Points</CardTitle>
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
                    <CardTitle>Decisions Made</CardTitle>
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
                  <CardTitle>Action Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {actionItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{item.text}</p>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span>Assignee: {item.assignee}</span>
                            {item.due_date && (
                              <span>Due: {new Date(item.due_date).toLocaleDateString()}</span>
                            )}
                            <Badge variant={
                              item.status === 'completed' ? 'default' : 
                              item.status === 'in-progress' ? 'secondary' : 
                              'outline'
                            }>
                              {item.status}
                            </Badge>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handlePlayRecording()}
                        >
                          View
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
                <Brain className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="mt-4 font-medium">No AI summary available</h3>
                <p className="text-muted-foreground">
                  The AI summary is still being generated or not available for this recording.
                </p>
              </CardContent>
            </Card>
          )}
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
              {segments.length > 0 ? (
                <div className="space-y-3">
                  {segments.slice(0, 5).map((segment) => (
                    <div key={segment.id} className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{segment.speaker_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{segment.speaker_name}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDuration(segment.start_time)}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{segment.text}</p>
                      </div>
                    </div>
                  ))}
                  {segments.length > 5 && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handlePlayRecording}
                    >
                      View Full Transcript ({segments.length} segments)
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="mx-auto h-12 w-12 mb-2" />
                  <p>No transcript available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          {analytics ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Engagement Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.engagement_score}%</div>
                    <p className="text-xs text-muted-foreground">
                      {analytics.engagement_score > 75 ? 'High engagement' : 
                       analytics.engagement_score > 50 ? 'Moderate engagement' : 
                       'Low engagement'}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Talk Ratio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.talk_ratio}</div>
                    <p className="text-xs text-muted-foreground">Speaker distribution</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Interruptions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.interruptions}</div>
                    <p className="text-xs text-muted-foreground">
                      {analytics.interruptions < 5 ? 'Low frequency' : 
                       analytics.interruptions < 10 ? 'Moderate frequency' : 
                       'High frequency'}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Questions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.questions_asked}</div>
                    <p className="text-xs text-muted-foreground">Questions asked</p>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Participant Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {participants.map((participant) => {
                      const speakingPercent = recording.duration > 0 
                        ? Math.round((participant.speaking_time / recording.duration) * 100)
                        : 0;
                      
                      return (
                        <div key={participant.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{participant.name}</p>
                              {participant.role && (
                                <p className="text-sm text-muted-foreground">{participant.role}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-32 bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all" 
                                style={{ width: `${speakingPercent}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium w-10">{speakingPercent}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="py-12">
              <CardContent className="text-center">
                <Brain className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="mt-4 font-medium">No analytics available</h3>
                <p className="text-muted-foreground">
                  Analytics data is still being processed or not available for this recording.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecordingDetails;