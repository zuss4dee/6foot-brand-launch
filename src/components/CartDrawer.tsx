import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { CartLineItem } from "@/components/CartLineItem";
import { useShopifyCheckout } from "@/hooks/useShopifyCheckout";
import { useCart } from "@/lib/cart";
import { useCustomerAuth } from "@/lib/customer-auth";
import { formatPrice } from "@/lib/products";

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
            <div className="flex items-center justify-between border-b border-foreground/10 px-6 py-6 md:px-8">
              <p className="label">Your bag · {count}</p>
              <button type="button" onClick={() => setOpen(false)} className="label hover:opacity-60">
                Close ✕
              </button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col px-6 md:px-8">
              {enriched.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center text-center">
                  <p className="mb-4 text-sm uppercase tracking-widest text-foreground">
                    YOUR BAG IS CURRENTLY EMPTY.
                  </p>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="text-xs uppercase tracking-wider text-neutral-500 underline underline-offset-4 transition-opacity hover:opacity-70"
                  >
                    RETURN TO ESSENTIALS
                  </button>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto py-6">
                  <ul className="space-y-8">
                    {enriched.map(({ item, product }) => (
                      <CartLineItem
                        key={`${item.slug}-${item.size}`}
                        item={item}
                        product={product}
                        onClose={() => setOpen(false)}
                        onRemove={() => remove(item.slug, item.size)}
                        onSetQty={(qty) => setQty(item.slug, item.size, qty)}
                      />
                    ))}
                  </ul>
                  <p className="label mt-8 text-center text-foreground/40">Swipe left to remove</p>
                </div>
              )}
            </div>

            {enriched.length > 0 && (
              <div className="space-y-4 border-t border-foreground/10 px-6 py-6 md:px-8">
                <div className="flex items-baseline justify-between">
                  <span className="label text-foreground/60">Subtotal</span>
                  <span className="display text-2xl">{formatPrice(subtotal)}</span>
                </div>
                <p className="label text-foreground/50">Shipping and taxes calculated at checkout.</p>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <GuestCheckoutLoginHint />
                <button
                  type="button"
                  onClick={checkout}
                  disabled={loading}
                  className="label block w-full bg-foreground px-6 py-5 text-center text-background transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
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
