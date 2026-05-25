# SMS Provider Cost And Rate Limit Notes

M28 keeps SMS disabled. These notes prepare the first controlled phone OTP staging test.

## Cost Risks

- Every real OTP SMS can cost money.
- Repeated resend taps can create unexpected spend.
- Attackers can trigger SMS costs if rate limits are weak.
- International numbers can cost more and should be blocked unless intentionally supported.

## Provider Setup Considerations

- Choose a provider supported by Supabase Auth for the target country.
- Keep provider secrets only in Supabase dashboard or backend secret storage.
- Never expose provider secrets or service-role keys in frontend code.
- Configure sender ID, country policy, and spending limits.
- Confirm Thai mobile number delivery in staging before production.

## Rate Limit Policy

Minimum staging rules:

- resend cooldown
- max OTP requests per phone number per hour
- max OTP verification attempts per code
- temporary lockout after repeated failures
- IP/device rate limits if available
- logging for abuse review

## Test Phone Number Plan

- Keep test numbers out of git.
- Use a small allowlist for staging.
- Label test numbers with owner and purpose in a private tracker.
- Remove stale numbers after testing.
- Do not use real farmer phone numbers during early staging.

## Thai UX Copy

- "รอสักครู่ก่อนขอรหัสใหม่"
- "ส่งรหัสหลายครั้งอาจมีค่าใช้จ่ายกับระบบ"
- "หากไม่ได้รับรหัส โปรดตรวจเบอร์โทรอีกครั้ง"
- "ยังไม่สำรองข้อมูลจนกว่าจะยืนยันบัญชีสำเร็จ"

## Production Blockers

- No spending limit.
- No resend cooldown.
- No failed-attempt lockout.
- No staging delivery test.
- No user support path for missing SMS.
- No account recovery/deletion policy.

## M61 SMS Review

M61 treats SMS provider setup as a blocker for real OTP because no provider is configured in the app and no SMS should be sent automatically.

Before a future staging OTP test:

- provider secret must be stored only in Supabase/Auth settings
- spending limit must be active
- resend cooldown must be active
- max attempts and lockout must be active
- test phone numbers must stay outside git
- the team must record SMS cost after the test
## M62 Controlled OTP Cost Guardrails

M62 may call Supabase Phone OTP only in local staging mode. Before any real OTP:

- set SMS spending limit
- set resend cooldown
- set max request attempts
- set max verification attempts
- test only approved internal phone numbers
- stop and roll back if duplicate SMS or unexpected cost appears

The app displays `ทดสอบเฉพาะเบอร์ภายในเท่านั้น` near the OTP request path.
