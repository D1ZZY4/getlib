import { describe, it, expect, vi, beforeEach } from "vitest";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerChangelogTool } from "../../src/tools/changelog.js";

// ── Mocks ────────────────────────────────────────────────────────────────────

vi.mock("../../src/sources/registry.js", () => ({
  lookupById: vi.fn(),
  lookupByAlias: vi.fn(),
}));

vi.mock("../../src/services/fetcher.js", () => ({
  fetchGitHubReleases: vi.fn(),
  fetchGitHubContent: vi.fn(),
  fetchViaJina: vi.fn(),
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

vi.mock("../../src/services/resolve.js", () => ({
  resolveDynamic: vi.fn(async () => null),
}));

// ── Imports after mocks ──────────────────────────────────────────────────────

import { lookupById, lookupByAlias } from "../../src/sources/registry.js";
import { fetchGitHubReleases, fetchGitHubContent, fetchViaJina, fetchAsMarkdownRace } from "../../src/services/fetcher.js";
import { isExtractionAttempt, withNotice } from "../../src/utils/guard.js";
import { docCache } from "../../src/services/cache.js";
import { extractRelevantContent } from "../../src/utils/extract.js";
import { resolveDynamic } from "../../src/services/resolve.js";

// ── Handler capture ──────────────────────────────────────────────────────────

type HandlerInput = { libraryId: string; version?: string; tokens?: number };
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

registerChangelogTool(mockServer);

// ── Helpers ──────────────────────────────────────────────────────────────────

const RELEASES_CONTENT = "## Recent Releases\n\n### v15.2.0\nPublished: 2026-01-15\nBreaking changes.";

const makeEntry = (overrides: Record<string, unknown> = {}) => ({
  id: "vercel/next.js",
  name: "Next.js",
  description: "The React Framework",
  docsUrl: "https://nextjs.org",
  llmsTxtUrl: "https://nextjs.org/llms.txt",
  githubUrl: "https://github.com/vercel/next.js",
  ...overrides,
});

beforeEach(() => {
  vi.mocked(lookupById).mockReset();
  vi.mocked(lookupByAlias).mockReset();
  vi.mocked(fetchGitHubReleases).mockReset();
  vi.mocked(fetchGitHubContent).mockReset();
  vi.mocked(fetchViaJina).mockReset();
  vi.mocked(fetchAsMarkdownRace).mockReset().mockResolvedValue(null);
  vi.mocked(isExtractionAttempt).mockReset().mockReturnValue(false);
  vi.mocked(docCache.get).mockReset().mockReturnValue(undefined);
  vi.mocked(docCache.set).mockReset();
  vi.mocked(resolveDynamic).mockReset().mockResolvedValue(null);
  vi.mocked(extractRelevantContent).mockImplementation((content, _topic, _tokens) => ({
    text: content,
    truncated: false,
  }));
});

// ── Tests ────────────────────────────────────────────────────────────────────

describe("registerChangelogTool", () => {
  it("registers the tool with the correct name", () => {
    expect(mockServer.registerTool).toHaveBeenCalledWith(
      "gt_changelog",
      expect.anything(),
      expect.any(Function),
    );
  });
});
