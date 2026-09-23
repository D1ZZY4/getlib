import { TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function StatTrendBadge({
  trend,
  children,
}: {
  trend: "up" | "down";
  children: React.ReactNode;
}) {
  const TrendIcon = trend === "up" ? TrendingUp : TrendingDown;
  return (
    <Badge variant="outline">
      <TrendIcon />
      {children}
    </Badge>
  );
}
