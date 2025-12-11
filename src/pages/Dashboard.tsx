import { useState } from "react";
import { ProgressRing } from "@/components/habits/ProgressRing";
import { HabitCard } from "@/components/habits/HabitCard";
import { StatsCard } from "@/components/habits/StatsCard";
import { WeeklyChart } from "@/components/habits/WeeklyChart";
import { NotesPanel } from "@/components/habits/NotesPanel";
import { AddHabitModal } from "@/components/habits/AddHabitModal";
import { Confetti } from "@/components/habits/Confetti";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHabitsData } from "@/hooks/useHabitsData";
import { useGoals } from "@/hooks/useGoals";
import { useNotes } from "@/hooks/useNotes";
import { CheckCircle2, Flame, Target, TrendingUp, Award } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import type { Category } from "@/types/habit";

export default function Dashboard() {
  const [showConfetti, setShowConfetti] = useState(false);
  const { 
    habits, 
    isLoading: habitsLoading,
    addHabit,
    toggleCompletion,
    isCompleted,
    getStreak,
    getTodayProgress, 
    getWeeklyData
  } = useHabitsData();
  const { goals, isLoading: goalsLoading } = useGoals();
  const { saveNote, getTodayNote } = useNotes();

  const today = format(new Date(), 'yyyy-MM-dd');
  const progress = getTodayProgress();
  const weeklyData = getWeeklyData();
  
  const totalStreak = habits.reduce((sum, h) => sum + getStreak(h.id), 0);
  
  const goalsProgress = goals.length > 0 
    ? goals.reduce((acc, g) => acc + (g.current_value / g.target_value) * 100, 0) / goals.length
    : 0;

  const todayHabits = habits.filter(h => 
    h.target_days.includes(new Date().getDay())
  );

  const handleToggleHabit = (habitId: string) => {
    const wasCompleted = isCompleted(habitId, today);
    
    toggleCompletion({ habitId, date: today });
    
    // Show confetti when completing a habit (not when uncompleting)
    if (!wasCompleted) {
      const newCompletedCount = todayHabits.filter(h => 
        h.id === habitId || isCompleted(h.id, today)
      ).length;
      
      // Show confetti for completing all habits or every 3rd completion
      if (newCompletedCount === todayHabits.length || newCompletedCount % 3 === 0) {
        setShowConfetti(true);
      }
    }
  };

  const handleSaveNote = (note: string, mood?: string) => {
    saveNote({ date: today, note, mood });
  };

  const currentNote = getTodayNote();

  // Transform data for components
  const transformedHabits = todayHabits.map(h => ({
    id: h.id,
    name: h.name,
    icon: h.icon,
    category: h.category as Category,
    targetDays: h.target_days,
    frequency: h.frequency as 'daily' | 'weekly',
    streak: getStreak(h.id),
    bestStreak: getStreak(h.id),
    completedDates: isCompleted(h.id, today) ? [today] : [],
    createdAt: h.created_at,
    color: 'hsl(var(--primary))'
  }));

  const chartData = weeklyData.map(d => ({
    date: d.date,
    dayName: d.day,
    completed: d.completed,
    total: d.total,
    percentage: d.total > 0 ? Math.round((d.completed / d.total) * 100) : 0
  }));

  if (habitsLoading || goalsLoading) {
    return (
      <div className="space-y-6 lg:space-y-8 max-w-7xl mx-auto">
        <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
          <Skeleton className="h-64" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8 max-w-7xl mx-auto">
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      {/* Progress Hero */}
      <section className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        {/* Progress Ring Card */}
        <Card variant="gradient" className="p-6 lg:p-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <p className="text-sm font-medium text-muted-foreground">Today's Progress</p>
            <ProgressRing percentage={progress.percentage} size={160} strokeWidth={12}>
              <span className="text-4xl font-bold font-mono">{progress.percentage}%</span>
              <span className="text-sm text-muted-foreground">
                {progress.completed}/{progress.total} habits
              </span>
            </ProgressRing>
            <p className="text-sm text-muted-foreground">
              {format(new Date(), "EEEE, MMMM d")}
            </p>
            {progress.percentage === 100 && (
              <div className="flex items-center gap-2 text-success">
                <Award className="w-5 h-5" />
                <span className="font-medium">Perfect day!</span>
              </div>
            )}
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          <StatsCard
            title="Completed Today"
            value={progress.completed}
            subtitle={`out of ${progress.total} habits`}
            icon={CheckCircle2}
            variant="success"
          />
          <StatsCard
            title="Total Streak"
            value={totalStreak}
            subtitle="combined days"
            icon={Flame}
            variant="warning"
          />
          <StatsCard
            title="Goals Progress"
            value={`${Math.round(goalsProgress)}%`}
            subtitle={`${goals.length} active goals`}
            icon={Target}
            variant="primary"
          />
          <StatsCard
            title="Weekly Average"
            value={`${Math.round(chartData.reduce((a, d) => a + d.percentage, 0) / 7)}%`}
            subtitle="completion rate"
            icon={TrendingUp}
          />
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Today's Habits */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Today's Habits</h2>
            <AddHabitModal onAdd={(habit) => addHabit(habit)} />
          </div>
          
          <div className="space-y-3 stagger-children">
            {transformedHabits.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No habits for today. Create your first habit!</p>
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

        {/* Right Column */}
        <div className="space-y-6">
          {/* Weekly Overview */}
          <Card className="p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-base">This Week</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <WeeklyChart data={chartData} />
            </CardContent>
          </Card>

          {/* Quick Notes */}
          <NotesPanel 
            date={today} 
            initialNote={currentNote?.note || ''}
            mood={currentNote?.mood as 'great' | 'good' | 'okay' | 'bad' | undefined}
            onSave={handleSaveNote}
          />
        </div>
      </section>
    </div>
  );
}
