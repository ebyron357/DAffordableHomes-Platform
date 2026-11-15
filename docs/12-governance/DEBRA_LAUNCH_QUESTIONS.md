# Questions for Debra — Launch Checklist

Prepared 2026-11-15. Each answer unlocks a specific part of the site that is
currently held back so nothing unverified is published. Answers you are not
sure about can be left blank; we will not guess or fill anything in for you.

Please answer in writing (email or a reply to this document) so there is a
record of what was approved and when.

---

## 1. Business facts (unlocks the footer, contact page and Google listing data)

These are shown on every page and in search results. Please give them exactly
as they appear on your licence and brokerage records.

| # | Question | Your answer |
|---|----------|-------------|
| 1.1 | What is your brokerage's full legal name, as it appears on your TREC licence? | |
| 1.2 | What is your TREC licence number? | |
| 1.3 | What is the brokerage's TREC licence number, and who is the designated broker? | |
| 1.4 | What business phone number should visitors call or text? | |
| 1.5 | What office address should be published (street, suite, city, ZIP)? If you work from home and do not want an address published, say so. | |
| 1.6 | Which cities or areas do you actively serve? (For example: Garland, Rowlett, Mesquite, Dallas.) Only list places you are comfortable being found for. | |
| 1.7 | Which public profiles are yours and should be linked? (Google Business Profile, Realtor.com, Zillow, HAR, LinkedIn, Facebook page.) Please send the full links. | |
| 1.8 | Do you want years of experience shown? If yes, the exact number and the year you were first licensed. | |
| 1.9 | Do you want a number of families served shown? If yes, the number and how it was counted. | |
| 1.10 | Which designations or certifications do you hold (for example ABR, SRS, MRP)? Please include the certificate or member ID so we can verify each one. | |

## 2. Programs mentioned on the site (unlocks program wording)

The site currently describes these programs in educational terms only. Before
it can say you work with them, we need to know your actual relationship.

| # | Question | Your answer |
|---|----------|-------------|
| 2.1 | Are you a registered Homes for Heroes affiliate agent? If yes, since when, and may we use their name and logo? | |
| 2.2 | What is your relationship with NACA? (Do you regularly represent NACA buyers, attend their workshops, or have a contact there?) | |
| 2.3 | Are there other down payment assistance or first-time buyer programs you want featured? Please name them so we can link to the official source. | |
| 2.4 | Are there lenders, inspectors or attorneys you refer people to? If yes, do you want them listed, and do any referral relationships need to be disclosed? | |

## 3. Compliance and legal review (required before launch)

| # | Question | Your answer |
|---|----------|-------------|
| 3.1 | Can you send your completed TREC Information About Brokerage Services (IABS) form, or confirm your broker will supply it? | |
| 3.2 | Who will review and approve the Privacy Policy, Terms of Use and Fair Housing statement — you, your broker, or an attorney? Please give their name and email. | |
| 3.3 | What email address should receive privacy requests and accessibility feedback? Someone must check it regularly. | |
| 3.4 | Does your brokerage have advertising rules we must follow (required wording, logo placement, broker name size)? Please send them if so. | |

## 4. Consultations and lead delivery (unlocks booking and the contact forms)

Right now the forms and booking calendar are built but deliberately switched
off, so no one's details are collected until delivery is confirmed.

| # | Question | Your answer |
|---|----------|-------------|
| 4.1 | Do you have a GoHighLevel account set up? If not, which tool do you use to track new contacts? | |
| 4.2 | Who manages GoHighLevel for you, and can they create an inbound webhook using `docs/08-integrations/GHL_SETUP.md`? | |
| 4.3 | Please send the GoHighLevel booking calendar link you want visitors to use. | |
| 4.4 | How long should a first consultation be, and which days and hours are you available? | |
| 4.5 | When someone sends a request, how quickly do you usually reply? (We will only show a reply time you can keep.) | |
| 4.6 | Who should receive a notification when a new request arrives — your email, phone, or both? | |
| 4.7 | May we send one test request through every form after setup, and will you confirm it arrived? | |
| 4.8 | Do you want visitors to be able to opt in to text messages? If yes, we will need your approved consent wording for SMS. | |

## 5. Photos and branding (unlocks the remaining images)

| # | Question | Your answer |
|---|----------|-------------|
| 5.1 | Do you approve the current homepage photo of the brick home? If not, do you have a real photo you would rather use? | |
| 5.2 | Who took your headshot and office photos, and do you have permission to use them online? | |
| 5.3 | Do you have exterior photos of homes in Garland or nearby that you own or have permission to use for the area guides? | |
| 5.4 | Is the current logo the final approved version? Please send the original logo files if you have them. | |

## 6. Reviews and stories (unlocks the testimonials section)

The site will never show a review or story that is not real and approved.

| # | Question | Your answer |
|---|----------|-------------|
| 6.1 | Do you want your Google reviews shown on the site? If yes, please confirm your Google Business Profile is active. | |
| 6.2 | Do you have past clients willing to share a short story? We will need their written permission before publishing. | |

## 7. Content approval

| # | Question | Your answer |
|---|----------|-------------|
| 7.1 | Please review the About Debra page. Is everything accurate, and is there anything you want to add in your own words? | |
| 7.2 | Do you host or plan homebuyer workshops or events? If yes, how often and where? | |
| 7.3 | Is there a topic people ask you about all the time that should become a guide? | |
| 7.4 | Would you like to publish articles yourself? If yes, we will schedule a short walkthrough. | |

## 8. Accounts and ownership (required before handoff)

Everything should be in your name so you are never locked out of your own site.

| # | Question | Your answer |
|---|----------|-------------|
| 8.1 | Who owns the domain `daffordablehomes.com`, and where is it registered? | |
| 8.2 | Which email address should own the website hosting, the content editor and the code repository? | |
| 8.3 | Do you already have Google Analytics, Google Search Console or Microsoft Clarity? If not, may we create them in your name? | |
| 8.4 | Is there anyone who previously had access to your website or accounts whose access should be removed? | |

## 9. Home search (later phase)

| # | Question | Your answer |
|---|----------|-------------|
| 9.1 | Which MLS are you a member of (for example NTREIS)? | |
| 9.2 | Has your brokerage approved an IDX provider, or would you like us to recommend options for you and your broker to review? | |

---

## What happens after you answer

1. We enter verified facts in `apps/web/lib/site.ts`; the footer, contact page
   and search data update automatically.
2. Once GoHighLevel and the calendar link are set, we send one test request
   through each form and confirm it with you.
3. Your broker or attorney reviews the legal pages before launch.
4. You sign off in `docs/12-governance/CLIENT_HANDOFF.md` Part 7.
