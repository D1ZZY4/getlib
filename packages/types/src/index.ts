/**
 * @getlib/types - small shared types.
 * Keep this package dependency-free and stable.
 * Domain contracts with runtime validation belong in @getlib/schemas.
 */

/** Explicit result type. Prefer over throwing across package boundaries. */
export type Result<T, E = GetLibError> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export interface GetLibError {
  code: string;
  message: string;
}

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function err<E extends GetLibError>(error: E): Result<never, E> {
  return { ok: false, error };
}

export function isOk<T, E>(
  result: Result<T, E>,
): result is { ok: true; value: T } {
  return result.ok === true;
}

/** Failure transparency states (architecture principle). */
export const KNOWLEDGE_STATUSES = [
  "ok",
  "stale",
  "unavailable",
  "partial",
  "failed",
  "ambiguous",
  "no-evidence",
] as const;

export type KnowledgeStatus = (typeof KNOWLEDGE_STATUSES)[number];

/** Minimal provenance retained with retrieved knowledge. */
export interface Provenance {
  library: string;
  version?: string | undefined;
  source: string;
  sourceRevision?: string | undefined;
  document?: string | undefined;
  section?: string | undefined;
  url?: string | undefined;
}
