import { describe, expect, it } from "vitest";
import { logEntriesFixture } from "./logs";

describe("log fixtures", () => {
  it("covers every level and service", () => {
    const levels = new Set(logEntriesFixture.map((entry) => entry.level));
    expect(levels).toEqual(new Set(["debug", "info", "warn", "error"]));
    const services = new Set(logEntriesFixture.map((entry) => entry.service));
    expect(services.has("api")).toBe(true);
    expect(services.has("worker")).toBe(true);
  });

  it("orders newest first", () => {
    const timestamps = logEntriesFixture.map((entry) => entry.timestamp);
    const sorted = [...timestamps].sort().reverse();
    expect(timestamps).toEqual(sorted);
  });
});
