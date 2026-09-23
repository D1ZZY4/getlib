"use client"

import { useState } from "react"
import { BaseLayout } from "@/components/layouts/base-layout"
import { StatCards } from "./components/stat-cards"
import { DataTable } from "./components/data-table"

import initialLogsData from "./data.json"
import { downloadCsv, toCsv } from "@/lib/download"

interface LogEntry {
  id: string
  message: string
  requestId: string
  avatar: string
  level: string
  time: string
  request: string
  service: string
}

interface LogFormValues {
  message: string
  requestId: string
  level: string
  time: string
  request: string
  service: string
}

export default function LogsPage() {
  const [entries, setEntries] = useState<LogEntry[]>(initialLogsData)

  const generateAvatar = (message: string) => {
    const words = message.split(" ")
    if (words.length >= 2) {
      return `${words[0]?.[0] ?? ""}${words[1]?.[0] ?? ""}`.toUpperCase()
    }
    return message.substring(0, 2).toUpperCase()
  }

  const handleAddLog = (logData: LogFormValues) => {
    const now = new Date()
    const time = logData.time || now.toTimeString().slice(0, 8)
    const requestId = logData.requestId || `req-${now.getTime().toString(36)}`
    const newEntry: LogEntry = {
      id: `log-${now.getTime()}`,
      message: logData.message,
      requestId,
      avatar: generateAvatar(logData.message),
      level: logData.level,
      time,
      request: logData.request || requestId,
      service: logData.service,
    }
    setEntries(prev => [newEntry, ...prev])
  }

  const handleDeleteLog = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id))
  }

  const handleEditLog = (entry: LogEntry) => {
    // For now, just log the entry to edit
    // In a real app, you'd open an edit dialog
    console.log("Edit log entry:", entry)
  }

  const handleCopyLog = (entry: LogEntry) => {
    void navigator.clipboard?.writeText(entry.message).catch(() => undefined)
  }

  const handleExportLogs = (visible: LogEntry[]) => {
    downloadCsv(
      "getlib-logs.csv",
      toCsv(
        ["id", "time", "level", "service", "message", "request"],
        visible.map((entry) => [
          entry.id,
          entry.time,
          entry.level,
          entry.service,
          entry.message,
          entry.request,
        ]),
      ),
    )
  }

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
          <DataTable
            entries={entries}
            onDeleteLog={handleDeleteLog}
            onEditLog={handleEditLog}
            onAddLog={handleAddLog}
            onCopyLog={handleCopyLog}
            onExport={handleExportLogs}
          />
        </div>
      </div>
    </BaseLayout>
  )
}
