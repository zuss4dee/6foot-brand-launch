import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Bookmark, ChevronDown, ChevronLeft, ChevronRight, Share2, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { SiteNav } from "@/components/SiteNav";
import {
  getProduct,
  getColorVariants,
  getRelatedProducts,
  getProductImages,
  formatPrice,
  isLowStock,
  productFit,
  productFitImageClass,
  productImageClass,
  productRef,
  products,
  type Product,
  type ProductImage,
} from "@/lib/products";
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

const colorSwatch: Record<string, string> = {
  "Off-white": "bg-[#edeae3] ring-1 ring-foreground/10",
  Black: "bg-foreground",
  Charcoal: "bg-neutral-600",
  Stone: "bg-[#c8c4bc]",
  Olive: "bg-[#5c6348]",
};

type SectionKey = "details" | "fit" | "composition" | "measurements" | "shipping";

const topMeasurements = [
  ["size", "shoulder", "length", "chest"],
  ["m", "47.5cm", "78cm", "53.5cm"],
  ["l", "49.5cm", "80cm", "56cm"],
  ["xl", "51.5cm", "82cm", "58.5cm"],
  ["xxl", "53.5cm", "84cm", "61cm"],
];

const bottomMeasurements = [
  ["size", "waist", "inseam", "length"],
  ["32", "32\"", "34\"", "118cm"],
  ["34", "34\"", "34\"", "120cm"],
  ["36", "36\"", "36\"", "122cm"],
  ["38", "38\"", "38\"", "124cm"],
];

