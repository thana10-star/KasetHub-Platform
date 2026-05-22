# YouTube Import Content Strategy

M20 adds a local YouTube import planner for editorial planning only. It does not call the YouTube Data API or create article records.

## Current Planner

The planner lives in `src/services/content/youtube-import-planner.ts`.

It reads local fixtures from:

- `src/data/youtubeData.ts`
- `src/services/content/content-fixtures.ts`

It returns:

- source channel identity from local fixtures
- import candidates
- proposed content category
- proposed difficulty
- ownership check state
- editor review state
- workflow notes
- explicit no-network boundaries

## Editorial Flow

Future YouTube-to-content import should follow this flow:

1. Confirm the source video belongs to the owner channel or a licensed partner.
2. Fetch metadata and transcript server-side only.
3. Build an article outline from title, description, tags, transcript, and playlist context.
4. Map category, difficulty, author/source, related videos, and tags.
5. Route disease, pesticide, fertilizer, pricing, and safety-sensitive claims through human review.
6. Publish only through a backend-owned CMS workflow with audit logging.

## M20 Boundaries

M20 does not:

- call YouTube Data API
- fetch transcripts
- download videos or thumbnails
- trust ownership without backend verification
- generate articles with AI
- write CMS rows
- write Supabase rows
- perform network requests

## Future Backend Notes

The browser should never hold YouTube API keys or OAuth refresh tokens. A future backend job should own:

- channel and playlist sync
- pagination tokens
- transcript retrieval
- quota handling
- ownership verification
- import idempotency
- moderation and safety review status
- article draft creation
- audit logs for editor actions
