import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import fabric from "@/assets/fabric.jpg";
import { registerVaultRegistry } from "@/lib/vault-registry.functions";

const VIP_ACCESS_KEY = "6foot_vip_access";
const VIP_PASSWORD = "6FOOT2026";

const ease = [0.22, 1, 0.36, 1] as const;

function getLaunchTargetMs() {
  const target = new Date();
  target.setMonth(target.getMonth() + 6);
  return target.getTime();
}

function formatChronograph(remainingMs: number) {
  const clamped = Math.max(0, remainingMs);
  const days = Math.floor(clamped / 86_400_000);
  const hrs = Math.floor((clamped % 86_400_000) / 3_600_000);
  const min = Math.floor((clamped % 3_600_000) / 60_000);
  const sec = Math.floor((clamped % 60_000) / 1_000);
  const ms = Math.floor(clamped % 1_000);

  return {
    raw: `${String(days).padStart(3, "0")}:${String(hrs).padStart(2, "0")}:${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}.${String(ms).padStart(3, "0")}`,
    days: String(days).padStart(3, "0"),
    hrs: String(hrs).padStart(2, "0"),
    min: String(min).padStart(2, "0"),
    sec: String(sec).padStart(2, "0"),
    ms: String(ms).padStart(3, "0"),
  };
}

