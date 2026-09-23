import { describe, expect, it } from "vitest";
import { formatUptime } from "./format";

describe("formatUptime", () => {
  it("formats days, hours, minutes, and seconds", () => {
    expect(formatUptime(93784)).toBe("1d 2h");
    expect(formatUptime(7540)).toBe("2h 5m");
    expect(formatUptime(300)).toBe("5m");
    expect(formatUptime(42)).toBe("42s");
    expect(formatUptime(0)).toBe("0s");
  });

  it("guards invalid input", () => {
    expect(formatUptime(-5)).toBe("0s");
    expect(formatUptime(Number.NaN)).toBe("0s");
  });
});
