# AI Secret Leak Checklist M146

Status: repository and production secret-leak checklist only. This document contains variable names and placeholder patterns, not real provider keys.

## Purpose

Before and after configuring the Cloudflare `GEMINI_API_KEY` secret, confirm no provider secret enters the repository, frontend bundle, browser, API responses, or commit history.

## Repository Pre-Commit Checks

Run from the project root:

```powershell
git status --short
```

Expected:

- Only intentional M146 docs/report changes should appear.
- `CONTEXT.md` may appear as untracked local context, but it must not be modified or committed.
- `graphify-out/`, `dist/`, `node_modules/.vite/`, and `*.tsbuildinfo` must not be committed.

Check staged files:

```powershell
git diff --cached --name-only
```

Expected:

- Only intended milestone files are staged.
- No `.env`, `.env.*`, `.dev.vars`, generated files, or Graphify files.

Check staged content for secret names and key-like values:

```powershell
git diff --cached | findstr /i "GEMINI_API_KEY VITE_GEMINI_API_KEY VITE_OPENAI_API_KEY VITE_AI_PROVIDER_SECRET AIza sk-"
```

Interpretation:

- Seeing variable names in checklist/docs can be acceptable.
- Seeing any real key-like value is not acceptable.
- Seeing a frontend provider key assignment is not acceptable.
- Seeing `AIza` or `sk-` in anything other than explicit negative test/checklist patterns is not acceptable.

## Working Tree Scan

Use this before staging:

```powershell
rg -n "AIza|sk-[A-Za-z0-9_-]{10,}|VITE_GEMINI_API_KEY\s*=|VITE_OPENAI_API_KEY\s*=|VITE_AI_PROVIDER_SECRET\s*=|GEMINI_API_KEY\s*=" .
```

Expected:

- No real key values.
- No frontend provider key assignments.
- Placeholder and checklist references only.

## Generated Bundle Scan

After `npm run build`, scan generated output before restoring generated files:

```powershell
if (Test-Path dist) {
  rg -n "AIza|sk-[A-Za-z0-9_-]{10,}|GEMINI_API_KEY|VITE_GEMINI_API_KEY|VITE_OPENAI_API_KEY|VITE_AI_PROVIDER_SECRET" dist
}
```

Expected:

- No real key values.
- No provider secret values in built frontend assets.
- If docs are ever deployed as static assets in a future setup, variable-name references can be acceptable only when they are clearly documentation placeholders.

Restore generated/cache files after build if they changed:

```powershell
git restore -- dist/index.html tsconfig.app.tsbuildinfo
```

## Cloudflare-Only Checks

Inspect Cloudflare only, not the repo:

- `GEMINI_API_KEY` is an encrypted secret only.
- The real value is not visible after saving.
- The secret is not duplicated as a plaintext variable.
- The secret is not under a `VITE_` prefix.
- `AI_LIVE_ENABLED=false`.
- `AI_PROVIDER=gemini`.
- `VITE_AI_BACKEND_CONTRACT_ENABLED=true` only if owner wants frontend contract mode.

Do not copy the real key out of Cloudflare into any local file.

## Browser And Network Checks

Open production:

```text
https://kasethub.pages.dev/app
https://kasethub.pages.dev/app/ai
```

Check:

- page source does not contain provider secrets
- browser network responses do not contain provider secrets
- `/api/ai/farmer-assistant` responses do not contain provider secrets
- visible UI does not show `GEMINI_API_KEY`, key-like values, model IDs, stack traces, or provider internals
- normal AI response remains dry-run/mock or not-configured
- high-risk AI response remains blocked/high-risk

## Commit History Check

Before pushing a branch that touched AI secret docs or env guidance:

```powershell
git log --all --stat -- .env .env.* .dev.vars docs reports functions src
```

Then search recent history if there is any concern:

```powershell
git log --all -p -- docs reports functions src | findstr /i "AIza sk- GEMINI_API_KEY VITE_GEMINI_API_KEY VITE_OPENAI_API_KEY VITE_AI_PROVIDER_SECRET"
```

Expected:

- Variable names in docs may appear.
- No real key values.
- No frontend provider key assignment.

If a real key ever appears in history, stop immediately. Rotate the key and ask the owner before continuing.

