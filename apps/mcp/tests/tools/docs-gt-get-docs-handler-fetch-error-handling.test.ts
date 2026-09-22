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
  describe("fetch error handling", () => {
    it("falls back to GitHub README when fetchDocs throws and githubUrl is set", async () => {
      const entry = makeEntry();
      vi.mocked(lookupById).mockReturnValue(entry);
      vi.mocked(fetchDocs).mockRejectedValue(new Error("fetch failed"));
      vi.mocked(fetchGitHubContent).mockResolvedValue({
        content: DOCS_CONTENT,
        url: "https://raw.githubusercontent.com/facebook/react/main/README.md",
        sourceType: "github-readme",
      });
      const result = await handler({ libraryId: "facebook/react" });
      expect(fetchGitHubContent).toHaveBeenCalledWith("https://github.com/facebook/react");
      expect(result.content[0]!.text).toContain("React");
    });

    it("returns error message when fetchDocs throws and GitHub also fails", async () => {
      const entry = makeEntry();
      vi.mocked(lookupById).mockReturnValue(entry);
      vi.mocked(fetchDocs).mockRejectedValue(new Error("fetch failed"));
      vi.mocked(fetchGitHubContent).mockResolvedValue(null);
      const result = await handler({ libraryId: "facebook/react" });
      expect(result.content[0]!.text).toContain("Could not fetch documentation");
      expect(result.content[0]!.text).toContain("React");
    });

    it("returns error message when fetchDocs throws and no githubUrl", async () => {
      const entry = makeEntry({ githubUrl: undefined });
      vi.mocked(lookupById).mockReturnValue(entry);
      vi.mocked(fetchDocs).mockRejectedValue(new Error("fetch failed"));
      const result = await handler({ libraryId: "facebook/react" });
      expect(result.content[0]!.text).toContain("Could not fetch documentation");
      expect(fetchGitHubContent).not.toHaveBeenCalled();
    });

    it("returns 'no documentation found' when fetchResult is falsy", async () => {
      vi.mocked(lookupById).mockReturnValue(null);
      vi.mocked(lookupByAlias).mockReturnValue(null);
      vi.mocked(fetchDocs).mockResolvedValue(undefined as never);
      const result = await handler({ libraryId: "unknown-lib" });
      expect(result.content[0]!.text).toContain("No documentation found");
    });
  });

});
