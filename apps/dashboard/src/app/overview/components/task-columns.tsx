/* eslint-disable react-refresh/only-export-components -- shared module: helpers plus components */
"use client";

import { CircleCheckBig, EllipsisVertical, Loader } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import { toast } from "sonner";
import { z } from "zod";
import { schema } from "../schemas/task-schema";
import { features } from "@/lib/table-features";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableCellViewer } from "./cell-viewer";
import { DragHandle } from "./draggable-row";

const columnHelper = createColumnHelper<typeof features, z.infer<typeof schema>>();

function EditableCell({
  id,
  field,
  initial,
  header,
}: {
  id: number;
  field: "target" | "limit";
  initial: string;
  header: string;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
          loading: `Saving ${header}`,
          success: "Done",
          error: "Error",
        });
      }}
    >
      <Label htmlFor={`${id}-${field}`} className="sr-only">
        {field}
      </Label>
      <Input
        className="hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent shadow-none focus-visible:border dark:bg-transparent"
        defaultValue={initial}
        id={`${id}-${field}`}
      />
    </form>
  );
}

export const taskColumns = columnHelper.columns([
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
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
      <div className="flex items-center justify-center">
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
    accessorKey: "header",
    header: "Header",
    cell: ({ row }) => <TableCellViewer item={row.original} />,
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: "Section Type",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.type}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.original.status === "Done" ? (
          <CircleCheckBig className="text-green-500 dark:text-green-400" />
        ) : (
          <Loader />
        )}
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "target",
    header: () => <div className="w-full">Target</div>,
    cell: ({ row }) => (
      <EditableCell
        id={row.original.id}
        field="target"
        initial={row.original.target}
        header={row.original.header}
      />
    ),
  },
  {
    accessorKey: "limit",
    header: () => <div className="w-full">Limit</div>,
    cell: ({ row }) => (
      <EditableCell
        id={row.original.id}
        field="limit"
        initial={row.original.limit}
        header={row.original.header}
      />
    ),
  },
  {
    accessorKey: "reviewer",
    header: "Reviewer",
    cell: ({ row }) => {
      const isAssigned = row.original.reviewer !== "Assign reviewer";
      if (isAssigned) return row.original.reviewer;
      return (
        <Select>
          <SelectTrigger
            className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate cursor-pointer"
            size="sm"
            id={`${row.original.id}-reviewer`}
          >
            <SelectValue placeholder="Assign reviewer" />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
            <SelectItem value="Jamik Tashpulatov">Jamik Tashpulatov</SelectItem>
          </SelectContent>
        </Select>
      );
    },
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8 cursor-pointer"
            size="icon"
          >
            <EllipsisVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Make a copy</DropdownMenuItem>
          <DropdownMenuItem>Favorite</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]);
