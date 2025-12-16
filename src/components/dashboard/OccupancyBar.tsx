import { cn } from "@/lib/utils";

interface OccupancyBarProps {
  label: string;
  value: number;
  maxValue?: number;
  className?: string;
}

export function OccupancyBar({ label, value, maxValue = 100, className }: OccupancyBarProps) {
  const percentage = Math.min((value / maxValue) * 100, 100);

  const getColorClass = () => {
    if (percentage >= 80) return "bg-destructive";
    if (percentage >= 60) return "bg-accent";
    return "bg-primary";
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-sm font-semibold text-muted-foreground">{Math.round(percentage)}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", getColorClass())}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
