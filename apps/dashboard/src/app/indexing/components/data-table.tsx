"use client"

import { useState } from "react"
import {
  createColumnHelper,
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type SortingState,
  flexRender,
  useTable,
} from "@tanstack/react-table"
import {
  Ban,
  ChevronDown,
  EllipsisVertical,
  Eye,
  RotateCcw,
  Search,
} from "lucide-react"

import { features, type RowInstance } from "@/lib/table-features"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
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
import type { IndexJob } from "@/fixtures/indexing"

function stateVariant(
  state: IndexJob["state"],
): "default" | "secondary" | "destructive" | "outline" {
  if (state === "completed") return "default"
  if (state === "failed") return "destructive"
  if (state === "canceled") return "outline"
  return "secondary"
}

function getStateColor(state: IndexJob["state"]): string {
  if (state === "completed") {
    return "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20"
  }
  if (state === "failed") {
    return "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20"
  }
  if (state === "canceled") {
    return "text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20"
  }
  if (state === "queued") {
    return "text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20"
  }
  return "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20"
}

const exactFilter = (
  row: RowInstance<IndexJob>,
  columnId: string,
  value: string,
) => {
  return row.getValue(columnId) === value
}

const columnHelper = createColumnHelper<typeof features, IndexJob>()

interface DataTableProps {
  jobs: IndexJob[]
  onRetry: (id: string) => void
  onCancel: (id: string) => void
}

export function DataTable({ jobs, onRetry, onCancel }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState("")
  const [inspected, setInspected] = useState<IndexJob | null>(null)

  const columns = columnHelper.columns([
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center px-2">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center px-2">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "Job",
      cell: ({ row }) => (
        <span className="font-mono text-xs font-medium">
          {row.getValue("id")}
        </span>
      ),
    },
    {
      accessorKey: "library",
      header: "Library",
      cell: ({ row }) => {
        const job = row.original
        return (
          <div className="flex flex-col">
            <span className="font-medium">{job.library}</span>
            <span className="text-sm text-muted-foreground">{job.version}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "state",
      header: "State",
      cell: ({ row }) => {
        const state = row.getValue("state") as IndexJob["state"]
        return (
          <Badge variant={stateVariant(state)} className={getStateColor(state)}>
            {state}
          </Badge>
        )
      },
      filterFn: exactFilter,
    },
    {
      accessorKey: "progress",
      header: "Progress",
      cell: ({ row }) => {
        const job = row.original
        return (
          <div className="flex items-center gap-2">
            <Progress value={job.progress} className="w-20 h-1.5" />
            <span className="text-xs tabular-nums">{job.progress}%</span>
          </div>
        )
      },
    },
    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ row }) => (
        <span className="text-sm tabular-nums">{row.getValue("duration")}</span>
      ),
    },
    {
      accessorKey: "retries",
      header: "Retries",
      cell: ({ row }) => (
        <span className="text-sm tabular-nums">{row.getValue("retries")}</span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const job = row.original
        const retryable =
          job.state === "failed" ||
          job.state === "retrying" ||
          job.state === "canceled"
        const cancelable =
          job.state === "queued" ||
          job.state === "running" ||
          job.state === "retrying"
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-pointer"
              onClick={() => setInspected(job)}
            >
              <Eye className="size-4" />
              <span className="sr-only">Inspect job</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                  <EllipsisVertical className="size-4" />
                  <span className="sr-only">More actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="cursor-pointer"
                  disabled={!retryable}
                  onClick={() => onRetry(job.id)}
                >
                  <RotateCcw className="mr-2 size-4" />
                  Retry Job
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  className="cursor-pointer"
                  disabled={!cancelable}
                  onClick={() => onCancel(job.id)}
                >
                  <Ban className="mr-2 size-4" />
                  Cancel Job
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ])

  const table = useTable({
    features,
    data: jobs,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  })

  const stateFilter = table.getColumn("state")?.getFilterValue() as string
  const visible = table.getFilteredRowModel().rows.map((row) => row.original)

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search libraries, jobs..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(String(event.target.value))}
              className="pl-9"
              aria-label="Search jobs"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-muted-foreground text-sm">
            {visible.length} of {jobs.length} jobs
          </span>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-3 sm:gap-4">
        <div className="space-y-2">
          <Label htmlFor="state-filter" className="text-sm font-medium">
            State
          </Label>
          <Select
            value={stateFilter || ""}
            onValueChange={(value) =>
              table.getColumn("state")?.setFilterValue(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="cursor-pointer w-full" id="state-filter">
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              <SelectItem value="queued">Queued</SelectItem>
              <SelectItem value="running">Running</SelectItem>
              <SelectItem value="retrying">Retrying</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="canceled">Canceled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">

          <Label htmlFor="column-visibility" className="text-sm font-medium">
            Column Visibility
          </Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild id="column-visibility">
              <Button variant="outline" className="cursor-pointer w-full">
                Columns <ChevronDown className="ml-2 size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">

        <div className="flex items-center space-x-2">
          <Label htmlFor="page-size" className="text-sm font-medium">
            Show
          </Label>
          <Select
            value={`${table.state.pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="w-20 cursor-pointer" id="page-size">
              <SelectValue placeholder={table.state.pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 text-sm text-muted-foreground hidden sm:block">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2 hidden sm:flex">
            <p className="text-sm font-medium">Page</p>
            <strong className="text-sm">
              {table.state.pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="cursor-pointer"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="cursor-pointer"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <Drawer
        open={inspected !== null}
        onOpenChange={(open) => {
          if (!open) setInspected(null)
        }}
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              {inspected ? `${inspected.id} · ${inspected.library}` : "Job detail"}
            </DrawerTitle>
            <DrawerDescription>
              {inspected
                ? `Step: ${inspected.step} · ${inspected.progress}% · ${inspected.duration}`
                : null}
            </DrawerDescription>
          </DrawerHeader>
          <div className="space-y-3 px-4 pb-4 text-sm">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-muted-foreground">State</span>
              <span className="font-medium">{inspected?.state}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-muted-foreground">Retries</span>
              <span className="font-medium tabular-nums">
                {inspected?.retries ?? 0}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-muted-foreground">Updated</span>
              <span className="font-medium">{inspected?.updated}</span>
            </div>
            {inspected?.error ? (
              <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-3">
                <p className="font-medium">Sanitized error</p>
                <p className="text-muted-foreground font-mono text-xs">
                  {inspected.error}
                </p>
              </div>
            ) : null}
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline" className="cursor-pointer">
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
