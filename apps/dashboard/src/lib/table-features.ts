import {
  type Column,
  columnFacetingFeature,
  columnFilteringFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createFacetedMinMaxValues,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  globalFilteringFeature,
  type ReactTable,
  type Row,
  type RowData,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from "@tanstack/react-table"

/**
 * Shared TanStack Table v9 features used by every data-table in the app.
 *
 * Registered once (outside of components, as recommended) so the `features`
 * object and its inferred types — `typeof features` — stay identical across
 * all tables and their sub-components.
 */
export const features = tableFeatures({
  columnFacetingFeature,
  columnFilteringFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  // Row model factories (client-side)
  filteredRowModel: createFilteredRowModel(),
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  facetedMinMaxValues: createFacetedMinMaxValues(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  // Function registries (keeps the v8-style named fn strings working)
  filterFns,
  sortFns,
})

export type Features = typeof features

/**
 * The table instance passed to table sub-components. This is the
 * `ReactTable` returned by `useTable` (which carries the fully-typed
 * `state` snapshot), not the core `Table` type (whose `state` is partial).
 */
export type TableInstance<TData extends RowData> = ReactTable<Features, TData>
export type ColumnInstance<TData extends RowData, TValue = unknown> = Column<
  Features,
  TData,
  TValue
>
export type RowInstance<TData extends RowData> = Row<Features, TData>