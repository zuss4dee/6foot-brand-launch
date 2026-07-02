import { createFileRoute, Link } from "@tanstack/react-router";

import { LegalPage, LegalSection } from "@/components/LegalPage";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | 6foot" },
      {
        name: "description",
        content:
          "Contact 6foot studio for orders, sizing, returns, and general enquiries. Manchester-based proportioned streetwear.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <LegalPage
      title="Contact"
      intro="Direct line to the studio. For order updates, check your confirmation email or track your parcel before you write in."
    >
      <LegalSection title="Customer Care">
        <p>
          For orders, delivery, returns, sizing, and product questions, email{" "}
          <a
            href="mailto:studio@6foot.eu"
            className="underline underline-offset-2 hover:text-foreground"
          >
            studio@6foot.eu
          </a>
          . Include your order number if you have one — it helps us respond faster.
        </p>
        <p>
          We reply within 48 hours on business days (Monday–Friday, UK time). Messages received
          over the weekend or on UK bank holidays are answered on the next working day.
        </p>
      </LegalSection>

      <LegalSection title="Track an Order">
        <p>
          If your order has dispatched, use our tracking page for live delivery updates. You will
          need your order number and the email used at checkout.
        </p>
        <p>
          <a
            href="https://checkout.6foot.store/apps/17TRACK"
            className="label inline-flex border border-foreground px-5 py-3 transition-colors hover:bg-foreground hover:text-background"
          >
            Track your order
          </a>
        </p>
      </LegalSection>

      <LegalSection title="Before You Write">
        <p>
          Many answers are already covered in our{" "}
          <Link to="/faq" className="underline underline-offset-2 hover:text-foreground">
            FAQ
          </Link>{" "}
          and{" "}
          <Link
            to="/shipping-returns"
            className="underline underline-offset-2 hover:text-foreground"
          >
            Shipping &amp; Returns
          </Link>{" "}
          pages — dispatch windows, delivery times, returns, and sizing notes.
        </p>
      </LegalSection>

      <LegalSection title="Studio">
        <p>
          6foot is designed and fulfilled from Manchester, UK. We are a direct-to-customer studio —
          not a retail store — so we do not offer walk-in appointments or phone support at this time.
        </p>
        <p className="label text-foreground/50">Manchester · United Kingdom</p>
      </LegalSection>

      <LegalSection title="Press & Partnerships">
        <p>
          For press, collaborations, or wholesale enquiries, use the same address:{" "}
          <a
            href="mailto:studio@6foot.eu?subject=Press%20%2F%20Partnership"
            className="underline underline-offset-2 hover:text-foreground"
          >
            studio@6foot.eu
          </a>
          . Put &quot;Press&quot; or &quot;Partnership&quot; in the subject line.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
