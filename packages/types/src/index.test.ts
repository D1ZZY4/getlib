import { describe, expect, it } from "vitest";
import { err, isOk, KNOWLEDGE_STATUSES, ok } from "./index.js";

describe("@getlib/types", () => {
  it("ok() creates a success result", () => {
    const r = ok(42);
    expect(isOk(r)).toBe(true);
    if (isOk(r)) expect(r.value).toBe(42);
  });

  it("err() creates a failure result", () => {
    const r = err({ code: "NOT_FOUND", message: "missing" });
    expect(isOk(r)).toBe(false);
    if (!isOk(r)) expect(r.error.code).toBe("NOT_FOUND");
  });

  it("exposes failure-transparency statuses", () => {
    expect(KNOWLEDGE_STATUSES).toContain("stale");
    expect(KNOWLEDGE_STATUSES).toContain("no-evidence");
  });
});
