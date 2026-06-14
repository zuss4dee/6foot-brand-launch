import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";

export function SiteNav() {
  const { count, setOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        scrolled ? "bg-background/80 backdrop-blur-md border-b border-foreground/10" : ""
      }`}
    >
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-6 md:px-10 py-5">
        <Link to="/" className="display text-2xl tracking-tighter">
          6foot.
        </Link>

        <nav className="hidden md:flex items-center gap-10 justify-self-center">
          <Link to="/shop" className="label hover:opacity-60 transition-opacity" activeProps={{ className: "label opacity-100" }}>
            Shop
          </Link>
          <Link to="/" hash="blueprint" className="label hover:opacity-60 transition-opacity">
            Blueprint
          </Link>
          <Link to="/coming-soon" className="label hover:opacity-60 transition-opacity">
            Drop 002
          </Link>
          <Link to="/" hash="waitlist" className="label hover:opacity-60 transition-opacity">
            Waitlist
          </Link>
        </nav>

        <div className="justify-self-end flex items-center gap-6">
          <span className="label text-foreground/50 hidden md:inline">EU / EN</span>
          <button
            onClick={() => setOpen(true)}
            className="label inline-flex items-center gap-2 hover:opacity-60 transition-opacity"
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
  );
}