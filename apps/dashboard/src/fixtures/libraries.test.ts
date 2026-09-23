import { describe, expect, it } from "vitest";
import { libraryVersionsFixture } from "./libraries";

describe("library fixtures", () => {
  it("marks exactly one default version", () => {
    const defaults = libraryVersionsFixture.filter((row) => row.isDefault);
    expect(defaults).toHaveLength(1);
    expect(libraryVersionsFixture.length).toBeGreaterThan(1);
  });
});
