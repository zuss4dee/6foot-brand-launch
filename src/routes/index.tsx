import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";

import { useCart } from "@/lib/cart";
import launchLeft from "@/assets/launch-left-model.png";
import launchRight from "@/assets/launch-right-model.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "6foot — Choose Your Path" },
      {
        name: "description",
        content:
          "Premium minimalist essentials proportioned for the tall frame. Shop Drop 001 or join the waitlist for Drop 002.",
      },
      { property: "og:title", content: "6foot — Built for the Tall Frame" },
      {
        property: "og:description",
        content: "Shop the capsule or explore what's coming next.",
      },
    ],
  }),
  component: Launch,
});

const ticker = [
  "+2 inch hems",
  "240gsm cotton",
  "Proportioned blocks",
  "Amsterdam studio",
  "Drop 001 — SS26",
];

const trustItems = [
  "Free EU delivery over €150",
  "240gsm heavyweight cotton",
  "Proportioned tall blocks",
  "Amsterdam studio",
];

const footerNav = {
  explore: [
    { label: "The Blueprint", to: "/home", hash: "blueprint" as const },
    { label: "The Capsule", to: "/home", hash: "capsule" as const },
    { label: "Drop 002", to: "/coming-soon" },
    { label: "Shop All", to: "/shop" },
  ],
  help: [
    { label: "Contact", href: "mailto:studio@6foot.eu" },
    { label: "Shipping", href: "#" },
    { label: "Returns", href: "#" },
    { label: "Size Guide", href: "#" },
  ],
  legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Cookies", href: "#" },
  ],
};

function LaunchHeader({ count, onOpenCart }: { count: number; onOpenCart: () => void }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      className="absolute inset-x-0 top-0 z-40 bg-background"
    >
      <div className="flex items-center justify-between px-6 py-5 text-foreground md:px-10 md:py-6">
        <span className="label text-foreground/50">SS26</span>
        <Link to="/" className="display text-2xl tracking-tighter md:text-3xl">
          6foot.
        </Link>
        <div className="flex items-center gap-5 md:gap-6">
          <span className="label hidden text-foreground/50 sm:inline">EU / EN</span>
          <button
            type="button"
            onClick={onOpenCart}
            className="label inline-flex items-center gap-2 transition-opacity hover:opacity-60"
            aria-label="Open cart"
          >
            Bag
            <span className="tabular-nums">{count}</span>
          </button>
        </div>
      </div>
    </motion.header>
  );
}

function Launch() {
  const { count, setOpen } = useCart();

  return (
    <>
      <main className="relative flex h-svh flex-col overflow-hidden bg-background text-foreground">
        <LaunchHeader count={count} onOpenCart={() => setOpen(true)} />

        <div className="relative flex min-h-0 flex-1 flex-col md:flex-row">
          <LaunchPanel
            side="left"
            ctaTo="/shop"
            image={launchLeft}
            imageAlt="Model in black proportioned essentials"
            chapter="Drop 001 / SS26"
            title="The Capsule"
            subtitle='Four proportioned essentials. Engineered +2" through the body.'
            cta="Shop Now"
            delay={0.2}
          />
          <LaunchPanel
            side="right"
            image={launchRight}
            imageAlt="Young Black man in black proportioned essentials"
            chapter="Drop 002 / AW26"
            title="Coming Soon"
            subtitle="Next chapter of the tall block. Join the list for first access."
            cta="Join Waitlist"
            delay={0.35}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
          className="relative z-30 shrink-0"
        >
          <div className="grid border-t border-foreground/10 bg-background md:grid-cols-2">
            <div className="overflow-hidden md:border-r md:border-foreground/10">
              <div className="hidden px-6 py-4 md:block md:px-10 md:py-5">
                <motion.div
                  className="flex gap-10 whitespace-nowrap"
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                >
                  {[...ticker, ...ticker, ...ticker].map((item, i) => (
                    <span key={i} className="label text-foreground/45">
                      {item}
                      <span className="mx-10 opacity-30">/</span>
                    </span>
                  ))}
                </motion.div>
              </div>
              <div className="flex flex-col items-center gap-3 px-6 py-4 md:hidden">
                <Link
                  to="/home"
                  className="label group inline-flex items-center gap-3 text-foreground transition-opacity hover:opacity-60"
                >
                  Explore the brand
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
                <p className="label text-foreground/45">Built for the tall frame</p>
              </div>
            </div>
            <div className="hidden px-6 py-4 md:block md:px-10 md:py-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <Link
                  to="/home"
                  className="label group inline-flex items-center gap-3 text-foreground transition-opacity hover:opacity-60"
                >
                  Explore the brand
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
                <p className="label text-foreground/45">Built for the tall frame</p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <TrustBar />
      <LaunchFooter />
    </>
  );
}

