# M12 Supabase Storage + Image Analysis Schema Report

## Summary

M12 designs the future Supabase Storage, database, privacy, moderation, and job lifecycle foundation for real plant image analysis. The app still performs no real uploads, creates no buckets, calls no AI vision APIs, makes no backend network requests, and keeps Guest Memory, local AI credits, and the M11 mock proxy active.

## Files Changed

- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/PLANT_IMAGE_ANALYSIS_PIPELINE.md`
- `docs/AI_BACKEND_PROXY_CONTRACT.md`
- `docs/AI_AGRICULTURE_SAFETY_POLICY.md`
- `docs/SUPABASE_SCHEMA_DRAFT.md`
- `docs/GUEST_TO_ACCOUNT_SYNC_PLAN.md`
- `docs/SUPABASE_STORAGE_IMAGE_ANALYSIS_SCHEMA.md`
- `src/app/App.tsx`
- `src/types/kaset.ts`
- `src/routes/AnalyzePage.tsx`
- `src/routes/ImagePrivacyPage.tsx`
- `src/routes/ProfilePage.tsx`
- `src/services/storage/storage.types.ts`
- `src/services/storage/plant-media-storage-planner.ts`
- `src/services/image-analysis/image-analysis-job.types.ts`
- `src/services/image-analysis/image-analysis-job-planner.ts`
- `reports/milestones/M12_SUPABASE_STORAGE_IMAGE_ANALYSIS_SCHEMA_REPORT.md`

## Routes Added

- `/app/image-privacy`

## Storage Model Notes

M12 defines storage-ready models for:

- `PlantMediaObject`
- `PlantMediaAccessPolicy`
- `PlantMediaModerationStatus`
- `PlantMediaDeletionRequest`
- `PlantImageAnalysisStoragePlan`

The storage planner returns a no-network preview with:

- proposed private bucket
- proposed object path
- thumbnail path
- privacy policy
- signed URL policy
- moderation requirement
- deletion policy
- warnings

## Job Lifecycle Notes

M12 defines image-analysis job models for:

- `PlantImageAnalysisJob`
- `PlantImageAnalysisJobStatus`
- `PlantImageAnalysisJobResult`
- `PlantImageAnalysisJobLifecyclePreview`

The job planner previews:

- `pending_upload`
- `uploaded`
- `moderation_pending`
- `ready_for_ai`
- `ai_processing`
- `completed`
- `failed`
- `deletion_requested`

No job is created on a real backend.

## Privacy/Moderation Notes

- Images remain local-only in the current app.
- Future uploads should use private buckets only.
- Signed URLs should be short-lived and backend-issued.
- Moderation should run before AI vision calls.
- Users should be able to delete original images, thumbnails, and linked media references.
- Raw images must stay out of Guest Memory and localStorage.

## Screens Updated

- `/app/analyze`
  - Adds a compact “แผน backend ในอนาคต” panel.
  - Shows local preview now, future private upload, moderation, Vision AI, My Farm save, and deletion.
  - Links to image privacy information.
- `/app/image-privacy`
  - Explains current local-only image behavior.
  - Explains future private upload, consent, deletion, sensitive image guidance, and AI safety.
- `/app/profile`
  - Adds access to “ความเป็นส่วนตัวของรูปภาพ”.

## Verification Commands

```bash
npm run lint
npm run build
```

Both commands passed.

Manual route checks returned HTTP 200:

- `/app/analyze`
- `/app/image-privacy`
- `/app/profile`
- `/app/analysis-history`
- `/app/memory`

Local dev server used for checks:

- `http://127.0.0.1:5173/app/analyze`

## Known Limitations

- No real Supabase Storage connection
- No real buckets
- No real image uploads
- No real backend network calls
- No real auth
- No real AI vision provider
- No real moderation pipeline
- No signed URL generation
- No media deletion endpoint
- Storage and job lifecycle outputs are planning previews only

## Next Recommended Milestone

M13 should create a test-only backend proxy proof of concept behind feature flags. It should keep provider keys server-side, accept backend-shaped requests, validate credits server-side in dry-run/test mode, and return the same response contract as the M11 mock proxy without enabling production AI calls.
