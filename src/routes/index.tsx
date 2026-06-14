import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

import { useCart } from "@/lib/cart";
import launchLeft from "@/assets/launch-left-model.png";
import launchRight from "@/assets/launch-right-model.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "6foot — Built for the Tall Frame" },
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

const heroEntrance = {
  ruleH: { duration: 1.65, delay: 1.05 },
  ruleV: { duration: 2, delay: 1.3 },
  watermark: { duration: 2.4, delay: 0.85 },
  headlineWord: { duration: 1, stagger: 0.12, start: 1.15 },
  shopCta: { duration: 0.9, delay: 2.35 },
  scrollCue: { delay: 2.75 },
  panelCopy: { duration: 1, leftDelay: 0.55, rightDelay: 0.75 },
};
const ticker = [
  "+2 inch hems",
  "240gsm cotton",
  "Proportioned blocks",
  "Amsterdam studio",
  "Drop 001 — SS26",
];

const trustItems = [
  "Free UK delivery over £150",
  "240gsm heavyweight cotton",
  "Proportioned tall blocks",
  "Amsterdam studio",
];

const footerNav = {
  explore: [
    { label: "The Blueprint", to: "/coming-soon" },
    { label: "The Capsule", to: "/shop" },
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

function LaunchHeroCenterLine() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 top-[4.75rem] z-0 md:top-[5.25rem]"
    >
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: heroEntrance.ruleH.duration, ease: [0.83, 0, 0.17, 1], delay: heroEntrance.ruleH.delay }}
        className="absolute inset-x-6 top-[3.5rem] h-px origin-center bg-foreground/10 md:inset-x-10 md:top-[3.75rem]"
      />
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: heroEntrance.ruleV.duration, ease: [0.83, 0, 0.17, 1], delay: heroEntrance.ruleV.delay }}
        className="absolute bottom-0 left-1/2 top-0 hidden w-px origin-top -translate-x-1/2 bg-foreground/10 md:block"
      />
    </div>
  );
}

function LaunchHeroWatermark() {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0, scale: 1.06 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: heroEntrance.watermark.duration, ease: [0.22, 1, 0.36, 1], delay: heroEntrance.watermark.delay }}
      className="pointer-events-none absolute inset-x-0 bottom-0 top-[4.75rem] z-[8] flex items-center justify-center overflow-hidden md:top-[5.25rem]"
    >
      <p className="display select-none text-[clamp(7rem,26vw,20rem)] leading-none tracking-tighter text-foreground/[0.035]">
        6foot
      </p>
    </motion.div>
  );
}

function LaunchHeroStage({ children }: { children: ReactNode }) {
  return <div className="relative flex min-h-0 flex-1 flex-col">{children}</div>;
}

function LaunchHeroMeta() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
      className="pointer-events-none absolute inset-x-0 top-[4.75rem] z-30 px-6 md:top-[5.25rem] md:px-10"
    >
      <div className="grid grid-cols-2 items-start gap-4 pb-4 md:pb-5">
        <p className="label max-w-[14ch] text-foreground/50">
          Chapter 01 — Proportioned essentials
        </p>
        <p className="label justify-self-end text-right text-foreground/50">
          Drop 001 / SS26
          <br />
          Amsterdam studio
        </p>
      </div>
    </motion.div>
  );
}

const headline = ["Built", "for", "the", "tall", "frame."];

const brandDrop = {
  cycle: 3.6,
  pause: 1,
  impact: 0.9,
  streams: [
    { delay: 0, peakOpacity: 0.26 },
    { delay: 1.15, peakOpacity: 0.18 },
    { delay: 2.3, peakOpacity: 0.12 },
  ],
};

function LaunchBrandDrop({
  dropPath,
  delayOffset,
  peakOpacity,
}: {
  dropPath: { start: number; end: number };
  delayOffset: number;
  peakOpacity: number;
}) {
  return (
    <motion.div
      aria-hidden
      className="display absolute left-1/2 flex -translate-x-1/2 flex-col items-center text-[11px] leading-[0.88] tracking-tight text-foreground/20 md:text-xs"
      animate={{
        y: [dropPath.start, dropPath.end],
        opacity: [0, peakOpacity, peakOpacity, 0],
      }}
      transition={{
        duration: brandDrop.cycle,
        repeat: Infinity,
        repeatDelay: brandDrop.pause,
        delay: heroEntrance.scrollCue.delay + delayOffset,
        ease: [0.35, 0, 0.95, 0.45],
        times: [0, 0.08, brandDrop.impact, 1],
      }}
    >
      <span>6</span>
      <span>f</span>
      <span>o</span>
      <span>o</span>
      <span>t</span>
    </motion.div>
  );
}

