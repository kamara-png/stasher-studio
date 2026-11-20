// Local server for the offline copy of melon.studio
// Double-click start.bat, or run: node serve.mjs
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 5173);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".xml": "application/xml",
  ".webmanifest": "application/manifest+json",
  ".txt": "text/plain; charset=utf-8",
};

const sha = (s) => crypto.createHash("sha1").update(s).digest("hex").slice(0, 8);

function withQueryVariant(file, search) {
  if (!search) return null;
  const dir = path.dirname(file);
  const name = path.basename(file);
  const ext = path.extname(name);
  const base = ext ? name.slice(0, -ext.length) : name;
  const h = "__" + sha(search);
  const candidates = [path.join(dir, base + h + ext), path.join(dir, base + h), path.join(dir, base + h + ".bin")];
  return candidates.find((c) => fs.existsSync(c) && fs.statSync(c).isFile()) || null;
}

function resolveFile(urlPath, search) {
  let file = path.join(ROOT, urlPath);
  if (!file.startsWith(ROOT)) return null;
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (fs.existsSync(file) && fs.statSync(file).isFile()) return file;
  if (fs.existsSync(file + ".html")) return file + ".html";
  const variant = withQueryVariant(file, search);
  if (variant) return variant;
  // a route without trailing slash: /work -> /work/index.html
  const asDir = path.join(file, "index.html");
  if (fs.existsSync(asDir)) return asDir;
  return null;
}

// Keep navigation working despite Next.js client routing (which needs a server).
// Appended to an existing inline <script> so no new DOM nodes are added (avoids
// React hydration mismatch). Also answers /api/now-playing from a local file.
const NAV_CODE = `
(function(){
  addEventListener('click', function(e){
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a || a.target === '_blank' || a.hasAttribute('download') || a.hasAttribute('data-external')) return;
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#' || /^(mailto:|tel:|javascript:|https?:)/i.test(href)) return;
    e.preventDefault();
    e.stopPropagation();
    location.assign(href);
  }, true);
})();`;

function inject(html) {
  // The shim is baked into HTML for static hosting (Vercel); don't duplicate it.
  if (html.includes("/* stasher-nav-shim */")) return html;
  const re = /(<script>\(function\(\)\{var h=document\.documentElement;[\s\S]*?)<\/script>/;
  if (re.test(html)) return html.replace(re, `$1;\n${NAV_CODE}\n</script>`);
  if (html.includes("</head>")) return html.replace("</head>", `<script>${NAV_CODE}</script></head>`);
  return `<script>${NAV_CODE}</script>` + html;
}

http
  .createServer((req, res) => {
    let url, urlPath;
    try {
      url = new URL(req.url, "http://localhost");
      urlPath = decodeURIComponent(url.pathname);
    } catch {
      res.writeHead(400).end("Bad request");
      return;
    }
    if (urlPath === "/api/now-playing") {
      const api = path.join(ROOT, "api/now-playing.json");
      if (fs.existsSync(api)) {
        res.writeHead(200, { "content-type": "application/json", "cache-control": "no-store" });
        fs.createReadStream(api).pipe(res);
        return;
      }
    }
    const file = resolveFile(urlPath, url.search);
    if (!file) {
      const notFound = path.join(ROOT, "404.html");
      if (fs.existsSync(notFound)) {
        res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
        fs.createReadStream(notFound).pipe(res);
        return;
      }
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      res.end("404 Not found: " + urlPath);
      return;
    }
    const ext = path.extname(file).toLowerCase();
    const type = TYPES[ext] || "application/octet-stream";
    if (ext === ".html") {
      let html = inject(fs.readFileSync(file, "utf8"));
      const buf = Buffer.from(html, "utf8");
      res.writeHead(200, { "content-type": type, "content-length": buf.length, "cache-control": "no-cache" });
      res.end(buf);
      return;
    }
    res.writeHead(200, { "content-type": type, "cache-control": "no-cache" });
    fs.createReadStream(file).pipe(res);
  })
  .listen(PORT, () => {
    console.log(`\n  stasher studio -> http://localhost:${PORT}\n  Ctrl+C to stop\n`);
  });
