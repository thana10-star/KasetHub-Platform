# Farm Cost Dashboard M90

## Purpose

M90 adds local-first Farm Cost Summary and Break-even Dashboard behavior on top of Farm Records and Farm Finance Ledger data. It helps farmers review recorded income, expenses, net profit/loss, cost per rai, category concentration, and estimated break-even numbers.

## Local Data Source

The dashboard reads only local Farm Records state from `kasethub.farmRecords.v1` through typed services. It does not call Supabase, does not sync data, does not call AI, and does not request GPS/geolocation.

## Analytics Included

- Total income.
- Total expense.
- Net profit/loss.
- Profit status.
- Income and expense entry counts.
- Activity record count.
- Farm plot and crop cycle counts.
- Area used for per-rai estimates when available.
- Cost per rai.
- Income per rai.
- Profit per rai.
- Expense by category sorted descending.
- Income by category sorted descending.
- Top expense and income categories.
- Latest finance and activity dates.

## Break-even Estimate

The break-even calculator uses:

- Total expense from the filtered local ledger.
- Expected yield in kg.
- Expected selling price per kg.
- Optional area rai override.

It can estimate:

- Break-even price per kg.
- Expected revenue.
- Estimated profit/loss.
- Break-even yield kg.

The calculator avoids divide-by-zero and shows warnings when yield, price, area, or expenses are missing.

## Filters

M90 respects simple Farm Records filters for:

- Farm plot.
- Crop cycle.
- Start date.
- End date.

Activity type and finance category filters remain list-level filters and are not used to hide unrelated cost-dashboard context.

## Privacy And Claims Boundary

M90 remains local-only:

- No Supabase schema, migration, read, write, or sync queue.
- No cloud sync, cloud backup, or cloud delete.
- No AI analysis of farm records or finance entries.
- No GPS/geolocation/map pin/latitude/longitude.
- No receipt/image upload.

The dashboard is not official accounting, tax, loan, or legal advice. It is a practical local estimate based only on the records entered on this device.

## Future Work

- Farmer-facing saved dashboard presets.
- Harvested quantity model for actual cost per kg.
- Exportable cost summaries after export safety review.
- Stronger conflict/recovery behavior before any cloud sync.
