import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outDir = join(root, "public");

const variants = [
  {
    file: "logo-mark.png",
    html: `<div class="logo">6foot.</div>`,
    width: 320,
    height: 120,
    fontSize: 64,
  },
  {
    file: "logo-wordmark.png",
    html: `<div class="logo">6foot</div>`,
    width: 480,
    height: 160,
    fontSize: 96,
  },
  {
    file: "logo-mark-white.png",
    html: `<div class="logo white">6foot.</div>`,
    width: 320,
    height: 120,
    fontSize: 64,
    background: "#0a0a0a",
  },
];

function pageHtml({ html, fontSize, background = "transparent" }) {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@700&display=swap"
      rel="stylesheet"
    />
    <style>
      html, body {
        margin: 0;
        padding: 0;
        background: ${background};
      }
      body {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100vw;
        height: 100vh;
      }
      .logo {
        font-family: "Inter Tight", ui-sans-serif, system-ui, sans-serif;
        font-size: ${fontSize}px;
        font-weight: 700;
        letter-spacing: -0.055em;
        line-height: 1;
        color: #0a0a0a;
        white-space: nowrap;
      }
      .logo.white {
        color: #f9f9f9;
      }
    </style>
  </head>
  <body>${html}</body>
</html>`;
}

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();

for (const variant of variants) {
  await page.setViewportSize({ width: variant.width, height: variant.height });
  await page.setContent(pageHtml(variant), { waitUntil: "networkidle" });
  await page.waitForTimeout(300);

  const logo = page.locator(".logo");
  const box = await logo.boundingBox();
  if (!box) throw new Error(`Could not measure ${variant.file}`);

  const padding = 8;
  const path = join(outDir, variant.file);
  await page.screenshot({
    path,
    clip: {
      x: Math.max(0, box.x - padding),
      y: Math.max(0, box.y - padding),
      width: box.width + padding * 2,
      height: box.height + padding * 2,
    },
    omitBackground: variant.background ? false : true,
  });

  console.log(`✓ ${path}`);
}

await browser.close();
