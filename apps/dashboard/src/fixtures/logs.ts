/**
 * Fixture-grade system log entries for the dashboard Logs surface.
 *
 * Validated with zod at load. A real streaming backend arrives with
 * Phase 9 observability; until then this is a filterable snapshot,
 * not a live tail.
 */
import { z } from "zod";

const LogEntrySchema = z.object({
  id: z.string().min(1),
  timestamp: z.string().min(1),
  level: z.enum(["debug", "info", "warn", "error"]),
  service: z.enum(["api", "worker", "ingestion", "mcp", "database"]),
  message: z.string().min(1),
  requestId: z.string().min(1).optional(),
});

export type LogEntry = z.infer<typeof LogEntrySchema>;

export const logEntriesFixture: LogEntry[] = z
  .array(LogEntrySchema)
  .parse([
    {
      id: "log-0042",
      timestamp: "2026-09-23T08:41:02.000Z",
      level: "info",
      service: "api",
      message: "GET /api/v1/overview/summary 200 (14ms)",
      requestId: "req-9f2c",
    },
    {
      id: "log-0041",
      timestamp: "2026-09-23T08:40:47.000Z",
      level: "info",
      service: "worker",
      message: "JOB-1041 completed: react full reindex, 412 chunks",
      requestId: "req-9f1a",
    },
    {
      id: "log-0040",
      timestamp: "2026-09-23T08:39:15.000Z",
      level: "warn",
      service: "ingestion",
      message: "Fetch retry 2/3 for zod changelog (timeout 10s)",
      requestId: "req-9e77",
    },
    {
      id: "log-0039",
      timestamp: "2026-09-23T08:38:03.000Z",
      level: "error",
      service: "ingestion",
      message: "Fetch failed for hono docs: 429 rate limited",
      requestId: "req-9e51",
    },
    {
      id: "log-0038",
      timestamp: "2026-09-23T08:35:29.000Z",
      level: "info",
      service: "mcp",
      message: "gl_search served 6 results with provenance (88ms)",
      requestId: "req-9e02",
    },
    {
      id: "log-0037",
      timestamp: "2026-09-23T08:33:11.000Z",
      level: "debug",
      service: "database",
      message: "pgvector index scan: 1240 candidates, 0.8ms",
    },
    {
      id: "log-0036",
      timestamp: "2026-09-23T08:31:56.000Z",
      level: "info",
      service: "worker",
      message: "JOB-1040 started: @tanstack/react-query incremental refresh",
      requestId: "req-9dbe",
    },
    {
      id: "log-0035",
      timestamp: "2026-09-23T08:29:44.000Z",
      level: "warn",
      service: "api",
      message: "Slow query: /api/v1/search 812ms (budget 500ms)",
      requestId: "req-9d90",
    },
    {
      id: "log-0034",
      timestamp: "2026-09-23T08:27:20.000Z",
      level: "info",
      service: "ingestion",
      message: "Revision pinned: drizzle-orm docs r1841 (last good kept)",
      requestId: "req-9d55",
    },
    {
      id: "log-0033",
      timestamp: "2026-09-23T08:25:08.000Z",
      level: "error",
      service: "worker",
      message: "JOB-1036 failed: embedding provider timeout, retrying",
      requestId: "req-9d21",
    },
    {
      id: "log-0032",
      timestamp: "2026-09-23T08:22:51.000Z",
      level: "debug",
      service: "mcp",
      message: "Tool catalog served: 14 tools, schema v3",
    },
    {
      id: "log-0031",
      timestamp: "2026-09-23T08:20:00.000Z",
      level: "info",
      service: "database",
      message: "Migration level 0001 verified on startup",
    },
  ]);
