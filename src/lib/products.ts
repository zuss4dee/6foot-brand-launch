import launchLeft from "@/assets/launch-left-model.png";
import launchRight from "@/assets/launch-right-model.png";
import launchFemaleCutout from "@/assets/launch-female-cutout.png";
import launchFemaleTransparent from "@/assets/launch-female-transparent.png";
import launchFemaleWhite from "@/assets/launch-female-white.jpg";
import launchMaleBlack from "@/assets/launch-male-black.jpg";
import launchMaleCutout from "@/assets/launch-male-cutout.png";
import launchMaleTransparent from "@/assets/launch-male-transparent.png";
import fabric from "@/assets/fabric.jpg";
import hero from "@/assets/hero.jpg";
import p1Flat from "@/assets/p1-flat.jpg";
import p1Model from "@/assets/p1-model.jpg";
import p2Flat from "@/assets/p2-flat.jpg";
import p2Model from "@/assets/p2-model.jpg";
import p3Flat from "@/assets/p3-flat.jpg";
import p3Model from "@/assets/p3-model.jpg";
import p4Flat from "@/assets/p4-flat.jpg";
import p4Model from "@/assets/p4-model.jpg";

export type ProductCategory = "tops" | "bottoms" | "outerwear";

export type ProductImageFit = "model" | "cover" | "flat";

export interface ProductImage {
  src: string;
  label: string;
  fit: ProductImageFit;
}

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
  category: ProductCategory;
  badge?: "new:in" | "restocked";
}

export function formatPrice(amount: number) {
  return `£${amount}`;
}

export function productRef(product: Product) {
  return `6F-${product.n} / ${product.color.toLowerCase().replace(/\s+/g, "-")}`;
}

export function productFit(product: Product) {
  if (product.category === "bottoms") return "extended inseam fit";
  if (product.category === "outerwear") return "proportioned outer block";
  return "elongated tall block";
}

export function getColorVariants(product: Product) {
  return products.filter((p) => p.name === product.name);
}

const productColorHex: Record<string, string> = {
  "Off-white": "#f2efe8",
  Black: "#141414",
  Charcoal: "#4a4a4a",
  Stone: "#b8b0a4",
  Olive: "#5c6348",
};

export function getProductColorHex(color: string) {
  return productColorHex[color] ?? "#d4d4d4";
}

