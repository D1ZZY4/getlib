import { describe, expect, it } from "vitest";
import { getInitials } from "../initials";

describe("getInitials", () => {
  it("takes first letters of two words", () => {
    expect(getInitials("GetLib Admin")).toBe("GA");
    expect(getInitials("react query")).toBe("RQ");
  });

  it("strips scope and splits on slash and hyphen", () => {
    expect(getInitials("@tanstack/react-query")).toBe("TR");
    expect(getInitials("GET /api/v1")).toBe("GA");
  });

  it("falls back to first two characters", () => {
    expect(getInitials("react")).toBe("RE");
    expect(getInitials("A")).toBe("A");
    expect(getInitials("")).toBe("");
    expect(getInitials("   ")).toBe("");
  });
});
