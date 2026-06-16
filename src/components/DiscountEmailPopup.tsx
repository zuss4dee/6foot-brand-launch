import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";

const STORAGE_KEY = "6foot_discount_popup";
const SHOW_DELAY_MS = 3000;

function hasResolvedPopup() {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(STORAGE_KEY) === "submitted" || localStorage.getItem(STORAGE_KEY) === "dismissed";
}

export function DiscountEmailPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (hasResolvedPopup()) return;

    const timer = window.setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "dismissed");
    setOpen(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.includes("@")) return;

    localStorage.setItem(STORAGE_KEY, "submitted");
    setSubmitted(true);
    window.setTimeout(() => setOpen(false), 1800);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
          <motion.button
            type="button"
            aria-label="Dismiss offer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-foreground/10 backdrop-blur-md"
            onClick={dismiss}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="discount-popup-title"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-[81] w-full max-w-md border border-foreground bg-background px-6 py-8 md:px-8 md:py-10"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={dismiss}
              aria-label="Close"
              className="absolute right-4 top-4 text-foreground/45 transition-opacity hover:text-foreground"
            >
              <X className="h-4 w-4" strokeWidth={1.25} />
            </button>

            {submitted ? (
              <div className="pr-6">
                <p className="label text-foreground/50">Confirmed</p>
                <h2 id="discount-popup-title" className="display mt-3 text-2xl leading-tight">
                  Your 10% is on the way.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-foreground/65">
                  Check your inbox for your welcome code.
                </p>
              </div>
            ) : (
              <>
                <p className="label text-foreground/50">Welcome offer</p>
                <h2 id="discount-popup-title" className="display mt-3 text-[clamp(1.75rem,7vw,2.25rem)] leading-[0.95]">
                  10% off your first order.
                </h2>
                <p className="mt-3 max-w-[34ch] text-sm leading-relaxed text-foreground/65">
                  Join the registry. One email. Early access and a private welcome code.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  <div>
                    <label htmlFor="discount-email" className="label mb-3 block text-foreground/50">
                      Email
                    </label>
                    <input
                      id="discount-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="your@email"
                      className="w-full border-0 border-b border-foreground bg-transparent py-3 text-base outline-none placeholder:text-foreground/30 focus:border-foreground"
                    />
                  </div>

                  <button
                    type="submit"
                    className="label w-full bg-foreground py-4 text-background transition-opacity hover:opacity-90"
                  >
                    Claim 10% off
                  </button>
                </form>

                <button
                  type="button"
                  onClick={dismiss}
                  className="label mt-5 w-full text-foreground/45 transition-opacity hover:text-foreground"
                >
                  No thanks
                </button>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
