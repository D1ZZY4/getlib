/**
 * Schema-conformant fixtures for the dashboard Overview surface (doc 06).
 *
 * Every fixture is parsed against @getlib/schemas at module load so a
 * drifting fixture fails fast in tests instead of silently diverging from
 * the API contract. Shapes mirror the Phase 3 response contracts; the
 * hooks in @/hooks/use-overview switch to live data without redesign.
 */
import {
  HealthResponseSchema,
  OverviewSummarySchema,
  type HealthResponse,
  type OverviewSummary,
} from "@getlib/schemas";

export const healthFixture: HealthResponse = HealthResponseSchema.parse({
  status: "ok",
  version: "0.1.0",
});

export const overviewFixture: OverviewSummary = OverviewSummarySchema.parse({
  libraryCount: 12,
  documentCount: 340,
  chunkCount: 5210,
  activeJobs: 2,
  failedJobs: 0,
  generatedAt: "2026-09-23T07:00:00.000Z",
});
