"use client"

import { useMemo, useState } from "react"
import { BaseLayout } from "@/components/layouts/base-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { logEntriesFixture, type LogEntry } from "@/fixtures/logs"
import { downloadCsv, toCsv } from "@/lib/download"

function levelVariant(
  level: LogEntry["level"],
): "default" | "secondary" | "destructive" | "outline" {
  if (level === "error") return "destructive"
  if (level === "warn") return "secondary"
  if (level === "info") return "default"
  return "outline"
}

export default function LogsPage() {
  const [query, setQuery] = useState("")
  const [level, setLevel] = useState("all")
  const [service, setService] = useState("all")

  const entries = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return logEntriesFixture.filter((entry) => {
      if (level !== "all" && entry.level !== level) return false
      if (service !== "all" && entry.service !== service) return false
      if (needle.length === 0) return true
      return (
        entry.message.toLowerCase().includes(needle) ||
        entry.service.includes(needle) ||
        (entry.requestId ?? "").toLowerCase().includes(needle)
      )
    })
  }, [query, level, service])

  const handleExport = () => {
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

  return (
    <BaseLayout
      title="Logs"
      description="System log stream across API, worker, ingestion, MCP, and database"
    >
      <div className="@container/main px-4 lg:px-6 space-y-6">
        <Card>
          <CardContent className="flex flex-col gap-3 pt-6 md:flex-row md:items-center">
            <Input
              placeholder="Search messages, services, request IDs..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="md:max-w-sm"
              aria-label="Search logs"
            />
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger className="md:w-40" aria-label="Filter by level">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All levels</SelectItem>
                <SelectItem value="debug">Debug</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warn">Warn</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
            <Select value={service} onValueChange={setService}>
              <SelectTrigger className="md:w-44" aria-label="Filter by service">
                <SelectValue placeholder="Service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All services</SelectItem>
                <SelectItem value="api">api</SelectItem>
                <SelectItem value="worker">worker</SelectItem>
                <SelectItem value="ingestion">ingestion</SelectItem>
                <SelectItem value="mcp">mcp</SelectItem>
                <SelectItem value="database">database</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-3 md:ml-auto">
              <span className="text-muted-foreground text-sm">
                {entries.length} of {logEntriesFixture.length} entries
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleExport}
              >
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {entries.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="font-medium">No log entries match</p>
              <p className="text-muted-foreground text-sm">
                Adjust the search text or filters.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-44">Time</TableHead>
                    <TableHead className="w-24">Level</TableHead>
                    <TableHead className="w-28">Service</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead className="w-28">Request</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="text-muted-foreground font-mono text-xs whitespace-nowrap">
                        {new Date(entry.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={levelVariant(entry.level)}>
                          {entry.level}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {entry.service}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {entry.message}
                      </TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">
                        {entry.requestId ?? "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </BaseLayout>
  )
}
