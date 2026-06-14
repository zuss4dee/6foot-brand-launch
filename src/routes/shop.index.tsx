import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Bookmark, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { useCart } from "@/lib/cart";
import {
  formatPrice,
  products,
  productGridImageClass,
  type Product,
  type ProductCategory,
} from "@/lib/products";

export const Route = createFileRoute("/shop/")({
  head: () => ({
    meta: [
      { title: "6foot // capsule '26" },
      {
        name: "description",
        content:
          "Twelve capsule pieces engineered for the tall frame. Heavyweight cotton, +2 inch hems, considered proportions.",
      },
      { property: "og:title", content: "6foot // capsule '26" },
      {
        property: "og:description",
        content: "Twelve capsule pieces engineered for the tall frame.",
      },
    ],
  }),
  component: ShopIndex,
});

type SortKey = "featured" | "price-asc" | "price-desc" | "name";
type FilterKey = "all" | ProductCategory;

function filterProducts(key: FilterKey): Product[] {
  if (key === "all") return products;
  return products.filter((p) => p.category === key);
}

function sortProducts(items: Product[], sort: SortKey): Product[] {
  const next = [...items];
  if (sort === "price-asc") next.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") next.sort((a, b) => b.price - a.price);
  if (sort === "name") next.sort((a, b) => a.name.localeCompare(b.name));
  return next;
}

