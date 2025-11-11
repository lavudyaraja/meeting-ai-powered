import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Meeting } from '@/lib/types';
import { Tables } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Video, Copy, Check, ArrowLeft, ExternalLink, Mail, UserPlus, Download, Share2, MoreVertical, Trash2, Edit, Globe } from 'lucide-react';

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
      
      if (meetingData) {
        const mappedMeeting: Meeting = {
          id: meetingData.id,
          title: meetingData.title,
          description: meetingData.description || undefined,
          start_time: meetingData.start_time,
          end_time: meetingData.end_time || undefined,
          host_id: meetingData.host_id || '',
          meeting_link: meetingData.meeting_url || undefined,
          reminder_sent: false,
          created_at: meetingData.created_at || new Date().toISOString(),
          updated_at: meetingData.updated_at || new Date().toISOString(),
        };
        setMeeting(mappedMeeting);
      }

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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMeetingStatus = () => {
    if (!meeting) return 'unknown';
    const now = new Date();
    const start = new Date(meeting.start_time);
    const end = meeting.end_time ? new Date(meeting.end_time) : null;

    if (now < start) return 'upcoming';
    if (end && now > end) return 'ended';
    return 'live';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'live': return 'bg-green-100 text-green-700 border-green-200';
      case 'ended': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading meeting details...</p>
        </div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Meeting Not Found</h2>
          <p className="text-gray-600 mb-6">The meeting you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/meetings')}>
            Return to Meetings
          </Button>
        </div>
      </div>
    );
  }

  const meetingStatus = getMeetingStatus();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/meetings')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Meetings
            </Button>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Meeting Header Card */}
            <Card className="border border-gray-200">
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h1 className="text-3xl font-bold text-gray-900">{meeting.title}</h1>
                      <Badge className={`${getStatusColor(meetingStatus)} border font-semibold`}>
                        {meetingStatus === 'live' && <span className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse"></span>}
                        {meetingStatus.toUpperCase()}
                      </Badge>
                    </div>
                    {meeting.description && (
                      <p className="text-gray-600 text-lg">{meeting.description}</p>
                    )}
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Video className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Meeting Details Grid */}
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-blue-600 uppercase mb-1">Start Time</p>
                        <p className="text-sm font-bold text-gray-900">{formatDateTime(meeting.start_time)}</p>
                      </div>
                    </div>
                  </div>

                  {meeting.end_time && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Clock className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-emerald-600 uppercase mb-1">End Time</p>
                          <p className="text-sm font-bold text-gray-900">{formatDateTime(meeting.end_time)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Meeting Link */}
                {meeting.meeting_link && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Globe className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-purple-600 uppercase mb-2">Meeting Link</p>
                        <div className="flex items-center gap-2">
                          <code className="bg-white border border-purple-200 px-3 py-2 rounded-lg text-sm flex-1 truncate text-gray-700">
                            {meeting.meeting_link}
                          </code>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={copyMeetingLink}
                            className="flex-shrink-0"
                          >
                            {copied ? (
                              <>
                                <Check className="w-4 h-4 mr-2" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 mr-2" />
                                Copy
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={() => navigate(`/video/${meeting.id}`)} 
                    size="lg" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <Video className="w-5 h-5 mr-2" />
                    Join Meeting
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="sm:w-auto"
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Open Link
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Meeting Info */}
            <Card className="border border-gray-200">
              <CardHeader className="border-b border-gray-200 bg-gray-50">
                <CardTitle className="text-lg font-bold text-gray-900">Meeting Information</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Meeting ID</p>
                    <p className="text-sm font-mono text-gray-900 bg-gray-100 px-3 py-2 rounded border border-gray-200">{meeting.id}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Host ID</p>
                    <p className="text-sm font-mono text-gray-900 bg-gray-100 px-3 py-2 rounded border border-gray-200">{meeting.host_id}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Created</p>
                    <p className="text-sm text-gray-900">{new Date(meeting.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Last Updated</p>
                    <p className="text-sm text-gray-900">{new Date(meeting.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Participants Card */}
            <Card className="border border-gray-200">
              <CardHeader className="border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                    <Users className="w-5 h-5 text-gray-600" />
                    Participants
                    <Badge variant="secondary" className="ml-2">
                      {participants.length}
                    </Badge>
                  </CardTitle>
                  <Button size="sm" variant="outline">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                {participants.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">No participants yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {participants.map((participant) => (
                      <div
                        key={participant.id}
                        className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {participant.user_id?.substring(0, 2).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              User {participant.user_id?.substring(0, 8) || 'Unknown'}
                            </p>
                            <p className="text-xs text-gray-500">ID: {participant.user_id || 'N/A'}</p>
                          </div>
                        </div>
                        <Badge 
                          variant={participant.status === 'joined' ? 'default' : 'secondary'}
                          className={
                            participant.status === 'joined' 
                              ? 'bg-green-100 text-green-700 border-green-200' 
                              : 'bg-gray-100 text-gray-700 border-gray-200'
                          }
                        >
                          {participant.status || 'unknown'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border border-gray-200">
              <CardHeader className="border-b border-gray-200 bg-gray-50">
                <CardTitle className="text-lg font-bold text-gray-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email Invite
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Export Details
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Meeting
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};