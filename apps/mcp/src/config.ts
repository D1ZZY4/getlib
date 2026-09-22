export interface GLConfig {
  tokenLimit: number;
  maxTokenLimit: number;
  cacheTtlMs: number;
  fetchTimeoutMs: number;
  deepFetchMaxPages: number;
  deepFetchRelevanceThreshold: number;
  deepFetchTimeoutMs: number;
  maxConcurrentFetches: number;
  toolTimeoutMs: number;
  swrStaleTtlMs: number;
  circuitBreakerThreshold: number;
  circuitBreakerResetMs: number;
  logFormat: "json" | "text";
  logLevel: "debug" | "info" | "warn" | "error";
  httpPort: string | undefined;
}

function intEnv(name: string, fallback: number, min = 0): number {
  const raw = process.env[name];
  if (raw === undefined) return fallback;
  const parsed = parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < min) {
    throw new Error(`Invalid ${name}: "${raw}" -- must be an integer >= ${min}`);
  }
  return parsed;
}

function floatEnv(name: string, fallback: number, min: number, max: number): number {
  const raw = process.env[name];
  if (raw === undefined) return fallback;
  const parsed = Number.parseFloat(raw);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) {
    throw new Error(`Invalid ${name}: "${raw}" -- must be a number between ${min} and ${max}`);
  }
  return parsed;
}

function enumEnv<T extends string>(name: string, fallback: T, allowed: readonly T[]): T {
  const raw = process.env[name];
  if (raw === undefined) return fallback;
  if (!allowed.includes(raw as T)) {
    throw new Error(`Invalid ${name}: "${raw}" -- must be one of: ${allowed.join(", ")}`);
  }
  return raw as T;
}

export const config: Readonly<GLConfig> = Object.freeze({
  tokenLimit: intEnv("GL_TOKEN_LIMIT", 8000),
  maxTokenLimit: intEnv("GL_MAX_TOKEN_LIMIT", 20000),
  cacheTtlMs: intEnv("GL_CACHE_TTL_MS", 30 * 60 * 1000),
  fetchTimeoutMs: intEnv("GL_FETCH_TIMEOUT_MS", 15_000, 1),
  deepFetchMaxPages: intEnv("GL_DEEP_FETCH_MAX_PAGES", 8, 1),
  deepFetchRelevanceThreshold: floatEnv("GL_DEEP_FETCH_RELEVANCE_THRESHOLD", 0.3, 0, 1),
  deepFetchTimeoutMs: intEnv("GL_DEEP_FETCH_TIMEOUT_MS", 25_000, 1),
  maxConcurrentFetches: intEnv("GL_MAX_CONCURRENT_FETCHES", 12, 1),
  toolTimeoutMs: intEnv("GL_TOOL_TIMEOUT_MS", 55_000, 1),
  swrStaleTtlMs: intEnv("GL_SWR_STALE_TTL_MS", 60 * 60 * 1000, 1),
  circuitBreakerThreshold: intEnv("GL_CIRCUIT_BREAKER_THRESHOLD", 3, 1),
  circuitBreakerResetMs: intEnv("GL_CIRCUIT_BREAKER_RESET_MS", 60_000, 1),
  logFormat: enumEnv("GL_LOG_FORMAT", "text", ["json", "text"] as const),
  logLevel: enumEnv("GL_LOG_LEVEL", "info", ["debug", "info", "warn", "error"] as const),
  httpPort: process.env.GL_HTTP_PORT,
});
