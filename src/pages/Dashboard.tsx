import { useState } from "react";
import { ProgressRing } from "@/components/habits/ProgressRing";
import { HabitCard } from "@/components/habits/HabitCard";
import { StatsCard } from "@/components/habits/StatsCard";
import { WeeklyChart } from "@/components/habits/WeeklyChart";
import { NotesPanel } from "@/components/habits/NotesPanel";
import { AddHabitModal } from "@/components/habits/AddHabitModal";
import { Confetti } from "@/components/habits/Confetti";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHabits } from "@/hooks/useHabits";
import { CheckCircle2, Flame, Target, TrendingUp, Award } from "lucide-react";
import { format } from "date-fns";

export default function Dashboard() {
  const [showConfetti, setShowConfetti] = useState(false);
  const { 
    habits, 
    goals,
    toggleHabit, 
    addHabit,
    getTodayProgress, 
    getWeeklyData, 
    getTotalStreak,
    today 
  } = useHabits();

  const progress = getTodayProgress();
  const weeklyData = getWeeklyData();
  const totalStreak = getTotalStreak();
  const goalsProgress = goals.length > 0 
    ? goals.reduce((acc, g) => acc + (g.currentValue / g.targetValue) * 100, 0) / goals.length
    : 0;

  const todayHabits = habits.filter(h => 
    h.targetDays.includes(new Date().getDay())
  );

  const handleToggleHabit = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    const wasCompleted = habit?.completedDates.includes(today);
    
    toggleHabit(habitId);
    
    // Show confetti when completing a habit (not when uncompleting)
    if (!wasCompleted) {
      const newCompletedCount = todayHabits.filter(h => 
        h.id === habitId || h.completedDates.includes(today)
      ).length;
      
      // Show confetti for completing all habits or every 3rd completion
      if (newCompletedCount === todayHabits.length || newCompletedCount % 3 === 0) {
        setShowConfetti(true);
      }
    }
  };

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
            trend={{ value: 12, isPositive: true }}
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
            value={`${Math.round(weeklyData.reduce((a, d) => a + d.percentage, 0) / 7)}%`}
            subtitle="completion rate"
            icon={TrendingUp}
            trend={{ value: 8, isPositive: true }}
          />
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Today's Habits */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Today's Habits</h2>
            <AddHabitModal onAdd={addHabit} />
          </div>
          
          <div className="space-y-3 stagger-children">
            {todayHabits.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No habits for today. Create your first habit!</p>
              </Card>
            ) : (
              todayHabits.map(habit => (
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
              <WeeklyChart data={weeklyData} />
            </CardContent>
          </Card>

          {/* Quick Notes */}
          <NotesPanel date={today} />
        </div>
      </section>
    </div>
  );
}
