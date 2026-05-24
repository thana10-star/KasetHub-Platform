import { BrainCircuit, KeyRound, LockKeyhole, ShieldAlert, ShieldCheck, TimerReset, WifiOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { LargeActionButton } from '@/components/ui/LargeActionButton';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import {
  aiTextBlockedFixtureRequest,
  aiTextCalculatorFixtureRequest,
  aiTextEducationalFixtureRequest,
  aiTextWeatherFixtureRequest,
  summarizeAITextFixtureResponse,
} from '@/services/ai-text/ai-text-fixtures';
import { explainAITextSync, getAITextProxyStatus } from '@/services/ai-text/ai-text-proxy';

const requestTypeLabels = {
  calculator_explanation: 'อธิบายผลคำนวณ',
  weather_caution_explanation: 'อธิบายข้อควรระวังอากาศ',
  educational_explanation: 'อธิบายความรู้ทั่วไป',
} as const;

export function AITextStatusPage() {
  const status = getAITextProxyStatus();
  const fixtureResponses = [
    explainAITextSync(aiTextCalculatorFixtureRequest),
    explainAITextSync(aiTextWeatherFixtureRequest),
    explainAITextSync(aiTextEducationalFixtureRequest),
    explainAITextSync(aiTextBlockedFixtureRequest),
  ];
  const summaries = fixtureResponses.map(summarizeAITextFixtureResponse);

  return (
    <div>
      <PageHeader
        title="สถานะ Real AI Text Proxy"
        subtitle="staging-only proxy boundary สำหรับคำอธิบายสั้น ปลอดภัย และตรวจสอบได้"
        showBack
      />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-indigo-950 text-white">
          <div className="p-5">
            <div className="flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-indigo-950">
                <BrainCircuit aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <StatusPill className="bg-white/15 text-white ring-white/20" tone="warning">
                  M81 staging only
                </StatusPill>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">ยังไม่เปิด AI เต็มรูปแบบ</h2>
                <p className="mt-2 text-sm leading-6 text-indigo-50">
                  ค่าเริ่มต้นยังใช้ local fixture ไม่มี provider key ใน frontend ไม่มี service-role key และไม่มี unrestricted chat
                </p>
              </div>
            </div>
          </div>
        </Card>

        <section className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <WifiOff aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-xs font-bold text-slate-500">Mode</p>
            <p className="mt-1 break-words text-lg font-extrabold text-kaset-ink">{status.mode}</p>
          </Card>
          <Card className="p-4">
            <TimerReset aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-xs font-bold text-slate-500">Network</p>
            <p className="mt-1 text-lg font-extrabold text-kaset-ink">
              {status.canCallNetwork ? 'staging proxy ready' : 'ปิด/ไม่พร้อม'}
            </p>
          </Card>
          <Card className="p-4">
            <KeyRound aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-xs font-bold text-slate-500">Provider key</p>
            <p className="mt-1 text-lg font-extrabold text-kaset-ink">backend only</p>
          </Card>
          <Card className="p-4">
            <LockKeyhole aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-xs font-bold text-slate-500">Calculator output</p>
            <p className="mt-1 text-lg font-extrabold text-kaset-ink">locked</p>
          </Card>
        </section>

        <NoticeBox tone="warning" icon={ShieldAlert} title="Proxy-only reminder">
          Real AI text จะทำงานได้เฉพาะ staging flags ครบและผ่าน backend-owned proxy ในอนาคตเท่านั้น M81 ไม่มี direct provider call จาก frontend และถ้า endpoint ยังไม่มีจะคืน controlled disabled state.
        </NoticeBox>

        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone={status.fallbackToFixture ? 'warning' : 'success'}>
              {status.fallbackToFixture ? 'fallback to fixture' : 'proxy ready'}
            </StatusPill>
            <Badge tone="neutral">realAI {String(status.realAIEnabled)}</Badge>
            <Badge tone="neutral">network {String(status.networkEnabled)}</Badge>
            <Badge tone="green">no provider key</Badge>
            <Badge tone="green">no service-role</Badge>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">{status.statusLabel}</p>
          <p className="mt-2 rounded-lg bg-kaset-mist p-3 text-xs font-bold leading-5 text-kaset-deep">
            audit events: {status.auditPreview.events.join(' · ')}
          </p>
        </Card>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">Allowed request types</h2>
          {status.allowedRequestTypes.map((requestType) => (
            <Card className="p-4" key={requestType}>
              <div className="flex items-center gap-3">
                <ShieldCheck aria-hidden="true" className="h-5 w-5 text-kaset-leaf" />
                <div className="min-w-0">
                  <h3 className="font-extrabold text-kaset-ink">{requestTypeLabels[requestType]}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{requestType}</p>
                </div>
              </div>
            </Card>
          ))}
        </section>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">Blocked unsafe categories</h2>
          {status.blockedActions.map((action) => (
            <Card className="border-rose-100 bg-rose-50 p-4" key={action.id}>
              <h3 className="font-extrabold text-rose-950">{action.label}</h3>
              <p className="mt-1 text-sm leading-6 text-rose-900">{action.reason}</p>
            </Card>
          ))}
        </section>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">Fixture and blocked-state proof</h2>
          {summaries.map((summary) => (
            <Card className="p-4" key={`${summary.requestType}-${summary.status}`}>
              <div className="flex flex-wrap gap-2">
                <Badge tone="neutral">{requestTypeLabels[summary.requestType]}</Badge>
                <StatusPill tone={summary.status === 'blocked' ? 'danger' : 'success'}>{summary.status}</StatusPill>
                <Badge tone="green">network {String(summary.networkAttempted)}</Badge>
                <Badge tone="green">immutable {String(summary.immutableOutputPreserved)}</Badge>
              </div>
            </Card>
          ))}
        </section>

        <section className="grid gap-3 md:grid-cols-2">
          <Card className="p-4">
            <h2 className="font-extrabold text-kaset-ink">Audit preview</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              policy {status.auditPreview.policyVersion} · wouldWriteAuditLog {String(status.auditPreview.wouldWriteAuditLog)} · noSupabaseWrite {String(status.auditPreview.noSupabaseWrite)}
            </p>
          </Card>
          <Card className="p-4">
            <h2 className="font-extrabold text-kaset-ink">Rate-limit preview</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              daily {status.rateLimitPreview.dailyLimit} · cooldown {status.rateLimitPreview.cooldownSeconds}s · wouldWriteRateLimit {String(status.rateLimitPreview.wouldWriteRateLimit)}
            </p>
          </Card>
        </section>

        <div className="grid gap-2 sm:grid-cols-3">
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white" to="/app/calculators/ai-explanation-preview">
            Calculator AI preview
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-kaset-mist px-4 text-sm font-extrabold text-kaset-deep" to="/app/weather/risk-rules">
            Weather risk rules
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/qa">
            QA
          </Link>
        </div>

        <LargeActionButton
          icon={ShieldCheck}
          label="กลับไป Admin Dashboard"
          description="ดูสถานะ staging, QA และ production blockers รวม"
          to="/app/admin"
          variant="white"
        />
      </div>
    </div>
  );
}
