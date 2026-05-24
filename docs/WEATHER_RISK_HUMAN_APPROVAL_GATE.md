# Weather Risk Human Approval Gate

M80 keeps a distinct human release gate for future weather risk rule activation.

Future release would require:

- explicit human approval
- release reviewer placeholder
- release timestamp placeholder
- release note placeholder

Current M80 state:

- `releaseApproved: false`
- `finalPrescriptiveAllowed: false`
- `automationBypassAllowed: false`
- `cmsBypassAllowed: false`

No automation, CMS override, local fixture, or test state can make weather risk rules prescriptive.