export function getRelatedProducts(product: Product, limit = 4) {
  const sameCategory = products.filter(
    (p) => p.slug !== product.slug && p.category === product.category,
  );
  const others = products.filter(
    (p) => p.slug !== product.slug && p.category !== product.category,
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export function isLowStock(product: Product) {
  return ["01", "06", "12"].includes(product.n);
}

const styledLooks: ProductImage[] = [
  { src: launchFemaleCutout, label: "styled look", fit: "model" },
  { src: launchMaleCutout, label: "on model", fit: "model" },
  { src: launchFemaleTransparent, label: "full length", fit: "model" },
  { src: launchMaleTransparent, label: "on model", fit: "model" },
  { src: launchFemaleWhite, label: "editorial", fit: "cover" },
  { src: launchMaleBlack, label: "on model", fit: "cover" },
];

const flatLays: ProductImage[] = [
  { src: p1Flat, label: "flat lay", fit: "flat" },
  { src: p2Flat, label: "flat lay", fit: "flat" },
  { src: p3Flat, label: "flat lay", fit: "flat" },
  { src: p4Flat, label: "flat lay", fit: "flat" },
];

const detailShots: ProductImage[] = [
  { src: p1Model, label: "detail shot", fit: "cover" },
  { src: p2Model, label: "detail shot", fit: "cover" },
  { src: p3Model, label: "detail shot", fit: "cover" },
  { src: p4Model, label: "detail shot", fit: "cover" },
];

const textureShots: ProductImage[] = [
  { src: fabric, label: "fabric detail", fit: "cover" },
  { src: hero, label: "editorial", fit: "cover" },
];

export function getProductImages(product: Product): ProductImage[] {
  const index = parseInt(product.n, 10) - 1;
  const images: ProductImage[] = [
    { src: product.model, label: "on model", fit: "model" },
    { src: product.flat, label: "alternate view", fit: "model" },
    styledLooks[index % styledLooks.length],
    flatLays[index % flatLays.length],
    detailShots[(index + 1) % detailShots.length],
    textureShots[index % textureShots.length],
  ];

  if (product.category === "outerwear") {
    images.push({ src: hero, label: "lookbook", fit: "cover" });
  }

  const seen = new Set<string>();
  return images.filter((image) => {
    if (seen.has(image.src)) return false;
    seen.add(image.src);
    return true;
  });
}

export const products: Product[] = [
  {
    slug: "long-tee",
    n: "01",
    name: "The Long Tee",
    price: 150,
    flat: launchLeft,
    model: launchRight,
    len: "78cm",
    gsm: "240",
    fabric: "100% heavyweight long-staple cotton",
    description:
      "Our foundational tee, re-blocked from the shoulder down with +2 inches through the body. Stays tucked, drapes vertically.",
    sizes: ["M", "L", "XL", "XXL"],
    color: "Off-white",
    category: "tops",
    badge: "new:in",
  },
  {
    slug: "heavy-hoodie",
    n: "02",
    name: "Heavy Hoodie",
    price: 150,
    flat: launchRight,
    model: launchLeft,
    len: "82cm",
    gsm: "480",
    fabric: "480gsm brushed-back loopback cotton",
    description:
      "A weighted hoodie with elongated body, deep hood, and re-pitched sleeve so the cuff lands at the wristbone.",
    sizes: ["M", "L", "XL", "XXL"],
    color: "Black",
    category: "tops",
    badge: "new:in",
  },
  {
    slug: "wide-trouser",
    n: "03",
    name: "Wide Trouser",
    price: 150,
    flat: launchRight,
    model: launchLeft,
    len: "118cm",
    gsm: "320",
    fabric: "320gsm dry-touch cotton twill",
    description:
      "A wide, dropped-pleat trouser cut for an unbroken vertical line. Inseam stocked up to 38\".",
    sizes: ["30", "32", "34", "36", "38"],
    color: "Charcoal",
    category: "bottoms",
    badge: "new:in",
  },
  {
    slug: "long-sleeve",
    n: "04",
    name: "Long Sleeve",
    price: 150,
    flat: launchLeft,
    model: launchRight,
    len: "80cm",
    gsm: "240",
    fabric: "240gsm heavyweight long-staple cotton",
    description:
      "The Long Tee, re-engineered for cooler months. Ribbed cuffs sit at the wristbone, never the forearm.",
    sizes: ["M", "L", "XL", "XXL"],
    color: "Off-white",
    category: "tops",
    badge: "new:in",
  },
  {
    slug: "long-tee-black",
    n: "05",
    name: "The Long Tee",
    price: 150,
    flat: launchRight,
    model: launchLeft,
    len: "78cm",
    gsm: "240",
    fabric: "100% heavyweight long-staple cotton",
    description:
      "The Long Tee in black — same +2 inch tall block, same vertical drape. Pigment-dyed for a deep, stable finish.",
    sizes: ["M", "L", "XL", "XXL"],
    color: "Black",
    category: "tops",
    badge: "new:in",
  },
  {
    slug: "zip-hoodie",
    n: "06",
    name: "Zip Hoodie",
    price: 150,
    flat: launchRight,
    model: launchLeft,
    len: "83cm",
    gsm: "480",
    fabric: "480gsm brushed-back loopback cotton",
    description:
      "Full-zip heavyweight hoodie with elongated torso, matte hardware, and a hood scaled for taller necks.",
    sizes: ["M", "L", "XL", "XXL"],
    color: "Black",
    category: "tops",
    badge: "new:in",
  },
  {
    slug: "tall-tank",
    n: "07",
    name: "Tall Tank",
    price: 150,
    flat: launchLeft,
    model: launchRight,
    len: "76cm",
    gsm: "220",
    fabric: "220gsm compact cotton jersey",
    description:
      "A longline tank with dropped armhole and extended body length. Layered or worn alone.",
    sizes: ["M", "L", "XL", "XXL"],
    color: "Off-white",
    category: "tops",
    badge: "new:in",
  },
  {
    slug: "long-sleeve-black",
    n: "08",
    name: "Long Sleeve",
    price: 150,
    flat: launchRight,
    model: launchLeft,
    len: "80cm",
    gsm: "240",
    fabric: "240gsm heavyweight long-staple cotton",
    description:
      "Long Sleeve in black with the same wrist-true cuff placement and +2 inch body block as the off-white edition.",
    sizes: ["M", "L", "XL", "XXL"],
    color: "Black",
    category: "tops",
    badge: "new:in",
  },
  {
    slug: "heavyweight-crew",
    n: "09",
    name: "Heavyweight Crew",
    price: 150,
    flat: launchLeft,
    model: launchRight,
    len: "79cm",
    gsm: "320",
    fabric: "320gsm compact cotton fleece",
    description:
      "A structured crewneck with reinforced neck rib, elongated body, and clean shoulder line for the tall frame.",
    sizes: ["M", "L", "XL", "XXL"],
    color: "Stone",
    category: "tops",
    badge: "new:in",
  },
  {
    slug: "wide-trouser-black",
    n: "10",
    name: "Wide Trouser",
    price: 150,
    flat: launchRight,
    model: launchLeft,
    len: "118cm",
    gsm: "320",
    fabric: "320gsm dry-touch cotton twill",
    description:
      "Wide Trouser in black — same dropped pleat and extended inseam range, finished in a deep enzyme wash.",
    sizes: ["30", "32", "34", "36", "38"],
    color: "Black",
    category: "bottoms",
    badge: "new:in",
  },
  {
    slug: "carpenter-pant",
    n: "11",
    name: "Carpenter Pant",
    price: 150,
    flat: launchLeft,
    model: launchRight,
    len: "120cm",
    gsm: "340",
    fabric: "340gsm cotton canvas",
    description:
      "Utility pant with hammer loop, knee panel, and a straight wide leg cut long through the rise and inseam.",
    sizes: ["30", "32", "34", "36", "38"],
    color: "Olive",
    category: "bottoms",
    badge: "new:in",
  },
  {
    slug: "coach-jacket",
    n: "12",
    name: "Coach Jacket",
    price: 150,
    flat: launchLeft,
    model: launchRight,
    len: "84cm",
    gsm: "280",
    fabric: "280gsm nylon-cotton shell with quilted lining",
    description:
      "Snap-front coach jacket with elongated body, interior pocket system, and rib that sits at the hip, not above it.",
    sizes: ["M", "L", "XL", "XXL"],
    color: "Black",
    category: "outerwear",
    badge: "new:in",
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export type ShopEditorialItem = {
  title: string;
  subtitle: string;
  image: string;
  to: "/coming-soon";
};

export type ShopSection = {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  introImage?: string;
  introImageAlt?: string;
  slugs: string[];
  editorialItems?: ShopEditorialItem[];
};

export const shopSections: ShopSection[] = [
  {
    id: "drop-001",
    eyebrow: "Drop 001 / SS26",
    title: "The Capsule",
    description:
      "Four proportioned staples. Engineered with a strict +2\" drop through the torso.",
    introImage: launchRight,
    introImageAlt: "Model in Drop 001 proportioned essentials",
    slugs: ["long-tee", "heavy-hoodie", "wide-trouser", "long-sleeve"],
  },
  {
    id: "tees-layering",
    eyebrow: "Collection 02",
    title: "Tees & Layering",
    description: "240gsm foundations, longline blocks, and wrist-true cuffs.",
    introImage: launchLeft,
    introImageAlt: "Side view — tees and layering",
    slugs: ["long-tee-black", "long-sleeve-black", "tall-tank", "heavyweight-crew"],
  },
  {
    id: "hoodies",
    eyebrow: "Collection 03",
    title: "Hoodies & Zip Layers",
    description: "480gsm loopback with elongated torso and deep hood.",
    introImage: launchMaleTransparent,
    introImageAlt: "Model in heavyweight hoodie layer",
    slugs: ["zip-hoodie", "heavyweight-crew"],
  },
  {
    id: "bottoms",
    eyebrow: "Collection 04",
    title: "Bottoms",
    description: "Extended inseams, wide legs, and utility cuts for height.",
    introImage: launchMaleCutout,
    introImageAlt: "Full-length view — proportioned bottoms",
    slugs: ["wide-trouser", "wide-trouser-black", "carpenter-pant"],
  },
  {
    id: "outerwear",
    eyebrow: "Collection 05",
    title: "Outerwear",
    description: "Proportioned shells built past the hip line.",
    introImage: launchFemaleTransparent,
    introImageAlt: "Model in outerwear silhouette",
    slugs: ["coach-jacket"],
  },
  {
    id: "drop-002",
    eyebrow: "Drop 002 / AW26",
    title: "Shop the Edit",
    description: "The next iteration of the tall block. Registry opens first.",
    introImage: launchFemaleCutout,
    introImageAlt: "AW26 editorial preview",
    slugs: [],
    editorialItems: [
      {
        title: "AW26 Look I",
        subtitle: "proportioned block",
        image: launchLeft,
        to: "/coming-soon",
      },
      {
        title: "AW26 Look II",
        subtitle: "tall frame edit",
        image: launchRight,
        to: "/coming-soon",
      },
      {
        title: "AW26 Look III",
        subtitle: "studio preview",
        image: launchMaleCutout,
        to: "/coming-soon",
      },
      {
        title: "AW26 Look IV",
        subtitle: "registry early access",
        image: launchFemaleCutout,
        to: "/coming-soon",
      },
    ],
  },
];

export function getSectionProducts(section: ShopSection): Product[] {
  return section.slugs
    .map((slug) => getProduct(slug))
    .filter((product): product is Product => Boolean(product));
}

export function getSectionPieceCount(section: ShopSection) {
  return section.slugs.length + (section.editorialItems?.length ?? 0);
}

export const productGridRepresentImageClass =
  "h-full w-full object-contain object-center p-4 md:p-6";

export const productFitImageClass =
  "max-h-full w-auto max-w-full object-contain object-bottom max-md:mx-auto max-md:h-[min(58vh,640px)] max-md:max-w-[96%]";

export const productGridImageClass =
  "max-h-full w-auto max-w-full object-contain object-bottom max-md:mx-auto max-md:h-[min(52vh,560px)] max-md:max-w-[94%]";

export function productImageClass(fit: ProductImageFit) {
  if (fit === "cover") return "h-full w-full object-cover object-center";
  if (fit === "flat") return "h-full w-full object-contain object-center p-6";
  return productFitImageClass;
}
