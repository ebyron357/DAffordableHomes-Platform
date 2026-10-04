import Link from "next/link"
import {
  BadgeCheck,
  ClipboardCheck,
  Handshake,
  MapPin,
  MessageCircleQuestion,
  ShieldCheck,
  UserCheck,
} from "lucide-react"
import { Container } from "@/components/ui/container"
import { PageHeader } from "@/components/page/page-header"
import { DEBRA_DESK } from "@/lib/content/imagery"
import { Band, BandLead, QaList, Split, StatusStrip, Steps } from "@/components/page/editorial"
import { ProgramLeadForm } from "@/components/programs/program-lead-form"
import { ArrowLink } from "@/components/page/arrow-link"
import { JsonLd } from "@/components/seo/json-ld"
import { LOCAL_MARKET, verifiedAreaServedSchema } from "@/lib/local-market"
import type { ProgramDefinition } from "@/lib/programs"
import { SITE } from "@/lib/site"
import { CONSULTATION_REASSURANCE } from "@/lib/content/conversion"

/**
 * Shared program page.
 *
 * Previously a white page of bordered text grids — accurate, and indistinguishable
 * from internal documentation. It is a consumer education page, so it now reads
 * as one: a painted masthead, an icon-supported "who this is for" row, a numbered
 * process, Debra's role shown beside her photograph, and the official-source
 * boundary carried as a designed status strip rather than a grey aside.
 *
 * None of the program claims changed. The rule from AGENTS.md holds: this site
 * never states eligibility, savings, approval or affiliation on a program's
 * behalf, and every page says which organisation actually controls the rules.
 */
export function ProgramPage({ program }: { program: ProgramDefinition }) {
  const path = `/programs/${program.slug}`
  const areas = verifiedAreaServedSchema()
  const serviceSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: program.name,
    description: program.summary,
    url: `${SITE.url}${path}`,
    // The site-wide Person from the layout graph, by reference. An inline
    // Person named "Debra Allen, REALTOR®" read as a second, unrelated entity.
    provider: { "@id": `${SITE.url}/#debra-allen` },
    serviceType: "Real-estate buyer and seller guidance",
  }
  if (areas.length > 0) serviceSchema.areaServed = areas

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: program.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  }

  return (
    <>
      <JsonLd value={serviceSchema} />
      <JsonLd value={faqSchema} />

      <PageHeader
        eyebrow={program.eyebrow}
        eyebrowIcon={BadgeCheck}
        title={program.title}
        intro={program.summary}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Programs", href: "/programs" },
          { label: program.name },
        ]}
        facts={[
          { label: "Garland + Dallas–Fort Worth", icon: MapPin },
          { label: "Real-estate role only", icon: ShieldCheck },
        ]}
        motif="keys"
        note={CONSULTATION_REASSURANCE}
      >
        <Link href="#program-contact" className="dh-btn dh-btn-gold">
          {program.primaryCta}
        </Link>
        <Link href="/consultation" className="dh-btn dh-btn-light-outline">
          Talk it through first
        </Link>
      </PageHeader>

      <Band tone="white" tight aria-label="Where this applies">
        <StatusStrip icon={MapPin} title="Garland and the Dallas–Fort Worth region">
          <p>{LOCAL_MARKET.serviceAreaStatus}</p>
        </StatusStrip>
      </Band>

      <Band tone="page" aria-labelledby="audience-heading">
        <BandLead
          eyebrow="Who this is for"
          eyebrowIcon={UserCheck}
          title="Start with your actual program stage"
          titleId="audience-heading"
          lede="You do not need to pretend you are further along. Clear status helps Debra focus the conversation on the next useful real-estate decision."
        />
        <ul className="dh-chips">
          {program.audience.map((item) => (
            <li key={item}>
              <UserCheck aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
        {program.stageGuide && (
          <div className="dh-stage-guide">
            <h3>Your next step, by stage</h3>
            <dl>
              {program.stageGuide.map((item) => (
                <div key={item.stage}>
                  <dt>{item.stage}</dt>
                  <dd>{item.next}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </Band>

      <Band tone="alt" aria-labelledby="support-heading">
        <Split
          media={{
            ...DEBRA_DESK,
            caption: { label: "Your REALTOR®", title: "Debra Allen" },
          }}
          weight="copy"
          ratio="3 / 4"
          plate="teal"
          sizes="(max-width: 1000px) 100vw, 460px"
        >
          <p className="dh-kicker">
            <Handshake aria-hidden="true" />
            Debra&apos;s role
          </p>
          <h2 id="support-heading">{program.supportTitle}</h2>
          {program.supportLede && <p>{program.supportLede}</p>}
          <ul className="dh-checklist">
            {program.supportItems.map((item) => (
              <li key={item.title}>
                <ClipboardCheck aria-hidden="true" />
                <span>
                  <strong>{item.title}</strong>
                  {item.description}
                </span>
              </li>
            ))}
          </ul>
        </Split>
      </Band>

      <Band tone="white" aria-labelledby="process-heading">
        <BandLead
          eyebrow="What happens next"
          eyebrowIcon={ClipboardCheck}
          title="A clear four-step real-estate process"
          titleId="process-heading"
          lede="The real-estate side of the transaction, in order. The program's own approvals run alongside it and stay with the program."
        />
        <Steps items={program.process} />
      </Band>

      <Band tone="navy" tight aria-labelledby="local-heading">
        <div className="dh-lead-row">
          <div className="dh-lead dh-lead-flush">
            <p className="dh-kicker">
              <MapPin aria-hidden="true" />
              Local context
            </p>
            <h2 id="local-heading">Planning a move in or near Garland?</h2>
            <p>
              The Garland guide covers practical home-search questions, the North Texas housing you will actually tour,
              and links to the planning tools — without unsupported market statistics.
            </p>
          </div>
          <Link href="/areas/garland" className="dh-btn dh-btn-light">
            Explore the Garland guide
          </Link>
        </div>
      </Band>

      <Band tone="page" aria-labelledby="faq-heading">
        <div className="dh-split dh-split-wide-copy">
          <div className="dh-split-copy">
            <p className="dh-kicker">
              <MessageCircleQuestion aria-hidden="true" />
              Direct answers
            </p>
            <h2 id="faq-heading">Frequently asked questions</h2>
            <p>
              Official program rules can change. These answers explain Debra&apos;s real-estate role and identify what
              has to be confirmed with the program or another licensed professional.
            </p>
            {program.relatedGuide && (
              <ul className="dh-band-links">
                <li>
                  <ArrowLink href={program.relatedGuide.href} label={program.relatedGuide.label} />
                </li>
              </ul>
            )}
          </div>
          <QaList items={program.faqs} />
        </div>
      </Band>

      <section id="program-contact" className="dh-band dh-band-alt" aria-labelledby="contact-heading">
        <Container>
          <div className="dh-split dh-split-wide-copy">
            <div className="dh-split-copy">
              <p className="dh-kicker">
                <Handshake aria-hidden="true" />
                Program-specific consultation
              </p>
              <h2 id="contact-heading">Tell Debra where you are now</h2>
              <p>
                The form captures the program, your location preferences, timeline and contact consent, so the follow-up
                starts with useful context instead of starting over.
              </p>
              <StatusStrip icon={ShieldCheck} title="Where the program's rules come from">
                <p>{program.disclaimer}</p>
              </StatusStrip>
            </div>
            <ProgramLeadForm program={program.slug} leadSource={program.leadSource} cta={program.primaryCta} />
          </div>
        </Container>
      </section>
    </>
  )
}
