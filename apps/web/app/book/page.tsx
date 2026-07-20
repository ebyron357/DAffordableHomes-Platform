import type { Metadata } from "next"
import Image from "next/image"
import { ContactForm } from "@/components/contact/contact-form"
import { Container } from "@/components/ui/container"

export const metadata: Metadata = {
  title: "Schedule a Homebuyer Consultation",
  description: "Request a homebuyer consultation with Debra Allen, REALTOR®.",
}

export default function BookPage() {
  return <>
    <section className="border-b border-border py-16 md:py-24"><Container><p className="text-sm font-semibold uppercase tracking-widest text-accent">Homebuyer consultation</p><h1 className="mt-4 max-w-4xl font-serif text-4xl leading-tight sm:text-5xl">Bring your questions. Leave with a clearer plan.</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">A consultation is for buyers who want to understand readiness, compare next steps, or prepare for a more productive conversation with a lender or real-estate professional.</p></Container></section>
    <section className="py-16 md:py-24"><Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
      <div><div className="relative aspect-[4/5] overflow-hidden rounded-lg"><Image src="/images/debra-allen-advisor-desk.webp" alt="Debra Allen seated at her desk with a tablet" fill sizes="(min-width: 1024px) 38vw, 100vw" className="object-cover object-[50%_35%]" /></div><h2 className="mt-8 font-serif text-3xl">What we can discuss</h2><ul className="mt-5 space-y-3 text-muted-foreground"><li>• Your goals and ideal timeline</li><li>• Budget and preparation questions</li><li>• Financing paths to explore with a lender</li><li>• Search, offer, inspection, and closing expectations</li></ul><h2 className="mt-10 font-serif text-2xl">What happens after submission</h2><p className="mt-3 leading-7 text-muted-foreground">The form reports its real connection status. It never displays a false success message or promises a response time that has not been verified.</p></div>
      <div className="border border-border bg-card p-6 sm:p-8"><h2 className="font-serif text-3xl">Request a consultation</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">Share enough context for Debra to understand what you would like to discuss. Do not include Social Security numbers, account numbers, or other sensitive financial information.</p><div className="mt-8"><ContactForm context="consultation" /></div></div>
    </Container></section>
  </>
}
