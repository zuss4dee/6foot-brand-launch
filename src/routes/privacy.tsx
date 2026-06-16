import { createFileRoute } from "@tanstack/react-router";

import { LegalPage, LegalSection } from "@/components/LegalPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — 6foot" },
      {
        name: "description",
        content: "How 6foot studio collects, processes, and protects your personal data under UK GDPR.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <LegalSection title="Data Controller">
        <p>
          6foot Studio (&quot;we&quot;, &quot;us&quot;) is the data controller for personal information
          collected through 6foot.store. For privacy enquiries, contact{" "}
          <a href="mailto:studio@6foot.eu" className="underline underline-offset-2 hover:text-foreground">
            studio@6foot.eu
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="What We Collect">
        <p>
          We process only the data required to operate a headless e-commerce store: email addresses
          (newsletter, account, and order communications), shipping and billing addresses, order
          history, and technical session data such as cookies that keep the site functional.
        </p>
      </LegalSection>

      <LegalSection title="How We Use Your Data">
        <p>
          Customer data is processed strictly for order fulfillment, delivery, customer support, and
          — where you have opted in — marketing communications relating to drops and product
          releases. We do not sell, rent, or trade your personal information to third parties.
        </p>
      </LegalSection>

      <LegalSection title="Shopify Processing">
        <p>
          Checkout, payment, and customer vault storage are handled by Shopify&apos;s secure
          infrastructure. Email addresses and shipping addresses entered at checkout are transmitted
          directly to Shopify for fulfillment purposes and are subject to Shopify&apos;s own privacy
          and security standards. We do not store payment card details on 6foot servers.
        </p>
      </LegalSection>

      <LegalSection title="Legal Basis (UK GDPR)">
        <p>
          We rely on contractual necessity to process order and delivery data, legitimate interests to
          operate and secure our website, and consent where you subscribe to marketing communications.
          You may withdraw marketing consent at any time via the unsubscribe link in our emails.
        </p>
      </LegalSection>

      <LegalSection title="Retention">
        <p>
          Order records are retained for the period required by UK tax and accounting law. Marketing
          data is kept until you unsubscribe or request deletion. Cookie preference data is stored
          locally in your browser until cleared.
        </p>
      </LegalSection>

      <LegalSection title="Your Rights">
        <p>
          Under UK GDPR you have the right to access, rectify, erase, restrict, or object to
          processing of your personal data, and to data portability where applicable. You may lodge a
          complaint with the Information Commissioner&apos;s Office (ICO) if you believe your rights
          have been infringed.
        </p>
      </LegalSection>

      <LegalSection title="Cookies">
        <p>
          We use essential and analytics cookies to optimize site performance. By selecting
          &quot;Accept&quot; on our cookie banner, you consent to this use. You may clear cookies via
          your browser settings at any time.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
