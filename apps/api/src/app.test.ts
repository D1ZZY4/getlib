import { ApiErrorSchema, HealthResponseSchema } from "@getlib/schemas";
import { describe, expect, it } from "vitest";
import { createApp } from "./app.js";
import { REQUEST_ID_HEADER } from "./request-id.js";

describe("@getlib/api transport", () => {
  it("serves health validated against the shared contract", async () => {
    const response = await createApp().request("/api/v1/health");
    expect(response.status).toBe(200);
    const body = HealthResponseSchema.parse(await response.json());
    expect(body.status).toBe("ok");
    expect(body.version).toBe("0.1.0");
  });

  it("serves version identity", async () => {
    const response = await createApp().request("/api/v1/version");
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ version: "0.1.0", api: "v1" });
  });

  it("maps unknown routes to the error envelope", async () => {
    const response = await createApp().request("/api/v1/nope", {
      headers: { [REQUEST_ID_HEADER]: "req-test-404" },
    });
    expect(response.status).toBe(404);
    const body = ApiErrorSchema.parse(await response.json());
    expect(body.code).toBe("NOT_FOUND");
    expect(body.requestId).toBe("req-test-404");
  });

  it("echoes request IDs and generates them when absent", async () => {
    const app = createApp();
    const echoed = await app.request("/api/v1/health", {
      headers: { [REQUEST_ID_HEADER]: "req-echo-1" },
    });
    expect(echoed.headers.get(REQUEST_ID_HEADER)).toBe("req-echo-1");
    const generated = await app.request("/api/v1/health");
    const generatedId = generated.headers.get(REQUEST_ID_HEADER) ?? "";
    expect(generatedId.length).toBeGreaterThan(0);
  });

  it("serves the OpenAPI document and interactive reference", async () => {
    const app = createApp();
    const document = await app.request("/openapi.json");
    expect(document.status).toBe(200);
    const body = (await document.json()) as {
      openapi: string;
      paths: Record<string, unknown>;
    };
    expect(body.openapi.startsWith("3.1.")).toBe(true);
    expect(Object.keys(body.paths)).toContain("/api/v1/health");
    const docs = await app.request("/docs");
    expect(docs.status).toBe(200);
    expect(docs.headers.get("content-type")).toContain("text/html");
  });
});
