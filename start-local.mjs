#!/usr/bin/env node
// start-local.mjs — Windows stand-in for `cd app && npm start`. pucho-os 4.4.0's app/scripts/start.mjs ends with
// `await import(path.join(serverDir, 'server.js'))`, which Node's ESM loader refuses on Windows (a `D:\…` path is not a URL).
// Same steps, with pathToFileURL. Remove once the kit's start.mjs is fixed.
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath, pathToFileURL } from 'node:url';
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'app');
const SA = path.join(ROOT, '.next', 'standalone');
const find = (d) => { if (fs.existsSync(path.join(d, 'server.js'))) return d; for (const f of fs.readdirSync(d, { withFileTypes: true })) if (f.isDirectory() && f.name !== 'node_modules') { const r = find(path.join(d, f.name)); if (r) return r; } return null; };
const serverDir = fs.existsSync(SA) && find(SA);
if (!serverDir) { console.error('no standalone build — run `cd app && npm run build` first'); process.exit(2); }
for (const [src, dst] of [['.next/static', '.next/static'], ['public', 'public'], ['db', 'db']]) {
  const s = path.join(ROOT, src), d = path.join(serverDir, dst); if (!fs.existsSync(s)) continue;
  fs.rmSync(d, { recursive: true, force: true }); fs.cpSync(s, d, { recursive: true });
}
for (const f of ['.env.local', '.env']) {
  const p = path.join(ROOT, f); if (!fs.existsSync(p)) continue;
  for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) { const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/); if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/\s+#.*$/, '').replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1').trim(); }
}
process.env.HOSTNAME ??= '127.0.0.1'; process.env.PORT ??= '3000';
console.log(`standalone server → http://${process.env.HOSTNAME}:${process.env.PORT}  (DEMO_LOGINS=${process.env.DEMO_LOGINS ?? 'unset'})`);
process.chdir(serverDir);
await import(pathToFileURL(path.join(serverDir, 'server.js')).href);
