# Offline Article CMS Role Rules

M72 role planning keeps article publishing human-reviewed and scoped.

Roles:

- `viewer`: read published/reviewed content only; cannot edit
- `content_editor`: draft and edit drafts only; cannot final publish
- `agriculture_expert`: sign agriculture review only
- `safety_reviewer`: sign safety review only
- `image_reviewer`: sign image review only
- `release_manager`: request final release but cannot bypass blockers
- `admin`: manage workflow but cannot silently bypass human release gate

Automation rule:

- automation cannot final publish
- automation cannot remove disclaimers
- automation cannot turn CMS override into release approval

Final release still requires explicit human approval, release reviewer, release timestamp, release note, and audit event records.

