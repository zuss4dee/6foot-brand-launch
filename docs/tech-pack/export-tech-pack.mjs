#!/usr/bin/env node
/**
 * Export 6FOOT tech pack HTML sheets to PNG (300dpi A4) + combined PDF.
 * Usage: node docs/tech-pack/export-tech-pack.mjs
 */
import { chromium } from "playwright";
import { createWriteStream, mkdirSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { readFileSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const HTML_FILE = join(__dirname, "6foot-master-tech-pack-template.html");
const OUT_DIR = join(__dirname, "export");
const A4_W = 2480;
const A4_H = 3508;
const PORT = 8766;

function startServer() {
  return new Promise((resolve) => {
    const html = readFileSync(HTML_FILE, "utf8");
    const server = createServer((req, res) => {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
    });
    server.listen(PORT, () => resolve(server));
  });
}

async function main() {
  if (!existsSync(HTML_FILE)) {
    console.error("Missing template:", HTML_FILE);
    process.exit(1);
  }
  mkdirSync(OUT_DIR, { recursive: true });

  const server = await startServer();
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: A4_W, height: A4_H },
    deviceScaleFactor: 1,
  });

  await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts?.ready);

  const sheets = await page.locator(".sheet").all();
  console.log(`Exporting ${sheets.length} sheets…`);

  for (let i = 0; i < sheets.length; i++) {
    const num = String(i + 1).padStart(2, "0");
    const path = join(OUT_DIR, `6foot-tech-pack-${num}.png`);
    await sheets[i].screenshot({ path, type: "png" });
    console.log("  ✓", path);
  }

  await page.pdf({
    path: join(OUT_DIR, "6foot-master-tech-pack.pdf"),
    width: "210mm",
    height: "297mm",
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });
  console.log("  ✓ PDF:", join(OUT_DIR, "6foot-master-tech-pack.pdf"));

  await browser.close();
  server.close();
  console.log("\nDone →", OUT_DIR);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
