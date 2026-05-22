import { ArrowRight, CheckCircle2, Lock, MessageCircle, RotateCcw, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import {
  clearLineMockSessionFromAdapter,
  completeLineLogin,
  getLineAuthAdapterStatus,
  startLineLogin,
} from '@/services/auth/line-auth-adapter';

export function AuthLinePage() {
  const [message, setMessage] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const lineStatus = getLineAuthAdapterStatus();
  const session = lineStatus.session;

  function handleStart() {
    const result = startLineLogin();
    setMessage(result.message);
  }

  function handleComplete() {
    const result = completeLineLogin();
    setMessage(result.message);
    setRefreshKey((current) => current + 1);
  }

  function handleClear() {
    clearLineMockSessionFromAdapter();
    setMessage('ล้าง LINE mock session แล้ว');
    setRefreshKey((current) => current + 1);
  }

  void refreshKey;

  return (
    <div>
      <PageHeader title="LINE Login จำลอง" subtitle="ยังไม่เชื่อมต่อ LINE จริง" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-[#06C755] text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/15" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-[#06C755]">
                <MessageCircle aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <Badge className="bg-white/15 text-white" tone="green">
                  LINE mock
                </Badge>
                <h2 className="mt-3 text-xl font-extrabold leading-7">เชื่อม LINE เพื่อกลับมาใช้งานง่ายขึ้น</h2>
                <p className="mt-2 text-sm leading-6 text-white/90">
                  LINE เหมาะสำหรับผู้ใช้ที่ติดตามจากกลุ่มหรือช่องทาง LINE แต่เบอร์โทรยังเป็นทางกู้คืนหลักที่แนะนำ
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="info" title="ยังไม่เชื่อมต่อ LINE จริง">
          ปุ่มด้านล่างเป็นการจำลองเท่านั้น ไม่มี LINE SDK ไม่มี redirect ไม่มี OAuth token และไม่มี network request
        </NoticeBox>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <ShieldCheck aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">สถานะ LINE Auth</h2>
                <StatusPill tone={session ? 'success' : 'warning'}>
                  {session ? 'เชื่อมจำลองแล้ว' : lineStatus.modeLabel}
                </StatusPill>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">{lineStatus.readinessLabel}</p>
            </div>
          </div>
        </Card>

        <div className="grid gap-3">
          <Button className="w-full bg-[#06C755] text-white hover:bg-[#05b64d]" onClick={handleStart}>
            <MessageCircle aria-hidden="true" className="h-5 w-5" />
            เริ่ม LINE Login จำลอง
          </Button>
          <Button className="w-full" onClick={handleComplete} variant="soft">
            <CheckCircle2 aria-hidden="true" className="h-5 w-5" />
            สร้าง LINE mock session
          </Button>
        </div>

        {message ? <NoticeBox tone={session ? 'success' : 'info'} title="ผลการทดสอบ">{message}</NoticeBox> : null}

        {session ? (
          <Card className="p-4">
            <div className="flex gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                <MessageCircle aria-hidden="true" className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-extrabold text-kaset-ink">LINE mock session</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">{session.displayName}</p>
                <p className="text-sm leading-6 text-slate-600">หมดอายุ {new Date(session.expiresAt).toLocaleString('th-TH')}</p>
                <p className="mt-1 break-all text-xs leading-5 text-slate-500">{session.mockLineUserId}</p>
                <div className="mt-4 grid gap-2">
                  <Link to="/app/auth/linking">
                    <span className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-kaset-deep px-4 text-sm font-bold text-white transition hover:bg-kaset-ink">
                      ดูกติกาเชื่อมบัญชี
                      <ArrowRight aria-hidden="true" className="h-4 w-4" />
                    </span>
                  </Link>
                  <Link to="/app/auth/sync-preview">
                    <span className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-kaset-mint px-4 text-sm font-bold text-kaset-deep transition hover:bg-emerald-100">
                      ไปหน้า Sync Preview
                      <ArrowRight aria-hidden="true" className="h-4 w-4" />
                    </span>
                  </Link>
                  <Button className="w-full" onClick={handleClear} variant="secondary">
                    <RotateCcw aria-hidden="true" className="h-4 w-4" />
                    ล้าง LINE mock session
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ) : null}

        <NoticeBox tone="warning" icon={Lock} title="กติกาสำคัญ">
          LINE ช่วยให้เข้าถึงง่าย แต่ในระบบจริงควรผูกกับเบอร์โทรหรือบัญชีที่ยืนยันแล้วก่อนซิงก์ Guest Memory
        </NoticeBox>
      </div>
    </div>
  );
}
