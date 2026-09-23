"use client";

import { useMemo } from "react";
import { flexRender, useTable } from "@tanstack/react-table";
import { Download } from "lucide-react";
import { features } from "@/lib/table-features";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnVisibility,
  FilterSelect,
  TablePagination,
  TableSearch,
  useTableState,
} from "@/components/data-table";
import { UserFormDialog } from "./user-form-dialog";
import { createUserColumns, type User } from "./data-table-columns";

interface UserFormValues {
  name: string;
  email: string;
  role: string;
  plan: string;
  billing: string;
  status: string;
}

interface DataTableProps {
  users: User[];
  onDeleteUser: (id: number) => void;
  onEditUser: (user: User) => void;
  onAddUser: (userData: UserFormValues) => void;
}

const ROLE_OPTIONS = [
  { value: "all", label: "All Roles" },
  { value: "Admin", label: "Admin" },
  { value: "Author", label: "Author" },
  { value: "Editor", label: "Editor" },
  { value: "Maintainer", label: "Maintainer" },
  { value: "Subscriber", label: "Subscriber" },
];

const PLAN_OPTIONS = [
  { value: "all", label: "All Plans" },
  { value: "Basic", label: "Basic" },
  { value: "Professional", label: "Professional" },
  { value: "Enterprise", label: "Enterprise" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "Active", label: "Active" },
  { value: "Pending", label: "Pending" },
  { value: "Error", label: "Error" },
  { value: "Inactive", label: "Inactive" },
];

export function DataTable({
  users,
  onDeleteUser,
  onEditUser,
  onAddUser,
}: DataTableProps) {
  const state = useTableState();

  const columns = useMemo(
    () => createUserColumns({ onDeleteUser, onEditUser }),
    [onDeleteUser, onEditUser],
  );

  const table = useTable({
    features,
    data: users,
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

  const roleFilter = (table.getColumn("role")?.getFilterValue() as string) ?? "";
  const planFilter = (table.getColumn("plan")?.getFilterValue() as string) ?? "";
  const statusFilter =
    (table.getColumn("status")?.getFilterValue() as string) ?? "";

  const setFilter = (column: string) => (value: string) =>
    table.getColumn(column)?.setFilterValue(value === "all" ? "" : value);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <TableSearch
            value={state.globalFilter}
            onChange={state.setGlobalFilter}
            placeholder="Search users..."
            label="Search users"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="cursor-pointer">
            <Download className="mr-2 size-4" />
            Export
          </Button>
          <UserFormDialog onAddUser={onAddUser} />
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-3 sm:gap-4">
        <FilterSelect
          id="role-filter"
          label="Role"
          value={roleFilter}
          placeholder="Select Role"
          options={ROLE_OPTIONS}
          onChange={setFilter("role")}
        />
        <FilterSelect
          id="plan-filter"
          label="Plan"
          value={planFilter}
          placeholder="Select Plan"
          options={PLAN_OPTIONS}
          onChange={setFilter("plan")}
        />
        <FilterSelect
          id="status-filter"
          label="Status"
          value={statusFilter}
          placeholder="Select Status"
          options={STATUS_OPTIONS}
          onChange={setFilter("status")}
        />
      </div>

      <div className="grid gap-2 sm:gap-4">
        <ColumnVisibility table={table} />
      </div>

      <div className="rounded-md border">
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination table={table} />
    </div>
  );
}
