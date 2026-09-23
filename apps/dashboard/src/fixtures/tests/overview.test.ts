import { HealthResponseSchema, OverviewSummarySchema } from "@getlib/schemas";
import { describe, expect, it } from "vitest";
import {
  healthFixture,
  indexingActivityFixture,
  overviewFixture,
  recentlyIndexedFixture,
} from "../overview";

describe("overview fixtures", () => {
  it("health fixture conforms to the shared contract", () => {
    expect(HealthResponseSchema.parse(healthFixture)).toEqual(healthFixture);
  });

  it("overview fixture conforms to the shared contract", () => {
    const parsed = OverviewSummarySchema.parse(overviewFixture);
    expect(parsed).toEqual(overviewFixture);
    expect(parsed.libraryCount).toBeGreaterThanOrEqual(0);
    expect(Number.isNaN(Date.parse(parsed.generatedAt))).toBe(false);
  });

  it("health fixture carries uptime", () => {
    expect(healthFixture.uptimeSeconds).toBeGreaterThan(0);
  });

  it("recently indexed lists five documents", () => {
    expect(recentlyIndexedFixture).toHaveLength(5);
    for (const doc of recentlyIndexedFixture) {
      expect(doc.title.length).toBeGreaterThan(0);
      expect(doc.indexedAt.length).toBeGreaterThan(0);
    }
  });

  it("indexing activity covers 90 ascending days", () => {
    expect(indexingActivityFixture).toHaveLength(90);
    const dates = indexingActivityFixture.map((point) => point.date);
    const sorted = [...dates].sort();
    expect(dates).toEqual(sorted);
    expect(dates[dates.length - 1]).toBe("2026-09-23");
    for (const point of indexingActivityFixture) {
      expect(point.documents).toBeGreaterThanOrEqual(0);
      expect(point.chunks).toBeGreaterThanOrEqual(point.documents);
    }
  });
});
