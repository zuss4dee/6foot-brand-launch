import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useShopifyCheckout } from "@/hooks/useShopifyCheckout";
import { trackAddToCart } from "@/lib/analytics";
import { useCart } from "@/lib/cart";
import { useCustomerAuth } from "@/lib/customer-auth";
import { productFitImageClass, formatPrice } from "@/lib/products";
import { resolveMerchandiseId } from "@/lib/shopify-variants";

function GuestCheckoutLoginHint() {
  const { session } = useCustomerAuth();

  if (session.authenticated) return null;

  return (
    <p className="text-[11px] text-foreground/45">
      Have an account?{" "}
      <Link
        to="/login"
        className="underline underline-offset-2 transition-opacity hover:text-foreground/70"
      >
        Log in for faster checkout
      </Link>
    </p>
  );
}

export function CartDrawer() {
  const { open, setOpen, enriched, setQty, remove, subtotal, count } = useCart();
  const { checkout, loading, error } = useShopifyCheckout();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[60] bg-foreground/30 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 bottom-0 z-[70] flex w-full flex-col bg-background safe-bottom sm:w-[28rem]"
          >
            <div className="flex items-center justify-between px-6 md:px-8 py-6 border-b border-foreground/10">
              <p className="label">Your bag — {count}</p>
              <button onClick={() => setOpen(false)} className="label hover:opacity-60">
                Close ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6">
              {enriched.length === 0 ? (
                <div className="flex flex-col items-start gap-6 py-10">
                  <p className="display text-3xl leading-tight">Your bag is empty.</p>
                  <Link
                    to="/shop"
                    onClick={() => setOpen(false)}
                    className="label inline-flex items-center gap-3"
                  >
                    Browse the capsule
                    <span className="h-px w-10 bg-foreground" />
                  </Link>
                </div>
              ) : (
                <ul className="space-y-8">
                  {enriched.map(({ item, product }) => (
                    <li
                      key={`${item.slug}-${item.size}`}
                      className="grid grid-cols-[80px_1fr] gap-5"
                    >
                      <Link
                        to="/shop/$slug"
                        params={{ slug: product.slug }}
                        onClick={() => setOpen(false)}
                        className="relative block aspect-[3/4] overflow-hidden bg-background"
                      >
                        <div className="absolute inset-0 flex items-end justify-center px-1 pt-2">
                          <img
                            src={product.model}
                            alt={product.name}
                            className={productFitImageClass}
                          />
                        </div>
                      </Link>
                      <div className="flex flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <Link
                            to="/shop/$slug"
                            params={{ slug: product.slug }}
                            onClick={() => setOpen(false)}
                            className="display text-lg leading-tight hover:opacity-60"
                          >
                            {product.name}
                          </Link>
                          <span className="display text-lg">{formatPrice(product.price * item.qty)}</span>
                        </div>
                        <p className="label text-foreground/50 mt-1">
                          Size {item.size} · {product.color}
                        </p>
                        <div className="mt-auto flex items-center justify-between pt-4">
                          <div className="inline-flex items-center border border-foreground/20">
                            <button
                              onClick={() => setQty(item.slug, item.size, item.qty - 1)}
                              className="px-3 py-1 label hover:bg-foreground hover:text-background transition-colors"
                              aria-label="Decrease"
                            >
                              −
                            </button>
                            <span className="label px-3 min-w-[2ch] text-center">{item.qty}</span>
                            <button
                              onClick={() => {
                                setQty(item.slug, item.size, item.qty + 1);
                                const variantGid = resolveMerchandiseId(product.slug, item.size);
                                if (variantGid) {
                                  trackAddToCart({
                                    slug: product.slug,
                                    title: product.name,
                                    price: product.price,
                                    quantity: 1,
                                    variantGid,
                                    variantTitle: item.size,
                                    category: product.category,
                                  });
                                }
                              }}
                              className="px-3 py-1 label hover:bg-foreground hover:text-background transition-colors"
                              aria-label="Increase"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => remove(item.slug, item.size)}
                            className="label text-foreground/50 hover:text-foreground"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {enriched.length > 0 && (
              <div className="border-t border-foreground/10 px-6 md:px-8 py-6 space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="label text-foreground/60">Subtotal</span>
                  <span className="display text-2xl">{formatPrice(subtotal)}</span>
                </div>
                <p className="label text-foreground/50">Shipping and taxes calculated at checkout.</p>
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
                <GuestCheckoutLoginHint />
                <button
                  type="button"
                  onClick={checkout}
                  disabled={loading}
                  className="block w-full bg-foreground px-6 py-5 text-center label text-background transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
                >
                  {loading ? "Redirecting to checkout…" : "Checkout →"}
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}