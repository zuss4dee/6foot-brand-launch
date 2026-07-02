import { createFileRoute, Link } from "@tanstack/react-router";

import { LegalPage, LegalSection } from "@/components/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | 6foot" },
      {
        name: "description",
        content:
          "Terms and conditions governing use of 6foot.store and purchase of 6foot studio products.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      intro="The rules of the road for using 6foot.store and purchasing from the studio. Plain language where we can. UK law where it matters."
    >
      <LegalSection title="Agreement">
        <p>
          These Terms &amp; Conditions (&quot;Terms&quot;) govern your use of 6foot.store and any
          purchase from 6foot Studio (&quot;we&quot;, &quot;us&quot;). By accessing the site or
          placing an order, you agree to these Terms. If you do not agree, do not use the site.
        </p>
        <p className="label text-foreground/50">Last updated · July 2026</p>
      </LegalSection>

      <LegalSection title="About Us">
        <p>
          6foot Studio designs and sells proportioned streetwear direct to customers from Manchester,
          UK. The website 6foot.store is our official sales channel. Contact:{" "}
          <a
            href="mailto:studio@6foot.eu"
            className="underline underline-offset-2 hover:text-foreground"
          >
            studio@6foot.eu
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="Eligibility">
        <p>
          You must be at least 18 years old, or have permission from a parent or guardian, to place
          an order. By purchasing, you confirm that information you provide is accurate and
          complete.
        </p>
      </LegalSection>

      <LegalSection title="Products & Drops">
        <p>
          Product imagery, descriptions, and specifications are provided in good faith. Minor
          variations in colour, texture, or finish may occur due to photography, screen settings, or
          natural fabric variation.
        </p>
        <p>
          Releases are often limited to fixed allocations. Quantities are not guaranteed once sold
          out. We reserve the right to limit order quantities per customer to ensure fair access
          during drops.
        </p>
      </LegalSection>

      <LegalSection title="Pricing & Payment">
        <p>
          All prices are listed in GBP (£) unless otherwise stated and include VAT where applicable.
          Payment is processed securely through Shopify at checkout. We accept the payment methods
          displayed at checkout.
        </p>
        <p>
          We reserve the right to correct pricing errors before an order is confirmed. If an error
          affects your order, we will contact you and offer the option to proceed at the correct
          price or cancel for a full refund.
        </p>
      </LegalSection>

      <LegalSection title="Orders & Acceptance">
        <p>
          Placing an order constitutes an offer to purchase. A contract is formed when we send your
          order confirmation email. We may refuse or cancel orders placed in error, through fraud,
          in violation of purchase limits, or where we suspect automated or reseller activity.
        </p>
      </LegalSection>

      <LegalSection title="Shipping & Returns">
        <p>
          Delivery, dispatch times, and returns are governed by our{" "}
          <Link
            to="/shipping-returns"
            className="underline underline-offset-2 hover:text-foreground"
          >
            Shipping &amp; Returns
          </Link>{" "}
          policy, which forms part of these Terms. Orders dispatch within 1–2 business days. UK
          delivery typically arrives 7–12 business days from dispatch.
        </p>
      </LegalSection>

      <LegalSection title="Intellectual Property">
        <p>
          All designs, sizing blocks, product names, logos, photography, film, typography, and media
          on this site are the exclusive property of 6foot Studio or its licensors. Nothing on this
          site grants a licence to reproduce, distribute, or commercially exploit our content
          without prior written consent.
        </p>
      </LegalSection>

      <LegalSection title="Acceptable Use">
        <p>You agree not to:</p>
        <ul className="list-inside list-disc space-y-2 pl-1">
          <li>Use the site for unlawful purposes or in violation of applicable law</li>
          <li>Attempt to gain unauthorised access to our systems or customer accounts</li>
          <li>Scrape, harvest, or automate access to the site without permission</li>
          <li>Interfere with the proper functioning or security of the site</li>
          <li>Resell products in breach of any stated purchase limits or drop conditions</li>
        </ul>
      </LegalSection>

      <LegalSection title="Accounts">
        <p>
          If you create an account, you are responsible for keeping your login credentials
          confidential and for activity under your account. Notify us immediately if you suspect
          unauthorised access.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of Liability">
        <p>
          To the fullest extent permitted by UK law, 6foot Studio shall not be liable for indirect,
          incidental, or consequential loss arising from use of this site or delay in delivery
          beyond our reasonable control — including carrier delays, customs holds, or events of
          force majeure.
        </p>
        <p>
          Nothing in these Terms limits or excludes liability for death or personal injury caused by
          negligence, fraud, or any liability that cannot be excluded under UK law. Your statutory
          consumer rights are not affected.
        </p>
      </LegalSection>

      <LegalSection title="Privacy">
        <p>
          Our use of personal data is described in our{" "}
          <Link to="/privacy" className="underline underline-offset-2 hover:text-foreground">
            Privacy Policy
          </Link>
          , which forms part of these Terms.
        </p>
      </LegalSection>

      <LegalSection title="Governing Law">
        <p>
          These Terms are governed by the laws of England and Wales. Disputes shall be subject to
          the exclusive jurisdiction of the courts of England and Wales, without prejudice to your
          mandatory consumer rights in your country of residence where applicable.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about these Terms? Visit our{" "}
          <Link to="/contact" className="underline underline-offset-2 hover:text-foreground">
            Contact
          </Link>{" "}
          page or email{" "}
          <a
            href="mailto:studio@6foot.eu"
            className="underline underline-offset-2 hover:text-foreground"
          >
            studio@6foot.eu
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
