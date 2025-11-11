import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Video, MoreVertical, Plus, Copy, Link, Sparkles, UserPlus, X, ChevronRight, Play, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import MeetingDialog from "./MeetingDialog";
import { useNavigate } from "react-router-dom";
import { ParticipantInvite } from "@/components/meetings/ParticipantInvite";

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
  host_id?: string;
}

const MeetingsList = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [generatingSummary, setGeneratingSummary] = useState<string | null>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    fetchCurrentUser();
    fetchMeetings();
    
    const channel = supabase
      .channel('meetings_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'meetings' }, () => fetchMeetings())
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'meetings' }, () => fetchMeetings())
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'meetings' }, () => fetchMeetings())
      .subscribe();

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
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
      case "in_progress":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "completed":
        return "bg-violet-500/20 text-violet-400 border-violet-500/30";
      case "cancelled":
        return "bg-rose-500/20 text-rose-400 border-rose-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const handleStartMeeting = async (meetingId: string) => {
    try {
      const { error } = await supabase
        .from("meetings")
        .update({ status: "in_progress" })
        .eq("id", meetingId);

      if (error) throw error;
      
      sessionStorage.setItem('meetingId', meetingId);
      navigate(`/video/${meetingId}`);
    } catch (error: any) {
      toast({
        title: "Error starting meeting",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleJoinMeeting = async (meetingId: string) => {
    try {
      sessionStorage.setItem('meetingId', meetingId);
      navigate(`/video/${meetingId}`);
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

  const openInviteModal = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setShowInviteModal(true);
  };

  const generateMeetingSummary = async (meetingId: string) => {
    setGeneratingSummary(meetingId);
    try {
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

      const { error: updateError } = await supabase
        .from("meetings")
        .update({ summary: data.message })
        .eq("id", meetingId);

      if (updateError) throw updateError;

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

  const isMeetingHost = (meeting: Meeting) => {
    return currentUser && meeting.host_id === currentUser.id;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      {/* <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div> */}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
          <div className="space-y-1 sm:space-y-2">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              Meetings
            </h2>
            <p className="text-cyan-300/70 text-sm sm:text-base lg:text-lg font-medium">
              Manage your meetings and schedules
            </p>
          </div>
          <Button 
            className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl sm:rounded-2xl px-6 py-3 sm:py-4 transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-500/20" 
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            New Meeting
          </Button>
        </div>

        {/* Meetings Grid */}
        <div className="grid gap-4 sm:gap-6">
          {loading ? (
            <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center border border-slate-800/50">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                <p className="text-slate-400 font-medium">Loading meetings...</p>
              </div>
            </div>
          ) : meetings.length === 0 ? (
            <div className="group bg-slate-900/40 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 text-center border border-slate-800/50 hover:border-cyan-500/30 transition-all duration-300">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Calendar className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-6 text-cyan-400 relative z-10 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
                No meetings scheduled
              </h3>
              <p className="text-slate-400 mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg font-medium">
                Start by creating your first meeting
              </p>
              <Button 
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl sm:rounded-2xl px-6 sm:px-8 py-3 sm:py-4 transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-500/20" 
                onClick={() => setDialogOpen(true)}
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Schedule Meeting
              </Button>
            </div>
          ) : (
            meetings.map((meeting, index) => (
              <div 
                key={meeting.id} 
                className="group relative bg-slate-900/40 backdrop-blur-xl rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-800/50 hover:border-cyan-500/30 transition-all duration-300 hover:scale-[1.02]"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10 p-4 sm:p-6 lg:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Main Content */}
                    <div className="flex-1 min-w-0 space-y-3 sm:space-y-4">
                      {/* Title Row */}
                      <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                          {meeting.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={`${getStatusColor(meeting.status)} border text-xs sm:text-sm font-bold`}>
                            {meeting.status.replace("_", " ").toUpperCase()}
                          </Badge>
                          {isMeetingHost(meeting) && (
                            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 border text-xs sm:text-sm font-bold">
                              HOST
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      {meeting.description && (
                        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                          {meeting.description}
                        </p>
                      )}

                      {/* Meeting Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        <div className="flex items-center gap-2 text-slate-300 bg-slate-800/40 rounded-xl px-3 py-2">
                          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 flex-shrink-0" />
                          <span className="text-xs sm:text-sm font-medium truncate">
                            {format(new Date(meeting.start_time), "MMM dd, yyyy")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300 bg-slate-800/40 rounded-xl px-3 py-2">
                          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 flex-shrink-0" />
                          <span className="text-xs sm:text-sm font-medium truncate">
                            {format(new Date(meeting.start_time), "h:mm a")} - {format(new Date(meeting.end_time), "h:mm a")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300 bg-slate-800/40 rounded-xl px-3 py-2">
                          <Users className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 flex-shrink-0" />
                          <span className="text-xs sm:text-sm font-medium">Participants</span>
                        </div>
                      </div>

                      {/* Meeting URL */}
                      {meeting.meeting_url && (
                        <div className="flex items-center gap-2 bg-slate-800/40 rounded-xl px-3 py-2">
                          <Link className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-slate-400 truncate flex-1 font-mono">
                            {meeting.meeting_url}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="hover:bg-cyan-500/20 hover:text-cyan-400 transition-colors flex-shrink-0"
                            onClick={() => copyMeetingLink(meeting.meeting_url!)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      )}

                      {/* Completed Meeting Badges */}
                      {meeting.status === 'completed' && (
                        <div className="flex flex-wrap gap-2">
                          {meeting.recording_url && (
                            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 border text-xs font-bold">
                              <Play className="w-3 h-3 mr-1" />
                              Recording Available
                            </Badge>
                          )}
                          {meeting.summary ? (
                            <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30 border text-xs font-bold">
                              <Sparkles className="w-3 h-3 mr-1" />
                              AI Summary
                            </Badge>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs h-8 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 font-bold"
                              onClick={() => generateMeetingSummary(meeting.id)}
                              disabled={generatingSummary === meeting.id}
                            >
                              <Sparkles className="w-3 h-3 mr-1" />
                              {generatingSummary === meeting.id ? "Generating..." : "Generate AI Summary"}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex lg:flex-col items-center gap-2 lg:gap-3">
                      {meeting.status === "scheduled" && isMeetingHost(meeting) && (
                        <Button 
                          className="flex-1 lg:flex-initial lg:w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-500/20" 
                          size="sm"
                          onClick={() => handleStartMeeting(meeting.id)}
                        >
                          <Video className="w-4 h-4 mr-1" />
                          <span className="hidden sm:inline">Start</span>
                        </Button>
                      )}
                      {meeting.status === "in_progress" && (
                        <Button 
                          className="flex-1 lg:flex-initial lg:w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-emerald-500/20" 
                          size="sm"
                          onClick={() => handleJoinMeeting(meeting.id)}
                        >
                          <Phone className="w-4 h-4 mr-1" />
                          <span className="hidden sm:inline">Join</span>
                        </Button>
                      )}
                      {meeting.meeting_url && isMeetingHost(meeting) && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1 lg:flex-initial lg:w-full border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 font-bold rounded-xl"
                          onClick={() => openInviteModal(meeting)}
                        >
                          <UserPlus className="w-4 h-4 mr-1" />
                          <span className="hidden sm:inline">Invite</span>
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="hover:bg-slate-800/60 hover:text-cyan-400 transition-colors rounded-xl"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <MeetingDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={fetchMeetings}
      />

      {/* Invite Modal */}
      {selectedMeeting && showInviteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-slate-800/50 shadow-2xl shadow-cyan-500/10">
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Invite Participants
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">Share this meeting with others</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="hover:bg-slate-800/60 hover:text-cyan-400 transition-colors rounded-xl"
                  onClick={() => setShowInviteModal(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <ParticipantInvite 
                meetingId={selectedMeeting.id} 
                meetingUrl={selectedMeeting.meeting_url || ""} 
                onInviteSent={() => setShowInviteModal(false)} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingsList;