# Offline Article Versioning Plan

M66 adds article version fixtures for the offline agriculture library.

## Version Fields

Each article has planned version metadata:

- version id
- content status
- editorial owner placeholder
- last reviewed date placeholder
- future CMS key
- offline fallback priority
- offline fallback availability

## Content Status Values

- `outline_only`
- `starter_content`
- `reviewed_draft`
- `ready_for_full_publish`

M65 articles currently remain `outline_only` or `starter_content`. M66 does not promote any article to official full publish.

## Future CMS Rule

CMS versions can extend body content, but bundled offline fallback must remain available and required disclaimers must remain visible.

