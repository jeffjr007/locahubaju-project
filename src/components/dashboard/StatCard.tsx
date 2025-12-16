import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    positive: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, icon: Icon, description, trend, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "relative bg-card rounded-2xl p-6 border border-border/50 hover-lift overflow-hidden",
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          {trend && (
            <span
              className={cn(
                "text-sm font-semibold",
                trend.positive ? "text-success" : "text-destructive"
              )}
            >
              {trend.positive ? "+" : ""}{trend.value}%
            </span>
          )}
        </div>

        <p className="text-muted-foreground text-sm mb-1">{title}</p>
        <p className="text-3xl font-bold text-foreground">{value}</p>
        {description && (
          <p className="text-muted-foreground text-xs mt-2">{description}</p>
        )}
      </div>
    </div>
  );
}
