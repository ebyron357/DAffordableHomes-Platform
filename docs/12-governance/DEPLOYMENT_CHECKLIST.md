# Deployment Checklist

## Pre-deployment

- [ ] Release checklist is complete
- [ ] Required approvals are recorded
- [ ] Vercel project and production environment are configured
- [ ] Environment variables are validated and stored outside Git
- [ ] Provider credentials use least privilege
- [ ] Preview deployment has been reviewed
- [ ] Search indexing behavior is correct for preview and production
- [ ] Database or provider migrations, if any, have rollback notes

## Deployment

- [ ] Deploy from the approved branch or release tag
- [ ] Confirm deployment URL and commit SHA
- [ ] Verify production build completed without warnings that affect release gates
- [ ] Verify health checks and critical routes
- [ ] Verify forms, booking fallbacks, and provider-unavailable states
- [ ] Verify analytics events with non-sensitive test interactions

## Post-deployment

- [ ] Monitor error logs
- [ ] Monitor Core Web Vitals or Lighthouse evidence
- [ ] Confirm no unexpected indexing, broken links, or missing assets
- [ ] Confirm contact paths and escalation routes
- [ ] Record deployment result in release notes
