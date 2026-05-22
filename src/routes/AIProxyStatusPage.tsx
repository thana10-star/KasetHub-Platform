import { CheckCircle2, KeyRound, Route, Server, ShieldAlert, ToggleLeft, WifiOff } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAICredits } from '@/hooks/useAICredits';
import { getAIProxyAdapterStatus, getAIProxyMode } from '@/services/ai-proxy/ai-proxy-adapter';
import {
  analyzePlantImageViaBackendTest,
  askTextQuestionViaBackendTest,
} from '@/services/ai-proxy/ai-proxy-backend-test-client';
import type { AIPlantImageProxyResponse, AITextProxyResponse } from '@/services/ai-proxy/ai-proxy.types';
import type { AICreditSummary } from '@/services/ai-credits/ai-credit.types';

const requestTypeLabels: Record<string, string> = {
  normal_text_question: 'คำถามทั่วไป',
  risky_or_complex_question: 'คำถามซับซ้อน/เสี่ยง',
  plant_image_analysis: 'วิเคราะห์รูปพืช',
  video_summary: 'สรุปวิดีโอ',
  article_summary: 'สรุปบทความ',
  price_explanation: 'อธิบายราคาพืชผล',
};

export function AIProxyStatusPage() {
  const status = getAIProxyAdapterStatus();
  const { summary } = useAICredits();
  const [testResponse, setTestResponse] = useState<AITextProxyResponse | AIPlantImageProxyResponse | null>(null);
  const mode = getAIProxyMode();
  const zeroCreditSummary: AICreditSummary = {
    ...summary,
    dailyFreeRemaining: 0,
    rewardedCredits: 0,
    proCredits: 0,
    totalAvailable: 0,
    canAsk: false,
  };

  function runTextSuccessTest() {
    setTestResponse(
      askTextQuestionViaBackendTest(
        {
          question: 'ใบข้าวมีจุดสีน้ำตาลหลังฝนตก ควรตรวจอะไรบ้าง',
          creditSummary: summary,
          scenario: 'success',
        },
        mode,
      ),
    );
  }

  function runInsufficientCreditTest() {
    setTestResponse(
      askTextQuestionViaBackendTest(
        {
          question: 'ช่วยวิเคราะห์โรคพืชแบบละเอียด',
          creditSummary: zeroCreditSummary,
          scenario: 'success',
        },
        mode,
      ),
    );
  }

  function runPlantImageTest() {
    setTestResponse(
      analyzePlantImageViaBackendTest(
        {
          creditSummary: summary,
          fileName: 'rice-leaf-sample.jpg',
          fileSize: 1200000,
          fileType: 'image/jpeg',
          scenario: 'success',
        },
        mode,
      ),
    );
  }

  function runRetryableFailureTest() {
    setTestResponse(
      askTextQuestionViaBackendTest(
        {
          question: 'จำลอง backend ขัดข้องชั่วคราว',
          creditSummary: summary,
          scenario: 'failed_retryable',
        },
        mode,
      ),
    );
  }

  return (
    <div>
      <PageHeader title="สถานะ AI Proxy" subtitle="ตัวกลางระหว่าง local fixture กับ backend ในอนาคต" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <Server aria-hidden="true" className="h-7 w-7" />
              </span>
              <div>
                <Badge className="bg-white/15 text-white" tone="green">
                  M13 Adapter
                </Badge>
                <h2 className="mt-3 text-xl font-extrabold">{status.modeLabel}</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">{status.readinessLabel}</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <ToggleLeft aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-xs font-semibold text-slate-500">Backend proxy</p>
            <p className="mt-1 text-lg font-extrabold text-kaset-ink">{status.backendProxyEnabled ? 'เปิด flag' : 'ปิดอยู่'}</p>
          </Card>
          <Card className="p-4">
            <Server aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-xs font-semibold text-slate-500">Local handler</p>
            <p className="mt-1 text-lg font-extrabold text-kaset-ink">{status.localBackendHandlerEnabled ? 'เปิด flag' : 'ปิดอยู่'}</p>
          </Card>
          <Card className="p-4">
            <KeyRound aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-xs font-semibold text-slate-500">Provider keys</p>
            <p className="mt-1 text-lg font-extrabold text-kaset-ink">ไม่มีใน frontend</p>
          </Card>
          <Card className="p-4">
            <WifiOff aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-xs font-semibold text-slate-500">Network</p>
            <p className="mt-1 text-lg font-extrabold text-kaset-ink">{status.networkCallsEnabled ? 'เปิด' : 'ไม่เรียก'}</p>
          </Card>
        </div>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <WifiOff aria-hidden="true" className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-extrabold text-kaset-ink">Environment readiness</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {status.canAttemptBackend
                  ? status.canUseLocalBackendHandler
                    ? 'พร้อมทดสอบ local backend handler แบบ in-process โดยไม่มี fetch'
                    : 'backend_test_ready แล้ว แต่ยังไม่เปิด local handler ครบทุก flag'
                  : 'ค่าเริ่มต้นใช้ local fixture และไม่ส่ง request ออกนอกเครื่อง'}
              </p>
              <p className="mt-2 rounded-lg bg-kaset-mist p-3 text-xs font-bold text-kaset-deep">
                Adapter path: {status.currentAdapterPath}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Server aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <h2 className="font-extrabold text-kaset-ink">ทดสอบ backend boundary จำลอง</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            ปุ่มนี้เรียก client boundary ในเครื่องเท่านั้น ถ้า flag ยังไม่ครบจะได้ disabled response แบบปลอดภัย
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button onClick={runTextSuccessTest} variant="soft">
              text success
            </Button>
            <Button onClick={runInsufficientCreditTest} variant="soft">
              insufficient credit
            </Button>
            <Button onClick={runPlantImageTest} variant="soft">
              plant image dry-run
            </Button>
            <Button onClick={runRetryableFailureTest} variant="soft">
              failed retryable
            </Button>
          </div>
          {testResponse ? (
            <div className="mt-4 rounded-lg bg-slate-950 p-4 text-xs leading-5 text-slate-100">
              <p className="font-bold text-emerald-200">response preview</p>
              <p className="mt-2 break-all">requestId: {testResponse.requestId}</p>
              <p>status: {testResponse.status}</p>
              <p>requestType: {testResponse.requestType}</p>
              <p>creditCost: {testResponse.creditCost}</p>
              <p>creditValidation: {testResponse.creditValidation.message}</p>
              <p>endpoint: {testResponse.logsPreview.endpoint}</p>
              <p>networkCalls: {testResponse.logsPreview.networkCalls ? 'true' : 'false'}</p>
              {'answer' in testResponse && testResponse.answer ? <p>answer: {testResponse.answer.title}</p> : null}
              {'result' in testResponse && testResponse.result ? <p>result: {testResponse.result.diseaseName}</p> : null}
              <p>warnings: {testResponse.warnings.slice(0, 2).join(' | ') || '-'}</p>
            </div>
          ) : null}
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Route aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <h2 className="font-extrabold text-kaset-ink">ประเภทคำขอที่รองรับ</h2>
          </div>
          <div className="mt-3 grid gap-2">
            {status.supportedRequestTypes.map((requestType) => (
              <div className="flex items-center gap-2 rounded-lg bg-kaset-mist p-3" key={requestType}>
                <CheckCircle2 aria-hidden="true" className="h-4 w-4 shrink-0 text-kaset-leaf" />
                <span className="text-sm font-bold text-kaset-ink">{requestTypeLabels[requestType] || requestType}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="font-extrabold text-kaset-ink">สถานะ local fixture ล่าสุด</h2>
          {status.lastLocalFixtureStatus ? (
            <div className="mt-3 rounded-lg bg-kaset-mist p-3 text-sm leading-6 text-slate-700">
              <p className="break-all font-bold text-kaset-ink">{status.lastLocalFixtureStatus.requestId}</p>
              <p>สถานะ: {status.lastLocalFixtureStatus.status}</p>
              <p>ประเภท: {requestTypeLabels[status.lastLocalFixtureStatus.requestType] || status.lastLocalFixtureStatus.requestType}</p>
              <p className="text-xs text-slate-500">{status.lastLocalFixtureStatus.createdAt}</p>
            </div>
          ) : (
            <p className="mt-3 rounded-lg bg-kaset-mist p-3 text-sm leading-6 text-slate-600">
              ยังไม่มีประวัติ fixture ในเครื่องนี้ ลองถาม AI หรือวิเคราะห์ภาพเพื่อสร้างสถานะล่าสุด
            </p>
          )}
        </Card>

        <Card className="border-amber-200 bg-amber-50 p-4">
          <div className="flex gap-3">
            <ShieldAlert aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-amber-800" />
            <div>
              <h2 className="font-extrabold text-amber-950">หมายเหตุความปลอดภัย</h2>
              <ul className="mt-2 grid gap-1 text-sm leading-6 text-amber-900">
                {status.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
