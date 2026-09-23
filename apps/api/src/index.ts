/**
 * @getlib/api - runtime entrypoint.
 *
 * Bun-first: `bun run --cwd apps/api start` serves the API through the
 * default export (port + fetch, no Bun globals, stays typecheck-clean).
 * The exported app stays importable for tests and future adapters
 * without booting a listener as a side effect.
 */
import { loadConfig, toSafeSummary } from "@getlib/config";
import { createApp } from "./app.js";

const config = loadConfig({
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  API_PORT: process.env.API_PORT,
  API_BASE_URL: process.env.API_BASE_URL,
  LOG_LEVEL: process.env.LOG_LEVEL,
  LOG_FORMAT: process.env.LOG_FORMAT,
});

export const app = createApp();

if (process.env.NODE_ENV !== "test") {
  // eslint-disable-next-line no-console
  console.log(`getlib api config: ${JSON.stringify(toSafeSummary(config))}`);
}

export default {
  port: config.apiPort,
  fetch: app.fetch,
};
