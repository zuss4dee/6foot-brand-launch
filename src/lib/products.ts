import fabric from "@/assets/fabric.jpg";
import hero from "@/assets/hero.jpg";
import launchRight from "@/assets/launch-right-model.png";
import p1Flat from "@/assets/p1-flat.jpg";
import p1Model from "@/assets/p1-model.jpg";

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
  return product.n === "01";
}

export function getProductImages(product: Product): ProductImage[] {
  return [
    { src: product.model, label: "on model", fit: "model" },
    { src: product.flat, label: "flat lay", fit: "flat" },
    { src: fabric, label: "fabric detail", fit: "cover" },
    { src: hero, label: "editorial", fit: "cover" },
  ];
}

export const products: Product[] = [
  {
    slug: "long-tee",
    n: "01",
    name: "The Long Tee",
    price: 0,
    flat: p1Flat,
    model: p1Model,
    len: "78cm",
    gsm: "240",
    fabric: "100% heavyweight long-staple cotton",
    description:
      "Our foundational tee, re-blocked from the shoulder down with +2 inches through the body. Stays tucked, drapes vertically.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    color: "Off-white",
    category: "tops",
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
    title: "The Long Tee",
    description:
      "Our foundational tee — re-blocked from the shoulder down with a strict +2\" extension through the torso.",
    introImage: launchRight,
    introImageAlt: "Model wearing The Long Tee",
    slugs: ["long-tee"],
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
