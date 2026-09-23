/**
 * GetLib TanStack Query defaults (doc 06 data architecture).
 *
 * Server state lives in the Query cache. Do not copy it into zustand or
 * other global stores. Factory (not a module-global client) so tests get
 * isolated caches; the app creates one instance in GetLibQueryProvider.
 */
import { QueryClient } from "@tanstack/react-query";

export function createGetLibQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Ops screens show last-known state briefly instead of refetching
        // on every focus; explicit refresh actions trigger refetch.
        staleTime: 10_000,
        gcTime: 5 * 60_000,
        // One retry smooths transient blips; persistent failures surface
        // as recoverable-error UI (doc 06 state model), not spin loops.
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}
