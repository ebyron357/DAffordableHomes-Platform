import Link from "next/link"
import { ArrowRight, Plus } from "lucide-react"
import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { FAQ_PREVIEW } from "@/lib/content/home"

export function FaqPreview() {
  return (
    <section className="py-16 md:py-24" aria-labelledby="faq-heading">
      <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Eyebrow>Common questions</Eyebrow>
          <h2 id="faq-heading" className="mt-4 text-balance font-serif text-3xl text-foreground sm:text-4xl">
            You probably have questions. That&apos;s a good sign.
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            A few of the things people ask most often. There is no wrong question here.
          </p>
          <Link
            href="/faq"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            Read the full FAQ
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <ul className="flex flex-col gap-3">
          {FAQ_PREVIEW.map((item) => (
            <li key={item.question}>
              <details className="group rounded-xl border border-border bg-card p-5 [&_svg]:open:rotate-45">
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-medium text-foreground marker:content-['']">
                  {item.question}
                  <Plus className="size-5 shrink-0 text-primary transition-transform" aria-hidden="true" />
                </summary>
                <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">{item.answer}</p>
              </details>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
