import { Goal } from "@/types/habit";
import { Card } from "@/components/ui/card";
import { CategoryBadge } from "./CategoryBadge";
import { cn } from "@/lib/utils";

interface GoalCardProps {
  goal: Goal;
  className?: string;
}

export function GoalCard({ goal, className }: GoalCardProps) {
  const percentage = Math.round((goal.currentValue / goal.targetValue) * 100);
  const radius = 40;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <Card variant="gradient" className={cn("p-5", className)}>
      <div className="flex items-start gap-4">
        {/* Donut Chart */}
        <div className="relative flex-shrink-0">
          <svg width="100" height="100" className="transform -rotate-90">
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={goal.color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-700 ease-out"
              style={{
                filter: percentage > 50 ? `drop-shadow(0 0 4px ${goal.color})` : 'none',
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold font-mono">{percentage}%</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold truncate">{goal.name}</h3>
            <CategoryBadge category={goal.category} size="sm" showIcon={false} />
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {goal.description}
          </p>

          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono" style={{ color: goal.color }}>
              {goal.unit === '$' ? `$${goal.currentValue}` : goal.currentValue}
            </span>
            <span className="text-muted-foreground">
              / {goal.unit === '$' ? `$${goal.targetValue}` : `${goal.targetValue} ${goal.unit}`}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
