import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Coins,
  Database,
  FileLock2,
  Gauge,
  History,
  ImagePlus,
  ListChecks,
  Loader2,
  Microscope,
  RefreshCw,
  RotateCcw,
  Save,
  ScanLine,
  Server,
  ShieldAlert,
  Trash2,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShareButton } from '@/components/kaset/ShareButton';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { useAICredits } from '@/hooks/useAICredits';
import { useGuestMemory } from '@/hooks/useGuestMemory';
import { useImageCompression } from '@/hooks/useImageCompression';
import { useImageUpload } from '@/hooks/useImageUpload';
import { buildAIRequestPlan } from '@/services/ai/ai-request-planner';
import { formatFileSize } from '@/services/image-analysis/image-upload-service';
import { runImagePreflight } from '@/services/image-analysis/image-preflight-service';
import { buildPlantImageAnalysisJobPreview } from '@/services/image-analysis/image-analysis-job-planner';
import { analyzePlantImage, getAIProxyAdapterStatus } from '@/services/ai-proxy/ai-proxy-adapter';
import { aiMockScenarioDescriptions, aiMockScenarioLabels } from '@/services/ai-proxy/ai-proxy-fixtures';
import { buildPlantMediaStoragePlan } from '@/services/storage/plant-media-storage-planner';
import type {
  AIMockScenario,
  AIPlantImageAnalysisResult,
  AIPlantImageProxyResponse,
  AIProxyStatus,
} from '@/services/ai-proxy/ai-proxy.types';
import type { ImagePreflightResult } from '@/services/image-analysis/image-preflight.types';

const analyzeScenarioOptions: AIMockScenario[] = [
  'success',
  'insufficient_credits',
  'safety_blocked',
  'failed_retryable',
  'low_confidence',
  'no_plant_detected',
  'blurry_image',
  'safety_warning',
];

const statusTone: Record<AIProxyStatus, 'green' | 'gold' | 'rose' | 'neutral'> = {
  success: 'green',
  rejected: 'gold',
  insufficient_credits: 'rose',
  safety_blocked: 'rose',
  failed: 'rose',
};

const statusCopy: Record<AIProxyStatus, string> = {
  success: 'สำเร็จ',
  rejected: 'ถูกปฏิเสธ',
  insufficient_credits: 'เครดิตไม่พอ',
  safety_blocked: 'บล็อกเพื่อความปลอดภัย',
  failed: 'ล้มเหลว',
};

