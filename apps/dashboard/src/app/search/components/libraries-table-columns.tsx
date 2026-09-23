"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { SelectAllCheckbox, SelectRowCheckbox } from "@/components/data-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { LibraryEntryFixture } from "@/fixtures/libraries";
import { toneClassName } from "@/lib/badge-tone";
import type { features } from "@/lib/table-features";

export type LibraryTrust = "high" | "medium" | "low";

export function trustClassName(trust: LibraryTrust): string {
  if (trust === "high") return toneClassName("success");
  if (trust === "medium") return toneClassName("warning");
  return toneClassName("danger");
}

const columnHelper = createColumnHelper<typeof features, LibraryEntryFixture>();

export function createLibraryColumns(
  trustFor: (entry: LibraryEntryFixture) => LibraryTrust,
) {
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
