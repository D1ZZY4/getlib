"use client";

import { useTable } from "@tanstack/react-table";
import { Download, Plus } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ColumnVisibility,
  DataTableView,
  FilterSelect,
  TablePagination,
  TableSearch,
  useTableState,
} from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { downloadCsv, toCsv } from "@/lib/download";
import { features } from "@/lib/table-features";
import {
  createLibraryTableColumns,
  type LibraryEntry,
} from "./data-table-columns";

interface DataTableProps {
  entries: LibraryEntry[];
  onDeleteLibrary: (id: string) => void;
  onEditLibrary: (entry: LibraryEntry) => void;
}

const INDEXING_OPTIONS = [
  { value: "all", label: "All States" },
  { value: "indexed", label: "Indexed" },
  { value: "indexing", label: "Indexing" },
  { value: "stale", label: "Stale" },
  { value: "failed", label: "Failed" },
];

export function DataTable({
  entries,
  onDeleteLibrary,
  onEditLibrary,
}: DataTableProps) {
  const navigate = useNavigate();
  const state = useTableState();

  const handleExportRow = useCallback((entry: LibraryEntry) => {
    downloadCsv(
      `getlib-library-${entry.id}.csv`,
      toCsv(
        ["id", "name", "ecosystem", "version", "indexing", "documents"],
        [
          [
            entry.id,
            entry.name,
            entry.ecosystem,
            entry.version,
            entry.indexing,
            entry.documents,
          ],
        ],
      ),
    );
  }, []);

  const columns = useMemo(
    () =>
      createLibraryTableColumns({
        onDeleteLibrary,
        onEditLibrary,
        onExportRow: handleExportRow,
        onViewDetail: (entry) => navigate(`/libraries/${entry.id}`),
      }),
    [onDeleteLibrary, onEditLibrary, handleExportRow, navigate],
  );

  const table = useTable({
    features,
    data: entries,
    columns,
    onSortingChange: state.setSorting,
    onColumnFiltersChange: state.setColumnFilters,
    onColumnVisibilityChange: state.setColumnVisibility,
    onRowSelectionChange: state.setRowSelection,
    onGlobalFilterChange: state.setGlobalFilter,
    state: {
      sorting: state.sorting,
      columnFilters: state.columnFilters,
      columnVisibility: state.columnVisibility,
      rowSelection: state.rowSelection,
      globalFilter: state.globalFilter,
    },
  });

  const indexingFilter =
    (table.getColumn("indexing")?.getFilterValue() as string) ?? "";

  const handleExportAll = () => {
    downloadCsv(
      "getlib-libraries.csv",
      toCsv(
        ["id", "name", "ecosystem", "version", "indexing", "documents"],
        table
          .getFilteredRowModel()
          .rows.map((row) => [
            row.original.id,
            row.original.name,
            row.original.ecosystem,
            row.original.version,
            row.original.indexing,
            row.original.documents,
          ]),
      ),
    );
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <TableSearch
            value={state.globalFilter}
            onChange={state.setGlobalFilter}
            placeholder="Search libraries..."
            label="Search libraries"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={handleExportAll}
          >
            <Download className="mr-2 size-4" />
            Export
          </Button>
          <Button
            className="cursor-pointer"
            onClick={() => navigate("/libraries/add")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Library
          </Button>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
        <FilterSelect
          id="indexing-filter"
          label="Indexing"
          value={indexingFilter}
          placeholder="Select State"
          options={INDEXING_OPTIONS}
          onChange={(value) =>
            table
              .getColumn("indexing")
              ?.setFilterValue(value === "all" ? "" : value)
          }
        />
        <ColumnVisibility table={table} />
      </div>

      <DataTableView
        table={table}
        columnsLength={columns.length}
        emptyMessage="No results."
      />

      <TablePagination table={table} />
    </div>
  );
}
