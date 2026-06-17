#!/usr/bin/env node
/**
 * Generate 6FOOT STUDIO master tech pack HTML template (18 A4 sheets).
 * Usage: node docs/tech-pack/generate-tech-pack-template.mjs
 */
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "6foot-master-tech-pack-template.html");
const TOTAL_SHEETS = 18;
const LEGAL =
  "6FOOT STUDIO · CONFIDENTIAL · ENGINEERED TALL BLOCKS · NOT FOR DISTRIBUTION";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function pom(letter, x1, y1, x2, y2, labelX, labelY, opts = {}) {
  const { rotate, anchor = "middle", vertical } = opts;
  const caps =
    `<polygon class="pom-cap" points="${x1},${y1} ${x1 + (x2 > x1 ? 4 : -4)},${y1 - 2} ${x1 + (x2 > x1 ? 4 : -4)},${y1 + 2}"/>` +
    `<polygon class="pom-cap" points="${x2},${y2} ${x2 + (x2 > x1 ? -4 : 4)},${y2 - 2} ${x2 + (x2 > x1 ? -4 : 4)},${y2 + 2}"/>`;
  let text = `<text x="${labelX}" y="${labelY}" text-anchor="${anchor}" font-size="5">${letter}</text>`;
  if (rotate) text = `<text x="${labelX}" y="${labelY}" transform="rotate(${rotate})" font-size="5">${letter}</text>`;
  if (vertical) text = `<text x="${labelX}" y="${labelY}" transform="rotate(-90 ${labelX} ${labelY})" font-size="5">${letter}</text>`;
  return `<g class="pom-callout"><line class="pom-line" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>${caps}${text}</g>`;
}

function fig(id, label, svg) {
  return `<div class="fig" id="${id}"><div class="fig__label">${esc(label)}</div>${svg}</div>`;
}

function blockTitle(num, title, ref) {
  return `<div class="block-title"><h2>${String(num).padStart(2, "0")} · ${esc(title)}</h2><span class="ref">REF · ${esc(ref)}</span></div>`;
}

function hdr(leftBrand, leftSub, centerDoc, centerSub, metaLines) {
  const meta = metaLines.map((l) => `<span>${esc(l)}</span>`).join("\n      ");
  return `<header class="hdr">
    <div>
      <div class="hdr__brand">${esc(leftBrand)}</div>
      <div class="hdr__sub">${esc(leftSub)}</div>
    </div>
    <div class="hdr__center">
      <div class="hdr__doc">${esc(centerDoc)}</div>
      <div class="hdr__sub">${esc(centerSub)}</div>
    </div>
    <div class="hdr__meta">
      ${meta}
    </div>
  </header>`;
}

function ftr(n) {
  return `<footer class="ftr">
    <span class="ftr__legal">${LEGAL}</span>
    <span>Sheet ${String(n).padStart(2, "0")} / ${String(TOTAL_SHEETS).padStart(2, "0")}</span>
  </footer>`;
}

function sheet(id, n, body) {
  return `<!-- SHEET ${String(n).padStart(2, "0")} — ${id} -->
<section class="sheet" id="sheet-${String(n).padStart(2, "0")}">
  <div class="frame"></div>
  <div class="frame-inner"></div>
  ${body}
  ${ftr(n)}
</section>`;
}

function table(id, headers, rows) {
  const th = headers.map((h) => `<th>${esc(h)}</th>`).join("");
  const tbody = rows
    .map((row) => {
      if (row._subhead)
        return `<tr class="subhead"><td colspan="${headers.length}">${esc(row._subhead)}</td></tr>`;
      return `<tr>${row
        .map((cell, i) => {
          let cls = "";
          if (i === 0 && /^[A-Z]$|^[A-Z]\d?$|^B[123]$|^—$/.test(String(cell)))
            cls = ' class="pom-id"';
          else if (cell === "" || cell === "—") cls = ' class="val"';
          else if (i === 1) cls = ' class="dim"';
          return `<td${cls}>${esc(cell)}</td>`;
        })
        .join("")}</tr>`;
    })
    .join("\n        ");
  return `<table class="grid-table" id="${id}"><thead><tr>${th}</tr></thead><tbody>
        ${tbody}
      </tbody></table>`;
}

function emptyCols(n) {
  return Array(n).fill("");
}

function pomRow(id, desc, tol = "", unit = "CM", note = "") {
  return [id, desc, tol, "", "", "", unit, note];
}

function fieldGrid(fields) {
  return `<div class="field-grid">${fields
    .map(
      ([label, placeholder]) =>
        `<div class="field"><span class="field__label">${esc(label)}</span><span class="field__value">${esc(placeholder)}</span></div>`
    )
    .join("")}</div>`;
}

function legend(items) {
  return `<div class="legend">${items
    .map(
      ([swatch, label]) =>
        `<div class="legend__item"><span class="legend__swatch${swatch ? " legend__swatch--" + swatch : ""}"></span>${esc(label)}</div>`
    )
    .join("")}</div>`;
}

function checkboxTable(id, items) {
  const rows = items
    .map(
      (item) =>
        `<tr><td class="chk">☐</td><td class="dim">${esc(item)}</td><td class="val"></td><td class="val"></td><td class="val"></td></tr>`
    )
    .join("\n        ");
  return `<table class="grid-table chk-table" id="${id}">
      <thead><tr><th></th><th>Check Item</th><th>Pass</th><th>Fail</th><th>Notes</th></tr></thead>
      <tbody>
        ${rows}
      </tbody>
    </table>`;
}

// ─── SVG Flats (no numeric measurements) ───────────────────────────────────

const SVG_HEIGHT_GRADING = `<svg viewBox="0 0 720 380" xmlns="http://www.w3.org/2000/svg" aria-label="Height silhouette grading">
        <line class="stroke-gray" x1="50" y1="340" x2="680" y2="340"/>
        <g transform="translate(80,0)">
          <text x="50" y="24" text-anchor="middle">Block 1 · 6′0″</text>
          <path class="grade-fill" d="M50,340 L50,95 C50,70 42,58 50,48 C58,38 62,28 50,18 C38,28 42,38 50,48 C58,58 50,70 50,95 L50,340 Z"/>
          <path class="grade-inner" d="M50,95 L38,200 L42,280 L50,340 M50,95 L62,200 L58,280 L50,340"/>
        </g>
        <g transform="translate(270,0)">
          <text x="55" y="24" text-anchor="middle">Block 2 · 6′3″</text>
          <path class="grade-fill" d="M55,340 L55,72 C55,46 46,34 55,24 C64,14 68,4 55,-6 C42,4 46,14 55,24 C64,34 55,46 55,72 L55,340 Z" transform="translate(0,6)"/>
          <path class="grade-inner" d="M55,78 L40,188 L45,272 L55,340 M55,78 L70,188 L65,272 L55,340"/>
        </g>
        <g transform="translate(470,0)">
          <text x="60" y="24" text-anchor="middle">Block 3 · 6′6″</text>
          <path class="grade-fill" d="M60,340 L60,50 C60,24 48,12 60,0 C72,-12 76,-22 60,-32 C44,-22 48,-12 60,0 C72,12 60,24 60,50 L60,340 Z" transform="translate(0,12)"/>
          <path class="grade-inner" d="M60,62 L42,176 L48,264 L60,340 M60,62 L78,176 L72,264 L60,340"/>
        </g>
      </svg>`;

