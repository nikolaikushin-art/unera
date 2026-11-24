// Renders every route to dist/<route>/index.html so each page is real, crawlable HTML.
// The client bundle then takes over (same container). dist/spa.html is the fallback for unknown URLs.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const dist = path.join(root, "dist");
const { render } = await import(pathToFileURL(path.join(root, "prerender/out/entry-server.js")).href);
const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");

const pagesDir = path.join(root, "src/data/pages");
const slugs = new Set([
  ...fs.readdirSync(pagesDir).map((f) => f.replace(/\.json$/, "")),
  "contact",
  "leadership",
  ...JSON.parse(fs.readFileSync(path.join(root, "src/data/missing-pages.json"), "utf8")),
  "privacy",
  "terms",
  "accessibility",
]);
const routes = ["/", ...[...slugs].sort().map((s) => `/${s}`)];

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
let bad = 0;
for (const url of routes) {
  const { html, metas, notFound } = await render(url);
  if (notFound) { bad++; console.log("  404:", url); }
  const body = html.replace(/<title>[\s\S]*?<\/title>/g, "").replace(/<meta\b[^>]*>/g, "");
  let out = template.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
  const title = [...metas].reverse().find((m) => m.title)?.title;
  if (title) out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  const robots = [...metas].reverse().find((m) => m.name === "robots");
  if (robots) out = out.replace("</head>", `    <meta name="robots" content="${esc(robots.content)}" />\n  </head>`);
  const file = url === "/" ? path.join(dist, "index.html") : path.join(dist, url, "index.html");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (url === "/") fs.copyFileSync(file, path.join(dist, "spa.html")); // untouched SPA shell
  fs.writeFileSync(file, out);
}
console.log(`prerendered ${routes.length} pages; notFound: ${bad}`);
