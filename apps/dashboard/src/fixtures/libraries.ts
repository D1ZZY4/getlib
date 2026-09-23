/**
 * Fixture-grade library corpus and version rows.
 * The registry backend with real discovery arrives with Phase 4.
 */
import { z } from "zod";

const LibraryEntrySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  ecosystem: z.string().min(1),
  version: z.string().min(1),
  sources: z.number().int().nonnegative(),
  indexing: z.enum(["indexed", "indexing", "stale", "failed"]),
  freshness: z.string().min(1),
  documents: z.number().int().nonnegative(),
  avatar: z.string().min(1),
});

export type LibraryEntryFixture = z.infer<typeof LibraryEntrySchema>;

export const libraryCorpusFixture: LibraryEntryFixture[] = z
  .array(LibraryEntrySchema)
  .parse([
    {
      id: "lib-react",
      name: "react",
      ecosystem: "npm",
      version: "19.3.0",
      sources: 4,
      indexing: "indexed",
      freshness: "12 minutes ago",
      documents: 48,
      avatar: "RE",
    },
    {
      id: "lib-react-query",
      name: "@tanstack/react-query",
      ecosystem: "npm",
      version: "5.90.3",
      sources: 3,
      indexing: "indexing",
      freshness: "31 minutes ago",
      documents: 36,
      avatar: "RQ",
    },
    {
      id: "lib-vite",
      name: "vite",
      ecosystem: "npm",
      version: "8.3.0",
      sources: 2,
      indexing: "indexed",
      freshness: "1 hour ago",
      documents: 30,
      avatar: "VI",
    },
    {
      id: "lib-zod",
      name: "zod",
      ecosystem: "npm",
      version: "4.6.5",
      sources: 3,
      indexing: "indexed",
      freshness: "2 hours ago",
      documents: 28,
      avatar: "ZO",
    },
    {
      id: "lib-tailwind",
      name: "tailwindcss",
      ecosystem: "npm",
      version: "4.3.3",
      sources: 2,
      indexing: "indexed",
      freshness: "3 hours ago",
      documents: 26,
      avatar: "TA",
    },
    {
      id: "lib-typescript",
      name: "typescript",
      ecosystem: "npm",
      version: "6.0.3",
      sources: 2,
      indexing: "stale",
      freshness: "6 days ago",
      documents: 24,
      avatar: "TS",
    },
    {
      id: "lib-hono",
      name: "hono",
      ecosystem: "npm",
      version: "4.13.8",
      sources: 2,
      indexing: "indexed",
      freshness: "5 hours ago",
      documents: 22,
      avatar: "HO",
    },
    {
      id: "lib-vitest",
      name: "vitest",
      ecosystem: "npm",
      version: "5.0.1",
      sources: 1,
      indexing: "indexed",
      freshness: "8 hours ago",
      documents: 20,
      avatar: "VT",
    },
    {
      id: "lib-drizzle",
      name: "drizzle-orm",
      ecosystem: "npm",
      version: "0.45.3",
      sources: 2,
      indexing: "indexed",
      freshness: "1 day ago",
      documents: 19,
      avatar: "DR",
    },
    {
      id: "lib-zustand",
      name: "zustand",
      ecosystem: "npm",
      version: "5.0.15",
      sources: 1,
      indexing: "indexed",
      freshness: "2 days ago",
      documents: 18,
      avatar: "ZU",
    },
    {
      id: "lib-recharts",
      name: "recharts",
      ecosystem: "npm",
      version: "3.10.1",
      sources: 1,
      indexing: "failed",
      freshness: "3 days ago",
      documents: 16,
      avatar: "RC",
    },
    {
      id: "lib-eslint",
      name: "eslint",
      ecosystem: "npm",
      version: "10.11.0",
      sources: 3,
      indexing: "indexed",
      freshness: "4 hours ago",
      documents: 53,
      avatar: "ES",
    },
  ]);

/**
 * Deterministic trust signal from indexing state. Fixture-grade: the
 * real trust model (freshness decay, source authority, verification)
 * arrives with later intelligence slices.
 */
export function trustForLibrary(
  entry: Pick<LibraryEntryFixture, "indexing">,
): "high" | "medium" | "low" {
  if (entry.indexing === "indexed") return "high";
  if (entry.indexing === "failed") return "low";
  return "medium";
}

const LibraryVersionSchema = z.object({
  version: z.string().min(1),
  tokens: z.string().min(1),
  snippets: z.number().int().nonnegative(),
  updated: z.string().min(1),
  isDefault: z.boolean(),
});

export type LibraryVersionFixture = z.infer<typeof LibraryVersionSchema>;

export const libraryVersionsFixture: LibraryVersionFixture[] = z
  .array(LibraryVersionSchema)
  .parse([
    {
      version: "19.3.0",
      tokens: "628,635",
      snippets: 1940,
      updated: "Sep 22, 2026",
      isDefault: true,
    },
    {
      version: "19.2.0",
      tokens: "583,759",
      snippets: 1990,
      updated: "Aug 30, 2026",
      isDefault: false,
    },
    {
      version: "19.1.1",
      tokens: "578,834",
      snippets: 2031,
      updated: "Jul 14, 2026",
      isDefault: false,
    },
    {
      version: "19.1.0",
      tokens: "577,656",
      snippets: 2103,
      updated: "Jun 02, 2026",
      isDefault: false,
    },
    {
      version: "18.3.1",
      tokens: "463,027",
      snippets: 1567,
      updated: "Apr 19, 2026",
      isDefault: false,
    },
    {
      version: "18.2.0",
      tokens: "358,452",
      snippets: 1235,
      updated: "Feb 08, 2026",
      isDefault: false,
    },
  ]);
