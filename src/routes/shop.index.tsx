import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { products } from "@/lib/products";

export const Route = createFileRoute("/shop/")({
  head: () => ({
    meta: [
      { title: "Shop the Capsule — 6foot" },
      {
        name: "description",
        content:
          "Four essential pieces engineered for the tall frame. Heavyweight cotton, +2 inch hems, considered proportions.",
      },
      { property: "og:title", content: "Shop the Capsule — 6foot" },
      {
        property: "og:description",
        content: "Four essential pieces engineered for the tall frame.",
      },
    ],
  }),
  component: ShopIndex,
});

function ShopIndex() {
  const [filter, setFilter] = useState<"all" | "tops" | "bottoms">("all");

  const visible = products.filter((p) => {
    if (filter === "tops") return ["long-tee", "long-sleeve", "heavy-hoodie"].includes(p.slug);
    if (filter === "bottoms") return p.slug === "wide-trouser";
    return true;
  });

  return (
    <main className="bg-background text-foreground min-h-screen overflow-x-clip">
      <SiteNav />

      {/* Header */}
      <section className="px-6 md:px-10 pt-36 md:pt-44 pb-16">
        <div className="grid grid-cols-12 gap-x-6 gap-y-10 items-end">
          <div className="col-span-12 md:col-span-8">
            <p className="label text-foreground/60 mb-6">Capsule 001 / SS26</p>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="display text-[14vw] md:text-[10vw] leading-[0.85]"
            >
              The capsule.
            </motion.h1>
          </div>
          <div className="col-span-12 md:col-span-4 md:text-right">
            <p className="text-sm max-w-[34ch] md:ml-auto text-foreground/70">
              Four pieces. One proportion system. Each garment cut on a re-engineered tall block.
            </p>
          </div>
        </div>
      </section>

      {/* Sticky filter bar */}
      <div className="sticky top-0 z-30 bg-background/85 backdrop-blur-md border-y border-foreground/10">
        <div className="px-6 md:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {(["all", "tops", "bottoms"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setFilter(k)}
                className={`label transition-opacity ${filter === k ? "opacity-100" : "opacity-40 hover:opacity-80"}`}
              >
                {k === "all" ? `All (${products.length})` : k}
              </button>
            ))}
          </div>
          <p className="label text-foreground/50">Showing {visible.length}</p>
        </div>
      </div>

      {/* Grid */}
      <section className="px-6 md:px-10 pt-16 pb-40">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:items-start lg:gap-6">
          {visible.map((p) => (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              <Link to="/shop/$slug" params={{ slug: p.slug }} className="group flex h-full flex-col">
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <img
                    src={p.flat}
                    alt={`${p.name} — flat lay`}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-opacity duration-100 ease-linear group-hover:opacity-0"
                  />
                  <img
                    src={p.model}
                    alt={`${p.name} — worn`}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-100 ease-linear group-hover:opacity-100"
                  />
                </div>
                <div className="mt-5 flex min-h-[4.5rem] items-start justify-between gap-4">
                  <div className="flex min-w-0 items-baseline gap-3">
                    <span className="label shrink-0 text-foreground/50">{p.n}</span>
                    <h3 className="display text-xl lg:text-2xl">{p.name}</h3>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="label text-foreground/50">Length {p.len}</p>
                    <p className="display mt-1 text-xl lg:text-2xl">€{p.price}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}