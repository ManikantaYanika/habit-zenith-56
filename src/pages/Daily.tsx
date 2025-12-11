import { useState } from "react";
import { format, addDays, subDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HabitCard } from "@/components/habits/HabitCard";
import { ProgressRing } from "@/components/habits/ProgressRing";
import { NotesPanel } from "@/components/habits/NotesPanel";
import { AddHabitModal } from "@/components/habits/AddHabitModal";
import { CategoryBadge } from "@/components/habits/CategoryBadge";
import { useHabitsData } from "@/hooks/useHabitsData";
import { useNotes } from "@/hooks/useNotes";
import { ChevronLeft, ChevronRight, Calendar, Loader2 } from "lucide-react";
import { Category } from "@/types/habit";
import { Skeleton } from "@/components/ui/skeleton";

export default function Daily() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { habits, isLoading, addHabit, toggleCompletion, isCompleted, getStreak } = useHabitsData();
  const { saveNote, getNoteForDate, isSaving } = useNotes();

  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const dayOfWeek = selectedDate.getDay();

  const dayHabits = habits.filter(h => h.target_days.includes(dayOfWeek));
  const completedHabits = dayHabits.filter(h => isCompleted(h.id, dateStr));
  const percentage = dayHabits.length > 0 
    ? Math.round((completedHabits.length / dayHabits.length) * 100) 
    : 0;

  const categories = ['health', 'finance', 'work', 'learning'] as Category[];
  const categoryStats = categories.map(cat => ({
    category: cat,
    total: dayHabits.filter(h => h.category === cat).length,
    completed: completedHabits.filter(h => h.category === cat).length,
  })).filter(c => c.total > 0);

  const navigateDate = (direction: 'prev' | 'next') => {
    setSelectedDate(prev => 
      direction === 'next' ? addDays(prev, 1) : subDays(prev, 1)
    );
  };

  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  const handleToggleHabit = (habitId: string) => {
    toggleCompletion({ habitId, date: dateStr });
  };

  const handleSaveNote = (note: string, mood?: string) => {
    saveNote({ date: dateStr, note, mood });
  };

  const currentNote = getNoteForDate(dateStr);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <Skeleton className="h-16 w-full" />
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  // Transform habits to match HabitCard's expected format
  const transformedHabits = dayHabits.map(h => ({
    id: h.id,
    name: h.name,
    icon: h.icon,
    category: h.category as Category,
    targetDays: h.target_days,
    frequency: h.frequency as 'daily' | 'weekly',
    streak: getStreak(h.id),
    bestStreak: getStreak(h.id),
    completedDates: isCompleted(h.id, dateStr) ? [dateStr] : [],
    createdAt: h.created_at,
    color: 'hsl(var(--primary))'
  }));

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Date Navigation */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigateDate('prev')}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary" />
            <div className="text-center">
              <h2 className="text-lg font-semibold">
                {format(selectedDate, "EEEE")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {format(selectedDate, "MMMM d, yyyy")}
                {isToday && <span className="ml-2 text-primary">(Today)</span>}
              </p>
            </div>
          </div>

          <Button variant="ghost" size="icon" onClick={() => navigateDate('next')}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </Card>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Progress Overview */}
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <ProgressRing percentage={percentage} size={120} strokeWidth={10}>
                <span className="text-2xl font-bold font-mono">{percentage}%</span>
              </ProgressRing>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    {completedHabits.length} of {dayHabits.length} completed
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {percentage === 100 ? "Perfect day! 🎉" : "Keep going, you're doing great!"}
                  </p>
                </div>

                {/* Category breakdown */}
                <div className="flex flex-wrap gap-2">
                  {categoryStats.map(({ category, total, completed }) => (
                    <div key={category} className="flex items-center gap-2">
                      <CategoryBadge category={category} size="sm" />
                      <span className="text-xs text-muted-foreground font-mono">
                        {completed}/{total}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Habits List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Habits</h2>
              <AddHabitModal onAdd={(habit) => addHabit(habit)} />
            </div>

            <div className="space-y-3 stagger-children">
              {dayHabits.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No habits scheduled for this day.</p>
                </Card>
              ) : (
                transformedHabits.map(habit => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    onToggle={handleToggleHabit}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Streak Summary */}
          <Card className="p-5">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-base">Top Streaks</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-3">
              {habits
                .map(h => ({ ...h, streak: getStreak(h.id) }))
                .filter(h => h.streak > 0)
                .sort((a, b) => b.streak - a.streak)
                .slice(0, 5)
                .map(habit => (
                  <div key={habit.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{habit.icon}</span>
                      <span className="text-sm truncate max-w-[120px]">{habit.name}</span>
                    </div>
                    <span className="text-sm font-mono text-primary font-semibold">
                      🔥 {habit.streak}
                    </span>
                  </div>
                ))}
              {habits.filter(h => getStreak(h.id) > 0).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  Complete habits to build streaks!
                </p>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <NotesPanel 
            date={dateStr} 
            initialNote={currentNote?.note || ''}
            mood={currentNote?.mood as 'great' | 'good' | 'okay' | 'bad' | undefined}
            onSave={handleSaveNote}
          />
        </div>
      </div>
    </div>
  );
}
