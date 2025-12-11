import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Category } from '@/types/habit';

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  category: Category;
  target_value: number;
  current_value: number;
  unit: string;
  color: string;
  deadline: string | null;
  created_at: string;
  updated_at: string;
}

export function useGoals() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['goals', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Goal[];
    },
    enabled: !!user
  });

  const addGoal = useMutation({
    mutationFn: async (goal: {
      name: string;
      description?: string;
      category: Category;
      target_value: number;
      unit: string;
      color: string;
      deadline?: string;
    }) => {
      if (!user) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('goals')
        .insert({
          user_id: user.id,
          ...goal
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', user?.id] });
    }
  });

  const updateGoalProgress = useMutation({
    mutationFn: async ({ goalId, currentValue }: { goalId: string; currentValue: number }) => {
      const { error } = await supabase
        .from('goals')
        .update({ current_value: currentValue })
        .eq('id', goalId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', user?.id] });
    }
  });

  const deleteGoal = useMutation({
    mutationFn: async (goalId: string) => {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', goalId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', user?.id] });
    }
  });

  return {
    goals,
    isLoading,
    addGoal: addGoal.mutate,
    updateGoalProgress: updateGoalProgress.mutate,
    deleteGoal: deleteGoal.mutate
  };
}