function VaultCorner({ className }: { className: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute h-10 w-10 border-white/20 ${className}`}
    />
  );
}

function VaultBracket({ children, highlight = false }: { children: ReactNode; highlight?: boolean }) {
  return (
    <div
      className={`relative px-6 py-7 md:px-10 md:py-9 ${
        highlight
          ? "border border-white/25 bg-white/[0.04] shadow-[0_0_0_1px_rgb(255_255_255/0.06),0_24px_80px_rgb(0_0_0/0.45)]"
          : ""
      }`}
    >
      <span
        aria-hidden
        className={`pointer-events-none absolute top-0 left-0 h-5 w-5 border-t border-l ${highlight ? "border-white/50" : "border-white/25"}`}
      />
      <span
        aria-hidden
        className={`pointer-events-none absolute top-0 right-0 h-5 w-5 border-t border-r ${highlight ? "border-white/50" : "border-white/25"}`}
      />
      <span
        aria-hidden
        className={`pointer-events-none absolute bottom-0 left-0 h-5 w-5 border-b border-l ${highlight ? "border-white/50" : "border-white/25"}`}
      />
      <span
        aria-hidden
        className={`pointer-events-none absolute right-0 bottom-0 h-5 w-5 border-r border-b ${highlight ? "border-white/50" : "border-white/25"}`}
      />
      {highlight ? (
        <span
          aria-hidden
          className="vault-gate__registry-pulse pointer-events-none absolute inset-0 border border-white/20"
        />
      ) : null}
      {children}
    </div>
  );
}

function ChronographTicks() {
  return (
    <>
      {Array.from({ length: 60 }, (_, index) => {
        const major = index % 5 === 0;
        return (
          <line
            key={index}
            x1="100"
            y1={major ? "10" : "12"}
            x2="100"
            y2={major ? "18" : "15"}
            stroke="currentColor"
            strokeWidth={major ? "0.6" : "0.35"}
            opacity={major ? 0.55 : 0.22}
            transform={`rotate(${index * 6} 100 100)`}
          />
        );
      })}
    </>
  );
}

function ChronographDial({
  days,
  hrs,
  min,
  sec,
  ms,
}: {
  days: string;
  hrs: string;
  min: string;
  sec: string;
  ms: string;
}) {
  const segments = [
    { label: "Days", value: days },
    { label: "Hrs", value: hrs },
    { label: "Min", value: min },
    { label: "Sec", value: sec },
    { label: "Ms", value: ms },
  ];

  return (
    <div className="relative mx-auto w-full max-w-[22rem] md:max-w-[26rem]">
      <div className="relative mx-auto flex aspect-square w-[min(72vw,18rem)] items-center justify-center md:w-[min(42vw,20rem)]">
        <svg
          aria-hidden
          viewBox="0 0 200 200"
          className="absolute inset-0 h-full w-full text-white/70"
        >
          <circle cx="100" cy="100" r="97" fill="none" stroke="currentColor" strokeWidth="0.35" opacity="0.18" />
          <circle
            cx="100"
            cy="100"
            r="88"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.35"
            strokeDasharray="2 5"
            className="vault-chronograph-orbit"
          />
          <circle cx="100" cy="100" r="78" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.55" />
          <ChronographTicks />
          <circle cx="100" cy="100" r="2.25" fill="currentColor" opacity="0.85" />
          <g className="vault-chronograph-hand">
            <line x1="100" y1="22" x2="100" y2="34" stroke="currentColor" strokeWidth="0.85" />
            <circle cx="100" cy="22" r="1.1" fill="currentColor" />
          </g>
        </svg>

        <div className="relative z-10 grid w-[78%] grid-cols-5 gap-1 text-center md:gap-2">
          {segments.map((segment) => (
            <div key={segment.label} className="flex flex-col gap-1.5 md:gap-2">
              <span className="text-[8px] tracking-[0.22em] text-white/35 uppercase md:text-[9px]">
                {segment.label}
              </span>
              <span className="font-mono text-[13px] tracking-[0.08em] text-white tabular-nums md:text-[15px]">
                {segment.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function VaultGate() {
  const launchTargetMs = useMemo(() => getLaunchTargetMs(), []);
  const launchIso = useMemo(() => new Date(launchTargetMs).toISOString().slice(0, 10), [launchTargetMs]);
  const [chrono, setChrono] = useState(() => formatChronograph(launchTargetMs - Date.now()));
  const [email, setEmail] = useState("");
  const [registrySent, setRegistrySent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [registryError, setRegistryError] = useState<string | null>(null);
  const [bypassOpen, setBypassOpen] = useState(false);
  const [bypassValue, setBypassValue] = useState("");
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const tick = () => {
      setChrono(formatChronograph(launchTargetMs - Date.now()));
      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
    };
  }, [launchTargetMs]);

  const handleRegistrySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (registrySent || submitting || !email.includes("@")) return;

    setSubmitting(true);
    setRegistryError(null);

    try {
      await registerVaultRegistry({ data: { email } });
      setRegistrySent(true);
    } catch (err) {
      setRegistryError(err instanceof Error ? err.message : "Registry unavailable.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBypassSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (bypassValue !== VIP_PASSWORD) return;
    localStorage.setItem(VIP_ACCESS_KEY, "true");
    window.location.reload();
  };

  return (
    <div className="vault-gate relative flex min-h-screen flex-col overflow-hidden bg-[#070707] text-[#f4f4f2]">
      <div aria-hidden className="vault-gate__grid pointer-events-none absolute inset-0" />
      <div aria-hidden className="vault-gate__grain pointer-events-none absolute inset-0" />
      <div aria-hidden className="vault-gate__vignette pointer-events-none absolute inset-0" />
      <div aria-hidden className="vault-gate__scan pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" />

      <img
        src={fabric}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.07] mix-blend-screen"
      />

      <VaultCorner className="top-5 left-5 border-t border-l md:top-8 md:left-8" />
      <VaultCorner className="top-5 right-5 border-t border-r md:top-8 md:right-8" />
      <VaultCorner className="bottom-5 left-5 border-b border-l md:bottom-8 md:left-8" />
      <VaultCorner className="right-5 bottom-5 border-r border-b md:right-8 md:bottom-8" />

      <div className="absolute top-6 right-6 z-30 md:top-8 md:right-8">
        {bypassOpen ? (
          <form onSubmit={handleBypassSubmit} className="flex items-center gap-3">
            <input
              type="password"
              value={bypassValue}
              onChange={(event) => setBypassValue(event.target.value)}
              autoFocus
              placeholder="access code"
              className="w-36 border-0 border-b border-white/20 bg-transparent py-1 text-[10px] tracking-widest uppercase outline-none placeholder:text-white/25 focus:border-white/70"
            />
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setBypassOpen(true)}
            className="text-[10px] tracking-[0.24em] text-white/35 uppercase transition-colors hover:text-white"
          >
            BYPASS
          </button>
        )}
      </div>

      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease }}
        className="relative z-10 flex items-center justify-between px-6 pt-8 md:px-10 md:pt-10"
      >
        <p className="label text-white/45">6foot studio</p>
        <div className="flex items-center gap-3">
          <span className="vault-gate__pulse h-1.5 w-1.5 rounded-full bg-white/80" />
          <p className="label text-white/55">Vault sealed</p>
        </div>
      </motion.header>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-16 md:py-20">
        <motion.p
          aria-hidden
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease, delay: 0.1 }}
          className="display pointer-events-none absolute top-[18%] left-1/2 -translate-x-1/2 text-[clamp(4.5rem,22vw,13rem)] leading-none whitespace-nowrap text-white/[0.035] select-none"
        >
          6FOOT
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.15 }}
          className="mb-8 text-center md:mb-10"
        >
          <p className="label text-white/40">Chapter 001 · Time vault</p>
          <h1 className="display mt-4 text-[clamp(2rem,7vw,3.4rem)] tracking-[-0.06em] text-white">
            Allocation
            <span className="block text-white/30">pending.</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease, delay: 0.28 }}
          className="w-full"
        >
          <ChronographDial
            days={chrono.days}
            hrs={chrono.hrs}
            min={chrono.min}
            sec={chrono.sec}
            ms={chrono.ms}
          />
          <p className="label mt-5 text-center text-white/35">T-minus to chapter release · {launchIso}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.42 }}
          className="mt-12 w-full max-w-xl md:mt-14"
        >
          <VaultBracket highlight>
            {registrySent ? (
              <div className="text-center">
                <p className="text-sm tracking-[0.22em] text-white uppercase">You&apos;re on the list.</p>
                <p className="mt-3 text-sm leading-relaxed text-white/55">
                  We&apos;ll email you the moment Chapter 001 drops. First access goes to the registry.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegistrySubmit} className="space-y-5">
                <div className="space-y-2 text-center md:text-left">
                  <p className="label text-white/50">Drop alert · chapter 001</p>
                  <h2 className="display text-[clamp(1.5rem,5vw,2.25rem)] tracking-[-0.05em] text-white">
                    Get notified at drop.
                  </h2>
                  <p className="max-w-md text-sm leading-relaxed text-white/55 md:text-[15px]">
                    Leave your email for first access when we go live. Early registry gets allocation priority —
                    no spam.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                  <label htmlFor="vault-registry-email" className="sr-only">
                    Email for drop notification
                  </label>
                  <input
                    id="vault-registry-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="your@email.com"
                    className="min-h-12 flex-1 border border-white/25 bg-white/[0.06] px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-white focus:bg-white/[0.09]"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="label min-h-12 shrink-0 border border-white bg-white px-6 text-[#070707] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? "Joining…" : "Notify me"}
                  </button>
                </div>

                <p className="text-center text-[10px] tracking-[0.14em] text-white/40 uppercase sm:text-left">
                  ↳ Required to receive drop date + early access link
                </p>

                {registryError ? (
                  <p className="text-center text-[11px] tracking-wider text-white/60 uppercase sm:text-left">
                    {registryError}
                  </p>
                ) : null}
              </form>
            )}
          </VaultBracket>
        </motion.div>
      </div>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease, delay: 0.55 }}
        className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-6 py-4 md:px-10"
      >
        <p className="label text-white/30">Ref · TV-001 / UK</p>
        <p className="font-mono text-[9px] tracking-[0.18em] text-white/25 tabular-nums">{chrono.raw}</p>
        <p className="label text-white/30">Sys · chronograph live</p>
      </motion.footer>
    </div>
  );
}

export const VIP_STORAGE_KEY = VIP_ACCESS_KEY;

export function hasVaultVipAccess() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(VIP_ACCESS_KEY) === "true";
}
