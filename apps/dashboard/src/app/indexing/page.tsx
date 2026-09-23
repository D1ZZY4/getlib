"use client"

import { useState } from "react"
import { BaseLayout } from "@/components/layouts/base-layout"
import { StatCards } from "./components/stat-cards"
import { DataTable } from "./components/data-table"
import { indexJobsFixture, type IndexJob } from "@/fixtures/indexing"

export default function IndexingPage() {
  const [jobs, setJobs] = useState<IndexJob[]>(indexJobsFixture)

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

        <div className="@container/main px-4 lg:px-6 mt-8 lg:mt-12">
          <DataTable jobs={jobs} onRetry={handleRetry} onCancel={handleCancel} />
        </div>
      </div>
    </BaseLayout>
  )
}
