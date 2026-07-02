export type FooterLink =
  | { label: string; to: "/shipping-returns" | "/contact" | "/faq" | "/privacy" | "/terms" }
  | { label: string; href: string };

export const footerNav = {
  help: [
    { label: "Contact", to: "/contact" as const },
    { label: "FAQ", to: "/faq" as const },
    { label: "Shipping & Returns", to: "/shipping-returns" as const },
    { label: "Track Your Order", href: "https://checkout.6foot.store/apps/17TRACK" },
  ],
  legal: [
    { label: "Privacy Policy", to: "/privacy" as const },
    { label: "Terms & Conditions", to: "/terms" as const },
  ],
} as const satisfies {
  help: readonly FooterLink[];
  legal: readonly FooterLink[];
};
