/**
 * @getlib/api - request ID middleware.
 *
 * Echoes an incoming X-Request-ID or generates one, and always sets it
 * on the response. Matches the dashboard api-client contract so traces
 * correlate across the boundary.
 */
import type { MiddlewareHandler } from "hono";

export const REQUEST_ID_HEADER = "X-Request-ID";

export function newRequestId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `req-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
}

export function requestId(): MiddlewareHandler {
  return async (c, next) => {
    const incoming = c.req.header(REQUEST_ID_HEADER)?.trim();
    const requestId =
      incoming && incoming.length > 0 ? incoming : newRequestId();
    c.set("requestId", requestId);
    await next();
    c.header(REQUEST_ID_HEADER, requestId);
  };
}