function Accordion({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-foreground/10">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between py-4 text-left text-[11px] lowercase text-foreground"
      >
        {title}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          strokeWidth={1.5}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-5 text-sm leading-relaxed text-foreground/70">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MeasurementTable({ product }: { product: Product }) {
  const rows = product.category === "bottoms" ? bottomMeasurements : topMeasurements;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[280px] text-left text-[11px] lowercase">
        <thead>
          <tr className="border-b border-foreground/10">
            {rows[0].map((cell) => (
              <th key={cell} className="pb-2 pr-4 font-normal text-foreground/45">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(1).map((row) => (
            <tr key={row[0]} className="border-b border-foreground/5">
              {row.map((cell) => (
                <td key={cell} className="py-2 pr-4 text-foreground/70">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 text-[11px] lowercase text-foreground/45">
        all measurements taken flat. +2 inch extension through body on tall block.
      </p>
    </div>
  );
}

function SizeGuideDrawer({
  open,
  onClose,
  product,
}: {
  open: boolean;
  onClose: () => void;
  product: Product;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close size guide"
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
              <h2 className="text-sm lowercase">size guide</h2>
              <button type="button" onClick={onClose} aria-label="Close">
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-6">
              <p className="mb-6 text-[11px] leading-relaxed lowercase text-foreground/55">
                {product.category === "bottoms"
                  ? "6foot bottoms are cut with extended rise and inseam. Size by waist — length scales with size."
                  : "6foot tops are re-blocked with +2 inches through the body. Cuffs land at the wristbone on a 6'4 frame."}
              </p>
              <MeasurementTable product={product} />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function GalleryFrame({ shot, productName }: { shot: ProductImage; productName: string }) {
  if (shot.fit === "model") {
    return (
      <div className="absolute inset-0 flex items-end justify-center px-0 pb-1 pt-2 md:px-4 md:pb-0 md:pt-8">
        <img src={shot.src} alt={productName} className={productImageClass(shot.fit)} />
      </div>
    );
  }

  return (
    <img
      src={shot.src}
      alt={productName}
      className={`absolute inset-0 ${productImageClass(shot.fit)}`}
    />
  );
}

function ProductGallery({ product, activeIndex, onSelect }: {
  product: Product;
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  const shots = useMemo(() => getProductImages(product), [product]);
  const touchStartX = useRef<number | null>(null);

  const goPrev = () => onSelect(activeIndex === 0 ? shots.length - 1 : activeIndex - 1);
  const goNext = () => onSelect(activeIndex === shots.length - 1 ? 0 : activeIndex + 1);

  const handleTouchStart = (clientX: number) => {
    touchStartX.current = clientX;
  };

  const handleTouchEnd = (clientX: number) => {
    if (touchStartX.current === null) return;
    const delta = clientX - touchStartX.current;
    if (Math.abs(delta) > 48) {
      if (delta > 0) goPrev();
      else goNext();
    }
    touchStartX.current = null;
  };

  return (
    <div className="md:flex md:gap-3">
      <div className="mb-3 hidden max-h-[calc(100vh-8rem)] flex-col gap-2 overflow-y-auto md:flex">
        {shots.map((shot, index) => (
          <button
            key={`${shot.src}-${index}`}
            type="button"
            onClick={() => onSelect(index)}
            className={`relative h-20 w-16 shrink-0 overflow-hidden border bg-background ${
              activeIndex === index ? "border-foreground" : "border-foreground/15 opacity-60"
            }`}
          >
            {shot.fit === "model" ? (
              <div className="absolute inset-0 flex items-end justify-center px-0.5 pt-2">
                <img src={shot.src} alt="" className={productFitImageClass} />
              </div>
            ) : (
              <img
                src={shot.src}
                alt=""
                className={`absolute inset-0 ${productImageClass(shot.fit)}`}
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1">
        <div className="relative md:hidden">
          <div
            className="relative min-h-[62svh] overflow-hidden border border-foreground/30 bg-background sm:aspect-[3/4] sm:min-h-0"
            onTouchStart={(e) => handleTouchStart(e.touches[0]?.clientX ?? 0)}
            onTouchEnd={(e) => handleTouchEnd(e.changedTouches[0]?.clientX ?? 0)}
          >
            <p className="absolute left-3 top-3 z-10 text-[10px] lowercase text-foreground/45">
              {shots[activeIndex]?.label}
            </p>
            <p className="absolute right-3 top-3 z-10 text-[10px] lowercase text-foreground/45">
              {activeIndex + 1} / {shots.length}
            </p>
            {shots[activeIndex] && (
              <GalleryFrame shot={shots[activeIndex]} productName={product.name} />
            )}
            {shots.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={goPrev}
                  className="touch-target absolute left-1 top-1/2 z-10 -translate-y-1/2 border border-foreground/15 bg-background/90"
                >
                  <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  aria-label="Next image"
                  onClick={goNext}
                  className="touch-target absolute right-1 top-1/2 z-10 -translate-y-1/2 border border-foreground/15 bg-background/90"
                >
                  <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </>
            )}
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {shots.map((shot, index) => (
              <button
                key={`${shot.src}-thumb-${index}`}
                type="button"
                aria-label={`View image ${index + 1}`}
                onClick={() => onSelect(index)}
                className={`relative h-16 w-14 shrink-0 overflow-hidden border bg-background ${
                  activeIndex === index ? "border-foreground" : "border-foreground/15 opacity-70"
                }`}
              >
                {shot.fit === "model" ? (
                  <div className="absolute inset-0 flex items-end justify-center px-0.5 pt-1">
                    <img src={shot.src} alt="" className={productFitImageClass} />
                  </div>
                ) : (
                  <img
                    src={shot.src}
                    alt=""
                    className={`absolute inset-0 ${productImageClass(shot.fit)}`}
                  />
                )}
              </button>
            ))}
          </div>
          <div className="mt-2 flex justify-center gap-1.5">
            {shots.map((shot, index) => (
              <button
                key={`${shot.src}-dot-${index}`}
                type="button"
                aria-label={`View image ${index + 1}`}
                onClick={() => onSelect(index)}
                className={`h-1.5 rounded-full transition-all ${
                  activeIndex === index ? "w-5 bg-foreground" : "w-1.5 bg-foreground/25"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="hidden space-y-3 md:block">
          {shots.map((shot, index) => (
            <div
              key={`${shot.src}-${index}`}
              id={`product-shot-${index}`}
              className="relative aspect-[3/4] overflow-hidden border border-foreground/10 bg-background"
            >
              <p className="absolute left-3 top-3 z-10 text-[10px] lowercase text-foreground/45">
                {shot.label}
              </p>
              <GalleryFrame shot={shot} productName={product.name} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ColorVariants({ product }: { product: Product }) {
  const variants = getColorVariants(product);
  if (variants.length <= 1) return null;

  return (
    <div className="mt-6">
      <p className="mb-3 text-[11px] lowercase text-foreground/45">
        colour · {variants.length} available
      </p>
      <div className="flex flex-wrap gap-3">
        {variants.map((variant) => {
          const active = variant.slug === product.slug;
          return (
            <Link
              key={variant.slug}
              to="/shop/$slug"
              params={{ slug: variant.slug }}
              className={`flex items-center gap-2 border px-3 py-2 text-[11px] lowercase transition-colors ${
                active
                  ? "border-foreground bg-foreground/5 text-foreground"
                  : "border-foreground/15 text-foreground/55 hover:border-foreground/40"
              }`}
            >
              <span
                aria-hidden
                className={`h-3 w-3 rounded-full ${colorSwatch[variant.color] ?? "bg-foreground/30"}`}
              />
              {variant.color.toLowerCase()}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function BuyWithShopButton({
  onClick,
  disabled = false,
  className = "",
}: {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`mt-2 flex w-full items-center justify-center gap-1 rounded-[4px] bg-[#5433EB] py-4 text-[14px] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    >
      <span>Buy with</span>
      <span className="font-semibold tracking-tight">shop</span>
    </button>
  );
}

function ProductAccordions({
  product,
  openSection,
  setOpenSection,
  detailBullets,
  modelNote,
}: {
  product: Product;
  openSection: SectionKey | null;
  setOpenSection: (key: SectionKey | null) => void;
  detailBullets: string[];
  modelNote: string;
}) {
  const toggle = (key: SectionKey) => setOpenSection(openSection === key ? null : key);

  return (
    <>
      <Accordion title="details" open={openSection === "details"} onToggle={() => toggle("details")}>
        <p className="mb-4">{product.description}</p>
        <ul className="space-y-1.5 text-[11px] lowercase text-foreground/60">
          {detailBullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Accordion>
      <Accordion title="size & fit" open={openSection === "fit"} onToggle={() => toggle("fit")}>
        <p className="mb-3">{modelNote}</p>
        <p className="mb-4 text-[11px] lowercase text-foreground/55">
          fit: {productFit(product)}. designed on a re-engineered block for frames 6&apos;2–6&apos;6.
        </p>
        <MeasurementTable product={product} />
      </Accordion>
      <Accordion
        title="composition & care"
        open={openSection === "composition"}
        onToggle={() => toggle("composition")}
      >
        <dl className="space-y-3 text-[11px] lowercase">
          <div className="grid grid-cols-[100px_1fr] gap-3">
            <dt className="text-foreground/45">outer shell</dt>
            <dd>{product.fabric.toLowerCase()}</dd>
          </div>
          <div className="grid grid-cols-[100px_1fr] gap-3">
            <dt className="text-foreground/45">weight</dt>
            <dd>{product.gsm}gsm</dd>
          </div>
          <div className="grid grid-cols-[100px_1fr] gap-3">
            <dt className="text-foreground/45">origin</dt>
            <dd>knit & cut in portugal</dd>
          </div>
          <div className="grid grid-cols-[100px_1fr] gap-3">
            <dt className="text-foreground/45">wash care</dt>
            <dd>machine wash cold · do not tumble dry · cool iron</dd>
          </div>
        </dl>
      </Accordion>
      <Accordion
        title="product measurements"
        open={openSection === "measurements"}
        onToggle={() => toggle("measurements")}
      >
        <MeasurementTable product={product} />
      </Accordion>
      <Accordion
        title="shipping, exchanges & returns"
        open={openSection === "shipping"}
        onToggle={() => toggle("shipping")}
      >
        <ul className="space-y-2 text-[11px] lowercase">
          <li>free uk delivery on orders over £150</li>
          <li>standard delivery 3–5 working days</li>
          <li>free exchanges for uk customers</li>
          <li>14-day returns — unworn, tags attached</li>
        </ul>
      </Accordion>
    </>
  );
}

function ProductPage() {
  const { product } = Route.useLoaderData();
  const [size, setSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeShot, setActiveShot] = useState(0);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [openSection, setOpenSection] = useState<SectionKey | null>("details");
  const [memberEmail, setMemberEmail] = useState("");
  const [memberSent, setMemberSent] = useState(false);
  const { add, setOpen } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    setActiveShot(0);
    setSize(null);
    setAdded(false);
  }, [product.slug]);

  const related = getRelatedProducts(product, 4);
  const shopTheLook = products.filter((p) => p.slug !== product.slug).slice(0, 3);

  const handleAdd = () => {
    if (!size) return;
    add(product.slug, size, 1);
    setAdded(true);
    setOpen(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyWithShop = () => {
    if (!size) return;
    add(product.slug, size, 1);
    setOpen(false);
    navigate({ to: "/checkout" });
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: product.name, url });
      return;
    }
    await navigator.clipboard.writeText(url);
  };

  const modelNote =
    product.category === "bottoms"
      ? "model is 6'4 / 1.93m and wears a 34"
      : "model is 6'4 / 1.93m and wears a large";

  const detailBullets = [
    productFit(product),
    `${product.gsm}gsm construction`,
    `${product.len} body length`,
    "soft garment washed finish",
    "knit & cut in portugal",
  ];

  return (
    <main className="min-h-screen overflow-x-clip bg-background pb-[calc(9.5rem+env(safe-area-inset-bottom))] text-foreground md:pb-32">
      <SiteNav />

      <div className="flex items-center justify-between px-4 pt-24 md:px-6 md:pt-28">
        <Link
          to="/shop"
          className="text-[11px] lowercase text-foreground/45 transition-opacity hover:text-foreground"
        >
          ← back to capsule &apos;26
        </Link>
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-2 text-[11px] lowercase text-foreground/45 hover:text-foreground"
        >
          share
          <Share2 className="h-3.5 w-3.5" strokeWidth={1.5} />
        </button>
      </div>

      <section className="mx-auto grid max-w-[1600px] gap-8 px-4 pt-4 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:gap-10 md:px-6 md:pt-6 lg:gap-14">
        <ProductGallery product={product} activeIndex={activeShot} onSelect={setActiveShot} />

        <div className="md:sticky md:top-28 md:self-start">
          <div className="flex flex-wrap items-center gap-2">
            {product.badge && (
              <span className="text-[10px] lowercase text-foreground">{product.badge}</span>
            )}
            {isLowStock(product) && (
              <>
                {product.badge && <span className="text-foreground/20">·</span>}
                <span className="text-[10px] lowercase text-foreground/70">few items left</span>
              </>
            )}
          </div>

          <div className="mt-2 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl lowercase leading-snug md:text-2xl">
                {product.name.toLowerCase()}
              </h1>
              <p className="mt-3 text-lg">{formatPrice(product.price)}</p>
              <p className="mt-2 text-[10px] lowercase text-foreground/40">{productRef(product)}</p>
            </div>
            <button
              type="button"
              aria-label="Add to wishlist"
              onClick={() => setSaved((v) => !v)}
              className="mt-1 transition-opacity hover:opacity-60"
            >
              <Bookmark className={`h-4 w-4 ${saved ? "fill-foreground" : ""}`} strokeWidth={1.25} />
            </button>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <span
              aria-hidden
              className={`h-4 w-4 shrink-0 rounded-full ${colorSwatch[product.color] ?? "bg-foreground/30"}`}
            />
            <p className="text-[11px] lowercase">{product.color.toLowerCase()}</p>
          </div>

          <ColorVariants product={product} />

          <p className="mt-5 text-[11px] leading-relaxed text-foreground/55">{modelNote}</p>

          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] lowercase text-foreground/45">size</p>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(true)}
                className="text-[11px] lowercase underline underline-offset-2 text-foreground/55"
              >
                size guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`touch-target inline-flex min-w-[2.75rem] items-center justify-center px-2 text-sm lowercase transition-opacity ${
                    size === s ? "text-foreground underline underline-offset-4" : "text-foreground/35 hover:text-foreground/70"
                  }`}
                >
                  {s.toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <motion.button
            type="button"
            onClick={handleAdd}
            disabled={!size}
            whileTap={{ scale: size ? 0.99 : 1 }}
            className={`mt-6 hidden w-full py-4 text-[11px] lowercase md:block ${
              size
                ? "bg-foreground text-background hover:opacity-90"
                : "cursor-not-allowed bg-foreground/10 text-foreground/40"
            }`}
          >
            {added ? "added to bag" : "add to bag"}
          </motion.button>
          <BuyWithShopButton
            onClick={handleBuyWithShop}
            disabled={!size}
            className="hidden md:flex"
          />

          <div className="mt-8 hidden border-t border-foreground/10 md:block">
            <ProductAccordions
              product={product}
              openSection={openSection}
              setOpenSection={setOpenSection}
              detailBullets={detailBullets}
              modelNote={modelNote}
            />
          </div>
        </div>
      </section>

      {/* Editorial spotlight — Represent / Borderline */}
      <section className="mx-auto mt-12 max-w-[1600px] border-y border-foreground/10 px-4 py-12 md:mt-16 md:px-6 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-[11px] lowercase text-foreground/45">{product.n} · capsule &apos;26</p>
          <h2 className="display text-3xl lowercase leading-tight md:text-4xl">
            {product.name.toLowerCase()}
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-foreground/70">{product.description}</p>
          <p className="mt-4 text-[11px] lowercase text-foreground/45">
            {product.fabric.toLowerCase()} · {product.gsm}gsm · {product.len} length
          </p>
        </div>
      </section>

      <section className="border-t border-foreground/10 px-4 py-2 md:hidden">
        <ProductAccordions
          product={product}
          openSection={openSection}
          setOpenSection={setOpenSection}
          detailBullets={detailBullets}
          modelNote={modelNote}
        />
      </section>

      {/* Shop the look — about:blank */}
      <section className="mx-auto max-w-[1600px] px-4 pt-12 md:px-6 md:pt-14">
        <p className="mb-6 text-[11px] lowercase text-foreground/45">shop the look</p>
        <div className="grid grid-cols-1 border-l border-t border-foreground sm:grid-cols-2 md:grid-cols-3">
          {shopTheLook.map((p) => (
            <Link
              key={p.slug}
              to="/shop/$slug"
              params={{ slug: p.slug }}
              className="group border-b border-r border-foreground bg-background"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-background">
                <span className="absolute left-3 top-3 z-10 text-[10px] lowercase text-foreground/45">
                  {p.badge ?? "new:in"}
                </span>
                <div className="absolute inset-0 flex items-end justify-center px-2 pt-6">
                  <img src={p.model} alt={p.name} loading="lazy" className={productFitImageClass} />
                </div>
              </div>
              <div className="border-t border-foreground p-3 group-hover:hidden">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-[11px] lowercase">{p.name.toLowerCase()}</span>
                  <span className="shrink-0 text-[11px]">{formatPrice(p.price)}</span>
                </div>
                <p className="mt-1 text-[10px] lowercase text-foreground/45">{p.color.toLowerCase()}</p>
              </div>
              <div className="hidden border-t border-foreground p-3 group-hover:block">
                <p className="text-[11px] lowercase">{p.name.toLowerCase()}</p>
                <p className="mt-2 text-[10px] lowercase text-foreground/45">view product →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Complete your look — Zara */}
      <section className="mx-auto max-w-[1600px] px-4 pt-12 pb-8 md:px-6 md:pt-14">
        <p className="mb-6 text-[11px] lowercase text-foreground/45">complete your look</p>
        <div className="grid grid-cols-1 border-l border-t border-foreground sm:grid-cols-2 md:grid-cols-4">
          {related.map((p) => (
            <Link
              key={p.slug}
              to="/shop/$slug"
              params={{ slug: p.slug }}
              className="border-b border-r border-foreground bg-background"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-background">
                <div className="absolute inset-0 flex items-end justify-center px-2 pt-6">
                  <img src={p.model} alt={p.name} loading="lazy" className={productFitImageClass} />
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-foreground px-3 py-2">
                <span className="truncate text-[11px] lowercase">{p.name.toLowerCase()}</span>
                <span className="shrink-0 text-[11px]">{formatPrice(p.price)}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Member strip — about:blank */}
      <section className="border-t border-foreground bg-foreground px-4 py-10 text-background md:px-6 md:py-12">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] lowercase text-background/60">6foot members</p>
            <h3 className="mt-2 text-lg lowercase">early access to drop 002</h3>
            <ul className="mt-4 space-y-1 text-[11px] lowercase text-background/70">
              <li>first look at new collections</li>
              <li>priority on limited releases</li>
              <li>14-day returns</li>
            </ul>
          </div>
          {memberSent ? (
            <p className="text-sm lowercase">you&apos;re on the list.</p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (memberEmail.includes("@")) setMemberSent(true);
              }}
              className="flex w-full max-w-md gap-2"
            >
              <input
                type="email"
                required
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                placeholder="your@email"
                className="flex-1 border-b border-background/30 bg-transparent py-2 text-[11px] outline-none placeholder:text-background/40 focus:border-background"
              />
              <button type="submit" className="shrink-0 text-[11px] lowercase underline underline-offset-2">
                sign up
              </button>
            </form>
          )}
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-foreground bg-background px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
        <div className="grid grid-cols-[auto_1fr] gap-3">
          <p className="col-span-2 text-center text-[10px] lowercase text-foreground/45">
            {size ? `${size.toLowerCase()} selected` : "select a size above"}
          </p>
          <p className="self-center text-base">{formatPrice(product.price)}</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleAdd}
              disabled={!size}
              className={`py-3 text-[11px] lowercase ${
                size
                  ? "bg-foreground text-background"
                  : "cursor-not-allowed bg-foreground/10 text-foreground/40"
              }`}
            >
              {added ? "added" : "add to bag"}
            </button>
            <BuyWithShopButton
              onClick={handleBuyWithShop}
              disabled={!size}
              className="mt-0 py-3 text-[12px]"
            />
          </div>
        </div>
      </div>

      <SizeGuideDrawer open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} product={product} />
    </main>
  );
}
