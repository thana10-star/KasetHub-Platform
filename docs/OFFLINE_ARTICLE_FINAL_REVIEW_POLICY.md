# Offline Article Final Review Policy

M70 keeps final review as a human-owned release step.

## Policy

- Article metadata completion is not publication approval.
- Reviewer sign-off completion is not publication approval.
- Image preflight completion is not publication approval.
- AI or automation must never set final publish.
- Sponsor or affiliate content must not influence release approval.

## Future CMS Rule

Future CMS rows may store article evidence and release review records, but the final release state must require a human-approved release gate and audit trail.

No M70 route writes CMS data or Supabase data.

## M71 Audit Events

Future final review must create auditable events for attempted publish, blocked publish, reviewer change, source metadata change, disclaimer change, image review change, release gate change, and automation bypass attempt.

M71 keeps these as local fixtures only and keeps `finalPublishAllowed` false.
