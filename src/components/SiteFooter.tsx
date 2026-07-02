import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { footerNav, type FooterLink } from "@/lib/footer-nav";

function FooterLinkItem({ item }: { item: FooterLink }) {
  const className =
    "inline-flex min-h-11 items-center text-base transition-opacity hover:opacity-60";

  if ("to" in item && item.to) {
    return (
      <Link to={item.to} className={className}>
        {item.label}
      </Link>
    );
  }

  return (
    <a href={item.href} className={className}>
      {item.label}
    </a>
  );
}

type SiteFooterProps = {
  showNewsletter?: boolean;
};

export function SiteFooter({ showNewsletter = true }: SiteFooterProps) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <footer className="border-t border-foreground/10 bg-background px-5 md:px-10">
      <div className="mx-auto max-w-7xl pt-12 pb-[max(2.5rem,env(safe-area-inset-bottom))] md:pt-20">
        <div
          className={
            showNewsletter
              ? "grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:gap-10"
              : "grid grid-cols-2 gap-8 sm:gap-10"
          }
        >
          {showNewsletter ? (
            <div id="waitlist" className="sm:col-span-2 lg:col-span-1">
              <p className="label mb-6 text-foreground/50">Newsletter</p>
              <h3 className="display mb-4 text-2xl md:text-3xl">Join the waitlist</h3>
              <p className="mb-6 max-w-[36ch] text-sm leading-relaxed text-foreground/65">
                Priority access to Drop 001. No restocks. No markdowns. Zero noise.
              </p>
              {sent ? (
                <p className="display text-xl">Confirmed. Watch your inbox.</p>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (email.includes("@")) setSent(true);
                  }}
                  className="space-y-4"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email"
                    className="w-full border-b border-foreground/25 bg-transparent py-3 text-base outline-none placeholder:text-foreground/30 focus:border-foreground"
                  />
                  <button
                    type="submit"
                    className="label border border-foreground px-6 py-3 transition-colors hover:bg-foreground hover:text-background"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          ) : null}

          <div>
            <p className="label mb-6 text-foreground/50">Help & Info</p>
            <ul className="space-y-1">
              {footerNav.help.map((item) => (
                <li key={item.label}>
                  <FooterLinkItem item={item} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label mb-6 text-foreground/50">Studio</p>
            <a
              href="mailto:studio@6foot.eu"
              className="inline-flex min-h-11 items-center text-base break-all transition-opacity hover:opacity-60 sm:break-normal"
            >
              studio@6foot.eu
            </a>
            <p className="mt-2 text-base text-foreground/60">Manchester, UK</p>
            <p className="label mt-8 text-foreground/45">Drop 001 · SS26</p>
            <p className="label mt-1 text-foreground/45">Built for the tall frame</p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-5 border-t border-foreground/10 pt-6 md:mt-16 md:flex-row md:items-center md:justify-between md:gap-4">
          <p className="label text-foreground/45">© 6foot studio MMXXVI</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            {footerNav.legal.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  className="label inline-flex min-h-11 items-center text-foreground/45 transition-opacity hover:opacity-80"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="label text-foreground/45 md:text-right">UK / EN · GBP £</p>
        </div>
      </div>
    </footer>
  );
}
