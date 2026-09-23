import { describe, expect, it } from "vitest";
import { libraryCorpusFixture, libraryVersionsFixture, trustForLibrary } from "./libraries";

describe("library fixtures", () => {
  it("marks exactly one default version", () => {
    const defaults = libraryVersionsFixture.filter((row) => row.isDefault);
    expect(defaults).toHaveLength(1);
    expect(libraryVersionsFixture.length).toBeGreaterThan(1);
  });

  it("keeps the corpus consistent with the overview counts", () => {
    expect(libraryCorpusFixture).toHaveLength(12);
    const documents = libraryCorpusFixture.reduce(
      (sum, entry) => sum + entry.documents,
      0,
    );
    expect(documents).toBe(340);
  });

  it("grades trust from indexing state", () => {
    expect(trustForLibrary({ indexing: "indexed" })).toBe("high");
    expect(trustForLibrary({ indexing: "failed" })).toBe("low");
    expect(trustForLibrary({ indexing: "stale" })).toBe("medium");
    expect(trustForLibrary({ indexing: "indexing" })).toBe("medium");
  });
});
