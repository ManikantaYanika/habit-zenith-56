import { Habit } from "@/types/habit";
import { Card } from "@/components/ui/card";
import { Check, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string) => void;
}

export function HabitCard({ habit, onToggle }: HabitCardProps) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const isCompleted = habit.completedDates.includes(today);

  return (
    <Card
      variant="interactive"
      className={cn(
        "p-4 flex items-center gap-4 group",
        isCompleted && "bg-success/5 border-success/30"
      )}
      onClick={() => onToggle(habit.id)}
    >
      {/* Checkbox */}
      <button
        className={cn(
          "w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0",
          isCompleted
            ? "bg-success border-success text-success-foreground animate-check-bounce"
            : "border-border hover:border-primary hover:bg-primary/10"
        )}
      >
        {isCompleted && <Check className="w-4 h-4" />}
      </button>

      {/* Icon */}
      <span className="text-2xl flex-shrink-0">{habit.icon}</span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className={cn(
          "font-medium truncate transition-all",
          isCompleted && "text-muted-foreground line-through"
        )}>
          {habit.name}
        </h3>
        <p className="text-xs text-muted-foreground capitalize">{habit.category}</p>
      </div>

      {/* Streak */}
      {habit.streak > 0 && (
        <div className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-mono",
          habit.streak >= 7 
            ? "bg-warning/20 text-warning" 
            : "bg-muted text-muted-foreground"
        )}>
          <Flame className={cn(
            "w-3.5 h-3.5",
            habit.streak >= 7 && "animate-pulse"
          )} />
          <span>{habit.streak}</span>
        </div>
      )}
    </Card>
  );
}
