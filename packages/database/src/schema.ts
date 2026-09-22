/**
 * @getlib/database - Drizzle schema root.
 *
 * Domain tables land with their owning phases (Phase 3 persistence,
 * Phase 4 registry). This module intentionally defines no tables yet so
 * Phase 1 does not create speculative schema. drizzle-kit tracks this
 * file as the schema entrypoint for `db:generate`.
 */
export {};
