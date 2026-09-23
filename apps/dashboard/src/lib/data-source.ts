/**
 * GetLib dashboard data source switch (doc 06 exit path).
 *
 * The UI runs on schema-conformant fixtures until the Phase 3 Hono API
 * exists. Hooks branch on this flag so switching to live API responses
 * requires configuration, not redesign. Defaults to fixtures.
 */
export type DataSource = "fixture" | "api";

export function getDataSource(env?: {
  VITE_DATA_SOURCE?: string | undefined;
}): DataSource {
  const raw =
    env?.VITE_DATA_SOURCE ??
    (import.meta.env.VITE_DATA_SOURCE as string | undefined);
  return raw === "api" ? "api" : "fixture";
}
