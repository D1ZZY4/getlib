import type { ReactNode } from "react"
import { BaseLayout } from "@/components/layouts/base-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useHealthQuery, useOverviewQuery } from "@/hooks/use-overview"
import { SectionCards, type OverviewStat } from "./components/section-cards"
import { ChartAreaInteractive } from "./components/chart-area-interactive"
import { indexingActivityFixture } from "@/fixtures/overview"
import type { HealthResponse, OverviewSummary } from "@getlib/schemas"

function buildStats(
  health: HealthResponse,
  summary: OverviewSummary,
): OverviewStat[] {
  return [
    {
      label: "Libraries",
      value: String(summary.libraryCount),
      delta: `${summary.activeJobs} active`,
      trend: summary.activeJobs > 0 ? "up" : "down",
      footer: "Registered libraries",
      subfooter: `${summary.documentCount} documents indexed`,
    },
    {
      label: "Documents",
      value: String(summary.documentCount),
      delta: `${summary.chunkCount} chunks`,
      trend: "up",
      footer: "Indexed documents",
      subfooter: "Across all libraries",
    },
    {
      label: "Active jobs",
      value: String(summary.activeJobs),
      delta: `${summary.failedJobs} failed`,
      trend: summary.failedJobs > 0 ? "down" : "up",
      footer: "Jobs running",
      subfooter: "Retry failed jobs from Indexing",
    },
    {
      label: "Service health",
      value: health.status,
      delta: `v${health.version}`,
      trend: health.status === "ok" ? "up" : "down",
      footer:
        health.status === "ok"
          ? "Knowledge engine operational"
          : "Attention required",
      subfooter: `Snapshot ${new Date(summary.generatedAt).toLocaleDateString()}`,
    },
  ]
}

function isEmptySummary(summary: OverviewSummary): boolean {
  return (
    summary.libraryCount === 0 &&
    summary.documentCount === 0 &&
    summary.chunkCount === 0 &&
    summary.activeJobs === 0 &&
    summary.failedJobs === 0
  )
}

export default function Page() {
  const healthQuery = useHealthQuery()
  const overviewQuery = useOverviewQuery()

  const pending = healthQuery.isPending || overviewQuery.isPending
  const error = healthQuery.error ?? overviewQuery.error
  const health = healthQuery.data
  const summary = overviewQuery.data
  const stale = healthQuery.isStale || overviewQuery.isStale

  let content: ReactNode
  if (pending) {
    content = <SectionCards loading />
  } else if (error) {
    content = (
      <Card role="alert">
        <CardHeader>
          <CardTitle>Overview unavailable</CardTitle>
          <CardDescription>{error.message}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            type="button"
            onClick={() => {
              void healthQuery.refetch()
              void overviewQuery.refetch()
            }}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  } else if (!health || !summary) {
    content = <SectionCards loading />
  } else if (isEmptySummary(summary)) {
    content = (
      <Card>
        <CardHeader>
          <CardTitle>No libraries indexed yet</CardTitle>
          <CardDescription>
            Add a library to start building version-aware knowledge. Indexed
            documents, chunks, and jobs will appear here.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  } else {
    content = (
      <>
        <SectionCards stats={buildStats(health, summary)} />
        <ChartAreaInteractive
          title="Indexing Activity"
          description="Documents and chunks indexed per day"
          data={indexingActivityFixture}
        />
      </>
    )
  }

  return (
    <BaseLayout
      title="Overview"
      description="Libraries, knowledge, and indexing activity at a glance"
    >
      <div className="@container/main px-4 lg:px-6 space-y-6">
        {stale && !pending && !error ? (
          <div>
            <Badge variant="outline">Stale snapshot</Badge>
          </div>
        ) : null}
        {content}
      </div>
    </BaseLayout>
  )
}
