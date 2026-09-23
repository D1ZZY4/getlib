import type { RowData } from "@tanstack/react-table";
import type {
  ColumnInstance,
  RowInstance,
  TableInstance,
} from "@/lib/table-features";

export type { ColumnInstance, RowInstance, TableInstance };

export interface DataTableState<TData extends RowData> {
  table: TableInstance<TData>;
}

export function exactMatchFilter<TData extends RowData>(
  row: RowInstance<TData>,
  columnId: string,
  value: string,
): boolean {
  return row.getValue(columnId) === value;
}
