import {
  HealthResponseSchema,
  OverviewSummarySchema,
} from "@getlib/schemas";
import { describe, expect, it } from "vitest";
import { healthFixture, overviewFixture } from "./overview";

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
});
