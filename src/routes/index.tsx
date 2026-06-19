import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

import { SiteNav } from "@/components/SiteNav";
import { VaultGate, hasVaultVipAccess } from "@/components/VaultGate";
import { IS_PRE_LAUNCH_MODE } from "@/lib/pre-launch";
import fabric from "@/assets/fabric.jpg";
import launchLeft from "@/assets/launch-left-model.png";
import launchRight from "@/assets/launch-right-model.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "6foot | Built for the Tall Frame" },
      {
        name: "description",
        content:
          "Proportioned streetwear for the tall frame. Shop Drop 001 or join the waitlist for Drop 002.",
      },
      { property: "og:title", content: "6foot | Built for the Tall Frame" },
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
  "COMPLIMENTARY UK SHIPPING OVER £150 // 240GSM HEAVYWEIGHT COTTON // ENGINEERED TALL BLOCKS // MANCHESTER STUDIO",
];

const trustItems = [
  "Free UK delivery over £150",
  "240gsm heavyweight cotton",
  "Proportioned tall blocks",
  "Manchester studio",
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
    { label: "Shipping & Returns", to: "/shipping-returns" },
    { label: "Size Guide", href: "#" },
  ],
  legal: [
    { label: "Privacy", to: "/privacy" },
    { label: "Terms", to: "/terms" },
  ],
};

function LaunchHeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-white" />

      <div
        className="absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage: `
            linear-gradient(to right, color-mix(in oklch, var(--color-foreground) 5%, transparent) 1px, transparent 1px),
            linear-gradient(to bottom, color-mix(in oklch, var(--color-foreground) 5%, transparent) 1px, transparent 1px),
            linear-gradient(to right, color-mix(in oklch, var(--color-foreground) 9%, transparent) 1px, transparent 1px),
            linear-gradient(to bottom, color-mix(in oklch, var(--color-foreground) 9%, transparent) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px, 24px 24px, 96px 96px, 96px 96px",
        }}
      />

      <div className="absolute inset-0 opacity-[0.14] mix-blend-multiply">
        <img
          src={fabric}
          alt=""
          className="h-full w-full scale-105 object-cover"
          loading="eager"
          decoding="async"
        />
      </div>

      <div className="absolute inset-x-0 top-[38%] h-px bg-foreground/[0.07] md:top-[42%]" />
      <div className="absolute inset-x-0 bottom-[18%] h-px bg-foreground/[0.05] md:bottom-[22%]" />

      <span className="absolute left-5 header-stack-top h-5 w-5 border-l border-t border-foreground/15 md:left-10" />
      <span className="absolute right-5 header-stack-top h-5 w-5 border-r border-t border-foreground/15 md:right-10" />
      <span className="absolute bottom-5 left-5 h-5 w-5 border-b border-l border-foreground/15 md:left-10" />
      <span className="absolute bottom-5 right-5 h-5 w-5 border-b border-r border-foreground/15 md:right-10" />

      <p className="label absolute left-6 top-[calc(var(--promo-bar-height)+var(--nav-bar-height)+1.25rem+env(safe-area-inset-top))] text-[9px] text-foreground/25 md:hidden md:left-10">
        +2&quot;
      </p>
      <p className="label absolute right-6 top-[calc(var(--promo-bar-height)+var(--nav-bar-height)+1.25rem+env(safe-area-inset-top))] text-[9px] text-foreground/25 md:hidden md:right-10">
        tall block
      </p>
    </div>
  );
}

function LaunchHeroCenterLine() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 z-0 hidden md:block header-stack-top"
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
      className="pointer-events-none absolute inset-x-0 bottom-0 z-[8] hidden items-center justify-center overflow-hidden header-stack-top md:flex"
    >
      <p className="display select-none text-[clamp(4.5rem,22vw,20rem)] leading-none tracking-tighter text-foreground/[0.035] md:text-[clamp(7rem,26vw,20rem)]">
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
      className="pointer-events-none absolute inset-x-0 z-30 hidden px-4 header-stack-top md:block md:px-10"
    >
      <div className="grid grid-cols-1 items-start gap-2 pt-3 pb-3 sm:grid-cols-2 sm:gap-4 md:pt-4 md:pb-5">
        <p className="label max-w-[18ch] text-foreground/50">
          001 · PROPORTIONED ESSENTIALS
        </p>
        <p className="label text-foreground/50 sm:justify-self-end sm:text-right">
          Drop 001 / SS26
          <br />
          Manchester studio
        </p>
      </div>
    </motion.div>
  );
}

