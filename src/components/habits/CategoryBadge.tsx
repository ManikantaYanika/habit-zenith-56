import { Category, categoryColors, categoryIcons } from "@/types/habit";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  category: Category;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

export function CategoryBadge({ 
  category, 
  size = "md", 
  showIcon = true,
  className 
}: CategoryBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium capitalize transition-colors",
        sizeClasses[size],
        category === 'health' && "bg-success/15 text-success",
        category === 'finance' && "bg-chart-4/15 text-chart-4",
        category === 'work' && "bg-warning/15 text-warning",
        category === 'learning' && "bg-primary/15 text-primary",
        className
      )}
    >
      {showIcon && <span>{categoryIcons[category]}</span>}
      {category}
    </span>
  );
}
