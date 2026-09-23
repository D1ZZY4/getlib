import {
  Clock5,
  CreditCard,
  type LucideIcon,
  UserCheck,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { User } from "./data-table-columns";

interface Tile {
  title: string;
  value: string;
  delta: string;
  tone: "warn" | "muted";
  icon: LucideIcon;
  footer: string;
}

export function StatCards({ users }: { users: User[] }) {
  const active = users.filter((user) => user.status === "Active").length;
  const pending = users.filter((user) => user.status === "Pending").length;
  const enterprise = users.filter((user) => user.plan === "Enterprise").length;
  const roles = new Set(users.map((user) => user.role)).size;

  const tiles: Tile[] = [
    {
      title: "Total Users",
      value: String(users.length),
      delta: `${roles} roles`,
      tone: "muted",
      icon: Users,
      footer: "Registered users",
    },
    {
      title: "Active Users",
      value: String(active),
      delta: "active",
      tone: "muted",
      icon: UserCheck,
      footer: "Active accounts",
    },
    {
      title: "Pending Users",
      value: String(pending),
      delta: pending > 0 ? "needs review" : "none",
      tone: pending > 0 ? "warn" : "muted",
      icon: Clock5,
      footer: "Awaiting approval",
    },
    {
      title: "Enterprise Plan",
      value: String(enterprise),
      delta: "enterprise",
      tone: "muted",
      icon: CreditCard,
      footer: "Enterprise accounts",
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
                  tile.tone === "warn"
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
