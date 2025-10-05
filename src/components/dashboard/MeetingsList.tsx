import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Video, MoreVertical, Plus, Copy, Link, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import MeetingDialog from "./MeetingDialog";
import { useNavigate } from "react-router-dom";

interface Meeting {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  status: string;
  meeting_url?: string;
  recording_url?: string;
  summary?: string;
  host_id?: string; // Add host_id to track meeting creator
}

const MeetingsList = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Add this state for AI summary generation
  const [generatingSummary, setGeneratingSummary] = useState<string | null>(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchMeetings();
    
    // Set up real-time subscription for meetings changes
    const channel = supabase
      .channel('meetings_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'meetings',
        },
        (payload) => {
          fetchMeetings();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'meetings',
        },
        (payload) => {
          fetchMeetings();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'meetings',
        },
        (payload) => {
          fetchMeetings();
        }
      )
      .subscribe();

    // Clean up subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  const fetchMeetings = async () => {
    try {
      const { data, error } = await supabase
        .from("meetings")
        .select("*")
        .order("start_time", { ascending: true });

      if (error) throw error;
      setMeetings(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching meetings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-500/20 text-blue-500";
      case "in_progress":
        return "bg-green-500/20 text-green-500";
      case "completed":
        return "bg-gray-500/20 text-gray-500";
      case "cancelled":
        return "bg-red-500/20 text-red-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  const handleStartMeeting = async (meetingId: string) => {
    // Update meeting status to in_progress and start the meeting immediately
    try {
      const { error } = await supabase
        .from("meetings")
        .update({ status: "in_progress" })
        .eq("id", meetingId);

      if (error) throw error;
      
      // Store meeting ID in sessionStorage for the VideoConference component to access
      sessionStorage.setItem('meetingId', meetingId);
      
      // Navigate to video conference with meeting ID
      navigate(`/dashboard#video`);
    } catch (error: any) {
      toast({
        title: "Error starting meeting",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleJoinMeeting = async (meetingId: string) => {
    // For users joining, navigate directly to the meeting
    try {
      // Store meeting ID in sessionStorage for the VideoConference component to access
      sessionStorage.setItem('meetingId', meetingId);
      
      // Navigate to video conference with meeting ID
      navigate(`/dashboard#video`);
    } catch (error: any) {
      toast({
        title: "Error joining meeting",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const copyMeetingLink = (meetingUrl: string) => {
    navigator.clipboard.writeText(meetingUrl);
    toast({ title: "Meeting link copied to clipboard" });
  };

  // Add this function for AI-powered meeting summarization
  const generateMeetingSummary = async (meetingId: string) => {
    setGeneratingSummary(meetingId);
    try {
      // In a real implementation, this would call an AI service to generate a summary
      // For now, we'll simulate the process
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          messages: [
            {
              role: "user",
              content: `Generate a concise summary for meeting ID ${meetingId}. Include key decisions, action items, and next steps.`
            }
          ]
        }
      });

      if (error) throw error;

      // Update the meeting with the generated summary
      const { error: updateError } = await supabase
        .from("meetings")
        .update({ summary: data.message })
        .eq("id", meetingId);

      if (updateError) throw updateError;

      // Refresh the meetings list
      fetchMeetings();

      toast({
        title: "Success",
        description: "Meeting summary generated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate meeting summary",
        variant: "destructive",
      });
    } finally {
      setGeneratingSummary(null);
    }
  };

  // Check if the current user is the host of a meeting
  const isMeetingHost = (meeting: Meeting) => {
    return currentUser && meeting.host_id === currentUser.id;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Meetings</h2>
          <p className="text-muted-foreground">Manage your meetings and schedules</p>
        </div>
        <Button variant="hero" onClick={() => setDialogOpen(true)}>
          <Plus className="w-5 h-5" />
          New Meeting
        </Button>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <Card className="glass-effect p-8 text-center">
            <p className="text-muted-foreground">Loading meetings...</p>
          </Card>
        ) : meetings.length === 0 ? (
          <Card className="glass-effect p-12 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No meetings scheduled</h3>
            <p className="text-muted-foreground mb-6">
              Start by creating your first meeting
            </p>
            <Button variant="hero" onClick={() => setDialogOpen(true)}>Schedule Meeting</Button>
          </Card>
        ) : (
          meetings.map((meeting, index) => (
            <Card
              key={meeting.id}
              className="glass-effect p-6 hover:shadow-glow transition-all animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{meeting.title}</h3>
                    <Badge className={getStatusColor(meeting.status)}>
                      {meeting.status.replace("_", " ")}
                    </Badge>
                    {isMeetingHost(meeting) && (
                      <Badge variant="outline" className="text-xs">
                        Host
                      </Badge>
                    )}
                  </div>

                  {meeting.description && (
                    <p className="text-muted-foreground mb-4">
                      {meeting.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(meeting.start_time), "MMM dd, yyyy")}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {format(new Date(meeting.start_time), "h:mm a")} -{" "}
                      {format(new Date(meeting.end_time), "h:mm a")}
                    </span>
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Participants
                    </span>
                  </div>
                  
                  {meeting.meeting_url && (
                    <div className="flex items-center gap-2 mt-3">
                      <Link className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground truncate flex-1">
                        {meeting.meeting_url}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyMeetingLink(meeting.meeting_url!)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  
                  {meeting.status === 'completed' && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {meeting.recording_url && (
                        <Badge variant="secondary" className="text-xs">
                          <Link className="w-3 h-3 mr-1" />
                          Recording
                        </Badge>
                      )}
                      {meeting.summary ? (
                        <Badge variant="secondary" className="text-xs">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Summary
                        </Badge>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs h-6"
                          onClick={() => generateMeetingSummary(meeting.id)}
                          disabled={generatingSummary === meeting.id}
                        >
                          {generatingSummary === meeting.id ? "Generating..." : "Generate AI Summary"}
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {meeting.status === "scheduled" && isMeetingHost(meeting) && (
                    <Button 
                      variant="hero" 
                      size="sm"
                      onClick={() => handleStartMeeting(meeting.id)}
                    >
                      <Video className="w-4 h-4" />
                      Start
                    </Button>
                  )}
                  {meeting.status === "in_progress" && (
                    <Button 
                      variant="hero" 
                      size="sm"
                      onClick={() => handleJoinMeeting(meeting.id)}
                    >
                      <Video className="w-4 h-4" />
                      Join
                    </Button>
                  )}
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <MeetingDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={fetchMeetings}
      />
    </div>
  );
};

export default MeetingsList;