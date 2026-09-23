"use client"

import { BaseLayout } from "@/components/layouts/base-layout"
import { StatCards } from "./components/stat-cards"
import { DataTable } from "./components/data-table"
import { logEntriesFixture, type LogEntry } from "@/fixtures/logs"
import { downloadCsv, toCsv } from "@/lib/download"

function handleExport(entries: LogEntry[]): void {
  downloadCsv(
    "getlib-logs.csv",
    toCsv(
      ["timestamp", "level", "service", "message", "requestId"],
      entries.map((entry) => [
        entry.timestamp,
        entry.level,
        entry.service,
        entry.message,
        entry.requestId ?? "",
      ]),
    ),
  )
}

export default function LogsPage() {
  const entries = logEntriesFixture
  const stats = {
    total: entries.length,
    errors: entries.filter((entry) => entry.level === "error").length,
    warnings: entries.filter((entry) => entry.level === "warn").length,
    debug: entries.filter((entry) => entry.level === "debug").length,
  }

  return (
    <BaseLayout
      title="Logs"
      description="System log stream across API, worker, ingestion, MCP, and database"
    >
      <div className="flex flex-col gap-4">
        <div className="@container/main px-4 lg:px-6">
          <StatCards stats={stats} />
        </div>

        <div className="@container/main px-4 lg:px-6 mt-8 lg:mt-12">
          <DataTable entries={entries} onExport={handleExport} />
        </div>
      </div>
    </BaseLayout>
  )
}
