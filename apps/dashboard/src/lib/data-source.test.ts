import { describe, expect, it } from "vitest";
import { getDataSource } from "./data-source";

describe("getDataSource", () => {
  it("defaults to fixtures when unconfigured", () => {
    expect(getDataSource({})).toBe("fixture");
  });

  it("selects the live API only on explicit opt-in", () => {
    expect(getDataSource({ VITE_DATA_SOURCE: "api" })).toBe("api");
  });

  it("ignores casing variants and empty values", () => {
    expect(getDataSource({ VITE_DATA_SOURCE: "API" })).toBe("fixture");
    expect(getDataSource({ VITE_DATA_SOURCE: "" })).toBe("fixture");
    expect(getDataSource({ VITE_DATA_SOURCE: "true" })).toBe("fixture");
  });
});
