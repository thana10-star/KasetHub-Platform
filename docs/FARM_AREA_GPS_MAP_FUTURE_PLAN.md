# Farm Area GPS and Map Future Plan

M33 does not add GPS, map APIs, geolocation prompts, network calls, or backend writes. This plan defines how KasetHub can later add GPS/map-based plot measurement safely.

## Future Measurement Modes

### GPS Walking Boundary

A farmer walks around the plot boundary while the app records points. This should only happen after a clear permission request and an explanation of how location data will be used.

Future requirements:

- explicit tap before requesting location permission
- clear start/stop controls
- visible accuracy state
- pause/resume handling
- manual correction after walking
- no background tracking unless a later milestone explicitly designs it

### Map Polygon Drawing

A farmer draws a boundary on a map. The map provider should be loaded only after the user chooses the map mode.

Future requirements:

- point add/remove/edit controls
- area recalculation after each point change
- clear provider attribution
- offline/error state
- large mobile touch targets

### Satellite or Map Provider Support

Possible future provider options:

- Google Maps Platform
- Mapbox
- OpenStreetMap-based tiles
- Longdo Map or Thailand-focused providers
- government/open geospatial sources when available and legally usable

Provider choice should consider coverage in rural Thailand, Thai labels, cost, rate limits, attribution, privacy, caching rules, and mobile performance.

## Privacy Strategy

- Do not request geolocation on page load.
- Ask permission only after the user taps a GPS measurement action.
- Explain that precise farm boundaries are sensitive location data.
- Store boundaries as private user-owned data.
- Do not show precise plots publicly by default.
- Let users delete plot boundaries.
- Keep export/share opt-in.

## Accuracy Strategy

Every GPS/map measurement should show an accuracy label:

- rough estimate
- field estimate
- GPS estimate
- official survey required

The app should always keep this disclaimer visible:

> เป็นการคำนวณประมาณการ ไม่ใช่การรังวัดที่ดินอย่างเป็นทางการ

## Future Backend Flow

1. User signs in with verified account.
2. User creates a farm plot.
3. App requests geolocation only after explicit GPS action.
4. Client collects draft points locally.
5. User reviews and confirms.
6. Backend stores private boundary records.
7. Supabase RLS limits access to the owner.
8. Audit logs record export/share/delete actions.

## Future Schema

Suggested tables:

- `farm_plots`: plot profile and ownership.
- `farm_plot_measurements`: calculation records, method, formula, and area.
- `farm_plot_boundaries`: GPS or map polygon geometry.
- `farm_plot_notes`: user notes, crops, and planning context.

Precise geometry should not be public-read by default.

## Rollback and Deletion

Future backend work should support:

- delete a local draft before upload
- delete cloud plot record
- delete boundary geometry while keeping non-sensitive plot name
- revoke shared export links
- audit admin/support access

## Production Blockers

- Real auth and RLS.
- Location privacy policy.
- Map provider contract and attribution.
- Mobile field testing.
- Accuracy language review.
- Legal review for survey-related copy.
