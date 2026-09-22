import { describe, expect, it } from "vitest";
import {
  ApiErrorSchema,
  EcosystemSchema,
  HealthResponseSchema,
  KnowledgeStatusSchema,
  LibraryQuerySchema,
  LibrarySlugSchema,
  LibraryVersionSchema,
} from "./index.js";

describe("@getlib/schemas", () => {
  it("accepts valid library slugs", () => {
    expect(LibrarySlugSchema.parse("react")).toBe("react");
    expect(LibrarySlugSchema.parse("@tanstack/react-query")).toBe(
      "@tanstack/react-query",
    );
  });

  it("rejects invalid slugs", () => {
    expect(() => LibrarySlugSchema.parse("")).toThrow();
    expect(() => LibrarySlugSchema.parse("React")).toThrow();
    expect(() => LibrarySlugSchema.parse("a".repeat(129))).toThrow();
  });

  it("accepts exact versions and rejects empty", () => {
    expect(LibraryVersionSchema.parse("19.3.0")).toBe("19.3.0");
    expect(() => LibraryVersionSchema.parse("")).toThrow();
  });

  it("keeps version identity distinct (no flattening)", () => {
    const a = LibraryVersionSchema.parse("19.3.0");
    const b = LibraryVersionSchema.parse("19.3.1");
    expect(a).not.toBe(b);
  });

  it("validates library query with optional ecosystem/version", () => {
    const q = LibraryQuerySchema.parse({ query: "react", ecosystem: "npm" });
    expect(q.query).toBe("react");
    expect(() => LibraryQuerySchema.parse({ query: "" })).toThrow();
    expect(EcosystemSchema.parse("pypi")).toBe("pypi");
  });

  it("exposes explicit failure states", () => {
    for (const s of [
      "ok",
      "stale",
      "unavailable",
      "partial",
      "failed",
      "ambiguous",
      "no-evidence",
    ] as const) {
      expect(KnowledgeStatusSchema.parse(s)).toBe(s);
    }
  });

  it("validates health and error envelopes", () => {
    expect(
      HealthResponseSchema.parse({ status: "ok", version: "0.1.0" }).status,
    ).toBe("ok");
    expect(() =>
      HealthResponseSchema.parse({ status: "fine", version: "x" }),
    ).toThrow();
    expect(
      ApiErrorSchema.parse({ code: "NOT_FOUND", message: "missing" }).code,
    ).toBe("NOT_FOUND");
    expect(() => ApiErrorSchema.parse({ code: "", message: "" })).toThrow();
  });
});
