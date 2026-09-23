"use client";

import { useState } from "react";
import { BaseLayout } from "@/components/layouts/base-layout";
import { downloadCsv, toCsv } from "@/lib/download";
import { getInitials } from "@/lib/initials";
import { DataTable } from "./components/data-table";
import { type LogTile, StatCards } from "./components/stat-cards";
import initialLogsData from "./data.json";

interface LogEntry {
  id: string;
  message: string;
  requestId: string;
  avatar: string;
  level: string;
  time: string;
  request: string;
  service: string;
}

interface LogFormValues {
  message: string;
  requestId: string;
  level: string;
  time: string;
  request: string;
  service: string;
}

export default function LogsPage() {
  const [entries, setEntries] = useState<LogEntry[]>(initialLogsData);

  const tiles: LogTile[] = (() => {
    const errors = entries.filter((entry) => entry.level === "error").length;
    const warnings = entries.filter((entry) => entry.level === "warn").length;
    const services = new Set(entries.map((entry) => entry.service)).size;
    return [
      {
        label: "Total Entries",
        value: String(entries.length),
        delta: `${services} services`,
        trend: "up" as const,
        footer: "Across all services",
        subfooter: "API, worker, ingestion, MCP, database",
      },
      {
        label: "Errors",
        value: String(errors),
        delta: errors > 0 ? "needs attention" : "none",
        trend: errors > 0 ? ("down" as const) : ("up" as const),
        footer: "Failed operations",
        subfooter: "Rate limits and timeouts",
      },
      {
        label: "Warnings",
        value: String(warnings),
        delta: "degraded signals",
        trend: warnings > 0 ? ("down" as const) : ("up" as const),
        footer: "Retries and slow queries",
        subfooter: "Review before they escalate",
      },
      {
        label: "Debug",
        value: String(
          entries.filter((entry) => entry.level === "debug").length,
        ),
        delta: "verbose",
        trend: "up" as const,
        footer: "Diagnostic traces",
        subfooter: "Index scans and catalogs",
      },
    ];
  })();

  const handleAddLog = (logData: LogFormValues) => {
    const now = new Date();
    const time = logData.time || now.toTimeString().slice(0, 8);
    const requestId = logData.requestId || `req-${now.getTime().toString(36)}`;
    const newEntry: LogEntry = {
      id: `log-${now.getTime()}`,
      message: logData.message,
      requestId,
      avatar: getInitials(logData.message),
      level: logData.level,
      time,
      request: logData.request || requestId,
      service: logData.service,
    };
    setEntries((prev) => [newEntry, ...prev]);
  };

  const handleDeleteLog = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const handleCopyLog = (entry: LogEntry) => {
    void navigator.clipboard?.writeText(entry.message).catch(() => undefined);
  };

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
    );
  };

  return (
    <BaseLayout
      title="Logs"
      description="System log stream across API, worker, ingestion, MCP, and database"
    >
      <div className="flex flex-col gap-4">
        <div className="@container/main px-4 lg:px-6">
          <StatCards tiles={tiles} />
        </div>

        <div className="@container/main px-4 lg:px-6 mt-8 lg:mt-12">
          <DataTable
            entries={entries}
            onDeleteLog={handleDeleteLog}
            onAddLog={handleAddLog}
            onCopyLog={handleCopyLog}
            onExport={handleExportLogs}
          />
        </div>
      </div>
    </BaseLayout>
  );
}
