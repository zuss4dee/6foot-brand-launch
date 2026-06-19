import type { Product } from "@/lib/products";
import {
  bottomHeightChart,
  formatCmMeasurement,
  formatInchMeasurement,
  formatStandingHeight,
  getHeightChart,
  getMeasurementPoints,
  heightAnchor,
  tallBlockNote,
  topHeightChart,
  type MeasurementPoint,
} from "@/lib/size-guide";

function MeasureLabel({ x, y, id }: { x: number; y: number; id: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r="7" className="fill-background stroke-foreground" strokeWidth="1" />
      <text
        x={x}
        y={y + 3.5}
        textAnchor="middle"
        className="fill-foreground text-[9px] font-medium"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {id}
      </text>
    </g>
  );
}

function TopMeasureDiagram() {
  return (
    <svg
      viewBox="0 0 320 420"
      role="img"
      aria-label="Diagram showing where to measure tops: shoulder, chest, body length, sleeve, and tall block zone"
      className="h-auto w-full max-w-sm"
    >
      <rect width="320" height="420" className="fill-foreground/[0.03]" />
      <path
        d="M160 36c-22 0-40 14-40 36v12c0 18 8 28 18 34l-8 42v148c0 10 8 18 18 18h24c10 0 18-8 18-18V160l-8-42c10-6 18-16 18-34V72c0-22-18-36-40-36z"
        className="fill-none stroke-foreground/25"
        strokeWidth="1.5"
      />
      <path
        d="M122 118h76M122 198h76"
        className="stroke-foreground/15"
        strokeWidth="1"
        strokeDasharray="4 4"
      />
      <rect x="122" y="118" width="76" height="80" className="fill-foreground/[0.06]" />
      <path d="M98 88h124" className="stroke-foreground" strokeWidth="1.25" markerStart="url(#dot)" markerEnd="url(#dot)" />
      <path d="M122 148h76" className="stroke-foreground" strokeWidth="1.25" />
      <path d="M160 72v262" className="stroke-foreground" strokeWidth="1.25" />
      <path d="M98 88v40" className="stroke-foreground" strokeWidth="1.25" />
      <MeasureLabel x={160} y={82} id="A" />
      <MeasureLabel x={198} y={148} id="B" />
      <MeasureLabel x={176} y={220} id="C" />
      <MeasureLabel x={88} y={112} id="D" />
      <MeasureLabel x={210} y={168} id="E" />
      <text x="16" y="24" className="fill-foreground/45 text-[9px]" style={{ fontFamily: "var(--font-mono)" }}>
        TOP MEASUREMENT MAP
      </text>
      <text x="16" y="404" className="fill-foreground/35 text-[8px]" style={{ fontFamily: "var(--font-mono)" }}>
        GARMENT FLAT · CM / IN
      </text>
    </svg>
  );
}

function BottomMeasureDiagram() {
  return (
    <svg
      viewBox="0 0 320 420"
      role="img"
      aria-label="Diagram showing where to measure bottoms: waist, inseam, rise, outseam, and thigh"
      className="h-auto w-full max-w-sm"
    >
      <rect width="320" height="420" className="fill-foreground/[0.03]" />
      <path
        d="M118 56h84v18c0 8-6 14-14 14h-56c-8 0-14-6-14-14V56zM110 88h100l-12 48v206c0 8-6 14-14 14h-12c-8 0-14-6-14-14V136l-12-48zM160 136v206M110 136h100"
        className="fill-none stroke-foreground/25"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M110 70h100" className="stroke-foreground" strokeWidth="1.25" />
      <path d="M160 170v172" className="stroke-foreground" strokeWidth="1.25" />
      <path d="M160 88v82" className="stroke-foreground" strokeWidth="1.25" />
      <path d="M110 88v290" className="stroke-foreground" strokeWidth="1.25" />
      <path d="M128 196h64" className="stroke-foreground" strokeWidth="1.25" />
      <MeasureLabel x={160} y={64} id="A" />
      <MeasureLabel x={172} y={250} id="B" />
      <MeasureLabel x={176} y={128} id="C" />
      <MeasureLabel x={92} y={220} id="D" />
      <MeasureLabel x={200} y={196} id="E" />
      <text x="16" y="24" className="fill-foreground/45 text-[9px]" style={{ fontFamily: "var(--font-mono)" }}>
        BOTTOM MEASUREMENT MAP
      </text>
      <text x="16" y="404" className="fill-foreground/35 text-[8px]" style={{ fontFamily: "var(--font-mono)" }}>
        GARMENT FLAT · CM / IN
      </text>
    </svg>
  );
}

