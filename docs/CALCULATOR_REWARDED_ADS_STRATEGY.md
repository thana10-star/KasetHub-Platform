# Calculator Rewarded Ads Strategy

M53 defines a planning-only monetization boundary for agriculture calculators. M54 keeps export/share polish free and text-only while the rewarded-ads strategy remains future-only. No real AdMob SDK, ad inventory, payment, sponsor placement, affiliate routing, backend write, Supabase write, AI call, or network call is added.

## Core Rule

Basic calculations remain free. Ads should unlock convenience or advanced modes, not block essential safety information, labels, disclaimers, or deterministic calculator results.

## Future Rewarded Placements

- Advanced calculator mode with extra comparison rows.
- Export/share advanced summary with richer formatting.
- Save more than a future free local/cloud limit of results.
- AI explanation of a calculator result, clearly separated from the formula output.
- Compare fertilizer/cost options after reviewed rule metadata exists.

## Safety Boundaries

- Current M54 short and long text exports remain basic free functionality.
- Do not hide safety copy behind ads.
- Do not make spray, fertilizer, yield, or cost safety notes conditional on monetization.
- Do not change deterministic formulas based on ad viewing.
- Do not mix sponsored products secretly into calculator output or AI explanations.
- Paid placements must be labeled and auditable before production.

## Future Backend Needs

A real implementation would need consent, fraud/rate-limit controls, server-side unlock validation, audit logs, privacy review, and clear separation between calculator history, ad events, and sponsor attribution.

## M55 AI Explanation Boundary

AI explanation remains planning-only in M55. Future rewarded ads may unlock convenience around longer explanations, comparison views, or export polish, but they must not:

- block basic calculator results
- block safety disclaimers
- change deterministic formulas
- add sponsor content to explanations
- make chemical or fertilizer product suggestions
- hide uncertainty or expert-confirmation reminders

Any future monetized AI explanation must still use the calculator AI policy, keep `noRealAICall`-style dry-run fixtures available for QA, and show paid/sponsored surfaces separately from formula output.