const SVG_HOODIE_FRONT = `<svg viewBox="0 0 320 400" xmlns="http://www.w3.org/2000/svg">
          <g id="hoodie-front-outline">
            <path class="stroke" d="M60,120 L40,130 L30,200 L35,360 L285,360 L290,200 L280,130 L260,120 L240,115 L200,108 L160,105 L120,108 L80,115 Z"/>
            <path class="stroke" d="M80,115 C80,80 100,40 160,32 C220,40 240,80 240,115"/>
            <path class="stroke-thin" d="M95,115 C95,88 115,58 160,52 C205,58 225,88 225,115"/>
            <path class="stroke-thin" d="M100,220 L100,300 Q160,318 220,300 L220,220 Q160,205 100,220 Z"/>
            <line class="stroke" x1="35" y1="360" x2="285" y2="360" stroke-width="1.2"/>
            <path class="construction" d="M35,352 L285,352 M35,368 L285,368"/>
            <rect class="stroke-thin" x="30" y="195" width="12" height="28"/>
            <rect class="stroke-thin" x="278" y="195" width="12" height="28"/>
            <line class="stroke-dash" x1="40" y1="130" x2="280" y2="130"/>
            <line class="stroke-gray" x1="160" y1="105" x2="160" y2="360"/>
          </g>
          ${pom("A", 20, 175, 300, 175, 160, 168)}
          ${pom("B", 310, 115, 310, 360, 318, 240, { rotate: "90 318 240" })}
          ${pom("C", 20, 348, 300, 348, 160, 342)}
          ${pom("D", 8, 52, 8, 115, 4, 84, { vertical: true })}
          <g class="pom-callout"><path class="pom-line" d="M95,115 Q160,128 225,115" fill="none"/><text x="160" y="138" text-anchor="middle" font-size="5">E</text></g>
          ${pom("F", 100, 310, 220, 310, 160, 324)}
        </svg>`;

const SVG_HOODIE_BACK = `<svg viewBox="0 0 320 400" xmlns="http://www.w3.org/2000/svg">
          <g id="hoodie-back-outline">
            <path class="stroke" d="M60,120 L40,130 L30,200 L35,360 L285,360 L290,200 L280,130 L260,120 L240,115 L200,108 L160,105 L120,108 L80,115 Z"/>
            <path class="stroke" d="M80,115 C80,80 100,40 160,32 C220,40 240,80 240,115"/>
            <line class="stroke" x1="35" y1="360" x2="285" y2="360" stroke-width="1.2"/>
            <rect class="stroke-thin" x="30" y="195" width="12" height="28"/>
            <rect class="stroke-thin" x="278" y="195" width="12" height="28"/>
            <line class="stroke-dash" x1="40" y1="130" x2="280" y2="130"/>
            <line class="stroke-gray" x1="160" y1="105" x2="160" y2="360"/>
            <line class="stroke-thin" x1="160" y1="32" x2="160" y2="115"/>
          </g>
          ${pom("G", 40, 130, 280, 130, 160, 124)}
          ${pom("H", 30, 130, 30, 223, 14, 180, { vertical: true })}
          ${pom("I", 30, 210, 42, 210, 36, 204)}
          ${pom("J", 300, 105, 300, 130, 306, 120, { anchor: "start" })}
        </svg>`;

const SVG_TRK_FRONT = `<svg viewBox="0 0 300 420" xmlns="http://www.w3.org/2000/svg">
          <g id="trk-front-outline">
            <rect class="stroke" x="70" y="30" width="160" height="22"/>
            <line class="stroke-thin" x1="70" y1="38" x2="230" y2="38"/>
            <line class="stroke-thin" x1="70" y1="46" x2="230" y2="46"/>
            <text x="150" y="26" text-anchor="middle" font-size="5">Waist Casing</text>
            <path class="stroke" d="M70,52 L62,120 L58,200 L55,360 L85,365 L95,200 L100,120 L110,52 Z"/>
            <path class="stroke" d="M230,52 L238,120 L242,200 L245,360 L215,365 L205,200 L200,120 L190,52 Z"/>
            <line class="stroke-gray" x1="150" y1="52" x2="150" y2="365"/>
            <rect class="stroke" x="55" y="348" width="30" height="18"/>
            <line class="stroke-thin" x1="55" y1="354" x2="85" y2="354"/>
            <rect class="stroke" x="215" y="348" width="30" height="18"/>
            <line class="stroke-thin" x1="215" y1="354" x2="245" y2="354"/>
            <line class="stroke-dash" x1="62" y1="120" x2="58" y2="360"/>
            <line class="stroke-dash" x1="238" y1="120" x2="242" y2="360"/>
          </g>
          ${pom("K", 70, 22, 230, 22, 150, 16)}
          ${pom("L", 260, 52, 260, 120, 268, 88, { anchor: "start" })}
          ${pom("M", 150, 120, 150, 365, 158, 240, { anchor: "start" })}
          ${pom("N", 55, 374, 85, 374, 70, 390)}
        </svg>`;

const SVG_TRK_SIDE = `<svg viewBox="0 0 300 420" xmlns="http://www.w3.org/2000/svg">
          <g id="trk-side-outline">
            <path class="stroke" d="M80,40 L80,62 L220,62 L220,40 Z"/>
            <line class="stroke-thin" x1="80" y1="48" x2="220" y2="48"/>
            <line class="stroke-dot" x1="80" y1="54" x2="220" y2="54"/>
            <text x="150" y="34" text-anchor="middle" font-size="5">Elastic Channel</text>
            <path class="stroke" d="M100,62 L90,180 L82,340 L118,345 L125,180 L135,62 Z"/>
            <rect class="stroke" x="78" y="328" width="44" height="18"/>
            <line class="stroke-thin" x1="78" y1="334" x2="122" y2="334"/>
            <text x="100" y="358" text-anchor="middle" font-size="5">Ankle Casing</text>
            <circle class="stroke-thin" cx="150" cy="50" r="3"/>
            <line class="stroke-thin" x1="150" y1="50" x2="150" y2="62"/>
          </g>
          ${pom("O", 250, 40, 250, 345, 258, 200, { rotate: "90 258 200" })}
          ${pom("P", 60, 40, 60, 62, 48, 54, { anchor: "end" })}
        </svg>`;

