/**
 * Fixture-grade analytics data for the dashboard Analytics surface.
 *
 * Validated with zod at load so fixtures fail fast on drift. These shapes
 * are deliberately local: real retrieval-evaluation contracts arrive with
 * Phase 6 and must not be invented in @getlib/schemas prematurely.
 * Counts are kept consistent with the overview fixture (340 documents,
 * 5210 chunks, 2 active jobs, 0 failed).
 */
import { z } from "zod";

const MetricSchema = z.object({
  title: z.string().min(1),
  value: z.string().min(1),
  description: z.string().min(1),
  change: z.string().min(1),
  trend: z.enum(["up", "down"]),
  footer: z.string().min(1),
  subfooter: z.string().min(1),
});

export type AnalyticsMetric = z.infer<typeof MetricSchema>;

const ActivityPointSchema = z.object({
  label: z.string().min(1),
  searches: z.number().int().nonnegative(),
  withResults: z.number().int().nonnegative(),
});

export type ActivityPoint = z.infer<typeof ActivityPointSchema>;

const SourceShareSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  documents: z.number().int().nonnegative(),
  share: z.number().min(0).max(100),
  color: z.string().min(1),
});

export type SourceShare = z.infer<typeof SourceShareSchema>;

const IndexJobSchema = z.object({
  id: z.string().min(1),
  library: z.string().min(1),
  detail: z.string().min(1),
  status: z.enum(["completed", "running", "failed"]),
  updated: z.string().min(1),
});

export type IndexJob = z.infer<typeof IndexJobSchema>;

const TopLibrarySchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  ecosystem: z.string().min(1),
  documents: z.number().int().nonnegative(),
  chunks: z.number().int().nonnegative(),
  coverage: z.number().min(0).max(100),
  delta: z.string().min(1),
});

export type TopLibrary = z.infer<typeof TopLibrarySchema>;

const RetrievalSourceSchema = z.object({
  source: z.string().min(1),
  searches: z.number().int().nonnegative(),
  share: z.string().min(1),
});

export type RetrievalSource = z.infer<typeof RetrievalSourceSchema>;

export const analyticsMetricsFixture: AnalyticsMetric[] = z
  .array(MetricSchema)
  .parse([
    {
      title: "Total Searches",
      value: "8,412",
      description: "Queries served",
      change: "+12%",
      trend: "up",
      footer: "Search volume growing",
      subfooter: "Across all libraries",
    },
    {
      title: "Documents Indexed",
      value: "340",
      description: "Searchable documents",
      change: "+5.2%",
      trend: "up",
      footer: "Index coverage expanding",
      subfooter: "5210 chunks total",
    },
    {
      title: "Indexing Jobs",
      value: "2",
      description: "Jobs currently running",
      change: "0 failed",
      trend: "up",
      footer: "Pipeline healthy",
      subfooter: "Refresh and retry available",
    },
    {
      title: "Knowledge Sources",
      value: "4",
      description: "Connected source types",
      change: "npm 45%",
      trend: "up",
      footer: "Largest source: npm",
      subfooter: "npm, github, pypi, docs",
    },
  ]);

export const searchActivityFixture: ActivityPoint[] = z
  .array(ActivityPointSchema)
  .parse([
    { label: "Jan", searches: 420, withResults: 380 },
    { label: "Feb", searches: 510, withResults: 470 },
    { label: "Mar", searches: 480, withResults: 445 },
    { label: "Apr", searches: 620, withResults: 580 },
    { label: "May", searches: 700, withResults: 655 },
    { label: "Jun", searches: 780, withResults: 730 },
    { label: "Jul", searches: 860, withResults: 810 },
    { label: "Aug", searches: 820, withResults: 775 },
    { label: "Sep", searches: 940, withResults: 890 },
    { label: "Oct", searches: 1010, withResults: 960 },
    { label: "Nov", searches: 1120, withResults: 1065 },
    { label: "Dec", searches: 1210, withResults: 1152 },
  ]);

export const knowledgeSourcesFixture: SourceShare[] = z
  .array(SourceShareSchema)
  .parse([
    {
      key: "npm",
      label: "npm packages",
      documents: 153,
      share: 45,
      color: "var(--chart-1)",
    },
    {
      key: "github",
      label: "GitHub repos",
      documents: 102,
      share: 30,
      color: "var(--chart-2)",
    },
    {
      key: "pypi",
      label: "PyPI packages",
      documents: 51,
      share: 15,
      color: "var(--chart-3)",
    },
    {
      key: "docs",
      label: "Direct docs",
      documents: 34,
      share: 10,
      color: "var(--chart-4)",
    },
  ]);

export const recentJobsFixture: IndexJob[] = z.array(IndexJobSchema).parse([
  {
    id: "JOB-1041",
    library: "react",
    detail: "Full reindex, 412 chunks",
    status: "running",
    updated: "12 minutes ago",
  },
  {
    id: "JOB-1040",
    library: "@tanstack/react-query",
    detail: "Incremental refresh, 58 chunks",
    status: "running",
    updated: "31 minutes ago",
  },
  {
    id: "JOB-1039",
    library: "zod",
    detail: "Full reindex, 187 chunks",
    status: "completed",
    updated: "2 hours ago",
  },
  {
    id: "JOB-1038",
    library: "hono",
    detail: "Incremental refresh, 44 chunks",
    status: "completed",
    updated: "5 hours ago",
  },
  {
    id: "JOB-1037",
    library: "drizzle-orm",
    detail: "Full reindex, 230 chunks",
    status: "completed",
    updated: "1 day ago",
  },
]);

export const topLibrariesFixture: TopLibrary[] = z
  .array(TopLibrarySchema)
  .parse([
    {
      id: 1,
      name: "react",
      ecosystem: "npm",
      documents: 48,
      chunks: 812,
      coverage: 96,
      delta: "+8%",
    },
    {
      id: 2,
      name: "@tanstack/react-query",
      ecosystem: "npm",
      documents: 36,
      chunks: 640,
      coverage: 92,
      delta: "+12%",
    },
    {
      id: 3,
      name: "zod",
      ecosystem: "npm",
      documents: 28,
      chunks: 402,
      coverage: 88,
      delta: "+5%",
    },
    {
      id: 4,
      name: "hono",
      ecosystem: "npm",
      documents: 22,
      chunks: 318,
      coverage: 81,
      delta: "+3%",
    },
    {
      id: 5,
      name: "drizzle-orm",
      ecosystem: "npm",
      documents: 19,
      chunks: 290,
      coverage: 77,
      delta: "+6%",
    },
  ]);

export const retrievalVolumeFixture: ActivityPoint[] = z
  .array(ActivityPointSchema)
  .parse([
    { label: "Jan", searches: 420, withResults: 380 },
    { label: "Feb", searches: 510, withResults: 470 },
    { label: "Mar", searches: 480, withResults: 445 },
    { label: "Apr", searches: 620, withResults: 580 },
    { label: "May", searches: 700, withResults: 655 },
    { label: "Jun", searches: 780, withResults: 730 },
  ]);

export const retrievalSourcesFixture: RetrievalSource[] = z
  .array(RetrievalSourceSchema)
  .parse([
    { source: "npm packages", searches: 3785, share: "45.0%" },
    { source: "GitHub repos", searches: 2524, share: "30.0%" },
    { source: "PyPI packages", searches: 1262, share: "15.0%" },
    { source: "Direct docs", searches: 841, share: "10.0%" },
  ]);
