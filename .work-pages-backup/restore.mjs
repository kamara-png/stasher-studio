import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const backupDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(backupDir, "..");
const pages = [
  "work/index.html",
  "work/q-lounge/index.html",
  "work/allaces-games/index.html",
  "work/onedynamics/index.html",
  "work/sawicki-legal/index.html",
  "work/ipg-interact/index.html",
  "work/hipromine/index.html",
];

for (const rel of pages) {
  fs.copyFileSync(path.join(backupDir, rel), path.join(root, rel));
}

console.log(`Restored ${pages.length} work pages. Run the post-hydration generator to re-inject the DOM changes.`);