const SVG_PLEAT_TROUSER = `<svg viewBox="0 0 640 400" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(20,0)">
          <rect class="stroke" x="120" y="28" width="200" height="16"/>
          <line class="stroke-thin" x1="120" y1="36" x2="320" y2="36"/>
          <path class="stroke" d="M120,44 L108,100 L95,200 L88,360 L148,362 L155,200 L162,100 L170,44 Z"/>
          <path class="stroke" d="M270,44 L282,100 L295,200 L302,360 L242,362 L235,200 L228,100 L220,44 Z"/>
          <line class="stroke-gray" x1="220" y1="44" x2="220" y2="362"/>
          <path class="stroke-thin" d="M170,44 L158,100 L152,180"/>
          <path class="stroke-thin" d="M182,44 L170,100 L164,180"/>
          <path class="stroke-thin" d="M258,44 L270,100 L276,180"/>
          <path class="stroke-thin" d="M246,44 L258,100 L264,180"/>
          <line class="stroke-dot" x1="118" y1="100" x2="118" y2="362"/>
          <line class="stroke-dot" x1="322" y1="100" x2="322" y2="362"/>
          <line class="stroke-dash" x1="118" y1="180" x2="118" y2="362"/>
          <line class="stroke-dash" x1="322" y1="180" x2="322" y2="362"/>
          <line class="stroke" x1="88" y1="362" x2="148" y2="362" stroke-width="1"/>
          <line class="stroke" x1="242" y1="362" x2="302" y2="362" stroke-width="1"/>
          <rect class="stroke-thin" x="135" y="24" width="6" height="10"/>
          <rect class="stroke-thin" x="175" y="24" width="6" height="10"/>
          <rect class="stroke-thin" x="215" y="24" width="6" height="10"/>
          <rect class="stroke-thin" x="255" y="24" width="6" height="10"/>
          <rect class="stroke-thin" x="295" y="24" width="6" height="10"/>
        </g>
        ${pom("Q", 140, 18, 340, 18, 240, 12)}
        <g class="pom-callout"><line class="pom-line" x1="192" y1="44" x2="170" y2="100"/><text x="188" y="80" font-size="5">R</text></g>
        ${pom("S", 95, 200, 305, 200, 200, 194)}
        ${pom("T", 220, 100, 220, 362, 228, 240, { anchor: "start" })}
        ${pom("U", 88, 352, 148, 352, 118, 346)}
        <g class="pom-callout">
          <line class="pom-line" x1="118" y1="362" x2="118" y2="378"/>
          <line class="pom-line" x1="148" y1="362" x2="148" y2="378"/>
          <line class="pom-line" x1="118" y1="378" x2="148" y2="378"/>
          <text x="133" y="392" text-anchor="middle" font-size="5">V</text>
        </g>
      </svg>`;

const SVG_DENIM_FRONT = `<svg viewBox="0 0 320 420" xmlns="http://www.w3.org/2000/svg">
          <g id="denim-front-outline">
            <rect class="stroke" x="60" y="28" width="200" height="14"/>
            <path class="stroke" d="M60,42 L52,100 L48,200 L45,380 L115,382 L120,200 L125,100 L130,42 Z"/>
            <path class="stroke" d="M260,42 L268,100 L272,200 L275,380 L205,382 L200,200 L195,100 L190,42 Z"/>
            <line class="stroke-thin" x1="160" y1="42" x2="160" y2="140"/>
            <path class="stroke-thin" d="M160,42 L175,55 L160,68 L145,55 Z"/>
            <path class="stroke" d="M52,100 Q80,108 95,130 Q100,145 98,165 Q96,180 88,195 L72,200 L52,100 Z"/>
            <path class="stroke-thin" d="M60,108 Q78,114 88,128 Q92,140 90,155 L75,195"/>
            <path class="stroke" d="M268,100 Q240,108 225,130 Q220,145 222,165 Q224,180 232,195 L248,200 L268,100 Z"/>
            <path class="stroke-thin" d="M260,108 Q242,114 232,128 Q228,140 230,155 L245,195"/>
            <path class="stroke-thin" d="M175,55 L210,58 L208,82 L173,78 Z"/>
            <circle class="stroke-thin" cx="72" cy="200" r="2"/>
            <circle class="stroke-thin" cx="248" cy="200" r="2"/>
            <line class="stroke-dash" x1="48" y1="240" x2="115" y2="240"/>
            <line class="stroke-dot" x1="48" y1="248" x2="115" y2="248"/>
            <line class="stroke-dash" x1="205" y1="240" x2="272" y2="240"/>
            <path class="construction" d="M48,240 Q82,228 115,240"/>
            <path class="construction" d="M205,240 Q238,228 272,240"/>
            <line class="stroke" x1="45" y1="382" x2="115" y2="382" stroke-width="1"/>
            <line class="stroke" x1="205" y1="382" x2="275" y2="382" stroke-width="1"/>
          </g>
          <text x="8" y="130" font-size="5">A</text>
          <text x="8" y="165" font-size="5">B</text>
          <text x="8" y="210" font-size="5">C</text>
          ${pom("W", 60, 18, 260, 18, 160, 12)}
          ${pom("X", 290, 42, 290, 100, 296, 72, { anchor: "start" })}
        </svg>`;

const SVG_DENIM_BACK = `<svg viewBox="0 0 320 420" xmlns="http://www.w3.org/2000/svg">
          <g id="denim-back-outline">
            <rect class="stroke" x="60" y="28" width="200" height="14"/>
            <path class="stroke" d="M60,42 L52,100 L48,200 L45,380 L115,382 L120,200 L125,100 L130,42 Z"/>
            <path class="stroke" d="M260,42 L268,100 L272,200 L275,380 L205,382 L200,200 L195,100 L190,42 Z"/>
            <path class="stroke-thin" d="M60,42 L90,72 L160,78 L230,72 L260,42"/>
            <path class="stroke" d="M75,120 L105,118 L108,175 L78,178 Z"/>
            <path class="stroke" d="M215,120 L245,118 L242,175 L212,178 Z"/>
            <line class="stroke-gray" x1="160" y1="42" x2="160" y2="382"/>
            <line class="stroke-dash" x1="48" y1="245" x2="115" y2="245"/>
            <line class="stroke-dash" x1="205" y1="245" x2="272" y2="245"/>
            <path class="construction" d="M48,245 Q82,258 115,245"/>
            <path class="construction" d="M205,245 Q238,258 272,245"/>
            <line class="stroke" x1="45" y1="382" x2="115" y2="382" stroke-width="1"/>
            <line class="stroke" x1="205" y1="382" x2="275" y2="382" stroke-width="1"/>
          </g>
          ${pom("Y", 48, 200, 272, 200, 160, 194)}
          ${pom("Z", 160, 100, 160, 382, 168, 250, { anchor: "start" })}
        </svg>`;

const SVG_ZIPPER = `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
        <rect class="stroke" x="88" y="10" width="24" height="100"/>
        <line class="stroke-thin" x1="94" y1="10" x2="94" y2="110"/>
        <line class="stroke-thin" x1="106" y1="10" x2="106" y2="110"/>
        <rect class="stroke-thin" x="86" y="4" width="28" height="8"/>
        <path class="stroke" d="M88,110 L100,118 L112,110"/>
        <text x="20" y="60" font-size="5">Tape</text>
        <text x="130" y="60" font-size="5">Slider</text>
        <line class="stroke-gray" x1="60" y1="30" x2="88" y2="30"/>
        <line class="stroke-gray" x1="112" y1="30" x2="160" y2="30"/>
      </svg>`;

const SVG_SEAM_MAP = `<svg viewBox="0 0 400 360" xmlns="http://www.w3.org/2000/svg">
        <path class="stroke" d="M120,60 L100,70 L90,120 L88,300 L220,300 L222,120 L210,70 L190,60 L170,55 L155,52 L145,52 L130,55 Z"/>
        <line class="stroke-dash" x1="100" y1="70" x2="210" y2="70"/>
        <text x="155" y="66" text-anchor="middle" font-size="5">Shoulder</text>
        <line class="stroke-dash" x1="90" y1="120" x2="88" y2="300"/>
        <text x="72" y="200" transform="rotate(-90 72 200)" font-size="5">Side</text>
        <line class="stroke-dash" x1="222" y1="120" x2="220" y2="300"/>
        <line class="stroke-gray" x1="155" y1="52" x2="155" y2="300"/>
        <text x="165" y="180" font-size="5">CF</text>
        <line class="stroke" x1="88" y1="300" x2="220" y2="300" stroke-width="1"/>
        <text x="155" y="318" text-anchor="middle" font-size="5">Hem</text>
        <rect class="stroke-thin" x="86" y="115" width="10" height="20"/>
        <rect class="stroke-thin" x="212" y="115" width="10" height="20"/>
        <text x="91" y="108" font-size="5">Armhole</text>
        <circle class="stroke-thin" cx="155" cy="140" r="18"/>
        <text x="155" y="144" text-anchor="middle" font-size="5">Label</text>
      </svg>`;

