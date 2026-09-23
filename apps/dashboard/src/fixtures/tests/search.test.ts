import { describe, expect, it, vi } from "vitest";
import {
  DEFAULT_SEARCH_FILTERS,
  matchSearchResults,
  searchLibraryFixtures,
} from "../search";

describe("search fixtures", () => {
  it("matches across document, section, snippet, and library", () => {
    expect(
      matchSearchResults("query", DEFAULT_SEARCH_FILTERS).length,
    ).toBeGreaterThan(0);
    expect(
      matchSearchResults("zzz-no-match", DEFAULT_SEARCH_FILTERS),
    ).toHaveLength(0);
  });

  it("applies library, version, source, and limit filters", () => {
    expect(
      matchSearchResults("", { ...DEFAULT_SEARCH_FILTERS, library: "zod" }),
    ).toHaveLength(1);
    expect(
      matchSearchResults("", { ...DEFAULT_SEARCH_FILTERS, source: "github" }),
    ).toHaveLength(2);
    expect(
      matchSearchResults("", { ...DEFAULT_SEARCH_FILTERS, limit: 2 }),
    ).toHaveLength(2);
    expect(
      matchSearchResults("", {
        ...DEFAULT_SEARCH_FILTERS,
        version: "19.3.0",
      }).every((result) => result.version === "19.3.0"),
    ).toBe(true);
  });

  it("rejects immediately on an already-aborted signal", async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(
      searchLibraryFixtures("query", DEFAULT_SEARCH_FILTERS, {
        signal: controller.signal,
      }),
    ).rejects.toMatchObject({ name: "AbortError" });
  });

  it("cancels in-flight searches", async () => {
    vi.useFakeTimers();
    try {
      const controller = new AbortController();
      const pending = searchLibraryFixtures("query", DEFAULT_SEARCH_FILTERS, {
        signal: controller.signal,
      });
      const assertion = expect(pending).rejects.toMatchObject({
        name: "AbortError",
      });
      controller.abort();
      await assertion;
    } finally {
      vi.useRealTimers();
    }
  });
});
