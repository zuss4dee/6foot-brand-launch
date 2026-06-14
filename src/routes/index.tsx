import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";
import Lenis from "lenis";

import hero from "@/assets/hero.jpg";
import fabric from "@/assets/fabric.jpg";
import p1Flat from "@/assets/p1-flat.jpg";
import p1Model from "@/assets/p1-model.jpg";
import p2Flat from "@/assets/p2-flat.jpg";
import p2Model from "@/assets/p2-model.jpg";
import p3Flat from "@/assets/p3-flat.jpg";
import p3Model from "@/assets/p3-model.jpg";
import p4Flat from "@/assets/p4-flat.jpg";
import p4Model from "@/assets/p4-model.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "6foot — Built for the Tall Frame" },
      {
        name: "description",
        content:
          "Premium minimalist essentials engineered with +2 inch hems and 240gsm heavyweight cotton — proportioned for the tall frame.",
      },
      { property: "og:title", content: "6foot — Built for the Tall Frame" },
      {
        property: "og:description",
        content:
          "Premium minimalist essentials engineered for the tall frame.",
      },
    ],
  }),
  component: Index,
});

function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    let raf = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
}

const shutter: Variants = {
  hidden: { clipPath: "inset(50% 0 50% 0)", opacity: 0 },
  visible: {
    clipPath: "inset(0% 0 0% 0)",
    opacity: 1,
    transition: { duration: 1.1, ease: [0.83, 0, 0.17, 1] },
  },
};

const rise: Variants = {
  hidden: { y: 28, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

function Reveal({
  children,
  variant = rise,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  variant?: Variants;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <motion.div
      ref={ref}
      variants={variant}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 20, mass: 1 });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (inView) mv.set(to);
  }, [inView, to, mv]);

  useEffect(() => {
    const unsub = spring.on("change", (v) => setVal(v));
    return () => unsub();
  }, [spring]);

  return (
    <span ref={ref} className="tabular-nums">
      {Math.round(val)}
      {suffix}
    </span>
  );
}

const products = [
  { n: "01", name: "The Long Tee", price: "€85", flat: p1Flat, model: p1Model, len: "78cm" },
  { n: "02", name: "Heavy Hoodie", price: "€185", flat: p2Flat, model: p2Model, len: "82cm" },
  { n: "03", name: "Wide Trouser", price: "€165", flat: p3Flat, model: p3Model, len: "118cm" },
  { n: "04", name: "Long Sleeve", price: "€95", flat: p4Flat, model: p4Model, len: "80cm" },
];

function Index() {
  useLenis();

  return (
    <main className="bg-background text-foreground min-h-screen overflow-x-clip">
      <Nav />
      <Hero />
      <Marquee />
      <Blueprint />
      <Grid />
      <Waitlist />
      <Footer />
    </main>
  );
}

