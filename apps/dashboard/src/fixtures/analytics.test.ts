import { describe, expect, it } from "vitest";
import {
  analyticsMetricsFixture,
  knowledgeSourcesFixture,
  recentJobsFixture,
  retrievalSourcesFixture,
  retrievalVolumeFixture,
  searchActivityFixture,
  topLibrariesFixture,
} from "./analytics";

describe("analytics fixtures", () => {
  it("stays consistent with the overview counts", () => {
    const documents = knowledgeSourcesFixture.reduce(
      (sum, source) => sum + source.documents,
      0,
    );
    expect(documents).toBe(340);
    const running = recentJobsFixture.filter(
      (job) => job.status === "running",
    ).length;
    expect(running).toBe(2);
    expect(
      recentJobsFixture.some((job) => job.status === "failed"),
    ).toBe(false);
  });

  it("keeps source shares totaling 100", () => {
    const total = knowledgeSourcesFixture.reduce(
      (sum, source) => sum + source.share,
      0,
    );
    expect(total).toBe(100);
  });

  it("provides activity series and retrieval tables", () => {
    expect(searchActivityFixture.length).toBeGreaterThan(0);
    expect(retrievalVolumeFixture.length).toBeGreaterThan(0);
    expect(retrievalSourcesFixture.length).toBeGreaterThan(0);
    expect(topLibrariesFixture.length).toBeGreaterThan(0);
    expect(analyticsMetricsFixture.length).toBe(4);
    for (const point of searchActivityFixture) {
      expect(point.withResults).toBeLessThanOrEqual(point.searches);
    }
  });
});
