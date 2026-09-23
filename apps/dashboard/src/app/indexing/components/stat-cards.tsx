import { TrendingDown, TrendingUp } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export interface JobStats {
  running: number
  queued: number
  failed: number
  completed: number
}

interface Tile {
  label: string
  value: string
  delta: string
  trend: "up" | "down"
  footer: string
  subfooter: string
}

export function StatCards({ stats }: { stats: JobStats }) {
  const tiles: Tile[] = [
    {
      label: "Running",
      value: String(stats.running),
      delta: "active now",
      trend: "up",
      footer: "Jobs executing",
      subfooter: "Across the pipeline",
    },
    {
      label: "Queued",
      value: String(stats.queued),
      delta: "waiting",
      trend: "up",
      footer: "Waiting for worker",
      subfooter: "Picked up in order",
    },
    {
      label: "Failed",
      value: String(stats.failed),
      delta: stats.failed > 0 ? "needs retry" : "none",
      trend: stats.failed > 0 ? "down" : "up",
      footer: "Failed or retrying",
      subfooter: "Retry from the board",
    },
    {
      label: "Completed",
      value: String(stats.completed),
      delta: "done",
      trend: "up",
      footer: "Revisions pinned",
      subfooter: "Failed refreshes kept last good",
    },
  ]
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {tiles.map((tile) => {
        const TrendIcon = tile.trend === "up" ? TrendingUp : TrendingDown
        return (
          <Card key={tile.label} className="@container/card">
            <CardHeader>
              <CardDescription>{tile.label}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {tile.value}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <TrendIcon />
                  {tile.delta}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {tile.footer} <TrendIcon className="size-4" />
              </div>
              <div className="text-muted-foreground">
                {tile.subfooter}
              </div>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