function HeightScaleDiagram() {
  const marks = [
    { y: 340, label: `6'0"`, cm: "183" },
    { y: 280, label: `6'2"`, cm: "188" },
    { y: 220, label: `6'4"`, cm: "193" },
    { y: 160, label: `6'6"`, cm: "198" },
    { y: 100, label: `6'8"`, cm: "203" },
  ];

  return (
    <svg
      viewBox="0 0 320 380"
      role="img"
      aria-label="Height scale from 6 foot 0 to 6 foot 8 showing recommended size bands"
      className="h-auto w-full max-w-sm"
    >
      <rect width="320" height="380" className="fill-foreground/[0.03]" />
      <path
        d="M176 48c-18 0-32 12-32 30v10c0 14 6 22 14 26l-6 34v150c0 8 6 14 14 14h28c8 0 14-6 14-14V148l-6-34c8-4 14-12 14-26V78c0-18-14-30-32-30z"
        className="fill-none stroke-foreground/20"
        strokeWidth="1.25"
      />
      <line x1="56" y1="48" x2="56" y2="352" className="stroke-foreground/20" strokeWidth="1" />
      {marks.map((mark) => (
        <g key={mark.label}>
          <line x1="52" y1={mark.y} x2="68" y2={mark.y} className="stroke-foreground" strokeWidth="1" />
          <text x="24" y={mark.y + 3} className="fill-foreground text-[9px]" style={{ fontFamily: "var(--font-mono)" }}>
            {mark.label} · {mark.cm} cm
          </text>
        </g>
      ))}
      <rect x="228" y="300" width="72" height="36" className="fill-foreground/[0.06] stroke-foreground/15" />
      <text x="236" y="316" className="fill-foreground/50 text-[8px]" style={{ fontFamily: "var(--font-mono)" }}>
        SIZE M
      </text>
      <text x="236" y="328" className="fill-foreground text-[8px]" style={{ fontFamily: "var(--font-mono)" }}>
        from 6&apos;0&quot; · 183 cm
      </text>
      <text x="16" y="24" className="fill-foreground/45 text-[9px]" style={{ fontFamily: "var(--font-mono)" }}>
        HEIGHT CALIBRATION
      </text>
    </svg>
  );
}

function MeasurementLegend({ points }: { points: MeasurementPoint[] }) {
  return (
    <dl className="space-y-3">
      {points.map((point) => (
        <div key={point.id} className="grid grid-cols-[2rem_1fr] gap-3">
          <dt className="label text-foreground">{point.id}</dt>
          <dd>
            <p className="text-sm text-foreground">{point.label}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-foreground/55">{point.description}</p>
          </dd>
        </div>
      ))}
    </dl>
  );
}

