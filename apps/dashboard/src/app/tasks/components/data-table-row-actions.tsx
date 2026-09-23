"use client";

import type { RowData } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { RowInstance } from "@/lib/table-features";
import { taskSchema } from "../data/schema";

interface DataTableRowActionsProps<TData extends RowData> {
  row: RowInstance<TData>;
}

export function DataTableRowActions<TData extends RowData>({
  row,
}: DataTableRowActionsProps<TData>) {
  // Validate the row data (throws at runtime on malformed data)
  taskSchema.parse(row.original);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted cursor-pointer"
        >
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem className="cursor-pointer">
          View Task
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          Edit Task
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          Mark as Favorite
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" variant="destructive">
          Delete
          <DropdownMenuShortcut className="text-destructive">
            ⌘⌫
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