const headline = ["Built", "for", "the", "tall", "frame."];
const mobileHeadlineLines = [
  { text: "Built for", words: ["Built", "for"] },
  { text: "the tall frame.", words: ["the", "tall", "frame."] },
];

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
    <div ref={laneRef} className="pointer-events-none absolute inset-0 z-[25] hidden overflow-hidden md:block">
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

function LaunchShopButton({ id, className = "" }: { id?: string; className?: string }) {
  return (
    <Link
      id={id}
      to="/shop"
      className={`label inline-flex items-center gap-3 border border-foreground px-6 py-3 transition-colors hover:bg-foreground hover:text-background ${className}`}
    >
      Shop Now
    </Link>
  );
}

function LaunchHeroHeadline() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-[22%] z-[15] hidden px-6 text-center md:block md:top-[28%] md:px-10">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: heroEntrance.watermark.delay * 0.45 }}
        className="label pointer-events-none mb-3 text-foreground/40 md:mb-4"
      >
        SS26 · Manchester
      </motion.p>
      <h1 className="display pointer-events-none mx-auto max-w-[12ch] text-[clamp(2.25rem,7.5vw,5rem)] leading-[0.88] tracking-tighter text-foreground">
        {headline.map((word, index) => (
          <motion.span
            key={word}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
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
        className="pointer-events-auto"
      >
        <LaunchShopButton id="launch-shop-now" className="mt-6" />
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
  opacity: [0.45, 0.45, 1, 1, 0.45],
};

function LaunchHeroScrollCue() {
  return (
    <motion.button
      type="button"
      id="launch-explore"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ opacity: { duration: 0.8, delay: heroEntrance.scrollCue.delay } }}
      onClick={() => document.getElementById("launch-trust")?.scrollIntoView({ behavior: "smooth" })}
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

const launchSlides = [
  {
    side: "left" as const,
    ctaTo: "/shop" as const,
    image: launchRight,
    imageAlt: "Young Black man in black proportioned essentials",
    chapter: "Drop 001 / SS26",
    title: "The Capsule",
    subtitle: 'Four proportioned staples. Engineered with a strict +2" drop through the torso.',
    cta: "Shop Now",
  },
  {
    side: "right" as const,
    ctaTo: "/shop" as const,
    image: launchLeft,
    imageAlt: "Model in black proportioned essentials",
    chapter: "Drop 001 / SS26",
    title: "Shop the Edit",
    subtitle: "Four proportioned staples with a +2\" block through the torso. Shop the full capsule.",
    cta: "Shop Now",
  },
];

type LaunchSlide = (typeof launchSlides)[number];

function LaunchPanelCopy({
  slide,
  alignRight = false,
  showCta = false,
}: {
  slide: LaunchSlide;
  alignRight?: boolean;
  showCta?: boolean;
}) {
  return (
    <>
      <p className="label mb-2 text-foreground/60">{slide.chapter}</p>
      <h2 className="display text-2xl text-foreground md:text-[1.75rem]">{slide.title}</h2>
      <p
        className={`mt-2 max-w-[32ch] text-sm leading-relaxed text-foreground/70 ${
          alignRight ? "md:ml-auto" : ""
        }`}
      >
        {slide.subtitle}
      </p>
      {showCta && slide.ctaTo ? (
        <Link
          to={slide.ctaTo}
          className={`group mt-5 inline-flex min-h-11 items-center gap-3 border-b border-foreground/30 pb-0.5 text-foreground transition-all duration-300 hover:gap-4 ${
            alignRight ? "md:ml-auto" : ""
          }`}
        >
          <span className="label">{slide.cta}</span>
          <span className="display text-sm">→</span>
        </Link>
      ) : null}
      {showCta && !slide.ctaTo ? (
        <button
          type="button"
          onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
          className={`group mt-5 inline-flex min-h-11 items-center gap-3 border-b border-foreground/30 pb-0.5 text-left text-foreground transition-all duration-300 hover:gap-4 ${
            alignRight ? "md:ml-auto" : ""
          }`}
        >
          <span className="label">{slide.cta}</span>
          <span className="display text-sm">→</span>
        </button>
      ) : null}
    </>
  );
}

const MOBILE_CAROUSEL_INTERVAL_MS = 5000;

function LaunchMobileHeroCopy() {
  return (
    <div className="px-4 pb-2">
      <div className="flex items-start justify-between gap-4">
        <p className="label text-foreground/50">001 · PROPORTIONED ESSENTIALS</p>
        <p className="label text-foreground/35">SS26</p>
      </div>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, ease: [0.83, 0, 0.17, 1], delay: 0.2 }}
        className="mt-2 h-px w-10 origin-left bg-foreground/15"
      />

      <h1 className="display mt-3 max-w-[15ch] text-[clamp(2.125rem,11vw,3rem)] leading-[0.86] tracking-[-0.045em]">
        {mobileHeadlineLines.map((line, lineIndex) => (
          <span key={line.text} className={`block ${lineIndex === 1 ? "mt-0.5" : ""}`}>
            {line.words.map((word, wordInLineIndex) => {
              const wordIndex =
                mobileHeadlineLines
                  .slice(0, lineIndex)
                  .reduce((count, entry) => count + entry.words.length, 0) + wordInLineIndex;

              return (
                <motion.span
                  key={`${line.text}-${word}`}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.85,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.28 + wordIndex * 0.08,
                  }}
                  className={`inline-block ${lineIndex === 1 ? "text-foreground/88" : ""}`}
                >
                  {word}
                  {word !== line.words[line.words.length - 1] ? "\u00a0" : ""}
                </motion.span>
              );
            })}
          </span>
        ))}
      </h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.72 }}
        className="label mt-3 text-foreground/40"
      >
        +2&quot; tall block · Manchester studio
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.82 }}
        className="mt-4"
      >
        <LaunchShopButton id="launch-shop-now-mobile" />
      </motion.div>
    </div>
  );
}

