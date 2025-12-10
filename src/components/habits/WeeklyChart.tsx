import { cn } from "@/lib/utils";

interface DayData {
  date: string;
  dayName: string;
  completed: number;
  total: number;
  percentage: number;
}

interface WeeklyChartProps {
  data: DayData[];
  className?: string;
}

export function WeeklyChart({ data, className }: WeeklyChartProps) {
  const today = new Date().toISOString().split('T')[0];
  const maxHeight = 100;

  return (
    <div className={cn("flex items-end justify-between gap-2 h-32", className)}>
      {data.map((day, index) => {
        const isToday = day.date === today;
        const height = day.total > 0 ? (day.percentage / 100) * maxHeight : 0;
        
        return (
          <div 
            key={day.date} 
            className="flex flex-col items-center gap-2 flex-1"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Bar */}
            <div className="relative w-full h-24 flex items-end justify-center">
              <div
                className={cn(
                  "w-full max-w-8 rounded-t-lg transition-all duration-500 ease-out",
                  isToday 
                    ? "gradient-primary shadow-glow" 
                    : day.percentage === 100 
                      ? "bg-success" 
                      : day.percentage > 0 
                        ? "bg-primary/60" 
                        : "bg-muted"
                )}
                style={{ 
                  height: `${Math.max(height, day.total > 0 ? 8 : 4)}px`,
                  animationDelay: `${index * 100}ms`,
                }}
              />
              {/* Percentage label */}
              {day.percentage > 0 && (
                <span className="absolute -top-5 text-xs font-mono text-muted-foreground">
                  {day.percentage}%
                </span>
              )}
            </div>
            
            {/* Day label */}
            <span className={cn(
              "text-xs font-medium",
              isToday ? "text-primary" : "text-muted-foreground"
            )}>
              {day.dayName}
            </span>
          </div>
        );
      })}
    </div>
  );
}
