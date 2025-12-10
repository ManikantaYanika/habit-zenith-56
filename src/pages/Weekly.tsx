import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeeklyChart } from "@/components/habits/WeeklyChart";
import { StreakCounter } from "@/components/habits/StreakCounter";
import { CategoryBadge } from "@/components/habits/CategoryBadge";
import { useHabits } from "@/hooks/useHabits";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Award, Zap } from "lucide-react";
import { Category } from "@/types/habit";

export default function Weekly() {
  const { habits, getWeeklyData, getTotalStreak } = useHabits();
  const weeklyData = getWeeklyData();
  
  const weeklyAverage = Math.round(
    weeklyData.reduce((acc, d) => acc + d.percentage, 0) / weeklyData.length
  );

  const totalCompleted = weeklyData.reduce((acc, d) => acc + d.completed, 0);
  const totalPossible = weeklyData.reduce((acc, d) => acc + d.total, 0);

  const categories = ['health', 'finance', 'work', 'learning'] as Category[];
  const categoryPerformance = categories.map(cat => {
    const catHabits = habits.filter(h => h.category === cat);
    const totalStreak = catHabits.reduce((acc, h) => acc + h.streak, 0);
    const avgStreak = catHabits.length > 0 ? Math.round(totalStreak / catHabits.length) : 0;
    return { category: cat, count: catHabits.length, avgStreak };
  }).filter(c => c.count > 0);

  const topHabits = [...habits]
    .sort((a, b) => b.streak - a.streak)
    .slice(0, 5);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Weekly Average</p>
              <p className="text-3xl font-bold font-mono">{weeklyAverage}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-success/10">
              <Award className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-3xl font-bold font-mono">
                {totalCompleted}<span className="text-lg text-muted-foreground">/{totalPossible}</span>
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-warning/10">
              <Zap className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Streaks</p>
              <StreakCounter streak={getTotalStreak()} showLabel={false} size="lg" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Weekly Chart */}
          <Card className="p-6">
            <CardHeader className="p-0 pb-6">
              <CardTitle>This Week's Performance</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <WeeklyChart data={weeklyData} />
            </CardContent>
          </Card>

          {/* Day-by-day breakdown */}
          <Card className="p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-base">Daily Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              {weeklyData.map((day, index) => (
                <div key={day.date} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{day.dayName}</span>
                    <span className="text-sm text-muted-foreground font-mono">
                      {day.completed}/{day.total}
                    </span>
                  </div>
                  <Progress 
                    value={day.percentage} 
                    className="h-2"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Top Performing Habits */}
          <Card className="p-5">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Award className="w-4 h-4 text-warning" />
                Top Performers
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-3">
              {topHabits.map((habit, index) => (
                <div 
                  key={habit.id} 
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/50"
                >
                  <span className="text-lg font-bold text-muted-foreground font-mono w-6">
                    #{index + 1}
                  </span>
                  <span className="text-xl">{habit.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{habit.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{habit.category}</p>
                  </div>
                  <StreakCounter streak={habit.streak} size="sm" showLabel={false} />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Category Performance */}
          <Card className="p-5">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-base">By Category</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              {categoryPerformance.map(({ category, count, avgStreak }) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CategoryBadge category={category} size="sm" />
                    <span className="text-xs text-muted-foreground">
                      {count} habit{count !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <span className="text-sm font-mono">
                    avg 🔥 {avgStreak}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
