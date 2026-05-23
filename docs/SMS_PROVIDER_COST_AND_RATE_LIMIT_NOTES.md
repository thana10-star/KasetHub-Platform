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
