import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export type Recording = Tables<'recordings'>;

export const useRecordings = (userId: string | null) => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecordings = useCallback(async () => {
    if (!userId) {
      setRecordings([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('recordings')
        .select('*')
        .eq('created_by', userId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      setRecordings(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching recordings:', err);
      setError('Failed to fetch recordings');
      setRecordings([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const subscribeToRecordings = useCallback(() => {
    if (!userId) return null;

    const channel = supabase
      .channel('recordings-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'recordings',
          filter: `created_by=eq.${userId}`
        },
        (payload) => {
          setRecordings((prev) => [payload.new as Recording, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'recordings',
          filter: `created_by=eq.${userId}`
        },
        (payload) => {
          setRecordings((prev) =>
            prev.map((recording) =>
              recording.id === payload.new.id ? (payload.new as Recording) : recording
            )
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'recordings',
          filter: `created_by=eq.${userId}`
        },
        (payload) => {
          setRecordings((prev) =>
            prev.filter((recording) => recording.id !== payload.old.id)
          );
        }
      )
      .subscribe();

    return channel;
  }, [userId]);

  const createRecording = async (recordingData: Partial<Recording> & { title: string }) => {
    try {
      const { data, error: insertError } = await supabase
        .from('recordings')
        .insert([{ ...recordingData, created_by: userId }])
        .select()
        .single();

      if (insertError) throw insertError;
      return data;
    } catch (err) {
      console.error('Error creating recording:', err);
      throw err;
    }
  };

  const updateRecording = async (id: string, updates: Partial<Recording>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('recordings')
        .update(updates)
        .eq('id', id)
        .eq('created_by', userId)
        .select()
        .single();

      if (updateError) throw updateError;
      return data;
    } catch (err) {
      console.error('Error updating recording:', err);
      throw err;
    }
  };

  const deleteRecording = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('recordings')
        .delete()
        .eq('id', id)
        .eq('created_by', userId);

      if (deleteError) throw deleteError;
    } catch (err) {
      console.error('Error deleting recording:', err);
      throw err;
    }
  };

  const toggleFavorite = async (id: string, isFavorite: boolean) => {
    return updateRecording(id, { is_favorite: !isFavorite });
  };

  const incrementViewCount = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('recordings')
        .select('views_count')
        .eq('id', id)
        .single();

      if (error) throw error;

      const newViewCount = (data?.views_count || 0) + 1;
      return updateRecording(id, { views_count: newViewCount });
    } catch (err) {
      console.error('Error incrementing view count:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchRecordings();
    const channel = subscribeToRecordings();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [fetchRecordings, subscribeToRecordings]);

  return {
    recordings,
    loading,
    error,
    createRecording,
    updateRecording,
    deleteRecording,
    toggleFavorite,
    incrementViewCount,
    refresh: fetchRecordings
  };
};