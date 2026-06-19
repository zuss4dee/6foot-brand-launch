import { createFileRoute } from "@tanstack/react-router";

import { SiteNav } from "@/components/SiteNav";

export const Route = createFileRoute("/brand")({
  head: () => ({
    meta: [{ title: "Brand | 6foot" }, { name: "robots", content: "noindex" }],
  }),
  component: BrandPage,
});

function BrandPage() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <SiteNav showPromo={false} />

      <div className="nav-offset mx-auto max-w-5xl px-6 pb-24 pt-10 md:px-10 md:pt-16">
        <p className="label text-foreground/45">Brand system · Logo 001</p>
        <h1 className="display mt-3 text-4xl tracking-tighter md:text-5xl">6foot.</h1>
        <p className="mt-4 max-w-[48ch] text-sm leading-relaxed text-foreground/65">
          Inter Tight display, tight tracking. The name is the mark. Nav uses the period; hero
          lockups drop it.
        </p>

        <section className="mt-14 border border-foreground/10">
          <div className="grid gap-px bg-foreground/10 md:grid-cols-2">
            <div className="flex min-h-[220px] items-center justify-center bg-background p-10">
              <span className="display text-4xl tracking-tighter">6foot.</span>
            </div>
            <div className="flex min-h-[220px] items-center justify-center bg-foreground p-10">
              <span className="display text-4xl tracking-tighter text-background">6foot.</span>
            </div>
            <div className="flex min-h-[180px] items-center justify-center bg-background p-10 md:col-span-2">
              <span className="display text-[clamp(3rem,12vw,5.5rem)] tracking-tighter">6foot</span>
            </div>
            <div className="flex min-h-[200px] items-center justify-center bg-secondary/30 p-10 md:col-span-2">
              <div className="flex flex-col items-start gap-2">
                <span className="display text-[clamp(3rem,12vw,5.5rem)] tracking-tighter">6foot</span>
                <span className="label text-foreground/45">Studio · Engineered Tall Blocks</span>
              </div>
            </div>
            <div className="flex min-h-[120px] items-center justify-center bg-background p-8 md:col-span-2">
              <span className="display text-2xl tracking-tighter">6foot.</span>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <p className="label mb-4 text-foreground/45">Export assets</p>
          <ul className="label space-y-2 text-foreground/70">
            <li>
              <a href="/logo-mark.svg" className="underline-offset-4 hover:underline">
                logo-mark.svg
              </a>
              · nav lockup with period
            </li>
            <li>
              <a href="/logo-wordmark.svg" className="underline-offset-4 hover:underline">
                logo-wordmark.svg
              </a>
              · hero wordmark
            </li>
            <li>
              <a href="/favicon.svg" className="underline-offset-4 hover:underline">
                favicon.svg
              </a>
              · browser tab
            </li>
            <li>
              <a href="/apple-touch-icon.svg" className="underline-offset-4 hover:underline">
                apple-touch-icon.svg
              </a>
              · home screen / iOS
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
