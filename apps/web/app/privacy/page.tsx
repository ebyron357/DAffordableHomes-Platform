import type { Metadata } from "next"
import Link from "next/link"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"
import { Container } from "@/components/ui/container"
import { Prose } from "@/components/page/prose"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How D'Affordable Homes collects, uses, and protects your information. We only use what you share to help you, and never sell your data.",
}

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Policies"
        title="Privacy Policy"
        crumbs={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
      />
      <Section>
        <Container>
          <Prose>
            <p>
              Your trust matters to us. This policy explains, in plain language, how D&apos;Affordable Homes handles
              information you choose to share. A finalized legal version will be published prior to public launch.
            </p>
            <h2>What we collect</h2>
            <p>
              We only collect what you choose to send through a form. You do not need an account to learn on this site,
              and the guides, calculators and quizzes work without asking who you are.
            </p>
            <ul>
              <li>
                <strong>Contact and consultation form:</strong> your name, email and message, and, if you add them, your
                phone number, how you prefer to connect, and where you are in the homebuying process.
              </li>
              <li>
                <strong>NACA and Homes for Heroes forms:</strong> your first and last name, email, phone number, current
                city, the city and ZIP code you are interested in, your timeline, how you prefer to be contacted, your
                answers about the program, any questions you add, and your consent to be contacted.
              </li>
              <li>
                <strong>Find My Next Step:</strong> your first name, email, an optional mobile number, the next step you
                chose and the result of the guided check.
              </li>
              <li>
                <strong>Booking calendar:</strong>{" "}
                when the consultation page shows a calendar, it is Debra&apos;s
                scheduling system (GoHighLevel) displayed inside the page. What you enter there to book a time goes
                directly to that system, not through this website, and the calendar may use its own cookies under
                GoHighLevel&apos;s terms.
              </li>
            </ul>
            <p>
              Each form also records the page you sent it from. The program and Find My Next Step forms also record the
              page that referred you and any campaign tags in the link that brought you here (for example{" "}
              <code>utm_source</code>), so Debra knows how you found her.
            </p>
            <p>
              Your answers to a guided check stay in your browser unless you send a form. Find My Next Step keeps your
              progress in this browser tab only, and it is cleared when you close the tab. This site does not load
              advertising or analytics trackers of its own.
            </p>
            <p>
              Like any website, our hosting provider receives standard technical details with each visit, such as your
              IP address and browser type. The site uses your IP address briefly to limit repeated form submissions and
              block spam. It is not sent along with your message.
            </p>
            <h2>Where it goes</h2>
            <p>
              A form you send is passed straight to the system Debra uses to read and answer inquiries. This website does
              not keep its own copy. If that system is not connected, the form tells you your message was not sent, and
              nothing you typed is kept.
            </p>
            <h2>How we use it</h2>
            <ul>
              <li>To respond to your questions and consultation requests</li>
              <li>To share resources you ask for</li>
              <li>To improve our education and tools</li>
            </ul>
            <h2>What we don&apos;t do</h2>
            <p>
              We do not sell your personal information. We do not send high-pressure marketing. You can ask us to
              delete your information at any time.
            </p>
            <h2>Contact</h2>
            <p>
              Questions about privacy? <Link href="/contact">Reach out</Link>{" "}
              and we&apos;ll be glad to help.
            </p>
          </Prose>
        </Container>
      </Section>
    </>
  )
}
