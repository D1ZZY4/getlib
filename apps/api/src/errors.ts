/**
 * @getlib/api - transport error envelope.
 *
 * Every error response uses the shared ApiErrorSchema shape so API
 * consumers (dashboard, CLI, MCP mappers) parse one contract.
 */
import { type ApiError, ApiErrorSchema } from "@getlib/schemas";

export function toApiError(
  code: string,
  message: string,
  requestId?: string,
): ApiError {
  return ApiErrorSchema.parse({ code, message, requestId });
}

export function unknownErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Internal Server Error";
}
