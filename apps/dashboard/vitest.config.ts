import path from "node:path";
import { defineConfig } from "vitest/config";

// Slice 2 adds @testing-library/react + jsdom for component behavior.
// Slice 1 tests pure modules (client, fixtures, data source) under node.
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  test: {
    environment: "node",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
});
