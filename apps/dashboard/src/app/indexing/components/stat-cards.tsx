import { Card, CardContent } from "@/components/ui/card"
import {Activity, CheckCircle2, CircleAlert, Clock, type LucideIcon} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from '@/lib/utils'


export interface JobStats {
  running: number
  queued: number
  failed: number
  completed: number
}

interface Tile {
  title: string
  value: string
  delta: string
  tone: "bad" | "warn" | "muted"
  icon: LucideIcon
  footer: string
}

export function StatCards({ stats }: { stats: JobStats }) {
  const tiles: Tile[] = [
    {
      title: 'Running',
      value: String(stats.running),
      delta: 'active now',
      tone: stats.running > 0 ? 'warn' : 'muted',
      icon: Activity,
      footer: 'Jobs executing',
    },
    {
      title: 'Queued',
      value: String(stats.queued),
      delta: 'waiting',
      tone: 'muted',
      icon: Clock,
      footer: 'Waiting for worker',
    },
    {
      title: 'Failed',
      value: String(stats.failed),
      delta: stats.failed > 0 ? 'needs retry' : 'none',
      tone: stats.failed > 0 ? 'bad' : 'muted',
      icon: CircleAlert,
      footer: 'Failed or retrying',
    },
    {
      title: 'Completed',
      value: String(stats.completed),
      delta: 'done',
      tone: 'muted',
      icon: CheckCircle2,
      footer: 'Revisions pinned',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {tiles.map((tile, index) => (
        <Card key={index} className='border'>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between'>
              <tile.icon className='text-muted-foreground size-6' />
              <Badge
                variant='outline'
                className={cn(
                  tile.tone === 'bad'
                    ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400'
                    : tile.tone === 'warn'
                      ? 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950/20 dark:text-orange-400'
                      : 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/20 dark:text-green-400',
                )}
              >
                {tile.delta}
              </Badge>
            </div>

            <div className='space-y-2'>
              <p className='text-muted-foreground text-sm font-medium'>{tile.title}</p>
              <div className='text-2xl font-bold'>{tile.value}</div>
              <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                <span>{tile.footer}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
