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
import { z } from "zod";

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

/**
 * Fixture-grade daily indexing activity for the Overview chart.
 * Deterministic formula (no randomness) so snapshots stay stable.
 * Local shape, like the analytics fixtures: real activity contracts
 * arrive with the ingestion/worker slices, not invented here.
 */
const IndexingPointSchema = z.object({
  date: z.string().min(1),
  documents: z.number().int().nonnegative(),
  chunks: z.number().int().nonnegative(),
});

export type IndexingPoint = z.infer<typeof IndexingPointSchema>;

function buildIndexingActivity(): IndexingPoint[] {
  const end = new Date("2026-09-23T00:00:00.000Z");
  return z.array(IndexingPointSchema).parse(
    Array.from({ length: 90 }, (_, index) => {
      const day = new Date(end);
      day.setUTCDate(day.getUTCDate() - (89 - index));
      const documents = 2 + ((index * 37) % 7);
      const chunks = documents * (6 + ((index * 13) % 5));
      return {
        date: day.toISOString().slice(0, 10),
        documents,
        chunks,
      };
    }),
  );
}

export const indexingActivityFixture: IndexingPoint[] = buildIndexingActivity();
