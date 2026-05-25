import {
  AlertTriangle,
  Bot,
  Cpu,
  Leaf,
  PlayCircle,
  RotateCcw,
  SendHorizonal,
  Server,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AICreditBalanceCard } from '@/components/kaset/AICreditBalanceCard';
import { AILimitReachedSheet } from '@/components/kaset/AILimitReachedSheet';
import { RewardedAdUnlockCard } from '@/components/kaset/RewardedAdUnlockCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { useAICredits } from '@/hooks/useAICredits';
import { useGuestMemory } from '@/hooks/useGuestMemory';
import {
  AI_CAN_HELP_ITEMS,
  AI_CANNOT_REPLACE_ITEMS,
  AI_CHEMICAL_SAFETY_NOTE,
  AI_FARMER_ASSISTANT_PROMPT_EXAMPLES,
  AI_FARMER_ASSISTANT_SAFETY_NOTE,
  isHighRiskFarmerPrompt,
} from '@/services/ai/ai-farmer-assistant-copy';
import { buildAIRequestPlan } from '@/services/ai/ai-request-planner';
import { askTextQuestion, getAIProxyAdapterStatus } from '@/services/ai-proxy/ai-proxy-adapter';
import { aiMockScenarioDescriptions, aiMockScenarioLabels } from '@/services/ai-proxy/ai-proxy-fixtures';
import type { AIMockScenario, AIProxyStatus, AITextProxyResponse } from '@/services/ai-proxy/ai-proxy.types';

const promptIcons = [Leaf, Sparkles, PlayCircle, AlertTriangle, Cpu, Bot];

