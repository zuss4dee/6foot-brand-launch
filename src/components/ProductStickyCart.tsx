import { motion } from "motion/react";

import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";
import { getFitRecommendation } from "@/lib/size-guide";

type ProductStickyCartProps = {
  product: Product;
  size: string | null;
  setSize: (size: string) => void;
  onAdd: () => void;
  added: boolean;
  soldOut?: boolean;
  onBuyWithShop: () => void;
  shopLoading: boolean;
  shopError: string | null;
  onOpenSizeGuide: () => void;
};

function BuyWithShopCompact({
  onClick,
  disabled,
  loading,
  soldOut = false,
}: {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
  soldOut?: boolean;
}) {
  if (soldOut) {
    return (
      <button
        type="button"
        disabled
        className="flex items-center justify-center px-4 py-3 text-[11px] uppercase tracking-widest text-neutral-400"
      >
        SOLD OUT
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="flex items-center justify-center gap-1 rounded-[4px] bg-[#5433EB] px-4 py-3 text-[12px] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {loading ? (
        "…"
      ) : (
        <>
          <span>Buy with</span>
          <span className="font-semibold">shop</span>
        </>
      )}
    </button>
  );
}

export function ProductStickyCart({
  product,
  size,
  setSize,
  onAdd,
  added,
  soldOut = false,
  onBuyWithShop,
  shopLoading,
  shopError,
  onOpenSizeGuide,
}: ProductStickyCartProps) {
  const fitNote = size ? getFitRecommendation(product, size) : null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-foreground bg-background/95 backdrop-blur-md">
      <div className="mx-auto max-w-[1600px] px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:px-6 md:py-4">
        {fitNote ? (
          <p className="mb-2 text-center text-[10px] text-foreground/45 md:text-left">{fitNote}</p>
        ) : null}
        {shopError ? (
          <p className="mb-2 text-center text-[10px] text-destructive md:text-left">{shopError}</p>
        ) : null}

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-6">
          <div className="hidden min-w-0 md:block">
            <p className="truncate text-sm text-foreground">{product.name}</p>
            <p className="text-lg text-foreground">{formatPrice(product.price)}</p>
          </div>

          <div className="flex items-center justify-between gap-3 md:justify-start">
            <p className="text-base md:hidden">{formatPrice(product.price)}</p>
            <button
              type="button"
              onClick={onOpenSizeGuide}
              className="text-[10px] lowercase text-foreground/45 underline underline-offset-2 hover:text-foreground"
            >
              size guide
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:flex-1 md:justify-center">
            {product.sizes.map((entry) => (
              <button
                key={entry}
                type="button"
                onClick={() => setSize(entry)}
                className={`min-w-[2.5rem] border px-2.5 py-2 text-[11px] lowercase transition-colors ${
                  size === entry
                    ? "border-foreground bg-foreground text-background"
                    : "border-foreground/15 text-foreground/50 hover:border-foreground/40 hover:text-foreground"
                }`}
              >
                {entry.toLowerCase()}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 md:flex md:shrink-0 md:gap-3">
            <motion.button
              type="button"
              onClick={onAdd}
              disabled={!size || soldOut}
              whileTap={{ scale: size && !soldOut ? 0.99 : 1 }}
              className={`py-3 text-[11px] uppercase tracking-widest md:min-w-[10rem] ${
                soldOut
                  ? "cursor-not-allowed text-neutral-400"
                  : size
                    ? "bg-foreground text-background hover:opacity-90"
                    : "cursor-not-allowed bg-foreground/10 text-foreground/40"
              }`}
            >
              {soldOut ? "SOLD OUT" : added ? "added to bag" : "add to bag"}
            </motion.button>
            <BuyWithShopCompact
              onClick={onBuyWithShop}
              disabled={!size}
              soldOut={soldOut}
              loading={shopLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

