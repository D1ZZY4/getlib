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
import { indexingActivityFixture, recentlyIndexedFixture } from "@/fixtures/overview"
import { formatUptime } from "@/lib/format"
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
      subfooter: "npm, github, pypi, docs",
    },
    {
      label: "Documents",
      value: String(summary.documentCount),
      delta: `${summary.chunkCount.toLocaleString()} chunks`,
      trend: "up",
      footer: "Indexed documents",
      subfooter: "Version-aware knowledge",
    },
    {
      label: "Active jobs",
      value: String(summary.activeJobs),
      delta: `${summary.failedJobs} failed`,
      trend: summary.failedJobs > 0 ? "down" : "up",
      footer: "Jobs running",
      subfooter: "Pipeline healthy",
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
      subfooter:
        health.uptimeSeconds === undefined
          ? `Snapshot ${new Date(summary.generatedAt).toLocaleDateString()}`
          : `Uptime ${formatUptime(health.uptimeSeconds)}`,
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
        <Card>
          <CardHeader>
            <CardTitle>Recently indexed</CardTitle>
            <CardDescription>
              Latest documents added to the knowledge index
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentlyIndexedFixture.map((doc) => (
              <div
                key={`${doc.library}@${doc.version}/${doc.title}`}
                className="flex items-center p-3 rounded-lg border gap-2"
              >
                <div className="flex gap-2 items-center justify-between flex-1 flex-wrap">
                  <div>
                    <p className="text-sm font-medium truncate">{doc.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {doc.library}@{doc.version}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="text-xs">
                      {doc.source}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {doc.indexedAt}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </>
    )
  }

  return (
    <BaseLayout
      title="Overview"
      description="Libraries, knowledge, and indexing activity at a glance"
    >
      <div className="@container/main px-4 lg:px-6 space-y-6">
        {content}
      </div>
    </BaseLayout>
  )
}
