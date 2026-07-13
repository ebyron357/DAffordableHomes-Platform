# Architecture Decision Log

## 2026-07-13 — Add durable production-readiness governance artifacts

- **Decision:** Maintain `ACTIONS.md`, `TECH_DEBT.md`, `DECISIONS.md`, `RISKS.md`, `CHANGELOG.md`, and release/deployment/rollback/monitoring checklists in the repository.
- **Reason:** Production readiness requires auditable evidence of decisions, risks, unresolved dependencies, validation, and release operations before application launch.
- **Alternatives Considered:** Track execution only in pull requests or external project management tools.
- **Trade-offs:** Repository-based logs require ongoing maintenance, but they keep critical delivery context close to the code and accessible to future agents.
- **Affected Components:** Governance documentation, release process, contributor workflow.

## 2026-07-13 — Start CI with repository-health validation before app scaffold

- **Decision:** Add an initial GitHub Actions workflow focused on governance-file presence, merge-conflict markers, and committed environment-file prevention.
- **Reason:** Full build/type/lint/test checks cannot run until the application scaffold exists, but Phase 0 can still prevent high-impact repository regressions.
- **Alternatives Considered:** Wait to add CI until the Next.js app is created.
- **Trade-offs:** The initial workflow is intentionally limited, but it creates an executable quality gate now and can be expanded without replacing it.
- **Affected Components:** `.github/workflows/repository-health.yml`, `docs/12-governance/CI_PLAN.md`, Phase 0 roadmap.
