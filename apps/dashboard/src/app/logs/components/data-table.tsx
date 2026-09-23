"use client"

import { useState } from "react"
import {
  createColumnHelper,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  useTable,
} from "@tanstack/react-table"
import { Download, Search } from "lucide-react"

import { features, type RowInstance } from "@/lib/table-features"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { LogEntry } from "@/fixtures/logs"

function levelVariant(
  level: LogEntry["level"],
): "default" | "secondary" | "destructive" | "outline" {
  if (level === "error") return "destructive"
  if (level === "warn") return "secondary"
  if (level === "info") return "default"
  return "outline"
}

const exactFilter = (
  row: RowInstance<LogEntry>,
  columnId: string,
  value: string,
) => {
  return row.getValue(columnId) === value
}

const columnHelper = createColumnHelper<typeof features, LogEntry>()

const columns = columnHelper.columns([
  {
    accessorKey: "timestamp",
    header: "Time",
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono text-xs whitespace-nowrap">
        {new Date(row.getValue("timestamp")).toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "level",
    header: "Level",
    cell: ({ row }) => {
      const level = row.getValue("level") as LogEntry["level"]
      return <Badge variant={levelVariant(level)}>{level}</Badge>
    },
    filterFn: exactFilter,
  },
  {
    accessorKey: "service",
    header: "Service",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.getValue("service")}</span>
    ),
    filterFn: exactFilter,
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.getValue("message")}</span>
    ),
  },
  {
    accessorKey: "requestId",
    header: "Request",
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono text-xs">
        {(row.getValue("requestId") as string | undefined) ?? "-"}
      </span>
    ),
  },
])

interface DataTableProps {
  entries: LogEntry[]
  onExport: (entries: LogEntry[]) => void
}

export function DataTable({ entries, onExport }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")

  const table = useTable({
    features,
    data: entries,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  })

  const levelFilter = (table.getColumn("level")?.getFilterValue() as string) ?? "all"
  const serviceFilter =
    (table.getColumn("service")?.getFilterValue() as string) ?? "all"
  const visible = table.getFilteredRowModel().rows.map((row) => row.original)

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search messages, services, request IDs..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(String(event.target.value))}
              className="pl-9"
              aria-label="Search logs"
            />
          </div>
          <Select
            value={levelFilter}
            onValueChange={(value) =>
              table
                .getColumn("level")
                ?.setFilterValue(value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="w-36" aria-label="Filter by level">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All levels</SelectItem>
              <SelectItem value="debug">Debug</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warn">Warn</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={serviceFilter}
            onValueChange={(value) =>
              table
                .getColumn("service")
                ?.setFilterValue(value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="w-36" aria-label="Filter by service">
              <SelectValue placeholder="Service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All services</SelectItem>
              <SelectItem value="api">api</SelectItem>
              <SelectItem value="worker">worker</SelectItem>
              <SelectItem value="ingestion">ingestion</SelectItem>
              <SelectItem value="mcp">mcp</SelectItem>
              <SelectItem value="database">database</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-muted-foreground text-sm">
            {visible.length} of {entries.length} entries
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onExport(visible)}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-lg border bg-card py-12 text-center">
          <p className="font-medium">No log entries match</p>
          <p className="text-muted-foreground text-sm">
            Adjust the search text or filters.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
