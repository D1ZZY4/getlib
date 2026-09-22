import { describe, it, expect, vi, beforeEach } from "vitest";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerCompatTool } from "../../src/tools/compat.js";

// ── Mocks ────────────────────────────────────────────────────────────────────

vi.mock("../../src/services/fetcher.js", () => ({
  fetchAsMarkdownRace: vi.fn(),
}));

vi.mock("../../src/utils/extract.js", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../src/utils/extract.js")>()),
  extractRelevantContent: vi.fn((content: string, _topic: string, _tokens: number) => ({
    text: content,
    truncated: false,
  })),
}));

vi.mock("../../src/utils/sanitize.js", () => ({
  sanitizeContent: vi.fn((content: string) => content),
}));

vi.mock("../../src/utils/guard.js", () => ({
  withToolTimeout: async <T,>(fn: () => Promise<T>) => fn(),
  isExtractionAttempt: vi.fn(() => false),
  withNotice: vi.fn((text: string) => `NOTICE\n\n${text}`),
  EXTRACTION_REFUSAL: "EXTRACTION_REFUSED",
}));

vi.mock("../../src/services/cache.js", () => ({
  docCache: { get: vi.fn(() => undefined), set: vi.fn() },
}));

vi.mock("../../src/services/search/topic-match.js", () => ({
  findTopicUrls: vi.fn(() => []),
}));

vi.mock("../../src/services/search/engines.js", () => ({
  searchMDN: vi.fn(async () => []),
}));

// ── Imports after mocks ──────────────────────────────────────────────────────

import { fetchAsMarkdownRace } from "../../src/services/fetcher.js";
import { isExtractionAttempt } from "../../src/utils/guard.js";
import { docCache } from "../../src/services/cache.js";
import { findTopicUrls } from "../../src/services/search/topic-match.js";
import { extractRelevantContent } from "../../src/utils/extract.js";

// ── Handler capture ──────────────────────────────────────────────────────────

type HandlerInput = { feature: string; environments?: string[]; tokens?: number };
type HandlerResult = {
  content: Array<{ type: string; text: string }>;
  structuredContent?: Record<string, unknown>;
};
type Handler = (input: HandlerInput) => Promise<HandlerResult>;

let handler!: Handler;

const mockServer = {
  registerTool: vi.fn((_name: string, _config: unknown, h: Handler) => {
    handler = h;
  }),
} as unknown as McpServer;

registerCompatTool(mockServer);

// ── Helpers ──────────────────────────────────────────────────────────────────

const MDN_CONTENT = "# CSS Container Queries\n\nBrowser compatibility table: Chrome 105+, Firefox 110+, Safari 16+.".repeat(5);

beforeEach(() => {
  vi.mocked(fetchAsMarkdownRace).mockReset();
  vi.mocked(isExtractionAttempt).mockReset().mockReturnValue(false);
  vi.mocked(docCache.get).mockReset().mockReturnValue(undefined);
  vi.mocked(docCache.set).mockReset();
  vi.mocked(findTopicUrls).mockReset().mockReturnValue([]);
  vi.mocked(extractRelevantContent).mockImplementation((content, _topic, _tokens) => ({
    text: content,
    truncated: false,
  }));
});

// ── Tests ────────────────────────────────────────────────────────────────────

describe("registerCompatTool", () => {
  it("registers the tool with the correct name", () => {
    expect(mockServer.registerTool).toHaveBeenCalledWith(
      "gt_compat",
      expect.anything(),
      expect.any(Function),
    );
  });
});
