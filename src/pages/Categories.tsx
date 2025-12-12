import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CategoryBadge } from "@/components/habits/CategoryBadge";
import { Progress } from "@/components/ui/progress";
import { useHabitsData } from "@/hooks/useHabitsData";
import { Category, categoryIcons } from "@/types/habit";
import { FolderKanban, Plus, TrendingUp, Target, Flame } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function Categories() {
  const { habits, isCompleted, getStreak, getBestStreak, isLoading } = useHabitsData();

  const categories: Category[] = ['health', 'finance', 'work', 'learning'];
  const today = format(new Date(), 'yyyy-MM-dd');

  const getCategoryStats = (category: Category) => {
    const catHabits = habits.filter(h => h.category === category);
    const totalStreak = catHabits.reduce((acc, h) => acc + getStreak(h.id), 0);
    const avgStreak = catHabits.length > 0 ? Math.round(totalStreak / catHabits.length) : 0;
    const bestStreak = catHabits.length > 0 
      ? Math.max(...catHabits.map(h => getBestStreak(h.id)))
      : 0;
    const completedToday = catHabits.filter(h => isCompleted(h.id, today)).length;
    
    return {
      count: catHabits.length,
      totalStreak,
      avgStreak,
      bestStreak,
      completedToday,
      habits: catHabits.map(h => ({
        ...h,
        streak: getStreak(h.id)
      })),
    };
  };

  const categoryColors: Record<Category, string> = {
    health: "from-success/20 to-success/5 border-success/30",
    finance: "from-chart-4/20 to-chart-4/5 border-chart-4/30",
    work: "from-warning/20 to-warning/5 border-warning/30",
    learning: "from-primary/20 to-primary/5 border-primary/30",
  };

  const iconBgColors: Record<Category, string> = {
    health: "bg-success/20 text-success",
    finance: "bg-chart-4/20 text-chart-4",
    work: "bg-warning/20 text-warning",
    learning: "bg-primary/20 text-primary",
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <Skeleton className="h-16 w-64" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl gradient-primary">
            <FolderKanban className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Categories</h1>
            <p className="text-sm text-muted-foreground">Organize and track habits by area</p>
          </div>
        </div>
      </div>

      {/* Category Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {categories.map(category => {
          const stats = getCategoryStats(category);
          const completionRate = stats.count > 0 
            ? Math.round((stats.completedToday / stats.count) * 100) 
            : 0;

          return (
            <Card 
              key={category}
              className={`bg-gradient-to-br ${categoryColors[category]} overflow-hidden`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${iconBgColors[category]}`}>
                      <span className="text-2xl">{categoryIcons[category]}</span>
                    </div>
                    <div>
                      <CardTitle className="capitalize">{category}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {stats.count} habit{stats.count !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Today's Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Today's progress</span>
                    <span className="font-medium">{stats.completedToday}/{stats.count}</span>
                  </div>
                  <Progress value={completionRate} className="h-2" />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-2 rounded-lg bg-background/50">
                    <Flame className="w-4 h-4 mx-auto text-warning mb-1" />
                    <p className="text-lg font-bold font-mono">{stats.totalStreak}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-background/50">
                    <TrendingUp className="w-4 h-4 mx-auto text-primary mb-1" />
                    <p className="text-lg font-bold font-mono">{stats.avgStreak}</p>
                    <p className="text-xs text-muted-foreground">Average</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-background/50">
                    <Target className="w-4 h-4 mx-auto text-success mb-1" />
                    <p className="text-lg font-bold font-mono">{stats.bestStreak}</p>
                    <p className="text-xs text-muted-foreground">Best</p>
                  </div>
                </div>

                {/* Habits List */}
                {stats.habits.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Habits
                    </p>
                    <div className="space-y-1">
                      {stats.habits.slice(0, 3).map(habit => (
                        <div 
                          key={habit.id}
                          className="flex items-center gap-2 p-2 rounded-lg bg-background/50"
                        >
                          <span>{habit.icon}</span>
                          <span className="text-sm flex-1 truncate">{habit.name}</span>
                          <span className="text-xs font-mono text-muted-foreground">
                            🔥 {habit.streak}
                          </span>
                        </div>
                      ))}
                      {stats.habits.length > 3 && (
                        <p className="text-xs text-muted-foreground text-center pt-1">
                          +{stats.habits.length - 3} more
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary */}
      <Card variant="gradient" className="p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="font-semibold">Total Overview</h3>
            <p className="text-sm text-muted-foreground">
              {habits.length} habits across {categories.filter(c => habits.some(h => h.category === c)).length} categories
            </p>
          </div>
          <div className="flex gap-2">
            {categories.map(cat => (
              <CategoryBadge key={cat} category={cat} size="sm" />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
