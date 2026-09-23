"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { EllipsisVertical, Eye, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
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
import type { LibraryEntryFixture } from "@/fixtures/libraries";
import { toneClassName } from "@/lib/badge-tone";
import type { features } from "@/lib/table-features";

export type LibraryEntry = LibraryEntryFixture;

export function getIndexingColor(indexing: string): string {
  switch (indexing) {
    case "indexed":
      return toneClassName("success");
    case "indexing":
      return toneClassName("info");
    case "stale":
      return toneClassName("warning");
    case "failed":
      return toneClassName("danger");
    default:
      return toneClassName("muted");
  }
}

const columnHelper = createColumnHelper<typeof features, LibraryEntry>();

export interface LibraryColumnActions {
  onDeleteLibrary: (id: string) => void;
  onEditLibrary: (entry: LibraryEntry) => void;
  onExportRow: (entry: LibraryEntry) => void;
  onViewDetail: (entry: LibraryEntry) => void;
}

export function createLibraryTableColumns(actions: LibraryColumnActions) {
  return columnHelper.columns([
    {
      id: "select",
      header: ({ table }) => <SelectAllCheckbox table={table} />,
      cell: ({ row }) => <SelectRowCheckbox row={row} />,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Library",
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
              <Link
                to={`/libraries/${entry.id}`}
                className="font-medium hover:underline"
              >
                {entry.name}
              </Link>
              <span className="text-sm text-muted-foreground">
                {entry.ecosystem}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "version",
      header: "Version",
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.getValue("version")}</span>
      ),
    },
    {
      accessorKey: "sources",
      header: "Sources",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("sources")}</span>
      ),
    },
    {
      accessorKey: "indexing",
      header: "Indexing",
      cell: ({ row }) => {
        const indexing = row.getValue("indexing") as string;
        return (
          <Badge variant="secondary" className={getIndexingColor(indexing)}>
            {indexing}
          </Badge>
        );
      },
      filterFn: exactMatchFilter,
    },
    {
      accessorKey: "freshness",
      header: "Freshness",
      cell: ({ row }) => (
        <span className="text-sm">{row.getValue("freshness")}</span>
      ),
    },
    {
      accessorKey: "documents",
      header: "Documents",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("documents")}</span>
      ),
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
              onClick={() => actions.onViewDetail(entry)}
            >
              <Eye className="size-4" />
              <span className="sr-only">View library</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-pointer"
              onClick={() => actions.onEditLibrary(entry)}
            >
              <Pencil className="size-4" />
              <span className="sr-only">Edit library</span>
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
                  onClick={() => actions.onViewDetail(entry)}
                >
                  View Details
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
                  onClick={() => actions.onDeleteLibrary(entry.id)}
                >
                  <Trash2 className="mr-2 size-4" />
                  Delete Library
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ]);
}
