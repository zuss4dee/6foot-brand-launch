import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Menu, ShoppingBag, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { useCustomerAuth } from "@/lib/customer-auth";

const navLinks = [
  { label: "Shop", to: "/shop" as const },
  { label: "Blueprint", to: "/coming-soon" as const },
  { label: "Drop 002", to: "/coming-soon" as const },
];

const defaultPromo =
  "COMPLIMENTARY UK SHIPPING OVER £150 // 240GSM HEAVYWEIGHT COTTON // ENGINEERED TALL BLOCKS // MANCHESTER STUDIO";

type SiteNavProps = {
  promoText?: string;
  showPromo?: boolean;
};

export function SiteNav({ promoText = defaultPromo, showPromo = true }: SiteNavProps) {
  const { count, setOpen } = useCart();
  const { session } = useCustomerAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const accountTo = session.authenticated ? "/account" : "/login";
  const accountLabel = session.authenticated ? "Account" : "Log In";

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

  const headerSolid = scrolled || menuOpen;

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className={`fixed top-0 left-0 right-0 z-50 safe-top transition-colors duration-500 ${
          headerSolid ? "bg-background border-b border-foreground/10" : "bg-background md:bg-transparent"
        }`}
      >
        <div className="grid grid-cols-[minmax(2.75rem,1fr)_auto_minmax(2.75rem,1fr)] items-center gap-2 px-4 py-3.5 md:px-10 md:py-5">
          <div className="flex items-center justify-self-start">
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className="touch-target -ml-1 inline-flex items-center justify-center md:hidden"
            >
              {menuOpen ? (
                <X className="h-5 w-5" strokeWidth={1.25} />
              ) : (
                <Menu className="h-5 w-5" strokeWidth={1.25} />
              )}
            </button>
            <Link
              to="/"
              className="display hidden text-2xl tracking-tighter md:inline-block"
              onClick={() => setMenuOpen(false)}
            >
              6foot.
            </Link>
          </div>

          <div className="flex min-w-0 items-center justify-center justify-self-center px-1">
            <Link
              to="/"
              className="display shrink-0 text-xl tracking-tighter md:hidden"
              onClick={() => setMenuOpen(false)}
            >
              6foot.
            </Link>
            <nav className="hidden items-center gap-10 md:flex">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  hash={item.hash}
                  className="label hover:opacity-60 transition-opacity"
                  activeProps={item.to === "/shop" ? { className: "label opacity-100" } : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center justify-end justify-self-end gap-3 md:gap-5">
            <span className="label text-foreground/50 hidden lg:inline">UK / EN</span>
            <Link
              to={accountTo}
              aria-label={accountLabel}
              className="touch-target inline-flex items-center justify-center transition-opacity hover:opacity-60 md:hidden"
              onClick={() => setMenuOpen(false)}
            >
              <User className="h-5 w-5" strokeWidth={1.25} />
            </Link>
            <Link
              to={accountTo}
              className="label hidden touch-target items-center transition-opacity hover:opacity-60 md:inline-flex"
            >
              {accountLabel}
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={`Open bag, ${count} items`}
              className="touch-target relative inline-flex items-center justify-center transition-opacity hover:opacity-60"
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.25} />
              <AnimatePresence mode="popLayout">
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-0.5 text-[9px] font-medium leading-none text-background"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
              <span className="label ml-2 hidden md:inline">
                Bag
                <span className="ml-1 tabular-nums">{count}</span>
              </span>
            </button>
          </div>
        </div>

        {showPromo && (
          <div className="overflow-hidden border-t border-foreground/10 bg-foreground text-background md:hidden">
            <motion.div
              className="flex w-max gap-10 whitespace-nowrap py-2"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
            >
              {[promoText, promoText].map((line, index) => (
                <span key={index} className="label text-[10px] tracking-wide">
                  {line}
                </span>
              ))}
            </motion.div>
          </div>
        )}
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 flex flex-col bg-background md:hidden"
            style={{ paddingTop: showPromo ? "calc(6.75rem + env(safe-area-inset-top))" : "calc(3.5rem + env(safe-area-inset-top))" }}
          >
            <div className="flex flex-1 flex-col overflow-y-auto px-6 pb-10">
              <ul className="border-t border-foreground/10">
                {navLinks.map((item, index) => (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + index * 0.04, duration: 0.35 }}
                  >
                    <Link
                      to={item.to}
                      hash={item.hash}
                      onClick={() => setMenuOpen(false)}
                      className="display flex min-h-14 items-center border-b border-foreground/10 text-3xl tracking-tight"
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.35 }}
                className="mt-8 space-y-4 border-t border-foreground/10 pt-6"
              >
                <Link
                  to={accountTo}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-11 items-center gap-3 text-base"
                >
                  <User className="h-4 w-4" strokeWidth={1.25} />
                  {accountLabel}
                </Link>
                <p className="label text-foreground/45">UK / EN</p>
                <p className="text-sm text-foreground/55">Manchester studio · Drop 001</p>
              </motion.div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