const SVG_STITCH_ICONS = `<svg viewBox="0 0 520 80" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(10,10)">
          <line class="stroke" x1="0" y1="30" x2="100" y2="30"/>
          <line class="stroke-thin" x1="0" y1="38" x2="100" y2="38"/>
          <text x="50" y="58" text-anchor="middle" font-size="5">Flat-Fell</text>
        </g>
        <g transform="translate(140,10)">
          <path class="stroke-thin" d="M0,30 Q8,22 16,30 Q24,38 32,30 Q40,22 48,30 Q56,38 64,30 Q72,22 80,30"/>
          <text x="40" y="58" text-anchor="middle" font-size="5">Overlock</text>
        </g>
        <g transform="translate(270,10)">
          <line class="stroke" x1="0" y1="26" x2="100" y2="26"/>
          <line class="stroke-thin" x1="0" y1="34" x2="100" y2="34"/>
          <line class="stroke-thin" x1="0" y1="42" x2="100" y2="42"/>
          <text x="50" y="58" text-anchor="middle" font-size="5">Coverstitch</text>
        </g>
        <g transform="translate(400,10)">
          <line class="stroke" x1="20" y1="10" x2="20" y2="50"/>
          <line class="stroke" x1="28" y1="10" x2="28" y2="50"/>
          <line class="stroke" x1="36" y1="10" x2="36" y2="50"/>
          <text x="28" y="68" text-anchor="middle" font-size="5">Bartack</text>
        </g>
      </svg>`;

const SVG_LABEL_PLACEMENT = `<svg viewBox="0 0 320 380" xmlns="http://www.w3.org/2000/svg">
        <path class="stroke" d="M80,80 L65,90 L58,140 L55,320 L185,320 L188,140 L178,90 L162,80 L145,76 L128,74 L112,74 L95,76 Z"/>
        <line class="stroke-gray" x1="128" y1="74" x2="128" y2="320"/>
        <rect class="stroke-thin fill-white" x="108" y="130" width="40" height="14"/>
        <text x="128" y="140" text-anchor="middle" font-size="5">Main</text>
        <line class="stroke-gray" x1="148" y1="137" x2="200" y2="120"/>
        <rect class="stroke-thin fill-white" x="195" y="108" width="36" height="12"/>
        <text x="213" y="117" text-anchor="middle" font-size="5">Size</text>
        <rect class="stroke-thin fill-white" x="100" y="200" width="56" height="20"/>
        <text x="128" y="213" text-anchor="middle" font-size="5">Care</text>
        <line class="stroke-gray" x1="156" y1="210" x2="220" y2="240"/>
        <circle class="stroke-thin" cx="250" cy="60" r="14"/>
        <text x="250" y="64" text-anchor="middle" font-size="5">Tag</text>
        <line class="stroke-gray" x1="236" y1="68" x2="175" y2="85"/>
      </svg>`;

const SVG_PACKAGING = `<svg viewBox="0 0 640 200" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(20,20)">
          <rect class="stroke" x="0" y="20" width="80" height="120" rx="2"/>
          <line class="stroke-thin" x1="0" y1="50" x2="80" y2="50"/>
          <text x="40" y="12" text-anchor="middle" font-size="5">Polybag</text>
          <text x="40" y="155" text-anchor="middle" font-size="5">Garment Inside</text>
        </g>
        <g transform="translate(140,20)">
          <path class="stroke-thin" d="M10,30 L70,30 L75,140 L5,140 Z"/>
          <text x="40" y="12" text-anchor="middle" font-size="5">Tissue</text>
        </g>
        <g transform="translate(260,10)">
          <path class="stroke" d="M0,60 L20,40 L120,40 L140,60 L140,150 L0,150 Z"/>
          <line class="stroke-thin" x1="0" y1="60" x2="140" y2="60"/>
          <line class="stroke-thin" x1="70" y1="40" x2="70" y2="60"/>
          <text x="70" y="28" text-anchor="middle" font-size="5">Carton</text>
          <text x="70" y="100" text-anchor="middle" font-size="5">Folded Unit</text>
        </g>
        <g transform="translate(440,30)">
          <rect class="stroke-thin" x="0" y="0" width="160" height="100"/>
          <text x="80" y="20" text-anchor="middle" font-size="5">Placement Notes</text>
          <line class="stroke-gray" x1="10" y1="35" x2="150" y2="35"/>
          <line class="stroke-gray" x1="10" y1="50" x2="150" y2="50"/>
          <line class="stroke-gray" x1="10" y1="65" x2="150" y2="65"/>
          <line class="stroke-gray" x1="10" y1="80" x2="150" y2="80"/>
        </g>
      </svg>`;

// ─── CSS ─────────────────────────────────────────────────────────────────────

