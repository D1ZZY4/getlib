"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { EllipsisVertical, Eye, Pencil, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import type { features, RowInstance } from "@/lib/table-features";

export interface LogEntry {
  id: string;
  message: string;
  requestId: string;
  avatar: string;
  level: string;
  time: string;
  request: string;
  service: string;
}

export function getServiceColor(service: string): string {
  switch (service) {
    case "api":
      return "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20";
    case "worker":
      return "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/20";
    case "ingestion":
      return "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/20";
    case "mcp":
      return "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20";
    case "database":
      return "text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20";
    default:
      return "text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20";
  }
}

export function getLevelColor(level: string): string {
  switch (level) {
    case "error":
      return "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20";
    case "warn":
      return "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/20";
    case "info":
      return "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20";
    default:
      return "text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20";
  }
}

export function exactLogFilter(
  row: RowInstance<LogEntry>,
  columnId: string,
  value: string,
): boolean {
  return row.getValue(columnId) === value;
}

const columnHelper = createColumnHelper<typeof features, LogEntry>();

export interface LogColumnActions {
  onDeleteLog: (id: string) => void;
  onEditLog: (entry: LogEntry) => void;
  onCopyLog: (entry: LogEntry) => void;
  onExportRow: (entry: LogEntry) => void;
  onInspect: (entry: LogEntry) => void;
}

export function createLogColumns(actions: LogColumnActions) {
  return columnHelper.columns([
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center px-2">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
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
      accessorKey: "message",
      header: "Message",
      cell: ({ row }) => {
        const entry = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs font-medium">
                {entry.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{entry.message}</span>
              <span className="text-sm text-muted-foreground">
                {entry.requestId}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "level",
      header: "Level",
      cell: ({ row }) => {
        const level = row.getValue("level") as string;
        return (
          <Badge variant="secondary" className={getLevelColor(level)}>
            {level}
          </Badge>
        );
      },
      filterFn: exactLogFilter,
    },
    {
      accessorKey: "time",
      header: "Time",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("time")}</span>
      ),
      filterFn: exactLogFilter,
    },
    {
      accessorKey: "request",
      header: "Request",
      cell: ({ row }) => (
        <span className="text-sm">{row.getValue("request")}</span>
      ),
    },
    {
      accessorKey: "service",
      header: "Service",
      cell: ({ row }) => {
        const service = row.getValue("service") as string;
        return (
          <Badge variant="secondary" className={getServiceColor(service)}>
            {service}
          </Badge>
        );
      },
      filterFn: exactLogFilter,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const entry = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-pointer"
              onClick={() => actions.onInspect(entry)}
            >
              <Eye className="size-4" />
              <span className="sr-only">View log entry</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-pointer"
              onClick={() => actions.onEditLog(entry)}
            >
              <Pencil className="size-4" />
              <span className="sr-only">Inspect log entry</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 cursor-pointer"
                >
                  <EllipsisVertical className="size-4" />
                  <span className="sr-only">More actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => actions.onInspect(entry)}
                >
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => actions.onCopyLog(entry)}
                >
                  Copy Message
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => actions.onExportRow(entry)}
                >
                  Export Row
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={() => actions.onDeleteLog(entry.id)}
                >
                  <Trash2 className="mr-2 size-4" />
                  Delete Log
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ]);
}
