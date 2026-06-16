type ShopLogoProps = {
  /** CSS height — width follows wordmark aspect ratio (410:135). */
  size?: "sm" | "md";
  className?: string;
};

const sizeMap = {
  sm: { css: "h-[14px] w-[42px]", width: 84, height: 28 },
  md: { css: "h-4 w-12", width: 96, height: 32 },
} as const;

/** Shop wordmark for Buy with Shop buttons — 2× intrinsic size for retina clarity. */
export function ShopLogo({ size = "sm", className = "" }: ShopLogoProps) {
  const dims = sizeMap[size];

  return (
    <img
      src="/shop-wordmark-white.svg"
      alt=""
      aria-hidden
      width={dims.width}
      height={dims.height}
      decoding="sync"
      draggable={false}
      className={`shop-wordmark block shrink-0 select-none ${dims.css} ${className}`}
    />
  );
}
