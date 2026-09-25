/**
 * Supporting CMS documents referenced by the migrated articles.
 *
 * Only verified facts appear here. Trust facts that require confirmation
 * (brokerage, license number, service area) intentionally remain absent —
 * see apps/web/lib/site.ts and docs/12-governance/PUBLISHING_STANDARD.md.
 */

export const authors = [
  {
    _id: 'author.debra-allen',
    _type: 'author',
    name: 'Debra Allen',
    displayName: 'Debra Allen, REALTOR®',
    role: 'REALTOR®',
    profilePath: '/about',
    bio: "Debra Allen leads D'Affordable Homes, an education-first homeownership platform for first-time buyers and renters preparing for ownership in North Texas.",
  },
];

export const categories = [
  {
    _id: 'category.program-guides',
    _type: 'category',
    title: 'Program guides',
    slug: { _type: 'slug', current: 'program-guides' },
    description:
      'How third-party homeownership programs work, where their authority begins and ends, and what a buyer still has to decide.',
  },
  {
    _id: 'category.area-guides',
    _type: 'category',
    title: 'Area guides',
    slug: { _type: 'slug', current: 'area-guides' },
    description:
      'Practical, local guidance for evaluating cost, condition, commute, and timing in a specific North Texas market.',
  },
];

export const programs = [
  {
    _id: 'program.naca',
    _type: 'program',
    title: 'NACA',
    slug: { _type: 'slug', current: 'naca' },
    path: '/programs/naca',
    summary:
      'NACA controls its own workshops, counseling, qualification, mortgage terms, and property approvals. Debra supports the real-estate side only.',
  },
  {
    _id: 'program.homes-for-heroes',
    _type: 'program',
    title: 'Homes for Heroes',
    slug: { _type: 'slug', current: 'homes-for-heroes' },
    path: '/programs/homes-for-heroes',
    summary:
      'A third-party program with its own eligibility, enrollment, specialist network, and reward rules. Program status must be confirmed directly.',
  },
];

export const areas = [
  {
    _id: 'area.garland',
    _type: 'area',
    title: 'Garland, Texas',
    slug: { _type: 'slug', current: 'garland' },
    path: '/areas/garland',
    summary: 'An established North Texas city inside the wider Dallas–Fort Worth region.',
  },
  {
    _id: 'area.dallas-fort-worth',
    _type: 'area',
    title: 'Dallas–Fort Worth',
    slug: { _type: 'slug', current: 'dallas-fort-worth' },
    summary:
      'A large multi-city region rather than a single housing market. Taxes, insurance, inventory, and commute patterns differ materially between communities.',
  },
];
