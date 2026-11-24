#!/usr/bin/env node
// Downloads every remote Unsplash photo referenced by the site into public/images/unsplash/
// and rewrites the references to local paths. Run once on a machine with internet access:
//   npm run images:localize
import fs from "node:fs";
import path from "node:path";

const roots = ["src/generated", "src/data", "src/lib"];
const pattern = /https:\/\/images\.unsplash\.com\/(photo-[A-Za-z0-9-]+)\?([^"')\s\\]+)/g;
const outDir = "public/images/unsplash";
fs.mkdirSync(outDir, { recursive: true });

const files = [];
function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(tsx?|json)$/.test(e.name)) files.push(p);
  }
}
roots.forEach(walk);

const wanted = new Map(); // url -> local file name
for (const f of files) {
  for (const m of fs.readFileSync(f, "utf8").matchAll(pattern)) {
    const w = /[?&]w=(\d+)/.exec(m[0])?.[1] ?? "900";
    wanted.set(m[0], `${m[1]}-w${w}.jpg`);
  }
}
console.log(`${wanted.size} unique images`);

let failed = 0;
for (const [url, name] of wanted) {
  const dest = path.join(outDir, name);
  if (fs.existsSync(dest)) continue;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(String(res.status));
    fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  } catch (err) {
    failed++;
    console.warn("failed:", url, String(err));
    wanted.delete(url);
  }
}

for (const f of files) {
  let s = fs.readFileSync(f, "utf8");
  let changed = false;
  for (const [url, name] of wanted) {
    if (s.includes(url)) {
      s = s.split(url).join(`/images/unsplash/${name}`);
      changed = true;
    }
  }
  if (changed) fs.writeFileSync(f, s);
}
console.log(failed ? `done with ${failed} failures (their remote URLs were left untouched)` : "done: all images are local");
