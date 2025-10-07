import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Video, Calendar, Clock, Users, Sparkles, X } from "lucide-react";
import { format } from "date-fns";

interface Meeting {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  status: string;
  meeting_url?: string;
  host_id?: string;
}

const ParticipantJoin = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isJoining, setIsJoining] = useState(false);

  const meetingId = searchParams.get("meetingId");

  useEffect(() => {
    if (meetingId) {
      fetchMeetingDetails();
      fetchCurrentUser();
    } else {
      toast({
        title: "Invalid Meeting Link",
        description: "The meeting link is invalid or expired.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [meetingId]);

  const fetchCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  const fetchMeetingDetails = async () => {
    if (!meetingId) return;

    try {
      const { data, error } = await supabase
        .from("meetings")
        .select("*")
        .eq("id", meetingId)
        .single();

      if (error) throw error;
      
      if (!data) {
        toast({
          title: "Meeting Not Found",
          description: "The meeting you're trying to join does not exist.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setMeeting(data);
    } catch (error: any) {
      toast({
        title: "Error fetching meeting",
        description: error.message,
        variant: "destructive",
      });
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinMeeting = async () => {
    if (!meetingId || !meeting || !currentUser) return;

    setIsJoining(true);

    try {
      // Add user as participant if not already added
      const { error: participantError } = await supabase
        .from("meeting_participants")
        .upsert({
          meeting_id: meetingId,
          user_id: currentUser.id,
          status: "accepted"
        }, {
          onConflict: "meeting_id,user_id"
        });

      if (participantError) throw participantError;

      // Update meeting status if it's scheduled
      if (meeting.status === "scheduled") {
        const { error: updateError } = await supabase
          .from("meetings")
          .update({ status: "in_progress" })
          .eq("id", meetingId);

        if (updateError) throw updateError;
      }

      // Store meeting ID in sessionStorage for the VideoConference component to access
      sessionStorage.setItem('meetingId', meetingId);
      
      // Navigate to video conference
      navigate(`/dashboard#video`);
      
      toast({
        title: "Success",
        description: "You have successfully joined the meeting!",
      });
    } catch (error: any) {
      toast({
        title: "Error joining meeting",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
        <Card className="max-w-md w-full p-8 border-2 border-purple-200 shadow-2xl bg-white/90 backdrop-blur">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-lg text-indigo-700">Loading meeting details...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!meeting) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <Card className="max-w-4xl w-full p-12 border-2 border-purple-200 shadow-2xl bg-white/90 backdrop-blur">
        <div className="text-center space-y-8">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-3xl opacity-40 animate-pulse" />
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-8 shadow-2xl">
                <Video className="w-20 h-20 text-white" />
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
              Meeting Invitation
            </h2>
            <p className="text-lg text-indigo-700">
              You've been invited to join a meeting
            </p>
          </div>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-purple-900">{meeting.title}</h3>
              
              {meeting.description && (
                <p className="text-gray-700">{meeting.description}</p>
              )}
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 justify-center">
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
                  {meeting.status.replace("_", " ")}
                </span>
              </div>
              
              <div className="pt-4">
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm py-1">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI-Powered Meeting
                </Badge>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 shadow-lg">
              <Sparkles className="w-8 h-8 text-blue-700 mx-auto mb-2" />
              <p className="font-semibold text-blue-900">AI Insights</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 shadow-lg">
              <Sparkles className="w-8 h-8 text-purple-700 mx-auto mb-2" />
              <p className="font-semibold text-purple-900">Transcription</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 shadow-lg">
              <Sparkles className="w-8 h-8 text-emerald-700 mx-auto mb-2" />
              <p className="font-semibold text-emerald-900">Translation</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 shadow-lg">
              <Sparkles className="w-8 h-8 text-amber-700 mx-auto mb-2" />
              <p className="font-semibold text-amber-900">Action Items</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={handleJoinMeeting}
              disabled={isJoining}
              className="gap-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all text-lg px-10 py-6"
            >
              {isJoining ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Joining...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  Join Meeting
                </>
              )}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleCancel}
              className="gap-2 border-purple-300 text-purple-700 hover:bg-purple-50 text-lg px-10 py-6"
            >
              <X className="w-6 h-6" />
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ParticipantJoin;