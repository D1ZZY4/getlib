"use client"

import { BaseLayout } from "@/components/layouts/base-layout"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  mcpEndpointFixture,
  mcpInvocationsFixture,
  mcpToolsFixture,
} from "@/fixtures/mcp"

export default function McpPage() {
  const errors = mcpInvocationsFixture.filter(
    (inv) => inv.status === "error",
  ).length
  const avgLatency = Math.round(
    mcpInvocationsFixture.reduce((sum, inv) => sum + inv.latencyMs, 0) /
      mcpInvocationsFixture.length,
  )

  return (
    <BaseLayout
      title="MCP"
      description="Agent interface status, tool catalog, and recent invocations"
    >
      <div className="@container/main px-4 lg:px-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Endpoint</CardTitle>
              <CardDescription>Remote transport status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="default">{mcpEndpointFixture.status}</Badge>
                <span className="text-muted-foreground font-mono text-xs">
                  {mcpEndpointFixture.transport}
                </span>
              </div>
              <p className="font-mono text-xs">{mcpEndpointFixture.url}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Tool Catalog</CardTitle>
              <CardDescription>Public bounded tools</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tabular-nums">
                {mcpToolsFixture.length}
              </p>
              <p className="text-muted-foreground text-sm">
                All outputs bounded with provenance
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Invocations</CardTitle>
              <CardDescription>Recent tool calls</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tabular-nums">
                {mcpInvocationsFixture.length}
              </p>
              <p className="text-muted-foreground text-sm">
                {errors} errors · {avgLatency}ms average latency
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tool Catalog</CardTitle>
            <CardDescription>
              Every tool returns bounded output with provenance.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tool</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mcpToolsFixture.map((tool) => (
                  <TableRow key={tool.name}>
                    <TableCell className="font-mono text-xs font-medium">
                      {tool.name}
                    </TableCell>
                    <TableCell className="text-sm">
                      {tool.description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Invocations</CardTitle>
            <CardDescription>
              Latency and outcome per tool call.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tool</TableHead>
                  <TableHead className="text-right">Latency</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mcpInvocationsFixture.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-mono text-xs font-medium">
                      {inv.tool}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-xs">
                      {inv.latencyMs}ms
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={
                          inv.status === "ok" ? "default" : "destructive"
                        }
                      >
                        {inv.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground text-xs">
                      {inv.time}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </BaseLayout>
  )
}
