import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Video, MoreVertical, Plus, Copy, Link, Sparkles, UserPlus, X, Play, Phone, AlertCircle, CheckCircle, Edit, Trash2, EyeOff, Eye } from "lucide-react";
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

interface MeetingParticipant {
  id: string;
  user_id: string | null;
  status: string | null;
  created_at: string | null;
}

interface ParticipantWithUser extends MeetingParticipant {
  email?: string | null;
  name?: string | null;
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
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [participants, setParticipants] = useState<ParticipantWithUser[]>([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDropdown && !(event.target as Element).closest('.dropdown-container')) {
        setShowDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

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

  const fetchParticipants = async (meetingId: string) => {
    setLoadingParticipants(true);
    try {
      // First, fetch the participants
      const { data: participantsData, error: participantsError } = await supabase
        .from("meeting_participants")
        .select("*")
        .eq("meeting_id", meetingId);

      if (participantsError) throw participantsError;

      // Then, fetch user details for each participant
      const participantsWithUserDetails: ParticipantWithUser[] = [];
      
      for (const participant of participantsData || []) {
        if (participant.user_id) {
          const { data: userData, error: userError } = await supabase
            .from("profiles")
            .select("email, full_name")
            .eq("id", participant.user_id)
            .single();
          
          if (!userError && userData) {
            participantsWithUserDetails.push({
              ...participant,
              email: userData.email,
              name: userData.full_name
            });
          } else {
            participantsWithUserDetails.push({
              ...participant,
              email: null,
              name: null
            });
          }
        } else {
          participantsWithUserDetails.push({
            ...participant,
            email: null,
            name: null
          });
        }
      }
      
      setParticipants(participantsWithUserDetails);
    } catch (error: any) {
      toast({
        title: "Error fetching participants",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingParticipants(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "scheduled":
        return {
          color: "bg-blue-500/10 text-blue-400 border-blue-500/30",
          icon: <Calendar className="w-3 h-3" />,
          label: "SCHEDULED"
        };
      case "in_progress":
        return {
          color: "bg-green-500/10 text-green-400 border-green-500/30",
          icon: <Video className="w-3 h-3" />,
          label: "LIVE NOW"
        };
      case "completed":
        return {
          color: "bg-purple-500/10 text-purple-400 border-purple-500/30",
          icon: <CheckCircle className="w-3 h-3" />,
          label: "COMPLETED"
        };
      case "cancelled":
        return {
          color: "bg-red-500/10 text-red-400 border-red-500/30",
          icon: <AlertCircle className="w-3 h-3" />,
          label: "CANCELLED"
        };
      default:
        return {
          color: "bg-gray-500/10 text-gray-400 border-gray-500/30",
          icon: <Calendar className="w-3 h-3" />,
          label: status.toUpperCase()
        };
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
    toast({ 
      title: "Copied!",
      description: "Meeting link copied to clipboard" 
    });
  };

  const openInviteModal = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setShowInviteModal(true);
  };

  const openParticipantsModal = async (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    await fetchParticipants(meeting.id);
    setShowParticipantsModal(true);
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

  const handleEditMeeting = (meeting: Meeting) => {
    setEditingMeeting(meeting);
    setDialogOpen(true);
    setShowDropdown(null);
  };

  const handleDeleteMeeting = async (meetingId: string) => {
    // Confirm deletion with user
    if (!window.confirm("Are you sure you want to delete this meeting? This action cannot be undone.")) {
      setShowDropdown(null);
      return;
    }
    
    try {
      // First, check if the meeting exists and get its host_id
      const { data: meetingData, error: fetchError } = await supabase
        .from("meetings")
        .select("id, host_id")
        .eq("id", meetingId)
        .single();
      
      if (fetchError) {
        throw new Error("Meeting not found: " + fetchError.message);
      }
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      // Check if current user is the host
      if (user.id !== meetingData.host_id) {
        throw new Error("You don't have permission to delete this meeting. Only the meeting host can delete it.");
      }
      
      // Attempt to delete the meeting
      const { error: deleteError } = await supabase
        .from("meetings")
        .delete()
        .eq("id", meetingId);

      if (deleteError) {
        throw new Error("Failed to delete meeting: " + deleteError.message);
      }

      // Refresh the meetings list
      await fetchMeetings();
      
      toast({
        title: "Success",
        description: "Meeting deleted successfully",
      });
    } catch (error: any) {
      console.error("Error in handleDeleteMeeting:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setShowDropdown(null);
    }
  };

  const handleHideMeeting = async (meetingId: string) => {
    try {
      const { error } = await supabase
        .from("meetings")
        .update({ status: "cancelled" })
        .eq("id", meetingId);

      if (error) throw error;

      fetchMeetings();
      toast({
        title: "Success",
        description: "Meeting hidden successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to hide meeting",
        variant: "destructive",
      });
    } finally {
      setShowDropdown(null);
    }
  };

  const handleShowMeeting = async (meetingId: string) => {
    try {
      const { error } = await supabase
        .from("meetings")
        .update({ status: "scheduled" })
        .eq("id", meetingId);

      if (error) throw error;

      fetchMeetings();
      toast({
        title: "Success",
        description: "Meeting shown successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to show meeting",
        variant: "destructive",
      });
    } finally {
      setShowDropdown(null);
    }
  };

  const isMeetingHost = (meeting: Meeting) => {
    return currentUser && meeting.host_id === currentUser.id;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 relative">
      {/* Subtle Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Meetings
            </h1>
            <p className="text-slate-400 text-lg">
              Manage and schedule your meetings
            </p>
          </div>
          <Button 
            className="w-full sm:w-auto bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 hover:from-blue-600 hover:via-cyan-600 hover:to-teal-600 text-white font-bold rounded-xl px-6 py-6 transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/30" 
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            New Meeting
          </Button>
        </div>

        {/* Meetings List */}
        <div className="space-y-4">
          {loading ? (
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800 p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="text-slate-400 font-medium">Loading meetings...</p>
              </div>
            </Card>
          ) : meetings.length === 0 ? (
            <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl border-slate-800 p-16 text-center hover:border-blue-500/30 transition-all">
              <Calendar className="w-24 h-24 mx-auto mb-6 text-blue-400/50" />
              <h3 className="text-2xl font-bold mb-3 text-slate-200">
                No meetings scheduled
              </h3>
              <p className="text-slate-400 mb-8 text-lg">
                Create your first meeting to get started
              </p>
              <Button 
                className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 hover:from-blue-600 hover:via-cyan-600 hover:to-teal-600 text-white font-bold rounded-xl px-8 py-6 transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/30" 
                onClick={() => setDialogOpen(true)}
              >
                <Plus className="w-5 h-5 mr-2" />
                Schedule Meeting
              </Button>
            </Card>
          ) : (
            meetings.map((meeting) => {
              const statusConfig = getStatusConfig(meeting.status);
              const isHost = isMeetingHost(meeting);
              
              return (
                <Card 
                  key={meeting.id} 
                  className="bg-gradient-to-br from-slate-900/70 to-slate-800/70 backdrop-blur-xl border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                      {/* Left Section - Meeting Info */}
                      <div className="flex-1 space-y-4">
                        {/* Title and Status */}
                        <div className="flex flex-wrap items-start gap-3">
                          <h3 className="text-2xl font-bold text-slate-100 flex-1">
                            {meeting.title}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            <Badge className={`${statusConfig.color} border font-bold px-3 py-1 flex items-center gap-1.5`}>
                              {statusConfig.icon}
                              {statusConfig.label}
                            </Badge>
                            {isHost && (
                              <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 border font-bold px-3 py-1">
                                HOST
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Description */}
                        {meeting.description && (
                          <p className="text-slate-400 leading-relaxed">
                            {meeting.description}
                          </p>
                        )}

                        {/* Meeting Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="flex items-center gap-3 bg-slate-800/50 rounded-lg px-4 py-3 border border-slate-700/50">
                            <Calendar className="w-5 h-5 text-blue-400 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs text-slate-500 font-medium">Date</p>
                              <p className="text-sm font-semibold text-slate-200 truncate">
                                {format(new Date(meeting.start_time), "MMM dd, yyyy")}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 bg-slate-800/50 rounded-lg px-4 py-3 border border-slate-700/50">
                            <Clock className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs text-slate-500 font-medium">Time</p>
                              <p className="text-sm font-semibold text-slate-200 truncate">
                                {format(new Date(meeting.start_time), "h:mm a")} - {format(new Date(meeting.end_time), "h:mm a")}
                              </p>
                            </div>
                          </div>
                          
                          <button 
                            onClick={() => openParticipantsModal(meeting)}
                            className="flex items-center gap-3 bg-slate-800/50 rounded-lg px-4 py-3 border border-slate-700/50 hover:bg-slate-700/50 transition-colors"
                          >
                            <Users className="w-5 h-5 text-teal-400 flex-shrink-0" />
                            <div className="min-w-0 text-left">
                              <p className="text-xs text-slate-500 font-medium">Participants</p>
                              <p className="text-sm font-semibold text-slate-200 truncate">
                                View List
                              </p>
                            </div>
                          </button>
                        </div>

                        {/* Meeting URL */}
                        {meeting.meeting_url && (
                          <div className="flex items-center gap-3 bg-slate-800/30 rounded-lg px-4 py-3 border border-slate-700/50">
                            <Link className="w-4 h-4 text-blue-400 flex-shrink-0" />
                            <code className="text-sm text-slate-400 truncate flex-1 font-mono">
                              {meeting.meeting_url}
                            </code>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="hover:bg-blue-500/20 hover:text-blue-400 transition-colors flex-shrink-0 h-8 w-8 p-0"
                              onClick={() => copyMeetingLink(meeting.meeting_url!)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        )}

                        {/* Status-specific features */}
                        {meeting.status === 'completed' && (
                          <div className="flex flex-wrap gap-2">
                            {meeting.recording_url && (
                              <Badge className="bg-green-500/10 text-green-400 border-green-500/30 border font-semibold px-3 py-1.5 flex items-center gap-1.5">
                                <Play className="w-3.5 h-3.5" />
                                Recording Available
                              </Badge>
                            )}
                            {meeting.summary ? (
                              <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30 border font-semibold px-3 py-1.5 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5" />
                                AI Summary Ready
                              </Badge>
                            ) : (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-purple-500/30 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300 font-semibold h-9"
                                onClick={() => generateMeetingSummary(meeting.id)}
                                disabled={generatingSummary === meeting.id}
                              >
                                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                                {generatingSummary === meeting.id ? "Generating..." : "Generate Summary"}
                              </Button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Right Section - Actions */}
                      <div className="flex lg:flex-col gap-2 lg:w-40">
                        {meeting.status === "scheduled" && isHost && (
                          <Button 
                            className="flex-1 lg:w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-green-500/20" 
                            onClick={() => handleStartMeeting(meeting.id)}
                          >
                            <Video className="w-4 h-4 mr-2" />
                            Start
                          </Button>
                        )}
                        
                        {meeting.status === "in_progress" && (
                          <Button 
                            className="flex-1 lg:w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/20" 
                            onClick={() => handleJoinMeeting(meeting.id)}
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Join
                          </Button>
                        )}
                        
                        {meeting.meeting_url && isHost && (
                          <Button 
                            variant="outline" 
                            className="flex-1 lg:w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 font-semibold rounded-lg"
                            onClick={() => openInviteModal(meeting)}
                          >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Invite
                          </Button>
                        )}
                        
                        <div className="relative dropdown-container">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="hover:bg-slate-800/60 hover:text-blue-400 transition-colors rounded-lg"
                            onClick={() => setShowDropdown(showDropdown === meeting.id ? null : meeting.id)}
                          >
                            <MoreVertical className="w-5 h-5" />
                          </Button>
                          
                          {showDropdown === meeting.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-10">
                              <button
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-200 hover:bg-slate-700/50 transition-colors"
                                onClick={() => handleEditMeeting(meeting)}
                              >
                                <Edit className="w-4 h-4" />
                                Edit Meeting
                              </button>
                              {meeting.status === "cancelled" ? (
                                <button
                                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-200 hover:bg-slate-700/50 transition-colors"
                                  onClick={() => handleShowMeeting(meeting.id)}
                                >
                                  <Eye className="w-4 h-4" />
                                  Show Meeting
                                </button>
                              ) : (
                                <button
                                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-200 hover:bg-slate-700/50 transition-colors"
                                  onClick={() => handleHideMeeting(meeting.id)}
                                >
                                  <EyeOff className="w-4 h-4" />
                                  Hide Meeting
                                </button>
                              )}
                              <button
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 transition-colors"
                                onClick={() => handleDeleteMeeting(meeting.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete Meeting
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>

      <MeetingDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={fetchMeetings}
        editingMeeting={editingMeeting}
      />

      {/* Invite Modal */}
      {selectedMeeting && showInviteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-blue-500/30 max-w-md w-full shadow-2xl shadow-blue-500/20 max-h-[90vh] flex flex-col">
            <div className="p-8 flex-shrink-0">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Invite Participants
                  </h3>
                  <p className="text-slate-400 text-sm mt-2">Share this meeting with others</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="hover:bg-slate-800/60 hover:text-blue-400 transition-colors rounded-lg -mr-2 -mt-2"
                  onClick={() => setShowInviteModal(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <div className="px-8 pb-8 flex-grow overflow-y-auto">
              <ParticipantInvite 
                meetingId={selectedMeeting.id} 
                meetingUrl={selectedMeeting.meeting_url || ""} 
                onInviteSent={() => setShowInviteModal(false)} 
              />
            </div>
          </Card>
        </div>
      )}

      {/* Participants Modal */}
      {selectedMeeting && showParticipantsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-blue-500/30 max-w-md w-full shadow-2xl shadow-blue-500/20 max-h-[90vh] flex flex-col">
            <div className="p-8 flex-shrink-0">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Meeting Participants
                  </h3>
                  <p className="text-slate-400 text-sm mt-2">List of participants for this meeting</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="hover:bg-slate-800/60 hover:text-blue-400 transition-colors rounded-lg -mr-2 -mt-2"
                  onClick={() => setShowParticipantsModal(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <div className="px-8 pb-8 flex-grow overflow-y-auto">
              {loadingParticipants ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
              ) : participants.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto text-slate-500 mb-4" />
                  <p className="text-slate-400">No participants found for this meeting</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {(participants as ParticipantWithUser[]).map((participant) => (
                    <div key={participant.id} className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:bg-slate-700/50 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {participant.name ? participant.name.charAt(0).toUpperCase() : 
                         participant.email ? participant.email.charAt(0).toUpperCase() : 
                         participant.user_id ? participant.user_id.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-200 truncate">
                          {participant.name || 
                           (participant.email ? participant.email.split('@')[0] : 
                            participant.user_id ? `User ${participant.user_id.substring(0, 8)}` : 
                            'Anonymous Participant')}
                        </p>
                        {participant.email && (
                          <p className="text-sm text-slate-400 truncate">{participant.email}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              participant.status === 'joined' 
                                ? 'text-green-400 border-green-500/30' 
                                : participant.status === 'invited' 
                                  ? 'text-blue-400 border-blue-500/30' 
                                  : 'text-slate-400 border-slate-500/30'
                            }`}
                          >
                            {participant.status || 'unknown'}
                          </Badge>
                          {participant.created_at && (
                            <span className="text-xs text-slate-500">
                              Joined {format(new Date(participant.created_at), "MMM dd, yyyy")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

    </div>
  );
};

export default MeetingsList;