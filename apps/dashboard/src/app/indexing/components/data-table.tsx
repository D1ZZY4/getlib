"use client";

import { useTable } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import {
  ColumnVisibility,
  DataTableView,
  FilterSelect,
  TablePagination,
  TableSearch,
  useTableState,
} from "@/components/data-table";
import type { IndexJob } from "@/fixtures/indexing";
import { features } from "@/lib/table-features";
import { createJobColumns } from "./data-table-columns";
import { JobInspector } from "./job-inspector";

const STATE_OPTIONS = [
  { value: "all", label: "All States" },
  { value: "queued", label: "Queued" },
  { value: "running", label: "Running" },
  { value: "retrying", label: "Retrying" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
  { value: "canceled", label: "Canceled" },
];

interface DataTableProps {
  jobs: IndexJob[];
  onRetry: (id: string) => void;
  onCancel: (id: string) => void;
}

export function DataTable({ jobs, onRetry, onCancel }: DataTableProps) {
  const state = useTableState();
  const [inspected, setInspected] = useState<IndexJob | null>(null);

  const columns = useMemo(
    () =>
      createJobColumns({
        onRetry,
        onCancel,
        onInspect: setInspected,
      }),
    [onRetry, onCancel],
  );

  const table = useTable({
    features,
    data: jobs,
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

  const stateFilter =
    (table.getColumn("state")?.getFilterValue() as string) ?? "";
  const visible = table.getFilteredRowModel().rows.map((row) => row.original);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <TableSearch
            value={state.globalFilter}
            onChange={state.setGlobalFilter}
            placeholder="Search libraries, jobs..."
            label="Search jobs"
          />
        </div>
        <span className="text-muted-foreground text-sm">
          {visible.length} of {jobs.length} jobs
        </span>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
        <FilterSelect
          id="state-filter"
          label="State"
          value={stateFilter}
          placeholder="Select State"
          options={STATE_OPTIONS}
          onChange={(value) =>
            table
              .getColumn("state")
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
      <JobInspector job={inspected} onClose={() => setInspected(null)} />
    </div>
  );
}
