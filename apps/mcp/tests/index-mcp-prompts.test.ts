import { describe, it, expect, vi } from "vitest";

// ── Dependency mocks ────────────────────────────────────────────────────────

// Prevent actual stdio connection
vi.mock("@modelcontextprotocol/sdk/server/stdio.js", () => ({
  StdioServerTransport: vi.fn().mockImplementation(() => ({})),
}));

vi.mock("@modelcontextprotocol/sdk/server/mcp.js", () => ({
  // Use a regular function (not arrow) so new McpServer() works as a constructor
  McpServer: vi.fn().mockImplementation(function McpServerMock(
    this: { _name: string; _version: string; registerTool: unknown; registerResource: unknown; prompt: unknown; connect: unknown; server: unknown },
    meta: { name: string; version: string },
  ) {
    this._name = meta.name;
    this._version = meta.version;
    this.registerTool = vi.fn();
    this.registerResource = vi.fn();
    this.prompt = vi.fn();
    this.connect = vi.fn().mockResolvedValue(undefined);
    this.server = { sendLoggingMessage: vi.fn().mockResolvedValue(undefined) };
  }),
  ResourceTemplate: class { constructor() { /* mock */ } },
}));

vi.mock("../src/tools/resolve.js", () => ({
  registerResolveTool: vi.fn(),
}));
vi.mock("../src/tools/docs.js", () => ({
  registerDocsTool: vi.fn(),
}));
vi.mock("../src/tools/best-practices.js", () => ({
  registerBestPracticesTool: vi.fn(),
}));
vi.mock("../src/tools/auto-scan.js", () => ({
  registerAutoScanTool: vi.fn(),
}));
vi.mock("../src/tools/search.js", () => ({
  registerSearchTool: vi.fn(),
}));
vi.mock("../src/tools/audit.js", () => ({
  registerAuditTool: vi.fn(),
}));
vi.mock("../src/tools/changelog.js", () => ({
  registerChangelogTool: vi.fn(),
}));
vi.mock("../src/tools/compat.js", () => ({
  registerCompatTool: vi.fn(),
}));
vi.mock("../src/tools/compare.js", () => ({
  registerCompareTool: vi.fn(),
}));
vi.mock("../src/tools/examples.js", () => ({
  registerExamplesTool: vi.fn(),
}));
vi.mock("../src/tools/migration.js", () => ({
  registerMigrationTool: vi.fn(),
}));
vi.mock("../src/tools/batch-resolve.js", () => ({
  registerBatchResolveTool: vi.fn(),
}));

vi.mock("../src/sources/registry.js", () => ({
  LIBRARY_REGISTRY: [{ id: "test/lib", name: "TestLib", docsUrl: "https://example.com" }],
}));

vi.mock("../src/services/fetcher.js", () => ({
  fetchDocs: vi.fn().mockResolvedValue({ content: "docs", url: "https://example.com", sourceType: "direct" }),
}));

vi.mock("../src/utils/extract.js", () => ({
  extractRelevantContent: vi.fn((content: string) => ({ text: content, truncated: false })),
}));

vi.mock("../src/utils/sanitize.js", () => ({
  sanitizeContent: vi.fn((content: string) => content),
}));

vi.mock("../src/utils/guard.js", () => ({
  withNotice: vi.fn((text: string) => text),
}));

// ── process.exit guard ──────────────────────────────────────────────────────

// main() runs when index.ts is imported. If server.connect() rejects, the
// .catch() handler calls process.exit(1). Vitest intercepts that call and
// surfaces it as an "Unhandled Error". vi.hoisted() runs BEFORE any imports,
// so the spy is in place before index.ts's module-level code executes.
vi.hoisted(() => {
  vi.spyOn(process, "exit").mockImplementation((() => undefined) as () => never);
});

// ── Imports after mocks ─────────────────────────────────────────────────────

