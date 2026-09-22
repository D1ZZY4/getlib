import { describe, it, expect, beforeEach } from "vitest";
import {
  startCall,
  endCallSuccess,
  endCallError,
  withTelemetry,
  getInvocationSummary,
  getRecentOutcomes,
  resetTelemetry,
  generateRequestId,
} from "../../src/services/telemetry.js";

describe("telemetry", () => {
  beforeEach(() => {
    resetTelemetry();
  });

  it("generateRequestId returns 8-char hex", () => {
    const id = generateRequestId();
    expect(id).toMatch(/^[0-9a-f]{8}$/);
    const id2 = generateRequestId();
    expect(id).not.toBe(id2);
  });

  it("startCall returns a context with unique requestId", () => {
    const a = startCall("gl_test");
    const b = startCall("gl_test");
    expect(a.tool).toBe("gl_test");
    expect(a.requestId).not.toBe(b.requestId);
    expect(a.cacheHit).toBe(false);
    expect(a.resolved).toBe(false);
  });

  it("endCallSuccess records a successful outcome", () => {
    const ctx = startCall("gl_test");
    ctx.resolved = true;
    const result = endCallSuccess(ctx);
    expect(result.success).toBe(true);
    expect(result.resolved).toBe(true);
    const outcomes = getRecentOutcomes();
    expect(outcomes.length).toBe(1);
    expect(outcomes[0]?.tool).toBe("gl_test");
    expect(outcomes[0]?.success).toBe(true);
  });

  it("endCallError records a failure with the error message", () => {
    const ctx = startCall("gl_test");
    const result = endCallError(ctx, new Error("boom"));
    expect(result.success).toBe(false);
    expect(result.error).toBe("boom");
    const outcomes = getRecentOutcomes();
    expect(outcomes[0]?.error).toBe("boom");
  });

  it("getInvocationSummary computes successRate and per-tool stats", () => {
    const c1 = startCall("gl_a");
    c1.resolved = true;
    endCallSuccess(c1);

    const c2 = startCall("gl_a");
    endCallError(c2, new Error("fail"));

    const c3 = startCall("gl_b");
    c3.resolved = true;
    endCallSuccess(c3);

    const summary = getInvocationSummary();
    expect(summary.totalCalls).toBe(3);
    expect(summary.successRate).toBeCloseTo(2 / 3, 2);
    expect(summary.byTool["gl_a"]?.calls).toBe(2);
    expect(summary.byTool["gl_a"]?.successRate).toBeCloseTo(0.5, 2);
    expect(summary.byTool["gl_b"]?.successRate).toBe(1);
  });

  it("withTelemetry wraps handler and records success", async () => {
    const out = await withTelemetry("gl_wrap", async (ctx) => {
      ctx.resolved = true;
      return "ok";
    });
    expect(out).toBe("ok");
    const outcomes = getRecentOutcomes();
    expect(outcomes.length).toBe(1);
    expect(outcomes[0]?.tool).toBe("gl_wrap");
    expect(outcomes[0]?.success).toBe(true);
    expect(outcomes[0]?.resolved).toBe(true);
  });

  it("withTelemetry records failure on throw and re-throws", async () => {
    await expect(
      withTelemetry("gl_wrap_fail", async () => {
        throw new Error("kaboom");
      }),
    ).rejects.toThrow("kaboom");
    const outcomes = getRecentOutcomes();
    expect(outcomes[0]?.success).toBe(false);
    expect(outcomes[0]?.error).toBe("kaboom");
  });

  it("trims recent outcomes to the cap (200)", () => {
    for (let i = 0; i < 250; i++) {
      const c = startCall("gl_fill");
      c.resolved = true;
      endCallSuccess(c);
    }
    expect(getRecentOutcomes().length).toBe(200);
  });

  it("getInvocationSummary on empty store returns default success", () => {
    const s = getInvocationSummary();
    expect(s.totalCalls).toBe(0);
    expect(s.successRate).toBe(1);
    expect(s.errorRate).toBe(0);
  });
});
