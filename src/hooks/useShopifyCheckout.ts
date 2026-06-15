import { useState } from "react";
import { useCart } from "@/lib/cart";
import { createShopifyCheckoutUrl } from "@/lib/shopify";

export function useShopifyCheckout() {
  const { enriched } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkout = async () => {
    setLoading(true);
    setError(null);
    try {
      const checkoutUrl = await createShopifyCheckoutUrl(enriched);
      window.location.href = checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed.");
      setLoading(false);
    }
  };

  return { checkout, loading, error, clearError: () => setError(null) };
}
