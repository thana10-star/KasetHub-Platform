# Community Author Display Name M116.6

M116.6 adds a small, privacy-safe display-name strategy for Community without adding a broad profile system or changing write security behavior.

## V1 Display Strategy

Community author names use this priority:

1. Use `author_display_name` stored on the community post/comment row when present.
2. For the current signed-in user's own content, if no display name exists, derive a safe name from the email local part only.
3. Otherwise show `สมาชิก KasetHub`.

Examples:

- `สวนลุงสมชาย` stays `สวนลุงสมชาย`.
- `community-user-a@test.local` becomes `community-user-a`.
- A missing name on another user's post becomes `สมาชิก KasetHub`.

The feed must never show full email addresses publicly.

## Login To Profile To Community Flow

Current flow:

1. Login creates a Supabase auth session.
2. Profile shows a read-only preview labeled `ชื่อที่แสดงในชุมชน`.
3. Community write service tries to read the signed-in user's `profiles.display_name` when available.
4. If profile display name is not available, Community uses auth metadata display name, then sanitized email local part, then `สมาชิก KasetHub`.
5. New posts, comments, and replies denormalize this safe value into `author_display_name`.

This keeps the public Community feed readable while avoiding public full email exposure.

## Current Profile Gap

The SQL/RLS drafts include a `profiles` table with owner-scoped policies, but the app does not yet ship a complete user-facing public community display-name editor. M116.6 only adds a safe Profile preview and service-side lookup path.

Minimal future plan:

1. Add a Profile field named `ชื่อที่แสดงในชุมชน`.
2. Store a short sanitized `profiles.display_name`.
3. Allow authenticated users to update only their own display name.
4. Allow Community reads to access only safe public display-name fields needed for author labels, not private profile data.
5. Keep moderation able to review author IDs server-side without exposing private identifiers to the feed.

## Privacy And Moderation Notes

- Full email addresses are private and must not render in public Community cards.
- Derived email names use only the local part and strip unsafe characters.
- The fallback label is neutral: `สมาชิก KasetHub`.
- Author IDs remain available to RLS/moderation flows but are not used as public labels.
- Service-role keys remain server-only and are not introduced in frontend code.

