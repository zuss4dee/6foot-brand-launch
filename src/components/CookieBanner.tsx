import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "6foot_cookies_accepted";

function hasAcceptedCookies() {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(STORAGE_KEY) === "true";
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!hasAcceptedCookies()) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          role="dialog"
          aria-label="Cookie consent"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-black bg-white px-4 py-4 md:px-6"
        >
          <div className="mx-auto flex max-w-[1600px] flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <p className="text-xs uppercase tracking-wider text-foreground">
              We use cookies to optimize your experience. By continuing to browse, you accept our{" "}
              <Link to="/privacy" className="underline underline-offset-2 hover:opacity-70">
                privacy policy
              </Link>
              .
            </p>
            <button
              type="button"
              onClick={accept}
              className="shrink-0 text-xs uppercase tracking-wider text-foreground transition-opacity hover:opacity-60"
            >
              [ ACCEPT ]
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
