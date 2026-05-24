# M62 Phone Auth Test Number Runbook

This runbook keeps the first real OTP test small and accountable.

## Test Number Rules

- Store test phone numbers outside the repository.
- Use only internal numbers with owner consent.
- Start with 1-2 test numbers.
- Do not paste full phone numbers into reports, screenshots, or logs.
- Use masked display such as `081-xxx-7890`.

## SMS Cost Guardrails

- Set Supabase/Auth provider resend cooldown.
- Set max OTP request attempts.
- Set max verification attempts.
- Set SMS spending limit.
- Record each OTP attempt manually.
- Stop immediately if delivery loops, duplicate SMS, or unexpected cost appears.

## Test Log Fields

Keep the real log outside git:

- date/time
- tester
- masked phone number
- provider status
- OTP requested: yes/no
- OTP delivered: yes/no
- redirect result
- Supabase session result
- rollback result
- SMS cost estimate

## Stop Conditions

Stop and roll back if:

- SMS sends to a non-test number
- cost exceeds the agreed limit
- OTP verification creates an unexpected session
- cloud sync is accidentally enabled
- service-role key appears in frontend env