function LaunchBrandDropLane() {
  const laneRef = useRef<HTMLDivElement>(null);
  const [dropPath, setDropPath] = useState<{ start: number; end: number } | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const lane = laneRef.current;
      const shop = document.getElementById("launch-shop-now");
      const desktopExplore = document.getElementById("launch-explore");
      const mobileExplore = document.getElementById("launch-explore-mobile");
      const explore =
        desktopExplore && desktopExplore.getBoundingClientRect().height > 0
          ? desktopExplore
          : mobileExplore;
      if (!lane || !shop || !explore) return;

      const laneRect = lane.getBoundingClientRect();
      const shopRect = shop.getBoundingClientRect();
      const exploreRect = explore.getBoundingClientRect();

      setDropPath({
        start: shopRect.bottom - laneRect.top + 8,
        end: exploreRect.top - laneRect.top + 4,
      });
    };

    measure();
    window.addEventListener("resize", measure);
    const observer = new ResizeObserver(measure);
    if (laneRef.current) observer.observe(laneRef.current);

    return () => {
      window.removeEventListener("resize", measure);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={laneRef} className="pointer-events-none absolute inset-0 z-[25] overflow-hidden">
      {dropPath
        ? brandDrop.streams.map((stream) => (
            <LaunchBrandDrop
              key={stream.delay}
              dropPath={dropPath}
              delayOffset={stream.delay}
              peakOpacity={stream.peakOpacity}
            />
          ))
        : null}
    </div>
  );
}

function LaunchShopButton() {
  return (
    <Link
      id="launch-shop-now"
      to="/shop"
      className="label mt-6 inline-flex items-center gap-3 border border-foreground px-6 py-3 transition-colors hover:bg-foreground hover:text-background"
    >
      Shop Now
    </Link>
  );
}

function LaunchHeroHeadline() {
  return (
    <div className="absolute inset-x-0 top-[30%] z-[15] px-6 text-center md:top-[28%] md:px-10">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: heroEntrance.watermark.delay * 0.45 }}
        className="label pointer-events-none mb-3 text-foreground/40 md:mb-4"
      >
        SS26 — Amsterdam
      </motion.p>
      <h1 className="display pointer-events-none mx-auto max-w-[12ch] text-[clamp(2.25rem,7.5vw,5rem)] leading-[0.88] tracking-tighter text-foreground">
        {headline.map((word, index) => (
          <motion.span
            key={word}
            initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: heroEntrance.headlineWord.duration,
              ease: [0.22, 1, 0.36, 1],
              delay: heroEntrance.headlineWord.start + index * heroEntrance.headlineWord.stagger,
            }}
            className="inline-block"
          >
            {word}
            {index < headline.length - 1 ? "\u00a0" : ""}
          </motion.span>
        ))}
      </h1>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: heroEntrance.shopCta.duration, ease: [0.22, 1, 0.36, 1], delay: heroEntrance.shopCta.delay }}
      >
        <LaunchShopButton />
      </motion.div>
    </div>
  );
}

const exploreFlashTransition = {
  duration: brandDrop.cycle,
  repeat: Infinity,
  repeatDelay: brandDrop.pause,
  times: [0, brandDrop.impact - 0.02, brandDrop.impact, brandDrop.impact + 0.14, 1],
  ease: "linear" as const,
};

const exploreGlowAnimate = {
  color: [
    "color-mix(in oklch, var(--color-foreground) 40%, transparent)",
    "color-mix(in oklch, var(--color-foreground) 40%, transparent)",
    "var(--color-foreground)",
    "var(--color-foreground)",
    "color-mix(in oklch, var(--color-foreground) 40%, transparent)",
  ],
  textShadow: [
    "0 0 0 transparent",
    "0 0 0 transparent",
    "0 0 10px color-mix(in oklch, var(--color-foreground) 55%, transparent), 0 0 22px color-mix(in oklch, var(--color-foreground) 28%, transparent)",
    "0 0 4px color-mix(in oklch, var(--color-foreground) 18%, transparent)",
    "0 0 0 transparent",
  ],
};