function LaunchPanel({
  side,
  ctaTo,
  image,
  imageAlt,
  chapter,
  title,
  subtitle,
  cta,
  delay,
}: {
  side: "left" | "right";
  ctaTo?: string;
  image: string;
  imageAlt: string;
  chapter: string;
  title: string;
  subtitle: string;
  cta: string;
  delay: number;
}) {
  return (
    <div
      className={`relative min-h-[42svh] flex-1 overflow-hidden bg-background md:min-h-0 ${
        side === "left" ? "md:border-r md:border-foreground/10" : ""
      }`}
    >
      <div className="relative h-full">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-end justify-center pt-[4.75rem] md:pt-[5.25rem]"
        >
          <img
            src={image}
            alt={imageAlt}
            decoding="async"
            className="max-h-full w-auto max-w-full object-contain object-bottom"
          />
        </div>

        <div className="relative z-20 flex h-full flex-col justify-end px-6 pb-8 md:px-10 md:pb-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
            className={`max-w-[16rem] ${side === "right" ? "md:ml-auto md:text-right" : ""}`}
          >
            <p className="label mb-2 text-foreground/60">{chapter}</p>
            <h2 className="display text-2xl text-foreground md:text-[1.75rem]">{title}</h2>
            <p
              className={`mt-2 max-w-[28ch] text-xs leading-relaxed text-foreground/70 md:text-sm ${
                side === "right" ? "md:ml-auto" : ""
              }`}
            >
              {subtitle}
            </p>
            {ctaTo ? (
              <Link
                to={ctaTo}
                className={`group mt-5 inline-flex items-center gap-3 border-b border-foreground/30 pb-0.5 text-foreground transition-all duration-300 hover:gap-4 ${
                  side === "right" ? "md:ml-auto" : ""
                }`}
              >
                <span className="label">{cta}</span>
                <span className="display text-sm">→</span>
              </Link>
            ) : (
              <span
                className={`mt-5 inline-flex items-center gap-3 border-b border-foreground/30 pb-0.5 text-foreground ${
                  side === "right" ? "md:ml-auto" : ""
                }`}
              >
                <span className="label">{cta}</span>
                <span className="display text-sm">→</span>
              </span>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function TrustBar() {
  return (
    <section className="border-y border-foreground/10 bg-secondary/20">
      <div className="grid grid-cols-1 divide-y divide-foreground/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
        {trustItems.map((item) => (
          <p
            key={item}
            className="label px-6 py-4 text-center text-foreground/55 md:px-8 md:py-5"
          >
            {item}
          </p>
        ))}
      </div>
    </section>
  );
}

function LaunchFooter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <footer className="border-t border-foreground/10 bg-background px-6 md:px-10">
      <div className="mx-auto max-w-7xl pt-14 pb-10 md:pt-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] lg:gap-10">
          <div>
            <p className="label mb-6 text-foreground/50">Newsletter</p>
            <h3 className="display mb-4 text-2xl md:text-3xl">Join the waitlist</h3>
            <p className="mb-6 max-w-[36ch] text-sm leading-relaxed text-foreground/65">
              First access to Drop 001 and 002. No restocks, no markdowns, no marketing noise.
            </p>
            {sent ? (
              <p className="display text-xl">Confirmed. Watch your inbox.</p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.includes("@")) setSent(true);
                }}
                className="space-y-4"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email"
                  className="w-full border-b border-foreground/25 bg-transparent py-3 text-base outline-none placeholder:text-foreground/30 focus:border-foreground"
                />
                <button
                  type="submit"
                  className="label border border-foreground px-6 py-3 transition-colors hover:bg-foreground hover:text-background"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>

          <div>
            <p className="label mb-6 text-foreground/50">Explore</p>
            <ul className="space-y-3">
              {footerNav.explore.map((item) =>
                "hash" in item && item.hash ? (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      hash={item.hash}
                      className="text-base transition-opacity hover:opacity-60"
                    >
                      {item.label}
                    </Link>
                  </li>
                ) : (
                  <li key={item.label}>
                    <Link to={item.to} className="text-base transition-opacity hover:opacity-60">
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
              <li>
                <Link to="/home" className="text-base transition-opacity hover:opacity-60">
                  About 6foot
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="label mb-6 text-foreground/50">Help & Info</p>
            <ul className="space-y-3">
              {footerNav.help.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-base transition-opacity hover:opacity-60">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label mb-6 text-foreground/50">Studio</p>
            <p className="text-base">studio@6foot.eu</p>
            <p className="mt-2 text-base text-foreground/60">Amsterdam, NL</p>
            <p className="label mt-8 text-foreground/45">Drop 001 — SS26</p>
            <p className="label mt-1 text-foreground/45">Built for the tall frame</p>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-foreground/10 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="label text-foreground/45">© 6foot studio MMXXVI</p>
          <ul className="flex flex-wrap gap-6">
            {footerNav.legal.map((item) => (
              <li key={item.label}>
                <a href={item.href} className="label text-foreground/45 transition-opacity hover:opacity-80">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="label text-foreground/45">EU / EN · EUR €</p>
        </div>

        <p className="label mt-6 text-center text-foreground/40 md:text-left">
          6foot uses cookies to improve your experience.{" "}
          <a href="#" className="underline underline-offset-2 hover:opacity-70">
            Accept
          </a>{" "}
          or{" "}
          <a href="#" className="underline underline-offset-2 hover:opacity-70">
            Decline
          </a>
        </p>
      </div>
    </footer>
  );
}
