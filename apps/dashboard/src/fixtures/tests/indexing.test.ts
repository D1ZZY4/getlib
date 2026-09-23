import { describe, expect, it } from "vitest";
import { indexJobsFixture } from "../indexing";

describe("indexing fixtures", () => {
  it("covers every job state", () => {
    const states = new Set(indexJobsFixture.map((job) => job.state));
    expect(states).toEqual(
      new Set(["queued", "running", "retrying", "completed", "failed", "canceled"]),
    );
  });

  it("keeps failed jobs honest about retries and errors", () => {
    for (const job of indexJobsFixture.filter((j) => j.state === "failed")) {
      expect(job.retries).toBeGreaterThan(0);
      expect(job.error?.length ?? 0).toBeGreaterThan(0);
    }
  });
});
