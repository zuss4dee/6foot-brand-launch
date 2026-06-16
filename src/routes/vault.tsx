import { createFileRoute } from "@tanstack/react-router";

import { VaultGate } from "@/components/VaultGate";

export const Route = createFileRoute("/vault")({
  head: () => ({
    meta: [
      { title: "Time Vault — 6foot" },
      {
        name: "description",
        content: "Chapter 001 allocation registry. Pre-launch access for 6foot studio.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: VaultPreview,
});

function VaultPreview() {
  return <VaultGate />;
}
