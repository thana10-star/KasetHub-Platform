# Admin Roles and Permissions Plan

This plan defines future admin roles for KasetHub. M24 only previews these roles and does not grant real permissions.

## Roles

### owner

Highest-trust role for platform ownership.

Future permissions:

- manage admin roles
- view full audit logs
- approve platform policies
- configure critical data sources
- approve destructive/admin-level actions

### admin

Operations role for managing platform modules.

Future permissions:

- assign review queues
- manage user support escalations
- monitor system health
- view moderation dashboards
- manage non-owner settings

### editor

Content workflow role.

Future permissions:

- review drafts
- approve article publication
- approve video import outlines
- manage taxonomy and metadata
- archive or schedule content

### moderator

Community safety role.

Future permissions:

- review community reports
- hide or restore posts/comments
- mark reports dismissed or action taken
- escalate dangerous advice
- record moderation reasons

### expert_reviewer

Agriculture expertise role for high-risk review.

Future permissions:

- review chemical, pesticide, fertilizer, and disease advice
- review crop price source reliability
- review plant analysis escalation
- attach expert notes
- flag unsafe or uncertain claims

### support

User help role with limited access.

Future permissions:

- inspect account/sync status for support
- open support cases
- help users understand local vs cloud state
- escalate issues to admin
- never access private data beyond support policy

## Permission Areas

Future permissions should cover:

- content publish
- video import approve
- community moderation
- crop price review
- AI safety review
- plant analysis escalation
- user support
- audit logs

## Security Rules

- All permissions must be enforced server-side.
- The frontend must never hide unauthorized actions as the only protection.
- Service-role keys must never be present in frontend code.
- Admin audit logs should be append-only.
- Destructive actions should require reason, actor, target, timestamp, and rollback/correction path.
- Expert review notes should be traceable to reviewer role and source date.

## RLS Planning

Supabase RLS should distinguish:

- public read-only content
- user-owned private data
- moderator/admin review data
- owner-only security configuration
- support read-only views

No table should trust client-supplied role claims. Backend or Supabase Auth custom claims must be the source of truth.
