import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { useCustomerAuth } from "@/lib/customer-auth";

const mobileLinks = [
  { label: "Shop", to: "/shop" as const },
  { label: "Blueprint", to: "/coming-soon" as const },
  { label: "Drop 002", to: "/coming-soon" as const },
  { label: "Waitlist", to: "/" as const, hash: "waitlist" },
];

export function SiteNav() {
  const { count, setOpen } = useCart();
  const { session } = useCustomerAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className={`fixed top-0 left-0 right-0 z-50 safe-top transition-colors duration-500 ${
          scrolled || menuOpen ? "bg-background/90 backdrop-blur-md border-b border-foreground/10" : ""
        }`}
      >
        <div className="grid grid-cols-[1fr_auto_1fr] items-center px-4 py-4 md:px-10 md:py-5">
          <div className="flex items-center gap-3 justify-self-start">
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className="touch-target inline-flex items-center justify-center md:hidden"
            >
              {menuOpen ? (
                <X className="h-5 w-5" strokeWidth={1.25} />
              ) : (
                <Menu className="h-5 w-5" strokeWidth={1.25} />
              )}
            </button>
            <Link to="/" className="display text-xl tracking-tighter md:text-2xl">
              6foot.
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-10 justify-self-center">
            <Link to="/shop" className="label hover:opacity-60 transition-opacity" activeProps={{ className: "label opacity-100" }}>
              Shop
            </Link>
            <Link to="/coming-soon" className="label hover:opacity-60 transition-opacity">
              Blueprint
            </Link>
            <Link to="/coming-soon" className="label hover:opacity-60 transition-opacity">
              Drop 002
            </Link>
            <Link to="/" hash="waitlist" className="label hover:opacity-60 transition-opacity">
              Waitlist
            </Link>
          </nav>

          <div className="justify-self-end flex items-center gap-4 md:gap-6">
            <span className="label text-foreground/50 hidden md:inline">UK / EN</span>
            <Link
              to={session.authenticated ? "/account" : "/login"}
              className="label hidden touch-target items-center transition-opacity hover:opacity-60 sm:inline-flex"
            >
              {session.authenticated ? "Account" : "Log In"}
            </Link>
            <button
              onClick={() => setOpen(true)}
              className="label touch-target inline-flex items-center justify-center gap-2 hover:opacity-60 transition-opacity"
              aria-label="Open cart"
            >
              Bag
              <span className="relative inline-flex h-5 w-5 items-center justify-center text-[10px] font-medium">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={count}
                    initial={{ y: -8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 8, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="absolute inset-0 grid place-items-center"
                  >
                    {count}
                  </motion.span>
                </AnimatePresence>
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 bg-foreground/20 md:hidden"
            />
            <motion.nav
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-0 top-[calc(3.5rem+env(safe-area-inset-top))] z-40 border-b border-foreground/10 bg-background px-4 py-6 md:hidden"
            >
              <ul className="space-y-1">
                {mobileLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      hash={item.hash}
                      onClick={() => setMenuOpen(false)}
                      className="flex min-h-11 items-center text-base lowercase transition-opacity hover:opacity-60"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to={session.authenticated ? "/account" : "/login"}
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-11 items-center text-base lowercase transition-opacity hover:opacity-60"
                  >
                    {session.authenticated ? "Account" : "Log In"}
                  </Link>
                </li>
              </ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
