import type { Metadata } from "next"
import Link from "next/link"
import { Container } from "@/components/ui/container"

export const metadata: Metadata = {
  title: "Texas Brokerage and Consumer Information",
  description: "Official Texas real-estate consumer notices, brokerage relationship information, and links to the Texas Real Estate Commission.",
  alternates: { canonical: "/texas-brokerage-information" },
}

export default function TexasBrokerageInformationPage() {
  return <>
    <section className="border-b border-border bg-card"><Container className="py-12 md:py-20"><nav aria-label="Breadcrumb" className="text-sm text-muted-foreground"><Link href="/">Home</Link> / <span aria-current="page">Texas brokerage information</span></nav><p className="mt-8 text-xs font-semibold uppercase tracking-[0.12em] text-accent">Texas consumer information</p><h1 className="mt-4 max-w-4xl font-serif text-[42px] font-normal leading-[1.08] sm:text-[56px]">Understand representation before sharing confidential information</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">Texas consumers should receive the required brokerage disclosures and understand whom a real-estate license holder represents before entering a representation relationship.</p></Container></section>
    <section className="py-14 md:py-20"><Container className="max-w-4xl space-y-10">
      <section><h2 className="font-serif text-3xl font-normal">Information About Brokerage Services</h2><p className="mt-4 leading-7 text-muted-foreground">The Texas Real Estate Commission’s Information About Brokerage Services notice explains the roles of brokers and sales agents, representation, intermediary relationships, and minimum duties. The completed license-holder notice for Debra’s brokerage must be supplied and approved before final launch.</p><a className="mt-5 inline-block font-semibold text-primary underline" href="https://www.trec.texas.gov/forms/information-about-brokerage-services" target="_blank" rel="noopener noreferrer">View the official TREC IABS information</a></section>
      <section><h2 className="font-serif text-3xl font-normal">Consumer Protection Notice</h2><p className="mt-4 leading-7 text-muted-foreground">TREC publishes a Consumer Protection Notice explaining how to file a complaint and where to find recovery-fund information.</p><a className="mt-5 inline-block font-semibold text-primary underline" href="https://www.trec.texas.gov/forms/consumer-protection-notice" target="_blank" rel="noopener noreferrer">View the official TREC Consumer Protection Notice</a></section>
      <section className="border-l-4 border-accent bg-muted p-6"><h2 className="text-xl font-semibold">Before representation begins</h2><p className="mt-3 leading-7 text-muted-foreground">Ask which brokerage and license holder will represent you, what services are included, how compensation works, what information is confidential, and which written agreements or notices apply. Do not send sensitive financial information through this public website.</p></section>
    </Container></section>
  </>
}
