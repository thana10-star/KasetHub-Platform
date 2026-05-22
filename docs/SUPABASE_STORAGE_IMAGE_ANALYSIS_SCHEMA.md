# Supabase Storage and Image Analysis Schema

M12 designs the future storage, database, privacy, moderation, and job lifecycle foundation for plant image analysis. It does not create real buckets, upload files, call Supabase Storage, call AI vision providers, or run backend network requests.

## Private Bucket Plan

Recommended buckets:

- `plant-analysis-temp`: temporary original uploads before the user saves a result.
- `plant-analysis-saved`: saved images linked to My Farm or analysis history.
- `expert-review-attachments`: future attachments for expert review workflows.

All buckets should be private. Public buckets should not be used for user farm images.

## Object Path Convention

Suggested path pattern:

```text
guests/{guest_session_id}/{yyyy-mm-dd}/original/{media_id}.{ext}
guests/{guest_session_id}/{yyyy-mm-dd}/thumbs/{media_id}.webp
users/{user_id}/{yyyy-mm-dd}/original/{media_id}.{ext}
users/{user_id}/{yyyy-mm-dd}/thumbs/{media_id}.webp
```

Rules:

- Use generated IDs, not raw filenames, for stored object names.
- Keep original filename in metadata only.
- Avoid putting crop, disease, province, phone, or personal details in paths.
- Store thumbnails separately so list screens do not need original files.

## Signed URL Policy

- Signed URLs should be issued only by backend or Supabase Edge Functions.
- Default TTL: 15 minutes.
- Maximum TTL: 60 minutes unless there is a specific admin workflow.
- Never expose service-role keys in frontend code.
- Do not store long-lived signed URLs in Guest Memory or localStorage.

## Thumbnail Strategy

- Generate WebP thumbnails after upload.
- Strip unnecessary metadata before thumbnail creation.
- Use thumbnails in My Farm and analysis history.
- Keep original image private and only load it when the user opens a detail screen.

## Deletion Strategy

Users should be able to request deletion for:

- original image
- thumbnail
- plant media row
- analysis job linkage
- analysis result media reference
- My Farm media reference

Deletion should be backend-owned and idempotent. Deleting an image should not necessarily delete the text analysis result unless the user asks to delete the whole analysis history.

## RLS Policy Notes

Storage objects:

- Users can read only objects they own.
- Guest objects should be accessed through backend-issued signed URLs, not broad anonymous rules.
- Inserts should go through backend or controlled upload policies.
- Deletes should go through backend so related records can be updated.

Tables:

- Users can select and delete their own media and analysis records.
- Admin/moderator access should be role-gated.
- Service role usage belongs only in backend or Edge Functions.

## Edge Function and Service Role Boundary

Future Edge Functions:

- `plant-media-upload-intent`
- `plant-image-moderate`
- `plant-image-analysis-job`
- `plant-media-delete`

The service role key must never be exposed through Vite ENV, browser code, screenshots, docs, or reports.

## Image Moderation Fields

Recommended moderation fields:

- `moderation_status`
- `moderation_reason`
- `moderation_checked_at`
- `moderation_provider`
- `contains_person`
- `contains_sensitive_location`
- `plant_context_detected`
- `unsafe_content_detected`
- `moderator_id`
- `admin_notes`

## `plant_media` Table Draft

Purpose: Track uploaded plant images and thumbnails.

Key columns:

- `id uuid primary key`
- `owner_user_id uuid nullable`
- `guest_session_id text nullable`
- `bucket_name text not null`
- `object_path text not null`
- `thumbnail_path text nullable`
- `mime_type text not null`
- `size_bytes integer not null`
- `width integer nullable`
- `height integer nullable`
- `checksum text nullable`
- `moderation_status text not null`
- `moderation_reason text nullable`
- `signed_url_expires_at timestamptz nullable`
- `deletion_requested_at timestamptz nullable`
- `linked_farm_record_id uuid nullable`
- `linked_saved_item_id uuid nullable`
- `analysis_job_id uuid nullable`
- `created_at timestamptz not null`
- `updated_at timestamptz not null`
- `metadata jsonb not null default '{}'`

