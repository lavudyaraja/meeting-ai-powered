// hooks/use-recording-data.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type {
  Recording,
  TranscriptSegment,
  AISummary,
  ActionItem,
  Decision,
  Highlight,
  Comment,
  Participant,
  Analytics
} from '@/types/database';

export function useRecordingDetails(recordingId: string | null) {
  const [recording, setRecording] = useState<Recording | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!recordingId) {
      setLoading(false);
      return;
    }

    const fetchRecording = async () => {
      try {
        const { data, error } = await supabase
          .from('recordings')
          .select('*')
          .eq('id', recordingId)
          .single();

        if (error) throw error;
        setRecording(data as unknown as Recording);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecording();

    // Real-time subscription
    const channel = supabase
      .channel(`recording:${recordingId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'recordings',
          filter: `id=eq.${recordingId}`
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setRecording(payload.new as unknown as Recording);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [recordingId]);

  return { recording, loading, error };
}

export function useTranscript(recordingId: string | null) {
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!recordingId) {
      setLoading(false);
      return;
    }

    const fetchTranscript = async () => {
      try {
        const { data, error } = await supabase
          .from('transcript_segments')
          .select('*')
          .eq('recording_id', recordingId)
          .order('start_time', { ascending: true });

        if (error) throw error;
        setSegments(data as unknown as TranscriptSegment[]);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTranscript();

    // Real-time subscription
    const channel = supabase
      .channel(`transcript:${recordingId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'transcript_segments',
          filter: `recording_id=eq.${recordingId}`
        },
        (payload) => {
          setSegments((prev) => [...prev, payload.new as unknown as TranscriptSegment]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [recordingId]);

  return { segments, loading, error };
}

export function useAISummary(recordingId: string | null) {
  const [summary, setSummary] = useState<AISummary | null>(null);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!recordingId) {
      setLoading(false);
      return;
    }

    const fetchSummary = async () => {
      try {
        // Fetch AI summary
        const { data: summaryData, error: summaryError } = await supabase
          .from('meeting_summaries')
          .select('*')
          .eq('meeting_id', recordingId)
          .single();

        if (summaryError && summaryError.code !== 'PGRST116') throw summaryError;
        
        if (summaryData) {
          // Map meeting_summaries to AISummary structure
          const mappedSummary: AISummary = {
            id: summaryData.id,
            recording_id: recordingId,
            executive_summary: summaryData.summary,
            key_points: summaryData.key_points || [],
            sentiment: 'neutral',
            sentiment_score: 0,
            created_at: summaryData.created_at || new Date().toISOString(),
            updated_at: summaryData.created_at || new Date().toISOString()
          };
          
          setSummary(mappedSummary);
        } else {
          setSummary(null);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();

    // Real-time subscriptions
    const summaryChannel = supabase
      .channel(`summary:${recordingId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'meeting_summaries',
          filter: `meeting_id=eq.${recordingId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const summaryData = payload.new;
            const mappedSummary: AISummary = {
              id: summaryData.id,
              recording_id: recordingId,
              executive_summary: summaryData.summary,
              key_points: summaryData.key_points || [],
              sentiment: 'neutral',
              sentiment_score: 0,
              created_at: summaryData.created_at || new Date().toISOString(),
              updated_at: summaryData.created_at || new Date().toISOString()
            };
            setSummary(mappedSummary);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(summaryChannel);
    };
  }, [recordingId]);

  const updateActionItemStatus = async (itemId: string, status: ActionItem['status']) => {
    // Since action_items table doesn't exist in the schema, we'll skip this for now
    return { error: null };
  };

  return { summary, actionItems, decisions, loading, error, updateActionItemStatus };
}

export function useHighlights(recordingId: string | null, userId: string | null) {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!recordingId) {
      setLoading(false);
      return;
    }

    const fetchHighlights = async () => {
      try {
        const { data, error } = await supabase
          .from('highlights')
          .select('*')
          .eq('recording_id', recordingId)
          .order('start_time', { ascending: true });

        if (error) throw error;
        setHighlights(data as unknown as Highlight[]);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHighlights();

    // Real-time subscription
    const channel = supabase
      .channel(`highlights:${recordingId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'highlights',
          filter: `recording_id=eq.${recordingId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setHighlights((prev) => [...prev, payload.new as unknown as Highlight]);
          } else if (payload.eventType === 'DELETE') {
            setHighlights((prev) => prev.filter((h) => h.id !== (payload.old as unknown as Highlight).id));
          } else if (payload.eventType === 'UPDATE') {
            setHighlights((prev) =>
              prev.map((h) => (h.id === (payload.new as unknown as Highlight).id ? payload.new as unknown as Highlight : h))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [recordingId]);

  const addHighlight = async (highlight: Omit<Highlight, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('highlights')
      .insert([highlight] as any)
      .select()
      .single();

    return { data: data as unknown as Highlight, error };
  };

  const deleteHighlight = async (highlightId: string) => {
    const { error } = await supabase
      .from('highlights')
      .delete()
      .eq('id', highlightId);

    return { error };
  };

  return { highlights, loading, error, addHighlight, deleteHighlight };
}

export function useComments(recordingId: string | null) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!recordingId) {
      setLoading(false);
      return;
    }

    const fetchComments = async () => {
      try {
        const { data, error } = await supabase
          .from('meeting_messages')
          .select(`
            *,
            user:user_id (
              id,
              email,
              full_name
            )
          `)
          .eq('meeting_id', recordingId)
          .order('timestamp', { ascending: true });

        if (error) throw error;
        
        // Map meeting_messages to Comment structure
        const mappedComments: Comment[] = (data || []).map((msg: any) => ({
          id: msg.id,
          recording_id: recordingId,
          user_id: msg.user_id,
          text: msg.message,
          created_at: msg.timestamp,
          updated_at: msg.updated_at || msg.timestamp
        }));
        
        setComments(mappedComments);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();

    // Real-time subscription
    const channel = supabase
      .channel(`comments:${recordingId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'meeting_messages',
          filter: `meeting_id=eq.${recordingId}`
        },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            // Fetch user details
            const { data: userData } = await supabase
              .from('profiles')
              .select('id, email, full_name')
              .eq('id', (payload.new as any).user_id)
              .single();

            const mappedComment: Comment = {
              id: (payload.new as any).id,
              recording_id: recordingId,
              user_id: (payload.new as any).user_id,
              text: (payload.new as any).message,
              created_at: (payload.new as any).timestamp,
              updated_at: (payload.new as any).updated_at || (payload.new as any).timestamp
            };

            setComments((prev) => [
              ...prev,
              { ...mappedComment, user: userData } as Comment
            ]);
          } else if (payload.eventType === 'DELETE') {
            setComments((prev) => prev.filter((c) => c.id !== (payload.old as unknown as Comment).id));
          } else if (payload.eventType === 'UPDATE') {
            const mappedComment: Comment = {
              id: (payload.new as any).id,
              recording_id: recordingId,
              user_id: (payload.new as any).user_id,
              text: (payload.new as any).message,
              created_at: (payload.new as any).timestamp,
              updated_at: (payload.new as any).updated_at || (payload.new as any).timestamp
            };
            
            setComments((prev) =>
              prev.map((c) => (c.id === (payload.new as unknown as Comment).id ? { ...c, ...mappedComment } : c))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [recordingId]);

  const addComment = async (comment: {
    text: string;
    timestamp?: number;
    parent_id?: string;
  }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !recordingId) return { error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('meeting_messages')
      .insert([
        {
          meeting_id: recordingId,
          user_id: user.id,
          message: comment.text,
          timestamp: new Date().toISOString()
        }
      ] as any)
      .select()
      .single();

    if (data) {
      const mappedComment: Comment = {
        id: (data as any).id,
        recording_id: recordingId,
        user_id: (data as any).user_id,
        text: (data as any).message,
        created_at: (data as any).timestamp,
        updated_at: (data as any).updated_at || (data as any).timestamp
      };
      
      return { data: mappedComment, error };
    }
    
    return { data: null, error };
  };

  const deleteComment = async (commentId: string) => {
    const { error } = await supabase
      .from('meeting_messages')
      .delete()
      .eq('id', commentId);

    return { error };
  };

  return { comments, loading, error, addComment, deleteComment };
}

export function useParticipants(recordingId: string | null) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!recordingId) {
      setLoading(false);
      return;
    }

    const fetchParticipants = async () => {
      try {
        const { data, error } = await supabase
          .from('participants')
          .select('*')
          .eq('recording_id', recordingId)
          .order('join_time', { ascending: true });

        if (error) throw error;
        setParticipants(data as unknown as Participant[]);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [recordingId]);

  return { participants, loading, error };
}

export function useAnalytics(recordingId: string | null) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!recordingId) {
      setLoading(false);
      return;
    }

    const fetchAnalytics = async () => {
      try {
        // Since there's no analytics table in the schema, we'll return null
        setAnalytics(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [recordingId]);

  return { analytics, loading, error };
}