function LaunchMobileSlideText({ slide }: { slide: LaunchSlide }) {
  return (
    <>
      <p className="label mb-2 text-foreground/60">{slide.chapter}</p>
      <h2 className="display text-2xl text-foreground">{slide.title}</h2>
      <p className="mt-2 max-w-[32ch] text-sm leading-relaxed text-foreground/70">{slide.subtitle}</p>
      {slide.ctaTo ? (
        <Link
          to={slide.ctaTo}
          className="label mt-6 flex w-full items-center justify-center bg-foreground py-4 text-background transition-opacity hover:opacity-90"
        >
          {slide.cta}
        </Link>
      ) : null}
    </>
  );
}

function LaunchMobileCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (launchSlides.length <= 1) return;

    const tick = () => {
      setActiveIndex((index) => (index + 1) % launchSlides.length);
    };

    const interval = window.setInterval(tick, MOBILE_CAROUSEL_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="relative z-[12] nav-offset md:hidden">
      <LaunchMobileHeroCopy />

      <div className="-mt-1 w-full overflow-x-clip">
        <motion.div
          className="flex w-full"
          animate={{ x: `-${activeIndex * 100}%` }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {launchSlides.map((slide) => (
            <section key={slide.title} className="w-full shrink-0">
              <div className="flex h-[min(calc(100svh-10.5rem-env(safe-area-inset-top)),940px)] items-center justify-center px-0">
                <img
                  src={slide.image}
                  alt={slide.imageAlt}
                  decoding="async"
                  draggable={false}
                  className="h-full w-auto max-w-full object-contain"
                />
              </div>
            </section>
          ))}
        </motion.div>
      </div>

      {launchSlides.length > 1 && (
        <div
          className="flex items-center justify-center gap-3 border-t border-foreground/10 py-2.5"
          aria-live="polite"
          aria-label={`Showing model ${activeIndex + 1} of ${launchSlides.length}`}
        >
          <p className="text-[10px] lowercase text-foreground/45">
            {activeIndex + 1} / {launchSlides.length}
          </p>
          <div className="flex gap-1.5">
            {launchSlides.map((slide, index) => (
              <span
                key={slide.title}
                aria-hidden
                className={`h-1.5 rounded-full transition-all ${
                  activeIndex === index ? "w-5 bg-foreground" : "w-1.5 bg-foreground/25"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-foreground/10 px-4 py-6">
        <motion.div
          key={launchSlides[activeIndex]!.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <LaunchMobileSlideText slide={launchSlides[activeIndex]!} />
        </motion.div>
      </div>
    </div>
  );
}

function Launch() {
  const [gateReady, setGateReady] = useState(!IS_PRE_LAUNCH_MODE);
  const [vipAccess, setVipAccess] = useState(false);

  useLayoutEffect(() => {
    if (!IS_PRE_LAUNCH_MODE) return;
    setVipAccess(hasVaultVipAccess());
    setGateReady(true);
  }, []);

  if (IS_PRE_LAUNCH_MODE && gateReady && !vipAccess) {
    return <VaultGate />;
  }

  if (IS_PRE_LAUNCH_MODE && !gateReady) {
    return <div className="min-h-screen bg-background" aria-hidden />;
  }

  return (
    <>
      <main className="relative flex min-h-dvh w-full max-w-full flex-col overflow-x-clip bg-white text-foreground md:h-svh md:overflow-hidden">
        <LaunchBrandDropLane />
        <SiteNav />

        <LaunchHeroStage>
          <LaunchHeroBackdrop />
          <LaunchHeroCenterLine />
          <LaunchHeroWatermark />
          <LaunchHeroMeta />
          <LaunchHeroHeadline />
          <LaunchHeroScrollCue />

          <LaunchMobileCarousel />

          <div className="relative z-[12] hidden min-h-0 flex-1 md:flex md:flex-row">
            {launchSlides.map((slide) => (
              <LaunchPanel key={slide.title} slide={slide} />
            ))}
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
                  onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
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
                  onClick={() => document.getElementById("launch-trust")?.scrollIntoView({ behavior: "smooth" })}
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

function LaunchPanel({ slide }: { slide: LaunchSlide }) {
  const alignRight = slide.side === "right";

  return (
    <div className="relative min-h-0 flex-1 overflow-hidden bg-transparent">
      <div className="relative h-full min-h-0">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-end justify-center header-stack-top"
        >
          <img
            src={slide.image}
            alt={slide.imageAlt}
            decoding="async"
            className="max-h-full w-auto max-w-full object-contain object-bottom"
          />
        </div>

        <div className="relative z-20 flex h-full flex-col justify-end px-10 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: heroEntrance.panelCopy.duration,
              ease: [0.22, 1, 0.36, 1],
              delay:
                slide.side === "left"
                  ? heroEntrance.panelCopy.leftDelay
                  : heroEntrance.panelCopy.rightDelay,
            }}
            className={`max-w-[16rem] ${alignRight ? "ml-auto text-right" : ""}`}
          >
            <LaunchPanelCopy slide={slide} alignRight={alignRight} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function TrustBar() {
  return (
    <section id="launch-trust" className="hidden border-y border-foreground/10 bg-secondary/20 md:block">
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
              Priority access to Drop 001. No restocks. No markdowns. Zero noise.
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
                <Link to="/#waitlist" className="text-base transition-opacity hover:opacity-60">
                  Newsletter
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="label mb-6 text-foreground/50">Help & Info</p>
            <ul className="space-y-3">
              {footerNav.help.map((item) => (
                <li key={item.label}>
                  {"to" in item && item.to ? (
                    <Link to={item.to} className="text-base transition-opacity hover:opacity-60">
                      {item.label}
                    </Link>
                  ) : (
                    <a href={item.href} className="text-base transition-opacity hover:opacity-60">
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label mb-6 text-foreground/50">Studio</p>
            <p className="text-base">studio@6foot.eu</p>
            <p className="mt-2 text-base text-foreground/60">Manchester, UK</p>
            <p className="label mt-8 text-foreground/45">Drop 001 · SS26</p>
            <p className="label mt-1 text-foreground/45">Built for the tall frame</p>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-foreground/10 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="label text-foreground/45">© 6foot studio MMXXVI</p>
          <ul className="flex flex-wrap gap-6">
            {footerNav.legal.map((item) => (
              <li key={item.label}>
                <Link to={item.to} className="label text-foreground/45 transition-opacity hover:opacity-80">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="label text-foreground/45">UK / EN · GBP £</p>
        </div>

      </div>
    </footer>
  );
}
