# Image Compression + Preflight Quality Foundation

M31 adds a local-only image optimization layer before future plant AI analysis. It reduces image size in the browser, estimates image readiness, and gives farmers clearer photo guidance before any real upload or AI Vision integration exists.

## Scope

- No real AI API.
- No real upload.
- No backend.
- No Supabase Storage.
- No network calls.
- No raw image or base64 persistence in Guest Memory.

## Services

- `src/services/image-analysis/image-compression.types.ts`
- `src/services/image-analysis/image-compression-service.ts`
- `src/hooks/useImageCompression.ts`
- `src/services/image-analysis/image-preflight.types.ts`
- `src/services/image-analysis/image-preflight-service.ts`

## Compression Behavior

Default settings:

- max width: `1280px`
- max height: `1280px`
- output: `image/jpeg`
- quality: `0.78`

The compression service returns:

- original file name/type
- original size
- optimized size
- original dimensions
- optimized dimensions
- compression ratio
- estimated AI/upload cost reduction label
- optimized Blob for local preview only

The optimized Blob is not stored in Guest Memory and is not uploaded.

## Preflight Checks

The local preflight service checks:

- file type
- file size
- image dimensions
- too-small warning
- very-large warning
- possible blurry warning placeholder
- plant-photo guidance checklist
- local-only privacy notice

The readiness score is a UX estimate only. It is not AI moderation and not a disease diagnosis.

## Analyze Screen Updates

`/app/analyze` now shows:

- compression preview before mock analysis
- “ลดขนาดรูปก่อนวิเคราะห์”
- original size vs optimized size
- readiness score
- warning cards
- retake photo tips
- clear note: “รูปยังไม่ถูกส่งออกจากเครื่องในเวอร์ชันนี้”
- link to `/app/image-preflight`

## Image Preflight Route

`/app/image-preflight` explains:

- why image resizing can reduce future AI Vision cost
- recommended photo-taking tips
- local-only privacy boundaries
- future backend upload flow
- no raw image/base64 persistence rule

## Guest Memory Boundary

Guest Memory may store lightweight metadata only, such as:

- file name
- original size
- optimized size
- readiness score
- analysis result summary

Guest Memory must not store:

- raw image files
- base64 strings
- object URLs
- optimized Blob contents
- private storage paths before real consent/upload exists

## Future Backend Notes

Before real upload or AI Vision:

- ask explicit consent
- upload only optimized image when appropriate
- keep original/private media in Supabase Storage only after consent
- protect provider keys server-side
- enforce credits server-side
- moderate images before AI Vision
- provide deletion for original, thumbnail, and linked media records

