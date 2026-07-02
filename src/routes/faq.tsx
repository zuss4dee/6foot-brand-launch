import { createFileRoute, Link } from "@tanstack/react-router";

import { FaqItem, LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ | 6foot" },
      {
        name: "description",
        content:
          "Frequently asked questions about 6foot sizing, shipping, returns, drops, and orders.",
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <LegalPage
      title="FAQ"
      intro="Straight answers on fit, fulfilment, and how we work. Still stuck? Contact the studio — we read every message."
    >
      <div>
        <p className="label mb-6 text-foreground/45">Orders & Delivery</p>
        <FaqItem question="When will my order dispatch?">
          <p>
            Orders are processed and dispatched from our Manchester studio within{" "}
            <strong>1–2 business days</strong> of purchase. During drop windows or high-volume
            periods, dispatch may take up to 48 hours. You will receive a shipping confirmation
            with tracking once your parcel leaves the studio.
          </p>
        </FaqItem>
        <FaqItem question="How long does delivery take?">
          <p>
            UK orders typically arrive within <strong>7–12 business days</strong> from dispatch via
            tracked courier. Delivery times can vary by region and carrier workload. International
            delivery, where available, is quoted at checkout.
          </p>
        </FaqItem>
        <FaqItem question="Do you offer free shipping?">
          <p>
            Complimentary UK shipping applies to orders over £150. Standard tracked delivery for
            orders below that threshold is calculated at checkout.
          </p>
        </FaqItem>
        <FaqItem question="How do I track my order?">
          <p>
            Use the link in your shipping confirmation email, or visit our{" "}
            <a
              href="https://checkout.6foot.store/apps/17TRACK"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Track Your Order
            </a>{" "}
            page with your order number and checkout email.
          </p>
        </FaqItem>
      </div>

      <div className="pt-4">
        <p className="label mb-6 text-foreground/45">Fit & Product</p>
        <FaqItem question="What makes 6foot different from regular streetwear?">
          <p>
            Every piece is built on a tall block — extended body length, longer sleeves, and a +2
            inch hem — so the garment sits where it should on a taller frame. Standard sizing charts
            are not designed for height; we engineer proportion first.
          </p>
        </FaqItem>
        <FaqItem question="How should I choose my size?">
          <p>
            Use the size guide on each product page. Tops run S–XXL from 5&apos;10&quot; / 178 cm upward.
            If you are between sizes, we generally recommend sizing up for an easier drape on the tall block. For specific fit questions, email{" "}
            <a
              href="mailto:studio@6foot.eu"
              className="underline underline-offset-2 hover:text-foreground"
            >
              studio@6foot.eu
            </a>{" "}
            with your height and usual size in other brands.
          </p>
        </FaqItem>
        <FaqItem question="What fabric do you use?">
          <p>
            Drop 001 is cut from 240gsm heavyweight cotton across the capsule. Fabric composition
            and care instructions are listed on each product page and on the garment label.
          </p>
        </FaqItem>
      </div>

      <div className="pt-4">
        <p className="label mb-6 text-foreground/45">Returns & Exchanges</p>
        <FaqItem question="Can I return an item?">
          <p>
            Yes. Under UK consumer law you may return unworn items within 14 days of delivery.
            Garments must be unworn, unaltered, and returned with all original tags and packaging
            attached. See our full{" "}
            <Link
              to="/shipping-returns"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Shipping &amp; Returns
            </Link>{" "}
            policy for details.
          </p>
        </FaqItem>
        <FaqItem question="Do you offer exchanges?">
          <p>
            We do not hold exchange stock during limited drops. If you need a different size,
            return the original item per our returns policy and place a new order if your size is
            still available. Contact us if you need help before returning.
          </p>
        </FaqItem>
        <FaqItem question="Who pays for return postage?">
          <p>
            Return postage is the customer&apos;s responsibility unless the item is faulty or we
            have made an error. We recommend using a tracked service and keeping proof of postage.
          </p>
        </FaqItem>
      </div>

      <div className="pt-4">
        <p className="label mb-6 text-foreground/45">Drops & Availability</p>
        <FaqItem question="Will sold-out pieces restock?">
          <p>
            Drop 001 is a fixed capsule. We do not guarantee restocks on sold-out pieces. Join the
            newsletter on the{" "}
            <Link to="/" className="underline underline-offset-2 hover:text-foreground">
              homepage
            </Link>{" "}
            for priority access to future releases.
          </p>
        </FaqItem>
        <FaqItem question="Can I cancel or change my order?">
          <p>
            If your order has not yet dispatched, contact us immediately at{" "}
            <a
              href="mailto:studio@6foot.eu"
              className="underline underline-offset-2 hover:text-foreground"
            >
              studio@6foot.eu
            </a>
            . Once fulfilment has started we cannot amend the order.
          </p>
        </FaqItem>
      </div>

      <div className="pt-4">
        <p className="label mb-6 text-foreground/45">Account & Payment</p>
        <FaqItem question="How do I pay?">
          <p>
            Checkout is handled securely by Shopify. We accept major cards and Shop Pay where
            available. All prices are shown in GBP (£).
          </p>
        </FaqItem>
        <FaqItem question="Do I need an account to order?">
          <p>
            No. You can check out as a guest. Creating an account gives you faster access to order
            history and members-only drops via the vault.
          </p>
        </FaqItem>
      </div>
    </LegalPage>
  );
}
