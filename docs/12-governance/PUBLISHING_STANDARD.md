# D'Affordable Homes Publishing and Quality Standard

No page, feature, workflow, integration, AI change, downloadable asset, or campaign may be published until every applicable release gate below is complete.

## 1. Ownership

The person or agent proposing publication must document:

- item being released
- owner
- reviewer
- affected routes and integrations
- factual sources
- user data collected
- analytics events
- known limitations
- rollback method

An unchecked required item is a blocker, not a future cleanup task.

## 2. Brand gate

- [ ] Matches the canonical brand voice
- [ ] Supports at least one pillar: Education, Trust, Expertise, Community, or Action
- [ ] Reinforces step-by-step guidance where appropriate
- [ ] Uses a clear, useful next step
- [ ] Avoids pressure, shame, fake urgency, and unsupported promises
- [ ] Treats affordability as aligned and empowering, not cheap
- [ ] Uses dancing or rhythm references only when authentic and restrained
- [ ] Uses only approved logo, typography, colors, imagery, and components

## 3. Accuracy and trust gate

- [ ] Names, dates, locations, program details, statistics, market information, and claims are verified
- [ ] Credentials, brokerage information, licenses, certifications, years of experience, and service counts are confirmed
- [ ] Listings come from the approved provider
- [ ] Testimonials and media have documented permission
- [ ] Time-sensitive information includes a review or effective date
- [ ] No placeholder, fabricated, estimated, or AI-invented factual content is being presented as real
- [ ] External links and contact information work
- [ ] The experience explains what happens next

## 4. Accessibility gate — WCAG 2.2 AA

### Structure and navigation

- [ ] Semantic landmarks are present
- [ ] Heading order is logical
- [ ] A skip-navigation link is available
- [ ] Navigation is consistent and keyboard accessible
- [ ] Breadcrumbs are included where they improve orientation
- [ ] The current page or step is communicated accessibly

### Keyboard and focus

- [ ] All functions work with keyboard only
- [ ] Focus is visible
- [ ] Focus order follows the visual and logical flow
- [ ] Focus is managed correctly in dialogs, menus, and multi-step experiences
- [ ] No keyboard trap exists

### Visual and motion

- [ ] Text and interface contrast pass required ratios
- [ ] Information is not conveyed by color alone
- [ ] Text remains usable at 200 percent zoom
- [ ] Reflow works without two-dimensional scrolling except where essential
- [ ] Reduced-motion preferences are respected
- [ ] No flashing or harmful animation exists
- [ ] Autoplay is avoided

### Images and media

- [ ] Informative images have meaningful alternative text
- [ ] Decorative images are ignored by assistive technology
- [ ] Videos have captions
- [ ] Audio or video has a transcript when needed
- [ ] Controls are keyboard and screen-reader accessible

### Forms and interaction

- [ ] Every field has an associated label
- [ ] Required fields and formats are explained before submission
- [ ] Errors identify the field and explain correction
- [ ] Error summaries are usable
- [ ] Success states are announced
- [ ] Time limits are avoided or controllable
- [ ] Multi-step progress is understandable
- [ ] Consent choices are explicit and not preselected when prohibited

### Files

- [ ] Downloaded PDFs are tagged and have correct reading order
- [ ] Headings, lists, tables, links, and images are accessible
- [ ] Text is selectable and searchable
- [ ] An accessible HTML alternative is supplied when the file cannot meet the standard

### Validation

- [ ] Automated accessibility tests pass
- [ ] Keyboard-only manual testing passes
- [ ] Critical journeys receive screen-reader testing
- [ ] Mobile accessibility is reviewed

## 5. Real-estate compliance gate

- [ ] REALTOR® usage is correct
- [ ] Brokerage name and required disclosures are present
- [ ] Applicable license information is present
- [ ] Fair Housing language is reviewed
- [ ] Equal Housing Opportunity information is displayed as required
- [ ] Neighborhood and recommendation content has been reviewed for steering risk
- [ ] No protected-class data or proxy is used for matching or ranking
- [ ] IDX attribution and provider disclosures are present
- [ ] Listing display follows provider rules
- [ ] Commission or service statements are accurate and approved
- [ ] The applicable brokerage or qualified reviewer has approved required language

## 6. AI gate

- [ ] Clara identifies herself as AI
- [ ] The answer source and knowledge review date are available when applicable
- [ ] No approval, eligibility, savings, timeline, or outcome is guaranteed
- [ ] No legal, tax, lending, credit-repair, or individualized financial advice is provided
- [ ] Fair Housing and protected-trait tests pass
- [ ] Sensitive-data collection tests pass
- [ ] Retrieval failures do not produce fabricated answers
- [ ] Tool failures are reported honestly
- [ ] Lead handoff requires appropriate consent
- [ ] Evaluation suite is run and results are recorded
- [ ] Unavailable fallback is usable

## 7. Privacy gate