const CSS = `
  @page { size: A4 portrait; margin: 0; }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --ink: #000000;
    --paper: #FFFFFF;
    --line: #000000;
    --grid: #C8C8C8;
    --grid-faint: #E8E8E8;
    --font-mono: "JetBrains Mono", "Courier New", Courier, monospace;
    --a4-w: 210mm;
    --a4-h: 297mm;
    --pad: 12mm;
    --rule: 0.25pt;
    --rule-med: 0.5pt;
    --rule-heavy: 1pt;
  }
  html { background: #B0B0B0; }
  body {
    font-family: var(--font-mono);
    font-size: 7pt;
    line-height: 1.35;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--ink);
    -webkit-font-smoothing: antialiased;
  }
  .sheet {
    width: var(--a4-w);
    min-height: var(--a4-h);
    margin: 8mm auto;
    background: var(--paper);
    position: relative;
    overflow: hidden;
    page-break-after: always;
    box-shadow: 0 0 0 0.25pt var(--grid), 0 2mm 8mm rgba(0,0,0,0.08);
  }
  @media print {
    html { background: none; }
    .sheet { margin: 0; box-shadow: none; }
  }
  .frame {
    position: absolute;
    inset: 8mm;
    border: var(--rule-heavy) solid var(--line);
    pointer-events: none;
  }
  .frame-inner {
    position: absolute;
    inset: 9.5mm;
    border: var(--rule) solid var(--grid);
    pointer-events: none;
  }
  .hdr {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: end;
    padding: var(--pad) var(--pad) 6mm;
    border-bottom: var(--rule-heavy) solid var(--line);
    gap: 4mm;
  }
  .hdr__brand { font-size: 9pt; font-weight: 500; letter-spacing: 0.32em; }
  .hdr__sub { font-size: 6pt; letter-spacing: 0.22em; color: var(--ink); margin-top: 1.5mm; }
  .hdr__center { text-align: center; }
  .hdr__doc { font-size: 7pt; letter-spacing: 0.28em; }
  .hdr__meta { text-align: right; font-size: 6pt; letter-spacing: 0.16em; line-height: 1.6; }
  .hdr__meta span { display: block; }
  .block-title {
    padding: 5mm var(--pad) 3mm;
    border-bottom: var(--rule) solid var(--grid);
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
  .block-title h2 { font-size: 7pt; font-weight: 500; letter-spacing: 0.24em; }
  .block-title .ref { font-size: 6pt; letter-spacing: 0.18em; color: var(--ink); }
  .canvas {
    padding: 4mm var(--pad) 14mm;
    display: flex;
    flex-direction: column;
    gap: 4mm;
  }
  .canvas-row { display: grid; gap: 4mm; align-items: start; }
  .canvas-row--2 { grid-template-columns: 1fr 1fr; }
  .canvas-row--3 { grid-template-columns: 1fr 1fr 1fr; }
  .fig {
    border: var(--rule) solid var(--grid);
    background: var(--paper);
    position: relative;
  }
  .fig__label {
    position: absolute;
    top: 0; left: 0; right: 0;
    padding: 2mm 3mm;
    border-bottom: var(--rule) solid var(--grid-faint);
    font-size: 5.5pt;
    letter-spacing: 0.2em;
    background: var(--paper);
    z-index: 2;
  }
  .fig svg { display: block; width: 100%; height: auto; }
  .grid-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 5.5pt;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .grid-table th, .grid-table td {
    border: var(--rule) solid var(--line);
    padding: 1.8mm 2.5mm;
    text-align: left;
    vertical-align: middle;
  }
  .grid-table th {
    background: var(--paper);
    font-weight: 500;
    letter-spacing: 0.16em;
    border-bottom: var(--rule-heavy) solid var(--line);
  }
  .grid-table td.val { text-align: center; font-variant-numeric: tabular-nums; letter-spacing: 0.06em; min-width: 14mm; }
  .grid-table td.dim { color: var(--ink); }
  .grid-table tr.subhead td {
    background: var(--grid-faint);
    font-weight: 500;
    letter-spacing: 0.18em;
    border-top: var(--rule-heavy) solid var(--line);
  }
  .grid-table .pom-id { width: 10mm; text-align: center; font-weight: 500; }
  .grid-table .chk { width: 8mm; text-align: center; font-size: 8pt; }
  .ftr {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    padding: 3mm var(--pad);
    border-top: var(--rule) solid var(--grid);
    display: flex;
    justify-content: space-between;
    font-size: 5.5pt;
    letter-spacing: 0.14em;
  }
  .ftr__legal { max-width: 55%; line-height: 1.5; }
  .legend {
    display: flex; flex-wrap: wrap; gap: 4mm 8mm;
    padding: 2mm 0 0; font-size: 5pt; letter-spacing: 0.12em;
  }
  .legend__item { display: flex; align-items: center; gap: 2mm; }
  .legend__swatch { width: 8mm; height: 0; border-top: var(--rule-med) solid var(--line); }
  .legend__swatch--dash { border-top-style: dashed; }
  .legend__swatch--dot { border-top-style: dotted; }
  .legend__swatch--gray { border-top-color: var(--grid); }
  .cover-brand {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    min-height: 140mm; text-align: center; gap: 8mm;
  }
  .cover-brand__logo { font-size: 28pt; font-weight: 500; letter-spacing: 0.48em; }
  .cover-brand__tag { font-size: 7pt; letter-spacing: 0.32em; }
  .cover-fields {
    display: grid; grid-template-columns: 1fr 1fr; gap: 6mm 12mm;
    max-width: 140mm; margin: 0 auto; font-size: 6.5pt;
  }
  .cover-fields dt { letter-spacing: 0.2em; margin-bottom: 1mm; }
  .cover-fields dd {
    border-bottom: var(--rule) solid var(--line);
    min-height: 8mm; letter-spacing: 0.14em;
  }
  .field-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 4mm 8mm; font-size: 6pt;
  }
  .field { display: flex; flex-direction: column; gap: 1mm; }
  .field__label { letter-spacing: 0.18em; }
  .field__value {
    border-bottom: var(--rule) solid var(--grid);
    min-height: 7mm; letter-spacing: 0.12em;
  }
  .swatch {
    width: 100%; aspect-ratio: 1;
    border: var(--rule) solid var(--line);
    background: var(--grid-faint);
    display: flex; align-items: flex-end; justify-content: center;
    padding-bottom: 3mm; font-size: 5pt; letter-spacing: 0.16em;
  }
  .colorway-col { display: flex; flex-direction: column; gap: 3mm; }
  svg text {
    font-family: var(--font-mono);
    font-size: 6px; letter-spacing: 0.12em;
    text-transform: uppercase; fill: var(--ink);
  }
  svg .stroke { fill: none; stroke: #000; stroke-width: 0.75; stroke-linecap: square; stroke-linejoin: miter; }
  svg .stroke-thin { fill: none; stroke: #000; stroke-width: 0.4; }
  svg .stroke-gray { fill: none; stroke: #C8C8C8; stroke-width: 0.35; }
  svg .stroke-dash { fill: none; stroke: #000; stroke-width: 0.4; stroke-dasharray: 3 2; }
  svg .stroke-dot { fill: none; stroke: #000; stroke-width: 0.35; stroke-dasharray: 1 2; }
  svg .fill-white { fill: #FFF; }
  svg .pom-line { fill: none; stroke: #000; stroke-width: 0.35; }
  svg .pom-cap { fill: #000; }
  svg .grade-fill { fill: none; stroke: #000; stroke-width: 0.85; }
  svg .grade-inner { fill: none; stroke: #000; stroke-width: 0.45; }
  svg .construction { fill: none; stroke: #C8C8C8; stroke-width: 0.3; stroke-dasharray: 2 2; }
`;

// ─── Sheet Builders ──────────────────────────────────────────────────────────

function buildSheet01() {
  return sheet("cover", 1, `
  ${hdr("6FOOT STUDIO", "Manchester · Engineered Tall Blocks", "Master Tech Pack", "A4 Template", [
    "Doc: TP-MASTER",
    "Rev: ___",
    "Date: __ / __ / ____",
  ])}
  ${blockTitle(1, "Cover", "COV-001")}
  <div class="canvas">
    <div class="cover-brand">
      <div class="cover-brand__logo">6FOOT</div>
      <div class="cover-brand__tag">Studio · Engineered Tall Blocks</div>
    </div>
    <dl class="cover-fields">
      <dt>Style Name</dt><dd></dd>
      <dt>Style Number</dt><dd></dd>
      <dt>Season</dt><dd></dd>
      <dt>Revision</dt><dd></dd>
      <dt>Designer</dt><dd></dd>
      <dt>Date Issued</dt><dd></dd>
    </dl>
  </div>`);
}

function buildSheet02() {
  return sheet("style-overview", 2, `
  ${hdr("6FOOT STUDIO", "Development Tracker", "Style Overview", "Dev Status", [
    "Style: ________________",
    "Block: B__",
    "Status: __________",
  ])}
  ${blockTitle(2, "Style Overview — Development Tracker", "DEV-001")}
  <div class="canvas">
    ${fieldGrid([
      ["Designer", ""],
      ["Pattern Maker", ""],
      ["Factory", ""],
      ["Factory Contact", ""],
      ["Sample Stage", "Proto / SMS / PP / TOP"],
      ["Target Delivery", ""],
      ["Fit Session Date", ""],
      ["Approval Date", ""],
      ["Buyer / Brand", ""],
      ["Category", ""],
      ["Gender", ""],
      ["Block Assignment", "B1 / B2 / B3"],
    ])}
    ${table("grid-dev-milestones", ["Milestone", "Owner", "Due Date", "Status", "Notes"], [
      ["Design Handoff", "", "", "", ""],
      ["Proto Sample", "", "", "", ""],
      ["Fit Review", "", "", "", ""],
      ["SMS Approval", "", "", "", ""],
      ["PP Sample", "", "", "", ""],
      ["Bulk TOP", "", "", "", ""],
    ])}
  </div>`);
}

