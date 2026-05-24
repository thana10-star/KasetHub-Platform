import { Calculator, ChevronDown, ChevronUp, Copy, Filter, History, Send, Share2, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { calculatorCards } from '@/services/agri-calculators/agri-calculator-fixtures';
import type { CalculatorCategory } from '@/services/agri-calculators/agri-calculator.types';
import {
  buildCalculatorExportTemplate,
  copyCalculatorExportText,
  createExportSharePayload,
  shareCalculatorExportText,
} from '@/services/agri-calculators/calculator-export-template-service';
import {
  clearCalculatorResultSummaries,
  deleteCalculatorResultSummary,
  getSavedCalculatorResultSummaries,
  subscribeCalculatorResultSummaries,
} from '@/services/agri-calculators/calculator-result-summary-service';
import type { CalculatorResultSummary } from '@/services/agri-calculators/calculator-result-summary.types';
import { shareContent } from '@/services/share/share-service';
import { CalculatorBackLink } from '@/routes/calculators/CalculatorUi';

type SavedResultFilter = CalculatorCategory | 'all';

function SavedResultCard({
  onDelete,
  summary,
}: {
  onDelete: (id: string) => void;
  summary: CalculatorResultSummary;
}) {
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [deleteArmed, setDeleteArmed] = useState(false);
  const exportTemplate = useMemo(() => buildCalculatorExportTemplate(summary), [summary]);

  const copyShortSummary = async () => {
    const copyResult = await copyCalculatorExportText(
      exportTemplate.shortLineText,
      typeof navigator !== 'undefined' ? navigator.clipboard : undefined,
    );

    setMessage([copyResult.message, copyResult.helperMessage].filter(Boolean).join(' · '));
  };

  const shareSummary = async () => {
    const webNavigator = typeof navigator !== 'undefined' ? navigator : undefined;
    const result = await shareCalculatorExportText({
      title: exportTemplate.calculatorTitle,
      text: exportTemplate.longDetailText,
      url: summary.calculatorRoute,
      nativeShare: webNavigator,
      clipboard: webNavigator?.clipboard,
    });

    setMessage([result.message, result.helperMessage].filter(Boolean).join(' · '));
  };

  const shareLine = async () => {
    const result = await shareContent(createExportSharePayload(exportTemplate, 'short_line', 'line'), 'line');
    setMessage(result.message);
  };

  const deleteSummary = () => {
    if (!deleteArmed) {
      setDeleteArmed(true);
      setMessage('กด “ยืนยันลบ” อีกครั้งเพื่อลบสรุปนี้จากเครื่อง');
      return;
    }

    onDelete(summary.id);
  };

  return (
    <Card className="p-4">
      <div className="flex gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
          <Calculator aria-hidden="true" className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="sky">{summary.calculatorShortLabel}</Badge>
            <span className="text-xs font-bold leading-5 text-slate-500">{summary.createdAtLabel}</span>
          </div>
          <h2 className="mt-2 font-extrabold leading-6 text-kaset-ink">{summary.summaryTitle}</h2>
          <div className="mt-3 grid gap-2">
            {exportTemplate.resultRecap.slice(0, isExpanded ? 6 : 2).map((line) => (
              <p className="rounded-lg bg-kaset-mist p-3 text-sm leading-6 text-slate-700" key={line}>
                {line}
              </p>
            ))}
          </div>
          <div className="mt-3 rounded-lg bg-emerald-50 p-3">
            <p className="text-xs font-extrabold uppercase tracking-wide text-kaset-deep">LINE-friendly preview</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{exportTemplate.shortLineText}</p>
          </div>
          {isExpanded ? (
            <div className="mt-3 grid gap-3">
              <div className="rounded-lg bg-white p-3 ring-1 ring-kaset-deep/10">
                <p className="text-xs font-extrabold text-slate-500">ข้อมูลที่กรอก</p>
                <div className="mt-2 grid gap-2">
                  {exportTemplate.inputRecap.map((line) => (
                    <p className="text-sm leading-6 text-slate-700" key={line}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
              <div className="rounded-lg bg-white p-3 ring-1 ring-kaset-deep/10">
                <p className="text-xs font-extrabold text-slate-500">Long detail export</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{exportTemplate.longDetailText}</p>
              </div>
            </div>
          ) : null}
          <p className="mt-3 text-xs font-bold leading-5 text-slate-500">{exportTemplate.disclaimer}</p>
          <button
            className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-full bg-white px-3 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10"
            onClick={() => setIsExpanded((current) => !current)}
            type="button"
          >
            {isExpanded ? <ChevronUp aria-hidden="true" className="h-4 w-4" /> : <ChevronDown aria-hidden="true" className="h-4 w-4" />}
            {isExpanded ? 'ย่อรายละเอียด' : 'ดูรายละเอียด'}
          </button>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button className="min-h-[52px] px-3 text-sm" onClick={copyShortSummary} variant="secondary">
              <Copy aria-hidden="true" className="h-5 w-5" />
              คัดลอกเร็ว
            </Button>
            <Button className="min-h-[52px] px-3 text-sm" onClick={shareSummary} variant="soft">
              <Share2 aria-hidden="true" className="h-5 w-5" />
              แชร์อีกครั้ง
            </Button>
            <Button className="min-h-[52px] px-3 text-sm" onClick={shareLine} variant="soft">
              <Send aria-hidden="true" className="h-5 w-5" />
              ส่ง LINE
            </Button>
            <Button className="min-h-[52px] px-3 text-sm" onClick={deleteSummary} variant="secondary">
              <Trash2 aria-hidden="true" className="h-5 w-5" />
              {deleteArmed ? 'ยืนยันลบ' : 'ลบจากเครื่อง'}
            </Button>
          </div>
          <Link className="mt-3 inline-flex text-sm font-extrabold text-kaset-deep" to={summary.calculatorRoute}>
            เปิดเครื่องคำนวณนี้
          </Link>
          {message ? <p className="mt-3 text-sm font-bold leading-6 text-kaset-deep">{message}</p> : null}
        </div>
      </div>
    </Card>
  );
}

export function CalculatorSavedResultsPage() {
  const [state, setState] = useState(() => getSavedCalculatorResultSummaries());
  const [selectedFilter, setSelectedFilter] = useState<SavedResultFilter>('all');
  const filteredResults = useMemo(
    () =>
      selectedFilter === 'all'
        ? state.savedResults
        : state.savedResults.filter((summary) => summary.category === selectedFilter),
    [selectedFilter, state.savedResults],
  );

  useEffect(() => subscribeCalculatorResultSummaries(() => setState(getSavedCalculatorResultSummaries())), []);

  const deleteItem = (id: string) => {
    setState(deleteCalculatorResultSummary(id));
  };

  const clearAll = () => {
    setState(clearCalculatorResultSummaries());
  };

  return (
    <div>
      <PageHeader title="ผลคำนวณที่บันทึกไว้" subtitle="สรุป local-only สำหรับคัดลอกหรือแชร์ซ้ำ" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <History aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <Badge className="bg-white/15 text-white" tone="green">
                  M53 local saved summaries
                </Badge>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">เก็บสรุปผลคำนวณไว้ในเครื่องนี้</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  ใช้คัดลอก แชร์ซ้ำ หรือลบออกได้ ไม่มี PDF ไม่มี cloud sync และไม่มีการส่งข้อมูลขึ้น backend
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="warning" title="local-only notice">
          สรุปที่บันทึกอยู่ใน localStorage ของเครื่องนี้เท่านั้น ผลคำนวณเบื้องต้นควรตรวจสอบฉลาก/ผู้เชี่ยวชาญก่อนใช้งานจริง
        </NoticeBox>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <Filter aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">กรองตามประเภทเครื่องคำนวณ</h2>
              <select
                className="kh-form-control mt-3 w-full border-0 bg-white px-4 font-extrabold text-kaset-ink ring-1 ring-kaset-deep/12 focus:outline-none focus:ring-2 focus:ring-kaset-leaf"
                onChange={(event) => setSelectedFilter(event.target.value as SavedResultFilter)}
                value={selectedFilter}
              >
                <option value="all">ทั้งหมด</option>
                {calculatorCards.map((card) => (
                  <option key={card.id} value={card.id}>
                    {card.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/calculators/export-preview">
          ดูตัวอย่างข้อความ export
        </Link>

        <section className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-kaset-ink">รายการที่บันทึก</h2>
            <StatusPill tone="info">{filteredResults.length} รายการ</StatusPill>
          </div>

          {filteredResults.length > 0 ? (
            filteredResults.map((summary) => <SavedResultCard key={summary.id} onDelete={deleteItem} summary={summary} />)
          ) : (
            <Card className="p-5 text-center">
              <History aria-hidden="true" className="mx-auto h-7 w-7 text-kaset-deep" />
              <h2 className="mt-3 text-lg font-extrabold text-kaset-ink">ยังไม่มีสรุปที่บันทึกไว้</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                เปิดเครื่องคำนวณ กรอกข้อมูลให้ถูกต้อง แล้วกดบันทึกสรุปเพื่อเก็บไว้ในเครื่องนี้
              </p>
              <Link className="mt-4 inline-flex min-h-12 items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white" to="/app/calculators">
                เปิดเครื่องคำนวณทั้งหมด
              </Link>
            </Card>
          )}
        </section>

        {state.savedResults.length > 0 ? (
          <Button className="w-full" onClick={clearAll} variant="secondary">
            <Trash2 aria-hidden="true" className="h-5 w-5" />
            ล้างสรุปที่บันทึกทั้งหมด
          </Button>
        ) : null}

        <CalculatorBackLink />
      </div>
    </div>
  );
}
