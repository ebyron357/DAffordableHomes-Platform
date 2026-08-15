import { blocks } from '../authoring.mjs';

const slug = 'homes-for-heroes-north-texas';
const b = blocks(slug);

const title = 'How Debra Allen Helps North Texas Heroes Buy or Sell a Home';
const description =
  'A practical real-estate guide for North Texas military members, veterans, teachers, healthcare workers, firefighters, EMS, and law-enforcement professionals.';

export default {
  _id: `article.${slug}`,
  _type: 'article',
  title,
  slug: { _type: 'slug', current: slug },
  eyebrow: 'Real estate for community heroes',
  excerpt: description,
  seoTitle: title,
  seoDescription: description,
  status: 'published',
  publishedAt: '2026-08-05T12:00:00.000Z',
  reviewedAt: '2026-08-05T12:00:00.000Z',
  readingTimeMinutes: 9,
  author: { _type: 'reference', _ref: 'author.debra-allen' },
  category: { _type: 'reference', _ref: 'category.program-guides' },
  programs: [{ _type: 'reference', _ref: 'program.homes-for-heroes', _key: 'program-hfh' }],
  areas: [{ _type: 'reference', _ref: 'area.dallas-fort-worth', _key: 'area-dfw' }],
  featuredImage: {
    _type: 'articleImage',
    src: '/manus-storage/home-keys-moment_20083d77.jpg',
    alt: 'A person holding a set of keys with a small house keyring in front of an open front door',
    focalPoint: '60% 50%',
  },
  socialImage: {
    _type: 'articleImage',
    src: '/manus-storage/home-keys-moment_20083d77.jpg',
    alt: 'A person holding a set of keys with a small house keyring in front of an open front door',
  },
  faqs: [
    {
      _key: 'faq-1',
      question: 'Who may qualify for Homes for Heroes?',
      answer:
        'Homes for Heroes primarily identifies military members and veterans, firefighters and EMS, law enforcement, healthcare professionals, and teachers. Current eligibility and enrollment rules must be confirmed directly through the official program.',
    },
    {
      _key: 'faq-2',
      question: 'Is Homes for Heroes only for first-time buyers?',
      answer: 'No. The official program says eligible participants are not limited to first-time homebuyers.',
    },
    {
      _key: 'faq-3',
      question: 'Does a profession automatically guarantee a reward?',
      answer:
        'No. A professional or service category alone does not guarantee enrollment, eligibility, specialist participation, a particular savings amount, or a transaction benefit.',
    },
    {
      _key: 'faq-4',
      question: 'Can Debra help a North Texas hero buy or sell?',
      answer:
        'Debra can provide real-estate planning and representation, subject to availability and the facts of the transaction. Any official third-party program status or benefit must be confirmed separately.',
    },
    {
      _key: 'faq-5',
      question: 'Can Debra coordinate a sale and purchase?',
      answer:
        'Yes. A coordinated plan can identify equity, financing, timing, contingency, possession, temporary-housing, and moving dependencies before the transactions begin.',
    },
  ],
  sources: [
    {
      _key: 'src-1',
      label: 'Homes for Heroes: Who We Serve',
      href: 'https://www.homesforheroes.com/heroes/',
      publisher: 'Homes for Heroes',
    },
    {
      _key: 'src-2',
      label: 'Homes for Heroes: Program Disclosures',
      href: 'https://www.homesforheroes.com/imprint/',
      publisher: 'Homes for Heroes',
    },
  ],
  complianceNotice: [
    b.p(
      "Homes for Heroes is a third-party program. This article does not guarantee enrollment, eligibility, specialist status, rewards, rebates, savings, or transaction results. D'Affordable Homes should not be represented as officially affiliated unless verified documentation is published."
    ),
  ],
  relatedLinks: [
    {
      _key: 'rel-1',
      label: 'Hero-focused real-estate guidance',
      href: '/programs/homes-for-heroes',
      description: "See Debra's buying, selling, and move-planning support.",
    },
    {
      _key: 'rel-2',
      label: 'Garland homebuyer guide',
      href: '/areas/garland',
      description: 'Plan a Garland search around cost, condition, commute, and timing.',
    },
    {
      _key: 'rel-3',
      label: 'Affordability calculator',
      href: '/resources/calculators/affordability',
      description: 'Estimate a comfortable planning range before touring.',
    },
    {
      _key: 'rel-4',
      label: 'Closing-cost calculator',
      href: '/resources/calculators/closing-costs',
      description: 'Prepare for costs beyond the down payment.',
    },
  ],
  body: [
    b.quickAnswer({
      heading: 'The quick answer',
      paragraphs: [
        'Military members, veterans, teachers, healthcare professionals, firefighters, EMS professionals, and law-enforcement professionals often face schedules and move requirements that generic real-estate advice does not fully address.',
        '**Debra Allen helps organize the real-estate side of a North Texas purchase, sale, or coordinated move. Homes for Heroes controls its own enrollment, specialist network, eligibility rules, rewards, and disclosures.**',
      ],
    }),

    b.h2('Who is considered a community hero?'),
    b.p(
      'Homes for Heroes identifies five principal groups: military members and veterans, firefighters and EMS, law enforcement, healthcare professionals, and teachers. Its current information says eligibility may include current, former, and retired members of those groups and is not limited to first-time buyers.'
    ),
    b.p(
      'Belonging to one of those groups does not by itself guarantee a reward, rebate, savings amount, or transaction outcome. Separate two questions from the beginning:'
    ),
    ...b.ol([
      '**Does the official third-party program apply to this person and transaction?**',
      '**What real-estate plan is needed to buy, sell, or move successfully?**',
    ]),
    b.p('Homes for Heroes answers the first question. Debra helps with the second.'),

    b.h2('Why hero households may need a different plan'),
    b.h3('Military members and veterans'),
    b.p(
      'Military households may face relocation orders, deployment, training, remote searches, limited touring time, or a need to sell and move quickly. Veterans may also need to distinguish VA loan eligibility from the larger affordability decision. A possible zero-down transaction does not eliminate inspections, moving expenses, insurance, taxes, repairs, or the need for reserves.'
    ),
    b.h3('Teachers and education professionals'),
    b.p(
      "Teachers may coordinate around contract dates, school calendars, summer availability, commute requirements, and family schedules. A desired summer closing still depends on inventory, lender timelines, inspections, appraisal, title, and the seller's needs."
    ),
    b.h3('Healthcare professionals'),
    b.p(
      'Healthcare workers may have overnight shifts, rotating days, on-call responsibilities, multiple work locations, or contract assignments. A search should test commute conditions at the hours the buyer actually travels.'
    ),
    b.h3('Firefighters, EMS, and law enforcement'),
    b.p(
      'Extended shifts and callouts can make ordinary scheduling difficult. Concentrated tour blocks, digital document review, clear deadline reminders, parking, commute, and privacy needs may carry unusual weight.'
    ),

    b.h2('How Debra helps hero homebuyers'),
    b.h3('Clarify the goal'),
    b.p(
      'The plan begins with why the buyer is moving, preferred timing, current housing, job location, commute limits, property needs, financing status, available savings, and a comfortable monthly cost.'
    ),
    b.h3('Build a realistic location strategy'),
    b.p(
      'Dallas–Fort Worth is a large region. Debra can help compare communities using commute patterns, toll dependence, taxes, insurance, home age, inventory, association costs, property condition, and proximity to work or family.'
    ),
    b.h3('Evaluate the complete cost'),
    b.p(
      "The ownership budget may include principal, interest, taxes, insurance, mortgage insurance, association dues, utilities, transportation, maintenance, repairs, and special assessments. A lender's maximum approval does not include every expense in the household's life."
    ),
    b.h3('Tour and compare efficiently'),
    b.p(
      'For buyers with demanding schedules, the goal is not to see the largest number of homes. It is to prioritize the most relevant options, schedule efficient tours, document differences, and investigate concerns before emotion takes over.'
    ),
    b.h3('Prepare and manage the transaction'),
    b.p(
      'Debra can help with comparable information, offer terms, contract deadlines, inspections, repair discussions, appraisal access, title communication, lender coordination, insurance questions, final walkthrough, and closing preparation. Each licensed or authorized professional remains responsible for their own decisions.'
    ),
    b.p("[Explore Debra's hero-focused real-estate guidance](/programs/homes-for-heroes)."),

    b.h2('How Debra helps hero home sellers'),
    b.h3('Prepare without renovating blindly'),
    b.p(
      'Preparation may include decluttering, cleaning, minor repairs, safety concerns, curb appeal, photography readiness, showing access, and documentation. Not every property needs a costly renovation before sale.'
    ),
    b.h3('Build a fact-based launch'),
    b.p(
      "A listing strategy can consider condition, comparable sales, active competition, timing, photography, showings, pricing position, and the seller's objectives. Overpricing can reduce attention and weaken future negotiating leverage."
    ),
    b.h3('Compare the whole offer'),
    b.p(
      'The highest price is not always the strongest offer. Financing, down payment, deposits, inspection terms, requested concessions, appraisal language, contingencies, closing date, and possession can materially change risk.'
    ),

    b.h2('Buying and selling at the same time'),
    b.p(
      'A coordinated move creates dependencies involving equity, down payment, mortgage qualification, closing dates, possession, temporary housing, storage, contingencies, work schedules, and family logistics.'
    ),
    b.comparisonTable({
      heading: 'Three ways to sequence a coordinated move',
      caption:
        'Every sequence trades one risk for another. The right choice depends on equity, qualification, timing, and how much disruption the household can absorb.',
      columns: ['Sequence', 'What it can help', 'What it can cost'],
      rows: [
        [
          'Sell first',
          'May clarify available equity and reduce the risk of carrying two homes',
          'Can create a temporary-housing need',
        ],
        [
          'Buy first',
          'May reduce moving pressure',
          'The buyer must qualify while still owning the current home or use another approved structure',
        ],
        [
          'Coordinate both',
          'Can connect the transactions through timing and contract terms',
          'Every dependency introduces risk',
        ],
      ],
    }),
    b.p("Debra's role is to make those dependencies visible before the first contract creates a deadline."),

    b.h2('Homes for Heroes benefits and real-estate service are separate'),
    b.p(
      'Homes for Heroes controls its eligibility, enrollment, specialist network, reward structure, calculations, terms, and disclosures. Before relying on a benefit, a consumer should confirm:'
    ),
    ...b.ul([
      'Whether the profession or service history qualifies',
      'Whether enrollment is required',
      'Whether the selected professional has the required official status',
      'Whether the location and transaction qualify',
      'How any reward is calculated and issued',
      'Whether taxes, lender restrictions, or other conditions apply',
    ]),
    b.p(
      "The D'Affordable Homes page provides hero-focused real-estate guidance. It does not publish an unverified affiliation or promise a savings amount."
    ),

    b.callout({
      tone: 'caution',
      heading: 'Keep the two questions separate',
      paragraphs: [
        'A profession qualifies a person for consideration by a third-party program. It does not qualify a property, a payment, or a transaction. Confirm program status with Homes for Heroes and build the real-estate plan independently of it.',
      ],
    }),

    b.h2('Questions to answer before starting'),
    ...b.ol([
      'What is the complete estimated monthly payment?',
      'How much cash and emergency reserve will remain after closing?',
      'Which communities fit the real commute and shift schedule?',
      'How much maintenance and repair risk is acceptable?',
      'Is a home sale required before the purchase can close?',
      'Does an official Homes for Heroes benefit apply to this transaction?',
      'Who is responsible for each financing, program, inspection, appraisal, and legal decision?',
    ]),

    b.checklist({
      heading: 'Common mistakes to avoid',
      intro: 'Each of these is avoidable with a plan built before the first deadline exists.',
      variant: 'avoid',
      items: [
        { label: 'Assuming professional status automatically guarantees a reward' },
        { label: "Choosing a home based only on the lender's maximum approval" },
        { label: 'Testing a commute only during light weekend traffic' },
        { label: 'Waiting until a transfer, lease end, or school break is too close' },
        { label: 'Opening new credit before closing without discussing the effect' },
        { label: 'Spending every available dollar and leaving no repair reserve' },
        { label: 'Treating every hero household as though it has the same priorities' },
      ],
    }),

    b.calculatorCta({
      heading: 'Plan the numbers around a real schedule',
      body: 'Estimate a comfortable planning range and the cash needed beyond the down payment before a transfer date or lease end sets the clock.',
      calculators: [
        { _key: 'calc-afford', label: 'Affordability calculator', href: '/calculators/affordability' },
        { _key: 'calc-closing', label: 'Closing-cost calculator', href: '/calculators/closing-costs' },
      ],
    }),

    b.consultationCta({
      heading: 'Build a real-estate plan around the person—not the label',
      body: 'A profession may shape the schedule and the move, but it should not reduce the client to a generic category. Debra helps North Texas community heroes create a buying, selling, or coordinated move plan around their goals, timing, budget, and responsibilities.',
      href: '/consultation',
      label: 'Book a consultation',
      secondaryHref: '/programs/homes-for-heroes',
      secondaryLabel: 'Start with hero-focused guidance',
    }),
  ],
};
