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
  ChevronDown,
  Download,
  EllipsisVertical,
  Eye,
  Pencil,
  Search,
  Trash2,
} from "lucide-react"

import { features, type RowInstance } from "@/lib/table-features"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { LibraryFormDialog } from "./library-form-dialog"
import { downloadCsv, toCsv } from "@/lib/download"

interface LibraryEntry {
  id: string
  name: string
  ecosystem: string
  avatar: string
  version: string
  sources: number
  indexing: string
  freshness: string
  documents: number
}

interface LibraryFormValues {
  name: string
  ecosystem: string
  version: string
  sourceUrl: string
}

function getIndexingColor(indexing: string) {
  switch (indexing) {
    case "indexed":
      return "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20"
    case "indexing":
      return "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20"
    case "stale":
      return "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/20"
    case "failed":
      return "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20"
    default:
      return "text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20"
  }
}

interface DataTableProps {
  entries: LibraryEntry[]
  onDeleteLibrary: (id: string) => void
  onEditLibrary: (entry: LibraryEntry) => void
  onAddLibrary: (data: LibraryFormValues) => void
}

export function DataTable({ entries, onDeleteLibrary, onEditLibrary, onAddLibrary }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState("")

  const exactFilter = (row: RowInstance<LibraryEntry>, columnId: string, value: string) => {
    return row.getValue(columnId) === value
  }

  const columnHelper = createColumnHelper<typeof features, LibraryEntry>()

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
      accessorKey: "name",
      header: "Library",
      cell: ({ row }) => {
        const entry = row.original
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs font-medium">
                {entry.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{entry.name}</span>
              <span className="text-sm text-muted-foreground">{entry.ecosystem}</span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "version",
      header: "Version",
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.getValue("version")}</span>
      ),
    },
    {
      accessorKey: "sources",
      header: "Sources",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("sources")}</span>
      ),
    },
    {
      accessorKey: "indexing",
      header: "Indexing",
      cell: ({ row }) => {
        const indexing = row.getValue("indexing") as string
        return (
          <Badge variant="secondary" className={getIndexingColor(indexing)}>
            {indexing}
          </Badge>
        )
      },
      filterFn: exactFilter,
    },
    {
      accessorKey: "freshness",
      header: "Freshness",
      cell: ({ row }) => (
        <span className="text-sm">{row.getValue("freshness")}</span>
      ),
    },
    {
      accessorKey: "documents",
      header: "Documents",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("documents")}</span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const entry = row.original
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
              <Eye className="size-4" />
              <span className="sr-only">View library</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-pointer"
              onClick={() => onEditLibrary(entry)}
            >
              <Pencil className="size-4" />
              <span className="sr-only">Edit library</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                  <EllipsisVertical className="size-4" />
                  <span className="sr-only">More actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer">
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => onExportRow(entry)}
                >
                  Export Row
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={() => onDeleteLibrary(entry.id)}
                >
                  <Trash2 className="mr-2 size-4" />
                  Delete Library
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
    data: entries,
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

  const indexingFilter = table.getColumn("indexing")?.getFilterValue() as string

  const onExportRow = (entry: LibraryEntry) => {
    downloadCsv(
      `getlib-library-${entry.id}.csv`,
      toCsv(
        ["id", "name", "ecosystem", "version", "indexing", "documents"],
        [[entry.id, entry.name, entry.ecosystem, entry.version, entry.indexing, entry.documents]],
      ),
    )
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search libraries..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(String(event.target.value))}
              className="pl-9"
              aria-label="Search libraries"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() =>
              downloadCsv(
                "getlib-libraries.csv",
                toCsv(
                  ["id", "name", "ecosystem", "version", "indexing", "documents"],
                  table.getFilteredRowModel().rows.map((row) => [
                    row.original.id,
                    row.original.name,
                    row.original.ecosystem,
                    row.original.version,
                    row.original.indexing,
                    row.original.documents,
                  ]),
                ),
              )
            }
          >
            <Download className="mr-2 size-4" />
            Export
          </Button>
          <LibraryFormDialog onAddLibrary={onAddLibrary} />
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-3 sm:gap-4">
        <div className="space-y-2">
          <Label htmlFor="indexing-filter" className="text-sm font-medium">
            Indexing
          </Label>
          <Select
            value={indexingFilter || ""}
            onValueChange={(value) =>
              table.getColumn("indexing")?.setFilterValue(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="cursor-pointer w-full" id="indexing-filter">
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              <SelectItem value="indexed">Indexed</SelectItem>
              <SelectItem value="indexing">Indexing</SelectItem>
              <SelectItem value="stale">Stale</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
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
    </div>
  )
}
