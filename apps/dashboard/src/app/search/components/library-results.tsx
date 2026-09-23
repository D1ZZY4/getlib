import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { LibraryEntryFixture } from "@/fixtures/libraries"

function trustClassName(trust: "high" | "medium" | "low"): string {
  if (trust === "high") {
    return "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20"
  }
  if (trust === "medium") {
    return "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/20"
  }
  return "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20"
}

export function LibraryResults({
  entries,
  totalLibraries,
  totalDocuments,
  trustFor,
}: {
  entries: LibraryEntryFixture[]
  totalLibraries: number
  totalDocuments: number
  trustFor: (entry: LibraryEntryFixture) => "high" | "medium" | "low"
}) {
  return (
    <div className="mt-4 space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Libraries indexed</CardTitle>
            <CardDescription>Registry coverage</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tabular-nums">
              {totalLibraries}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription>Searchable documents</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tabular-nums">
              {totalDocuments}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Matches</CardTitle>
            <CardDescription>Libraries for this query</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tabular-nums">
              {entries.length}
            </p>
          </CardContent>
        </Card>
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
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead className="text-right">Sources</TableHead>
                  <TableHead className="text-right">Documents</TableHead>
                  <TableHead className="text-right">Updated</TableHead>
                  <TableHead className="text-right">Trust</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => {
                  const trust = trustFor(entry)
                  return (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <Link
                          to={`/libraries/${entry.id}`}
                          className="font-medium hover:underline"
                        >
                          {entry.name}
                        </Link>
                        <p className="text-muted-foreground text-xs">
                          {entry.ecosystem}
                        </p>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {entry.version}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {entry.sources}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {entry.documents}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground text-xs">
                        {entry.freshness}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary" className={trustClassName(trust)}>
                          {trust}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
