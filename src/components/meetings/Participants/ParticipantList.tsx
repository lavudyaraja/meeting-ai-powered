import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MicOff, VideoOff, Crown, User } from "lucide-react";

interface Participant {
  id: string;
  meeting_id: string;
  user_id: string;
  status: string;
  created_at: string;
  profiles: {
    full_name: string;
    avatar_url: string | null;
  } | null;
}

interface ParticipantListProps {
  meetingId: string;
  currentUserId: string;
}

const ParticipantList = ({ meetingId, currentUserId }: ParticipantListProps) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (meetingId) {
      fetchParticipants();
      
      // Set up real-time subscription for participants changes
      const channel = supabase
        .channel('participants_changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'meeting_participants',
            filter: `meeting_id=eq.${meetingId}`
          },
          (payload) => {
            fetchParticipants();
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'meeting_participants',
            filter: `meeting_id=eq.${meetingId}`
          },
          (payload) => {
            fetchParticipants();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [meetingId]);

  const fetchParticipants = async () => {
    try {
      // First, get the participants
      const { data: participantsData, error: participantsError } = await supabase
        .from("meeting_participants")
        .select(`
          id,
          meeting_id,
          user_id,
          status,
          created_at
        `)
        .eq("meeting_id", meetingId);

      if (participantsError) throw participantsError;

      // If we have participants, get their profile information
      if (participantsData && participantsData.length > 0) {
        const userIds = participantsData.map(p => p.user_id).filter(Boolean);
        
        if (userIds.length > 0) {
          const { data: profilesData, error: profilesError } = await supabase
            .from("profiles")
            .select("id, full_name, avatar_url")
            .in("id", userIds);

          if (profilesError) throw profilesError;

          // Create a map of user_id to profile for easy lookup
          const profileMap = profilesData?.reduce((acc, profile) => {
            acc[profile.id] = profile;
            return acc;
          }, {} as Record<string, { full_name: string; avatar_url: string | null }>);

          // Merge participant data with profile data
          const participantsWithProfiles = participantsData.map(participant => ({
            ...participant,
            profiles: participant.user_id ? (profileMap?.[participant.user_id] || null) : null
          }));

          setParticipants(participantsWithProfiles);
        } else {
          // No user IDs to look up, just set the participants data
          setParticipants(participantsData.map(p => ({ ...p, profiles: null })));
        }
      } else {
        // No participants
        setParticipants([]);
      }
    } catch (error: any) {
      toast({
        title: "Error fetching participants",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "invited":
        return <Badge variant="outline" className="text-xs">Invited</Badge>;
      case "accepted":
        return <Badge className="bg-green-100 text-green-800 text-xs">Accepted</Badge>;
      case "attended":
        return <Badge className="bg-blue-100 text-blue-800 text-xs">Attended</Badge>;
      case "declined":
        return <Badge className="bg-red-100 text-red-800 text-xs">Declined</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-gray-200" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {participants.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No participants yet</p>
      ) : (
        participants.map((participant) => (
          <Card 
            key={participant.id} 
            className="p-3 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                {participant.profiles?.avatar_url ? (
                  <img 
                    src={participant.profiles.avatar_url} 
                    alt={participant.profiles.full_name || "Participant"} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {(participant.profiles?.full_name || "U").charAt(0).toUpperCase()}
                  </div>
                )}
                {participant.user_id === currentUserId && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm text-purple-900 truncate">
                    {participant.profiles?.full_name || "Unknown User"}
                  </p>
                  {participant.user_id === currentUserId && (
                    <Badge className="text-xs bg-amber-100 text-amber-700">You</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusBadge(participant.status)}
                  <div className="flex gap-1">
                    <MicOff className="w-3 h-3 text-red-500" />
                    <VideoOff className="w-3 h-3 text-red-500" />
                  </div>
                </div>
              </div>
              
              {participant.user_id === currentUserId && (
                <Crown className="w-4 h-4 text-amber-500" />
              )}
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default ParticipantList;