function ProgressStep({ active, done, label }: { active?: boolean; done?: boolean; label: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span
        className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-extrabold ${
          done ? 'bg-kaset-deep text-white' : active ? 'bg-kaset-mint text-kaset-deep' : 'bg-white text-slate-400'
        }`}
      >
        {done ? <CheckCircle2 aria-hidden="true" className="h-4 w-4" /> : null}
      </span>
      <span className="truncate text-xs font-bold text-slate-600">{label}</span>
    </div>
  );
}

function AnalysisLoadingCard() {
  return (
    <Card className="p-5">
      <div className="flex gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
          <Loader2 aria-hidden="true" className="h-6 w-6 animate-spin" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-extrabold text-kaset-ink">กำลังจำลอง AI Proxy วิเคราะห์ภาพ</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            ระบบกำลังสร้าง response แบบ backend: ตรวจเครดิต เลือกโมเดล vision ใส่คำเตือน และเตรียม logs preview
          </p>
          <div className="mt-4 grid gap-2">
            <div className="h-3 animate-pulse rounded-full bg-kaset-mint" />
            <div className="h-3 w-4/5 animate-pulse rounded-full bg-kaset-mint" />
            <div className="h-3 w-2/3 animate-pulse rounded-full bg-kaset-mint" />
          </div>
        </div>
      </div>
    </Card>
  );
}

function ScenarioSelector({
  scenario,
  setScenario,
}: {
  scenario: AIMockScenario;
  setScenario: (scenario: AIMockScenario) => void;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
          <Server aria-hidden="true" className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-extrabold text-kaset-ink">โหมดจำลองสำหรับทดสอบ</h2>
            <Badge tone="neutral">Plant fixture</Badge>
          </div>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            เลือกสถานการณ์เพื่อดู UI ตอน backend ตอบกลับหลายรูปแบบ
          </p>
        </div>
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {analyzeScenarioOptions.map((option) => (
          <button
            className={`min-h-10 shrink-0 rounded-full px-4 text-sm font-bold transition ${
              scenario === option ? 'bg-kaset-deep text-white shadow-soft' : 'bg-kaset-mist text-kaset-deep'
            }`}
            key={option}
            onClick={() => setScenario(option)}
            type="button"
          >
            {aiMockScenarioLabels[option]}
          </button>
        ))}
      </div>
      <p className="mt-3 rounded-lg bg-kaset-mist p-3 text-xs leading-5 text-slate-600">
        {aiMockScenarioDescriptions[scenario]}
      </p>
    </Card>
  );
}

function PreflightCompressionPanel({
  compression,
  isPreflightLoading,
  preflightResult,
}: {
  compression: ReturnType<typeof useImageCompression>;
  isPreflightLoading: boolean;
  preflightResult: ImagePreflightResult | null;
}) {
  if (!preflightResult && compression.status === 'idle' && !isPreflightLoading) {
    return null;
  }

  const warningIssues = preflightResult?.issues.filter((issue) => issue.severity !== 'pass') ?? [];
  const passCount = preflightResult?.issues.filter((issue) => issue.severity === 'pass').length ?? 0;
  const readinessTone =
    preflightResult?.readinessLevel === 'ready'
      ? 'green'
      : preflightResult?.readinessLevel === 'blocked'
        ? 'rose'
        : 'gold';

  return (
    <Card className="p-4">
      <div className="flex gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
          <Gauge aria-hidden="true" className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-extrabold text-kaset-ink">ลดขนาดรูปก่อนวิเคราะห์</h2>
            <Badge tone="green">local only</Badge>
          </div>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            รูปยังไม่ถูกส่งออกจากเครื่องในเวอร์ชันนี้ ระบบตรวจคุณภาพและย่อรูปในเบราว์เซอร์เท่านั้น
          </p>
          <Link className="mt-2 inline-flex text-sm font-extrabold text-kaset-deep" to="/app/image-preflight">
            อ่านวิธีถ่ายรูปให้พร้อมวิเคราะห์
          </Link>
        </div>
      </div>

      {isPreflightLoading ? (
        <div className="mt-4 rounded-lg bg-kaset-mist p-3 text-sm font-bold text-slate-600">
          กำลังตรวจชนิดไฟล์ ขนาดภาพ และความพร้อมเบื้องต้น...
        </div>
      ) : null}

      {preflightResult ? (
        <div className="mt-4 grid gap-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-kaset-mist p-3">
              <p className="text-xl font-extrabold text-kaset-deep">{preflightResult.readinessScore}</p>
              <p className="text-[11px] font-bold text-slate-500">readiness</p>
            </div>
            <div className="rounded-lg bg-kaset-mist p-3">
              <p className="text-sm font-extrabold text-kaset-deep">
                {preflightResult.width && preflightResult.height ? `${preflightResult.width}×${preflightResult.height}` : 'ไม่ทราบ'}
              </p>
              <p className="text-[11px] font-bold text-slate-500">pixels</p>
            </div>
            <div className="rounded-lg bg-kaset-mist p-3">
              <p className="text-xl font-extrabold text-kaset-deep">{passCount}</p>
              <p className="text-[11px] font-bold text-slate-500">ผ่าน</p>
            </div>
          </div>
          <Badge tone={readinessTone}>{preflightResult.readinessLabel}</Badge>
          {warningIssues.length > 0 ? (
            <div className="grid gap-2">
              {warningIssues.map((issue) => (
                <div
                  className={
                    issue.severity === 'error'
                      ? 'rounded-lg bg-rose-50 p-3 text-sm leading-6 text-rose-900'
                      : issue.severity === 'warning'
                        ? 'rounded-lg bg-amber-50 p-3 text-sm leading-6 text-amber-900'
                        : 'rounded-lg bg-sky-50 p-3 text-sm leading-6 text-sky-900'
                  }
                  key={`${issue.code}-${issue.title}`}
                >
                  <p className="font-extrabold">{issue.title}</p>
                  <p>{issue.message}</p>
                </div>
              ))}
            </div>
          ) : null}
          <div className="rounded-lg bg-kaset-mist p-3">
            <div className="mb-2 flex items-center gap-2">
              <ListChecks aria-hidden="true" className="h-4 w-4 text-kaset-deep" />
              <p className="text-sm font-extrabold text-kaset-ink">เช็กรูปก่อนกดวิเคราะห์</p>
            </div>
            <div className="grid gap-2">
              {preflightResult.checklist.map((item) => (
                <p className="text-xs font-bold leading-5 text-slate-600" key={item.id}>
                  {item.label} — {item.tip}
                </p>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-4 rounded-lg border border-kaset-deep/10 bg-white p-3">
        {compression.status === 'compressing' ? (
          <p className="text-sm font-bold leading-6 text-slate-600">กำลังลดขนาดรูปในเครื่อง...</p>
        ) : null}
        {compression.status === 'failed' ? (
          <div className="text-sm leading-6 text-amber-900">
            <p className="font-extrabold">ลดขนาดรูปไม่สำเร็จ</p>
            <p>{compression.error?.message}</p>
          </div>
        ) : null}
        {compression.result ? (
          <div className="grid gap-3">
            <img
              alt="ตัวอย่างรูปที่ลดขนาดแล้ว"
              className="h-32 w-full rounded-lg object-cover"
              src={compression.result.previewUrl}
            />
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-kaset-mist p-3 text-center">
                <p className="text-lg font-extrabold text-kaset-deep">{formatFileSize(compression.result.originalSizeBytes)}</p>
                <p className="text-[11px] font-bold text-slate-500">ขนาดเดิม</p>
              </div>
              <div className="rounded-lg bg-kaset-mist p-3 text-center">
                <p className="text-lg font-extrabold text-kaset-deep">{formatFileSize(compression.result.optimizedSizeBytes)}</p>
                <p className="text-[11px] font-bold text-slate-500">หลังย่อ</p>
              </div>
            </div>
            <p className="rounded-lg bg-emerald-50 p-3 text-sm font-bold leading-6 text-emerald-900">
              ลดลงประมาณ {compression.result.sizeReductionPercent}% · {compression.result.costReductionLabel}
            </p>
            <p className="text-xs leading-5 text-slate-500">
              ขนาดภาพหลังย่อ {compression.result.optimizedWidth}×{compression.result.optimizedHeight}px · format {compression.result.outputFormat}
            </p>
          </div>
        ) : null}
      </div>
    </Card>
  );
}

type ResultCardProps = {
  onSave: () => void;
  response: AIPlantImageProxyResponse;
  result: AIPlantImageAnalysisResult;
  savedToFarm: boolean;
};

function urgencyCopy(urgency: AIPlantImageAnalysisResult['urgency']) {
  if (urgency === 'urgent') {
    return 'ควรเร่งตรวจสอบ';
  }

  if (urgency === 'watch') {
    return 'เฝ้าระวัง';
  }

  return 'ความเสี่ยงต่ำ';
}

function PremiumAnalysisResultCard({ onSave, response, result, savedToFarm }: ResultCardProps) {
  const canSave = response.status === 'success';

  return (
    <Card className="overflow-hidden">
      <div className="bg-kaset-deep p-5 text-white">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-white/15 text-white" tone="green">
                ผลวิเคราะห์จาก Mock Proxy
              </Badge>
              <Badge tone={statusTone[response.status]}>{statusCopy[response.status]}</Badge>
              {result.urgency === 'urgent' ? <Badge tone="rose">ควรเร่งตรวจสอบ</Badge> : null}
            </div>
            <h2 className="mt-3 text-xl font-extrabold leading-7">{result.diseaseName}</h2>
            <p className="mt-1 text-sm text-emerald-50/90">พืช: {result.cropName}</p>
            <p className="mt-1 break-all text-xs text-emerald-50/80">Request ID: {response.requestId}</p>
          </div>
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
            <Microscope aria-hidden="true" className="h-6 w-6" />
            <span className="text-xs font-extrabold">{result.confidence}%</span>
          </span>
        </div>
      </div>

      <div className="grid gap-4 p-5">
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-kaset-mist p-3 text-center">
            <p className="text-base font-extrabold text-kaset-deep">{result.confidenceLabel}</p>
            <p className="text-xs font-semibold text-slate-500">ความมั่นใจ</p>
          </div>
          <div className="rounded-lg bg-kaset-mist p-3 text-center">
            <p className="text-lg font-extrabold text-kaset-deep">{response.creditCost}</p>
            <p className="text-xs font-semibold text-slate-500">เครดิต</p>
          </div>
          <div className="rounded-lg bg-kaset-mist p-3 text-center">
            <p className="text-base font-extrabold text-kaset-deep">{urgencyCopy(result.urgency)}</p>
            <p className="text-xs font-semibold text-slate-500">ระดับเร่งด่วน</p>
          </div>
        </div>

        <div className="rounded-lg border border-kaset-deep/10 bg-white p-3 text-xs leading-5 text-slate-600">
          <p className="font-extrabold text-kaset-ink">Credit validation preview</p>
          <p className="mt-1">{response.creditValidation.message}</p>
          <p>Endpoint: {response.modelPlan.estimatedBackendEndpoint}</p>
          <p>Provider key: {response.logsPreview.providerKeyLocation}</p>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-bold text-kaset-ink">อาการที่ตรวจพบ</h3>
          <ul className="grid gap-2">
            {result.symptoms.map((item) => (
              <li className="flex gap-2 text-sm leading-6 text-slate-700" key={item}>
                <CheckCircle2 aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-kaset-leaf" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-bold text-kaset-ink">สาเหตุที่เป็นไปได้</h3>
          <ul className="grid gap-2">
            {result.causes.map((item) => (
              <li className="flex gap-2 text-sm leading-6 text-slate-700" key={item}>
                <AlertTriangle aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-amber-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-bold text-kaset-ink">คำแนะนำเบื้องต้น</h3>
          <ul className="grid gap-2">
            {result.treatmentSuggestions.map((item) => (
              <li className="flex gap-2 text-sm leading-6 text-slate-700" key={item}>
                <CheckCircle2 aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-kaset-leaf" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {response.warnings.length > 0 ? (
          <div className="grid gap-2">
            {response.warnings.map((warning) => (
              <div className="rounded-lg bg-amber-50 p-3 text-sm leading-6 text-amber-900" key={warning}>
                {warning}
              </div>
            ))}
          </div>
        ) : null}

        <div className="rounded-lg bg-amber-50 p-3 text-sm leading-6 text-amber-900">
          <div className="flex gap-2">
            <ShieldAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{response.safetyDisclaimers[0]}</span>
          </div>
        </div>

        <div className="grid gap-2">
          <Button className="w-full" disabled={!canSave || savedToFarm} onClick={onSave} variant={savedToFarm ? 'soft' : 'primary'}>
            <Save aria-hidden="true" className="h-4 w-4" />
            {savedToFarm ? 'บันทึกแล้วในฟาร์มของฉัน' : canSave ? 'บันทึกเข้าฟาร์มของฉัน' : 'บันทึกได้เมื่อผลสำเร็จเท่านั้น'}
          </Button>
          <ShareButton
            label="แชร์ผลวิเคราะห์"
            payload={{
              title: `ผลวิเคราะห์ ${result.cropName}`,
              description: `${result.diseaseName} ${result.confidenceLabel}\n${response.safetyDisclaimers[0]}`,
              url: '/app/analyze',
            }}
          />
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-kaset-mint px-4 text-sm font-bold text-kaset-deep"
            to="/app/ai"
          >
            ถาม AI ต่อจากผลนี้
          </Link>
        </div>
      </div>
    </Card>
  );
}

function ProxyFailureCard({ onRetry, response }: { onRetry: () => void; response: AIPlantImageProxyResponse }) {
  return (
    <Card className="p-4">
      <div className="flex gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-rose-50 text-rose-700">
          <AlertTriangle aria-hidden="true" className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <Badge tone={statusTone[response.status]}>{statusCopy[response.status]}</Badge>
          <h2 className="mt-3 font-extrabold text-kaset-ink">Mock proxy ยังไม่ส่งผลวิเคราะห์</h2>
          <p className="mt-1 break-all text-xs text-slate-500">Request ID: {response.requestId}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{response.creditValidation.message}</p>
          {response.warnings.length > 0 ? (
            <div className="mt-3 grid gap-2">
              {response.warnings.map((warning) => (
                <p className="rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-900" key={warning}>
                  {warning}
                </p>
              ))}
            </div>
          ) : null}
          {response.retryable ? (
            <Button className="mt-4 w-full" onClick={onRetry} variant="soft">
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
              ลองวิเคราะห์อีกครั้ง
            </Button>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

function FutureBackendFlowPanel({
  jobPreview,
}: {
  jobPreview: ReturnType<typeof buildPlantImageAnalysisJobPreview>;
}) {
  const proxyStatus = getAIProxyAdapterStatus();
  const visibleLifecycle = jobPreview.lifecycle.filter((step) =>
    ['pending_upload', 'moderation_pending', 'ready_for_ai', 'ai_processing', 'completed', 'deletion_requested'].includes(step.status),
  );

  return (
    <Card className="p-4">
      <div className="flex gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
          <Database aria-hidden="true" className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-extrabold text-kaset-ink">แผน backend ในอนาคต</h2>
            <Badge tone="neutral">ไม่อัปโหลดจริง</Badge>
            <Badge tone={proxyStatus.mode === 'local_fixture' ? 'green' : 'gold'}>{proxyStatus.modeLabel}</Badge>
          </div>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            ตอนนี้รูปเป็น local preview เท่านั้น อนาคตจะใช้ private storage, moderation, Vision AI และสิทธิ์ลบรูป
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            AI proxy: {proxyStatus.readinessLabel} · backend {proxyStatus.backendProxyEnabled ? 'เปิด flag แล้ว แต่ยังไม่ fetch' : 'ปิดอยู่'}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        {visibleLifecycle.map((step, index) => (
          <div className="flex gap-3 rounded-lg bg-kaset-mist p-3" key={step.status}>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-xs font-extrabold text-kaset-deep shadow-soft">
              {index + 1}
            </span>
            <div>
              <p className="text-sm font-extrabold text-kaset-ink">{step.title}</p>
              <p className="mt-1 text-xs leading-5 text-slate-600">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-2 rounded-lg border border-kaset-deep/10 bg-white p-3 text-xs leading-5 text-slate-600">
        <div className="flex gap-2">
          <FileLock2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-kaset-deep" />
          <span>Bucket ที่เสนอ: {jobPreview.storagePlan.proposedBucket}</span>
        </div>
        <p className="break-all">Path ตัวอย่าง: {jobPreview.storagePlan.proposedObjectPath}</p>
        <p>Signed URL: backend ออกให้เท่านั้น อายุเริ่มต้น {jobPreview.storagePlan.signedUrlPolicy.defaultTtlSeconds / 60} นาที</p>
        <p>Deletion: ผู้ใช้ต้องลบรูปต้นฉบับ รูปย่อ และ link ที่เกี่ยวข้องได้ในอนาคต</p>
      </div>

      {jobPreview.storagePlan.warnings.length > 0 ? (
        <div className="mt-3 grid gap-2">
          {jobPreview.storagePlan.warnings.map((warning) => (
            <p className="rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-900" key={warning}>
              {warning}
            </p>
          ))}
        </div>
      ) : null}

      <Link to="/app/image-privacy">
        <span className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-kaset-mint px-4 text-sm font-bold text-kaset-deep">
          อ่านเรื่องความเป็นส่วนตัวของรูปภาพ
        </span>
      </Link>
    </Card>
  );
}

export function AnalyzePage() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const preflightRunRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [savedResultId, setSavedResultId] = useState('');
  const [scenario, setScenario] = useState<AIMockScenario>('success');
  const [proxyResponse, setProxyResponse] = useState<AIPlantImageProxyResponse | null>(null);
  const [preflightResult, setPreflightResult] = useState<ImagePreflightResult | null>(null);
  const [isPreflightLoading, setIsPreflightLoading] = useState(false);
  const { addFarmRecord, saveItem, state } = useGuestMemory();
  const { summary } = useAICredits();
  const imageCompression = useImageCompression();
  const { removeImage, retry, selectedImage, selectFile, startAnalysis, status, warnings } = useImageUpload();
  const recentAnalysisItems = state.savedItems.filter((item) => item.itemType === 'analysis_result').slice(0, 3);
  const hasImage = Boolean(selectedImage);
  const isComplete = status === 'complete' && Boolean(proxyResponse);
  const storagePlan = useMemo(
    () =>
      buildPlantMediaStoragePlan({
        fileName: selectedImage?.fileName || 'demo-rice-leaf.jpg',
        mimeType: selectedImage?.fileType || 'image/jpeg',
        sizeBytes: selectedImage?.fileSize || 1200000,
        guestSessionId: state.profile.guestId,
        sourceRoute: '/app/analyze',
      }),
    [selectedImage, state.profile.guestId],
  );
  const jobPreview = useMemo(
    () =>
      buildPlantImageAnalysisJobPreview({
        uploadPlan: storagePlan,
        aiRequestPlan: buildAIRequestPlan({
          prompt: selectedImage?.fileName || 'plant image analysis',
          requestType: 'plant_image_analysis',
          sourceRoute: '/app/analyze',
        }),
        creditCost: 3,
        userSession: {
          mode: 'guest',
          guestSessionId: state.profile.guestId,
          canUpload: false,
        },
      }),
    [selectedImage?.fileName, state.profile.guestId, storagePlan],
  );

  useEffect(() => {
    if (status !== 'complete' || !selectedImage) {
      return;
    }

    setProxyResponse(
      analyzePlantImage({
        fileName: selectedImage.fileName,
        fileSize: imageCompression.result?.optimizedSizeBytes ?? selectedImage.fileSize,
        fileType: selectedImage.fileType,
        creditSummary: summary,
        scenario,
      }),
    );
  }, [imageCompression.result?.optimizedSizeBytes, scenario, selectedImage, status, summary]);

  function openFilePicker() {
    inputRef.current?.click();
  }

  function handleSelectFile(file: File | undefined) {
    setProxyResponse(null);
    setSavedResultId('');
    setPreflightResult(null);
    setIsPreflightLoading(false);
    imageCompression.reset();

    if (file) {
      const runId = preflightRunRef.current + 1;
      preflightRunRef.current = runId;
      setIsPreflightLoading(true);

      void runImagePreflight(file)
        .then((result) => {
          if (preflightRunRef.current === runId) {
            setPreflightResult(result);
          }
        })
        .finally(() => {
          if (preflightRunRef.current === runId) {
            setIsPreflightLoading(false);
          }
        });
      void imageCompression.compress(file, {
        maxWidth: 1280,
        maxHeight: 1280,
        quality: 0.78,
        outputFormat: 'image/jpeg',
      });
    }

    selectFile(file);
  }

  function handleRemoveImage() {
    setProxyResponse(null);
    setSavedResultId('');
    preflightRunRef.current += 1;
    setPreflightResult(null);
    setIsPreflightLoading(false);
    imageCompression.reset();
    removeImage();
  }

  function handleStartAnalysis() {
    setProxyResponse(null);
    setSavedResultId('');
    startAnalysis();
  }

  function handleRetryAnalysis() {
    setProxyResponse(null);
    retry();
  }

  function handleSaveToFarm() {
    const result = proxyResponse?.result;

    if (!result || !selectedImage || !proxyResponse || proxyResponse.status !== 'success') {
      return;
    }

    addFarmRecord({
      id: proxyResponse.requestId,
      cropName: result.cropName,
      diseaseName: result.diseaseName,
      date: 'ข้อมูลตัวอย่าง วันนี้',
      confidence: result.confidence,
      symptomsSummary: result.symptoms[0],
      treatmentSummary: result.treatmentSuggestions[0],
      status: 'กำลังรักษา',
      sourceRoute: '/app/analyze',
      metadata: {
        aiProxyResponsePreview: proxyResponse,
        imageName: selectedImage.fileName,
        imageSize: selectedImage.fileSize,
        optimizedImageSize: imageCompression.result?.optimizedSizeBytes,
        imagePreflightScore: preflightResult?.readinessScore,
        thumbnailTone: 'leaf-scan',
        savedToFarm: true,
      },
    });
    saveItem({
      itemType: 'analysis_result',
      itemId: proxyResponse.requestId,
      title: result.diseaseName,
      summary: `${result.cropName} · ${result.confidenceLabel}`,
      sourceRoute: '/app/analyze',
      tags: [result.cropName, 'โรคพืช', 'วิเคราะห์ภาพ', 'mock-proxy'],
      metadata: {
        aiProxyResponsePreview: proxyResponse,
        imageName: selectedImage.fileName,
        imageSize: selectedImage.fileSize,
        optimizedImageSize: imageCompression.result?.optimizedSizeBytes,
        imagePreflightScore: preflightResult?.readinessScore,
        thumbnailTone: 'leaf-scan',
        savedToFarm: true,
      },
    });
    setSavedResultId(proxyResponse.requestId);
  }

  return (
    <div>
      <PageHeader title="วิเคราะห์โรคพืช" subtitle="อัปโหลดภาพตัวอย่างและทดสอบ AI Mock Proxy โดยไม่ส่งรูปออกจากเครื่อง" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <Camera aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <Badge className="bg-white/15 text-white" tone="green">
                  Plant Vision Mock Proxy
                </Badge>
                <h2 className="mt-3 text-xl font-extrabold">ถ่ายรูปใบพืชหรือแมลง</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  ดู flow เหมือน backend จริง: preview รูปในเครื่อง ตรวจเครดิต 3 เครดิต เลือก vision model และแสดงผลหลายสถานการณ์
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="success" title="รูปยังอยู่ในเครื่องนี้">
          เวอร์ชันนี้แสดงตัวอย่างรูปในเครื่องเท่านั้น ยังไม่อัปโหลดรูปไป Supabase หรือส่งเข้า AI จริง
        </NoticeBox>

        <Link to="/app/image-preflight">
          <span className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep shadow-card ring-1 ring-kaset-deep/10">
            ลดขนาดรูปก่อนวิเคราะห์: ดูวิธีเตรียมรูป
          </span>
        </Link>

        <Link to="/app/my-farm">
          <span className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-kaset-mint px-4 text-sm font-extrabold text-kaset-deep">
            กลับไป My Farm Hub
          </span>
        </Link>

        <ScenarioSelector scenario={scenario} setScenario={setScenario} />

        <Card className="p-4">
          <div className="grid grid-cols-3 gap-2">
            <ProgressStep active={status === 'idle' || status === 'preview'} done={hasImage} label="เลือกรูป" />
            <ProgressStep active={status === 'analyzing'} done={isComplete} label="วิเคราะห์" />
            <ProgressStep active={isComplete} done={savedResultId === proxyResponse?.requestId} label="บันทึก" />
          </div>
        </Card>

        <Card
          className={`p-4 transition ${isDragging ? 'border-kaset-leaf bg-kaset-mint' : ''}`}
          onDragLeave={() => setIsDragging(false)}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            handleSelectFile(event.dataTransfer.files[0]);
          }}
        >
          <input
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(event) => handleSelectFile(event.target.files?.[0])}
            ref={inputRef}
            type="file"
          />

          {selectedImage ? (
            <div className="grid gap-4">
              <div className="overflow-hidden rounded-lg bg-kaset-mist">
                <img alt="ตัวอย่างภาพพืชที่เลือก" className="h-56 w-full object-cover" src={selectedImage.previewUrl} />
              </div>
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                  <ImagePlus aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-extrabold text-kaset-ink">{selectedImage.fileName}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {selectedImage.fileType} · {formatFileSize(selectedImage.fileSize)}
                  </p>
                </div>
                <button
                  aria-label="ลบรูป"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-rose-50 text-rose-700"
                  onClick={handleRemoveImage}
                  type="button"
                >
                  <Trash2 aria-hidden="true" className="h-5 w-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={handleStartAnalysis} variant="primary">
                  <ScanLine aria-hidden="true" className="h-4 w-4" />
                  วิเคราะห์
                </Button>
                <Button onClick={openFilePicker} variant="secondary">
                  <RefreshCw aria-hidden="true" className="h-4 w-4" />
                  เปลี่ยนรูป
                </Button>
              </div>
            </div>
          ) : (
            <button className="block w-full rounded-lg bg-kaset-mist p-5 text-left" onClick={openFilePicker} type="button">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-lg bg-white text-kaset-deep shadow-soft">
                <Camera aria-hidden="true" className="h-8 w-8" />
              </span>
              <span className="mt-4 block text-center text-lg font-extrabold text-kaset-ink">ถ่ายรูปใบพืชหรือแมลง</span>
              <span className="mt-2 block text-center text-sm leading-6 text-slate-600">
                แตะเพื่อเลือกรูปบนมือถือ หรือลากรูปมาวางบนเดสก์ท็อป
              </span>
              <span className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-bold text-white">
                เลือกรูปภาพ
              </span>
            </button>
          )}
        </Card>

        <PreflightCompressionPanel
          compression={imageCompression}
          isPreflightLoading={isPreflightLoading}
          preflightResult={preflightResult}
        />

        <Card className="border-amber-200 bg-amber-50 p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white text-amber-800">
              <Coins aria-hidden="true" className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-extrabold text-amber-950">วิเคราะห์รูปภาพใช้ 3 เครดิตในอนาคต</h2>
              <p className="mt-1 text-sm leading-6 text-amber-900">
                M11 ตรวจเครดิตแบบ dry-run จาก local AI credits แต่ยังไม่หักเครดิต ไม่อัปโหลดภาพ และไม่เรียก AI vision จริง
              </p>
              <p className="mt-2 flex gap-2 text-xs leading-5 text-amber-900">
                <ShieldAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                ผลวิเคราะห์เป็นข้อมูลเบื้องต้น ควรตรวจสอบกับผู้เชี่ยวชาญก่อนใช้งานจริง
              </p>
            </div>
          </div>
        </Card>

        <FutureBackendFlowPanel jobPreview={jobPreview} />

        {warnings.length > 0 ? (
          <Card className="p-4">
            <div className="grid gap-2">
              {warnings.map((warning) => (
                <div className="rounded-lg bg-amber-50 p-3 text-sm leading-6 text-amber-900" key={`${warning.code}-${warning.title}`}>
                  <p className="font-extrabold">{warning.title}</p>
                  <p>{warning.message}</p>
                </div>
              ))}
            </div>
            {status === 'failed' ? (
              <Button className="mt-4 w-full" onClick={openFilePicker} variant="soft">
                <RotateCcw aria-hidden="true" className="h-4 w-4" />
                ลองเลือกรูปใหม่
              </Button>
            ) : null}
          </Card>
        ) : null}

        {status === 'analyzing' ? <AnalysisLoadingCard /> : null}

        {proxyResponse?.result ? (
          <PremiumAnalysisResultCard
            onSave={handleSaveToFarm}
            response={proxyResponse}
            result={proxyResponse.result}
            savedToFarm={savedResultId === proxyResponse.requestId}
          />
        ) : null}

        {proxyResponse && !proxyResponse.result ? <ProxyFailureCard onRetry={handleRetryAnalysis} response={proxyResponse} /> : null}

        {status === 'failed' && hasImage ? (
          <Button className="w-full" onClick={handleRetryAnalysis} variant="soft">
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
            วิเคราะห์อีกครั้ง
          </Button>
        ) : null}

        <Card className="p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <History aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
              <h2 className="font-extrabold text-kaset-ink">ประวัติวิเคราะห์ล่าสุด</h2>
            </div>
            <Link className="text-sm font-bold text-kaset-deep" to="/app/analysis-history">
              ดูทั้งหมด
            </Link>
          </div>
          {recentAnalysisItems.length > 0 ? (
            <div className="grid gap-2">
              {recentAnalysisItems.map((item) => (
                <Link className="rounded-lg bg-kaset-mist p-3" key={item.id} to="/app/analysis-history">
                  <p className="text-sm font-extrabold text-kaset-ink">{item.title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">{item.summary}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="rounded-lg bg-kaset-mist p-3 text-sm leading-6 text-slate-600">
              ยังไม่มีประวัติในเครื่องนี้ กดบันทึกเข้าฟาร์มของฉันหลังวิเคราะห์เพื่อเก็บไว้
            </p>
          )}
          <p className="mt-3 text-xs leading-5 text-slate-500">ข้อมูลประวัติใช้ Guest Memory และอยู่ในเครื่องนี้เท่านั้น</p>
        </Card>
      </div>
    </div>
  );
}
