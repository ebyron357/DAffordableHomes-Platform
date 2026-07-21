import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ContactForm } from "@/components/contact/contact-form"
import { Container } from "@/components/ui/container"

export const metadata: Metadata = { title: "Schedule a Homebuyer Consultation", description: "Request a homebuyer consultation with Debra Allen." }

const expectations = ["A focused planning conversation", "A review of your current position", "Clear next steps without pressure", "Resources matched to your situation"]

export default function BookPage() {
  return <>
    <section className="pt-12 md:pt-16"><Container><p className="text-xs font-semibold uppercase tracking-[0.1em] text-accent">A clear next step</p><h1 className="mt-4 max-w-3xl font-serif text-[42px] font-normal leading-[1.08] sm:text-[52px]">Start with a conversation—not a sales pitch.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">Tell Debra enough to understand your starting point. You will leave with a clearer understanding of what to do next, even if buying is not your immediate next move.</p></Container></section>
    <section className="py-12 md:py-16"><Container className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-12">
      <div>
        <div className="bg-primary p-7 text-primary-foreground sm:p-9"><h2 className="font-serif text-3xl font-normal">What to expect</h2><ol className="mt-6">{expectations.map((item, index) => <li key={item} className="flex gap-5 border-b border-primary-foreground/20 py-5 last:border-0"><span className="text-xs font-semibold text-accent">0{index + 1}</span><span>{item}</span></li>)}</ol><p className="mt-5 text-xs leading-5 text-primary-foreground/75">You do not need perfect credit, a lender, or every answer before reaching out.</p></div>
        <div className="relative mt-8 aspect-[3/2] overflow-hidden border border-border"><Image src="/images/debra-allen-advisor-desk.webp" alt="Debra Allen seated at her desk with a tablet" fill sizes="(min-width: 1024px) 38vw, 100vw" className="object-cover object-[50%_35%]" /></div>
        <div className="mt-8"><h2 className="font-serif text-2xl font-normal">Not ready to schedule?</h2><p className="mt-3 leading-7 text-muted-foreground">Use the free calculators and buyer resources first. Come back when you have a question worth discussing.</p><div className="mt-5 flex gap-6 text-sm font-semibold text-primary"><Link href="/resources/calculators/mortgage-payment" className="hover:underline">Mortgage calculator →</Link><Link href="/resources/calculators/affordability" className="hover:underline">Affordability calculator →</Link></div></div>
      </div>
      <div className="self-start border border-border bg-card p-6 sm:p-8"><h2 className="font-serif text-3xl font-normal">Request a consultation</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">Complete the short form so Debra can understand what you would like to discuss. Do not include Social Security numbers, account numbers, or other sensitive financial information.</p><div className="mt-7"><ContactForm context="consultation" /></div></div>
    </Container></section>
  </>
}
