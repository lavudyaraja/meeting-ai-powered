import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Meeting } from '@/lib/types';
import { Tables } from '@/integrations/supabase/types'; // Import the correct types
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Video, Copy, Check } from 'lucide-react';

// Define the correct type for meeting participants based on the database schema
type MeetingParticipant = Tables<'meeting_participants'>;

export const MeetingViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [participants, setParticipants] = useState<MeetingParticipant[]>([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchMeetingDetails();
    }
  }, [id]);

  const fetchMeetingDetails = async () => {
    try {
      const { data: meetingData, error: meetingError } = await supabase
        .from('meetings')
        .select('*')
        .eq('id', id)
        .single();

      if (meetingError) throw meetingError;
      
      // Map database meeting to our Meeting interface
      if (meetingData) {
        const mappedMeeting: Meeting = {
          id: meetingData.id,
          title: meetingData.title,
          description: meetingData.description || undefined,
          start_time: meetingData.start_time,
          end_time: meetingData.end_time || undefined,
          host_id: meetingData.host_id || '',
          meeting_link: meetingData.meeting_url || undefined, // Map meeting_url to meeting_link
          reminder_sent: false, // This field doesn't exist in DB, defaulting to false
          created_at: meetingData.created_at || new Date().toISOString(),
          updated_at: meetingData.updated_at || new Date().toISOString(),
        };
        setMeeting(mappedMeeting);
      }

      // Use the correct table name 'meeting_participants'
      const { data: participantsData, error: participantsError } = await supabase
        .from('meeting_participants')
        .select('*')
        .eq('meeting_id', id);

      if (participantsError) throw participantsError;
      setParticipants(participantsData || []);
    } catch (error) {
      console.error('Error fetching meeting:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyMeetingLink = () => {
    if (meeting?.meeting_link) {
      navigator.clipboard.writeText(meeting.meeting_link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'short'
    });
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading meeting details...</div>;
  }

  if (!meeting) {
    return <div className="text-center p-8">Meeting not found</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <Button variant="outline" onClick={() => navigate('/meetings')}>
        ← Back to Meetings
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{meeting.title}</CardTitle>
          {meeting.description && (
            <p className="text-gray-600 mt-2">{meeting.description}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            <span className="font-medium">Start:</span>
            <span>{formatDateTime(meeting.start_time)}</span>
          </div>

          {meeting.end_time && (
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-500" />
              <span className="font-medium">End:</span>
              <span>{formatDateTime(meeting.end_time)}</span>
            </div>
          )}

          {meeting.meeting_link && (
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-purple-500" />
              <span className="font-medium">Meeting Link:</span>
              <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1">
                {meeting.meeting_link}
              </code>
              <Button size="sm" variant="outline" onClick={copyMeetingLink}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          )}

          <div className="pt-4">
            <Button onClick={() => navigate(`/video/${meeting.id}`)} size="lg" className="w-full">
              <Video className="w-5 h-5 mr-2" />
              Join Meeting
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Participants ({participants.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  {/* Since the participant table doesn't have name/email fields, we'll display user_id */}
                  <div className="font-medium">User ID: {participant.user_id || 'Unknown'}</div>
                </div>
                <Badge variant={participant.status === 'joined' ? 'default' : 'secondary'}>
                  {participant.status || 'unknown'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};