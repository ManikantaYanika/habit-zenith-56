import { useState, useEffect } from 'react';
import { Habit, Goal, DailyNote, UserSettings } from '@/types/habit';
import { format, isToday, parseISO, differenceInDays, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';

const defaultHabits: Habit[] = [
  {
    id: '1',
    name: 'Morning Exercise',
    icon: '🏃',
    category: 'health',
    frequency: 'daily',
    targetDays: [0, 1, 2, 3, 4, 5, 6],
    completedDates: [
      format(new Date(), 'yyyy-MM-dd'),
      format(new Date(Date.now() - 86400000), 'yyyy-MM-dd'),
      format(new Date(Date.now() - 172800000), 'yyyy-MM-dd'),
    ],
    createdAt: '2024-01-01',
    color: 'hsl(var(--success))',
    streak: 3,
    bestStreak: 15,
  },
  {
    id: '2',
    name: 'Read 30 minutes',
    icon: '📖',
    category: 'learning',
    frequency: 'daily',
    targetDays: [0, 1, 2, 3, 4, 5, 6],
    completedDates: [
      format(new Date(Date.now() - 86400000), 'yyyy-MM-dd'),
      format(new Date(Date.now() - 172800000), 'yyyy-MM-dd'),
    ],
    createdAt: '2024-01-01',
    color: 'hsl(var(--primary))',
    streak: 2,
    bestStreak: 21,
  },
  {
    id: '3',
    name: 'Save $10',
    icon: '💵',
    category: 'finance',
    frequency: 'daily',
    targetDays: [1, 2, 3, 4, 5],
    completedDates: [
      format(new Date(), 'yyyy-MM-dd'),
    ],
    createdAt: '2024-01-01',
    color: 'hsl(var(--chart-4))',
    streak: 1,
    bestStreak: 30,
  },
  {
    id: '4',
    name: 'Drink 8 glasses of water',
    icon: '💧',
    category: 'health',
    frequency: 'daily',
    targetDays: [0, 1, 2, 3, 4, 5, 6],
    completedDates: [
      format(new Date(), 'yyyy-MM-dd'),
      format(new Date(Date.now() - 86400000), 'yyyy-MM-dd'),
    ],
    createdAt: '2024-01-01',
    color: 'hsl(var(--chart-4))',
    streak: 2,
    bestStreak: 45,
  },
  {
    id: '5',
    name: 'Meditate',
    icon: '🧘',
    category: 'health',
    frequency: 'daily',
    targetDays: [0, 1, 2, 3, 4, 5, 6],
    completedDates: [],
    createdAt: '2024-01-01',
    color: 'hsl(var(--chart-5))',
    streak: 0,
    bestStreak: 10,
  },
  {
    id: '6',
    name: 'Learn new skill',
    icon: '🎯',
    category: 'work',
    frequency: 'daily',
    targetDays: [1, 2, 3, 4, 5],
    completedDates: [],
    createdAt: '2024-01-01',
    color: 'hsl(var(--warning))',
    streak: 0,
    bestStreak: 14,
  },
];

const defaultGoals: Goal[] = [
  {
    id: '1',
    name: 'Run 100km this month',
    description: 'Complete 100km of running',
    category: 'health',
    targetValue: 100,
    currentValue: 67,
    unit: 'km',
    deadline: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
    createdAt: '2024-01-01',
    color: 'hsl(var(--success))',
  },
  {
    id: '2',
    name: 'Read 4 books',
    description: 'Complete 4 books this month',
    category: 'learning',
    targetValue: 4,
    currentValue: 2,
    unit: 'books',
    deadline: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
    createdAt: '2024-01-01',
    color: 'hsl(var(--primary))',
  },
  {
    id: '3',
    name: 'Save $500',
    description: 'Build emergency fund',
    category: 'finance',
    targetValue: 500,
    currentValue: 350,
    unit: '$',
    deadline: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
    createdAt: '2024-01-01',
    color: 'hsl(var(--chart-4))',
  },
];

const defaultSettings: UserSettings = {
  username: 'Alex',
  theme: 'light',
  reminderTime: '08:00',
  weekStartsOn: 1,
};

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(defaultHabits);
  const [goals, setGoals] = useState<Goal[]>(defaultGoals);
  const [notes, setNotes] = useState<DailyNote[]>([]);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  const today = format(new Date(), 'yyyy-MM-dd');

  const toggleHabit = (habitId: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id !== habitId) return habit;
      
      const isCompleted = habit.completedDates.includes(today);
      let newCompletedDates: string[];
      let newStreak = habit.streak;
      
      if (isCompleted) {
        newCompletedDates = habit.completedDates.filter(d => d !== today);
        newStreak = Math.max(0, newStreak - 1);
      } else {
        newCompletedDates = [...habit.completedDates, today];
        newStreak = newStreak + 1;
      }
      
      return {
        ...habit,
        completedDates: newCompletedDates,
        streak: newStreak,
        bestStreak: Math.max(habit.bestStreak, newStreak),
      };
    }));
  };

  const addHabit = (habit: Omit<Habit, 'id' | 'createdAt' | 'completedDates' | 'streak' | 'bestStreak'>) => {
    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString(),
      createdAt: today,
      completedDates: [],
      streak: 0,
      bestStreak: 0,
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const deleteHabit = (habitId: string) => {
    setHabits(prev => prev.filter(h => h.id !== habitId));
  };

  const addGoal = (goal: Omit<Goal, 'id' | 'createdAt' | 'currentValue'>) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
      createdAt: today,
      currentValue: 0,
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const updateGoalProgress = (goalId: string, value: number) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, currentValue: Math.min(value, goal.targetValue) }
        : goal
    ));
  };

  const deleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(g => g.id !== goalId));
  };

  const addNote = (note: Omit<DailyNote, 'id'>) => {
    const newNote: DailyNote = {
      ...note,
      id: Date.now().toString(),
    };
    setNotes(prev => [...prev, newNote]);
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const getTodayProgress = () => {
    const todayHabits = habits.filter(h => h.targetDays.includes(new Date().getDay()));
    const completed = todayHabits.filter(h => h.completedDates.includes(today)).length;
    return {
      completed,
      total: todayHabits.length,
      percentage: todayHabits.length > 0 ? Math.round((completed / todayHabits.length) * 100) : 0,
    };
  };

  const getWeeklyData = () => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: settings.weekStartsOn });
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: settings.weekStartsOn });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
    
    return days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const dayHabits = habits.filter(h => h.targetDays.includes(day.getDay()));
      const completed = dayHabits.filter(h => h.completedDates.includes(dateStr)).length;
      
      return {
        date: dateStr,
        dayName: format(day, 'EEE'),
        completed,
        total: dayHabits.length,
        percentage: dayHabits.length > 0 ? Math.round((completed / dayHabits.length) * 100) : 0,
      };
    });
  };

  const getMonthlyData = () => {
    const monthStart = startOfMonth(new Date());
    const monthEnd = endOfMonth(new Date());
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    return days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const dayHabits = habits.filter(h => h.targetDays.includes(day.getDay()));
      const completed = dayHabits.filter(h => h.completedDates.includes(dateStr)).length;
      
      return {
        date: dateStr,
        day: day.getDate(),
        completed,
        total: dayHabits.length,
        percentage: dayHabits.length > 0 ? Math.round((completed / dayHabits.length) * 100) : 0,
      };
    });
  };

  const getTotalStreak = () => {
    return habits.reduce((acc, h) => acc + h.streak, 0);
  };

  return {
    habits,
    goals,
    notes,
    settings,
    toggleHabit,
    addHabit,
    deleteHabit,
    addGoal,
    updateGoalProgress,
    deleteGoal,
    addNote,
    updateSettings,
    getTodayProgress,
    getWeeklyData,
    getMonthlyData,
    getTotalStreak,
    today,
  };
}
