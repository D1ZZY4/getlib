/**
 * @getlib/api - application factory.
 *
 * Transport boundary only: routing, request IDs, contract validation
 * errors, and the error envelope. Domain services arrive with their
 * owning slices and stay out of this module.
 */

import { HealthResponseSchema } from "@getlib/schemas";
import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { toApiError, unknownErrorMessage } from "./errors.js";
import { REQUEST_ID_HEADER, requestId } from "./request-id.js";
import { healthRoute, versionRoute } from "./routes/health.js";

export const API_VERSION = "v1";
export const PACKAGE_VERSION = "0.1.0";

export interface AppEnv {
  Variables: {
    requestId: string;
  };
}

export function createApp(): OpenAPIHono<AppEnv> {
  const app = new OpenAPIHono<AppEnv>();

  app.use(requestId());

  app.openapi(healthRoute, (c) => {
    return c.json(
      HealthResponseSchema.parse({
        status: "ok",
        version: PACKAGE_VERSION,
        uptimeSeconds: Math.floor(process.uptime()),
      }),
      200,
    );
  });

  app.openapi(versionRoute, (c) => {
    return c.json({ version: PACKAGE_VERSION, api: API_VERSION }, 200);
  });

  app.doc31("/openapi.json", {
    openapi: "3.1.0",
    info: {
      title: "GetLib API",
      version: PACKAGE_VERSION,
      description:
        "Programmatic boundary of the GetLib knowledge platform. Contracts validate at runtime.",
    },
  });

  app.get("/docs", Scalar({ url: "/openapi.json" }));

  app.notFound((c) => {
    const requestId = c.get("requestId") as string | undefined;
    return c.json(toApiError("NOT_FOUND", "Unknown API route", requestId), 404);
  });

  app.onError((err, c) => {
    const requestId =
      (c.get("requestId") as string | undefined) ??
      c.req.header(REQUEST_ID_HEADER);
    // Never leak internals: safe message only, request ID for correlation.
    return c.json(
      toApiError("INTERNAL_ERROR", unknownErrorMessage(err), requestId),
      500,
    );
  });

  return app;
}
