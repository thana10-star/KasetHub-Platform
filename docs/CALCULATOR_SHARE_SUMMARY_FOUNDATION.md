# Calculator Share Summary Foundation

M50 adds a local-only share summary foundation for agriculture calculator results. It supports copying result text and using the existing share service when available, without creating files or saving to a backend.

## Scope

- No file generation.
- No PDF generation.
- No backend save.
- No Supabase write.
- No analytics, sponsor, affiliate, or payment integration.
- No network calls are required by calculator logic.

## Supported Calculators

Share summaries are available after a valid calculation for:

- spray mix
- plant spacing
- fertilizer helper
- yield estimate
- cost estimate

Invalid calculations show a disabled-style note and should not offer share/copy until required inputs are fixed.

## Summary Copy

Every summary starts with:

```text
สรุปผลคำนวณเบื้องต้น
```

Every summary includes:

```text
ควรตรวจสอบฉลาก/ผู้เชี่ยวชาญก่อนใช้งานจริง
```

Summary text should include only calculation inputs, result labels, local warnings, and safety boundaries. It must not include hidden recommendations, product suggestions, affiliate tracking, or AI-generated advice.

## Share Behavior

The UI supports:

- copy result text through `navigator.clipboard.writeText`
- native share through the existing `shareContent` service, with copy-link fallback when the device does not support native sharing

The current implementation does not create a downloadable document. Future export should keep the same disclaimer language and avoid uploading user inputs without explicit consent.

## Safety Boundary

Shared summaries are farmer-friendly reminders, not official instructions. They must not be presented as:

- pesticide or fertilizer recommendations
- expert agronomy advice
- soil test interpretation
- official land survey data
- financial or accounting advice

## Future Sponsor/Affiliate Boundary

Sponsor or affiliate features may only appear outside the deterministic calculator result. Paid placement must be clearly labeled, must not influence formulas, and must not receive calculator history without consent and backend-owned audit controls.
