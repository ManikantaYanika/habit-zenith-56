import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakCounterProps {
  streak: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
  animate?: boolean;
}

export function StreakCounter({
  streak,
  size = "md",
  showLabel = true,
  className,
  animate = false,
}: StreakCounterProps) {
  const sizeClasses = {
    sm: "text-sm gap-1",
    md: "text-lg gap-1.5",
    lg: "text-2xl gap-2",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-7 h-7",
  };

  const isHot = streak >= 7;
  const isOnFire = streak >= 30;

  return (
    <div
      className={cn(
        "flex items-center font-mono",
        sizeClasses[size],
        isOnFire && "text-destructive",
        isHot && !isOnFire && "text-warning",
        !isHot && "text-muted-foreground",
        animate && streak > 0 && "animate-streak-pulse",
        className
      )}
    >
      <Flame
        className={cn(
          iconSizes[size],
          isOnFire && "fill-destructive",
          isHot && !isOnFire && "fill-warning",
        )}
      />
      <span className="font-semibold">{streak}</span>
      {showLabel && (
        <span className="text-muted-foreground font-normal text-sm ml-1">
          {streak === 1 ? "day" : "days"}
        </span>
      )}
    </div>
  );
}