function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
      <div className="flex items-center justify-between px-6 md:px-10 py-6 text-[oklch(0.978_0.002_95)]">
        <a href="#top" className="display text-2xl tracking-tighter">
          6foot.
        </a>
        <nav className="hidden md:flex items-center gap-10">
          {["Index", "Blueprint", "Capsule", "Waitlist"].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="label hover:opacity-60 transition-opacity">
              {l}
            </a>
          ))}
        </nav>
        <span className="label">EU / EN</span>
      </div>
    </header>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yImg = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const yTitle = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <section id="top" ref={ref} className="relative min-h-screen flex flex-col justify-end pb-10">
      {/* image floats centered behind type */}
      <motion.div
        style={{ y: yImg, scale }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <motion.img
          src={hero}
          alt="Garment drape on tall figure"
          width={896}
          height={1344}
          variants={shutter}
          initial="hidden"
          animate="visible"
          className="h-[78vh] w-auto object-contain"
        />
      </motion.div>

      {/* top meta */}
      <div className="absolute top-28 left-6 md:left-10 right-6 md:right-10 flex justify-between">
        <Reveal delay={0.3}>
          <p className="label max-w-[12ch]">Chapter 01 — Built for the tall frame</p>
        </Reveal>
        <Reveal delay={0.4}>
          <p className="label text-right max-w-[14ch]">
            Drop 001 / SS26
            <br />
            Releasing soon
          </p>
        </Reveal>
      </div>

      {/* headline */}
      <motion.h1
        style={{ y: yTitle }}
        className="display relative z-10 text-center text-[28vw] md:text-[22vw] leading-[0.8] select-none"
      >
        <motion.span
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="inline-block"
        >
          6foot
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          .
        </motion.span>
      </motion.h1>

      {/* bottom row */}
      <div className="relative z-10 px-6 md:px-10 mt-6 grid grid-cols-2 md:grid-cols-3 gap-6 items-end">
        <Reveal delay={0.6}>
          <p className="label max-w-[22ch]">
            Proportioned essentials.
            <br />
            +2&quot; through the body.
          </p>
        </Reveal>
        <Reveal delay={0.7} className="hidden md:block">
          <p className="label text-center">Scroll</p>
        </Reveal>
        <Reveal delay={0.8} className="text-right justify-self-end">
          <a href="#waitlist" className="group inline-flex items-center gap-3">
            <span className="label">Join waitlist</span>
            <span className="h-px w-10 bg-foreground transition-all duration-500 group-hover:w-16" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function Marquee() {
  const words = ["+2 INCHES", "240 GSM", "PROPORTIONED", "FOR THE TALL FRAME", "DROP 001"];
  return (
    <section className="border-y border-foreground/10 py-6 overflow-hidden">
      <motion.div
        className="flex gap-16 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
      >
        {[...words, ...words, ...words, ...words].map((w, i) => (
          <span key={i} className="display text-5xl md:text-7xl shrink-0">
            {w} <span className="opacity-30">/</span>
          </span>
        ))}
      </motion.div>
    </section>
  );
}

function Blueprint() {
  return (
    <section id="blueprint" className="relative px-6 md:px-10 pt-32 md:pt-48 pb-32">
      <div className="grid grid-cols-12 gap-x-6 gap-y-16">
        <div className="col-span-12 md:col-span-3">
          <div className="md:sticky md:top-32">
            <p className="label mb-4">02 / The Blueprint</p>
            <Reveal>
              <h2 className="display text-5xl md:text-6xl">
                Engineered <br /> in inches, <br /> not approximations.
              </h2>
            </Reveal>
          </div>
        </div>

        <div className="col-span-12 md:col-span-5 md:col-start-5 space-y-20">
          {[
            {
              label: "Body length",
              value: 2,
              suffix: '"',
              copy: "Added at the hem. Stays tucked, stays proportioned. No bunching, no shrinkage tax.",
            },
            {
              label: "Fabric weight",
              value: 240,
              suffix: " gsm",
              copy: "Heavyweight long-staple cotton. Structure that drapes vertically without clinging.",
            },
            {
              label: "Sleeve drop",
              value: 1.5,
              suffix: '"',
              copy: "Recut armholes and re-pitched sleeves so the cuff lands at the wristbone — not the forearm.",
            },
            {
              label: "Tested on",
              value: 47,
              suffix: " frames",
              copy: "From 6'0\" to 6'8\". Every block prototyped, worn, washed, revised.",
            },
          ].map((row) => (
            <Reveal key={row.label}>
              <div className="flex items-end justify-between gap-6 border-t border-foreground/15 pt-6">
                <div className="flex-1 min-w-0">
                  <p className="label mb-3 text-foreground/60">{row.label}</p>
                  <p className="text-base md:text-lg leading-snug max-w-[34ch]">{row.copy}</p>
                </div>
                <div className="display text-[18vw] md:text-[9vw] leading-none shrink-0">
                  <Counter to={row.value} suffix={row.suffix} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="col-span-12 md:col-span-3 md:col-start-10">
          <div className="md:sticky md:top-32">
            <Reveal variant={shutter}>
              <img
                src={fabric}
                alt="240gsm heavyweight cotton weave detail"
                width={1344}
                height={896}
                loading="lazy"
                className="w-full aspect-[3/4] object-cover"
              />
            </Reveal>
            <p className="label mt-4 text-foreground/60">Fig. 01 — Plain weave, 240gsm</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Grid() {
  return (
    <section id="capsule" className="px-6 md:px-10 pt-32 pb-40">
      <div className="flex flex-wrap items-end justify-between gap-6 mb-24">
        <Reveal>
          <h2 className="display text-5xl md:text-7xl max-w-[12ch]">The capsule.</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="label max-w-[28ch] text-foreground/60">
            Four pieces. One proportion system. Each garment cut on a re-engineered tall block.
          </p>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-32">
        {products.map((p, i) => (
          <ProductCard key={p.n} product={p} offset={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}

function ProductCard({
  product,
  offset,
}: {
  product: (typeof products)[number];
  offset: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  return (
    <Reveal variant={shutter} className={offset ? "md:mt-32" : ""}>
      <div ref={ref} className="group relative">
        <div className="relative aspect-[3/4] overflow-hidden">
          <motion.img
            src={product.flat}
            alt={`${product.name} — flat lay`}
            width={896}
            height={1152}
            loading="lazy"
            style={{ y }}
            className="absolute inset-0 h-[110%] w-full object-cover transition-opacity duration-100 ease-linear group-hover:opacity-0"
          />
          <img
            src={product.model}
            alt={`${product.name} — worn`}
            width={896}
            height={1152}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-100 ease-linear group-hover:opacity-100"
          />
        </div>
        <div className="mt-5 flex items-start justify-between gap-6">
          <div className="flex items-baseline gap-4">
            <span className="label text-foreground/50">{product.n}</span>
            <h3 className="display text-2xl">{product.name}</h3>
          </div>
          <div className="text-right">
            <p className="label text-foreground/50">Length {product.len}</p>
            <p className="display text-2xl mt-1">{product.price}</p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function Waitlist() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <section id="waitlist" className="px-6 md:px-10 pt-24 pb-40">
      <div className="border-t border-foreground/15 pt-16">
        <Reveal>
          <p className="label mb-8 text-foreground/60">04 / Access</p>
        </Reveal>
        <Reveal>
          <h2 className="display text-[18vw] md:text-[14vw] leading-[0.82]">
            Drop 001.
            <br />
            <span className="text-foreground/30">By invitation.</span>
          </h2>
        </Reveal>

        <div className="mt-16 flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          <Reveal className="max-w-[44ch]">
            <p className="text-base md:text-lg leading-snug">
              First release ships in limited quantities to the waitlist. No restocks, no markdowns,
              no marketing emails.
            </p>
          </Reveal>

          <div className="md:min-w-[28rem]">
            {!open ? (
              <motion.button
                layout
                onClick={() => setOpen(true)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="group w-full md:w-auto inline-flex items-center justify-between gap-10 bg-foreground text-background px-8 py-6"
              >
                <span className="label">Request access</span>
                <span className="display text-xl">→</span>
              </motion.button>
            ) : (
              <motion.form
                layout
                initial={{ opacity: 0, width: "60%" }}
                animate={{ opacity: 1, width: "100%" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.includes("@")) setSent(true);
                }}
                className="relative w-full border-b border-foreground"
              >
                {sent ? (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="display text-2xl py-5"
                  >
                    Confirmed. Watch your inbox.
                  </motion.p>
                ) : (
                  <div className="flex items-center">
                    <input
                      autoFocus
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email"
                      className="flex-1 bg-transparent py-5 display text-2xl md:text-3xl placeholder:text-foreground/25 outline-none"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      type="submit"
                      className="label px-4"
                    >
                      Submit →
                    </motion.button>
                  </div>
                )}
              </motion.form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-foreground text-background px-6 md:px-10 pt-20 pb-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-2">
          <h3 className="display text-[18vw] md:text-[12vw] leading-[0.85]">6foot.</h3>
        </div>
        <div className="space-y-3">
          <p className="label opacity-50">Index</p>
          {["Blueprint", "Capsule", "Waitlist", "Journal"].map((l) => (
            <a key={l} href="#" className="block text-base hover:opacity-60 transition-opacity">
              {l}
            </a>
          ))}
        </div>
        <div className="space-y-3">
          <p className="label opacity-50">Contact</p>
          <p className="text-base">studio@6foot.eu</p>
          <p className="text-base opacity-60">Amsterdam, NL</p>
        </div>
      </div>
      <div className="mt-24 flex flex-wrap items-end justify-between gap-4 border-t border-background/15 pt-6">
        <p className="label opacity-50">© 6foot studio MMXXVI</p>
        <p className="label opacity-50">Built for the tall frame</p>
      </div>
    </footer>
  );
}
}
