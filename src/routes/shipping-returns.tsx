import { createFileRoute, Link } from "@tanstack/react-router";

import { LegalPage, LegalSection } from "@/components/LegalPage";

export const Route = createFileRoute("/shipping-returns")({
  head: () => ({
    meta: [
      { title: "Shipping & Returns | 6foot" },
      {
        name: "description",
        content:
          "6foot shipping and returns policy. Dispatch in 1–2 days. UK delivery in 7–12 business days.",
      },
    ],
  }),
  component: ShippingReturnsPage,
});

function ShippingReturnsPage() {
  return (
    <LegalPage
      title="Shipping & Returns"
      intro="Fulfilled from Manchester. Tracked delivery. Returns accepted within 14 days under UK consumer law."
    >
      <LegalSection title="Dispatch">
        <p>
          Orders are processed and dispatched from our Manchester studio within{" "}
          <strong>1–2 business days</strong> of purchase. You will receive an email confirmation
          when your order is placed, and a separate shipping confirmation with tracking once your
          parcel has left the studio.
        </p>
        <p>
          During drop windows or periods of high demand, dispatch may take up to 48 hours. We
          fulfil in the order received — we do not offer priority dispatch tiers.
        </p>
      </LegalSection>

      <LegalSection title="UK Delivery">
        <p>
          UK orders are sent via tracked courier. Once dispatched, delivery typically takes{" "}
          <strong>7–12 business days</strong>, depending on your location and carrier schedules.
          Business days are Monday–Friday, excluding UK bank holidays.
        </p>
        <p>
          Complimentary shipping applies to UK orders over £150. For orders below that threshold,
          standard tracked delivery is calculated at checkout. Delivery is to the address entered at
          checkout — we cannot redirect parcels once they are in transit.
        </p>
      </LegalSection>

      <LegalSection title="International Delivery">
        <p>
          Where international shipping is available, rates and estimated delivery windows are shown
          at checkout. Import duties, taxes, and customs charges are the responsibility of the
          recipient where applicable. We are not liable for delays caused by customs processing.
        </p>
      </LegalSection>

      <LegalSection title="Track Your Order">
        <p>
          Use the tracking link in your shipping confirmation, or visit our{" "}
          <a
            href="https://checkout.6foot.store/apps/17TRACK"
            className="underline underline-offset-2 hover:text-foreground"
          >
            Track Your Order
          </a>{" "}
          page. You will need your order number and the email address used at checkout.
        </p>
      </LegalSection>

      <LegalSection title="Delivery Issues">
        <p>
          If your tracking shows delivered but you have not received the parcel, check with
          neighbours, your building reception, and any safe-place instructions left by the courier.
          Contact us at{" "}
          <a
            href="mailto:studio@6foot.eu"
            className="underline underline-offset-2 hover:text-foreground"
          >
            studio@6foot.eu
          </a>{" "}
          within 7 days of the marked delivery date and we will investigate with the carrier.
        </p>
        <p>
          We are not responsible for delays caused by incorrect addresses, failed delivery
          attempts, or events outside our reasonable control.
        </p>
      </LegalSection>

      <LegalSection title="Returns">
        <p>
          In accordance with the UK Consumer Contracts Regulations, you have the right to cancel
          your order and return items within <strong>14 days</strong> of receiving your delivery.
          To be eligible for a refund, garments must be:
        </p>
        <ul className="list-inside list-disc space-y-2 pl-1">
          <li>Unworn, unwashed, and unaltered</li>
          <li>Returned in original packaging with all tags attached</li>
          <li>Free from odour, damage, or signs of wear</li>
        </ul>
        <p>
          To start a return, email{" "}
          <a
            href="mailto:studio@6foot.eu"
            className="underline underline-offset-2 hover:text-foreground"
          >
            studio@6foot.eu
          </a>{" "}
          with your order number and the item(s) you wish to return. We will confirm the return
          address and next steps.
        </p>
      </LegalSection>

      <LegalSection title="Refunds">
        <p>
          Once we receive and inspect your return, refunds are issued to the original payment method
          within 5–10 business days. Original shipping charges are non-refundable unless the return
          is due to our error or a faulty item.
        </p>
        <p>
          Return postage is your responsibility unless otherwise stated. We recommend a tracked
          service and retaining proof of postage until your refund is confirmed.
        </p>
      </LegalSection>

      <LegalSection title="Exchanges">
        <p>
          We do not operate a direct exchange service during limited drops. If you need a different
          size, return the original item per this policy and place a new order if stock remains.
          Contact the studio before returning if you are unsure about sizing.
        </p>
      </LegalSection>

      <LegalSection title="Faulty or Incorrect Items">
        <p>
          If you receive a faulty garment or the wrong item, contact us within 48 hours of delivery
          with your order number and photographs. We will arrange a replacement or full refund,
          including return postage where applicable.
        </p>
      </LegalSection>

      <LegalSection title="Questions">
        <p>
          See our{" "}
          <Link to="/faq" className="underline underline-offset-2 hover:text-foreground">
            FAQ
          </Link>{" "}
          or{" "}
          <Link to="/contact" className="underline underline-offset-2 hover:text-foreground">
            Contact
          </Link>{" "}
          page for further help.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
