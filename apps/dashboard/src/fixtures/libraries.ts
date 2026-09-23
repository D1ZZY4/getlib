/**
 * Fixture-grade library version rows for the edit page versions table.
 * Real version discovery arrives with the Phase 4 registry slice.
 */
import { z } from "zod";

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
    { version: "19.3.0", tokens: "628,635", snippets: 1940, updated: "Sep 22, 2026", isDefault: true },
    { version: "19.2.0", tokens: "583,759", snippets: 1990, updated: "Aug 30, 2026", isDefault: false },
    { version: "19.1.1", tokens: "578,834", snippets: 2031, updated: "Jul 14, 2026", isDefault: false },
    { version: "19.1.0", tokens: "577,656", snippets: 2103, updated: "Jun 02, 2026", isDefault: false },
    { version: "18.3.1", tokens: "463,027", snippets: 1567, updated: "Apr 19, 2026", isDefault: false },
    { version: "18.2.0", tokens: "358,452", snippets: 1235, updated: "Feb 08, 2026", isDefault: false },
  ]);