function buildSheet03() {
  return sheet("height-grading", 3, `
  ${hdr("6FOOT STUDIO", "Engineered Tall Blocks", "Height Grading", "Silhouette Chart", [
    "Base: Block 1 · 6′0″",
    "Grade: B1 → B3",
    "Scale: N/A",
  ])}
  ${blockTitle(3, "Height Grading — Block Silhouettes", "GRD-HEIGHT-001")}
  <div class="canvas">
    ${fig("fig-height-grading", "Block 1 · 6′0″ · Block 2 · 6′3″ · Block 3 · 6′6″", SVG_HEIGHT_GRADING)}
    ${table("grid-height-grading", ["Block", "Height", "Crown", "Shoulder", "Hip", "Inseam Δ", "Sleeve Δ", "Body Δ"], [
      ["B1", "6′0″", "", "", "", "", "", ""],
      ["B2", "6′3″", "", "", "", "", "", ""],
      ["B3", "6′6″", "", "", "", "", "", ""],
    ])}
    ${legend([["", "Outline"], ["gray", "Floor Line"]])}
  </div>`);
}

function buildSheet04() {
  const cw = (n, name) => `
      <div class="colorway-col">
        <div class="swatch">CW ${n}</div>
        <span class="field__label">${name}</span>
        <span class="field__value"></span>
        <span class="field__label">Pantone / Lab</span>
        <span class="field__value"></span>
        <span class="field__label">Supplier Ref</span>
        <span class="field__value"></span>
      </div>`;
  return sheet("colorway-matrix", 4, `
  ${hdr("6FOOT STUDIO", "Color Development", "Colorway Matrix", "Season Palette", [
    "Style: ________________",
    "Season: ________",
    "CW Count: 3",
  ])}
  ${blockTitle(4, "Colorway Matrix", "COL-001")}
  <div class="canvas">
    <div class="canvas-row canvas-row--3">
      ${cw("01", "Colorway Name")}
      ${cw("02", "Colorway Name")}
      ${cw("03", "Colorway Name")}
    </div>
    ${table("grid-colorway-matrix", ["Component", "CW 01", "CW 02", "CW 03", "Notes"], [
      ["Shell / Body", "", "", "", ""],
      ["Rib / Cuff", "", "", "", ""],
      ["Lining", "", "", "", ""],
      ["Trim / Tape", "", "", "", ""],
      ["Thread", "", "", "", ""],
      ["Zipper Tape", "", "", "", ""],
      ["Hardware Finish", "", "", "", ""],
      ["Label", "", "", "", ""],
    ])}
  </div>`);
}

function buildSheet05() {
  return sheet("fabric-spec", 5, `
  ${hdr("6FOOT STUDIO", "Material Specification", "Fabric Specification", "Shell + Trims", [
    "Style: ________________",
    "Mill: __________",
    "Status: Pending",
  ])}
  ${blockTitle(5, "Fabric Specification", "FAB-001")}
  <div class="canvas">
    ${table("grid-fabric-spec", ["Component", "Fiber Content", "Weight", "Width", "Finish", "Supplier", "Article #", "CW"], [
      { _subhead: "Shell" },
      ["Main Body", "", "", "", "", "", "", ""],
      { _subhead: "Rib" },
      ["Neck / Cuff / Hem Rib", "", "", "", "", "", "", ""],
      { _subhead: "Lining" },
      ["Body Lining", "", "", "", "", "", "", ""],
      ["Sleeve Lining", "", "", "", "", "", "", ""],
      { _subhead: "Interlining" },
      ["Fusing / Interlining", "", "", "", "", "", "", ""],
      { _subhead: "Trim" },
      ["Drawcord", "", "", "", "", "", "", ""],
      ["Elastic", "", "", "", "", "", "", ""],
      ["Tape / Binding", "", "", "", "", "", "", ""],
    ])}
  </div>`);
}

function buildSheet06() {
  return sheet("bill-of-materials", 6, `
  ${hdr("6FOOT STUDIO", "Full BOM", "Bill of Materials", "Per Garment", [
    "Style: ________________",
    "Size: Block Sample",
    "UOM: EA",
  ])}
  ${blockTitle(6, "Bill of Materials", "BOM-001")}
  <div class="canvas">
    ${table("grid-bom", ["#", "Component", "Description", "Qty", "UOM", "Supplier", "Article", "CW", "Placement"], [
      ["1", "Fabric", "Shell — Main Body", "", "M", "", "", "", ""],
      ["2", "Fabric", "Rib — Cuff / Hem", "", "M", "", "", "", ""],
      ["3", "Fabric", "Lining", "", "M", "", "", "", ""],
      ["4", "Interlining", "Fusible", "", "M", "", "", "", ""],
      ["5", "Thread", "Main Seam", "", "SPOOL", "", "", "", ""],
      ["6", "Thread", "Topstitch", "", "SPOOL", "", "", "", ""],
      ["7", "Zipper", "CF / Pocket", "", "EA", "", "", "", ""],
      ["8", "Elastic", "Waist / Cuff", "", "M", "", "", "", ""],
      ["9", "Drawcord", "Waist", "", "M", "", "", "", ""],
      ["10", "Label", "Main Brand", "", "EA", "", "", "", ""],
      ["11", "Label", "Size / Care", "", "EA", "", "", "", ""],
      ["12", "Hang Tag", "Brand Tag", "", "EA", "", "", "", ""],
      ["13", "Packaging", "Polybag", "", "EA", "", "", "", ""],
      ["14", "Packaging", "Carton", "", "EA", "", "", "", ""],
    ])}
  </div>`);
}

function buildSheet07() {
  return sheet("trims-hardware-zippers", 7, `
  ${hdr("6FOOT STUDIO", "Trims & Hardware", "Trims · Hardware · Zippers", "Component Detail", [
    "Style: ________________",
    "Finish: __________",
    "Supplier: ________",
  ])}
  ${blockTitle(7, "Trims · Hardware · Zippers", "TRM-001")}
  <div class="canvas">
    <div class="canvas-row canvas-row--2">
      ${fig("fig-zipper-diagram", "Zipper Assembly — Schematic", SVG_ZIPPER)}
      <div>
        ${table("grid-trims-summary", ["Item", "Spec", "Qty", "Supplier", "Ref"], [
          ["Zipper — CF", "", "", "", ""],
          ["Zipper — Pocket", "", "", "", ""],
          ["Snap", "", "", "", ""],
          ["Rivet", "", "", "", ""],
          ["Button", "", "", "", ""],
          ["Eyelet", "", "", "", ""],
          ["Cord End", "", "", "", ""],
          ["Toggle", "", "", "", ""],
        ])}
      </div>
    </div>
    ${table("grid-trims-detail", ["Component", "Type", "Size", "Color / Finish", "Placement", "Supplier", "Article", "Notes"], [
      ["Zipper", "", "", "", "", "", "", ""],
      ["Slider", "", "", "", "", "", "", ""],
      ["Puller", "", "", "", "", "", "", ""],
      ["Snap", "", "", "", "", "", "", ""],
      ["Rivet", "", "", "", "", "", "", ""],
      ["Button", "", "", "", "", "", "", ""],
      ["Grommet", "", "", "", "", "", "", ""],
    ])}
  </div>`);
}

