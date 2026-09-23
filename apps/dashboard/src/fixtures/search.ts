/**
 * Fixture-grade search corpus and matcher for the dashboard Search surface.
 *
 * Real lexical/semantic retrieval arrives with Phase 6. Until then this
 * module offers the same async, cancelable shape the API will expose:
 * queries resolve after a short delay and honor AbortSignal, so stale
 * requests never overwrite current results.
 */
import { z } from "zod";

const SearchResultSchema = z.object({
  id: z.string().min(1),
  library: z.string().min(1),
  version: z.string().min(1),
  source: z.string().min(1),
  document: z.string().min(1),
  section: z.string().min(1),
  snippet: z.string().min(1),
  freshness: z.enum(["fresh", "stale"]),
});

export type SearchResult = z.infer<typeof SearchResultSchema>;

export interface SearchFilters {
  library: string;
  version: string;
  source: string;
  limit: number;
}

export const DEFAULT_SEARCH_FILTERS: SearchFilters = {
  library: "all",
  version: "",
  source: "all",
  limit: 10,
};

const corpus: SearchResult[] = z.array(SearchResultSchema).parse([
  {
    id: "sr-001",
    library: "react",
    version: "19.3.0",
    source: "npm",
    document: "Getting started",
    section: "Installation",
    snippet: "Install react and react-dom, then render your root component into a container element.",
    freshness: "fresh",
  },
  {
    id: "sr-002",
    library: "@tanstack/react-query",
    version: "5.90.3",
    source: "npm",
    document: "useQuery reference",
    section: "Query keys",
    snippet: "Query keys uniquely identify cached data and drive automatic refetching behavior.",
    freshness: "fresh",
  },
  {
    id: "sr-003",
    library: "zod",
    version: "4.6.5",
    source: "npm",
    document: "Schemas and validation",
    section: "Objects",
    snippet: "z.object defines validated record shapes with inferred TypeScript types.",
    freshness: "fresh",
  },
  {
    id: "sr-004",
    library: "hono",
    version: "4.13.8",
    source: "github",
    document: "Context and HonoRequest",
    section: "Handlers",
    snippet: "Handlers receive a context carrying the request, response helpers, and variables.",
    freshness: "stale",
  },
  {
    id: "sr-005",
    library: "drizzle-orm",
    version: "0.45.3",
    source: "github",
    document: "Relations and queries",
    section: "Selects",
    snippet: "Relational queries resolve nested rows in a single round trip.",
    freshness: "fresh",
  },
  {
    id: "sr-006",
    library: "react",
    version: "19.3.0",
    source: "npm",
    document: "Hooks reference",
    section: "useEffect",
    snippet: "Effects synchronize external systems after render commits to the screen.",
    freshness: "fresh",
  },
  {
    id: "sr-007",
    library: "typescript",
    version: "6.0.3",
    source: "npm",
    document: "Strict configuration",
    section: "Compiler options",
    snippet: "Strict mode enables the full family of type-safety checks for new projects.",
    freshness: "stale",
  },
  {
    id: "sr-008",
    library: "vite",
    version: "8.3.0",
    source: "npm",
    document: "Static deployments",
    section: "Preview",
    snippet: "Preview serves the production build locally for verification before deploy.",
    freshness: "fresh",
  },
]);

export function matchSearchResults(
  query: string,
  filters: SearchFilters,
): SearchResult[] {
  const needle = query.trim().toLowerCase();
  return corpus
    .filter((result) => {
      if (filters.library !== "all" && result.library !== filters.library) {
        return false;
      }
      if (
        filters.version.trim().length > 0 &&
        result.version !== filters.version.trim()
      ) {
        return false;
      }
      if (filters.source !== "all" && result.source !== filters.source) {
        return false;
      }
      if (needle.length === 0) return true;
      return (
        result.document.toLowerCase().includes(needle) ||
        result.section.toLowerCase().includes(needle) ||
        result.snippet.toLowerCase().includes(needle) ||
        result.library.toLowerCase().includes(needle)
      );
    })
    .slice(0, Math.max(1, filters.limit));
}

export function searchLibraryFixtures(
  query: string,
  filters: SearchFilters,
  options: { signal?: AbortSignal } = {},
): Promise<SearchResult[]> {
  return new Promise((resolve, reject) => {
    if (options.signal?.aborted) {
      reject(new DOMException("aborted", "AbortError"));
      return;
    }
    const timer = setTimeout(() => {
      resolve(matchSearchResults(query, filters));
    }, 150);
    options.signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(new DOMException("aborted", "AbortError"));
      },
      { once: true },
    );
  });
}
