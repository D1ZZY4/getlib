import { describe, it, expect } from "vitest";
import { buildServerInstructions, INSTRUCTIONS_BYTE_BUDGET } from "../../src/services/server-instructions.js";

describe("buildServerInstructions", () => {
  // Claude Code truncates server instructions around 2 KB. At 5.3 KB the whole
  // routing table fell off the end and never reached the model.
  it("fits inside the client instruction budget", () => {
    const bytes = Buffer.byteLength(buildServerInstructions(14), "utf8");
    expect(bytes, `server.instructions is ${bytes}B`).toBeLessThanOrEqual(INSTRUCTIONS_BYTE_BUDGET);
  });

  it("keeps every tool name inside the budgeted window", () => {
    const result = buildServerInstructions(14).slice(0, INSTRUCTIONS_BYTE_BUDGET);
    for (const tool of [
      "gl_dispatch", "gl_resolve_library", "gl_get_docs", "gl_best_practices",
      "gl_auto_scan", "gl_search", "gl_audit", "gl_changelog", "gl_compat",
      "gl_compare", "gl_examples", "gl_migration", "gl_batch_resolve", "gl_snippets",
    ]) {
      expect(result, `${tool} truncated away`).toContain(tool);
    }
  });

  it("includes '# Tools (14)' heading when called with 14", () => {
    const result = buildServerInstructions(14);
    expect(result).toContain("# Tools (14)");
  });

  it("does not contain the unexpanded literal ${TOOL_COUNT}", () => {
    const result = buildServerInstructions(14);
    expect(result).not.toContain("${TOOL_COUNT}");
  });

  it("includes gl_dispatch", () => {
    expect(buildServerInstructions(14)).toContain("gl_dispatch");
  });

  it("includes gl_resolve_library", () => {
    expect(buildServerInstructions(14)).toContain("gl_resolve_library");
  });

  it("includes gl_get_docs", () => {
    expect(buildServerInstructions(14)).toContain("gl_get_docs");
  });

  it("includes gl_best_practices", () => {
    expect(buildServerInstructions(14)).toContain("gl_best_practices");
  });

  it("includes gl_auto_scan", () => {
    expect(buildServerInstructions(14)).toContain("gl_auto_scan");
  });

  it("includes gl_search", () => {
    expect(buildServerInstructions(14)).toContain("gl_search");
  });

  it("includes gl_audit", () => {
    expect(buildServerInstructions(14)).toContain("gl_audit");
  });

  it("includes gl_changelog", () => {
    expect(buildServerInstructions(14)).toContain("gl_changelog");
  });

  it("includes gl_compat", () => {
    expect(buildServerInstructions(14)).toContain("gl_compat");
  });

  it("includes gl_compare", () => {
    expect(buildServerInstructions(14)).toContain("gl_compare");
  });

  it("includes gl_examples", () => {
    expect(buildServerInstructions(14)).toContain("gl_examples");
  });

  it("includes gl_migration", () => {
    expect(buildServerInstructions(14)).toContain("gl_migration");
  });

  it("includes gl_batch_resolve", () => {
    expect(buildServerInstructions(14)).toContain("gl_batch_resolve");
  });

  it("includes gl_snippets", () => {
    expect(buildServerInstructions(14)).toContain("gl_snippets");
  });

  it("interpolates a different toolCount correctly", () => {
    const result = buildServerInstructions(7);
    expect(result).toContain("# Tools (7)");
    expect(result).not.toContain("# Tools (14)");
  });
});
