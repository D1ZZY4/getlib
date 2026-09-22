import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**/*.ts"],
      exclude: ["tests/**/*.test.ts", "src/index.ts"],
    },
    restoreMocks: true,
    // Vitest 5 changed clearMocks default to true, which wipes mock call
    // history recorded at module-import time (e.g. registerXTool(mockServer)
    // at the top of test files). Keep v4 behavior: only restore, don't clear.
    clearMocks: false,
    // ESM-native — no transform needed
    pool: "forks",
  },
});
