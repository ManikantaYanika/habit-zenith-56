import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, differenceInDays } from 'date-fns';
import type { Category } from '@/types/habit';

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  category: Category;
  frequency: string;
  target_days: number[];
  created_at: string;
  updated_at: string;
}

export interface HabitCompletion {
  id: string;
  habit_id: string;
  user_id: string;
  completed_date: string;
  created_at: string;
}

export function useHabitsData() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch habits
  const { data: habits = [], isLoading: habitsLoading } = useQuery({
    queryKey: ['habits', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Habit[];
    },
    enabled: !!user
  });

  // Fetch completions (last 90 days)
  const { data: completions = [], isLoading: completionsLoading } = useQuery({
    queryKey: ['completions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const startDate = format(subDays(new Date(), 90), 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('user_id', user.id)
        .gte('completed_date', startDate);
      
      if (error) throw error;
      return data as HabitCompletion[];
    },
    enabled: !!user
  });

  // Real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const habitsChannel = supabase
      .channel('habits-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'habits', filter: `user_id=eq.${user.id}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ['habits', user.id] });
        }
      )
      .subscribe();

    const completionsChannel = supabase
      .channel('completions-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'habit_completions', filter: `user_id=eq.${user.id}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ['completions', user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(habitsChannel);
      supabase.removeChannel(completionsChannel);
    };
  }, [user, queryClient]);

  // Add habit
  const addHabit = useMutation({
    mutationFn: async (habit: { name: string; icon: string; category: Category }) => {
      if (!user) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('habits')
        .insert({
          user_id: user.id,
          name: habit.name,
          icon: habit.icon,
          category: habit.category
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits', user?.id] });
    }
  });

  // Delete habit
  const deleteHabit = useMutation({
    mutationFn: async (habitId: string) => {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', habitId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['completions', user?.id] });
    }
  });

  // Toggle completion
  const toggleCompletion = useMutation({
    mutationFn: async ({ habitId, date }: { habitId: string; date: string }) => {
      if (!user) throw new Error('Not authenticated');
      
      // Check if already completed
      const existing = completions.find(
        c => c.habit_id === habitId && c.completed_date === date
      );
      
      if (existing) {
        // Remove completion
        const { error } = await supabase
          .from('habit_completions')
          .delete()
          .eq('id', existing.id);
        
        if (error) throw error;
        return { action: 'removed' };
      } else {
        // Add completion
        const { error } = await supabase
          .from('habit_completions')
          .insert({
            habit_id: habitId,
            user_id: user.id,
            completed_date: date
          });
        
        if (error) throw error;
        return { action: 'added' };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['completions', user?.id] });
    }
  });

  // Calculate streak for a habit
  const getStreak = (habitId: string): number => {
    const habitCompletions = completions
      .filter(c => c.habit_id === habitId)
      .map(c => c.completed_date)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    if (habitCompletions.length === 0) return 0;
    
    let streak = 0;
    const today = format(new Date(), 'yyyy-MM-dd');
    const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
    
    // Check if most recent completion is today or yesterday
    if (habitCompletions[0] !== today && habitCompletions[0] !== yesterday) {
      return 0;
    }
    
    for (let i = 0; i < habitCompletions.length; i++) {
      const expectedDate = format(subDays(new Date(), i), 'yyyy-MM-dd');
      const checkDate = i === 0 && habitCompletions[0] === yesterday 
        ? format(subDays(new Date(), 1), 'yyyy-MM-dd')
        : expectedDate;
      
      if (habitCompletions.includes(checkDate) || (i === 0 && habitCompletions[0] === yesterday)) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  // Check if habit is completed on a date
  const isCompleted = (habitId: string, date: string): boolean => {
    return completions.some(c => c.habit_id === habitId && c.completed_date === date);
  };

  // Get today's progress
  const getTodayProgress = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayCompletions = completions.filter(c => c.completed_date === today);
    return {
      completed: todayCompletions.length,
      total: habits.length,
      percentage: habits.length > 0 ? Math.round((todayCompletions.length / habits.length) * 100) : 0
    };
  };

  // Get weekly data
  const getWeeklyData = () => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    const end = endOfWeek(new Date(), { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start, end });
    
    return days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const dayCompletions = completions.filter(c => c.completed_date === dateStr);
      return {
        date: dateStr,
        day: format(day, 'EEE'),
        completed: dayCompletions.length,
        total: habits.length
      };
    });
  };

  // Get completion history for calendar (last 90 days)
  const getCompletionHistory = () => {
    const history: Record<string, number> = {};
    
    for (let i = 0; i < 90; i++) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      const dayCompletions = completions.filter(c => c.completed_date === date);
      if (dayCompletions.length > 0) {
        history[date] = dayCompletions.length;
      }
    }
    
    return history;
  };

  return {
    habits,
    completions,
    isLoading: habitsLoading || completionsLoading,
    addHabit: addHabit.mutate,
    deleteHabit: deleteHabit.mutate,
    toggleCompletion: toggleCompletion.mutate,
    isToggling: toggleCompletion.isPending,
    getStreak,
    isCompleted,
    getTodayProgress,
    getWeeklyData,
    getCompletionHistory
  };
}
