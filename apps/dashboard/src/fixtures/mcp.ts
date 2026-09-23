/**
 * Fixture-grade MCP surface data for the dashboard MCP page.
 * Real tool registration and invocation logs arrive with Phase 7.
 */
import { z } from "zod";

const McpToolSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  bounded: z.boolean(),
});

export type McpTool = z.infer<typeof McpToolSchema>;

const McpInvocationSchema = z.object({
  id: z.string().min(1),
  tool: z.string().min(1),
  latencyMs: z.number().int().nonnegative(),
  status: z.enum(["ok", "error"]),
  time: z.string().min(1),
});

export type McpInvocation = z.infer<typeof McpInvocationSchema>;

export const mcpEndpointFixture = {
  url: "https://getlib.local/mcp",
  transport: "Streamable HTTP",
  version: "v1",
  status: "operational",
} as const;

export const mcpToolsFixture: McpTool[] = z.array(McpToolSchema).parse([
  { name: "gl_search", description: "Version-aware knowledge retrieval", bounded: true },
  { name: "gl_docs", description: "Documentation lookup with provenance", bounded: true },
  { name: "gl_changelog", description: "Version changelog inspection", bounded: true },
  { name: "gl_compat", description: "Compatibility analysis across versions", bounded: true },
  { name: "gl_audit", description: "Project dependency audit", bounded: true },
  { name: "gl_compare", description: "Side-by-side library comparison", bounded: true },
  { name: "gl_migration", description: "Migration guidance between versions", bounded: true },
  { name: "gl_resolve", description: "Canonical library identity resolution", bounded: true },
  { name: "gl_best_practices", description: "Best-practice lookup per topic", bounded: true },
  { name: "gl_auto_scan", description: "Automatic project dependency scan", bounded: true },
  { name: "gl_dispatch", description: "Bounded dispatch to registered handlers", bounded: true },
  { name: "gl_fetch", description: "Safe source fetching with SSRF guards", bounded: true },
  { name: "gl_health", description: "Knowledge engine health and readiness", bounded: true },
  { name: "gl_tools", description: "Tool catalog discovery", bounded: true },
]);

export const mcpInvocationsFixture: McpInvocation[] = z
  .array(McpInvocationSchema)
  .parse([
    { id: "inv-901", tool: "gl_search", latencyMs: 88, status: "ok", time: "2 minutes ago" },
    { id: "inv-900", tool: "gl_docs", latencyMs: 124, status: "ok", time: "9 minutes ago" },
    { id: "inv-899", tool: "gl_compat", latencyMs: 2310, status: "error", time: "17 minutes ago" },
    { id: "inv-898", tool: "gl_changelog", latencyMs: 96, status: "ok", time: "26 minutes ago" },
    { id: "inv-897", tool: "gl_audit", latencyMs: 1840, status: "ok", time: "41 minutes ago" },
  ]);
