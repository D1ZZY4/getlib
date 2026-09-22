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

describe("evidence gate (never-generic guarantee)", () => {
  it("returns an honest miss when the topic is only name-dropped once", async () => {
    vi.mocked(lookupById).mockReturnValue(makeEntry());
    const nameDrop = "The library also supports caching somewhere. ".concat("Unrelated prose. ".repeat(20));
    vi.mocked(fetchDocs).mockResolvedValue(makeFetchResult(nameDrop));
    vi.mocked(deepFetchForTopic).mockImplementation(async (result) => result);
    const result = await handler({ libraryId: "facebook/react", topic: "caching" });
    expect(result.content[0]!.text).toContain("no topic-specific evidence found");
    const sc = result.structuredContent!;
    // The single mention is preserved for clients, just not presented as an answer.
    expect(sc.weakContent).toBeDefined();
  });

  it("does not gate untargeted requests (no topic)", async () => {
    vi.mocked(lookupById).mockReturnValue(makeEntry());
    vi.mocked(fetchDocs).mockResolvedValue(makeFetchResult());
    const result = await handler({ libraryId: "facebook/react" });
    expect(result.content[0]!.text).not.toContain("no topic-specific evidence found");
    const sc = result.structuredContent!;
    expect((sc.evidence as { verdict: string }).verdict).toBe("untargeted");
  });
});
