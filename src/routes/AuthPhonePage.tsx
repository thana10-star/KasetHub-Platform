import { CheckCircle2, ClipboardList, Lock, MessageSquareText, Phone, RotateCcw, ShieldCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import {
  clearPhoneMockSession,
  getPhoneAuthAdapterStatus,
  requestPhoneOtp,
  verifyPhoneOtp,
} from '@/services/auth/phone-auth-adapter';
import { runPhoneAuthStagingReview } from '@/services/auth/phone-auth-staging-review';
import { validateThaiPhoneNumber } from '@/services/auth/phone-auth-local-mock';
import type { PhoneAuthActionResult } from '@/services/auth/phone-auth.types';

export function AuthPhonePage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);
  const [message, setMessage] = useState<PhoneAuthActionResult | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const phoneStatus = getPhoneAuthAdapterStatus();
  const m61Review = useMemo(() => runPhoneAuthStagingReview(), []);
  const validation = useMemo(() => validateThaiPhoneNumber(phoneNumber), [phoneNumber]);
  const session = phoneStatus.session;

  function refresh() {
    setRefreshKey((current) => current + 1);
  }

  function handleRequestOtp() {
    const result = requestPhoneOtp(phoneNumber);
    setMessage(result);
    setOtpRequested(result.success);
  }

  function handleVerifyOtp() {
    const result = verifyPhoneOtp(phoneNumber, otp);
    setMessage(result);
    refresh();
  }

  function handleClearSession() {
    clearPhoneMockSession();
    setMessage({
      success: true,
      message: 'ล้าง session จำลองแล้ว ยังใช้งานแบบ Guest ได้ตามเดิม',
    });
    setOtp('');
    setOtpRequested(false);
    refresh();
  }

  void refreshKey;

  return (
    <div>
      <PageHeader title="สมัครด้วยเบอร์โทร" subtitle="Phone OTP mock เท่านั้น ยังไม่ส่ง SMS จริง" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <Phone aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <StatusPill className="bg-white/15 text-white ring-white/20" tone="success">
                  แนะนำ
                </StatusPill>
                <h2 className="mt-3 text-xl font-extrabold leading-7">เบอร์โทรเหมาะสำหรับผู้ใช้ทั่วไป</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  ไม่ต้องใช้อีเมล ตอนนี้เป็นตัวอย่าง OTP เท่านั้น เพื่อพิสูจน์ว่าอนาคตต้องยืนยันเจ้าของบัญชีก่อนซิงก์ข้อมูล
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="warning" title="รหัสทดสอบคือ 123456">
          ยังไม่ส่ง OTP จริง ไม่มี SMS ไม่มี Supabase Auth และไม่มี network request ในเวอร์ชันนี้
        </NoticeBox>

        <NoticeBox tone="info" icon={ClipboardList} title="Real Phone OTP ต้องผ่าน staging checklist ก่อน">
          ตอนนี้ยังเป็น local mock เท่านั้น การส่ง OTP จริงด้วย Supabase Auth ต้องตั้งค่า staging, SMS provider, redirect URL, rate limit และ session ownership ก่อน
          <Link className="mt-3 inline-flex font-bold text-kaset-deep" to="/app/auth/phone-staging">
            เปิด Phone OTP staging checklist
          </Link>
        </NoticeBox>

        <NoticeBox tone="warning" icon={ShieldCheck} title="M61 staging test review">
          {m61Review.levelLabel} · current mode {m61Review.flags.phoneAuthMode} · ยังไม่ส่ง OTP จริง และ Guest Memory sync ต้องรอ owner จาก Supabase session จริงก่อน
          <Link className="mt-3 inline-flex font-bold text-kaset-deep" to="/app/auth/phone-staging-test">
            เปิด Phone Auth staging test plan
          </Link>
        </NoticeBox>

        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-extrabold text-kaset-ink">สถานะ Phone Auth</h2>
            <StatusPill tone={phoneStatus.canUseLocalMock ? 'success' : 'warning'}>{phoneStatus.modeLabel}</StatusPill>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{phoneStatus.readinessLabel}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            phone auth flag: {phoneStatus.phoneAuthEnabled ? 'เปิด' : 'ปิด'} · local mock:{' '}
            {phoneStatus.localMockEnabled ? 'เปิด' : 'ปิด'} · network: ปิด
          </p>
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
            ส่งรหัส OTP จำลอง
          </Button>
          {otpRequested ? (
            <Button className="mt-3 w-full" onClick={handleRequestOtp} variant="secondary">
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
              ส่งรหัสจำลองอีกครั้ง
            </Button>
          ) : null}
        </Card>

        <Card className="p-4">
          <label className="text-sm font-extrabold text-kaset-ink" htmlFor="otp-code">
            รหัส OTP จำลอง
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
          <p className="mt-2 text-sm leading-6 text-slate-500">ใช้รหัส 123456 สำหรับทดสอบเท่านั้น</p>
          <Button className="mt-4 w-full" onClick={handleVerifyOtp}>
            <ShieldCheck aria-hidden="true" className="h-4 w-4" />
            ยืนยันเบอร์โทรจำลอง
          </Button>
        </Card>

        {message ? (
          <NoticeBox tone={message.success ? 'success' : 'danger'} title={message.success ? 'สำเร็จ' : 'ยังดำเนินการไม่ได้'}>
            {message.message}
          </NoticeBox>
        ) : null}

        {session ? (
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
                  {session.phoneNumberMasked} · หมดอายุ {new Date(session.expiresAt).toLocaleString('th-TH')}
                </p>
                <p className="mt-1 break-all text-xs leading-5 text-slate-500">{session.mockUserId}</p>
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
              Session นี้ใช้ทดสอบ ownership gate เท่านั้น ยังไม่ใช่บัญชีจริง ไม่ได้ผูก Supabase และไม่สามารถซิงก์ cloud จริง
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
