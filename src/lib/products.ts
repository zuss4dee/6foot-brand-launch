import p1Flat from "@/assets/p1-flat.jpg";
import p1Model from "@/assets/p1-model.jpg";
import p2Flat from "@/assets/p2-flat.jpg";
import p2Model from "@/assets/p2-model.jpg";
import p3Flat from "@/assets/p3-flat.jpg";
import p3Model from "@/assets/p3-model.jpg";
import p4Flat from "@/assets/p4-flat.jpg";
import p4Model from "@/assets/p4-model.jpg";

export interface Product {
  slug: string;
  n: string;
  name: string;
  price: number;
  flat: string;
  model: string;
  len: string;
  gsm: string;
  fabric: string;
  description: string;
  sizes: string[];
  color: string;
}

export const products: Product[] = [
  {
    slug: "long-tee",
    n: "01",
    name: "The Long Tee",
    price: 85,
    flat: p1Flat,
    model: p1Model,
    len: "78cm",
    gsm: "240",
    fabric: "100% heavyweight long-staple cotton",
    description:
      "Our foundational tee, re-blocked from the shoulder down with +2 inches through the body. Stays tucked, drapes vertically.",
    sizes: ["M", "L", "XL", "XXL"],
    color: "Off-white",
  },
  {
    slug: "heavy-hoodie",
    n: "02",
    name: "Heavy Hoodie",
    price: 185,
    flat: p2Flat,
    model: p2Model,
    len: "82cm",
    gsm: "480",
    fabric: "480gsm brushed-back loopback cotton",
    description:
      "A weighted hoodie with elongated body, deep hood, and re-pitched sleeve so the cuff lands at the wristbone.",
    sizes: ["M", "L", "XL", "XXL"],
    color: "Black",
  },
  {
    slug: "wide-trouser",
    n: "03",
    name: "Wide Trouser",
    price: 165,
    flat: p3Flat,
    model: p3Model,
    len: "118cm",
    gsm: "320",
    fabric: "320gsm dry-touch cotton twill",
    description:
      "A wide, dropped-pleat trouser cut for an unbroken vertical line. Inseam stocked up to 38\".",
    sizes: ["30", "32", "34", "36", "38"],
    color: "Charcoal",
  },
  {
    slug: "long-sleeve",
    n: "04",
    name: "Long Sleeve",
    price: 95,
    flat: p4Flat,
    model: p4Model,
    len: "80cm",
    gsm: "240",
    fabric: "240gsm heavyweight long-staple cotton",
    description:
      "The Long Tee, re-engineered for cooler months. Ribbed cuffs sit at the wristbone, never the forearm.",
    sizes: ["M", "L", "XL", "XXL"],
    color: "Off-white",
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}