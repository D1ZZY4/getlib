"use client";

import { useTable } from "@tanstack/react-table";
import { Download } from "lucide-react";
import { useMemo } from "react";
import {
  ColumnVisibility,
  DataTableView,
  TablePagination,
  useTableState,
} from "@/components/data-table";
import { Button } from "@/components/ui/button";
import type { LibraryEntryFixture } from "@/fixtures/libraries";
import { downloadCsv, toCsv } from "@/lib/download";
import { features } from "@/lib/table-features";
import {
  createLibraryColumns,
  type LibraryTrust,
} from "./libraries-table-columns";

export type { LibraryTrust };

export function LibrariesTable({
  entries,
  trustFor,
}: {
  entries: LibraryEntryFixture[];
  trustFor: (entry: LibraryEntryFixture) => LibraryTrust;
}) {
  const state = useTableState();
  const columns = useMemo(() => createLibraryColumns(trustFor), [trustFor]);

  const table = useTable({
    features,
    data: entries,
    columns,
    onSortingChange: state.setSorting,
    onColumnFiltersChange: state.setColumnFilters,
    onColumnVisibilityChange: state.setColumnVisibility,
    onRowSelectionChange: state.setRowSelection,
    state: {
      sorting: state.sorting,
      columnFilters: state.columnFilters,
      columnVisibility: state.columnVisibility,
      rowSelection: state.rowSelection,
    },
  });

  const handleExport = () => {
    downloadCsv(
      "getlib-search-libraries.csv",
      toCsv(
        ["name", "ecosystem", "version", "sources", "documents", "trust"],
        table
          .getFilteredRowModel()
          .rows.map((row) => [
            row.original.name,
            row.original.ecosystem,
            row.original.version,
            row.original.sources,
            row.original.documents,
            trustFor(row.original),
          ]),
      ),
    );
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ColumnVisibility table={table} />
        <div className="flex items-center space-x-2">
          <span className="text-muted-foreground text-sm">
            {entries.length} libraries
          </span>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={handleExport}
          >
            <Download className="mr-2 size-4" />
            Export
          </Button>
        </div>
      </div>

      <DataTableView
        table={table}
        columnsLength={columns.length}
        emptyMessage="No libraries found."
      />

      <TablePagination table={table} />
    </div>
  );
}
