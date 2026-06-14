import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { getProduct, products } from "@/lib/products";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/shop/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: `${loaderData.product.name} — 6foot` },
            { name: "description", content: loaderData.product.description },
            { property: "og:title", content: `${loaderData.product.name} — 6foot` },
            { property: "og:description", content: loaderData.product.description },
            { property: "og:image", content: loaderData.product.model },
          ],
        }
      : { meta: [{ title: "Product — 6foot" }] },
  notFoundComponent: () => (
    <main className="min-h-screen grid place-items-center px-6">
      <div className="text-center">
        <p className="label text-foreground/60">404</p>
        <h1 className="display text-5xl mt-3">Product not found.</h1>
        <Link to="/shop" className="label inline-flex items-center gap-3 mt-8">
          Back to shop <span className="h-px w-10 bg-foreground" />
        </Link>
      </div>
    </main>
  ),
  errorComponent: ({ reset }) => (
    <main className="min-h-screen grid place-items-center px-6">
      <div className="text-center">
        <h1 className="display text-3xl">Something broke.</h1>
        <button onClick={reset} className="label mt-6">
          Try again
        </button>
      </div>
    </main>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const [size, setSize] = useState<string | null>(null);
  const [view, setView] = useState<"flat" | "model">("model");
  const [added, setAdded] = useState(false);
  const { add } = useCart();

  const related = products.filter((p) => p.slug !== product.slug).slice(0, 2);

  const handleAdd = () => {
    if (!size) return;
    add(product.slug, size, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <main className="bg-background text-foreground min-h-screen overflow-x-clip">
      <SiteNav />

      {/* Breadcrumb */}
      <div className="px-6 md:px-10 pt-32 md:pt-36">
        <p className="label text-foreground/50">
          <Link to="/shop" className="hover:text-foreground transition-colors">
            Shop
          </Link>{" "}
          / {product.name}
        </p>
      </div>

      {/* Main: image + sticky info */}
      <section className="px-6 md:px-10 pt-10 pb-32">
        <div className="grid grid-cols-12 gap-x-10 gap-y-10">
          {/* Images */}
          <div className="col-span-12 md:col-span-7 space-y-3">
            <motion.div
              key={view}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-[3/4] overflow-hidden bg-muted"
            >
              <img
                src={view === "flat" ? product.flat : product.model}
                alt={product.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </motion.div>
            <div className="flex gap-3">
              {(["model", "flat"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`relative w-20 aspect-[3/4] overflow-hidden ${view === v ? "ring-1 ring-foreground" : "opacity-60 hover:opacity-100"} transition-all`}
                >
                  <img
                    src={v === "flat" ? product.flat : product.model}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Sticky info */}
          <div className="col-span-12 md:col-span-5">
            <div className="md:sticky md:top-32 space-y-10">
              <div>
                <p className="label text-foreground/50">{product.n} / {product.color}</p>
                <h1 className="display text-5xl md:text-6xl mt-3 leading-[0.9]">{product.name}</h1>
                <p className="display text-3xl mt-4">€{product.price}</p>
              </div>

              <p className="text-base leading-snug max-w-[40ch] text-foreground/80">
                {product.description}
              </p>

              {/* Size */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="label text-foreground/60">Size</p>
                  <button className="label text-foreground/50 hover:text-foreground">Size guide</button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`label py-4 transition-all ${
                        size === s
                          ? "bg-foreground text-background"
                          : "border border-foreground/15 hover:border-foreground"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add to cart */}
              <motion.button
                onClick={handleAdd}
                disabled={!size}
                whileHover={{ scale: size ? 1.01 : 1 }}
                whileTap={{ scale: size ? 0.99 : 1 }}
                transition={{ duration: 0.2 }}
                className={`w-full px-6 py-5 label flex items-center justify-between transition-all ${
                  size
                    ? "bg-foreground text-background hover:opacity-90"
                    : "bg-foreground/10 text-foreground/40 cursor-not-allowed"
                }`}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={added ? "added" : size ? "ready" : "pick"}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {added ? "Added to bag" : size ? `Add to bag — Size ${size}` : "Select a size"}
                  </motion.span>
                </AnimatePresence>
                <span>→</span>
              </motion.button>

              {/* Spec list */}
              <dl className="border-t border-foreground/15 pt-6 space-y-3 text-sm">
                {[
                  ["Fabric", product.fabric],
                  ["Weight", `${product.gsm}gsm`],
                  ["Length", product.len],
                  ["Origin", "Knit & cut in Portugal"],
                  ["Care", "Cold wash. Line dry."],
                ].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[120px_1fr] gap-4">
                    <dt className="label text-foreground/50">{k}</dt>
                    <dd className="text-foreground/80">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="px-6 md:px-10 pb-32">
        <p className="label text-foreground/60 mb-10">You might also consider</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {related.map((p) => (
            <Link key={p.slug} to="/shop/$slug" params={{ slug: p.slug }} className="group block">
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={p.flat}
                  alt={p.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-100 ease-linear group-hover:opacity-0"
                />
                <img
                  src={p.model}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-100 ease-linear group-hover:opacity-100"
                />
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <h3 className="display text-xl">{p.name}</h3>
                <p className="display text-xl">€{p.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}