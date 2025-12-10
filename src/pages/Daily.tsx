import { useState } from "react";
import { format, addDays, subDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HabitCard } from "@/components/habits/HabitCard";
import { ProgressRing } from "@/components/habits/ProgressRing";
import { NotesPanel } from "@/components/habits/NotesPanel";
import { AddHabitModal } from "@/components/habits/AddHabitModal";
import { CategoryBadge } from "@/components/habits/CategoryBadge";
import { useHabits } from "@/hooks/useHabits";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Category } from "@/types/habit";

export default function Daily() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { habits, toggleHabit, addHabit } = useHabits();

  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const dayOfWeek = selectedDate.getDay();

  const dayHabits = habits.filter(h => h.targetDays.includes(dayOfWeek));
  const completedHabits = dayHabits.filter(h => h.completedDates.includes(dateStr));
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
              <AddHabitModal onAdd={addHabit} />
            </div>

            <div className="space-y-3 stagger-children">
              {dayHabits.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No habits scheduled for this day.</p>
                </Card>
              ) : (
                dayHabits.map(habit => (
                  <HabitCard
                    key={habit.id}
                    habit={{
                      ...habit,
                      completedDates: habit.completedDates.includes(dateStr) ? [dateStr] : [],
                    }}
                    onToggle={toggleHabit}
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
            </CardContent>
          </Card>

          {/* Notes */}
          <NotesPanel date={dateStr} />
        </div>
      </div>
    </div>
  );
}
