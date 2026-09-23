"use client"

import { useState } from "react"
import { Download, KanbanSquare, Table2 } from "lucide-react"
import { BaseLayout } from "@/components/layouts/base-layout"
import { Button } from "@/components/ui/button"
import { StatCards } from "./components/stat-cards"
import { DataTable } from "./components/data-table"
import { JobBoard } from "./components/job-board"
import { indexJobsFixture, type IndexJob } from "@/fixtures/indexing"
import { downloadCsv, toCsv } from "@/lib/download"

type BoardColumn = "queued" | "running" | "attention" | "done"

const COLUMN_STATES: Record<BoardColumn, IndexJob["state"]> = {
  queued: "queued",
  running: "running",
  attention: "failed",
  done: "completed",
}

export default function IndexingPage() {
  const [jobs, setJobs] = useState<IndexJob[]>(indexJobsFixture)
  const [view, setView] = useState<"board" | "table">("board")

  const handleRetry = (id: string) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === id
          ? { ...job, state: "queued" as const, progress: 0, error: undefined }
          : job,
      ),
    )
  }

  const handleCancel = (id: string) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === id
          ? { ...job, state: "canceled" as const, step: "Cancelled by operator" }
          : job,
      ),
    )
  }

  const handleMove = (id: string, column: BoardColumn) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === id ? { ...job, state: COLUMN_STATES[column] } : job,
      ),
    )
  }

  const handleExport = () => {
    downloadCsv(
      "getlib-indexing-jobs.csv",
      toCsv(
        ["id", "library", "version", "state", "progress", "duration", "retries"],
        jobs.map((job) => [
          job.id,
          job.library,
          job.version,
          job.state,
          job.progress,
          job.duration,
          job.retries,
        ]),
      ),
    )
  }

  return (
    <BaseLayout
      title="Indexing"
      description="Source-to-index pipeline jobs with retries and progress"
    >
      <div className="flex flex-col gap-4">
        <div className="@container/main px-4 lg:px-6">
          <StatCards
            stats={{
              running: jobs.filter((job) => job.state === "running").length,
              queued: jobs.filter((job) => job.state === "queued").length,
              failed: jobs.filter(
                (job) => job.state === "failed" || job.state === "retrying",
              ).length,
              completed: jobs.filter((job) => job.state === "completed").length,
            }}
          />
        </div>

        <div className="@container/main px-4 lg:px-6 mt-8 lg:mt-12 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={view === "board" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("board")}
                className="cursor-pointer"
              >
                <KanbanSquare className="mr-2 size-4" />
                Board
              </Button>
              <Button
                type="button"
                variant={view === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("table")}
                className="cursor-pointer"
              >
                <Table2 className="mr-2 size-4" />
                Table
              </Button>
            </div>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={handleExport}
            >
              <Download className="mr-2 size-4" />
              Export
            </Button>
          </div>
          <p className="text-muted-foreground text-sm">
            {jobs.length} jobs across the pipeline
          </p>
          {view === "board" ? (
            <JobBoard
              jobs={jobs}
              onRetry={handleRetry}
              onCancel={handleCancel}
              onMove={handleMove}
            />
          ) : (
            <DataTable
              jobs={jobs}
              onRetry={handleRetry}
              onCancel={handleCancel}
            />
          )}
        </div>
      </div>
    </BaseLayout>
  )
}
