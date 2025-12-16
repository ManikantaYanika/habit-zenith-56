import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

export interface DailyNote {
  id: string;
  user_id: string;
  date: string;
  note: string | null;
  mood: string | null;
  created_at: string;
  updated_at: string;
}

export function useNotes() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['notes', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('daily_notes')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(30);
      
      if (error) throw error;
      return data as DailyNote[];
    },
    enabled: !!user
  });

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('notes-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'daily_notes',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['notes', user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  const saveNote = useMutation({
    mutationFn: async ({ date, note, mood }: { date: string; note: string; mood?: string }) => {
      if (!user) throw new Error('Not authenticated');
      
      // Check if note exists for this date
      const existing = notes.find(n => n.date === date);
      
      if (existing) {
        const { error } = await supabase
          .from('daily_notes')
          .update({ note, mood })
          .eq('id', existing.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('daily_notes')
          .insert({
            user_id: user.id,
            date,
            note,
            mood
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', user?.id] });
    }
  });

  const getNoteForDate = (date: string): DailyNote | undefined => {
    return notes.find(n => n.date === date);
  };

  const getTodayNote = (): DailyNote | undefined => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return getNoteForDate(today);
  };

  return {
    notes,
    isLoading,
    saveNote: saveNote.mutate,
    isSaving: saveNote.isPending,
    getNoteForDate,
    getTodayNote
  };
}
