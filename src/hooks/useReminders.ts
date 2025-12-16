import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Reminder {
  id: string;
  user_id: string;
  habit_id: string | null;
  time: string;
  days: number[];
  enabled: boolean;
  created_at: string;
}

export function useReminders() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: reminders = [], isLoading } = useQuery({
    queryKey: ['reminders', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .eq('user_id', user.id)
        .order('time', { ascending: true });
      
      if (error) throw error;
      return data as Reminder[];
    },
    enabled: !!user
  });

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('reminders-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reminders',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['reminders', user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  const addReminder = useMutation({
    mutationFn: async (reminder: { habit_id?: string; time: string; days: number[] }) => {
      if (!user) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('reminders')
        .insert({
          user_id: user.id,
          habit_id: reminder.habit_id || null,
          time: reminder.time,
          days: reminder.days,
          enabled: true
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders', user?.id] });
    }
  });

  const updateReminder = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Pick<Reminder, 'time' | 'days' | 'enabled'>> }) => {
      const { error } = await supabase
        .from('reminders')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders', user?.id] });
    }
  });

  const deleteReminder = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('reminders')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders', user?.id] });
    }
  });

  return {
    reminders,
    isLoading,
    addReminder: addReminder.mutate,
    updateReminder: updateReminder.mutate,
    deleteReminder: deleteReminder.mutate,
    isAdding: addReminder.isPending,
    isUpdating: updateReminder.isPending,
    isDeleting: deleteReminder.isPending
  };
}
