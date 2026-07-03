import type { Product } from "@/lib/products";
import type { CartItem } from "@/lib/cart";
import { trackInitiateCheckout } from "@/lib/analytics";
import { resolveMerchandiseId } from "@/lib/shopify-variants";

type CheckoutLine = {
  item: CartItem;
  product: Product;
};

export function trackCheckoutStart(lines: CheckoutLine[]) {
  if (lines.length === 0) return;

  const items = lines.map(({ item, product }) => ({
    slug: product.slug,
    variantGid: resolveMerchandiseId(product.slug, item.size),
    title: product.name,
    quantity: item.qty,
    price: product.price,
  }));

  const value = items.reduce((total, item) => total + item.price * item.quantity, 0);

  trackInitiateCheckout({ value, items });
}
