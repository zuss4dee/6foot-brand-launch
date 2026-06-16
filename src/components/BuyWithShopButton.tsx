import { ShopLogo } from "@/components/ShopLogo";

type BuyWithShopButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  soldOut?: boolean;
  className?: string;
  compact?: boolean;
};

export function BuyWithShopButton({
  onClick,
  disabled = false,
  loading = false,
  soldOut = false,
  className = "",
  compact = false,
}: BuyWithShopButtonProps) {
  if (soldOut) {
    return (
      <button
        type="button"
        disabled
        className={`flex items-center justify-center text-[11px] uppercase tracking-widest text-neutral-400 ${
          compact ? "px-4 py-3" : "mt-2 w-full py-4"
        } ${className}`}
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
      className={`flex items-center justify-center whitespace-nowrap rounded-[4px] bg-[#5433EB] font-sans text-white antialiased transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 ${
        compact ? "gap-2 px-3.5 py-3 text-[13px] leading-none" : "mt-2 w-full gap-2.5 py-4 text-[14px] leading-none"
      } ${className}`}
    >
      {loading ? (
        <span>{compact ? "…" : "Redirecting…"}</span>
      ) : (
        <>
          <span className="shrink-0 font-normal">Buy with</span>
          <ShopLogo size={compact ? "sm" : "md"} />
        </>
      )}
    </button>
  );
}
