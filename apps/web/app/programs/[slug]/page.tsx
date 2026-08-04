import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProgramPage } from "@/components/programs/program-page"
import { PROGRAMS, type ProgramSlug } from "@/lib/programs"

const slugs = Object.keys(PROGRAMS) as ProgramSlug[]

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const program = PROGRAMS[slug as ProgramSlug]
  if (!program) return {}
  const path = `/programs/${program.slug}`
  return {
    title: `${program.name} for Dallas–Fort Worth Buyers`,
    description: program.summary,
    alternates: { canonical: path },
    openGraph: { title: `${program.name} | D'Affordable Homes`, description: program.summary, url: path, type: "article" },
    twitter: { card: "summary_large_image", title: program.name, description: program.summary },
  }
}

export default async function BuyerProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const program = PROGRAMS[slug as ProgramSlug]
  if (!program) notFound()
  return <ProgramPage program={program} />
}
