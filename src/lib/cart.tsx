import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { products, type Product } from "./products";

export interface CartItem {
  slug: string;
  size: string;
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  add: (slug: string, size: string, qty?: number) => void;
  remove: (slug: string, size: string) => void;
  setQty: (slug: string, size: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  enriched: { item: CartItem; product: Product }[];
}

const Ctx = createContext<CartContextValue | null>(null);
const KEY = "6foot.cart.v1";

function isValidCartItem(item: CartItem) {
  return products.some((p) => p.slug === item.slug);
}

function sanitizeCartItems(raw: CartItem[]) {
  return raw.filter((item) => isValidCartItem(item) && item.qty > 0);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(sanitizeCartItems(JSON.parse(raw)));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const add = useCallback((slug: string, size: string, qty = 1) => {
    setItems((cur) => {
      const idx = cur.findIndex((i) => i.slug === slug && i.size === size);
      if (idx >= 0) {
        const next = [...cur];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [...cur, { slug, size, qty }];
    });
    setOpen(true);
  }, []);

  const remove = useCallback((slug: string, size: string) => {
    setItems((cur) => cur.filter((i) => !(i.slug === slug && i.size === size)));
  }, []);

  const setQty = useCallback((slug: string, size: string, qty: number) => {
    setItems((cur) =>
      qty <= 0
        ? cur.filter((i) => !(i.slug === slug && i.size === size))
        : cur.map((i) => (i.slug === slug && i.size === size ? { ...i, qty } : i)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const enriched = useMemo(
    () =>
      items
        .map((item) => {
          const product = products.find((p) => p.slug === item.slug);
          return product ? { item, product } : null;
        })
        .filter((x): x is { item: CartItem; product: Product } => x !== null),
    [items],
  );

  const count = useMemo(() => enriched.reduce((s, { item }) => s + item.qty, 0), [enriched]);
  const subtotal = useMemo(
    () => enriched.reduce((s, { item, product }) => s + product.price * item.qty, 0),
    [enriched],
  );

  const value: CartContextValue = {
    items,
    add,
    remove,
    setQty,
    clear,
    count,
    subtotal,
    open,
    setOpen,
    enriched,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}