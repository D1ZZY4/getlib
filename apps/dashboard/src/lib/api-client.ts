/**
 * GetLib typed API client (dashboard -> API boundary, doc 06).
 *
 * - Responses are validated at runtime against @getlib/schemas contracts.
 * - Every request carries an X-Request-ID for trace correlation.
 * - Callers pass an AbortSignal so in-flight requests (e.g. search) can be
 *   cancelled; AbortError is rethrown unchanged and must not be reported
 *   as a failure.
 * - Endpoint paths follow the /api/v1 namespace (doc 19). They bind to
 *   real Hono routes in Phase 3; until then hooks use fixtures.
 */
import {
  ApiErrorSchema,
  HealthResponseSchema,
  OverviewSummarySchema,
  type HealthResponse,
  type OverviewSummary,
} from "@getlib/schemas";
import { z } from "zod";

export const DEFAULT_API_BASE_URL = "http://localhost:3001/api/v1";

export class GetLibApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly requestId: string | undefined;

  constructor(args: {
    code: string;
    status: number;
    message: string;
    requestId?: string;
  }) {
    super(args.message);
    this.name = "GetLibApiError";
    this.code = args.code;
    this.status = args.status;
    this.requestId = args.requestId;
  }
}

export interface ApiRequestOptions {
  baseUrl?: string;
  signal?: AbortSignal;
  fetchImpl?: typeof fetch;
  requestId?: string;
}

export function resolveApiBaseUrl(raw: string | undefined): string {
  const trimmed = (raw ?? "").trim().replace(/\/+$/, "");
  return trimmed.length > 0 ? trimmed : DEFAULT_API_BASE_URL;
}

function newRequestId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `req-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
}

function toHttpError(
  status: number,
  body: unknown,
  requestId: string,
): GetLibApiError {
  const parsed = ApiErrorSchema.safeParse(body);
  if (parsed.success) {
    return new GetLibApiError({
      code: parsed.data.code,
      status,
      message: parsed.data.message,
      requestId: parsed.data.requestId ?? requestId,
    });
  }
  const message =
    typeof body === "string" && body.length > 0
      ? body
      : `Request failed with status ${status}`;
  return new GetLibApiError({
    code: `HTTP_${status}`,
    status,
    message,
    requestId,
  });
}

function parseJsonBody(text: string): unknown {
  if (text.length === 0) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

export async function apiFetch<T>(
  path: string,
  schema: z.ZodType<T>,
  options: ApiRequestOptions = {},
): Promise<T> {
  const baseUrl = resolveApiBaseUrl(options.baseUrl);
  const requestId = options.requestId ?? newRequestId();
  const fetchImpl = options.fetchImpl ?? fetch;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  let response: Response;
  try {
    response = await fetchImpl(`${baseUrl}${normalizedPath}`, {
      headers: {
        Accept: "application/json",
        "X-Request-ID": requestId,
      },
      signal: options.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") throw error;
    throw new GetLibApiError({
      code: "NETWORK_ERROR",
      status: 0,
      message: error instanceof Error ? error.message : "Network request failed",
      requestId,
    });
  }

  const body = parseJsonBody(await response.text());
  if (!response.ok) throw toHttpError(response.status, body, requestId);

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw new GetLibApiError({
      code: "INVALID_RESPONSE",
      status: response.status,
      message: "Response did not match the expected contract",
      requestId,
    });
  }
  return parsed.data;
}

export function getHealth(
  options: ApiRequestOptions = {},
): Promise<HealthResponse> {
  return apiFetch("/health", HealthResponseSchema, options);
}

export function getOverviewSummary(
  options: ApiRequestOptions = {},
): Promise<OverviewSummary> {
  return apiFetch("/overview/summary", OverviewSummarySchema, options);
}
