import { describe, it, expect, vi, afterEach } from "vitest";

// ── DISK_CACHE_DIR ─────────────────────────────────────────────────────────────

describe("DISK_CACHE_DIR", () => {
  it("is defined and is a string", async () => {
    vi.resetModules();
    const { DISK_CACHE_DIR } = await import("../src/constants.js");
    expect(typeof DISK_CACHE_DIR).toBe("string");
    expect(DISK_CACHE_DIR.length).toBeGreaterThan(0);
  });
});

// ── GL_CACHE_DIR system directory validation ───────────────────────────────────

describe("GL_CACHE_DIR system directory validation", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  const BLOCKED_DIRS = [
    "/etc",
    "/proc",
    "/sys",
    "/dev",
    "/boot",
    "/root",
    "/bin",
    "/sbin",
    "/usr",
    "/var/run",
    "/run",
  ];

  it.each(BLOCKED_DIRS)("throws when GL_CACHE_DIR is set to blocked directory: %s", async (dir) => {
    vi.stubEnv("GL_CACHE_DIR", dir);
    vi.resetModules();
    await expect(import("../src/constants.js")).rejects.toThrow("GL_CACHE_DIR must not point to a system directory");
  });

  it.each(BLOCKED_DIRS.map((d) => `${d}/subpath`))(
    "throws when GL_CACHE_DIR starts with blocked directory: %s",
    async (dir) => {
      vi.stubEnv("GL_CACHE_DIR", dir);
      vi.resetModules();
      await expect(import("../src/constants.js")).rejects.toThrow("GL_CACHE_DIR must not point to a system directory");
    },
  );

  it("does not throw for a safe user-supplied cache directory", async () => {
    vi.stubEnv("GL_CACHE_DIR", "/tmp/.my-custom-cache");
    vi.resetModules();
    await expect(import("../src/constants.js")).resolves.toBeDefined();
  });

  it("does not throw for a home-relative cache directory", async () => {
    vi.stubEnv("GL_CACHE_DIR", "/home/user/.gl-mcp-cache");
    vi.resetModules();
    await expect(import("../src/constants.js")).resolves.toBeDefined();
  });
});
