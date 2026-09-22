/**
 * @getlib/config - validated runtime configuration.
 * Fail fast on invalid env. Never log secrets.
 */
import { z } from "zod";

const ConfigSchema = z.object({
  nodeEnv: z.enum(["development", "test", "production"]).default("development"),
  logLevel: z.enum(["debug", "info", "warn", "error"]).default("info"),
  logFormat: z.enum(["json", "text"]).default("text"),
  databaseUrl: z
    .string()
    .min(1)
    .default("postgres://getlib:getlib@localhost:5432/getlib"),
  apiPort: z.coerce.number().int().min(1).max(65535).default(3001),
  apiBaseUrl: z.string().min(1).default("http://localhost:3001"),
});

export type GetLibConfig = z.infer<typeof ConfigSchema>;

export interface RawEnv {
  NODE_ENV?: string | undefined;
  LOG_LEVEL?: string | undefined;
  LOG_FORMAT?: string | undefined;
  DATABASE_URL?: string | undefined;
  API_PORT?: string | number | undefined;
  API_BASE_URL?: string | undefined;
}

export function loadConfig(raw: RawEnv = process.env as RawEnv): GetLibConfig {
  return ConfigSchema.parse({
    nodeEnv: raw.NODE_ENV,
    logLevel: raw.LOG_LEVEL,
    logFormat: raw.LOG_FORMAT,
    databaseUrl: raw.DATABASE_URL,
    apiPort: raw.API_PORT,
    apiBaseUrl: raw.API_BASE_URL,
  });
}

/** Safe summary for logs/health: excludes credentials. */
export function toSafeSummary(config: GetLibConfig): Record<string, string> {
  return {
    nodeEnv: config.nodeEnv,
    logLevel: config.logLevel,
    logFormat: config.logFormat,
    apiPort: String(config.apiPort),
    apiBaseUrl: config.apiBaseUrl,
    databaseConfigured: config.databaseUrl.length > 0 ? "true" : "false",
  };
}
