# Farm Harvest Yield M91

## Purpose

M91 adds local harvest/yield records so Farm Records can estimate production performance from data stored on this device.

## Local Model

`farmHarvestRecords` are stored inside `kasethub.farmRecords.v1` with:

- plot and optional crop-cycle links
- harvest date
- crop name
- quantity and unit
- normalized kg when the unit supports it
- optional grade, buyer, sale price per kg, gross income, and note

Supported normalized units are `kg` and `ton`. `sack`, `basket`, and `other` are preserved but are not used for cost-per-kg math unless a future unit conversion is added.

## Analytics

The local analytics layer computes:

- total harvested kg
- harvest record count
- yield per rai
- total income, total expense, and net profit
- cost per kg
- income per kg
- profit per kg
- average sale price per kg
- actual recorded break-even price per kg
- latest harvest date

All division is guarded. Missing quantity, missing area, zero harvest kg, and non-normalized units produce warnings instead of crashes.

## Export And Restore

M91 updates JSON backup, restore validation, restore preview, and pre-restore snapshot helpers to include `farmHarvestRecords`. Old backups without this slice still restore safely with an empty harvest array.

## Boundary

Harvest/yield data may reveal production volume and business performance. M91 remains local-only and adds no Supabase read/write, sync queue, cloud sync, cloud backup/delete, GPS/geolocation, AI processing, receipt upload, OCR, notifications, bank/loan integration, tax filing, or official accounting/legal/yield guarantee claims.
