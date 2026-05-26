# Production Menu Cleanup M108.1

## Purpose

M108.1 removes internal milestone, readiness, QA, debug, prototype, and test wording from normal farmer-facing routes while preserving the existing internal routes for admin, QA, staging, and owner review.

This is a cleanup milestone only. It does not add broad features, remove route access, change local storage schemas, enable Supabase, enable AI provider calls, enable GPS, enable uploads, or change production data behavior.

## Farmer-Facing Surface

The cleanup focuses on the routes a normal user is likely to open from the app shell or profile/help flows:

- `/app`
- `/app/ai`
- `/app/weather`
- `/app/calculators`
- `/app/my-farm`
- `/app/farm-records`
- `/app/help`
- `/app/profile`

Visible copy on these routes should avoid:

- M-number or milestone labels
- readiness labels
- QA/debug/prototype/test wording
- internal scenario selectors or backend status panels
- admin-only links in the normal Profile menu

## Route Access Preserved

M108.1 does not delete or block internal routes. Admin, QA, staging, proxy, and release-audit routes remain available through their direct URLs and existing internal surfaces.

The production Profile menu is no longer used as a general index for internal routes. This keeps the normal user settings page calmer without removing internal access for the team.

## Cleanup Decisions

AI:

- Keep the normal Ask AI experience.
- Remove the visible internal scenario selector, proxy status links, request details, and team-only controls from `/app/ai`.
- Keep the existing route-level and service-level internal tooling intact.

Calculators:

- Keep the public calculator landing page focused on farmer tools.
- Remove the collapsed calculator QA and AI explanation preview section from `/app/calculators`.
- Preserve the calculator routes and service tests.

Farm Records:

- Keep the local Farm Records data-control and cloud-sync planning sections.
- Replace visible prototype/readiness/test wording with production-safe planning, warning, checklist, and ownership-check language.
- Keep local-only safety boundaries clear.

Profile:

- Keep account, privacy, help, and farm settings links.
- Remove the rendered internal advanced section from `/app/profile`.
- Preserve route definitions and internal access outside the normal Profile menu.

Home:

- Replace the milestone-style hero badge with a product badge.

## Verification Expectation

M108.1 should be checked with:

- `npm run lint`
- `npm run build`
- `npm run test`
- `git diff --check`
- route smoke for `/app`, `/app/ai`, `/app/weather`, `/app/calculators`, `/app/my-farm`, `/app/farm-records`, `/app/help`, and `/app/profile`

The route smoke should confirm the page loads and visible text does not include M-number, milestone, readiness, QA, debug, prototype, or test wording.
