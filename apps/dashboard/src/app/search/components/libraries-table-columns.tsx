"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { LibraryEntryFixture } from "@/fixtures/libraries";
import type { features } from "@/lib/table-features";

export type LibraryTrust = "high" | "medium" | "low";

export function trustClassName(trust: LibraryTrust): string {
  if (trust === "high") {
    return "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20";
  }
  if (trust === "medium") {
    return "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/20";
  }
  return "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20";
}

const columnHelper = createColumnHelper<typeof features, LibraryEntryFixture>();

export function createLibraryColumns(
  trustFor: (entry: LibraryEntryFixture) => LibraryTrust,
) {
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
      accessorKey: "name",
      header: "Name",
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
              <p className="text-muted-foreground text-xs">{entry.ecosystem}</p>
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
        <span className="tabular-nums">{row.getValue("sources")}</span>
      ),
    },
    {
      accessorKey: "documents",
      header: "Documents",
      cell: ({ row }) => (
        <span className="tabular-nums">{row.getValue("documents")}</span>
      ),
    },
    {
      accessorKey: "freshness",
      header: "Updated",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs">
          {row.getValue("freshness")}
        </span>
      ),
    },
    {
      id: "trust",
      header: "Trust",
      accessorFn: (row) => trustFor(row),
      cell: (info) => {
        const trust = info.getValue() as LibraryTrust;
        return (
          <Badge variant="secondary" className={trustClassName(trust)}>
            {trust}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const entry = row.original;
        return (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 cursor-pointer"
            asChild
          >
            <Link to={`/libraries/${entry.id}`}>
              <Eye className="size-4" />
              <span className="sr-only">View library</span>
            </Link>
          </Button>
        );
      },
    },
  ]);
}
