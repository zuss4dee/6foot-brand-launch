/**
 * Fetches Shopify Storefront products and generates src/lib/shopify-variants.ts
 * Run: node scripts/sync-shopify-variants.mjs
 * Requires SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function loadEnvLocal() {
  const envPath = path.join(root, ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvLocal();

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

if (!domain || !token) {
  console.error("Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local");
  process.exit(1);
}

const LOCAL_PRODUCTS = [
  { slug: "long-tee", sizes: ["S", "M", "L", "XL", "XXL"] },
  { slug: "heavy-hoodie", sizes: ["S", "M", "L", "XL", "XXL"] },
  { slug: "wide-trouser", sizes: ["30", "32", "34", "36", "38"] },
  { slug: "long-sleeve", sizes: ["S", "M", "L", "XL", "XXL"] },
  { slug: "long-tee-black", sizes: ["S", "M", "L", "XL", "XXL"] },
  { slug: "zip-hoodie", sizes: ["S", "M", "L", "XL", "XXL"] },
  { slug: "tall-tank", sizes: ["S", "M", "L", "XL", "XXL"] },
  { slug: "long-sleeve-black", sizes: ["S", "M", "L", "XL", "XXL"] },
  { slug: "heavyweight-crew", sizes: ["S", "M", "L", "XL", "XXL"] },
  { slug: "wide-trouser-black", sizes: ["30", "32", "34", "36", "38"] },
  { slug: "carpenter-pant", sizes: ["30", "32", "34", "36", "38"] },
  { slug: "coach-jacket", sizes: ["S", "M", "L", "XL", "XXL"] },
];

const SIZE_TOKENS = new Set([
  "XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL",
  "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "40",
]);

function normalizeSize(raw, validSizes) {
  if (!raw) return null;
  const upper = String(raw).trim().toUpperCase();
  const validUpper = new Set(validSizes.map((s) => s.toUpperCase()));
  if (validUpper.has(upper)) {
    return validSizes.find((s) => s.toUpperCase() === upper) ?? upper;
  }
  return null;
}

function extractSize(variant, validSizes) {
  const sizeOption = variant.selectedOptions.find(
    (o) => o.name.trim().toLowerCase() === "size",
  );
  if (sizeOption) {
    const matched = normalizeSize(sizeOption.value, validSizes);
    if (matched) return matched;
  }

  const titleParts = variant.title.split("/").map((p) => p.trim());
  for (const part of titleParts) {
    const matched = normalizeSize(part, validSizes);
    if (matched) return matched;
  }

  for (const option of variant.selectedOptions) {
    const fromValue = normalizeSize(option.value, validSizes);
    if (fromValue) return fromValue;
  }

  for (const option of variant.selectedOptions) {
    const fromName = normalizeSize(option.name, validSizes);
    if (fromName) return fromName;
  }

  return null;
}

const QUERY = /* GraphQL */ `
  query SyncCatalog($cursor: String) {
    products(first: 50, after: $cursor) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          title
          handle
          variants(first: 100) {
            edges {
              node {
                id
                title
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`;

