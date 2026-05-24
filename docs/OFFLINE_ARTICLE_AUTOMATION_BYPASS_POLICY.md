# Offline Article Automation Bypass Policy

KasetHub offline article publishing must not be controlled by CMS override or automation alone.

Blocked bypass examples:

- CMS override marks article final without human release approval
- automation changes release status directly
- generated content removes required disclaimers
- image review status is changed without reviewer evidence
- source metadata is changed without release review

Required future release controls:

- explicit human approval flag
- release reviewer identity
- release timestamp
- release note
- audit event row
- release diff preview
- safety disclaimer confirmation

M71 proves the current app blocks these paths locally. It does not publish or write article data.

