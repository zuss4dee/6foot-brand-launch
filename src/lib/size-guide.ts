import type { Product } from "@/lib/products";

export type MeasurementPoint = {
  id: string;
  label: string;
  description: string;
};

export const tallBlockNote =
  "Every 6foot top is re-blocked with a strict +2\" extension through the torso. Measurements below are garment flat — not body measurements.";

export const heightAnchor =
  "6foot sizing starts at 6'0\" (183 cm). If you are under 6'0\", these proportions will read long by design.";

export const topHeightChart = [
  { size: "M", height: `6'0" – 6'2"`, cm: "183 – 188 cm", shoulder: "47.5 cm", chest: "53.5 cm", length: "78 cm" },
  { size: "L", height: `6'2" – 6'4"`, cm: "188 – 193 cm", shoulder: "49.5 cm", chest: "56 cm", length: "80 cm" },
  { size: "XL", height: `6'4" – 6'6"`, cm: "193 – 198 cm", shoulder: "51.5 cm", chest: "58.5 cm", length: "82 cm" },
  { size: "XXL", height: `6'6" – 6'8"`, cm: "198 – 203 cm", shoulder: "53.5 cm", chest: "61 cm", length: "84 cm" },
];

export const bottomHeightChart = [
  { size: "30", height: `6'0" – 6'1"`, cm: "183 – 185 cm", waist: `30"`, inseam: `34"`, length: "118 cm" },
  { size: "32", height: `6'1" – 6'3"`, cm: "185 – 190 cm", waist: `32"`, inseam: `34"`, length: "120 cm" },
  { size: "34", height: `6'3" – 6'5"`, cm: "190 – 196 cm", waist: `34"`, inseam: `34"`, length: "120 cm" },
  { size: "36", height: `6'5" – 6'7"`, cm: "196 – 201 cm", waist: `36"`, inseam: `36"`, length: "122 cm" },
  { size: "38", height: `6'7" – 6'9"`, cm: "201 – 206 cm", waist: `38"`, inseam: `38"`, length: "124 cm" },
];

export const topMeasurementPoints: MeasurementPoint[] = [
  {
    id: "A",
    label: "Shoulder width",
    description: "Measured flat from shoulder seam to shoulder seam across the back.",
  },
  {
    id: "B",
    label: "Chest width",
    description: "Measured flat 2.5 cm (1\") below the armhole, pit to pit.",
  },
  {
    id: "C",
    label: "Body length",
    description: "High shoulder point (HSP) at the neckline to the hem — includes the +2\" tall block.",
  },
  {
    id: "D",
    label: "Sleeve length",
    description: "Shoulder seam to cuff edge. Cuff should land at the wristbone on your height band.",
  },
  {
    id: "E",
    label: "Tall block zone",
    description: "Additional +2\" (5 cm) engineered through the torso — not added to sleeve or shoulder.",
  },
];

export const bottomMeasurementPoints: MeasurementPoint[] = [
  {
    id: "A",
    label: "Waist",
    description: "Relaxed waistband measured flat, doubled for circumference. Size by your natural waist.",
  },
  {
    id: "B",
    label: "Inseam",
    description: "Crotch seam to hem along the inside leg. Extended inseams stocked up to 38\".",
  },
  {
    id: "C",
    label: "Front rise",
    description: "Top of waistband at centre front to crotch seam. Scaled longer for taller torsos.",
  },
  {
    id: "D",
    label: "Outseam",
    description: "Waistband to hem along the outside leg — total vertical drop of the garment.",
  },
  {
    id: "E",
    label: "Thigh",
    description: "Measured flat 2.5 cm below the crotch, across the leg. Wide block cut throughout.",
  },
];

export function getHeightChart(product: Product) {
  return product.category === "bottoms" ? bottomHeightChart : topHeightChart;
}

export function getMeasurementPoints(product: Product) {
  return product.category === "bottoms" ? bottomMeasurementPoints : topMeasurementPoints;
}

export function getFitRecommendation(product: Product, size: string) {
  const chart = getHeightChart(product);
  const row = chart.find((entry) => entry.size.toLowerCase() === size.toLowerCase());
  if (!row) return null;
  return `Recommended for ${row.height} (${row.cm}).`;
}
