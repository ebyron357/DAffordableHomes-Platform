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
    <section className="py-13 md:py-16"><Container><p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">A clear next step</p><h1 className="mt-4 max-w-3xl font-serif text-[42px] leading-[1.12] sm:text-[54px]">Start with a conversation—not a sales pitch.</h1><p className="mt-5 max-w-2xl text-[17px] leading-7 text-muted-foreground">Tell Debra what you are working toward. You will leave with a clearer understanding of what to do next, even if buying is not your immediate next move.</p></Container></section>
    <section className="pb-16 md:pb-24"><Container className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
      <div>
        <div className="relative aspect-[4/3] overflow-hidden border border-border"><Image src="/images/debra-allen-advisor-desk.webp" alt="Debra Allen seated at her desk with a tablet" fill sizes="(min-width: 1024px) 34vw, 100vw" className="object-cover object-[50%_35%]" /></div>
        <div className="bg-primary p-7 text-primary-foreground md:p-9"><h2 className="font-serif text-3xl">What to expect</h2><ol className="mt-6 divide-y divide-white/15">{["A planning conversation about your goals", "A review of your current position", "Clear next steps without pressure", "Resources matched to your situation"].map((item, index) => <li key={item} className="flex gap-5 py-4 text-sm leading-6"><span className="text-accent">0{index + 1}</span><span>{item}</span></li>)}</ol></div>
        <div className="mt-10"><h2 className="font-serif text-3xl">What buyers can discuss</h2><ul className="mt-5 space-y-3 text-[15px] leading-6 text-muted-foreground"><li>Your goals and ideal timeline</li><li>Budget and preparation questions</li><li>Financing paths to explore with a lender</li><li>Search, offer, inspection, and closing expectations</li></ul><h2 className="mt-9 font-serif text-2xl">What happens after submission</h2><p className="mt-3 leading-7 text-muted-foreground">The form reports its real connection status. It never displays a false success message or promises a response time that has not been verified.</p></div>
      </div>
      <div className="h-fit border border-border bg-card p-6 sm:p-8 lg:p-10"><h2 className="font-serif text-3xl">Request a consultation</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">Complete the form and Debra will follow up when the messaging service is connected.</p><aside className="mt-5 border-l-2 border-accent pl-4 text-sm leading-6 text-muted-foreground">For your privacy, do not include Social Security numbers, account numbers, credit-card details, or other sensitive financial information.</aside><div className="mt-8"><ContactForm context="consultation" /></div></div>
    </Container></section>
  </>
}