function ProductCell({ product }: { product: Product }) {
  const [size, setSize] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const { add, setOpen } = useCart();

  const handleSelectSize = () => {
    if (!size) return;
    add(product.slug, size, 1);
    setOpen(true);
  };

  const modelNote =
    product.category === "bottoms"
      ? "model is 6'4 / 1.93m and wears a 34"
      : "model is 6'4 / 1.93m and wears a large";

  return (
    <article className="group border-b border-r border-foreground bg-background">
      <div className="relative min-h-[62svh] overflow-hidden bg-background sm:aspect-[3/4] sm:min-h-0">
        <span className="absolute left-3 top-3 z-10 text-[10px] lowercase tracking-wide text-foreground">
          {product.badge ?? "new:in"}
        </span>
        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={() => setSaved((v) => !v)}
          className="absolute right-3 top-3 z-10 text-foreground transition-opacity hover:opacity-60"
        >
          <Bookmark className={`h-4 w-4 ${saved ? "fill-foreground" : ""}`} strokeWidth={1.25} />
        </button>

        <Link
          to="/shop/$slug"
          params={{ slug: product.slug }}
          className="absolute inset-0 flex items-end justify-center px-1 pb-1 pt-6 md:px-2 md:pt-8"
        >
          <img
            src={product.model}
            alt={product.name}
            loading="lazy"
            className={productGridImageClass}
          />
        </Link>
      </div>

      <div className="border-t border-foreground">
        <div className="flex items-center justify-between gap-2 px-3 py-2.5 md:hidden">
          <Link
            to="/shop/$slug"
            params={{ slug: product.slug }}
            className="min-w-0 truncate text-[11px] lowercase text-foreground"
          >
            {product.name.toLowerCase()}
          </Link>
          <span className="shrink-0 text-[11px]">{formatPrice(product.price)}</span>
        </div>

        <div className="hidden items-center justify-between px-3 py-2 md:flex md:group-hover:hidden">
          <span className="text-xs text-foreground/35">—</span>
          <span className="text-xs lowercase text-foreground">{product.color.toLowerCase()}</span>
        </div>

        <div className="hidden p-3 md:group-hover:block">
          <Link
            to="/shop/$slug"
            params={{ slug: product.slug }}
            className="text-sm lowercase leading-snug text-foreground hover:opacity-60"
          >
            {product.name.toLowerCase()}
          </Link>

          <p className="mt-2 text-[11px] leading-relaxed text-foreground/55">{modelNote}</p>

          <button
            type="button"
            className="mt-2 text-[11px] lowercase underline underline-offset-2 text-foreground/70"
          >
            size guide
          </button>

          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={`text-[11px] lowercase transition-opacity ${
                  size === s ? "text-foreground" : "text-foreground/40 hover:text-foreground/70"
                }`}
              >
                {s.toLowerCase()}
              </button>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-sm text-foreground">{formatPrice(product.price)}</p>
            <div className="flex items-center gap-3">
              <Link
                to="/shop/$slug"
                params={{ slug: product.slug }}
                className="text-[11px] lowercase underline underline-offset-2 text-foreground/70 hover:text-foreground"
              >
                view product
              </Link>
              <button
                type="button"
                onClick={handleSelectSize}
                className={`text-[11px] lowercase underline underline-offset-2 ${
                  size ? "text-foreground" : "text-foreground/40"
                }`}
              >
                {size ? "add to bag" : "select size"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function FilterDrawer({
  open,
  onClose,
  filter,
  setFilter,
  sort,
  setSort,
  count,
}: {
  open: boolean;
  onClose: () => void;
  filter: FilterKey;
  setFilter: (v: FilterKey) => void;
  sort: SortKey;
  setSort: (v: SortKey) => void;
  count: number;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close filter panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-foreground/20"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-background safe-bottom"
          >
            <div className="flex items-center justify-between border-b border-foreground px-5 py-4">
              <h2 className="text-sm lowercase text-foreground">filter and sort</h2>
              <button type="button" onClick={onClose} aria-label="Close">
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6">
              <p className="mb-3 text-[11px] lowercase text-foreground/45">sort by</p>
              <div className="space-y-2 border-b border-foreground/10 pb-6">
                {(
                  [
                    ["featured", "featured"],
                    ["price-asc", "price, low to high"],
                    ["price-desc", "price, high to low"],
                    ["name", "alphabetically, a-z"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSort(key)}
                    className={`block text-left text-sm lowercase ${
                      sort === key ? "text-foreground" : "text-foreground/40 hover:text-foreground/70"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <p className="mb-3 mt-6 text-[11px] lowercase text-foreground/45">product type</p>
              <div className="space-y-2">
                {(["all", "tops", "bottoms", "outerwear"] as const).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFilter(key)}
                    className={`block text-left text-sm lowercase ${
                      filter === key ? "text-foreground" : "text-foreground/40 hover:text-foreground/70"
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 border-t border-foreground px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={() => {
                  setFilter("all");
                  setSort("featured");
                }}
                className="flex-1 border border-foreground py-3 text-[11px] lowercase"
              >
                clear all
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-foreground py-3 text-[11px] lowercase text-background"
              >
                view ({count})
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function ShopIndex() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [sort, setSort] = useState<SortKey>("featured");

  const visible = useMemo(
    () => sortProducts(filterProducts(filter), sort),
    [filter, sort],
  );

  return (
    <main className="min-h-screen overflow-x-clip bg-background text-foreground">
      <SiteNav />

      <header className="px-4 pb-4 pt-24 md:px-6 md:pb-5 md:pt-28">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between">
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className="inline-flex items-center gap-2 text-[11px] lowercase text-foreground/70 transition-opacity hover:text-foreground md:text-xs"
          >
            filter + sort
            <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
          <p className="text-[11px] lowercase text-foreground/45 md:text-xs">
            {visible.length} products
          </p>
        </div>

        <h1 className="mx-auto mt-4 max-w-[1600px] text-center text-base font-normal lowercase tracking-normal text-foreground md:text-lg">
          6foot // capsule &apos;26
        </h1>
      </header>

      <section className="mx-auto max-w-[1600px] border-l border-t border-foreground">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          {visible.map((product) => (
            <ProductCell key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <footer className="mx-auto max-w-[1600px] px-4 py-8 text-center md:py-10">
        <p className="text-[11px] lowercase text-foreground/45">
          viewing {visible.length} out of {visible.length} products
        </p>
        <Link
          to="/"
          className="mt-4 inline-block text-[11px] lowercase text-foreground/55 underline-offset-4 hover:text-foreground hover:underline"
        >
          back to home
        </Link>
      </footer>

      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filter={filter}
        setFilter={setFilter}
        sort={sort}
        setSort={setSort}
        count={visible.length}
      />
    </main>
  );
}
