# Changelog

All notable repository changes are documented here.

## 2026-07-14

- Consolidated the approved full website into the governed `apps/web` monorepo structure.
- Restored 22 public application routes, the responsive navigation, next-step guide, homepage sections, compliance pages, honest provider-unavailable states, and approved imagery.
- Upgraded the application to Next.js 16 and React 19.2.4.
- Fixed strict TypeScript, React 19 composition, provider notice, and navigation-state defects.
- Added a full GitHub Actions application quality gate for typecheck, lint, tests, and production build.
- Required the same full quality gate for Vercel preview builds.
- Updated production-readiness and technical-debt records.

## 2026-07-13

- Added production execution logs and risk/debt/decision registers.
- Added production readiness, release, deployment, rollback, and post-release monitoring checklists.
- Added GitHub issue templates for bugs, features, and production gates.
- Added initial repository-health GitHub Actions workflow.
- Updated README and roadmap to reflect Phase 0 governance progress and remaining blockers.
