import { useRouterState } from "@tanstack/react-router";
import { useLayoutEffect, useState, type ReactNode } from "react";

import { VaultGate, hasVaultVipAccess } from "@/components/VaultGate";
import { IS_PRE_LAUNCH_MODE } from "@/lib/pre-launch";

export function SiteVaultGate({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [ready, setReady] = useState(!IS_PRE_LAUNCH_MODE);
  const [vipAccess, setVipAccess] = useState(false);

  useLayoutEffect(() => {
    if (!IS_PRE_LAUNCH_MODE) return;
    setVipAccess(hasVaultVipAccess());
    setReady(true);
  }, []);

  if (!IS_PRE_LAUNCH_MODE) return children;

  if (!ready) {
    return <div className="min-h-screen bg-background" aria-hidden />;
  }

  if (!vipAccess && pathname !== "/vault") {
    return <VaultGate />;
  }

  return children;
}
