# M31 Image Compression + Preflight Quality Foundation Report

## Summary

M31 adds a local-only image compression and preflight quality foundation before future plant AI analysis. Farmers can now see photo readiness, local warning cards, original vs optimized image size, compression savings, and retake guidance before mock analysis. The feature prepares for lower future AI Vision/upload costs while keeping every image operation inside the browser.

No real AI API, upload, backend, Supabase Storage, network call, or raw image/base64 persistence was added.

## Files Changed

- `src/services/image-analysis/image-compression.types.ts`
- `src/services/image-analysis/image-compression-service.ts`
- `src/services/image-analysis/image-preflight.types.ts`
- `src/services/image-analysis/image-preflight-service.ts`
- `src/hooks/useImageCompression.ts`
- `src/routes/AnalyzePage.tsx`
- `src/routes/ImagePreflightPage.tsx`
- `src/routes/ProfilePage.tsx`
- `src/routes/QAPage.tsx`
- `src/app/App.tsx`
- `src/types/kaset.ts`
- `src/services/image-analysis/image-analysis.types.ts`
- `src/services/image-analysis/image-upload-service.ts`
- `src/services/qa/route-registry.ts`
- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/PLANT_IMAGE_ANALYSIS_PIPELINE.md`
- `docs/AI_CREDIT_AD_UNLOCK_STRATEGY.md`
- `docs/AI_AGRICULTURE_SAFETY_POLICY.md`
- `docs/M30_NEXT_PHASE_DECISION.md`
- `docs/IMAGE_COMPRESSION_PREFLIGHT_FOUNDATION.md`
- `reports/milestones/M31_IMAGE_COMPRESSION_PREFLIGHT_FOUNDATION_REPORT.md`

## Routes Added

- `/app/image-preflight`

Accessible from:

- `/app/analyze`
- `/app/profile`
- `/app/qa`

## Image Compression Notes

- Default resize max width/height is `1280px`.
- Supports JPEG/WebP output planning, with JPEG as the current default.
- Tracks original size, optimized size, original dimensions, optimized dimensions, compression ratio, and estimated AI/upload cost reduction label.
- Uses browser canvas and object URLs only.
- Optimized preview URLs are revoked by `useImageCompression()`.
- Compression failure is non-blocking and shows a safe local warning.

## Image Preflight Notes

Local checks include:

- file type
- file size
- image dimensions
- too-small warning
- very-large warning
- possible blurry warning placeholder
- plant-photo guidance checklist
- local-only privacy notice

The readiness score is a UX estimate only. It is not AI moderation, not diagnosis, and not uploaded.

## Screens Updated

- `/app/analyze` now shows “ลดขนาดรูปก่อนวิเคราะห์”, compression preview, original vs optimized size, readiness score, warning cards, retake tips, and the note “รูปยังไม่ถูกส่งออกจากเครื่องในเวอร์ชันนี้”.
- `/app/image-preflight` explains optimization, future AI cost savings, recommended photo tips, future backend upload flow, and privacy boundaries.
- `/app/profile` links to image preflight.
- `/app/qa` includes image preflight in route coverage.
- `/app/mvp-snapshot` route registry now includes `/app/image-preflight` under AI / Plant analysis.

## Documentation Updates

- Added `docs/IMAGE_COMPRESSION_PREFLIGHT_FOUNDATION.md`.
- Updated README and project blueprint for M31.
- Updated plant image analysis pipeline docs with compression/preflight behavior.
- Updated AI credit strategy with future optimized-image cost notes.
- Updated AI agriculture safety policy with image preflight safety rules.
- Updated M30 next-phase decision notes to mark M31 as a completed local preparation milestone.

## Verification Commands

```bash
npm run lint
npm run build
```

Both passed. The production build completed with the existing Vite large chunk warning.

## Manual Route Checks

The in-app Browser runtime was unavailable in this session, so route verification used local Vite on `http://127.0.0.1:5174` plus headless Chrome DOM checks.

Passed:

- `/app/analyze`
- `/app/image-preflight`
- `/app/analysis-history`
- `/app/profile`
- `/app/qa`

The local Vite server was stopped after verification.

## Known Limitations

- No real upload.
- No real AI Vision.
- No backend.
- No Supabase Storage.
- No network calls.
- No real blur detection model.
- No EXIF stripping implementation yet.
- No server-side image moderation.
- No persisted optimized image.
- No raw image/base64 storage in Guest Memory.
- Compression happens in the browser and may vary by browser canvas support.

## Next Recommended Milestone

M32 should continue the backend/staging path with controlled Supabase Auth staging or, if the AI path is prioritized, define the real plant-image upload and AI proxy staging contract with consent, EXIF/privacy handling, server-side moderation, optimized-image upload, credit enforcement, provider-key protection, and deletion workflow.

