import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { SiteNav } from "@/components/SiteNav";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <article className="nav-offset mx-auto max-w-3xl px-6 pb-28 pt-10 md:px-10 md:pt-14">
        <h1 className="label text-foreground">{title}</h1>
        <div className="mt-14 space-y-14">{children}</div>
        <Link
          to="/"
          className="label mt-20 inline-flex items-center gap-3 text-foreground/50 transition-opacity hover:text-foreground"
        >
          ← Back to home
        </Link>
      </article>
    </main>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="label mb-5 text-foreground">{title}</h2>
      <div className="space-y-4 text-sm leading-relaxed text-foreground/75">{children}</div>
    </section>
  );
}