function buildSheet08() {
  const hoodiePomRows = [
    pomRow("A", "1/2 Chest — Below Armhole"),
    pomRow("B", "Body Length — CF Neck to Hem"),
    pomRow("C", "1/2 Hem — Relaxed"),
    pomRow("D", "Hood Height — Crown to Neck"),
    pomRow("E", "Hood Opening — Curved"),
    pomRow("F", "Kangaroo Pocket Width"),
    pomRow("G", "1/2 Shoulder — Seam to Seam"),
    pomRow("H", "Sleeve Length — Shoulder to Cuff"),
    pomRow("I", "1/2 Cuff Opening"),
    pomRow("J", "CB Neck Drop"),
  ];
  return sheet("hoodie-flats", 8, `
  ${hdr("6FOOT STUDIO", "240GSM · Heavyweight Fleece", "Drop-Shoulder Hoodie", "Technical Flat", [
    "Style: ________________",
    "Block: B__",
    "Scale: 1:4",
  ])}
  ${blockTitle(8, "Hoodie Flats — Front / Back", "FLAT-HDY-001")}
  <div class="canvas">
    <div class="canvas-row canvas-row--2">
      ${fig("fig-hoodie-front", "Front Flat · POM Callouts", SVG_HOODIE_FRONT)}
      ${fig("fig-hoodie-back", "Back Flat · POM Callouts", SVG_HOODIE_BACK)}
    </div>
    ${table("grid-hoodie-pom", ["POM", "Description", "Tol ±", "B1", "B2", "B3", "Unit", "Method"], hoodiePomRows)}
  </div>`);
}

function buildSheet09() {
  const trkRows = [
    pomRow("K", "1/2 Waist — Relaxed"),
    pomRow("L", "Front Rise — Waist to Crotch"),
    pomRow("M", "Inseam — Crotch to Hem"),
    pomRow("N", "1/2 Ankle Opening — Relaxed"),
    pomRow("O", "Outseam — Waist to Hem"),
    pomRow("P", "Waist Casing Depth"),
  ];
  return sheet("tracksuit-bottom", 9, `
  ${hdr("6FOOT STUDIO", "Loopback Fleece", "Tracksuit Bottom", "Technical Flat", [
    "Style: ________________",
    "Block: B__",
    "Scale: 1:4",
  ])}
  ${blockTitle(9, "Tracksuit Bottom — Front / Side", "FLAT-TRK-001")}
  <div class="canvas">
    <div class="canvas-row canvas-row--2">
      ${fig("fig-trk-front", "Front Flat · Waist + Ankle Casing", SVG_TRK_FRONT)}
      ${fig("fig-trk-side", "Side Flat · Casing Detail", SVG_TRK_SIDE)}
    </div>
    ${table("grid-trk-pom", ["POM", "Description", "Tol ±", "B1", "B2", "B3", "Unit", "Notes"], trkRows)}
  </div>`);
}

function buildSheet10() {
  const pleatRows = [
    pomRow("Q", "1/2 Waist — Finished"),
    pomRow("R", "Forward Pleat Depth"),
    pomRow("S", "1/2 Thigh — Below Crotch"),
    pomRow("T", "Inseam — Crotch to Hem"),
    pomRow("U", "1/2 Hem — Finished"),
    pomRow("V", "Crease Offset — Inseam to Press"),
  ];
  return sheet("pleated-trouser", 10, `
  ${hdr("6FOOT STUDIO", "Tailored Wool Blend", "Linear Pleated Trouser", "Technical Flat", [
    "Style: ________________",
    "Block: B__",
    "Scale: 1:4",
  ])}
  ${blockTitle(10, "Pleated Trouser — Front Flat", "FLAT-TRS-001")}
  <div class="canvas">
    ${fig("fig-pleat-trouser", "Front · Single Forward Pleat + Press Guides", SVG_PLEAT_TROUSER)}
    ${table("grid-pleat-pom", ["POM", "Description", "Tol ±", "B1", "B2", "B3", "Unit", "Construction"], pleatRows)}
    ${legend([["dot", "Press Guide"], ["dash", "Crease Line"], ["", "Pleat Fold"]])}
  </div>`);
}

function buildSheet11() {
  const denimRows = [
    { _subhead: "5-Pocket Curve Matrix" },
    ["—", "Front Pocket Curve A", "", "", "", "", "MM", "FL / FR"],
    ["—", "Front Pocket Curve B", "", "", "", "", "MM", "FL / FR"],
    ["—", "Front Pocket Curve C", "", "", "", "", "MM", "FL / FR"],
    ["—", "Back Patch Pocket Curve", "", "", "", "", "MM", "BL / BR"],
    { _subhead: "Shifted Knee Drop-Map" },
    ["—", "Knee Line Drop — Tall Block", "", "", "", "", "CM", "Tall Block"],
    ["—", "Knee Width — Below Crotch", "", "", "", "", "CM", "—"],
    { _subhead: "Primary POM" },
    pomRow("W", "1/2 Waist — Finished"),
    pomRow("X", "Front Rise"),
    pomRow("Y", "1/2 Hip — Below Waist"),
    pomRow("Z", "Inseam — Crotch to Hem"),
  ];
  return sheet("denim-5-pocket", 11, `
  ${hdr("6FOOT STUDIO", "Selvedge Denim", "Engineered Denim · 5-Pocket", "Technical Flat", [
    "Style: ________________",
    "Block: B__",
    "Scale: 1:4",
  ])}
  ${blockTitle(11, "Denim 5-Pocket — Front / Back", "FLAT-DNM-001")}
  <div class="canvas">
    <div class="canvas-row canvas-row--2">
      ${fig("fig-denim-front", "Front Flat · Pocket Matrix", SVG_DENIM_FRONT)}
      ${fig("fig-denim-back", "Back Flat · Yoke + Patch Pocket", SVG_DENIM_BACK)}
    </div>
    ${table("grid-denim-pom", ["POM", "Description", "Tol ±", "B1", "B2", "B3", "Unit", "Ref"], denimRows)}
    ${legend([["", "Pocket Outline"], ["dash", "Knee Line"], ["dot", "Knee Articulation"], ["gray", "Construction Guide"]])}
  </div>`);
}

function buildSheet12() {
  return sheet("construction-seam-map", 12, `
  ${hdr("6FOOT STUDIO", "Construction", "Seam Map", "Generic Garment", [
    "Style: ________________",
    "View: Front",
    "Rev: ___",
  ])}
  ${blockTitle(12, "Construction Seam Map", "CON-SEAM-001")}
  <div class="canvas">
    ${fig("fig-seam-map", "Seam Location Diagram — Generic Outline", SVG_SEAM_MAP)}
    ${table("grid-seam-map", ["Seam", "Type", "SPI", "Thread", "Needle", "Notes"], [
      ["Shoulder", "", "", "", "", ""],
      ["Armhole", "", "", "", "", ""],
      ["Side", "", "", "", "", ""],
      ["Inseam", "", "", "", "", ""],
      ["Outseam", "", "", "", "", ""],
      ["Rise", "", "", "", "", ""],
      ["Hem", "", "", "", "", ""],
      ["Hood", "", "", "", "", ""],
      ["Pocket", "", "", "", "", ""],
    ])}
  </div>`);
}

