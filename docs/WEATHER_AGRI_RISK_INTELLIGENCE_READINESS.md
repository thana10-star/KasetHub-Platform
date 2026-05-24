# Weather Agriculture Risk Intelligence Readiness

M78 adds a local-only agriculture weather risk readiness layer for KasetHub weather.

The goal is to help farmers notice general weather concerns before field work while keeping the feature clearly non-prescriptive until expert-reviewed agronomy rules exist.

## Scope

- No AI API call.
- No expert-reviewed agronomy engine.
- No GPS or browser geolocation.
- No precise farm coordinate storage.
- No Supabase write.
- No backend write.
- No push notification.
- No product, sponsor, or affiliate recommendation.

## Risk Categories

M78 defines six planning-only categories:

- `spraying_risk`
- `irrigation_timing`
- `disease_pressure`
- `heat_stress`
- `field_work_risk`
- `harvest_drying_risk`

Risk levels are:

- `low`
- `watch`
- `caution`
- `high`

## Local Assessment

`assessWeatherAgriRisk()` reads the weather adapter/cache result and returns general risk cards.

The output is deterministic and local-only. It does not create crop-specific prescriptions, chemical rates, fertilizer doses, legal thresholds, or guaranteed outcomes.

## Required UI Boundary

Weather risk cards must show:

- `คำแนะนำเบื้องต้น ไม่แทนผู้เชี่ยวชาญ`
- planning-only / not expert-reviewed copy
- weather forecast uncertainty
- label-first warning for chemical-related work

The app must continue to work with local weather fixture data when Open-Meteo is disabled.

## M79 Expert Review Readiness

M79 adds local rule versions, source placeholders, pending reviewer sign-offs, false-positive examples, false-negative examples, and expert approval gates.

Every rule remains `planning_only` and `prescriptiveAllowed: false`.
