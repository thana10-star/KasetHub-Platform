# M104 Owner Commands And Links

## Purpose

This page gives the owner a compact command and link checklist for M104 production verification. Run local commands from the repository root.

Do not paste or commit real secrets into the repo.

## Local Verification Commands

```powershell
git status --short
git log --oneline --decorate -5
npm run lint
npm run build
npm run test
git diff --check
```

Expected result:

- working tree is clean or contains only known release/generated files
- lint passes
- build passes
- tests pass
- diff check has no whitespace errors
- no `.env`, `.env.local`, secret, token, or provider key is staged

## Cloudflare Weather Env Values

Copy these into Cloudflare Pages production environment variables:

```text
VITE_WEATHER_MODE=open_meteo_ready
VITE_ENABLE_REAL_WEATHER_API=true
VITE_WEATHER_DEFAULT_LAT=13.7563
VITE_WEATHER_DEFAULT_LON=100.5018
VITE_WEATHER_DEFAULT_LABEL=กรุงเทพฯ
```

Notes:

- Open-Meteo does not need an API key for the current V1 path.
- Do not put paid provider secrets in frontend `VITE_` variables.
- Use coarse city/province-center coordinates, not an exact farm or home coordinate.

## Production Links To Record

- GitHub main commit:
- Cloudflare production deploy:
- Production URL:
- Preview URL, if any:
- Privacy policy URL:
- Support contact:

## Routes To Open

Open these on production desktop and a real phone:

- `/app`
- `/app/ai`
- `/app/weather`
- `/app/calculators`
- `/app/my-farm`
- `/app/farm-records`
- `/app/help`
- `/app/profile`

## Route Smoke Notes

For each route confirm:

- loads
- no blank screen
- no horizontal scroll on phone
- Thai text is readable
- bottom nav is usable
- no obvious debug/dev/prototype wording in primary farmer UI
- no unexpected GPS, camera, upload, notification, login, payment, or cloud sync prompt

## Related M104 Docs

- `docs/release/OWNER_PRODUCTION_VERIFICATION_WORKSHEET_M104.md`
- `docs/release/RELEASE_SCREENSHOT_CAPTURE_WORKSHEET_M104.md`
- `docs/release/V1_RELEASE_BLOCKER_LOG_M104.md`

