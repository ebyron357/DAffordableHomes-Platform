# Post-Release Monitoring Checklist

## First hour

- [ ] Production route availability checked
- [ ] Error logs reviewed
- [ ] Contact and booking paths tested with non-production-safe data
- [ ] Provider-unavailable fallbacks checked where integrations exist
- [ ] Analytics event stream checked for expected events and no sensitive payloads

## First business day

- [ ] Core Web Vitals or Lighthouse snapshot reviewed
- [ ] Search indexing settings reviewed
- [ ] Accessibility feedback channels monitored
- [ ] Form spam and rate-limit behavior reviewed
- [ ] CRM/test lead routing confirmed where applicable

## First week

- [ ] User feedback reviewed
- [ ] Error trends reviewed
- [ ] Content corrections or compliance feedback triaged
- [ ] Performance regressions triaged
- [ ] `ACTIONS.md`, `TECH_DEBT.md`, and `RISKS.md` updated with follow-up work
