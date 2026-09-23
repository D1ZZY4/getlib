"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface SelectAllTable {
  getIsAllPageRowsSelected: () => boolean;
  getIsSomePageRowsSelected: () => boolean;
  toggleAllPageRowsSelected: (value: boolean) => void;
}

interface SelectableRow {
  getIsSelected: () => boolean;
  toggleSelected: (value: boolean) => void;
}

export function SelectAllCheckbox({
  table,
  checkboxClassName,
}: {
  table: SelectAllTable;
  checkboxClassName?: string;
}) {
  return (
    <div className="flex items-center justify-center px-2">
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className={cn(checkboxClassName)}
      />
    </div>
  );
}

export function SelectRowCheckbox({
  row,
  checkboxClassName,
}: {
  row: SelectableRow;
  checkboxClassName?: string;
}) {
  return (
    <div className="flex items-center justify-center px-2">
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className={cn(checkboxClassName)}
      />
    </div>
  );
}
