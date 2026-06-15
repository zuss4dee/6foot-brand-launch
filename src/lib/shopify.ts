import type { CartItem } from "@/lib/cart";
import type { Product } from "@/lib/products";
import { resolveMerchandiseId } from "@/lib/shopify-variants";

export const CART_CREATE_MUTATION = /* GraphQL */ `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const STOREFRONT_API_VERSION = "2024-10";

export type ShopifyCartLine = {
  merchandiseId: string;
  quantity: number;
};

type EnrichedCartLine = {
  item: CartItem;
  product: Product;
};

type CartCreateResponse = {
  data?: {
    cartCreate?: {
      cart?: {
        id: string;
        checkoutUrl: string;
      } | null;
      userErrors?: { field: string[] | null; message: string }[];
    };
  };
  errors?: { message: string }[];
};

function getShopifyConfig() {
  const domain = import.meta.env.SHOPIFY_STORE_DOMAIN as string | undefined;
  const token = import.meta.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN as string | undefined;

  if (!domain?.trim()) {
    throw new Error("Missing SHOPIFY_STORE_DOMAIN environment variable.");
  }
  if (!token?.trim()) {
    throw new Error("Missing SHOPIFY_STOREFRONT_ACCESS_TOKEN environment variable.");
  }

  return { domain: domain.trim(), token: token.trim() };
}

export function cartItemsToShopifyLines(enriched: EnrichedCartLine[]): ShopifyCartLine[] {
  return enriched.map(({ item, product }) => {
    const merchandiseId = resolveMerchandiseId(product.slug, item.size);
    if (!merchandiseId) {
      throw new Error(
        `No Shopify variant mapped for ${product.name} (size ${item.size}). Add it in shopify-variants.ts.`,
      );
    }
    return {
      merchandiseId,
      quantity: item.qty,
    };
  });
}

export async function createShopifyCheckoutUrl(enriched: EnrichedCartLine[]): Promise<string> {
  if (enriched.length === 0) {
    throw new Error("Your bag is empty.");
  }

  const lines = cartItemsToShopifyLines(enriched);
  return createShopifyCheckoutFromLines(lines);
}

export async function createShopifyCheckoutFromLines(lines: ShopifyCartLine[]): Promise<string> {
  const { domain, token } = getShopifyConfig();

  const response = await fetch(`https://${domain}/api/${STOREFRONT_API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({
      query: CART_CREATE_MUTATION,
      variables: {
        input: { lines },
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Shopify checkout request failed (${response.status}).`);
  }

  const json = (await response.json()) as CartCreateResponse;

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join(" "));
  }

  const payload = json.data?.cartCreate;
  const userErrors = payload?.userErrors?.filter((e) => e.message) ?? [];

  if (userErrors.length > 0) {
    throw new Error(userErrors.map((e) => e.message).join(" "));
  }

  const checkoutUrl = payload?.cart?.checkoutUrl;
  if (!checkoutUrl) {
    throw new Error("Shopify did not return a checkout URL.");
  }

  return checkoutUrl;
}