Indexes:

- unique `object_path`
- `owner_user_id`
- `guest_session_id`
- `moderation_status`
- `analysis_job_id`
- `created_at desc`
- `checksum`

RLS:

- Owner can select their own rows.
- Backend inserts and updates moderation/deletion fields.
- Admins can review only with explicit role.

## `plant_analysis_jobs` Table Draft

Purpose: Track backend-owned image analysis lifecycle.

Key columns:

- `id uuid primary key`
- `owner_user_id uuid nullable`
- `guest_session_id text nullable`
- `media_object_id uuid references plant_media(id)`
- `status text not null`
- `request_type text not null`
- `model_route text not null`
- `provider_candidate text not null`
- `credit_cost integer not null`
- `credit_reserved boolean not null default false`
- `retry_count integer not null default 0`
- `moderation_status text not null`
- `error_code text nullable`
- `error_message text nullable`
- `created_at timestamptz not null`
- `updated_at timestamptz not null`
- `completed_at timestamptz nullable`
- `metadata jsonb not null default '{}'`

Indexes:

- `owner_user_id`
- `guest_session_id`
- `media_object_id`
- `status`
- `created_at desc`
- `(owner_user_id, status)`

RLS:

- Users can read their own job summaries.
- Mutations should go through backend functions.

## `plant_analysis_results` Table Draft

Purpose: Store structured AI vision output after a completed job.

Key columns:

- `id uuid primary key`
- `job_id uuid references plant_analysis_jobs(id)`
- `media_object_id uuid references plant_media(id)`
- `owner_user_id uuid nullable`
- `guest_session_id text nullable`
- `crop_name text nullable`
- `disease_name text nullable`
- `confidence numeric nullable`
- `confidence_label text nullable`
- `symptoms text[] not null default '{}'`
- `causes text[] not null default '{}'`
- `treatment_suggestions text[] not null default '{}'`
- `urgency text not null default 'watch'`
- `safety_disclaimers text[] not null default '{}'`
- `should_consult_expert boolean not null default true`
- `linked_farm_record_id uuid nullable`
- `linked_saved_item_id uuid nullable`
- `created_at timestamptz not null`
- `metadata jsonb not null default '{}'`

Indexes:

- `job_id`
- `media_object_id`
- `owner_user_id`
- `guest_session_id`
- `crop_name`
- `disease_name`
- `created_at desc`

RLS:

- Users can read/delete their own results.
- Expert review and model-quality review need separate role-based views with redaction.

## Linkage to `farm_records` and `saved_items`

When a user saves an analysis:

- `farm_records.metadata.media_object_id` can reference the media row.
- `farm_records.metadata.analysis_result_id` can reference the result.
- `saved_items.itemType = analysis_result` can store the result ID.
- Deleting media should clear media references or mark them deleted, while preserving text notes if the user wants.

## Retention Policy

- Temporary uploads expire after 24 hours if not saved.
- Rejected moderation images should be deleted quickly after audit metadata is recorded.
- Saved images stay until the user deletes them or policy requires deletion.
- Signed URLs should not be retained.
- Raw images should not be copied into logs.

## Cost-Control Notes

- Resize/compress before AI model calls.
- Limit multi-image sessions.
- Use checksum to avoid duplicate processing.
- Do moderation before expensive AI calls.
- Reserve credits before processing and finalize credit spend after successful accepted result.
- Do not double-charge backend retries.

## M12 Boundary

M12 is a schema and planning draft only. The app still uses local preview, Guest Memory summaries, local AI credits, and M11 mock proxy fixtures.

## M18 SQL Draft Link

M18 adds draft SQL for:

- `plant_media`
- `plant_analysis_jobs`
- `plant_analysis_results`

The SQL includes private-media metadata, moderation status, job status, result linkage to My Farm/saved items, and RLS drafts for user-owned reads. It still does not create buckets, upload files, generate signed URLs, or call vision models.
