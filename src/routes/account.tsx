import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { SiteNav } from "@/components/SiteNav";
import { useCustomerAuth } from "@/lib/customer-auth";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Account — 6foot" },
      { name: "description", content: "Your 6foot member account." },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const navigate = useNavigate();
  const { session, loading, logout } = useCustomerAuth();

  useEffect(() => {
    if (!loading && !session.authenticated) {
      void navigate({ to: "/login" });
    }
  }, [loading, session.authenticated, navigate]);

  if (loading || !session.authenticated) {
    return (
      <div className="min-h-dvh bg-background text-foreground">
        <SiteNav />
        <main className="mx-auto max-w-md px-6 pb-16 pt-28 md:pt-32">
          <p className="label text-foreground/50">Loading account…</p>
        </main>
      </div>
    );
  }

  const displayName =
    [session.firstName, session.lastName].filter(Boolean).join(" ") || session.email;

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteNav />
      <main className="mx-auto max-w-md px-6 pb-16 pt-28 md:pt-32">
        <p className="label text-foreground/50">Member account</p>
        <h1 className="display mt-4 text-3xl">{displayName}</h1>
        <p className="mt-3 text-sm text-foreground/65">{session.email}</p>

        <div className="mt-10 space-y-4 border-t border-foreground/10 pt-8">
          <p className="text-sm leading-relaxed text-foreground/65">
            You have registry access for early allocations and members-only drops.
          </p>
          <Link
            to="/shop"
            className="label inline-flex border border-foreground px-6 py-3 transition-colors hover:bg-foreground hover:text-background"
          >
            Shop Drop 001
          </Link>
          <button
            type="button"
            onClick={() => void logout().then(() => navigate({ to: "/login" }))}
            className="label block pt-4 text-foreground/55 underline-offset-4 transition-opacity hover:text-foreground hover:underline"
          >
            Sign out
          </button>
        </div>
      </main>
    </div>
  );
}
