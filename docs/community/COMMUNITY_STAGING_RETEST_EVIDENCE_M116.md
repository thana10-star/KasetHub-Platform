# M116 Community Staging Retest Evidence

Date: 2026-05-26

Status: pending owner staging retest after M115 deployment.

## Evidence Source

No new owner screenshots, notes, or staging retest output were provided to Codex for M116.

Known prior evidence:

- M113 owner two-user RLS/storage smoke test passed in Supabase staging.
- M115 fixed the owner-reported like-count and comment-crash defects in code.
- M115 local checks passed, including route smoke and regression tests.

M116 does not claim the app-level staging UI write flow has passed until the owner retests with real staging accounts.

## User A Flow

| Check | Status | Evidence / notes |
| --- | --- | --- |
| Login via `/app/login` | pending | Awaiting owner staging retest. |
| Open `/app/community` | pending | Awaiting owner staging retest. |
| Create text post | pending | Awaiting owner staging retest. |
| Create post with 1 valid image | pending | Awaiting owner staging retest. |
| Invalid file type blocked | pending | Awaiting owner staging retest. |
| Oversized image blocked | pending | Optional if owner can test with a file over 3MB. |
| Like own post if allowed, or verify behavior | pending | Awaiting owner staging retest. |
| Hide own post | pending | Awaiting owner staging retest. |
| Delete own post if supported | pending | Awaiting owner staging retest. |

## User B Flow

| Check | Status | Evidence / notes |
| --- | --- | --- |
| Login via `/app/login` | pending | Awaiting owner staging retest. |
| Read User A post | pending | Awaiting owner staging retest. |
| Comment on User A post | pending | Awaiting owner staging retest. |
| Like User A post | pending | Awaiting owner staging retest. |
| Unlike User A post | pending | Awaiting owner staging retest. |
| Report User A post | pending | Awaiting owner staging retest. |
| Cannot hide/delete User A post | pending | Awaiting owner staging retest. |
| Cannot delete User A image | pending | Awaiting owner staging retest. |

## Anonymous Flow

| Check | Status | Evidence / notes |
| --- | --- | --- |
| Can read feed if policy allows | pending | Awaiting owner staging retest. |
| Cannot post | pending | Awaiting owner staging retest. |
| Cannot comment | pending | Awaiting owner staging retest. |
| Cannot like | pending | Awaiting owner staging retest. |
| Cannot report | pending | Awaiting owner staging retest. |

## UI Flow

| Check | Status | Evidence / notes |
| --- | --- | --- |
| Like count updates | pending | M115 local regression passed; owner staging retest still needed. |
| Comment section does not crash | pending | M115 local regression passed; owner staging retest still needed. |
| Valid comment appears | pending | Awaiting owner staging retest. |
| Report confirmation appears | pending | Awaiting owner staging retest. |
| No fake posts/likes/comments | pass in code review | No seeded public feed was added. Owner staging visual confirmation still useful. |
| Share still works | pending | Awaiting owner staging retest. |
| Bottom nav still fits | pending | Local route smoke passed in M115; owner mobile confirmation still useful. |

## Evidence Intake Template

Owner can paste notes here after retest:

- Date/time:
- Staging URL:
- User A result:
- User B result:
- Anonymous result:
- Screenshots:
- Failed step, if any:
- Post ID(s), if safe to record:
- Comment ID(s), if safe to record:

## Decision

M116 evidence status remains pending. Production community writes stay disabled.
