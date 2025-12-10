export type Category = 'health' | 'finance' | 'work' | 'learning';

export interface Habit {
  id: string;
  name: string;
  icon: string;
  category: Category;
  frequency: 'daily' | 'weekly';
  targetDays: number[];
  completedDates: string[];
  createdAt: string;
  color: string;
  streak: number;
  bestStreak: number;
}

export interface Goal {
  id: string;
  name: string;
  description: string;
  category: Category;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  createdAt: string;
  color: string;
}

export interface DailyNote {
  id: string;
  date: string;
  content: string;
  mood?: 'great' | 'good' | 'okay' | 'bad';
}

export interface UserSettings {
  username: string;
  theme: 'light' | 'dark' | 'system';
  reminderTime: string;
  weekStartsOn: 0 | 1;
}

export const categoryColors: Record<Category, string> = {
  health: 'hsl(var(--success))',
  finance: 'hsl(var(--chart-4))',
  work: 'hsl(var(--warning))',
  learning: 'hsl(var(--primary))',
};

export const categoryIcons: Record<Category, string> = {
  health: '💪',
  finance: '💰',
  work: '💼',
  learning: '📚',
};
