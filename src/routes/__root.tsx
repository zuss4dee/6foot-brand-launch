import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CartProvider } from "../lib/cart";
import { CustomerAuthProvider } from "../lib/customer-auth";
import { CartDrawer } from "../components/CartDrawer";
import { CookieBanner } from "../components/CookieBanner";
import { DiscountEmailPopup } from "../components/DiscountEmailPopup";
import { initAnalytics, trackPageView } from "../lib/analytics";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6">
      <h1 className="mb-2 text-7xl font-extralight tracking-tighter text-black">404</h1>
      <p className="mb-8 text-xs uppercase tracking-widest text-neutral-400">
        THE REQUESTED PATH DOES NOT EXIST.
      </p>
      <Link
        to="/"
        className="bg-black px-8 py-3 text-xs uppercase tracking-widest text-white transition-opacity hover:opacity-80"
      >
        RETURN TO STUDIO
      </Link>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" },
      { title: "6FOOT STUDIO" },
      {
        name: "description",
        content:
          "Proportioned streetwear for the tall frame. Engineered blocks, extended lengths, and limited drops from Manchester.",
      },
      { property: "og:title", content: "6FOOT STUDIO" },
      {
        property: "og:description",
        content:
          "Proportioned streetwear for the tall frame. Engineered blocks, extended lengths, and limited drops from Manchester.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://6foot.store/og-default.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#f9f9f9" },
    ],
    links: [
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.svg" },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const location = useRouterState({ select: (state) => state.location.href });

  useEffect(() => {
    void initAnalytics();
  }, []);

  useEffect(() => {
    if (!location) return;
    trackPageView(location);
  }, [location]);

  return (
    <QueryClientProvider client={queryClient}>
      <CustomerAuthProvider>
        <CartProvider>
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
          <CartDrawer />
          <DiscountEmailPopup />
          <CookieBanner />
        </CartProvider>
      </CustomerAuthProvider>
    </QueryClientProvider>
  );
}
