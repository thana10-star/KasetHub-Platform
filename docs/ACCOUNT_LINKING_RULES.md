# Account Linking Rules

M19 defines account-linking rules for future phone, LINE, and Guest Memory sync. This is a planning and frontend mock layer only.

## Provider Priority

Phone is the primary recovery path.

LINE is an important secondary provider for Thai users who use LINE every day or return from LINE community links.

Google remains a secondary option for users who already have a Google account.

## Linking States

### Guest Only

- User has no phone mock session and no LINE mock session.
- App remains usable.
- Guest Memory stays local.
- Recommended action: verify phone when the user wants backup.

### Phone Only

- User has a phone mock session.
- Phone is the primary recovery path.
- Guest Memory dry-run sync can prove ownership in the prototype.
- Recommended action: optionally link LINE later.

### LINE Only

- User has a LINE mock session but no phone mock session.
- The app can preview LINE identity.
- Recommended action: add phone before real backup/sync.
- Guest Memory sync should not treat this as final ownership until real provider verification exists.

### Phone + LINE Candidate

- User has both phone and LINE mock sessions.
- This is a linking candidate.
- Future production should ask for explicit confirmation before merging providers.
- Phone remains primary recovery.

### Provider Conflict

- A provider appears to belong to another account or duplicate provider identity.
- User confirmation and backend checks are required.
- Sync should be blocked until ownership is resolved.

## Guest Memory Sync Rules

- Sync attaches to a confirmed account owner.
- Duplicate saved items merge by `itemType + itemId`.
- My Farm sync requires consent.
- AI question history sync is optional.
- Local Guest Memory is never deleted after sync failure.
- Local data should be marked synced only after backend-confirmed success.

## Backend Requirements

Future backend or Supabase Edge Function must:

- validate `auth.uid()` server-side
- verify phone/LINE ownership
- use idempotency keys for sync retries
- write `auth_link_events`
- write `guest_sync_events`
- keep service-role keys server-side only
- never trust a user ID sent directly from the browser

## SQL Notes

M18 already includes:

- `profiles.auth_providers`
- `profiles.line_user_id`
- `auth_link_events`
- `guest_sync_events`

A future `account_provider_links` table may be useful if provider linking needs history, verification status, conflict status, and revocation records beyond the simple `profiles` summary.
