import { blocks } from '../authoring.mjs';

const slug = 'how-to-buy-home-garland-tx';
const b = blocks(slug);

const title = 'How to Buy a Home in Garland, Texas';
const description =
  'A step-by-step first-time buyer guide to budgeting, financing, touring, inspections, and closing on a home in Garland, Texas.';

export default {
  _id: `article.${slug}`,
  _type: 'article',
  title,
  slug: { _type: 'slug', current: slug },
  eyebrow: 'Garland first-time buyer field guide',
  excerpt: description,
  seoTitle: title,
  seoDescription: description,
  status: 'published',
  publishedAt: '2026-08-05T12:00:00.000Z',
  reviewedAt: '2026-08-05T12:00:00.000Z',
  readingTimeMinutes: 12,
  author: { _type: 'reference', _ref: 'author.debra-allen' },
  category: { _type: 'reference', _ref: 'category.area-guides' },
  programs: [
    { _type: 'reference', _ref: 'program.naca', _key: 'program-naca' },
  ],
  areas: [{ _type: 'reference', _ref: 'area.garland', _key: 'area-garland' }],
  featuredImage: {
    _type: 'articleImage',
    src: '/images/hero-homeowner.png',
    alt: 'A homeowner standing on the front porch steps of a single-family house on a tree-lined residential street',
    focalPoint: '55% 40%',
  },
  socialImage: {
    _type: 'articleImage',
    src: '/images/hero-homeowner.png',
    alt: 'A homeowner standing on the front porch steps of a single-family house on a tree-lined residential street',
  },
  faqs: [
    {
      _key: 'faq-1',
      question: 'Is Garland a good place for a first-time buyer?',
      answer:
        'Garland may fit buyers who want access to the wider Dallas–Fort Worth region and established housing options. The right answer depends on budget, commute, taxes, insurance, property condition, and long-term goals.',
    },
    {
      _key: 'faq-2',
      question: 'How much money do I need to buy a Garland home?',
      answer:
        'The amount depends on the mortgage, down payment, closing costs, inspections, appraisal, prepaid expenses, assistance, seller credits, moving costs, and the reserves you keep after closing.',
    },
    {
      _key: 'faq-3',
      question: 'Does Garland offer assistance to every first-time buyer?',
      answer:
        "No. Garland's Housing Choice Voucher Home Ownership Program is a specialized option for qualifying voucher participants, not a general citywide benefit for every buyer.",
    },
    {
      _key: 'faq-4',
      question: 'Should I get preapproved before touring?',
      answer:
        'An active search should generally begin after a meaningful financing review so the price, payment, cash requirement, and property restrictions are understood.',
    },
    {
      _key: 'faq-5',
      question: 'Can I use NACA to buy in Garland?',
      answer:
        'A buyer may explore Garland through NACA, subject to current qualification, affordability, property, mortgage, and transaction requirements. Confirm official decisions directly with NACA.',
    },
  ],
  sources: [
    {
      _key: 'src-1',
      label: 'City of Garland: Housing Choice Voucher Home Ownership Program',
      href: 'https://www.garlandtx.gov/478/Home-Ownership-Program',
      publisher: 'City of Garland',
    },
    {
      _key: 'src-2',
      label: 'Texas Department of Housing and Community Affairs: Homebuyer Program',
      href: 'https://welcomehome.tdhca.texas.gov/welcome-home',
      publisher: 'TDHCA',
    },
    { _key: 'src-3', label: 'NACA: Home Purchase Program', href: 'https://www.naca.com/purchase/', publisher: 'NACA' },
  ],
  complianceNotice: [
    b.p(
      'This article provides general real-estate education. It is not a mortgage approval, legal or tax opinion, inspection, appraisal, insurance quote, program decision, or guarantee of eligibility. Confirm current requirements with the professional or organization responsible for the decision.'
    ),
  ],
  relatedLinks: [
    {
      _key: 'rel-1',
      label: 'Garland area guide',
      href: '/areas/garland',
      description: "Continue into the site's focused Garland home-search resource.",
    },
    {
      _key: 'rel-2',
      label: 'Affordability calculator',
      href: '/resources/calculators/affordability',
      description: 'Estimate a conservative planning range.',
    },
    {
      _key: 'rel-3',
      label: 'Closing-cost calculator',
      href: '/resources/calculators/closing-costs',
      description: 'Prepare for cash needs beyond the down payment.',
    },
    {
      _key: 'rel-4',
      label: 'NACA home-search guidance',
      href: '/programs/naca',
      description: "Understand Debra's role when exploring or using NACA.",
    },
  ],
  body: [
    b.quickAnswer({
      heading: 'The quick answer',
      paragraphs: [
        'Buying in Garland begins before the listing search. A prepared buyer understands a comfortable monthly payment, cash needs, financing and assistance possibilities, taxes, insurance, association costs, commute, property condition, inspection rights, and the responsibilities of each professional in the transaction.',
        "**The right Garland home is not simply the property with the lowest price. It is the home whose complete cost, condition, location, and maintenance demands fit the buyer's life.**",
      ],
    }),

    b.h2('Why Garland belongs in a DFW home search'),
    b.p(
      'Garland is part of the wider Dallas–Fort Worth region, but buyers should not treat every nearby city as interchangeable. Garland offers established residential areas, different home ages and property types, regional access, and the ability to compare multiple ownership possibilities.'
    ),
    b.p(
      'Those broad qualities do not make every neighborhood or property a match. A useful search evaluates the specific home, commute, taxes, insurance, association requirements, visible condition, likely maintenance, and total ownership cost.'
    ),
    b.p('[Start with the dedicated Garland area guide](/areas/garland).'),

    b.h2('Step 1: Decide whether you are financially ready'),
    b.p(
      'Readiness is not determined by one credit score or the largest mortgage a lender will discuss. Review stable and documentable income, every recurring debt, normal household spending, available savings, and the amount that would remain after closing.'
    ),
    b.h3('List the expenses underwriting may not fully capture'),
    ...b.ul([
      'Food, childcare, healthcare, and insurance premiums',
      'Transportation, tolls, parking, and vehicle maintenance',
      'Family obligations and savings goals',
      'Utilities, maintenance, and emergency repairs',
    ]),
    b.p(
      'A household can qualify for a mortgage and still become financially strained. Build the ownership decision around take-home reality, not only gross-income guidelines.'
    ),

    b.h2('Step 2: Set the complete monthly budget'),
    b.p(
      'The full housing cost may include principal, interest, property taxes, homeowners insurance, mortgage insurance, association dues, flood insurance when applicable, utilities, maintenance, and assessments.'
    ),
    b.p(
      'A principal-and-interest quote is not the complete payment. Test several scenarios and preserve room for groceries, transportation, medical costs, retirement, repairs, and emergencies.'
    ),
    b.p(
      '[Use the affordability calculator as a planning tool](/resources/calculators/affordability), not as a mortgage approval.'
    ),

    b.h2('Step 3: Review credit and protect the file'),
    b.p(
      'Review credit reports for unfamiliar accounts, wrong balances, duplicates, outdated records, or identity errors. Do not dispute accurate negative information simply because it is unfavorable; an unnecessary dispute can complicate underwriting.'
    ),
    b.p(
      'During the mortgage process, avoid financing a vehicle, opening furniture or credit accounts, taking personal loans, co-signing, or making unexplained large transactions without discussing the possible effect with the appropriate loan professional.'
    ),

    b.h2('Step 4: Compare financing paths by total cost'),
    b.p(
      'The appropriate mortgage depends on the buyer, property, lender, credit profile, income, savings, and transaction. A low down payment is useful only when the full payment and long-term cost remain manageable.'
    ),
    b.h3('FHA-insured financing'),
    b.p(
      'FHA may offer more flexible underwriting for some borrowers. Compare the down payment, upfront and monthly mortgage insurance, property standards, lender rules, and complete payment.'
    ),
    b.h3('Conventional financing'),
    b.p(
      'Conventional options can include lower-down-payment products and mortgage insurance that may be removable when applicable requirements are met. Pricing can be sensitive to credit, down payment, property type, and occupancy.'
    ),
    b.h3('VA-backed financing'),
    b.p(
      'Eligible veterans, service members, and certain surviving spouses may explore VA-backed financing. A possible zero-down path does not eliminate inspections, fees, moving costs, repairs, underwriting, property standards, or the need for reserves.'
    ),
    b.h3('USDA-backed financing'),
    b.p(
      'USDA requires household and address eligibility. Do not assume a Garland property qualifies; check the current rules for the specific address.'
    ),
    b.h3('NACA'),
    b.p(
      'NACA uses its own workshop, counseling, qualification, property, mortgage, and transaction process. Buyers can learn before qualification, but an active search should align with official status and instructions. [Review NACA home-search guidance](/programs/naca).'
    ),

    b.h2('Step 5: Investigate assistance without assuming it is free money'),
    b.p(
      "Texas buyers may be able to explore mortgage, down-payment, or closing-cost assistance through state, local, nonprofit, employer, or other programs. TDHCA's current homebuyer program connects qualifying buyers with approved professionals and requires approved homebuyer education for its assistance."
    ),
    b.p(
      'Assistance may be a grant, forgivable loan, deferred loan, repayable second mortgage, or benefit tied to a particular first mortgage. Ask whether it creates a lien, affects the rate, must be repaid after a sale or refinance, imposes occupancy rules, or requires a participating lender.'
    ),

    b.h2("Step 6: Understand Garland's specialized voucher option"),
    b.p(
      'Garland operates a Housing Choice Voucher Home Ownership Program for certain qualifying participants. It is not general assistance for every Garland resident or every first-time buyer.'
    ),
    b.p(
      "The City's current criteria include existing voucher participation for at least one year, program-specific first-time-homeowner requirements, income and employment conditions, and other agency rules. Interested participants should contact their Garland Housing Agency caseworker before relying on the program."
    ),

    b.callout({
      tone: 'note',
      heading: 'A specialized program is not a citywide benefit',
      paragraphs: [
        "Garland's voucher home-ownership option is narrow by design. Treat it as one possible path for qualifying voucher participants, and confirm current criteria with the Garland Housing Agency rather than assuming eligibility.",
      ],
    }),

    b.h2('Step 7: Obtain a meaningful financing review'),
    b.p(
      'A useful preapproval is based on reviewed financial information rather than a few answers in an online form. Ask what income, credit, debts, assets, funds, payment assumptions, and property restrictions were actually reviewed.'
    ),
    ...b.ul([
      'How long is the preapproval valid?',
      'What property-tax and insurance assumptions were used?',
      'Are mortgage insurance and association dues included?',
      'What changes could affect the result?',
      'Which documents must remain current?',
    ]),
    b.p('A preapproval is not a final approval. The property and transaction must qualify too.'),

    b.h2('Step 8: Build the search around daily life'),
    b.p(
      'Test work routes during the hours you actually travel. Include tolls, fuel, parking, vehicle wear, and added childcare time. Consider family responsibilities, medical access, community connections, maintenance preferences, and how long you expect to own the home.'
    ),
    b.h3('Separate needs from cosmetic preferences'),
    b.p(
      'Non-negotiables may include payment, bedrooms, accessibility, commute, parking, or property type. Strong preferences might include a yard, office, garage, or layout. Paint, fixtures, and decorating choices are usually easier to change than location, structure, or affordability.'
    ),

    b.h2('Step 9: Evaluate taxes, insurance, dues, and condition'),
    b.p(
      "The seller's current property-tax bill may not equal the buyer's future amount because exemptions, assessed value, ownership changes, and taxing jurisdictions can affect it. Ask how the lender calculated the estimate."
    ),
    b.p(
      'Request an insurance indication early. Roof age, property condition, construction, claim history, replacement cost, deductible, and insurer requirements can materially change the budget.'
    ),
    b.p(
      'For association properties, review dues, transfer charges, rules, maintenance responsibilities, pending assessments, financial information, and use restrictions rather than evaluating the community by the monthly fee alone.'
    ),

    b.h2('Step 10: Tour with a repeatable system'),
    b.p(
      'Record price, estimated payment, taxes, insurance, dues, commute, roof and system age, drainage, visible moisture, layout, storage, parking, noise, immediate repairs, and long-term fit. After several tours, details blur.'
    ),
    b.p(
      'Fresh paint, staging, lighting, and furniture improve presentation. They do not prove that the roof, foundation, plumbing, electrical system, drainage, or heating and cooling equipment are sound.'
    ),

    b.pullQuote({
      quote:
        'Staging proves a house shows well. Only an inspection tells you what it will cost to own.',
    }),

    b.h2('Step 11: Prepare a fact-based offer'),
    b.p(
      'Offer strategy may consider comparable sales, current competition, days on market, seller timing, condition, financing, appraisal risk, inspection terms, requested concessions, and contract deadlines.'
    ),
    b.p(
      'A strong offer is not always the highest number. Clear terms, reliable documentation, practical timing, and manageable risk can matter. No ethical agent can guarantee seller acceptance.'
    ),

    b.h2('Step 12: Use inspections and specialists wisely'),
    b.p(
      'A general inspector may evaluate visible and accessible roofing, foundation, structure, electrical, plumbing, heating and cooling, appliances, drainage, moisture, and safety conditions. Depending on the findings, a buyer may need a structural engineer, roofer, plumber, electrician, HVAC contractor, sewer specialist, pest professional, or another expert.'
    ),
    b.p(
      "An appraisal is not a substitute for an inspection. The appraisal generally supports a lender's value and property review; the inspection helps the buyer understand observed condition."
    ),

    b.h2('Step 13: Protect the closing'),
    b.p(
      'During underwriting, keep income, employment, credit, assets, and requested documents current. Review the final price, loan amount, rate, payment, cash to close, credits, taxes, insurance, association charges, closing date, and possession terms.'
    ),
    b.complianceDisclaimer({
      heading: 'Wire-fraud warning',
      paragraphs: [
        '**Verify wire instructions through an independently confirmed contact method.** Do not rely only on an unexpected email containing new instructions.',
      ],
    }),
    b.p(
      'Use the final walkthrough to confirm the property remains in expected condition, agreed work appears complete, included items remain, and no new material damage is visible.'
    ),

    b.h2('Step 14: Plan for the first year'),
    b.p(
      'Prepare for utility transfers, locks, tax exemptions when eligible, routine maintenance, filters, pest control, landscaping, appliance care, association requirements, and emergency repairs. Keep inspection reports, warranties, receipts, closing records, and repair information together.'
    ),
    b.p(
      'A home does not need to look finished in the first month. Protecting reserves is more important than financing furniture for every room.'
    ),

    b.inlineImage({
      src: '/manus-storage/hero-family_b1fab939.jpg',
      alt: 'A family of four standing together in front of a single-family house with a covered porch',
      caption: 'The first year of ownership is maintenance, reserves, and routine — not a finished house.',
      layout: 'wide',
    }),

    b.h2('How Debra Allen supports a Garland buyer'),
    b.p(
      'Debra can help clarify goals, organize a location strategy, evaluate options, review comparable information, prepare offers, coordinate inspections, manage contract deadlines, communicate with transaction professionals, and prepare for the final walkthrough and closing.'
    ),
    b.p(
      'She does not approve mortgages, determine program eligibility, inspect or appraise the property, issue legal or tax advice, guarantee seller acceptance, or guarantee closing. Clear boundaries help buyers know which professional should answer each question.'
    ),

    b.checklist({
      heading: 'Before you tour the first Garland home',
      intro: 'Work through this list once and the rest of the process gets meaningfully easier.',
      items: [
        { label: 'Know the complete monthly payment you can sustain', detail: 'Principal, interest, taxes, insurance, dues, utilities, and maintenance.' },
        { label: 'Know the cash you may need', detail: 'Down payment, closing costs, inspections, prepaid items, and moving expenses.' },
        { label: 'Know the reserve that will remain after closing' },
        { label: 'Know the condition and repair risk you can absorb' },
        { label: 'Know the locations that fit your real commute and routine' },
        { label: 'Know which professional controls each decision in the transaction' },
      ],
    }),

    b.calculatorCta({
      heading: 'Put numbers on the plan',
      body: 'Both calculators are planning tools. Neither is a mortgage approval, and neither replaces a lender review.',
      calculators: [
        { _key: 'calc-afford', label: 'Affordability calculator', href: '/calculators/affordability' },
        { _key: 'calc-closing', label: 'Closing-cost calculator', href: '/calculators/closing-costs' },
      ],
    }),

    b.areaCta({
      heading: 'Continue with the Garland area guide',
      body: "Debra's focused Garland resource covers cost, condition, commute, and timing for a local search.",
      href: '/areas/garland',
      label: 'Open the Garland guide',
    }),

    b.consultationCta({
      heading: 'Turn the Garland search into a plan',
      body: 'Know the payment you can sustain, the cash you may need, the condition you can handle, the locations that fit your routine, and how much reserve will remain after closing.',
      href: '/consultation',
      label: 'Book a consultation',
      secondaryHref: '/areas/garland',
      secondaryLabel: "Continue with Debra's Garland homebuyer guide",
    }),
  ],
};
