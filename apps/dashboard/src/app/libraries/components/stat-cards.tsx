import {
  BookOpen,
  Database,
  FileText,
  type LucideIcon,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface LibraryStats {
  total: number;
  ecosystems: number;
  upToDate: number;
  needsRefresh: number;
  documents: number;
}

interface Tile {
  title: string;
  value: string;
  delta: string;
  tone: "bad" | "warn" | "muted";
  icon: LucideIcon;
  footer: string;
}

export function StatCards({ stats }: { stats: LibraryStats }) {
  const tiles: Tile[] = [
    {
      title: "Total Libraries",
      value: String(stats.total),
      delta: `${stats.ecosystems} ecosystems`,
      tone: "muted",
      icon: BookOpen,
      footer: "Registered libraries",
    },
    {
      title: "Up To Date",
      value: String(stats.upToDate),
      delta: "indexed",
      tone: "muted",
      icon: Database,
      footer: "Fresh knowledge",
    },
    {
      title: "Needs Refresh",
      value: String(stats.needsRefresh),
      delta: stats.needsRefresh > 0 ? "stale or failed" : "none",
      tone: stats.needsRefresh > 0 ? "warn" : "muted",
      icon: RefreshCw,
      footer: "Reindex to refresh",
    },
    {
      title: "Documents",
      value: String(stats.documents),
      delta: "indexed",
      tone: "muted",
      icon: FileText,
      footer: "Searchable documents",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {tiles.map((tile) => (
        <Card key={tile.title} className="border">
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <tile.icon className="text-muted-foreground size-6" />
              <Badge
                variant="outline"
                className={cn(
                  tile.tone === "bad"
                    ? "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400"
                    : tile.tone === "warn"
                      ? "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950/20 dark:text-orange-400"
                      : "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/20 dark:text-green-400",
                )}
              >
                {tile.delta}
              </Badge>
            </div>

            <div className="space-y-2">
              <p className="text-muted-foreground text-sm font-medium">
                {tile.title}
              </p>
              <div className="text-2xl font-bold">{tile.value}</div>
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <span>{tile.footer}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
