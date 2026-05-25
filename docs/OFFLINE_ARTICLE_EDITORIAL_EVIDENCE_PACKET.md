# Offline Article Editorial Evidence Packet

M70 adds a local-only evidence packet for offline agriculture article review.

## Packet Contents

- source evidence
- reviewer evidence
- image evidence
- safety disclaimer confirmation
- freshness date placeholder
- escalation note
- release blocker list
- final human approval requirement

## Current Pilot

The first packet is for `soil-types-before-planting`.

The packet can simulate completed source, reviewer, and image metadata, but it still cannot publish automatically.

## Boundaries

- No Supabase writes.
- No CMS writes.
- No production publishing.
- No AI article generation.
- No real image generation.
- No sponsor or affiliate injection.

## M71 Release Audit Link

M71 adds a release audit readiness layer on top of the evidence packet.

The audit layer records local fixture examples for blocked publish attempts, reviewer changes, disclaimer changes, image review changes, and automation bypass attempts. The evidence packet remains required, but the audit layer proves that evidence completion still does not equal final publication.
