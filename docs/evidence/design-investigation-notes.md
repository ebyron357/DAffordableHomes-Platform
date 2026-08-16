# Design Investigation Notes

## Repository evidence

- Canonical repository: `ebyron357/DAffordableHomes-Platform`.
- Main HEAD observed 2026-08-15: `56b381f`, merging PR #19 closeout work.
- Main routes include homepage, About, Areas, Garland, Blog, article pages, Programs, NACA, Homes for Heroes, buyer resources, calculators, consultation, contact, legal/accessibility pages, testimonials, events, FAQ, first-time buyers, neighborhoods, market reports, homes, and start.
- Repository README positions D'Affordable Homes as an education-first digital homeownership platform led by Debra Allen, REALTOR®, for first-time buyers and renters. Core experiences are Learn, Plan, Explore, and Connect.
- Architecture emphasizes Next.js App Router, semantic Tailwind tokens, mobile-first responsive design, restrained accessible motion, no fabricated listings/reviews/claims, and integration fallbacks.
- Current repository includes verified-looking Debra assets plus family/home/lifestyle assets under `apps/web/public/images` and `apps/web/public/manus-storage`; provenance requires confirmation before treating any image as authentic local photography.

## Deployed homepage evidence

- Deployment referenced in repository: https://daffordablehomes-platform.vercel.app/
- Current title: `Trusted homeownership guidance`.
- Navigation visible: Home, Calculators, Neighborhoods, Programs, Blogs, About Debra, and Book Consultation.
- Hero copy: `Practical guidance for Garland and DFW homebuyers`; headline `Real guidance for first-time buyers.`; supporting line `Warm, practical homeownership guidance for first-time buyers and families ready to own their future.`
- Hero includes Book Consultation and Explore Calculators CTAs, a family-at-home image, and the line `No pressure. No guesswork. Just clear next steps.`
- Homepage sequence observed: hero; three next-step choices; planning tools; homebuyer programs; Debra introduction; four-phase process; final consultation CTA; footer.
- Visual evidence from screenshot: cream/light neutral background, deep navy/plum text, teal eyebrow, dark navy primary button, outlined secondary button, editorial serif headline, sans-serif body, rectangular family hero crop, thin dividers and generous whitespace. Debra is introduced below the fold rather than being the primary hero subject.
- Potential category risk to test: current first impression is strongly education-first / homeownership guidance and may not immediately establish Debra as the independent residential realtor; this is a hypothesis pending full-surface audit.
- Potential visual-system risk to test: current homepage relies on calm editorial typography, dividers, and restrained buttons but may read more like an education platform than a realtor website if realtor-specific category signals are not prominent enough.

## Benchmark source evidence

The SiteBuilderReport 2026 collection states that strong real-estate websites keep the agent front and center while focusing content on helping buyers and sellers; it also emphasizes calm lead generation, education, and photography as differentiators. The collection provides candidate sites across individual agents and boutique teams. Candidate URLs selected for direct review include Homes in Santa Barbara, John Flanagan/Main Line Local, Jennifer Ferland, Sherrie Couture, Ashford Realty/All Homes Colorado, Debra Smalley, Keri White, Marci Homes, Cindy Bond, Cindy Lin Realty, Debra Dobbs, Grist Realty, and Nancy Saedi. Source: https://www.sitebuilderreport.com/inspiration/real-estate-websites.

## Benchmark observations

**Calcagno-Hamilton Real Estate Group, Santa Barbara/Montecito.** The site leads with market geography, named agents, licenses, quantified credibility, and neighborhood-specific exploration. It combines team identity with local area authority and an explicit promise to reduce transaction guesswork. Transferable lesson: establish agent identity, service geography, and proof before asking visitors to browse. Avoid copying luxury-market volume claims or a team structure that does not match D’Affordable.

**Jennifer Ferland, San Francisco and Marin County.** The homepage explicitly states REALTOR® identity, service market, buyer/seller coverage, personal positioning, relationship philosophy, and verified-looking proof. It uses an editorial voice with a human point of view, then separates buying, selling, concierge, and resources into distinct paths. Transferable lesson: a personal realtor brand can be warm and distinctive without losing professional credibility; buyer and seller journeys should be explicit. Avoid importing unsupported production claims, awards, or high-end concierge services.

**Keri White Team, Los Angeles.** The site uses strong personal-name branding, a highly controlled dark visual presentation, a single direct consultation CTA, geographic neighborhood coverage, media/content, testimonials, credentials, and team-level proof. Transferable lesson: local expertise is made concrete through named areas and ongoing editorial content, while the conversion path stays legible. Avoid the luxury-market tone, dark-first treatment, and team scale if they do not reflect Debra’s verified offering.

The benchmark source itself frames the strongest category examples as human, agent-forward, educational, calm, and photography-led rather than marketplace-first. The evidence supports an agent-centered residential site with buyer/seller clarity, local-market proof, and a restrained consultation path rather than a database-led portal.
