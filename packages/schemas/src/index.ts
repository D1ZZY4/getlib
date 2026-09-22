/**
 * @getlib/schemas - shared runtime contracts.
 * Public API/MCP contracts must be defined here once and reused,
 * never duplicated manually in apps.
 */
import { z } from "zod";

/** Canonical library slug: lowercase, digits, separators, optional npm scope. */
export const LibrarySlugSchema = z
  .string()
  .min(1)
  .max(128)
  .regex(
    /^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._/-]*[a-z0-9]$|^[a-z0-9]$/,
    "must be a lowercase library slug",
  );

export type LibrarySlug = z.infer<typeof LibrarySlugSchema>;

/** Version string: exact upstream version where available, else channel. */
export const LibraryVersionSchema = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[A-Za-z0-9][A-Za-z0-9._+~/-]*$/, "must be a version string");

export type LibraryVersion = z.infer<typeof LibraryVersionSchema>;

export const EcosystemSchema = z.enum([
  "npm",
  "pypi",
  "github",
  "go",
  "crates",
  "generic",
]);

export type Ecosystem = z.infer<typeof EcosystemSchema>;

/** Failure transparency: explicit states over silent success. */
export const KnowledgeStatusSchema = z.enum([
  "ok",
  "stale",
  "unavailable",
  "partial",
  "failed",
  "ambiguous",
  "no-evidence",
]);

export type KnowledgeStatus = z.infer<typeof KnowledgeStatusSchema>;

/** Library identity query (registry resolution input). */
export const LibraryQuerySchema = z.object({
  query: z.string().min(1).max(256),
  ecosystem: EcosystemSchema.optional(),
  version: LibraryVersionSchema.optional(),
});

export type LibraryQuery = z.infer<typeof LibraryQuerySchema>;

/** Health/readiness response shape. */
export const HealthResponseSchema = z.object({
  status: z.enum(["ok", "degraded", "down"]),
  version: z.string().min(1),
  uptimeSeconds: z.number().nonnegative().optional(),
});

export type HealthResponse = z.infer<typeof HealthResponseSchema>;

/** Transport error envelope shared by API/MCP mappers. */
export const ApiErrorSchema = z.object({
  code: z.string().min(1).max(64),
  message: z.string().min(1).max(1000),
  requestId: z.string().min(1).max(64).optional(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;
