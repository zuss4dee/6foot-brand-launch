import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { SiteNav } from "@/components/SiteNav";
import { useShopifyCheckout } from "@/hooks/useShopifyCheckout";
import { useCart } from "@/lib/cart";
import { useCustomerAuth } from "@/lib/customer-auth";
import { formatPrice, productFitImageClass } from "@/lib/products";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout | 6foot" },
      { name: "description", content: "Complete your order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const { enriched, subtotal, setQty, remove } = useCart();
  const { checkout, loading, error } = useShopifyCheckout();
  const { session } = useCustomerAuth();

  if (enriched.length === 0) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <SiteNav showPromo={false} />
        <section className="px-6 pb-32 pt-40 md:px-10">
          <p className="label text-foreground/60">Checkout</p>
          <h1 className="display mt-4 text-5xl md:text-6xl">Nothing to check out.</h1>
          <Link to="/shop" className="label mt-10 inline-flex items-center gap-3">
            Browse the capsule <span className="h-px w-10 bg-foreground" />
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNav showPromo={false} />

      <section className="px-6 pb-24 pt-32 md:px-10 md:pt-36">
        <div className="grid grid-cols-12 gap-x-10 gap-y-12">
          <div className="col-span-12 lg:col-span-7">
            <p className="label text-foreground/60">Checkout</p>
            <h1 className="display mt-2 text-4xl md:text-5xl">Review your bag.</h1>
            <p className="mt-4 max-w-[40ch] text-sm leading-relaxed text-foreground/70">
              You&apos;ll complete payment and shipping on Shopify&apos;s secure checkout.
            </p>

            {error && (
              <p className="mt-6 border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            )}

            <div className="mt-10 flex flex-col items-start gap-4">
              {!session.authenticated && (
                <p className="text-[11px] text-foreground/45">
                  Have an account?{" "}
                  <Link
                    to="/login"
                    className="underline underline-offset-2 transition-opacity hover:text-foreground/70"
                  >
                    Log in for faster checkout
                  </Link>
                </p>
              )}
              <div className="flex flex-wrap items-center gap-4">
                <Link to="/shop" className="label hover:opacity-60">
                  ← Keep shopping
                </Link>
                <motion.button
                  type="button"
                  onClick={checkout}
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.01 }}
                  whileTap={{ scale: loading ? 1 : 0.99 }}
                  className="label inline-flex items-center gap-4 bg-foreground px-8 py-5 text-background disabled:cursor-wait disabled:opacity-60"
                >
                  {loading ? "Redirecting to checkout…" : "Checkout →"}
                </motion.button>
              </div>
            </div>
          </div>

          <aside className="col-span-12 lg:col-span-5">
            <div className="space-y-6 bg-foreground/[0.03] p-6 md:p-8 lg:sticky lg:top-32">
              <p className="label text-foreground/60">Order · {enriched.length} items</p>
              <ul className="space-y-5">
                {enriched.map(({ item, product }) => (
                  <li key={`${item.slug}-${item.size}`} className="grid grid-cols-[60px_1fr] gap-4">
                    <div className="relative aspect-[3/4] overflow-hidden bg-background">
                      <div className="absolute inset-0 flex items-end justify-center px-1 pt-1">
                        <img
                          src={product.model}
                          alt={product.name}
                          className={productFitImageClass}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <p className="display text-base leading-tight">{product.name}</p>
                        <p className="display text-base">{formatPrice(product.price * item.qty)}</p>
                      </div>
                      <p className="label mt-1 text-foreground/50">Size {item.size}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="inline-flex items-center border border-foreground/15">
                          <button
                            type="button"
                            onClick={() => setQty(item.slug, item.size, item.qty - 1)}
                            className="label px-2 py-0.5"
                          >
                            −
                          </button>
                          <span className="label px-2">{item.qty}</span>
                          <button
                            type="button"
                            onClick={() => setQty(item.slug, item.size, item.qty + 1)}
                            className="label px-2 py-0.5"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
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

              <div className="flex items-baseline justify-between border-t border-foreground/15 pt-5">
                <span className="label">Subtotal</span>
                <span className="display text-2xl">{formatPrice(subtotal)}</span>
              </div>
              <p className="label text-foreground/50">
                Shipping and taxes calculated at Shopify checkout.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
