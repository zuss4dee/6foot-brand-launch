import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { useCart } from "@/lib/cart";
import { formatPrice, productFitImageClass } from "@/lib/products";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — 6foot" },
      { name: "description", content: "Complete your order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const { enriched, subtotal, setQty, remove, clear } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<"contact" | "shipping" | "payment">("contact");
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);

  const shipping = subtotal >= 150 ? 0 : subtotal > 0 ? 12 : 0;
  const total = subtotal + shipping;

  const next = () => {
    if (step === "contact") setStep("shipping");
    else if (step === "shipping") setStep("payment");
    else {
      setPlacing(true);
      setTimeout(() => {
        setPlacing(false);
        setPlaced(true);
        clear();
      }, 1500);
    }
  };

  if (placed) {
    return (
      <main className="bg-background text-foreground min-h-screen">
        <SiteNav />
        <section className="px-6 md:px-10 pt-40 pb-32 max-w-3xl">
          <p className="label text-foreground/60">Order confirmed</p>
          <h1 className="display text-6xl md:text-7xl mt-4 leading-[0.9]">Thank you.</h1>
          <p className="text-base md:text-lg mt-8 max-w-[44ch] text-foreground/80">
            Your order has been logged. A confirmation will follow shortly with tracking once the
            piece leaves the studio.
          </p>
          <div className="mt-12 flex gap-6">
            <Link to="/shop" className="label inline-flex items-center gap-3 hover:opacity-60">
              Continue browsing <span className="h-px w-10 bg-foreground" />
            </Link>
            <button
              onClick={() => navigate({ to: "/" })}
              className="label inline-flex items-center gap-3 hover:opacity-60"
            >
              Back home
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (enriched.length === 0) {
    return (
      <main className="bg-background text-foreground min-h-screen">
        <SiteNav />
        <section className="px-6 md:px-10 pt-40 pb-32">
          <p className="label text-foreground/60">Checkout</p>
          <h1 className="display text-5xl md:text-6xl mt-4">Nothing to check out.</h1>
          <Link to="/shop" className="label inline-flex items-center gap-3 mt-10">
            Browse the capsule <span className="h-px w-10 bg-foreground" />
          </Link>
        </section>
      </main>
    );
  }

  const steps = ["contact", "shipping", "payment"] as const;

  return (
    <main className="bg-background text-foreground min-h-screen">
      <SiteNav />

      <section className="px-6 md:px-10 pt-32 md:pt-36 pb-24">
        <div className="grid grid-cols-12 gap-x-10 gap-y-12">
          {/* Form column */}
          <div className="col-span-12 lg:col-span-7">
            <p className="label text-foreground/60">Checkout</p>
            <h1 className="display text-4xl md:text-5xl mt-2">Complete your order.</h1>

            {/* Stepper */}
            <ol className="mt-10 flex items-center gap-3">
              {steps.map((s, i) => {
                const active = step === s;
                const done = steps.indexOf(step) > i;
                return (
                  <li key={s} className="flex items-center gap-3">
                    <button
                      onClick={() => done && setStep(s)}
                      className={`label transition-opacity ${active ? "opacity-100" : done ? "opacity-100 hover:opacity-70" : "opacity-30"}`}
                    >
                      {String(i + 1).padStart(2, "0")} {s}
                    </button>
                    {i < steps.length - 1 && <span className="h-px w-6 bg-foreground/20" />}
                  </li>
                );
              })}
            </ol>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                next();
              }}
              className="mt-10 space-y-6"
            >
              <AnimatePresence mode="wait">
                {step === "contact" && (
                  <motion.div
                    key="contact"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35 }}
                    className="space-y-5"
                  >
                    <Field label="Email" type="email" required />
                    <div className="grid grid-cols-2 gap-5">
                      <Field label="First name" required />
                      <Field label="Last name" required />
                    </div>
                  </motion.div>
                )}
                {step === "shipping" && (
                  <motion.div
                    key="shipping"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35 }}
                    className="space-y-5"
                  >
                    <Field label="Address" required />
                    <Field label="Apartment, suite (optional)" />
                    <div className="grid grid-cols-2 gap-5">
                      <Field label="City" required />
                      <Field label="Postal code" required />
                    </div>
                    <Field label="Country" defaultValue="Netherlands" required />
                  </motion.div>
                )}
                {step === "payment" && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35 }}
                    className="space-y-5"
                  >
                    <Field label="Card number" placeholder="0000 0000 0000 0000" required />
                    <div className="grid grid-cols-2 gap-5">
                      <Field label="Expiry" placeholder="MM / YY" required />
                      <Field label="CVC" placeholder="•••" required />
                    </div>
                    <p className="label text-foreground/50">
                      This is a demo. No card will be charged.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-6 flex items-center justify-between">
                {step !== "contact" ? (
                  <button
                    type="button"
                    onClick={() =>
                      setStep(step === "payment" ? "shipping" : "contact")
                    }
                    className="label hover:opacity-60"
                  >
                    ← Back
                  </button>
                ) : (
                  <Link to="/shop" className="label hover:opacity-60">
                    ← Keep shopping
                  </Link>
                )}
                <motion.button
                  type="submit"
                  disabled={placing}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="bg-foreground text-background label px-8 py-5 inline-flex items-center gap-4 disabled:opacity-50"
                >
                  {placing
                    ? "Placing order…"
                    : step === "payment"
                      ? `Pay ${formatPrice(total)}`
                      : "Continue →"}
                </motion.button>
              </div>
            </form>
          </div>

          {/* Summary */}
          <aside className="col-span-12 lg:col-span-5">
            <div className="lg:sticky lg:top-32 bg-foreground/[0.03] p-6 md:p-8 space-y-6">
              <p className="label text-foreground/60">Order — {enriched.length} items</p>
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
                      <p className="label text-foreground/50 mt-1">Size {item.size}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="inline-flex items-center border border-foreground/15">
                          <button
                            type="button"
                            onClick={() => setQty(item.slug, item.size, item.qty - 1)}
                            className="px-2 py-0.5 label"
                          >
                            −
                          </button>
                          <span className="label px-2">{item.qty}</span>
                          <button
                            type="button"
                            onClick={() => setQty(item.slug, item.size, item.qty + 1)}
                            className="px-2 py-0.5 label"
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

              <div className="border-t border-foreground/10 pt-5 space-y-2 text-sm">
                <Row label="Subtotal" value={formatPrice(subtotal)} />
                <Row label="Shipping" value={shipping === 0 ? "Free" : formatPrice(shipping)} />
              </div>
              <div className="border-t border-foreground/15 pt-5 flex items-baseline justify-between">
                <span className="label">Total</span>
                <span className="display text-2xl">{formatPrice(total)}</span>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="label text-foreground/60">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function Field({
  label,
  type = "text",
  required,
  placeholder,
  defaultValue,
}: {
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="label text-foreground/60 block mb-2">{label}</span>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full bg-transparent border-b border-foreground/25 py-3 text-base focus:border-foreground outline-none transition-colors placeholder:text-foreground/30"
      />
    </label>
  );
}