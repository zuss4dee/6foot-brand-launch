import { motion } from "motion/react";

export const promoMarqueeText =
  "COMPLIMENTARY UK SHIPPING OVER £150 // 240GSM HEAVYWEIGHT COTTON // ENGINEERED TALL BLOCKS // MANCHESTER STUDIO";

type PromoMarqueeProps = {
  className?: string;
};

export function PromoMarquee({ className = "" }: PromoMarqueeProps) {
  return (
    <div
      className={`overflow-hidden bg-foreground text-background ${className}`}
      aria-label="Promotional highlights"
    >
      <motion.div
        className="flex w-max gap-10 whitespace-nowrap py-2"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
      >
        {[promoMarqueeText, promoMarqueeText].map((line, index) => (
          <span key={index} className="label text-[10px] tracking-wide">
            {line}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
