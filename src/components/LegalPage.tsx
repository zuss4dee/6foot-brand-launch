import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";

type LegalPageProps = {
  title: string;
  intro?: string;
  children: ReactNode;
};

export function LegalPage({ title, intro, children }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main>
        <article className="nav-offset mx-auto max-w-3xl px-5 pb-16 pt-8 md:px-10 md:pb-20 md:pt-14">
          <p className="label text-foreground/45">Help & Info</p>
          <h1 className="display mt-4 text-3xl tracking-tight sm:text-4xl md:text-5xl">{title}</h1>
          {intro ? (
            <p className="mt-5 max-w-[52ch] text-sm leading-relaxed text-foreground/70 md:mt-6 md:text-base">
              {intro}
            </p>
          ) : null}
          <div className="mt-10 space-y-12 border-t border-foreground/10 pt-10 md:mt-14 md:space-y-14 md:pt-14">
            {children}
          </div>
          <div className="mt-12 flex flex-wrap gap-x-6 gap-y-4 border-t border-foreground/10 pt-8 md:mt-16">
            <Link
              to="/"
              className="label inline-flex min-h-11 items-center text-foreground/50 transition-opacity hover:text-foreground"
            >
              ← Home
            </Link>
            <Link
              to="/faq"
              className="label inline-flex min-h-11 items-center text-foreground/50 transition-opacity hover:text-foreground"
            >
              FAQ
            </Link>
            <Link
              to="/contact"
              className="label inline-flex min-h-11 items-center text-foreground/50 transition-opacity hover:text-foreground"
            >
              Contact
            </Link>
            <Link
              to="/shipping-returns"
              className="label inline-flex min-h-11 items-center text-foreground/50 transition-opacity hover:text-foreground"
            >
              Shipping & Returns
            </Link>
          </div>
        </article>
      </main>
      <SiteFooter showNewsletter={false} />
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="label mb-5 text-foreground">{title}</h2>
      <div className="space-y-4 text-sm leading-relaxed text-foreground/75 md:text-[15px]">
        {children}
      </div>
    </section>
  );
}

export function FaqItem({ question, children }: { question: string; children: ReactNode }) {
  return (
    <details className="group border-b border-foreground/10 py-4 first:border-t first:border-foreground/10 md:py-5">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[15px] leading-snug text-foreground marker:content-none sm:text-base [&::-webkit-details-marker]:hidden">
        <span className="min-w-0 pr-2">{question}</span>
        <span
          aria-hidden
          className="label mt-1 shrink-0 text-foreground/35 transition-transform group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="mt-4 max-w-[62ch] text-sm leading-relaxed text-foreground/75 md:text-[15px]">
        {children}
      </div>
    </details>
  );
}
