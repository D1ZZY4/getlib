import { TrendingDown, TrendingUp } from "lucide-react";

import { StatTrendBadge } from "@/components/stat-trend-badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export interface OverviewStat {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  footer: string;
  subfooter: string;
}

function StatCard({ stat }: { stat: OverviewStat }) {
  const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{stat.label}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {stat.value}
        </CardTitle>
        <CardAction>
          <StatTrendBadge trend={stat.trend}>{stat.delta}</StatTrendBadge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {stat.footer} <TrendIcon className="size-4" />
        </div>
        <div className="text-muted-foreground">{stat.subfooter}</div>
      </CardFooter>
    </Card>
  );
}

export function SectionCards({
  stats,
  loading,
}: {
  stats?: OverviewStat[];
  loading?: boolean;
}) {
  if (loading || !stats) {
    return (
      <div
        role="status"
        aria-label="Loading overview"
        className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {["libraries", "documents", "jobs", "health"].map((key) => (
          <Card key={key} className="@container/card">
            <CardHeader>
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-8 w-20" />
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-28" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} stat={stat} />
      ))}
    </div>
  );
}
