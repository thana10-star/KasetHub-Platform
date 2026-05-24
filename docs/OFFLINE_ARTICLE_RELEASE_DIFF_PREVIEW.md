# Offline Article Release Diff Preview

The release diff preview is a local-only editorial tool for future article publishing workflows.

The preview should show:

- before vs after summary
- disclaimer changes
- source metadata changes
- reviewer status changes
- image review changes
- final publish status

Safety rules:

- a disclaimer edit always requires review
- source metadata changes must not imply official approval
- image review changes do not publish images automatically
- CMS override diffs cannot become a release approval
- automation-generated diffs cannot bypass the human release gate

M71 stores diff previews as fixtures only. No diff is persisted to Supabase or CMS.

