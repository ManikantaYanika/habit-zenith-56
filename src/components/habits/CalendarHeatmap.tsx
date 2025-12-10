import { cn } from "@/lib/utils";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay } from "date-fns";

interface DayData {
  date: string;
  day: number;
  completed: number;
  total: number;
  percentage: number;
}

interface CalendarHeatmapProps {
  data: DayData[];
  className?: string;
}

export function CalendarHeatmap({ data, className }: CalendarHeatmapProps) {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const firstDayOfWeek = getDay(monthStart);
  
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getIntensityClass = (percentage: number) => {
    if (percentage === 0) return "bg-muted";
    if (percentage < 25) return "bg-primary/20";
    if (percentage < 50) return "bg-primary/40";
    if (percentage < 75) return "bg-primary/60";
    if (percentage < 100) return "bg-primary/80";
    return "bg-success";
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs text-muted-foreground font-medium py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for offset */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        
        {/* Day cells */}
        {data.map((day, index) => {
          const isToday = day.date === format(today, 'yyyy-MM-dd');
          
          return (
            <div
              key={day.date}
              className={cn(
                "aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all duration-200 hover:scale-110 cursor-pointer",
                getIntensityClass(day.percentage),
                isToday && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                day.percentage === 100 && "text-success-foreground",
                day.percentage > 0 && day.percentage < 100 && "text-primary-foreground",
                day.percentage === 0 && "text-muted-foreground"
              )}
              title={`${day.date}: ${day.completed}/${day.total} completed`}
              style={{ animationDelay: `${index * 20}ms` }}
            >
              {day.day}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="w-3 h-3 rounded bg-muted" />
        <div className="w-3 h-3 rounded bg-primary/30" />
        <div className="w-3 h-3 rounded bg-primary/50" />
        <div className="w-3 h-3 rounded bg-primary/70" />
        <div className="w-3 h-3 rounded bg-success" />
        <span>More</span>
      </div>
    </div>
  );
}
