import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"

// Approved supporting asset retained in the repository: hero-family_b1fab939.jpg. Debra's approved portrait leads the implementation hero.
export function Hero() {
  return (
    <section className="hero-editorial" aria-labelledby="hero-heading">
      <Container className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Debra Allen, REALTOR® · Garland + Dallas–Fort Worth</p>
          <h1 id="hero-heading">A clear path to the home that fits your life.</h1>
          <p className="hero-lede">I help first-time buyers and families prepare, understand their options, and move forward with a plan—not pressure.</p>
          <div className="hero-actions"><Button href="/consultation" size="lg">Talk with Debra</Button><Button href="/start" variant="outline" size="lg">Start with your next step</Button></div>
          <p className="hero-note">Residential real-estate guidance rooted in clarity, patience, and practical preparation.</p>
        </div>
        <div className="hero-portrait-wrap">
          <div className="hero-portrait"><Image src="/images/debra-allen-primary-about.webp" alt="Debra Allen smiling in a yellow blazer at a kitchen counter" fill priority sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover" /></div>
          <div className="hero-caption"><span>Meet your guide</span><strong>From first questions to front door.</strong></div>
        </div>
      </Container>
    </section>
  )
}
