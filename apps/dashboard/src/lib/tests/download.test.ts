import { describe, expect, it } from "vitest";
import { toCsv } from "../download";

describe("toCsv", () => {
  it("joins headers and rows with commas", () => {
    expect(toCsv(["a", "b"], [[1, 2]])).toBe("a,b\n1,2");
  });

  it("escapes quotes, commas, and newlines", () => {
    expect(toCsv(["name"], [['say "hi", ok']])).toBe('name\n"say ""hi"", ok"');
    expect(toCsv(["a"], [["x\ny"]])).toBe('a\n"x\ny"');
  });
});
