import { createFileRoute } from "@tanstack/react-router";

import { LegalPage, LegalSection } from "@/components/LegalPage";

export const Route = createFileRoute("/shipping-returns")({
  head: () => ({
    meta: [
      { title: "Shipping & Returns — 6foot" },
      {
        name: "description",
        content: "Fulfillment, UK delivery, and returns policy for 6foot studio.",
      },
    ],
  }),
  component: ShippingReturnsPage,
});

function ShippingReturnsPage() {
  return (
    <LegalPage title="Shipping & Returns">
      <LegalSection title="Fulfillment">
        <p>
          Orders are processed and dispatched from our Manchester studio within 48 hours of drop
          conclusion. All domestic shipments are sent via tracked courier services.
        </p>
      </LegalSection>

      <LegalSection title="UK Delivery">
        <p>
          Complimentary shipping on orders over £150. Standard tracked delivery is calculated at
          checkout.
        </p>
      </LegalSection>

      <LegalSection title="Returns">
        <p>
          In accordance with UK consumer law, we accept return requests within 14 days of delivery.
          Garments must be unworn, unaltered, and retained in original packaging with all
          architectural tags attached. Return shipping is the responsibility of the client.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
