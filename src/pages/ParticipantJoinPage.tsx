import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const ParticipantJoinPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [waitingApproval, setWaitingApproval] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        if (!id) {
          setError("Invalid join link");
          setChecking(false);
          return;
        }

        // Persist meeting id for post-login redirect
        sessionStorage.setItem("meetingId", id);

        // Check auth session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/auth/login", { replace: true, state: { from: location } });
          return;
        }

        // Ensure a participant record exists in meeting_participants
        const { data: existing, error: fetchErr } = await supabase
          .from('meeting_participants')
          .select('*')
          .eq('meeting_id', id)
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (fetchErr) {
          // proceed anyway, but log
          console.warn('fetch participant error', fetchErr);
        }

        if (!existing) {
          // Create a pending entry so host can admit
          await supabase.from('meeting_participants').insert({
            meeting_id: id,
            user_id: session.user.id,
            status: 'pending'
          });
        }

        // If already accepted previously, route directly
        if (existing && (existing as { status?: string }).status === 'accepted') {
          navigate(`/video/${id}`, { replace: true });
          return;
        }

        // Otherwise wait for host to accept (realtime subscription)
        setWaitingApproval(true);
        setChecking(false);

        type MeetingParticipant = { meeting_id: string; user_id: string; status: 'invited' | 'accepted' | 'declined' | 'attended' | 'pending' };
        const channel = supabase
          .channel(`admit-${id}-${session.user.id}`)
          .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'meeting_participants',
            filter: `meeting_id=eq.${id}`
          }, (payload: { new: MeetingParticipant }) => {
            const row = payload.new;
            if (row.user_id === session.user.id && row.status === 'accepted') {
              navigate(`/video/${id}`, { replace: true });
            }
          })
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      } catch (e) {
        console.error(e as Error);
        setError('Failed to process join request');
      } finally {
        setChecking(false);
      }
    };
    run();
  }, [id, navigate, location]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-2">Unable to Join</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  if (waitingApproval) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-2">Waiting for Host</h1>
          <p className="text-gray-600">The host will admit you shortly.</p>
        </div>
      </div>
    );
  }

  return null;
};

export default ParticipantJoinPage;