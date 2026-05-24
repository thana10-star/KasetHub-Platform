import { CheckCircle2, ClipboardList, Lock, MessageSquareText, Phone, RotateCcw, ShieldCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import {
  clearPhoneAuthStagingSessions,
  getPhoneAuthStagingAdapterStatus,
  requestPhoneAuthStagingOtp,
  verifyPhoneAuthStagingOtp,
} from '@/services/auth/phone-auth-staging-adapter';
import { runPhoneAuthStagingReview } from '@/services/auth/phone-auth-staging-review';
import { validateThaiPhoneNumber } from '@/services/auth/phone-auth-local-mock';
import type { PhoneAuthStagingActionResult } from '@/services/auth/phone-auth-staging-adapter.types';

export function AuthPhonePage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);
  const [message, setMessage] = useState<PhoneAuthStagingActionResult | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const phoneStatus = getPhoneAuthStagingAdapterStatus();
  const m61Review = useMemo(() => runPhoneAuthStagingReview(), []);
  const validation = useMemo(() => validateThaiPhoneNumber(phoneNumber), [phoneNumber]);
  const localSession = phoneStatus.localMockSession;
  const supabaseSession = phoneStatus.supabaseSessionPreview;

  function refresh() {
    setRefreshKey((current) => current + 1);
  }

  async function handleRequestOtp() {
    const result = await requestPhoneAuthStagingOtp(phoneNumber);
    setMessage(result);
    setOtpRequested(result.success);
    refresh();
  }

  async function handleVerifyOtp() {
    const result = await verifyPhoneAuthStagingOtp(phoneNumber, otp);
    setMessage(result);
    refresh();
  }

  function handleClearSession() {
    clearPhoneAuthStagingSessions();
    setMessage({
      status: 'success',
      success: true,
      message: 'ล้าง session staging/local preview แล้ว ยังใช้งานแบบ Guest ได้ตามเดิม',
    });
    setOtp('');
    setOtpRequested(false);
    refresh();
  }

  void refreshKey;

  return (
    <div>
      <PageHeader title="สมัครด้วยเบอร์โทร" subtitle="M62 controlled Phone Auth staging boundary" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <Phone aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <StatusPill className="bg-white/15 text-white ring-white/20" tone={phoneStatus.canAttemptSupabaseOtp ? 'warning' : 'success'}>
                  {phoneStatus.canAttemptSupabaseOtp ? 'staging OTP' : 'local mock'}
                </StatusPill>
                <h2 className="mt-3 text-xl font-extrabold leading-7">ทดสอบ Phone Auth แบบปลอดภัยก่อนเปิดจริง</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  ค่าเริ่มต้นยังเป็น local mock ถ้าเปิด staging flags ครบจึงจะส่ง OTP ผ่าน Supabase Auth ได้ เฉพาะเบอร์ทดสอบภายในเท่านั้น
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone={phoneStatus.canAttemptSupabaseOtp ? 'warning' : 'info'} title="ทดสอบเฉพาะเบอร์ภายในเท่านั้น">
          {phoneStatus.canAttemptSupabaseOtp
            ? 'โหมด staging พร้อมส่ง OTP จริงผ่าน Supabase Auth เฉพาะเมื่อเปิด local flags ครบแล้ว อย่าเก็บ OTP ใน log และอย่าเปิด cloud sync'
            : 'ค่าเริ่มต้นยังเป็น local mock ใช้รหัส 123456 ไม่มี SMS จริง ไม่มี cloud sync และไม่มี app table write'}
        </NoticeBox>

        <NoticeBox tone="info" icon={ClipboardList} title="Real Phone OTP ต้องผ่าน staging checklist ก่อน">
          ตรวจ Supabase staging project, redirect URL, SMS provider, rate limit, test number, rollback และ ownership ก่อนส่ง OTP จริง
          <div className="mt-3 flex flex-wrap gap-3">
            <Link className="inline-flex font-bold text-kaset-deep" to="/app/auth/phone-staging">
              เปิด Phone OTP staging checklist
            </Link>
            <Link className="inline-flex font-bold text-kaset-deep" to="/app/auth/phone-staging-test">
              เปิด Phone Auth staging test plan
            </Link>
          </div>
        </NoticeBox>

        <NoticeBox tone="warning" icon={ShieldCheck} title="M61 staging test review">
          {m61Review.levelLabel} · current mode {m61Review.flags.phoneAuthMode} · Guest Memory sync ต้องรอ owner จาก Supabase session จริงก่อน
        </NoticeBox>

        <NoticeBox tone={phoneStatus.canAttemptSupabaseOtp ? 'warning' : 'info'} icon={ShieldCheck} title="M62 staging mode status">
          {phoneStatus.statusLabel} · redirect: {phoneStatus.redirectUrlPreview} · OTP readiness:{' '}
          {phoneStatus.canAttemptSupabaseOtp ? 'พร้อมเฉพาะ staging flags' : 'ยังไม่เปิด real OTP'} · no cloud sync:{' '}
          {String(phoneStatus.noCloudSync)}
        </NoticeBox>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <Phone aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">Staging adapter status</h2>
                <StatusPill tone={phoneStatus.canRequestOtp ? 'success' : 'warning'}>{phoneStatus.modeLabel}</StatusPill>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{phoneStatus.statusLabel}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                phone flag: {phoneStatus.phoneAuthEnabled ? 'เปิด' : 'ปิด'} · network:{' '}
                {phoneStatus.networkCallsEnabled ? 'เปิดเฉพาะ staging' : 'ปิด'} · cloud sync:{' '}
                {phoneStatus.cloudSyncEnabled ? 'เปิด (block)' : 'ปิด'}
              </p>
              {phoneStatus.disabledReasons.length > 0 ? (
                <ul className="mt-3 grid gap-1 rounded-lg bg-amber-50 p-3 text-xs font-bold leading-5 text-amber-900">
                  {phoneStatus.disabledReasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <label className="text-sm font-extrabold text-kaset-ink" htmlFor="phone-number">
            เบอร์โทรศัพท์มือถือ
          </label>
          <input
            className="mt-2 kh-form-control w-full border border-kaset-deep/10 bg-white px-4 font-semibold text-kaset-ink outline-none ring-0 transition placeholder:text-slate-400 focus:border-kaset-leaf focus:ring-2 focus:ring-kaset-leaf/20"
            id="phone-number"
            inputMode="tel"
            onChange={(event) => setPhoneNumber(event.target.value)}
            placeholder="เช่น 0812345678"
            type="tel"
            value={phoneNumber}
          />
          {phoneNumber ? (
            <p className={`mt-2 text-sm leading-6 ${validation.isValid ? 'text-kaset-deep' : 'text-rose-700'}`}>
              {validation.message}
            </p>
          ) : (
            <p className="mt-2 text-sm leading-6 text-slate-500">ใส่เบอร์มือถือไทย 10 หลัก เช่น 0812345678</p>
          )}
          <Button className="mt-4 w-full" onClick={handleRequestOtp}>
            <MessageSquareText aria-hidden="true" className="h-4 w-4" />
            {phoneStatus.canAttemptSupabaseOtp ? 'ส่ง OTP staging จริง' : 'ส่งรหัส OTP จำลอง'}
          </Button>
          {otpRequested ? (
            <Button className="mt-3 w-full" onClick={handleRequestOtp} variant="secondary">
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
              {phoneStatus.canAttemptSupabaseOtp ? 'ส่ง OTP staging อีกครั้ง' : 'ส่งรหัสจำลองอีกครั้ง'}
            </Button>
          ) : null}
        </Card>

        <Card className="p-4">
          <label className="text-sm font-extrabold text-kaset-ink" htmlFor="otp-code">
            รหัส OTP
          </label>
          <input
            className="mt-2 h-14 w-full rounded-lg border border-kaset-deep/10 bg-white px-4 text-center text-xl font-extrabold tracking-[0.35em] text-kaset-ink outline-none transition placeholder:tracking-normal placeholder:text-slate-400 focus:border-kaset-leaf focus:ring-2 focus:ring-kaset-leaf/20"
            id="otp-code"
            inputMode="numeric"
            maxLength={6}
            onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="123456"
            type="text"
            value={otp}
          />
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {phoneStatus.canAttemptSupabaseOtp ? 'ใส่ OTP จาก SMS staging เฉพาะเบอร์ทดสอบภายใน' : 'ใช้รหัส 123456 สำหรับ local mock'}
          </p>
          <Button className="mt-4 w-full" onClick={handleVerifyOtp}>
            <ShieldCheck aria-hidden="true" className="h-4 w-4" />
            {phoneStatus.canAttemptSupabaseOtp ? 'ยืนยัน OTP staging' : 'ยืนยันเบอร์โทรจำลอง'}
          </Button>
        </Card>

        {message ? (
          <NoticeBox tone={message.success ? 'success' : message.status === 'disabled' ? 'warning' : 'danger'} title={message.success ? 'สำเร็จ' : 'ยังดำเนินการไม่ได้'}>
            {message.message}
          </NoticeBox>
        ) : null}

        {supabaseSession ? (
          <Card className="p-4">
            <div className="flex gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                <CheckCircle2 aria-hidden="true" className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-extrabold text-kaset-ink">พบ Supabase Phone Auth staging session</h2>
                  <StatusPill tone="success">staging session</StatusPill>
                </div>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {supabaseSession.phoneNumberMasked} · user {supabaseSession.userIdMasked}
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  access token present: {String(supabaseSession.accessTokenPresent)} · refresh token present:{' '}
                  {String(supabaseSession.refreshTokenPresent)}
                </p>
                <NoticeBox tone="warning" title="ยังไม่ sync Guest Memory">
                  M62 พิสูจน์ session ได้เท่านั้น ยังไม่เขียน profile/app tables และยังไม่ upload ข้อมูล local
                </NoticeBox>
                <Button className="mt-4 w-full" onClick={handleClearSession} variant="secondary">
                  ล้าง staging session preview
                </Button>
              </div>
            </div>
          </Card>
        ) : null}

        {localSession ? (
          <Card className="p-4">
            <div className="flex gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                <CheckCircle2 aria-hidden="true" className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-extrabold text-kaset-ink">ยืนยันเบอร์จำลองแล้ว</h2>
                  <StatusPill tone="success">phone mock</StatusPill>
                </div>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {localSession.phoneNumberMasked} · หมดอายุ {new Date(localSession.expiresAt).toLocaleString('th-TH')}
                </p>
                <p className="mt-1 break-all text-xs leading-5 text-slate-500">{localSession.mockUserId}</p>
                <div className="mt-4 grid gap-2">
                  <Link to="/app/auth/sync-preview">
                    <span className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-bold text-white transition hover:bg-kaset-ink">
                      ไปทดสอบสำรองข้อมูล
                    </span>
                  </Link>
                  <Button className="w-full" onClick={handleClearSession} variant="secondary">
                    ล้าง session จำลอง
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ) : null}

        <Card className="border-amber-200 bg-amber-50 p-4">
          <div className="flex gap-3">
            <Lock aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-amber-800" />
            <p className="text-sm leading-6 text-amber-900">
              Phone Auth staging ใช้พิสูจน์ session เท่านั้น ยังไม่เปิด cloud sync ไม่เขียนตาราง app และ service-role key ต้องไม่อยู่ใน frontend
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
