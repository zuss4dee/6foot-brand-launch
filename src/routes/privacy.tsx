import { createFileRoute, Link } from "@tanstack/react-router";

import { LegalPage, LegalSection } from "@/components/LegalPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | 6foot" },
      {
        name: "description",
        content:
          "How 6foot studio collects, uses, and protects your personal data under UK GDPR.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="We collect only what we need to run the store, fulfil orders, and communicate with you. No selling your data. No unnecessary noise."
    >
      <LegalSection title="Who We Are">
        <p>
          6foot Studio (&quot;6foot&quot;, &quot;we&quot;, &quot;us&quot;) operates 6foot.store. We
          are the data controller for personal information collected through this website. For
          privacy enquiries, contact{" "}
          <a
            href="mailto:studio@6foot.eu"
            className="underline underline-offset-2 hover:text-foreground"
          >
            studio@6foot.eu
          </a>
          .
        </p>
        <p className="label text-foreground/50">Last updated · July 2026</p>
      </LegalSection>

      <LegalSection title="What We Collect">
        <p>Depending on how you use the site, we may process:</p>
        <ul className="list-inside list-disc space-y-2 pl-1">
          <li>Identity and contact data — name, email address, billing and shipping address</li>
          <li>Order data — products purchased, transaction history, delivery status</li>
          <li>Account data — login credentials if you create a customer account</li>
          <li>Marketing data — email address and preferences if you join the newsletter</li>
          <li>Technical data — IP address, browser type, device information, and cookies</li>
          <li>Communications — messages you send to customer care</li>
        </ul>
        <p>
          We do not collect payment card details directly. Card payments are processed by Shopify
          and its payment partners.
        </p>
      </LegalSection>

      <LegalSection title="How We Use Your Data">
        <p>We use personal data to:</p>
        <ul className="list-inside list-disc space-y-2 pl-1">
          <li>Process and fulfil orders, including delivery and returns</li>
          <li>Provide customer support and respond to enquiries</li>
          <li>Operate your account and members-only features where applicable</li>
          <li>Send service messages about your order or account</li>
          <li>Send marketing about drops and releases, where you have opted in</li>
          <li>Maintain site security, prevent fraud, and improve performance</li>
          <li>Comply with legal and accounting obligations</li>
        </ul>
        <p>
          We do not sell, rent, or trade your personal information to third parties for their
          marketing purposes.
        </p>
      </LegalSection>

      <LegalSection title="Legal Basis (UK GDPR)">
        <p>We process personal data on the following bases:</p>
        <ul className="list-inside list-disc space-y-2 pl-1">
          <li>
            <strong>Contract</strong> — to process and deliver your order, manage returns, and
            provide account services
          </li>
          <li>
            <strong>Legitimate interests</strong> — to operate, secure, and improve our website and
            business, provided your rights are not overridden
          </li>
          <li>
            <strong>Consent</strong> — for marketing emails and non-essential cookies where
            required
          </li>
          <li>
            <strong>Legal obligation</strong> — for tax, accounting, and regulatory requirements
          </li>
        </ul>
        <p>
          You may withdraw marketing consent at any time using the unsubscribe link in our emails or
          by contacting us directly.
        </p>
      </LegalSection>

      <LegalSection title="Shopify & Service Providers">
        <p>
          Checkout, payment processing, order management, and customer account storage are handled
          by Shopify and its infrastructure providers. Data entered at checkout is transmitted to
          Shopify for fulfilment and is subject to Shopify&apos;s privacy and security standards.
        </p>
        <p>
          We also use trusted service providers for email delivery, analytics, and shipping
          carriers. These providers process data only on our instructions and for defined purposes.
        </p>
      </LegalSection>

      <LegalSection title="International Transfers">
        <p>
          Some service providers may process data outside the UK. Where this occurs, we ensure
          appropriate safeguards are in place — such as UK adequacy regulations or standard
          contractual clauses — in line with UK GDPR requirements.
        </p>
      </LegalSection>

      <LegalSection title="Retention">
        <p>
          We retain order and transaction records for as long as required by UK tax and accounting
          law. Marketing data is kept until you unsubscribe or ask us to delete it. Customer care
          correspondence is retained as long as needed to resolve your enquiry and for a reasonable
          period thereafter.
        </p>
        <p>
          Cookie and analytics data is retained according to the lifespan of each cookie or as
          configured in our analytics tools.
        </p>
      </LegalSection>

      <LegalSection title="Your Rights">
        <p>Under UK data protection law, you have the right to:</p>
        <ul className="list-inside list-disc space-y-2 pl-1">
          <li>Access the personal data we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request erasure in certain circumstances</li>
          <li>Restrict or object to processing in certain circumstances</li>
          <li>Request data portability where applicable</li>
          <li>Withdraw consent at any time for consent-based processing</li>
        </ul>
        <p>
          To exercise these rights, email{" "}
          <a
            href="mailto:studio@6foot.eu"
            className="underline underline-offset-2 hover:text-foreground"
          >
            studio@6foot.eu
          </a>
          . You may also lodge a complaint with the UK Information Commissioner&apos;s Office (ICO)
          at{" "}
          <a
            href="https://ico.org.uk"
            className="underline underline-offset-2 hover:text-foreground"
            rel="noopener noreferrer"
            target="_blank"
          >
            ico.org.uk
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="Cookies">
        <p>
          We use essential cookies to keep the site functional — for example, cart and session
          management. With your consent, we may use analytics cookies to understand how the site is
          used and improve the experience.
        </p>
        <p>
          You can manage cookie preferences via our cookie banner or your browser settings. Disabling
          essential cookies may affect site functionality.
        </p>
      </LegalSection>

      <LegalSection title="Children">
        <p>
          6foot.store is not directed at children under 16. We do not knowingly collect personal
          data from children. If you believe a child has provided us with personal data, contact us
          and we will delete it.
        </p>
      </LegalSection>

      <LegalSection title="Changes to This Policy">
        <p>
          We may update this policy from time to time. Material changes will be posted on this
          page with an updated date. Continued use of the site after changes constitutes acceptance
          of the revised policy where permitted by law.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about privacy? Email{" "}
          <a
            href="mailto:studio@6foot.eu"
            className="underline underline-offset-2 hover:text-foreground"
          >
            studio@6foot.eu
          </a>{" "}
          or visit our{" "}
          <Link to="/contact" className="underline underline-offset-2 hover:text-foreground">
            Contact
          </Link>{" "}
          page.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