const aiScenarioOptions: AIMockScenario[] = [
  'success',
  'insufficient_credits',
  'safety_blocked',
  'failed_retryable',
  'low_confidence',
  'no_plant_detected',
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
            <h2 className="font-extrabold text-kaset-ink">ตัวเลือกคำตอบสำหรับทีมงาน</h2>
            <Badge tone="neutral">สำหรับทีมงาน</Badge>
          </div>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            ใช้ตรวจคำตอบหลายแบบในเครื่องนี้โดยไม่ส่งข้อมูลออกจากหน้าเว็บ
          </p>
        </div>
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {aiScenarioOptions.map((option) => (
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

function ProxyResponseCard({
  question,
  onRetry,
  response,
}: {
  question: string;
  onRetry: () => void;
  response: AITextProxyResponse;
}) {
  const showChemicalCaution =
    isHighRiskFarmerPrompt(question) ||
    response.safetyDisclaimers.some((disclaimer) => /สารเคมี|ปุ๋ย|โรคพืช|ฉลาก/.test(disclaimer));

  return (
    <Card className="overflow-hidden">
      <div className="bg-kaset-deep p-5 text-white">
        <div className="flex items-start gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
            <Bot aria-hidden="true" className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-white/15 text-white" tone="green">
                แนวทางจากผู้ช่วย
              </Badge>
              <Badge tone={statusTone[response.status]}>{statusCopy[response.status]}</Badge>
            </div>
            <h2 className="mt-3 text-lg font-extrabold leading-7">ผลตอบกลับจากผู้ช่วย</h2>
            <p className="mt-1 text-xs text-emerald-50/90">ใช้เป็นข้อมูลเบื้องต้นก่อนตรวจสอบกับแหล่งที่เชื่อถือได้</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-5">
        {response.answer ? (
          <div>
            <h3 className="text-sm font-extrabold text-kaset-ink">{response.answer.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">{response.answer.answer}</p>
            <div className="mt-3 grid gap-2">
              {response.answer.bulletPoints.map((item) => (
                <p className="rounded-lg bg-kaset-mist p-3 text-sm leading-6 text-slate-700" key={item}>
                  {item}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-rose-50 p-3 text-sm leading-6 text-rose-900">
            ระบบ AI กำลังเตรียมเปิดใช้งาน ตอนนี้คุณยังดูตัวอย่างคำถามและแนวทางการใช้งานได้
          </div>
        )}

        {response.warnings.length > 0 ? (
          <div className="grid gap-2">
            {response.warnings.map((warning) => (
              <div className="flex gap-2 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-900" key={warning}>
                <AlertTriangle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{warning}</span>
              </div>
            ))}
          </div>
        ) : null}

        <div className="rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-900">
          <p className="font-extrabold">คำเตือนความปลอดภัย</p>
          <p className="mt-2">{AI_FARMER_ASSISTANT_SAFETY_NOTE}</p>
          {showChemicalCaution ? <p className="mt-2 font-bold">{AI_CHEMICAL_SAFETY_NOTE}</p> : null}
        </div>

        <details className="rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-600">
          <summary className="cursor-pointer font-extrabold text-slate-800">ข้อมูลเพิ่มเติมสำหรับทีมงาน</summary>
          <div className="mt-2 grid gap-1">
            <p>Request ID: {response.requestId}</p>
            <p>Credit cost: {response.creditCost}</p>
            <p>Credit status: {response.creditValidation.message}</p>
            <p>Model plan: {response.modelPlan.selectedModelTier}</p>
            <p>Network: {response.logsPreview.networkCalls ? 'yes' : 'no'}</p>
            <p>Provider key: {response.logsPreview.providerKeyLocation}</p>
            <p>Would write: {response.logsPreview.wouldWriteTables.join(', ')}</p>
          </div>
        </details>

        {response.retryable ? (
          <Button className="w-full" onClick={onRetry} variant="soft">
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
            ลองส่งอีกครั้ง
          </Button>
        ) : null}
      </div>
    </Card>
  );
}

function AIProxyModeCard() {
  const status = getAIProxyAdapterStatus();

  return (
    <Card className="p-4">
      <div className="flex gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
          <Server aria-hidden="true" className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-extrabold text-kaset-ink">สถานะผู้ช่วย AI</h2>
            <Badge tone={status.mode === 'local_fixture' ? 'green' : 'gold'}>{status.modeLabel}</Badge>
          </div>
          <p className="mt-1 text-sm leading-6 text-slate-600">{status.readinessLabel}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            การเชื่อมต่อบริการ AI: {status.backendProxyEnabled ? 'เปิดไว้สำหรับตรวจระบบ' : 'ปิดอยู่'} · ไม่เก็บ provider keys ในหน้าเว็บ
          </p>
          <Link className="mt-3 inline-flex text-sm font-bold text-kaset-deep" to="/app/ai-proxy-status">
            ดูสถานะระบบ AI
          </Link>
        </div>
      </div>
    </Card>
  );
}

export function AIPage() {
  const [question, setQuestion] = useState('');
  const [savedMessage, setSavedMessage] = useState('');
  const [unlockMessage, setUnlockMessage] = useState('');
  const [showLimitReached, setShowLimitReached] = useState(false);
  const [scenario, setScenario] = useState<AIMockScenario>('success');
  const [proxyResponse, setProxyResponse] = useState<AITextProxyResponse | null>(null);
  const { addRecentAIQuestion, saveItem } = useGuestMemory();
  const { addUsageLog, consumeCredits, grantRewardedCredit, summary } = useAICredits();
  const requestPlan = useMemo(() => buildAIRequestPlan({ prompt: question, sourceRoute: '/app/ai' }), [question]);
  const aiStatus = getAIProxyAdapterStatus();
  const isRealAIUnavailable = !aiStatus.canAttemptBackend && !aiStatus.canUseLocalBackendHandler;

  function handleRewardedUnlock() {
    grantRewardedCredit({
      credits: 1,
      metadata: {
        sourceRoute: '/app/ai',
      },
    });
    setUnlockMessage('เพิ่มเครดิตจากโฆษณาจำลองแล้ว 1 คำถาม');
    setShowLimitReached(false);
  }

  function persistSuccessfulAnswer(cleanQuestion: string, response: AITextProxyResponse) {
    if (!response.answer) {
      return;
    }

    const consumeResult = consumeCredits(response.creditCost);

    if (!consumeResult.success || !consumeResult.source) {
      setShowLimitReached(true);
      setSavedMessage('เครดิตถาม AI ไม่พอ ระบบจึงยังไม่บันทึกคำตอบ');
      return;
    }

    const id = response.requestId;
    const answerSummary = response.answer.answer;
    const metadata = {
      creditSource: consumeResult.source,
      creditSources: consumeResult.sources,
      creditsConsumed: consumeResult.creditsConsumed,
      aiProxyResponsePreview: response,
    };

    addRecentAIQuestion({
      id,
      question: cleanQuestion,
      topic: 'AI ผู้ช่วยเกษตร',
      sourceRoute: '/app/ai',
      answerSummary,
      metadata,
    });
    saveItem({
      itemType: 'ai_answer',
      itemId: id,
      title: cleanQuestion,
      summary: answerSummary,
      sourceRoute: '/app/ai',
      tags: ['AI', 'ผู้ช่วยเกษตร'],
      metadata,
    });
    addUsageLog({
      id,
      question: cleanQuestion,
      topic: 'AI ผู้ช่วยเกษตร',
      creditSource: consumeResult.source,
      answerSummary,
      metadata: {
        sourceRoute: '/app/ai',
        ...metadata,
      },
    });
    setSavedMessage('บันทึกคำถาม ประวัติการใช้เครดิต และ response preview ไว้ในเครื่องนี้แล้ว');
    setShowLimitReached(false);
  }

  function askMockAI(nextQuestion: string) {
    const cleanQuestion = nextQuestion.trim();

    if (!cleanQuestion) {
      setSavedMessage('พิมพ์คำถามก่อนถาม AI');
      return;
    }

    const response = askTextQuestion({
      question: cleanQuestion,
      creditSummary: summary,
      scenario,
    });

    setProxyResponse(response);

    if (response.status === 'insufficient_credits') {
      setShowLimitReached(true);
      setSavedMessage('เครดิตถาม AI ไม่พอ');
      return;
    }

    if (response.status !== 'success') {
      setShowLimitReached(false);
      setSavedMessage(response.retryable ? 'ส่งคำถามไม่สำเร็จ ลองใหม่ได้' : 'ระบบไม่อนุญาตให้ตอบคำขอนี้');
      return;
    }

    persistSuccessfulAnswer(cleanQuestion, response);
  }

  return (
    <div>
      <PageHeader title="ถาม AI เกษตร" subtitle="ถามเรื่องพืช ดิน ปุ๋ย โรค แมลง อากาศ และการจัดการฟาร์ม" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <Bot aria-hidden="true" className="h-7 w-7" />
              </span>
              <div>
                <Badge className="bg-white/15 text-white" tone="green">
                  ถามได้ด้วยภาษาง่าย ๆ
                </Badge>
                <h2 className="mt-3 text-xl font-extrabold">ถามอะไรเกี่ยวกับเกษตรก็ได้</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  พิมพ์คำถามสั้น ๆ เช่น ใบเหลือง ดินแข็ง ฝนตกหลายวัน หรือการเตรียมดินก่อนปลูก
                </p>
              </div>
            </div>
          </div>
        </Card>

        {isRealAIUnavailable ? (
          <NoticeBox tone="info" title="ระบบ AI กำลังเตรียมเปิดใช้งาน">
            ตอนนี้คุณยังดูตัวอย่างคำถามและแนวทางการใช้งานได้ โดยยังไม่เปิดผู้ให้บริการ AI จริงในหน้าเว็บ
          </NoticeBox>
        ) : null}

        <NoticeBox tone="warning" title="อ่านก่อนใช้คำตอบ">
          {AI_FARMER_ASSISTANT_SAFETY_NOTE}
        </NoticeBox>

        <AICreditBalanceCard showLink summary={summary} />

        <Card className="p-4">
          <label className="text-sm font-bold text-kaset-ink" htmlFor="ai-question">
            คำถามของคุณ
          </label>
          <textarea
            className="mt-3 min-h-28 w-full resize-none rounded-lg border border-kaset-deep/10 bg-kaset-mist p-4 text-sm leading-6 text-kaset-ink outline-none focus:border-kaset-leaf"
            id="ai-question"
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="พิมพ์คำถาม เช่น ใบมะนาวเหลืองเกิดจากอะไร"
            value={question}
          />
          <div className="mt-3 rounded-lg bg-kaset-mist p-3">
            <div className="flex gap-3">
              <ShieldAlert aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-kaset-deep" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-extrabold text-kaset-ink">AI ช่วยวางแนวทางเบื้องต้น</h3>
                  <Badge tone={requestPlan.safetyLevel === 'high' ? 'rose' : 'green'}>
                    {requestPlan.creditCost} เครดิต
                  </Badge>
                </div>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  ช่วยอธิบายอาการ ตั้งคำถาม และจัดรายการที่ควรสังเกต แต่ไม่แทนเจ้าหน้าที่เกษตร ฉลากสินค้า หรือการตรวจจริง
                </p>
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              ประมาณ {requestPlan.creditCost} เครดิต · วันนี้ถามฟรีได้อีก {summary.dailyFreeRemaining} ครั้ง
            </p>
            <Button className="shrink-0 px-4" onClick={() => askMockAI(question)}>
              <SendHorizonal aria-hidden="true" className="h-4 w-4" />
              ถาม AI
            </Button>
          </div>
          {savedMessage ? <p className="mt-3 text-xs font-semibold text-kaset-deep">{savedMessage}</p> : null}
        </Card>

        <Card className="p-4">
          <h2 className="font-extrabold text-kaset-ink">ใช้ AI ให้ปลอดภัย</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-kaset-mist p-3">
              <p className="text-sm font-extrabold text-kaset-deep">ช่วยได้</p>
              <ul className="mt-2 grid gap-1 text-xs font-semibold leading-5 text-slate-600">
                {AI_CAN_HELP_ITEMS.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg bg-amber-50 p-3">
              <p className="text-sm font-extrabold text-amber-900">ควรตรวจสอบเพิ่ม</p>
              <ul className="mt-2 grid gap-1 text-xs font-semibold leading-5 text-amber-900">
                {AI_CANNOT_REPLACE_ITEMS.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        <details className="group rounded-lg border border-slate-200 bg-slate-50/80">
          <summary className="flex min-h-[68px] cursor-pointer list-none items-center gap-3 p-4 [&::-webkit-details-marker]:hidden">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-700">
              <Server aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold leading-6 text-slate-800">ข้อมูลเพิ่มเติม / สำหรับทีมงาน</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">สถานะระบบและตัวเลือกคำตอบ ไม่จำเป็นต้องใช้ตอนถามทั่วไป</p>
            </div>
          </summary>
          <div className="grid gap-3 border-t border-slate-200 p-3">
            <AIProxyModeCard />
            <ScenarioSelector scenario={scenario} setScenario={setScenario} />
            <RewardedAdUnlockCard message={unlockMessage} onUnlock={handleRewardedUnlock} />
          </div>
        </details>

        {proxyResponse ? <ProxyResponseCard question={question} onRetry={() => askMockAI(question)} response={proxyResponse} /> : null}

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">เริ่มจากหัวข้อยอดนิยม</h2>
          <div className="grid grid-cols-2 gap-3">
            {AI_FARMER_ASSISTANT_PROMPT_EXAMPLES.map((prompt, index) => {
              const Icon = promptIcons[index % promptIcons.length];

              return (
                <button
                  className="rounded-lg border border-white/90 bg-white p-4 text-left shadow-card ring-1 ring-kaset-deep/5"
                  key={prompt}
                  onClick={() => {
                    setQuestion(prompt);
                    askMockAI(prompt);
                  }}
                  type="button"
                >
                  <span className="mb-3 grid h-10 w-10 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <span className="block text-sm font-bold leading-5 text-kaset-ink">{prompt}</span>
                </button>
              );
            })}
          </div>
        </section>

        {showLimitReached ? <AILimitReachedSheet onUnlock={handleRewardedUnlock} /> : null}

        <Card className="border-amber-200 bg-amber-50 p-5 shadow-soft">
          <div className="flex gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white text-amber-700 shadow-soft">
              <ShieldAlert aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold text-amber-950">คำแนะนำความปลอดภัย</h2>
              <p className="mt-2 text-sm leading-6 text-amber-900">{AI_FARMER_ASSISTANT_SAFETY_NOTE}</p>
              <Link to="/app/ai-credits">
                <span className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 text-sm font-bold text-amber-800 transition hover:bg-amber-100">
                  ดูรายละเอียดเครดิต AI
                </span>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
