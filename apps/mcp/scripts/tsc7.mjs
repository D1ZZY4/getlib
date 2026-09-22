// Side-by-side TypeScript runner.
//
// Build/typecheck run on TypeScript 7 (installed as the `typescript7`
// npm-alias), while typescript-eslint keeps using the root `typescript`
// v6 package, which is the newest it supports (peer: >=4.8.4 <6.1.0).
// Works identically under `npm run` and `bun run` since both managers
// create the same `node_modules` layout.
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const tsc = path.join(root, "node_modules", "typescript7", "bin", "tsc");

const r = spawnSync(process.execPath, [tsc, ...process.argv.slice(2)], {
  stdio: "inherit",
});
process.exit(r.status ?? 1);
