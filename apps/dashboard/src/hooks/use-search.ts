/**
 * GetLib search query (doc 06 data architecture).
 *
 * TanStack Query owns caching and cancellation: changing the query key
 * aborts the in-flight fixture search through AbortSignal, so stale
 * results never overwrite current ones.
 */
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { SearchResult } from "@/fixtures/search";
import {
  DEFAULT_SEARCH_FILTERS,
  searchLibraryFixtures,
  type SearchFilters,
} from "@/fixtures/search";
import { getDataSource } from "@/lib/data-source";

export function useSearchQuery(
  query: string,
  filters: SearchFilters = DEFAULT_SEARCH_FILTERS,
): UseQueryResult<SearchResult[], Error> {
  const live = getDataSource() === "api";
  return useQuery({
    queryKey: ["getlib", "search", query, filters],
    queryFn: ({ signal }) => {
      if (!live) {
        return searchLibraryFixtures(query, filters, { signal });
      }
      throw new Error("Live search API is not implemented yet (Phase 6)");
    },
    enabled: query.trim().length > 0,
    staleTime: 30_000,
    retry: false,
  });
}
