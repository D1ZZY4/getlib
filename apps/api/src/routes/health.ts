/**
 * @getlib/api - v1 health and version routes.
 *
 * Contract-first: response shapes come from @getlib/schemas, and the
 * same definitions generate the OpenAPI document. No business logic
 * here; health reflects process liveness only.
 */

import { ApiErrorSchema, HealthResponseSchema } from "@getlib/schemas";
import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";

const VersionResponseSchema = z.object({
  version: z.string().min(1),
  api: z.string().min(1),
});

export const healthRoute = createRoute({
  method: "get",
  path: "/api/v1/health",
  tags: ["system"],
  summary: "Liveness probe",
  description:
    "Returns ok while the process serves traffic. Load balancers and CI smoke tests use this endpoint.",
  responses: {
    200: {
      description: "Service is alive",
      content: {
        "application/json": { schema: HealthResponseSchema },
      },
    },
    500: {
      description: "Transport error envelope",
      content: {
        "application/json": { schema: ApiErrorSchema },
      },
    },
  },
});

export const versionRoute = createRoute({
  method: "get",
  path: "/api/v1/version",
  tags: ["system"],
  summary: "Build and API version",
  responses: {
    200: {
      description: "Version identity",
      content: {
        "application/json": { schema: VersionResponseSchema },
      },
    },
    500: {
      description: "Transport error envelope",
      content: {
        "application/json": { schema: ApiErrorSchema },
      },
    },
  },
});
