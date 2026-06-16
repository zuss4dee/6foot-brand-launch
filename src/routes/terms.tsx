import { createFileRoute, Link } from "@tanstack/react-router";

import { LegalPage, LegalSection } from "@/components/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — 6foot" },
      {
        name: "description",
        content: "Terms governing use of 6foot.store and purchase of 6foot studio products.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalPage title="Terms of Service">
      <LegalSection title="Agreement">
        <p>
          By accessing 6foot.store or placing an order, you agree to these Terms of Service. If you
          do not agree, do not use this site.
        </p>
      </LegalSection>

      <LegalSection title="Intellectual Property">
        <p>
          All designs, sizing blocks, product names, photography, film, typography, and media
          displayed on this site are the exclusive property of 6foot Studio. No content may be
          reproduced, distributed, or used for commercial purposes without prior written consent.
        </p>
      </LegalSection>

      <LegalSection title="Product & Drop Policy">
        <p>
          Product availability is strictly limited to stated drop allocations. Quantities are fixed at
          launch and no restocks are guaranteed. We reserve the right to cancel orders placed in
          error, through fraud, or in violation of purchase limits.
        </p>
      </LegalSection>

      <LegalSection title="Pricing & Payment">
        <p>
          All prices are listed in GBP (£) unless otherwise stated. Payment is processed securely
          through Shopify at checkout. We reserve the right to amend pricing errors prior to order
          confirmation.
        </p>
      </LegalSection>

      <LegalSection title="Shipping & Returns">
        <p>
          Delivery and returns are governed by our{" "}
          <Link to="/shipping-returns" className="underline underline-offset-2 hover:text-foreground">
            Shipping &amp; Returns
          </Link>{" "}
          policy, which forms part of these terms.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of Liability">
        <p>
          To the fullest extent permitted by UK law, 6foot Studio shall not be liable for indirect or
          consequential loss arising from use of this site or delay in delivery beyond our reasonable
          control. Nothing in these terms limits your statutory consumer rights.
        </p>
      </LegalSection>

      <LegalSection title="Governing Law">
        <p>
          These terms are governed by the laws of England and Wales. Disputes shall be subject to the
          exclusive jurisdiction of the courts of England and Wales.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
