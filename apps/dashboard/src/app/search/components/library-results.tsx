import { TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { LibraryEntryFixture } from "@/fixtures/libraries";
import { LibrariesTable } from "./libraries-table";

export function LibraryResults({
  entries,
  totalLibraries,
  totalDocuments,
  trustFor,
}: {
  entries: LibraryEntryFixture[];
  totalLibraries: number;
  totalDocuments: number;
  trustFor: (entry: LibraryEntryFixture) => "high" | "medium" | "low";
}) {
  const stats = [
    {
      label: "Libraries indexed",
      value: String(totalLibraries),
      delta: "registry",
      footer: "Registry coverage",
      subfooter: "Across ecosystems",
    },
    {
      label: "Documents",
      value: String(totalDocuments),
      delta: "searchable",
      footer: "Searchable documents",
      subfooter: "Version-aware knowledge",
    },
    {
      label: "Matches",
      value: String(entries.length),
      delta: "this query",
      footer: "Libraries for this query",
      subfooter: "Filtered by query and library",
    },
  ];
  return (
    <div className="mt-4 space-y-4">
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="@container/card">
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {stat.value}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <TrendingUp />
                  {stat.delta}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardContent className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {stat.footer} <TrendingUp className="size-4" />
              </div>
              <div className="text-muted-foreground">{stat.subfooter}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {entries.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No libraries found</CardTitle>
            <CardDescription>
              No indexed library matches this query.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <LibrariesTable entries={entries} trustFor={trustFor} />
      )}
    </div>
  );
}