function HeightSizeTable({ product }: { product: Product }) {
  const rows = getHeightChart(product);
  const isBottoms = product.category === "bottoms";

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-left text-[11px]">
        <thead>
          <tr className="border-b border-foreground/15">
            <th className="label pb-3 pr-4 text-foreground/45">Size</th>
            <th className="label pb-3 pr-4 text-foreground/45">Standing height</th>
            {isBottoms ? (
              <>
                <th className="label pb-3 pr-4 text-foreground/45">Waist</th>
                <th className="label pb-3 pr-4 text-foreground/45">Inseam</th>
                <th className="label pb-3 text-foreground/45">Length</th>
              </>
            ) : (
              <>
                <th className="label pb-3 pr-4 text-foreground/45">Shoulder</th>
                <th className="label pb-3 pr-4 text-foreground/45">Chest</th>
                <th className="label pb-3 text-foreground/45">Body length</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.size} className="border-b border-foreground/5">
              <td className="py-2.5 pr-4 font-medium text-foreground">{row.size}</td>
              <td className="py-2.5 pr-4 text-foreground/70">
                {formatStandingHeight(row.height, row.cm)}
              </td>
              {isBottoms ? (
                <>
                  <td className="py-2.5 pr-4 text-foreground/70">
                    {"waist" in row ? formatInchMeasurement(row.waist) : ""}
                  </td>
                  <td className="py-2.5 pr-4 text-foreground/70">
                    {"inseam" in row ? formatInchMeasurement(row.inseam) : ""}
                  </td>
                  <td className="py-2.5 text-foreground/70">
                    {"length" in row ? formatCmMeasurement(row.length) : ""}
                  </td>
                </>
              ) : (
                <>
                  <td className="py-2.5 pr-4 text-foreground/70">
                    {"shoulder" in row ? formatCmMeasurement(row.shoulder) : ""}
                  </td>
                  <td className="py-2.5 pr-4 text-foreground/70">
                    {"chest" in row ? formatCmMeasurement(row.chest) : ""}
                  </td>
                  <td className="py-2.5 text-foreground/70">
                    {"length" in row ? formatCmMeasurement(row.length) : ""}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type SizeGuideContentProps = {
  product: Product;
  compact?: boolean;
};

export function SizeGuideContent({ product, compact = false }: SizeGuideContentProps) {
  const points = getMeasurementPoints(product);
  const isBottoms = product.category === "bottoms";

  return (
    <div className={compact ? "space-y-8" : "space-y-12"}>
      <div>
        <p className="label text-foreground/45">6foot size guard</p>
        <h3 className="display mt-2 text-xl leading-tight md:text-2xl">Built from 6&apos;0&quot; upward.</h3>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground/65">{heightAnchor}</p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground/65">{tallBlockNote}</p>
      </div>

      <div className="grid gap-8 border-y border-foreground/10 py-8 md:grid-cols-2 md:gap-10">
        <div>
          {isBottoms ? <BottomMeasureDiagram /> : <TopMeasureDiagram />}
        </div>
        <div>
          <p className="label mb-4 text-foreground/45">How we measure</p>
          <MeasurementLegend points={points} />
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 md:gap-10">
        <div>
          <HeightScaleDiagram />
        </div>
        <div className="flex flex-col justify-center">
          <p className="label text-foreground/45">Height to size</p>
          <p className="mt-2 text-sm leading-relaxed text-foreground/65">
            Select your size by standing height first, then confirm garment measurements against a piece you
            already own. Hem should break clean at the shoe, not above the ankle.
          </p>
          <ul className="mt-4 space-y-2 text-[11px] text-foreground/55">
            <li>· Under 6&apos;0&quot;: proportions will read long</li>
            <li>· Between bands: size up for length, down for a sharper fit</li>
            <li>· Broad shoulders: prioritise chest measurement over height</li>
          </ul>
        </div>
      </div>

      <div>
        <p className="label mb-4 text-foreground/45">
          {isBottoms ? "Bottoms size chart" : "Tops size chart"}
        </p>
        <HeightSizeTable product={product} />
        <p className="mt-4 text-[11px] leading-relaxed text-foreground/45">
          Standing height shown in ft and cm. Garment measurements taken flat in cm and inches. Double chest
          and waist values for circumference. Inseam listed per size. Extended lengths available on request
          for 6&apos;6&quot; and above.
        </p>
      </div>

      {!compact && (
        <div className="border border-foreground/10 bg-foreground/[0.03] p-5 md:p-6">
          <p className="label text-foreground/45">Still unsure?</p>
          <p className="mt-2 text-sm leading-relaxed text-foreground/70">
            Email{" "}
            <a href="mailto:studio@6foot.eu" className="underline underline-offset-2 hover:text-foreground">
              studio@6foot.eu
            </a>{" "}
            with your height, usual size in other brands, and a chest or waist measurement. We respond within
            one working day.
          </p>
        </div>
      )}
    </div>
  );
}

export { topHeightChart, bottomHeightChart };
