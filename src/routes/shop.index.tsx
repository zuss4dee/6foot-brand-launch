import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Plus, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { useCart } from "@/lib/cart";
import {
  formatPrice,
  getColorVariants,
  getProductColorHex,
  getSectionPieceCount,
  getSectionProducts,
  products,
  productGridRepresentImageClass,
  shopSections,
  type Product,
  type ProductCategory,
  type ShopEditorialItem,
  type ShopSection,
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
type GridCols = 2 | 3 | 4;

const gridClass: Record<GridCols, string> = {
  2: "grid-cols-2",
  3: "grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
};

function filterProducts(key: FilterKey, catalog: Product[]): Product[] {
  if (key === "all") return catalog;
  return catalog.filter((p) => p.category === key);
}

function sortProducts(items: Product[], sort: SortKey): Product[] {
  const next = [...items];
  if (sort === "price-asc") next.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") next.sort((a, b) => b.price - a.price);
  if (sort === "name") next.sort((a, b) => a.name.localeCompare(b.name));
  return next;
}

function ColorSwatches({ product }: { product: Product }) {
  const variants = getColorVariants(product);
  const visible = variants.slice(0, 4);
  const extra = variants.length - visible.length;

  return (
    <div className="mt-2 flex items-center gap-1.5">
      {visible.map((variant) => (
        <Link
          key={variant.slug}
          to="/shop/$slug"
          params={{ slug: variant.slug }}
          aria-label={`${variant.name} in ${variant.color}`}
          className={`h-3.5 w-3.5 rounded-full border border-foreground/15 transition-transform hover:scale-110 ${
            variant.slug === product.slug ? "ring-1 ring-foreground ring-offset-1" : ""
          }`}
          style={{ backgroundColor: getProductColorHex(variant.color) }}
        />
      ))}
      {extra > 0 ? (
        <span className="text-[10px] lowercase text-foreground/45">+{extra} colours</span>
      ) : null}
    </div>
  );
}

function ShopToolbar({
  gridCols,
  setGridCols,
  onOpenFilter,
}: {
  gridCols: GridCols;
  setGridCols: (cols: GridCols) => void;
  onOpenFilter: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-y border-foreground/10 px-4 py-3 md:px-6">
      <div className="flex items-center gap-3">
        <span className="text-[11px] lowercase text-foreground/45">view</span>
        <div className="flex items-center gap-1.5">
          {([2, 3, 4] as const).map((cols) => (
            <button
              key={cols}
              type="button"
              aria-label={`${cols} column grid`}
              aria-pressed={gridCols === cols}
              onClick={() => setGridCols(cols)}
              className={`inline-flex items-center gap-0.5 rounded-sm p-1 transition-colors ${
                gridCols === cols ? "text-foreground" : "text-foreground/30 hover:text-foreground/60"
              }`}
            >
              {Array.from({ length: cols > 3 ? 4 : cols }, (_, index) => (
                <span
                  key={index}
                  className={`block h-2.5 w-2.5 border border-current ${
                    cols === 4 && index === 3 ? "hidden sm:block" : ""
                  }`}
                />
              ))}
            </button>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={onOpenFilter}
        className="inline-flex items-center gap-2 text-[11px] lowercase text-foreground/70 transition-opacity hover:text-foreground"
      >
        filter
        <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.5} />
      </button>
    </div>
  );
}

function CollectionSectionIntro({
  section,
  pieceCount,
  imageRight = false,
}: {
  section: ShopSection;
  pieceCount: number;
  imageRight?: boolean;
}) {
  if (!section.introImage) return null;

  return (
    <div className="grid border-t border-foreground md:grid-cols-2">
      <div
        className={`relative min-h-[min(52svh,620px)] overflow-hidden bg-foreground/[0.04] md:min-h-[min(68vh,780px)] ${
          imageRight ? "md:order-2 md:border-l md:border-foreground" : "md:border-r md:border-foreground"
        }`}
      >
        <img
          src={section.introImage}
          alt={section.introImageAlt ?? section.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-contain object-bottom p-4 md:p-8"
        />
        <span className="label pointer-events-none absolute bottom-4 left-4 text-foreground/25 md:bottom-6 md:left-6">
          +2&quot;
        </span>
        <span className="label pointer-events-none absolute bottom-4 right-4 text-foreground/25 md:bottom-6 md:right-6">
          tall block
        </span>
      </div>

      <div
        className={`flex min-h-[220px] flex-col justify-between border-t border-foreground px-4 py-8 md:min-h-0 md:border-t-0 md:px-8 md:py-10 lg:px-10 ${
          imageRight ? "md:order-1" : ""
        }`}
      >
        <div>
          <p className="label text-foreground/35">{section.eyebrow}</p>
          <h2 className="display mt-2 text-[clamp(1.75rem,5vw,2.75rem)] leading-[0.95] tracking-tight">
            {section.title}
          </h2>
          {section.description ? (
            <p className="mt-4 max-w-md text-sm leading-relaxed text-foreground/65">
              {section.description}
            </p>
          ) : null}
        </div>
        <p className="label mt-8 text-foreground/40">{pieceCount} pieces</p>
      </div>
    </div>
  );
}

function EditorialCell({ item }: { item: ShopEditorialItem }) {
  return (
    <article className="group border-b border-r border-foreground/10 bg-background">
      <div className="relative aspect-[3/4] overflow-hidden bg-foreground/[0.04]">
        <span className="absolute bottom-3 left-3 z-10 bg-background px-2 py-1 text-[10px] lowercase tracking-wide text-foreground shadow-sm">
          coming soon
        </span>
        <Link
          to={item.to}
          className="absolute inset-0 flex items-center justify-center"
        >
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            className={productGridRepresentImageClass}
          />
        </Link>
      </div>
      <div className="px-3 py-3">
        <Link to={item.to} className="text-sm text-foreground hover:opacity-60">
          {item.title}
        </Link>
        <p className="mt-1 text-xs text-foreground/50">{item.subtitle}</p>
      </div>
    </article>
  );
}

function CollectionSection({
  section,
  items,
  editorialItems = [],
  gridCols,
  imageRight = false,
}: {
  section: ShopSection;
  items: Product[];
  editorialItems?: ShopEditorialItem[];
  gridCols: GridCols;
  imageRight?: boolean;
}) {
  if (items.length === 0 && editorialItems.length === 0) return null;

  return (
    <section id={section.id} className="scroll-mt-28">
      <CollectionSectionIntro
        section={section}
        pieceCount={items.length + editorialItems.length}
        imageRight={imageRight}
      />
      <div className={`grid border-t border-foreground/10 ${gridClass[gridCols]}`}>
        {items.map((product) => (
          <ProductCell key={product.slug} product={product} />
        ))}
        {editorialItems.map((item) => (
          <EditorialCell key={item.title} item={item} />
        ))}
      </div>
    </section>
  );
}

function ProductCell({ product }: { product: Product }) {
  const [quickOpen, setQuickOpen] = useState(false);
  const { add, setOpen } = useCart();

  const handleQuickAdd = (size: string) => {
    add(product.slug, size, 1);
    setOpen(true);
    setQuickOpen(false);
  };

  return (
    <article className="group border-b border-r border-foreground/10 bg-background">
      <div className="relative aspect-[3/4] overflow-hidden bg-foreground/[0.04]">
        {product.badge ? (
          <span className="absolute bottom-3 left-3 z-10 bg-background px-2 py-1 text-[10px] lowercase tracking-wide text-foreground shadow-sm">
            {product.badge}
          </span>
        ) : null}

        <button
          type="button"
          aria-label="Quick add"
          aria-expanded={quickOpen}
          onClick={() => setQuickOpen((open) => !open)}
          className="absolute bottom-3 right-3 z-10 flex h-8 w-8 items-center justify-center bg-background text-foreground shadow-sm transition-opacity hover:opacity-70"
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} />
        </button>

        <Link
          to="/shop/$slug"
          params={{ slug: product.slug }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <img
            src={product.model}
            alt={product.name}
            loading="lazy"
            className={productGridRepresentImageClass}
          />
        </Link>

        <AnimatePresence>
          {quickOpen ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute inset-x-0 bottom-0 z-20 border-t border-foreground/10 bg-background/95 px-3 py-3 backdrop-blur-sm"
            >
              <p className="text-[10px] lowercase text-foreground/45">select size</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleQuickAdd(size)}
                    className="min-w-8 border border-foreground/15 px-2 py-1 text-[11px] lowercase transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
                  >
                    {size.toLowerCase()}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="px-3 py-3">
        <Link
          to="/shop/$slug"
          params={{ slug: product.slug }}
          className="text-sm leading-snug text-foreground hover:opacity-60"
        >
          {product.name}
        </Link>
        <p className="mt-1 text-xs text-foreground/50">{product.color}</p>
        <ColorSwatches product={product} />
        <p className="mt-2 text-sm text-foreground">{formatPrice(product.price)}</p>
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
  const [gridCols, setGridCols] = useState<GridCols>(2);
  const [pageExpanded, setPageExpanded] = useState(false);

  const filteredProducts = useMemo(
    () => sortProducts(filterProducts(filter, products), sort),
    [filter, sort],
  );

  const visibleSlugs = useMemo(
    () => new Set(filteredProducts.map((product) => product.slug)),
    [filteredProducts],
  );

  const sections = useMemo(
    () =>
      shopSections
        .map((section) => ({
          section,
          items: sortProducts(
            getSectionProducts(section).filter((product) => visibleSlugs.has(product.slug)),
            sort,
          ),
          editorialItems:
            filter === "all" && sort === "featured" ? (section.editorialItems ?? []) : [],
        }))
        .filter(
          ({ items, editorialItems }) => items.length > 0 || editorialItems.length > 0,
        ),
    [filter, sort, visibleSlugs],
  );

  const totalVisible = sections.reduce(
    (count, { items, editorialItems }) => count + items.length + editorialItems.length,
    0,
  );

  const pageDescription =
    "Proportioned essentials for the tall frame. Shop Drop 001 or explore what's coming from AW26.";

  return (
    <main className="min-h-screen overflow-x-clip bg-background text-foreground">
      <SiteNav />

      <header className="nav-offset px-4 md:px-6">
        <div className="mx-auto max-w-[1600px] border-b border-foreground/10 py-6 md:py-8">
          <div className="flex items-start gap-1">
            <h1 className="display text-[clamp(1.75rem,5vw,2.5rem)] leading-none tracking-tight">
              Capsule &apos;26
            </h1>
            <span className="mt-0.5 text-[10px] text-foreground/40">{totalVisible}</span>
          </div>

          <div className="mt-3 max-w-2xl">
            <p className="text-sm leading-relaxed text-foreground/70">
              {pageExpanded || pageDescription.length <= 96
                ? pageDescription
                : `${pageDescription.slice(0, 96)}…`}
            </p>
            <button
              type="button"
              onClick={() => setPageExpanded((value) => !value)}
              className="mt-2 text-[11px] lowercase text-foreground/45 underline underline-offset-2 hover:text-foreground"
            >
              {pageExpanded ? "read less" : "read more"}
            </button>
          </div>

          <p className="mt-4 text-[11px] leading-relaxed text-foreground/55">
            {shopSections.map((section, index) => (
              <span key={section.id}>
                {index > 0 ? <span className="text-foreground/25"> / </span> : null}
                <a
                  href={`#${section.id}`}
                  className="underline underline-offset-2 transition-colors hover:text-foreground"
                >
                  view {section.title.toLowerCase()}
                </a>
                <span className="text-foreground/30"> ({getSectionPieceCount(section)})</span>
              </span>
            ))}
          </p>
        </div>

        <ShopToolbar
          gridCols={gridCols}
          setGridCols={setGridCols}
          onOpenFilter={() => setFilterOpen(true)}
        />
      </header>

      <div className="mx-auto max-w-[1600px] border-l border-foreground/10">
        {sections.map(({ section, items, editorialItems }, index) => (
          <CollectionSection
            key={section.id}
            section={section}
            items={items}
            editorialItems={editorialItems}
            gridCols={gridCols}
            imageRight={index % 2 === 1}
          />
        ))}
      </div>

      <footer className="mx-auto max-w-[1600px] px-4 py-8 text-center md:py-10">
        <p className="text-[11px] lowercase text-foreground/45">
          viewing {totalVisible} pieces across {sections.length} collections
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
        count={filteredProducts.length}
      />
    </main>
  );
}
