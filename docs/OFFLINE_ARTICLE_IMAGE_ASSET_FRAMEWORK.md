# Offline Article Image Asset Framework

M65 plans image metadata without adding heavy image files. The current app renders local visual placeholders while preserving paths, Thai alt text, and future prompt notes for optimized assets.

## Asset Rules

- Use compressed `.webp` images.
- Keep files small enough for offline app bundles.
- Use one cover image per article.
- Use one to three inline images only for important or visually helpful articles.
- Do not use external image URLs for bundled offline articles.
- Do not add huge raw images, uncompressed PNGs, or base64 blobs.
- Include Thai alt text for every planned image.

## Aspect Ratios

- Cover images: `16:9` or `4:3`
- Inline images: `4:3`

## Planned Paths

Category image plans live in `src/services/content/offline-agri-article-image-plan.ts`.

Example path:

```text
public/assets/articles/soil/soil-types-before-planting-cover.webp
```

These paths are planning metadata only until optimized assets are intentionally added.

## Future Prompt Notes

Future image generation or editorial production should follow the category theme, avoid misleading disease or damage visuals, and keep the image educational. Prompt notes must not imply a product recommendation, sponsor placement, or official diagnosis.

## M66 Image QA

M66 adds image checklist validation for planned offline article assets:

- cover metadata exists
- path is local, not external
- Thai alt text exists
- future prompt note exists
- aspect ratio is supported
- offline size warning exists

Current warnings are expected because assets remain planned placeholders.
