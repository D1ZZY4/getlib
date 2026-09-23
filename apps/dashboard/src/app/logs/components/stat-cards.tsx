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
export interface LogTile {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  footer: string;
  subfooter: string;
}

function TileCard({ tile }: { tile: LogTile }) {
  const TrendIcon = tile.trend === "up" ? TrendingUp : TrendingDown;
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{tile.label}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {tile.value}
        </CardTitle>
        <CardAction>
          <StatTrendBadge trend={tile.trend}>{tile.delta}</StatTrendBadge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {tile.footer} <TrendIcon className="size-4" />
        </div>
        <div className="text-muted-foreground">{tile.subfooter}</div>
      </CardFooter>
    </Card>
  );
}

export function StatCards({ tiles }: { tiles: LogTile[] }) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {tiles.map((tile) => (
        <TileCard key={tile.label} tile={tile} />
      ))}
    </div>
  );
}
