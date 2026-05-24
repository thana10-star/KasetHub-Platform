# Agriculture Article Safety Policy

KasetHub offline agriculture articles are educational starter content. They must not be presented as final agronomy, finance, fertilizer, chemical, or government-program advice.

## Required Baseline Disclaimer

Every offline article detail must show:

```text
ข้อมูลนี้เป็นความรู้เบื้องต้น
ควรตรวจสอบกับหน่วยงานเกษตร/ผู้เชี่ยวชาญในพื้นที่
```

## Finance Disclaimer

Finance articles must include:

```text
เงื่อนไขสินเชื่อ/โครงการรัฐเปลี่ยนได้ ควรตรวจสอบกับหน่วยงานจริง
```

Loan terms, rates, eligibility rules, and government programs must not be hardcoded as lasting facts.

## Fertilizer / Chemical Disclaimer

Fertilizer, pesticide, disease, pest, or chemical-adjacent articles must include:

```text
อ่านฉลากจริงก่อนใช้เสมอ
```

Article content must not recommend exact product use, hidden sponsor products, or chemical mixing instructions beyond safe label-check reminders.

## Future CMS Review

Future CMS articles should include editorial review status, source notes, last reviewed date, and safety tags. Offline fallback content remains intentionally conservative.

## M66 Non-removable Safety Rule

M66 treats required disclaimers as non-removable by CMS override. A future CMS item that removes the general safety note, finance warning, or fertilizer/chemical label warning must be blocked and the bundled offline fallback must remain visible.

## M67 Publish Gate Safety

Full article drafts cannot be marked ready unless source placeholders are filled, reviewers are assigned, a last reviewed date exists, required disclaimers remain present, image metadata is valid, finance freshness dates exist where applicable, and expert escalation notes are present for risky topics.

M67 does not add official full content and does not invent finance, fertilizer, crop, loan, or government facts.

## M68 Pilot Draft Safety

M68 adds richer draft content only for the low-risk evergreen soil topic `soil-types-before-planting`.

The draft keeps the general safety disclaimer, avoids exact fertilizer or chemical prescriptions, uses broad examples only, and tells readers to confirm local conditions with an agriculture office or expert when results affect real planting decisions.

The pilot remains blocked from final publishing until review metadata, source placeholders, image needs, and publish-gate blockers are resolved.
