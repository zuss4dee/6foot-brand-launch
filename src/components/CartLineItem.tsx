import { Link } from "@tanstack/react-router";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { trackAddToCart } from "@/lib/analytics";
import type { CartItem } from "@/lib/cart";
import { formatPrice, productFitImageClass, type Product } from "@/lib/products";
import { resolveMerchandiseId } from "@/lib/shopify-variants";

const SWIPE_DELETE_OFFSET = -88;

type CartLineItemProps = {
  item: CartItem;
  product: Product;
  onClose?: () => void;
  onRemove: () => void;
  onSetQty: (qty: number) => void;
  compact?: boolean;
};

export function CartLineItem({
  item,
  product,
  onClose,
  onRemove,
  onSetQty,
  compact = false,
}: CartLineItemProps) {
  const x = useMotionValue(0);
  const deleteOpacity = useTransform(x, [SWIPE_DELETE_OFFSET, -40], [1, 0]);

  const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    if (info.offset.x < -56 || info.velocity.x < -400) {
      onRemove();
      return;
    }
    void animate(x, 0, { type: "spring", stiffness: 420, damping: 32 });
  };

  const imageCol = compact ? "60px" : "80px";

  return (
    <li className="relative overflow-hidden">
      <motion.div
        aria-hidden
        style={{ opacity: deleteOpacity }}
        className="absolute inset-y-0 right-0 flex w-24 items-center justify-center bg-foreground text-background"
      >
        <span className="label">Remove</span>
      </motion.div>

      <motion.div
        style={{ x }}
        drag="x"
        dragConstraints={{ left: SWIPE_DELETE_OFFSET, right: 0 }}
        dragElastic={0.08}
        onDragEnd={handleDragEnd}
        className="relative bg-background touch-pan-y"
      >
        <div
          className="grid gap-5"
          style={{ gridTemplateColumns: `${imageCol} 1fr` }}
        >
          <Link
            to="/shop/$slug"
            params={{ slug: product.slug }}
            onClick={onClose}
            className="relative block aspect-[3/4] overflow-hidden bg-background"
            draggable={false}
          >
            <div className="absolute inset-0 flex items-end justify-center px-1 pt-2">
              <img src={product.model} alt={product.name} className={productFitImageClass} draggable={false} />
            </div>
          </Link>
          <div className="flex flex-col">
            <div className="flex items-start justify-between gap-3">
              <Link
                to="/shop/$slug"
                params={{ slug: product.slug }}
                onClick={onClose}
                className={`display leading-tight hover:opacity-60 ${compact ? "text-base" : "text-lg"}`}
              >
                {product.name}
              </Link>
              <span className={`display ${compact ? "text-base" : "text-lg"}`}>
                {formatPrice(product.price * item.qty)}
              </span>
            </div>
            <p className="label mt-1 text-foreground/50">
              Size {item.size}
              {!compact && ` · ${product.color}`}
            </p>
            <div className="mt-auto flex items-center justify-between pt-4">
              <div className="inline-flex items-center border border-foreground/20">
                <button
                  type="button"
                  onClick={() => onSetQty(item.qty - 1)}
                  className="label px-3 py-1 transition-colors hover:bg-foreground hover:text-background"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="label min-w-[2ch] px-3 text-center">{item.qty}</span>
                <button
                  type="button"
                  onClick={() => {
                    onSetQty(item.qty + 1);
                    const variantGid = resolveMerchandiseId(product.slug, item.size);
                    if (variantGid) {
                      trackAddToCart({
                        slug: product.slug,
                        title: product.name,
                        price: product.price,
                        quantity: 1,
                        variantGid,
                        variantTitle: item.size,
                        category: product.category,
                      });
                    }
                  }}
                  className="label px-3 py-1 transition-colors hover:bg-foreground hover:text-background"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={onRemove}
                className="label text-foreground/50 hover:text-foreground"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </li>
  );
}
