# M10 Plant Image Upload + Analysis UX Foundation Report

## Summary

M10 upgrades KasetHub’s plant disease analysis into a premium local image upload and mock analysis workflow. Farmers can select or drag/drop a plant image, preview it locally, run a simulated analysis, see a structured result, save it to My Farm/Guest Memory, share it, and view local analysis history. No real upload, backend call, Supabase Storage write, moderation service, or AI vision API is used.

## Files Changed

- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/AI_AGRICULTURE_SAFETY_POLICY.md`
- `docs/GUEST_MEMORY_FRAMEWORK.md`
- `docs/PLANT_IMAGE_ANALYSIS_PIPELINE.md`
- `src/app/App.tsx`
- `src/types/kaset.ts`
- `src/components/ui/Card.tsx`
- `src/routes/AnalyzePage.tsx`
- `src/routes/AnalysisHistoryPage.tsx`
- `src/routes/MyFarmPage.tsx`
- `src/routes/ProfilePage.tsx`
- `src/services/image-analysis/image-analysis.types.ts`
- `src/services/image-analysis/image-upload-service.ts`
- `src/hooks/useImageUpload.ts`
- `reports/milestones/M10_PLANT_IMAGE_UPLOAD_ANALYSIS_UX_FOUNDATION_REPORT.md`
- `reports/milestones/m10-analyze.png`
- `reports/milestones/m10-analysis-history.png`
- `reports/milestones/m10-my-farm.png`
- `reports/milestones/m10-profile.png`
- `reports/milestones/m10-memory.png`

## Routes Added

- `/app/analysis-history`

## Upload UX Notes

- `/app/analyze` now has a mobile-first camera-style upload CTA: “ถ่ายรูปใบพืชหรือแมลง”.
- Desktop drag/drop is supported on the upload card.
- Local preview uses browser object URLs only.
- Supported local validation:
  - JPG, PNG, WebP image types
  - 5 MB max size
  - unsupported file warnings
  - file too large warnings
- Upload states are modeled as `idle`, `selecting`, `preview`, `analyzing`, `complete`, and `failed`.
- Retry, remove image, and change image actions are included.

## Analysis Workflow Notes

The upgraded flow supports:

1. Upload/select image
2. Image preview
3. Mock analysis loading state
4. Premium mock result card
5. Save to My Farm
6. Share result

The result card includes:

- disease name
- confidence %
- symptoms
- possible causes
- treatment suggestions
- urgent warning badge
- estimated future credit cost
- AI safety disclaimer
- save/share actions
- ask AI follow-up link

## Failure Handling Notes

M10 handles or previews:

- unsupported file type
- file too large
- “ภาพไม่ชัดพอ”
- “ลองถ่ายใกล้ใบพืชมากขึ้น”
- “ยังไม่พบข้อมูลที่มั่นใจเพียงพอ”
- low confidence warning for tiny image files

Blurry/no-plant warnings are mock quality checks based on file names and local metadata only.

## Guest Memory Integration Notes

- Saving a result writes a My Farm record through Guest Memory.
- Saving also creates a `savedItems` entry with `itemType: analysis_result`.
- `/app/analysis-history` reads Guest Memory only.
- The actual image file is not persisted in localStorage.
- History stores lightweight metadata such as file name, disease result, confidence, and thumbnail tone marker.
- Profile and My Farm link to analysis history.

## Documentation Updates

- `docs/PLANT_IMAGE_ANALYSIS_PIPELINE.md` documents upload flow, temporary storage, moderation, unsafe image handling, privacy/deletion policy, future Supabase Storage, backend proxy, vision routing, cost control, and queue/retry strategy.
- `docs/AI_AGRICULTURE_SAFETY_POLICY.md` now includes M10 image-analysis safety notes.
- `docs/GUEST_MEMORY_FRAMEWORK.md` clarifies that raw photos and large base64 thumbnails should not be stored in Guest Memory.

## Verification Commands

```bash
npm run lint
npm run build
```

Both commands passed.

Manual route checks returned HTTP 200:

- `/app/analyze`
- `/app/analysis-history`
- `/app/my-farm`
- `/app/profile`
- `/app/memory`

Mobile screenshots were captured for the same routes.

## Known Limitations

- No real AI image analysis
- No real uploads
- No Supabase Storage
- No backend network calls
- No moderation pipeline
- No OpenAI/Gemini vision API
- No real credit deduction on image analysis
- Image preview exists only for the current browser session
- Analysis history stores summaries, not actual photos

## Next Recommended Milestone

M11 should define the Supabase Storage and image-analysis database schema draft, including private buckets, signed URL policy, image moderation status, deletion requests, My Farm media linkage, and backend-owned vision analysis job lifecycle.
