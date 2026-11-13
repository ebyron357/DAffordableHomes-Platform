/**
 * The Texas Real Estate Commission notices both footers must link to.
 *
 * One list for the interior footer (components/layout/site-footer.tsx) and the
 * homepage footer (lib/figma-home.ts), so a change reaches every page at once.
 *
 * The brokerage-services link currently points at TREC's blank IABS form page.
 * Once the sponsoring brokerage is verified, it should point at that
 * brokerage's completed IABS instead (audit finding Q-02, RISK-006); this is
 * the one line to change.
 */
export const TREC_LINKS = [
  {
    label: "TREC Information About Brokerage Services",
    href: "https://www.trec.texas.gov/forms/information-about-brokerage-services",
  },
  {
    label: "TREC Consumer Protection Notice",
    href: "https://www.trec.texas.gov/forms/consumer-protection-notice",
  },
] as const
