import { useRouterState } from "@tanstack/react-router";
import { useLayoutEffect, useState, type ReactNode } from "react";

import { VaultGate, hasVaultVipAccess } from "@/components/VaultGate";
import { IS_PRE_LAUNCH_MODE } from "@/lib/pre-launch";

export function SiteVaultGate({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [vipAccess, setVipAccess] = useState(false);

  useLayoutEffect(() => {
    if (!IS_PRE_LAUNCH_MODE) return;
    setVipAccess(hasVaultVipAccess());
  }, []);

  if (!IS_PRE_LAUNCH_MODE) return children;

  if (!vipAccess && pathname !== "/vault") {
    return <VaultGate />;
  }

  return children;
}
