"use client";

import { useTable } from "@tanstack/react-table";
import { Download } from "lucide-react";
import { useMemo, useState } from "react";
import {
  ColumnVisibility,
  DataTableView,
  FilterSelect,
  TablePagination,
  TableSearch,
  useTableState,
} from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { features } from "@/lib/table-features";
import { createLogColumns, type LogEntry } from "./data-table-columns";
import { LogFormDialog } from "./log-form-dialog";
import { LogInspector } from "./log-inspector";

interface LogFormValues {
  message: string;
  requestId: string;
  level: string;
  time: string;
  request: string;
  service: string;
}

interface DataTableProps {
  entries: LogEntry[];
  onDeleteLog: (id: string) => void;
  onAddLog: (logData: LogFormValues) => void;
  onCopyLog: (entry: LogEntry) => void;
  onExport: (entries: LogEntry[]) => void;
}

const LEVEL_OPTIONS = [
  { value: "all", label: "All Levels" },
  { value: "debug", label: "Debug" },
  { value: "info", label: "Info" },
  { value: "warn", label: "Warn" },
  { value: "error", label: "Error" },
];

const SERVICE_OPTIONS = [
  { value: "all", label: "All Services" },
  { value: "api", label: "api" },
  { value: "worker", label: "worker" },
  { value: "ingestion", label: "ingestion" },
  { value: "mcp", label: "mcp" },
  { value: "database", label: "database" },
];

export function DataTable({
  entries,
  onDeleteLog,
  onAddLog,
  onCopyLog,
  onExport,
}: DataTableProps) {
  const state = useTableState();
  const [inspected, setInspected] = useState<LogEntry | null>(null);

  const columns = useMemo(
    () =>
      createLogColumns({
        onDeleteLog,
        onCopyLog,
        onExportRow: (entry) => onExport([entry]),
        onInspect: setInspected,
      }),
    [onDeleteLog, onCopyLog, onExport],
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

  const levelFilter =
    (table.getColumn("level")?.getFilterValue() as string) ?? "";
  const serviceFilter =
    (table.getColumn("service")?.getFilterValue() as string) ?? "";

  const setColumnFilter = (column: string) => (value: string) =>
    table.getColumn(column)?.setFilterValue(value === "all" ? "" : value);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <TableSearch
            value={state.globalFilter}
            onChange={state.setGlobalFilter}
            placeholder="Search logs..."
            label="Search logs"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() =>
              onExport(
                table.getFilteredRowModel().rows.map((row) => row.original),
              )
            }
          >
            <Download className="mr-2 size-4" />
            Export
          </Button>
          <LogFormDialog onAddLog={onAddLog} />
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-3 sm:gap-4">
        <FilterSelect
          id="level-filter"
          label="Level"
          value={levelFilter}
          placeholder="Select Level"
          options={LEVEL_OPTIONS}
          onChange={setColumnFilter("level")}
        />
        <FilterSelect
          id="service-filter"
          label="Service"
          value={serviceFilter}
          placeholder="Select Service"
          options={SERVICE_OPTIONS}
          onChange={setColumnFilter("service")}
        />
        <ColumnVisibility table={table} />
      </div>

      <DataTableView
        table={table}
        columnsLength={columns.length}
        emptyMessage="No results."
      />

      <TablePagination table={table} />
      <LogInspector entry={inspected} onClose={() => setInspected(null)} />
    </div>
  );
}
