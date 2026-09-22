import { describe, it, expect, vi, beforeEach } from "vitest";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerCompareTool } from "../../src/tools/compare.js";

// ── Mocks ────────────────────────────────────────────────────────────────────

vi.mock("../../src/sources/registry.js", () => ({
  lookupById: vi.fn(),
  lookupByAlias: vi.fn(),
  fuzzySearch: vi.fn(() => []),
}));

vi.mock("../../src/services/fetcher.js", () => ({
  fetchDocs: vi.fn(),
  fetchViaJina: vi.fn().mockResolvedValue(null),
  fetchAsMarkdownRace: vi.fn().mockResolvedValue(null),
  isIndexContent: vi.fn().mockReturnValue(false),
  rankIndexLinks: vi.fn().mockReturnValue([]),
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

// ── Imports after mocks ──────────────────────────────────────────────────────

import { lookupById, lookupByAlias, fuzzySearch } from "../../src/sources/registry.js";
import { fetchDocs, fetchViaJina, fetchAsMarkdownRace, isIndexContent, rankIndexLinks } from "../../src/services/fetcher.js";
import { isExtractionAttempt } from "../../src/utils/guard.js";
import { docCache } from "../../src/services/cache.js";
import { extractRelevantContent } from "../../src/utils/extract.js";

// ── Handler capture ──────────────────────────────────────────────────────────

type HandlerInput = { libraries: string[]; criteria?: string; tokens?: number };
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

registerCompareTool(mockServer);

// ── Helpers ──────────────────────────────────────────────────────────────────

const DOCS_CONTENT = "Documentation content for the library.\n".repeat(20);

const makeEntry = (id: string, name: string, overrides: Record<string, unknown> = {}) => ({
  id,
  name,
  aliases: [name.toLowerCase()],
  description: `${name} is a great library`,
  docsUrl: `https://${name.toLowerCase()}.dev/docs`,
  llmsTxtUrl: `https://${name.toLowerCase()}.dev/llms.txt`,
  llmsFullTxtUrl: undefined as string | undefined,
  githubUrl: `https://github.com/org/${name.toLowerCase()}`,
  language: ["typescript"],
  tags: ["library"],
  ...overrides,
});

const makeFetchResult = (content = DOCS_CONTENT) => ({
  content,
  sourceType: "llms-txt" as const,
  url: "https://example.dev/llms.txt",
});

beforeEach(() => {
  vi.mocked(lookupById).mockReset().mockReturnValue(undefined);
  vi.mocked(lookupByAlias).mockReset().mockReturnValue(undefined);
  vi.mocked(fuzzySearch).mockReset().mockReturnValue([]);
  vi.mocked(fetchDocs).mockReset();
  vi.mocked(isExtractionAttempt).mockReset().mockReturnValue(false);
  vi.mocked(docCache.get).mockReset().mockReturnValue(undefined);
  vi.mocked(docCache.set).mockReset();
  vi.mocked(extractRelevantContent).mockReset().mockImplementation((content, _topic, _tokens) => ({
    text: content,
    truncated: false,
  }));
});

// ── Tests ────────────────────────────────────────────────────────────────────

describe("registerCompareTool", () => {
  it("registers the tool with the correct name", () => {
    expect(mockServer.registerTool).toHaveBeenCalledWith(
      "gt_compare",
      expect.anything(),
      expect.any(Function),
    );
  });
});