function buildSheet13() {
  return sheet("stitch-specification", 13, `
  ${hdr("6FOOT STUDIO", "Stitch Engineering", "Stitch Specification", "SPI · Thread · Needle", [
    "Style: ________________",
    "Machine: ________",
    "Rev: ___",
  ])}
  ${blockTitle(13, "Stitch Specification", "STI-001")}
  <div class="canvas">
    ${fig("fig-stitch-icons", "Seam Type Icons", SVG_STITCH_ICONS)}
    ${table("grid-stitch-spec", ["Seam", "Type", "SPI", "Thread", "Needle", "Stitch Width", "Notes"], [
      ["Main Seam", "Lockstitch", "", "", "", "", ""],
      ["Overlock Seam", "3-Thread OL", "", "", "", "", ""],
      ["Flat-Fell", "Flat-Fell", "", "", "", "", ""],
      ["Coverstitch Hem", "Coverstitch", "", "", "", "", ""],
      ["Topstitch", "Lockstitch", "", "", "", "", ""],
      ["Bartack", "Bartack", "", "", "", "", ""],
      ["Buttonhole", "BH", "", "", "", "", ""],
      ["Blind Hem", "Blindstitch", "", "", "", "", ""],
    ])}
  </div>`);
}

function buildSheet14() {
  return sheet("label-branding-placement", 14, `
  ${hdr("6FOOT STUDIO", "Branding", "Label Placement", "Main · Size · Care · Tag", [
    "Style: ________________",
    "Label Set: ______",
    "Rev: ___",
  ])}
  ${blockTitle(14, "Label & Branding Placement", "LBL-001")}
  <div class="canvas">
    <div class="canvas-row canvas-row--2">
      ${fig("fig-label-placement", "Garment — Label Position Callouts", SVG_LABEL_PLACEMENT)}
      <div>
        ${table("grid-label-spec", ["Label", "Type", "Size", "Position", "Attachment", "Supplier", "Artwork Ref"], [
          ["Main Brand", "", "", "CB Neck Interior", "", "", ""],
          ["Size Label", "", "", "Side Seam", "", "", ""],
          ["Care Label", "", "", "Side Seam / CB", "", "", ""],
          ["Hang Tag", "", "", "Garment Neck", "", "", ""],
          ["Barcode Sticker", "", "", "Polybag", "", "", ""],
        ])}
      </div>
    </div>
  </div>`);
}

function buildSheet15() {
  return sheet("packaging", 15, `
  ${hdr("6FOOT STUDIO", "Packaging", "Packaging Specification", "Polybag · Tissue · Carton", [
    "Style: ________________",
    "Market: ________",
    "Rev: ___",
  ])}
  ${blockTitle(15, "Packaging — Diagrams & Placement", "PKG-001")}
  <div class="canvas">
    ${fig("fig-packaging", "Packaging Assembly — Schematic", SVG_PACKAGING)}
    ${table("grid-packaging", ["Item", "Material", "Size", "Print", "Placement", "Qty", "Supplier", "Notes"], [
      ["Polybag", "", "", "", "Individual Unit", "", "", ""],
      ["Tissue Paper", "", "", "", "Wrap Garment", "", "", ""],
      ["Carton Box", "", "", "", "Bulk Ship", "", "", ""],
      ["Sticker — Size", "", "", "", "Polybag Exterior", "", "", ""],
      ["Sticker — Barcode", "", "", "", "Polybag Exterior", "", "", ""],
      ["Hanger", "", "", "", "Optional", "", "", ""],
    ])}
  </div>`);
}

function buildSheet16() {
  const pomLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const pomRows = pomLetters.map((letter) => [
    letter,
    "",
    "",
    "",
    "",
    "",
    "CM",
    "",
  ]);
  return sheet("pom-master-grid", 16, `
  ${hdr("6FOOT STUDIO", "Point of Measure", "POM Master Grid", "All Blocks", [
    "Style: ________________",
    "Block: B1 / B2 / B3",
    "Unit: CM",
  ])}
  ${blockTitle(16, "POM Master Grid — B1 / B2 / B3", "POM-MASTER-001")}
  <div class="canvas">
    ${table("grid-pom-master", ["POM", "Description", "Tol ±", "B1", "B2", "B3", "Unit", "Method"], pomRows)}
  </div>`);
}

function buildSheet17() {
  return sheet("qc-bulk-approval", 17, `
  ${hdr("6FOOT STUDIO", "Quality Control", "Bulk Approval Checklist", "Pre-Ship QC", [
    "Style: ________________",
    "PO: __________",
    "Inspector: ______",
  ])}
  ${blockTitle(17, "QC Bulk Approval Checklist", "QC-001")}
  <div class="canvas">
    ${checkboxTable("grid-qc-checklist", [
      "Fabric hand-feel matches approved standard",
      "Color consistency within batch — Delta E",
      "Print / embroidery placement and quality",
      "Stitch density (SPI) per specification",
      "Seam strength and construction integrity",
      "Label placement and content accuracy",
      "Trim and hardware specification match",
      "Zipper function and tape color match",
      "Measurement table — within tolerance",
      "Packaging and folding per spec",
      "Odor / chemical compliance",
      "Carton marking and barcode scan",
    ])}
    ${fieldGrid([
      ["Inspector Name", ""],
      ["Inspection Date", ""],
      ["Batch / Lot #", ""],
      ["Approval Status", "Approved / Rejected / Conditional"],
      ["Comments", ""],
    ])}
  </div>`);
}

function buildSheet18() {
  return sheet("revision-history", 18, `
  ${hdr("6FOOT STUDIO", "Document Control", "Revision History", "Version Log", [
    "Doc: TP-MASTER",
    "Current Rev: ___",
    "Owner: ________",
  ])}
  ${blockTitle(18, "Revision History", "REV-001")}
  <div class="canvas">
    ${table("grid-revision-history", ["Rev", "Date", "Author", "Description", "Approved By"], [
      ["001", "", "", "Initial issue", ""],
      ["002", "", "", "", ""],
      ["003", "", "", "", ""],
      ["004", "", "", "", ""],
      ["005", "", "", "", ""],
      ["006", "", "", "", ""],
      ["007", "", "", "", ""],
      ["008", "", "", "", ""],
    ])}
  </div>`);
}

// ─── Assemble & Write ──────────────────────────────────────────────────────

const SHEET_BUILDERS = [
  buildSheet01,
  buildSheet02,
  buildSheet03,
  buildSheet04,
  buildSheet05,
  buildSheet06,
  buildSheet07,
  buildSheet08,
  buildSheet09,
  buildSheet10,
  buildSheet11,
  buildSheet12,
  buildSheet13,
  buildSheet14,
  buildSheet15,
  buildSheet16,
  buildSheet17,
  buildSheet18,
];

const SHEET_IDS = [
  "sheet-01",
  "sheet-02",
  "sheet-03",
  "sheet-04",
  "sheet-05",
  "sheet-06",
  "sheet-07",
  "sheet-08",
  "sheet-09",
  "sheet-10",
  "sheet-11",
  "sheet-12",
  "sheet-13",
  "sheet-14",
  "sheet-15",
  "sheet-16",
  "sheet-17",
  "sheet-18",
];

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>6FOOT STUDIO — Master Tech Pack Template</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>${CSS}</style>
</head>
<body>

${SHEET_BUILDERS.map((fn) => fn()).join("\n\n")}

</body>
</html>
`;

writeFileSync(OUT, html, "utf8");

const lineCount = html.split("\n").length;
console.log(`✓ Wrote ${OUT}`);
console.log(`  Lines: ${lineCount}`);
console.log(`  Sheets: ${SHEET_IDS.length}`);
console.log(`  Sheet IDs: ${SHEET_IDS.join(", ")}`);
