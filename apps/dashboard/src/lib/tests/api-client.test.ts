import { HealthResponseSchema } from "@getlib/schemas";
import { describe, expect, it, vi } from "vitest";
import {
  GetLibApiError,
  apiFetch,
  getHealth,
  resolveApiBaseUrl,
} from "../api-client";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("resolveApiBaseUrl", () => {
  it("falls back to the local API default", () => {
    expect(resolveApiBaseUrl(undefined)).toBe("http://localhost:3001/api/v1");
    expect(resolveApiBaseUrl("")).toBe("http://localhost:3001/api/v1");
  });

  it("trims whitespace and trailing slashes", () => {
    expect(resolveApiBaseUrl("https://api.example.com/v1///")).toBe(
      "https://api.example.com/v1",
    );
    expect(resolveApiBaseUrl("  https://api.example.com/v1  ")).toBe(
      "https://api.example.com/v1",
    );
  });
});

describe("apiFetch", () => {
  it("returns contract-validated data and sends a request id", async () => {
    const seen: { url: string; headers: Headers }[] = [];
    const fetchImpl = vi.fn(async (url: string, init: RequestInit) => {
      seen.push({ url, headers: new Headers(init.headers) });
      return jsonResponse({ status: "ok", version: "0.1.0" });
    });

    const data = await apiFetch("/health", HealthResponseSchema, {
      baseUrl: "http://localhost:3001/api/v1",
      fetchImpl: fetchImpl as typeof fetch,
      requestId: "req-test-1",
    });

    expect(data.status).toBe("ok");
    expect(seen).toHaveLength(1);
    expect(seen[0]?.url).toBe("http://localhost:3001/api/v1/health");
    expect(seen[0]?.headers.get("X-Request-ID")).toBe("req-test-1");
    expect(seen[0]?.headers.get("Accept")).toBe("application/json");
  });

  it("maps transport error envelopes to typed errors", async () => {
    const fetchImpl = vi.fn(async () =>
      jsonResponse(
        { code: "NOT_FOUND", message: "no such library", requestId: "srv-1" },
        404,
      ),
    );
    const failure = await apiFetch("/libraries/x", HealthResponseSchema, {
      fetchImpl: fetchImpl as typeof fetch,
    }).catch((error: unknown) => error);

    expect(failure).toBeInstanceOf(GetLibApiError);
    const typed = failure as GetLibApiError;
    expect(typed.code).toBe("NOT_FOUND");
    expect(typed.status).toBe(404);
    expect(typed.requestId).toBe("srv-1");
  });

  it("maps non-envelope failures to HTTP status codes", async () => {
    const fetchImpl = vi.fn(
      async () => new Response("<html>oops</html>", { status: 500 }),
    );
    const failure = await apiFetch("/health", HealthResponseSchema, {
      fetchImpl: fetchImpl as typeof fetch,
      requestId: "req-test-2",
    }).catch((error: unknown) => error);

    expect(failure).toBeInstanceOf(GetLibApiError);
    const typed = failure as GetLibApiError;
    expect(typed.code).toBe("HTTP_500");
    expect(typed.status).toBe(500);
    expect(typed.requestId).toBe("req-test-2");
  });

  it("rejects success responses that violate the contract", async () => {
    const fetchImpl = vi.fn(async () =>
      jsonResponse({ status: "fine", version: 42 }),
    );
    const failure = await apiFetch("/health", HealthResponseSchema, {
      fetchImpl: fetchImpl as typeof fetch,
    }).catch((error: unknown) => error);

    expect(failure).toBeInstanceOf(GetLibApiError);
    expect((failure as GetLibApiError).code).toBe("INVALID_RESPONSE");
  });

  it("maps network failures without inventing an HTTP status", async () => {
    const fetchImpl = vi.fn(async () => {
      throw new TypeError("fetch failed");
    });
    const failure = await apiFetch("/health", HealthResponseSchema, {
      fetchImpl: fetchImpl as typeof fetch,
    }).catch((error: unknown) => error);

    expect(failure).toBeInstanceOf(GetLibApiError);
    const typed = failure as GetLibApiError;
    expect(typed.code).toBe("NETWORK_ERROR");
    expect(typed.status).toBe(0);
  });

  it("rethinks cancellation as cancellation, not failure", async () => {
    const abort = new DOMException("aborted", "AbortError");
    const fetchImpl = vi.fn(async () => {
      throw abort;
    });
    const failure = await apiFetch("/health", HealthResponseSchema, {
      fetchImpl: fetchImpl as typeof fetch,
    }).catch((error: unknown) => error);

    expect(failure).toBe(abort);
    expect(failure).not.toBeInstanceOf(GetLibApiError);
  });
});

describe("getHealth", () => {
  it("targets the versioned health endpoint", async () => {
    const seen: string[] = [];
    const fetchImpl = vi.fn(async (url: string) => {
      seen.push(url);
      return jsonResponse({ status: "degraded", version: "0.2.0" });
    });
    const health = await getHealth({
      baseUrl: "http://localhost:3001/api/v1",
      fetchImpl: fetchImpl as typeof fetch,
    });
    expect(seen).toEqual(["http://localhost:3001/api/v1/health"]);
    expect(health.status).toBe("degraded");
  });
});