function LaunchHeroScrollCue() {
  return (
    <motion.button
      type="button"
      id="launch-explore"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ opacity: { duration: 0.8, delay: heroEntrance.scrollCue.delay } }}
      onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
      className="label absolute bottom-[5.75rem] left-1/2 z-30 hidden -translate-x-1/2 flex-col items-center gap-3 text-foreground/40 transition-colors hover:text-foreground/70 md:flex"
    >
      <motion.span
        animate={exploreGlowAnimate}
        transition={{ ...exploreFlashTransition, delay: heroEntrance.scrollCue.delay }}
      >
        Explore
      </motion.span>
      <motion.span
        aria-hidden
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="block h-10 w-px origin-top bg-foreground/25"
      />
    </motion.button>
  );
}

function LaunchHeader({ count, onOpenCart }: { count: number; onOpenCart: () => void }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      className="absolute inset-x-0 top-0 z-40 bg-background"
    >
      <div className="relative flex items-center justify-between px-6 py-5 text-foreground md:px-10 md:py-6">
        <span className="label text-foreground/50">SS26</span>
        <Link
          to="/"
          className="absolute left-1/2 display -translate-x-1/2 text-2xl tracking-tighter md:text-3xl"
        >
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
        <LaunchBrandDropLane />
        <LaunchHeader count={count} onOpenCart={() => setOpen(true)} />

        <LaunchHeroStage>
          <LaunchHeroCenterLine />
          <LaunchHeroWatermark />
          <LaunchHeroMeta />
          <LaunchHeroHeadline />
          <LaunchHeroScrollCue />

          <div className="relative z-[12] flex min-h-0 flex-1 flex-col md:flex-row">
          <LaunchPanel
            side="left"
            ctaTo="/shop"
            image={launchRight}
            imageAlt="Young Black man in black proportioned essentials"
            chapter="Drop 001 / SS26"
            title="The Capsule"
            subtitle='Four proportioned essentials. Engineered +2" through the body.'
            cta="Shop Now"
          />
          <LaunchPanel
            side="right"
            image={launchLeft}
            imageAlt="Model in black proportioned essentials"
            chapter="Drop 002 / AW26"
            title="Coming Soon"
            subtitle="Next chapter of the tall block. Join the list for first access."
            cta="Join Waitlist"
          />
          </div>
        </LaunchHeroStage>

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
                <button
                  id="launch-explore-mobile"
                  type="button"
                  onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
                  className="label group inline-flex items-center gap-3 transition-opacity hover:opacity-60"
                >
                  <motion.span
                    animate={exploreGlowAnimate}
                    transition={{ ...exploreFlashTransition, delay: heroEntrance.scrollCue.delay }}
                  >
                    Explore the brand
                  </motion.span>
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </button>
                <p className="label text-foreground/45">Built for the tall frame</p>
              </div>
            </div>
            <div className="hidden px-6 py-4 md:block md:px-10 md:py-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
                  className="label group inline-flex items-center gap-3 text-foreground transition-opacity hover:opacity-60"
                >
                  Explore the brand
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </button>
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
}: {
  side: "left" | "right";
  ctaTo?: string;
  image: string;
  imageAlt: string;
  chapter: string;
  title: string;
  subtitle: string;
  cta: string;
}) {
  return (
    <div className="relative min-h-[42svh] flex-1 overflow-hidden bg-background md:min-h-0">
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
            transition={{
              duration: heroEntrance.panelCopy.duration,
              ease: [0.22, 1, 0.36, 1],
              delay: side === "left" ? heroEntrance.panelCopy.leftDelay : heroEntrance.panelCopy.rightDelay,
            }}
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
          <div id="waitlist">
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
              {footerNav.explore.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-base transition-opacity hover:opacity-60">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/" className="text-base transition-opacity hover:opacity-60">
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
          <p className="label text-foreground/45">UK / EN · GBP £</p>
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
