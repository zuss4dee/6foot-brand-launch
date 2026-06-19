import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import fabric from "@/assets/fabric.jpg";

export const Route = createFileRoute("/coming-soon")({
  head: () => ({
    meta: [
      { title: "Drop 002 | Coming Soon | 6foot" },
      { name: "description", content: "Drop 002 launches Autumn 2026. Join the waitlist for first access." },
      { property: "og:title", content: "Drop 002 | Coming Soon | 6foot" },
      { property: "og:description", content: "Drop 002 launches Autumn 2026." },
    ],
  }),
  component: ComingSoon,
});

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return { d, h, m, s };
}

function ComingSoon() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const target = new Date("2026-10-15T10:00:00Z");
  const { d, h, m, s } = useCountdown(target);

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <main className="bg-background text-foreground min-h-screen overflow-x-clip">
      <SiteNav />

      <section ref={ref} className="relative min-h-[100svh] flex flex-col">
        {/* Parallax fabric background — subtle */}
        <motion.div
          style={{ y: yBg }}
          className="absolute inset-x-0 top-0 h-[120%] -z-10 opacity-30"
        >
          <img src={fabric} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-background/60" />
        </motion.div>

        <div className="flex-1 flex flex-col justify-end px-6 md:px-10 pb-16 pt-40">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="label text-foreground/60"
          >
            Chapter 02 · Drop 002 / AW26
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="display text-[18vw] md:text-[14vw] leading-[0.82] mt-6"
          >
            Coming
            <br />
            <span className="text-foreground/30">soon.</span>
          </motion.h1>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-14 grid grid-cols-4 gap-4 md:gap-10 max-w-3xl"
          >
            {[
              { v: d, l: "Days" },
              { v: h, l: "Hours" },
              { v: m, l: "Minutes" },
              { v: s, l: "Seconds" },
            ].map(({ v, l }) => (
              <div key={l} className="border-t border-foreground/20 pt-3">
                <p className="display text-4xl md:text-6xl tabular-nums leading-none">
                  {String(v).padStart(2, "0")}
                </p>
                <p className="label text-foreground/50 mt-3">{l}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Email capture */}
      <section className="px-6 md:px-10 py-24 border-t border-foreground/10">
        <div className="grid grid-cols-12 gap-x-10 gap-y-10 items-end">
          <div className="col-span-12 md:col-span-6">
            <p className="label text-foreground/60">First access</p>
            <h2 className="display text-4xl md:text-5xl mt-3 leading-[0.95] max-w-[18ch]">
              Be on the list when it drops.
            </h2>
          </div>
          <div className="col-span-12 md:col-span-6">
            {sent ? (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="display text-2xl"
              >
                Confirmed. We'll be in touch.
              </motion.p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.includes("@")) setSent(true);
                }}
                className="flex items-center border-b border-foreground"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email"
                  className="flex-1 bg-transparent py-4 display text-2xl md:text-3xl placeholder:text-foreground/25 outline-none"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="label px-4"
                >
                  Notify me →
                </motion.button>
              </form>
            )}

            <Link to="/shop" className="label inline-flex items-center gap-3 mt-10 hover:opacity-60">
              Browse Drop 001 in the meantime
              <span className="h-px w-10 bg-foreground" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}