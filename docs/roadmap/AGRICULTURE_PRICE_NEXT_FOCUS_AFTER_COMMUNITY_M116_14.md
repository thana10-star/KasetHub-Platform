# Agriculture Price Next Focus After Community M116.14

## Context

Community staging has a functional write path and an implemented moderation dashboard shell. The owner has deferred owner-side moderation activation so the next product focus can move toward real agriculture price value.

Community moderation setup remains deferred but required before public Community launch.

## Next Focus Order

1. Real crop/product prices
2. Fertilizer prices
3. YouTube/channel content integration
4. AI real provider readiness
5. Land/area calculation tools

## Price Work Direction

The next milestone should prioritize real, sourced price information over new Community features:

- identify acceptable crop/product price sources
- define source attribution and freshness copy
- avoid fake numeric prices
- separate commodity/crop prices from fertilizer input prices
- keep stale/source-pending states honest

## Community Handoff

Community moderation setup is implemented but not owner-activated.

Deferred items:

- apply `supabase/sql/community_admin_moderation_m116_13.sql`
- add owner to `admin_moderators`
- configure `VITE_ADMIN_EMAILS`
- verify real report queue in-app

This is not blocking private/staging app exploration, but it is required before public Community write launch.
