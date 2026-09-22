import { describe, it, expect, vi, beforeEach } from "vitest";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerDocsTool } from "../../src/tools/docs.js";

// ── Dependency mocks ────────────────────────────────────────────────────────

vi.mock("../../src/sources/registry.js", () => ({
  lookupById: vi.fn(),
  lookupByAlias: vi.fn(),
}));

vi.mock("../../src/services/fetcher.js", () => ({
  fetchDocs: vi.fn(),
  fetchGitHubContent: vi.fn(),
  fetchViaJina: vi.fn(),
  fetchAsMarkdownRace: vi.fn(),
  // Mirror of the real implementation — the index-content gate under test
  // depends on it (relative links count too).
  isIndexContent: (content: string) => {
    const lines = content.split("\n").filter((l) => l.trim().length > 0);
    if (lines.length < 5) return false;
    const linkLines = lines.filter((l) => /^\s*-?\s*\[.+\]\((?:https?:\/\/|\/)[^)]+\)/.test(l));
    return linkLines.length / lines.length > 0.5;
  },
}));

vi.mock("../../src/services/deep-fetch.js", () => ({
  deepFetchForTopic: vi.fn(async (result: unknown) => result),
  splitTopics: vi.fn((topic: string) => [topic]),
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
  isExtractionAttempt: vi.fn(() => false),
  withNotice: vi.fn((text: string) => `NOTICE\n\n${text}`),
  EXTRACTION_REFUSAL: "EXTRACTION_REFUSED",
  assertPublicUrl: vi.fn(),
}));

vi.mock("../../src/utils/quality.js", () => ({
  computeQualityScore: vi.fn(() => ({ score: 0.8, hints: [] })),
}));

vi.mock("../../src/services/resolve.js", () => ({
  probeLlmsTxt: vi.fn(async () => ({})),
}));

// ── Imports after mocks ─────────────────────────────────────────────────────

import { lookupById, lookupByAlias } from "../../src/sources/registry.js";
import { fetchDocs, fetchGitHubContent, fetchViaJina, fetchAsMarkdownRace } from "../../src/services/fetcher.js";
import { deepFetchForTopic } from "../../src/services/deep-fetch.js";
import { sanitizeContent } from "../../src/utils/sanitize.js";
import { extractRelevantContent } from "../../src/utils/extract.js";
import { isExtractionAttempt } from "../../src/utils/guard.js";

// ── Handler capture ─────────────────────────────────────────────────────────

type HandlerInput = { libraryId: string; topic?: string; version?: string; tokens?: number };
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

registerDocsTool(mockServer);

// ── Helpers ─────────────────────────────────────────────────────────────────

const DOCS_CONTENT = "Documentation content here.\n".repeat(20);

const makeEntry = (overrides: Record<string, unknown> = {}) => ({
  id: "facebook/react",
  name: "React",
  description: "A JavaScript library for building user interfaces",
  docsUrl: "https://react.dev",
  llmsTxtUrl: "https://react.dev/llms.txt",
  llmsFullTxtUrl: undefined as string | undefined,
  githubUrl: "https://github.com/facebook/react",
  ...overrides,
});

const makeFetchResult = (content = DOCS_CONTENT, sourceType = "llms-txt" as const, url = "https://react.dev/llms.txt") => ({
  content,
  sourceType,
  url,
});

beforeEach(() => {
  vi.mocked(lookupById).mockReset();
  vi.mocked(lookupByAlias).mockReset();
  vi.mocked(fetchDocs).mockReset();
  vi.mocked(fetchGitHubContent).mockReset();
  vi.mocked(fetchViaJina).mockReset().mockResolvedValue(null);
  vi.mocked(fetchAsMarkdownRace).mockReset().mockResolvedValue(null);
  vi.mocked(isExtractionAttempt).mockReset().mockReturnValue(false);
  vi.mocked(deepFetchForTopic).mockReset().mockImplementation(async (result) => result);
  vi.mocked(sanitizeContent).mockReset().mockImplementation((t: string) => t);
  vi.mocked(extractRelevantContent).mockImplementation((content, _topic, _tokens) => ({
    text: content,
    truncated: false,
  }));
});

// ── Tests ───────────────────────────────────────────────────────────────────

describe("gt_get_docs handler", () => {
  describe("deep-fetch integration", () => {
    it("calls deepFetchForTopic when topic is provided", async () => {
      vi.mocked(lookupById).mockReturnValue(makeEntry());
      vi.mocked(fetchDocs).mockResolvedValue({
        content: "index page content",
        url: "https://example.com/docs",
        sourceType: "llms-txt",
      });
      vi.mocked(deepFetchForTopic).mockResolvedValue({
        content: "deep auth docs content",
        url: "https://example.com/auth",
        sourceType: "deep-fetch",
      });
      vi.mocked(sanitizeContent).mockImplementation((t: string) => t);
      vi.mocked(extractRelevantContent).mockReturnValue({
        // Real coverage (heading + repeats): a single passing mention is now
        // reported as an honest miss, which would mask what this test asserts.
        text: "## Auth\nauth docs content. Configure auth providers. Auth callbacks run server-side.",
        truncated: false,
      });

      const result = await handler({ libraryId: "facebook/react", topic: "auth", tokens: 8000 });
      expect(deepFetchForTopic).toHaveBeenCalled();
      expect(result.content[0]!.text).toContain("auth docs content");
    });

    it("does not call deepFetchForTopic when no topic is provided", async () => {
      vi.mocked(lookupById).mockReturnValue(makeEntry());
      vi.mocked(fetchDocs).mockResolvedValue({
        content: "docs content",
        url: "https://example.com/docs",
        sourceType: "llms-txt",
      });

      await handler({ libraryId: "facebook/react", tokens: 8000 });
      expect(deepFetchForTopic).not.toHaveBeenCalled();
    });
  });

});
