import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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

export interface LibraryVersionRow {
  version: string
  tokens: string
  snippets: number
  updated: string
  isDefault: boolean
}

export function VersionsTable({
  versions,
  onReindex,
}: {
  versions: LibraryVersionRow[]
  onReindex: (version: string) => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Versions</CardTitle>
        <CardDescription>
          Indexed versions served separately with token and snippet counts.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Version</TableHead>
              <TableHead className="text-right">Tokens</TableHead>
              <TableHead className="text-right">Snippets</TableHead>
              <TableHead className="text-right">Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {versions.map((row) => (
              <TableRow key={row.version}>
                <TableCell className="font-medium">
                  <span className="font-mono text-xs">{row.version}</span>{" "}
                  {row.isDefault ? (
                    <Badge variant="default" className="text-xs">
                      Default
                    </Badge>
                  ) : null}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {row.tokens}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {row.snippets.toLocaleString()}
                </TableCell>
                <TableCell className="text-right text-muted-foreground text-xs">
                  {row.updated}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onReindex(row.version)}
                  >
                    Reindex
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