// Import index to trigger bootstrap (all deps are mocked above)
import "../src/index.js";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerResolveTool } from "../src/tools/resolve.js";
import { registerDocsTool } from "../src/tools/docs.js";
import { registerBestPracticesTool } from "../src/tools/best-practices.js";
import { registerAutoScanTool } from "../src/tools/auto-scan.js";
import { registerSearchTool } from "../src/tools/search.js";
import { registerAuditTool } from "../src/tools/audit.js";
import { registerChangelogTool } from "../src/tools/changelog.js";
import { registerCompatTool } from "../src/tools/compat.js";
import { registerCompareTool } from "../src/tools/compare.js";
import { registerExamplesTool } from "../src/tools/examples.js";
import { SERVER_NAME, SERVER_VERSION } from "../src/constants.js";

// ── Tests ───────────────────────────────────────────────────────────────────

describe("index.ts bootstrap", () => {
  describe("MCP prompts", () => {
    it("registers 8 prompts total", () => {
      const serverInstance = vi.mocked(McpServer).mock.results[0]!.value as { prompt: ReturnType<typeof vi.fn> };
      expect(serverInstance.prompt).toHaveBeenCalledTimes(8);
    });

    it("registers audit-my-project prompt", () => {
      const serverInstance = vi.mocked(McpServer).mock.results[0]!.value as { prompt: ReturnType<typeof vi.fn> };
      const names = serverInstance.prompt.mock.calls.map((c: unknown[]) => c[0]);
      expect(names).toContain("audit-my-project");
    });

    it("registers upgrade-check prompt", () => {
      const serverInstance = vi.mocked(McpServer).mock.results[0]!.value as { prompt: ReturnType<typeof vi.fn> };
      const names = serverInstance.prompt.mock.calls.map((c: unknown[]) => c[0]);
      expect(names).toContain("upgrade-check");
    });

    it("registers best-practices-scan prompt", () => {
      const serverInstance = vi.mocked(McpServer).mock.results[0]!.value as { prompt: ReturnType<typeof vi.fn> };
      const names = serverInstance.prompt.mock.calls.map((c: unknown[]) => c[0]);
      expect(names).toContain("best-practices-scan");
    });

    it("registers compare-libraries prompt", () => {
      const serverInstance = vi.mocked(McpServer).mock.results[0]!.value as { prompt: ReturnType<typeof vi.fn> };
      const names = serverInstance.prompt.mock.calls.map((c: unknown[]) => c[0]);
      expect(names).toContain("compare-libraries");
    });

    it("registers security-check prompt", () => {
      const serverInstance = vi.mocked(McpServer).mock.results[0]!.value as { prompt: ReturnType<typeof vi.fn> };
      const names = serverInstance.prompt.mock.calls.map((c: unknown[]) => c[0]);
      expect(names).toContain("security-check");
    });
  });

  describe("StdioServerTransport", () => {
    it("creates a StdioServerTransport instance", () => {
      expect(StdioServerTransport).toHaveBeenCalled();
    });
  });

  describe("constants", () => {
    it("SERVER_VERSION matches package.json version pattern", () => {
      expect(SERVER_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it("SERVER_NAME is a non-empty string", () => {
      expect(typeof SERVER_NAME).toBe("string");
      expect(SERVER_NAME.length).toBeGreaterThan(0);
    });
  });

  describe("unhandledRejection handler", () => {
    it("calls process.exit(1) when an unhandled rejection fires", () => {
      // index.js registers process.on("unhandledRejection", ...) at module scope on the real
      // process object. NOTE: the vi.hoisted() process.exit spy at the top of this file only
      // covers the module's synchronous bootstrap — this project's global `restoreMocks: true`
      // (vitest.config.mts) restores process.exit to the native implementation before any it()
      // runs (confirmed via vi.isMockFunction(process.exit) === false at the very first test in
      // this file). Re-spy here, using the exact same pattern as the vi.hoisted() spy above, so
      // invoking the real registered handler cannot terminate the test runner.
      const exitSpy = vi.spyOn(process, "exit").mockImplementation((() => undefined) as () => never);

      const handlers = process.listeners("unhandledRejection");
      const registered = handlers[handlers.length - 1] as ((reason: unknown) => void) | undefined;
      expect(registered).toBeDefined();

      registered!(new Error("boom"));

      expect(exitSpy).toHaveBeenCalledWith(1);
    });
  });
});
