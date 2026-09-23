"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { Ban, EllipsisVertical, Eye, RotateCcw } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import type { IndexJob } from "@/fixtures/indexing";
import type { features, RowInstance } from "@/lib/table-features";

export function stateVariant(
  state: IndexJob["state"],
): "default" | "secondary" | "destructive" | "outline" {
  if (state === "completed") return "default";
  if (state === "failed") return "destructive";
  if (state === "canceled") return "outline";
  return "secondary";
}

export function getStateColor(state: IndexJob["state"]): string {
  if (state === "completed") {
    return "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20";
  }
  if (state === "failed") {
    return "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20";
  }
  if (state === "canceled" || state === "queued") {
    return "text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20";
  }
  return "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20";
}

export function exactJobFilter(
  row: RowInstance<IndexJob>,
  columnId: string,
  value: string,
): boolean {
  return row.getValue(columnId) === value;
}

const columnHelper = createColumnHelper<typeof features, IndexJob>();

export interface JobColumnActions {
  onRetry: (id: string) => void;
  onCancel: (id: string) => void;
  onInspect: (job: IndexJob) => void;
}

export function createJobColumns(actions: JobColumnActions) {
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
      accessorKey: "id",
      header: "Job",
      cell: ({ row }) => (
        <span className="font-mono text-xs font-medium">
          {row.getValue("id")}
        </span>
      ),
    },
    {
      accessorKey: "library",
      header: "Library",
      cell: ({ row }) => {
        const job = row.original;
        return (
          <div className="flex flex-col">
            <span className="font-medium">{job.library}</span>
            <span className="text-sm text-muted-foreground">{job.version}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "state",
      header: "State",
      cell: ({ row }) => {
        const state = row.getValue("state") as IndexJob["state"];
        return (
          <Badge variant={stateVariant(state)} className={getStateColor(state)}>
            {state}
          </Badge>
        );
      },
      filterFn: exactJobFilter,
    },
    {
      accessorKey: "progress",
      header: "Progress",
      cell: ({ row }) => {
        const job = row.original;
        return (
          <div className="flex items-center gap-2">
            <Progress value={job.progress} className="w-20 h-1.5" />
            <span className="text-xs tabular-nums">{job.progress}%</span>
          </div>
        );
      },
    },
    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ row }) => (
        <span className="text-sm tabular-nums">{row.getValue("duration")}</span>
      ),
    },
    {
      accessorKey: "retries",
      header: "Retries",
      cell: ({ row }) => (
        <span className="text-sm tabular-nums">{row.getValue("retries")}</span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const job = row.original;
        const retryable =
          job.state === "failed" ||
          job.state === "retrying" ||
          job.state === "canceled";
        const cancelable =
          job.state === "queued" ||
          job.state === "running" ||
          job.state === "retrying";
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-pointer"
              onClick={() => actions.onInspect(job)}
            >
              <Eye className="size-4" />
              <span className="sr-only">Inspect job</span>
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
                  disabled={!retryable}
                  onClick={() => actions.onRetry(job.id)}
                >
                  <RotateCcw className="mr-2 size-4" />
                  Retry Job
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  className="cursor-pointer"
                  disabled={!cancelable}
                  onClick={() => actions.onCancel(job.id)}
                >
                  <Ban className="mr-2 size-4" />
                  Cancel Job
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ]);
}
