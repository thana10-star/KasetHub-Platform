# Plant Image Analysis Pipeline

M10 creates the frontend UX foundation for plant image upload and mock analysis. It does not upload files, call AI vision APIs, write to Supabase Storage, or create a backend moderation pipeline.

## Frontend Upload Flow

1. User taps “ถ่ายรูปใบพืชหรือแมลง” or drags an image onto the desktop drop zone.
2. Browser validates file type and size locally.
3. Browser creates a temporary object URL for preview.
4. User starts mock analysis.
5. UI shows analyzing skeleton/progress.
6. UI returns a mock structured result.
7. User can save summary to My Farm and Guest Memory.

Supported local file types in M10:

- JPG
- PNG
- WebP

The actual image file is not persisted in Guest Memory. Only lightweight summary metadata, such as file name and analysis result, is saved.

## Temporary Image Storage Future

Future backend implementation should upload images to temporary private storage first. Recommended fields:

- `image_asset_id`
- `user_id` or `guest_id`
- original file name
- MIME type
- size
- checksum
- upload status
- moderation status
- expires at
- deletion requested at

Temporary images should expire automatically if the user does not save the analysis.

## Moderation

Before sending images to a vision model, the backend should:

- Validate file type and size again.
- Strip unnecessary metadata when possible.
- Check for unsafe, irrelevant, or personal images.
- Reject images that clearly do not contain plants, pests, soil, or agricultural context.
- Keep an audit trail for rejected images without exposing raw images broadly.

## Unsafe Image Handling

Unsafe or irrelevant images should return a friendly message:

- “ยังไม่พบข้อมูลที่มั่นใจเพียงพอ”
- “ลองถ่ายใกล้ใบพืชมากขึ้น”
- “ภาพไม่ชัดพอ”

Do not send unsafe images to downstream models if policy says to block them.

## Privacy and Deletion Policy

Images may reveal farm location, people, property, or sensitive crop conditions. The product should:

- Ask consent before upload.
- Explain why the image is needed.
- Let users delete saved analysis history.
- Separate temporary images from saved My Farm records.
- Avoid storing raw images longer than needed.

## Future Supabase Storage

Supabase Storage can hold plant images in private buckets. Access should be controlled through signed URLs or backend proxy routes. Service role keys must remain server-side only.

Potential buckets:

- `plant-analysis-temp`
- `plant-analysis-saved`
- `expert-review-attachments`

## Backend Proxy

The frontend should call a backend endpoint such as:

```http
POST /api/ai/analyze-plant-image
```

The backend should:

- Verify auth or guest session.
- Check credit balance.
- Verify consent.
- Upload or locate the image asset.
- Run moderation.
- Route to the vision model.
- Save structured result.
- Deduct credits only when appropriate.

## Vision Model Routing

Plant image analysis should use the M09 `plant_image_analysis` request type:

- selected tier: `vision`
- provider candidate: `future_vision_model`
- default credit cost: 3 credits
- safety level: high

## Cost Control Strategy

- Compress or resize images before model calls.
- Limit image count per analysis session.
- Cap retry attempts.
- Charge more credits for multi-image analysis.
- Use cheaper pre-checks before expensive vision calls when possible.
- Avoid reprocessing the same image by checksum.

## Queue and Retry Strategy

Image analysis can be slower than text AI. Future backend work should support:

- queued jobs for large images
- retry on transient provider failures
- user-visible status
- no double charging on retry
- graceful failure when all providers fail

## M10 Boundary

M10 is local UX only. It uses object URLs for preview, mock analysis results, and Guest Memory summaries. No real upload, backend call, AI vision model, moderation service, Supabase Storage, or hidden API key exists.

## M11 Mock Proxy Fixture Layer

M11 keeps the image local but replaces the old static analysis result with a backend-shaped mock proxy response.

`analyzePlantImage()` in `src/services/ai-proxy/ai-proxy-mock-service.ts` returns:

- request ID
- backend status
- 3-credit validation preview
- model plan for `plant_image_analysis`
- plant analysis result fields
- safety disclaimers
- warnings
- logs preview
- retryability

Supported fixture states:

- normal disease result
- low confidence
- no plant detected
- blurry image
- safety warning
- insufficient credits
- safety blocked
- retryable failure

The selected image still uses a browser object URL only. It is not uploaded, persisted as base64, sent to Supabase Storage, or sent to any vision provider. Guest Memory stores only lightweight result metadata after the user saves a successful result to My Farm.

## M12 Storage and Job Planning

M12 adds storage and job lifecycle planning without enabling uploads.

New planning files:

- `src/services/storage/storage.types.ts`
- `src/services/storage/plant-media-storage-planner.ts`
- `src/services/image-analysis/image-analysis-job.types.ts`
- `src/services/image-analysis/image-analysis-job-planner.ts`

The storage planner returns:

- proposed private bucket
- proposed object path
- thumbnail path
- privacy policy
- signed URL policy
- moderation requirement
- deletion policy
- warnings

The job planner previews:

- `pending_upload`
- `uploaded`
- `moderation_pending`
- `ready_for_ai`
- `ai_processing`
- `completed`
- `failed`
- `deletion_requested`

`/app/analyze` now shows this future backend flow as explanatory UI. The current version still keeps raw images local and stores only lightweight result metadata in Guest Memory.