- [ ] Data collection has a defined purpose
- [ ] Only necessary data is collected
- [ ] Consent language is clear
- [ ] Email and SMS consent are handled correctly
- [ ] Privacy notice reflects actual providers and behavior
- [ ] Retention and deletion rules are defined
- [ ] Sensitive data is not exposed in URLs, analytics, logs, or browser storage
- [ ] Third-party scripts are documented
- [ ] Cookie or tracking choices work where required
- [ ] A privacy contact process is available

## 8. Security gate

- [ ] No secrets are committed or exposed to browser code
- [ ] Inputs are validated and sanitized
- [ ] Authentication and authorization are tested where applicable
- [ ] Public forms and AI endpoints have rate limiting
- [ ] Spam and bot protections have an accessible fallback
- [ ] Security headers are verified
- [ ] Content Security Policy is reviewed
- [ ] Dependencies have no unresolved critical vulnerabilities
- [ ] Error messages do not expose internal details
- [ ] Logs avoid protected or sensitive data
- [ ] Provider credentials use least privilege

## 9. Technical gate

- [ ] Type checking passes
- [ ] Linting passes
- [ ] Unit and integration tests pass
- [ ] Critical browser journeys pass
- [ ] Loading, empty, error, and unavailable states are tested
- [ ] Mobile, tablet, and desktop layouts are verified
- [ ] Supported browsers are verified
- [ ] No broken links or missing assets exist
- [ ] Feature flags and environment validation behave correctly
- [ ] Rollback path is documented

## 10. Performance gate

- [ ] Lighthouse Performance is 95 or higher on representative routes
- [ ] Lighthouse Accessibility is 100
- [ ] Lighthouse Best Practices is 100
- [ ] Lighthouse SEO is 100
- [ ] LCP is below 2.5 seconds
- [ ] INP is below 200 milliseconds
- [ ] CLS is below 0.1
- [ ] Images and fonts are optimized
- [ ] Third-party scripts are justified and controlled
- [ ] Client JavaScript remains within the approved route budget

## 11. SEO gate

- [ ] Page title is unique and accurate
- [ ] Meta description is useful and non-deceptive
- [ ] Canonical URL is correct
- [ ] Indexing rules are correct
- [ ] Open Graph metadata is complete
- [ ] Structured data is valid and factually accurate
- [ ] Heading hierarchy is accessible and useful
- [ ] Internal links are included
- [ ] Images are optimized and described
- [ ] Local terms are natural and accurate
- [ ] Sitemap behavior is correct
- [ ] No duplicate, thin, or doorway content is introduced

## 12. Analytics gate

- [ ] Required events are defined in the event taxonomy
- [ ] Events fire once at the correct moment
- [ ] Success and failure outcomes are distinguishable
- [ ] No sensitive user input is included
- [ ] Lead source is preserved correctly
- [ ] Consent choices control tracking where required
- [ ] Dashboard or reporting ownership is identified
- [ ] Test traffic can be filtered

## 13. Content gate

- [ ] Purpose is clear
- [ ] One primary audience is identifiable
- [ ] Plain language is used
- [ ] The page teaches a useful concept
- [ ] One primary CTA is present
- [ ] Trust evidence is included where appropriate
- [ ] FAQ is included when it resolves important hesitation
- [ ] Internal links support the journey
- [ ] Grammar and spelling are reviewed
- [ ] Time-sensitive content has an owner and next review date

## 14. Integration gate

### GHL

- [ ] Correct fields, tags, consent, pipeline, and workflow are used
- [ ] Duplicate handling is tested
- [ ] Success and failure states are tested
- [ ] Email and SMS automation is verified with test contacts
- [ ] No production client data was used in development screenshots or fixtures

### MLS/IDX

- [ ] Provider connection is live and approved
- [ ] Attribution and update rules are correct
- [ ] Search, filters, details, no-results, and provider-down states work
- [ ] Accessibility is tested beyond the surrounding site shell

### Other providers

- [ ] Credentials, scopes, quotas, timeout, retry, and fallback behavior are documented
- [ ] Privacy disclosures include the provider
- [ ] Removal or outage does not create false information

## 15. Release decision

Record one decision:

- **Approved:** all required gates pass.
- **Approved with documented exception:** only a named owner may approve a time-limited, non-critical exception with risk, mitigation, and expiration date.
- **Blocked:** one or more required gates fail.

## 16. Post-release verification

Within the release window:

- [ ] Verify production routes
- [ ] Submit real test forms using approved test data
- [ ] Verify booking and workflow delivery
- [ ] Verify analytics and consent behavior
- [ ] Review logs and errors
- [ ] Verify search indexing controls
- [ ] Confirm provider attribution and disclosures
- [ ] Confirm rollback remains available

## 17. Quarterly audit

Review accessibility, performance, SEO, brand consistency, GHL workflows, Clara quality, integrations, analytics, security, privacy, content freshness, market information, and user feedback at least quarterly.
