import { describe, expect, it } from "vitest";
import { toneClassName } from "../badge-tone";

describe("toneClassName", () => {
  it("returns a distinct tone class per variant", () => {
    const tones = [
      toneClassName("success"),
      toneClassName("info"),
      toneClassName("warning"),
      toneClassName("danger"),
      toneClassName("muted"),
      toneClassName("violet"),
      toneClassName("yellow"),
    ];
    expect(new Set(tones).size).toBe(tones.length);
    for (const tone of tones) {
      expect(tone).toContain("text-");
    }
  });
});
