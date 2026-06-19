import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";

import { SiteNav } from "@/components/SiteNav";
import { useCustomerAuth } from "@/lib/customer-auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Member Access | 6foot" },
      { name: "description", content: "Sign in or register for members-only access to 6foot." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { session, login, signup } = useCustomerAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (session.authenticated) {
    return (
      <div className="min-h-dvh bg-background text-foreground">
        <SiteNav />
        <main className="mx-auto flex max-w-md flex-col px-6 pb-16 nav-offset md:pt-32">
          <p className="label text-foreground/50">Member access</p>
          <h1 className="display mt-4 text-3xl">You&apos;re signed in.</h1>
          <p className="mt-3 text-sm text-foreground/65">{session.email}</p>
          <Link
            to="/account"
            className="label mt-8 inline-flex w-fit border border-foreground px-6 py-3 transition-colors hover:bg-foreground hover:text-background"
          >
            Go to account
          </Link>
        </main>
      </div>
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      await navigate({ to: "/account" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteNav />
      <main className="mx-auto flex max-w-md flex-col px-6 pb-16 nav-offset md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="label text-foreground/50">Registry</p>
          <h1 className="display mt-4 text-[clamp(2rem,8vw,2.75rem)] leading-[0.95]">
            {mode === "login" ? "Member sign in" : "Create membership"}
          </h1>
          <p className="mt-4 max-w-[34ch] text-sm leading-relaxed text-foreground/65">
            {mode === "login"
              ? "Access early allocations and members-only drops."
              : "Join the registry. One account for priority access across drops."}
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-8">
            <div>
              <label htmlFor="email" className="label mb-3 block text-foreground/50">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full border-0 border-b border-foreground bg-transparent py-3 text-base outline-none placeholder:text-foreground/30 focus:border-foreground"
                placeholder="your@email"
              />
            </div>

            <div>
              <label htmlFor="password" className="label mb-3 block text-foreground/50">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full border-0 border-b border-foreground bg-transparent py-3 text-base outline-none placeholder:text-foreground/30 focus:border-foreground"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-foreground/80" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="label w-full bg-foreground px-6 py-4 text-background transition-opacity hover:opacity-85 disabled:opacity-50"
            >
              {submitting ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setMode((current) => (current === "login" ? "signup" : "login"));
              setError(null);
            }}
            className="label mt-8 text-foreground/55 underline-offset-4 transition-opacity hover:text-foreground hover:underline"
          >
            {mode === "login" ? "New here? Create membership" : "Already registered? Sign in"}
          </button>
        </motion.div>
      </main>
    </div>
  );
}