async function fetchAllProducts() {
  const products = [];
  let cursor = null;

  while (true) {
    const response = await fetch(`https://${domain}/api/2024-10/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query: QUERY, variables: { cursor } }),
    });

    if (!response.ok) {
      throw new Error(`Shopify request failed (${response.status})`);
    }

    const json = await response.json();
    if (json.errors?.length) {
      throw new Error(json.errors.map((e) => e.message).join(" "));
    }

    const connection = json.data.products;
    for (const edge of connection.edges) {
      products.push({
        title: edge.node.title,
        handle: edge.node.handle,
        variants: edge.node.variants.edges.map((v) => v.node),
      });
    }

    if (!connection.pageInfo.hasNextPage) break;
    cursor = connection.pageInfo.endCursor;
  }

  return products;
}

function buildMaps(shopifyProducts) {
  const shopifyVariantByKey = {};
  const shopifyHandleBySlug = {};
  const unmatchedShopify = [];
  const unmatchedLocal = [];

  const shopifyByHandle = new Map(shopifyProducts.map((p) => [p.handle, p]));

  for (const local of LOCAL_PRODUCTS) {
    const shopify = shopifyByHandle.get(local.slug);
    if (!shopify) {
      unmatchedLocal.push(local.slug);
      continue;
    }

    const usedSizes = new Set();

    for (const variant of shopify.variants) {
      const size = extractSize(variant, local.sizes);
      if (!size || usedSizes.has(size)) continue;
      usedSizes.add(size);
      shopifyVariantByKey[`${local.slug}:${size}`] = variant.id;
    }

    const missingSizes = local.sizes.filter((s) => !usedSizes.has(s));
    if (missingSizes.length) {
      unmatchedLocal.push(`${local.slug} (missing sizes: ${missingSizes.join(", ")})`);
    }
  }

  for (const shopify of shopifyProducts) {
    const hasLocal = LOCAL_PRODUCTS.some((p) => p.slug === shopify.handle);
    if (!hasLocal) {
      const genericSizes = [...SIZE_TOKENS];
      const handleEntries = {};

      for (const variant of shopify.variants) {
        const size = extractSize(variant, [...genericSizes]);
        if (!size || handleEntries[size]) continue;
        handleEntries[size] = variant.id;
        shopifyVariantByKey[`${shopify.handle}:${size}`] = variant.id;
      }

      if (Object.keys(handleEntries).length > 0) {
        for (const local of LOCAL_PRODUCTS) {
          if (!shopifyByHandle.has(local.slug)) {
            shopifyHandleBySlug[local.slug] = shopify.handle;
            for (const [size, id] of Object.entries(handleEntries)) {
              if (local.sizes.includes(size)) {
                shopifyVariantByKey[`${local.slug}:${size}`] = id;
              }
            }
          }
        }
      } else {
        unmatchedShopify.push(`${shopify.title} (${shopify.handle})`);
      }
    }
  }

  return { shopifyVariantByKey, shopifyHandleBySlug, unmatchedShopify, unmatchedLocal };
}

function formatTs(map, handleMap) {
  const variantLines = Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, id]) => `  "${key}": "${id}",`)
    .join("\n");

  const handleLines = Object.entries(handleMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([slug, handle]) => `  "${slug}": "${handle}",`)
    .join("\n");

  return `/**
 * Auto-generated by scripts/sync-shopify-variants.mjs
 * Re-run after adding products or variants in Shopify.
 */

export const shopifyHandleBySlug: Record<string, string> = {
${handleLines || "  // No handle aliases"}
};

export const shopifyVariantByKey: Record<string, string> = {
${variantLines || "  // No variant mappings found"}
};

export function shopifyVariantKey(slug: string, size: string) {
  return \`\${slug}:\${size}\`;
}

export function resolveMerchandiseId(slug: string, size: string): string | undefined {
  const direct = shopifyVariantByKey[shopifyVariantKey(slug, size)];
  if (direct) return direct;

  const handle = shopifyHandleBySlug[slug];
  if (handle) {
    return shopifyVariantByKey[shopifyVariantKey(handle, size)];
  }

  return undefined;
}
`;
}

const shopifyProducts = await fetchAllProducts();
console.log(`Fetched ${shopifyProducts.length} Shopify product(s).`);

const { shopifyVariantByKey, shopifyHandleBySlug, unmatchedShopify, unmatchedLocal } =
  buildMaps(shopifyProducts);

if (Object.keys(shopifyVariantByKey).length === 0) {
  console.error(
    "No variant mappings found — existing shopify-variants.ts was left unchanged. Check SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_ACCESS_TOKEN, and that products are published to the storefront.",
  );
  process.exit(1);
}

const outPath = path.join(root, "src/lib/shopify-variants.ts");
fs.writeFileSync(outPath, formatTs(shopifyVariantByKey, shopifyHandleBySlug));

console.log(`Wrote ${Object.keys(shopifyVariantByKey).length} variant mapping(s) to ${outPath}`);

if (Object.keys(shopifyHandleBySlug).length) {
  console.log(`Handle aliases: ${Object.keys(shopifyHandleBySlug).length} local slug(s) -> Shopify handle`);
}

if (unmatchedShopify.length) {
  console.warn("Unmatched Shopify products:", unmatchedShopify.join(", "));
}

if (unmatchedLocal.length) {
  console.warn("Unmatched / incomplete local products:", unmatchedLocal.join(", "));
}
