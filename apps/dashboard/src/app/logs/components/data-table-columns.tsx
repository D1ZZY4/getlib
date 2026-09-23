"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { EllipsisVertical, Eye, Trash2 } from "lucide-react";
import {
  exactMatchFilter,
  SelectAllCheckbox,
  SelectRowCheckbox,
} from "@/components/data-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toneClassName } from "@/lib/badge-tone";
import type { features } from "@/lib/table-features";

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
      return toneClassName("info");
    case "worker":
      return toneClassName("violet");
    case "ingestion":
      return toneClassName("warning");
    case "mcp":
      return toneClassName("success");
    case "database":
      return toneClassName("yellow");
    default:
      return toneClassName("muted");
  }
}

export function getLevelColor(level: string): string {
  switch (level) {
    case "error":
      return toneClassName("danger");
    case "warn":
      return toneClassName("warning");
    case "info":
      return toneClassName("info");
    default:
      return toneClassName("muted");
  }
}

const columnHelper = createColumnHelper<typeof features, LogEntry>();

export interface LogColumnActions {
  onDeleteLog: (id: string) => void;
  onCopyLog: (entry: LogEntry) => void;
  onExportRow: (entry: LogEntry) => void;
  onInspect: (entry: LogEntry) => void;
}

export function createLogColumns(actions: LogColumnActions) {
  return columnHelper.columns([
    {
      id: "select",
      header: ({ table }) => <SelectAllCheckbox table={table} />,
      cell: ({ row }) => <SelectRowCheckbox row={row} />,
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
      filterFn: exactMatchFilter,
    },
    {
      accessorKey: "time",
      header: "Time",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("time")}</span>
      ),
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
      filterFn: exactMatchFilter,
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
