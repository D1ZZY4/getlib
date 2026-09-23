import { describe, expect, it } from "vitest";
import { mcpInvocationsFixture, mcpToolsFixture } from "./mcp";

describe("mcp fixtures", () => {
  it("lists the full public tool catalog", () => {
    expect(mcpToolsFixture).toHaveLength(14);
    expect(mcpToolsFixture.every((tool) => tool.bounded)).toBe(true);
  });

  it("records invocation outcomes", () => {
    expect(mcpInvocationsFixture.length).toBeGreaterThan(0);
    expect(
      mcpInvocationsFixture.some((inv) => inv.status === "error"),
    ).toBe(true);
  });
});
