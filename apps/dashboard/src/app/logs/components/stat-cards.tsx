import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, Bug, CircleAlert, ScrollText, type LucideIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from '@/lib/utils'

export interface LogStats {
  total: number
  errors: number
  warnings: number
  debug: number
}

interface Tile {
  title: string
  value: string
  delta: string
  tone: "bad" | "warn" | "muted"
  icon: LucideIcon
  footer: string
}

export function StatCards({ stats }: { stats: LogStats }) {
  const tiles: Tile[] = [
    {
      title: 'Total Entries',
      value: String(stats.total),
      delta: 'stream',
      tone: 'muted',
      icon: ScrollText,
      footer: 'Across all services',
    },
    {
      title: 'Errors',
      value: String(stats.errors),
      delta: stats.errors > 0 ? 'needs attention' : 'none',
      tone: stats.errors > 0 ? 'bad' : 'muted',
      icon: CircleAlert,
      footer: 'Failed operations',
    },
    {
      title: 'Warnings',
      value: String(stats.warnings),
      delta: 'degraded signals',
      tone: stats.warnings > 0 ? 'warn' : 'muted',
      icon: AlertTriangle,
      footer: 'Retries and slow queries',
    },
    {
      title: 'Debug',
      value: String(stats.debug),
      delta: 'verbose',
      tone: 'muted',
      icon: Bug,
      footer: 'Diagnostic traces',
    },
  ]
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {tiles.map((tile) => (
        <Card key={tile.title} className='border'>
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
