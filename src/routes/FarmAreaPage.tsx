import { Calculator, Map, Ruler, Save, ShieldCheck, Square, Trash2, Triangle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LargeActionButton } from '@/components/ui/LargeActionButton';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { cx } from '@/components/ui/classNames';
import { useFarmArea } from '@/hooks/useFarmArea';
import {
  farmAreaAccuracyLabels,
  farmAreaDisclaimer,
  farmAreaMethodLabels,
  farmAreaShapeLabels,
  thaiLandUnitRules,
} from '@/services/farm-area/farm-area-fixtures';
import type { FarmAreaCalculationInput, FarmAreaShape } from '@/services/farm-area/farm-area.types';

const shapeOptions: Array<{ id: FarmAreaShape; icon: typeof Square }> = [
  { id: 'rectangle', icon: Ruler },
  { id: 'square', icon: Square },
  { id: 'triangle', icon: Triangle },
  { id: 'custom_polygon_mock', icon: Map },
];

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function NumberField({
  label,
  onChange,
  placeholder,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-extrabold text-kaset-ink">{label}</span>
      <input
        className="min-h-14 rounded-lg border border-kaset-deep/10 bg-white px-4 text-lg font-extrabold text-kaset-ink shadow-soft outline-none transition focus:border-kaset-leaf focus:ring-2 focus:ring-kaset-leaf/20"
        inputMode="decimal"
        min="0"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type="number"
        value={value}
      />
    </label>
  );
}

export function FarmAreaPage() {
  const farmArea = useFarmArea();
  const [shape, setShape] = useState<FarmAreaShape>('rectangle');
  const [plotName, setPlotName] = useState('แปลงของฉัน');
  const [widthMeters, setWidthMeters] = useState('40');
  const [lengthMeters, setLengthMeters] = useState('80');
  const [sideMeters, setSideMeters] = useState('50');
  const [baseMeters, setBaseMeters] = useState('60');
  const [heightMeters, setHeightMeters] = useState('40');
  const [estimatedAreaSquareMeters, setEstimatedAreaSquareMeters] = useState('1600');

  const calculationInput: FarmAreaCalculationInput = useMemo(
    () => ({
      shape,
      widthMeters: toNumber(widthMeters),
      lengthMeters: toNumber(lengthMeters),
      sideMeters: toNumber(sideMeters),
      baseMeters: toNumber(baseMeters),
      heightMeters: toNumber(heightMeters),
      estimatedAreaSquareMeters: toNumber(estimatedAreaSquareMeters),
      method: shape === 'custom_polygon_mock' ? 'manual_estimate' : 'manual_tape',
    }),
    [baseMeters, estimatedAreaSquareMeters, heightMeters, lengthMeters, shape, sideMeters, widthMeters],
  );

  const result = useMemo(() => farmArea.calculate(calculationInput), [calculationInput, farmArea]);

  const handleSave = () => {
    farmArea.savePlot(calculationInput, plotName);
  };

  return (
    <div>
      <PageHeader title="คำนวณพื้นที่แปลง" subtitle="ประมาณขนาดที่ดินและแปลงเกษตรแบบ local/mock" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <Ruler aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <Badge className="bg-white/15 text-white" tone="green">
                  local calculator
                </Badge>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">วัดเอง คำนวณเอง เก็บในเครื่องนี้</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  ไม่มี GPS ไม่มีแผนที่ ไม่มี geolocation และไม่มีการส่งข้อมูลออกจากเครื่องในเวอร์ชันนี้
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="warning" title="คำเตือนเรื่องความแม่นยำ" icon={ShieldCheck}>
          {farmAreaDisclaimer}
        </NoticeBox>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Calculator aria-hidden="true" className="h-6 w-6 text-kaset-deep" />
            <div className="min-w-0">
              <h2 className="font-extrabold text-kaset-ink">เครื่องคำนวณพื้นที่</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">เลือกทรงแปลง แล้วกรอกตัวเลขเป็นเมตร</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {shapeOptions.map((option) => {
              const Icon = option.icon;
              const label = farmAreaShapeLabels[option.id];
              const isSelected = shape === option.id;

              return (
                <button
                  aria-pressed={isSelected}
                  className={cx(
                    'min-h-[96px] rounded-lg p-3 text-left ring-1 transition',
                    isSelected
                      ? 'bg-kaset-deep text-white ring-kaset-deep'
                      : 'bg-white text-kaset-ink ring-kaset-deep/10 hover:bg-kaset-mint',
                  )}
                  key={option.id}
                  onClick={() => setShape(option.id)}
                  type="button"
                >
                  <Icon aria-hidden="true" className="h-5 w-5" />
                  <span className="mt-2 block text-sm font-extrabold leading-5">{label.label}</span>
                  <span className="mt-1 block text-xs font-semibold leading-5 opacity-80">{label.hint}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 grid gap-3">
            {shape === 'rectangle' ? (
              <div className="grid grid-cols-2 gap-3">
                <NumberField label="กว้าง (เมตร)" onChange={setWidthMeters} placeholder="เช่น 40" value={widthMeters} />
                <NumberField label="ยาว (เมตร)" onChange={setLengthMeters} placeholder="เช่น 80" value={lengthMeters} />
              </div>
            ) : null}

            {shape === 'square' ? (
              <NumberField label="ด้านละ (เมตร)" onChange={setSideMeters} placeholder="เช่น 50" value={sideMeters} />
            ) : null}

            {shape === 'triangle' ? (
              <div className="grid grid-cols-2 gap-3">
                <NumberField label="ฐาน (เมตร)" onChange={setBaseMeters} placeholder="เช่น 60" value={baseMeters} />
                <NumberField label="สูง (เมตร)" onChange={setHeightMeters} placeholder="เช่น 40" value={heightMeters} />
              </div>
            ) : null}

            {shape === 'custom_polygon_mock' ? (
              <>
                <NumberField
                  label="พื้นที่ประมาณ (ตารางเมตร)"
                  onChange={setEstimatedAreaSquareMeters}
                  placeholder="เช่น 1600"
                  value={estimatedAreaSquareMeters}
                />
                <p className="rounded-lg bg-sky-50 p-3 text-sm leading-6 text-sky-900">
                  โหมดนี้เป็น mock สำหรับอนาคต ยังไม่มีการวาดแปลงบนแผนที่หรือเดินขอบแปลงด้วย GPS
                </p>
              </>
            ) : null}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-extrabold text-kaset-ink">ผลประมาณการ</h2>
            <StatusPill tone={result.isValid ? 'success' : 'warning'}>
              {result.isValid ? 'คำนวณได้' : 'รอตัวเลข'}
            </StatusPill>
            <Badge tone="neutral">{result.formulaLabel}</Badge>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-kaset-mist p-3">
              <p className="text-xs font-bold text-slate-500">ตารางเมตร</p>
              <p className="mt-1 text-xl font-extrabold text-kaset-ink">{result.areaLabels.square_meter}</p>
            </div>
            <div className="rounded-lg bg-kaset-mist p-3">
              <p className="text-xs font-bold text-slate-500">ตารางวา</p>
              <p className="mt-1 text-xl font-extrabold text-kaset-ink">{result.areaLabels.square_wa}</p>
            </div>
            <div className="rounded-lg bg-amber-50 p-3">
              <p className="text-xs font-bold text-amber-900">งาน</p>
              <p className="mt-1 text-xl font-extrabold text-amber-950">{result.areaLabels.ngan}</p>
            </div>
            <div className="rounded-lg bg-kaset-mint p-3">
              <p className="text-xs font-bold text-kaset-deep">ไร่</p>
              <p className="mt-1 text-xl font-extrabold text-kaset-ink">{result.areaLabels.rai}</p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <Badge tone="sky">{result.areaLabels.hectare}</Badge>
            <Badge tone="sky">{result.areaLabels.acre}</Badge>
          </div>

          {result.warnings.length > 0 ? (
            <div className="mt-4 grid gap-2">
              {result.warnings.map((warning) => (
                <p className="rounded-lg bg-amber-50 p-3 text-sm leading-6 text-amber-900" key={warning}>
                  {warning}
                </p>
              ))}
            </div>
          ) : null}

          <div className="mt-4 grid gap-3">
            <label className="grid gap-2">
              <span className="text-sm font-extrabold text-kaset-ink">ชื่อแปลงที่จะบันทึก</span>
              <input
                className="min-h-14 rounded-lg border border-kaset-deep/10 bg-white px-4 text-base font-bold text-kaset-ink shadow-soft outline-none transition focus:border-kaset-leaf focus:ring-2 focus:ring-kaset-leaf/20"
                onChange={(event) => setPlotName(event.target.value)}
                value={plotName}
              />
            </label>
            <Button className="w-full" disabled={!result.isValid} onClick={handleSave}>
              <Save aria-hidden="true" className="h-4 w-4" />
              บันทึกแปลงตัวอย่าง
            </Button>
          </div>
        </Card>

        <section className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-kaset-ink">แปลงที่บันทึกไว้</h2>
            <StatusPill tone="info">อยู่ในเครื่องนี้เท่านั้น</StatusPill>
          </div>
          {farmArea.plots.length > 0 ? (
            farmArea.plots.map((plot) => (
              <Card className="p-4" key={plot.id}>
                <div className="flex gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                    <Ruler aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-2">
                      <Badge tone="green">{plot.areaLabels.rai}</Badge>
                      <Badge tone="neutral">{farmAreaMethodLabels[plot.method]}</Badge>
                    </div>
                    <h3 className="mt-2 font-extrabold leading-6 text-kaset-ink">{plot.name}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{plot.dimensionsLabel}</p>
                    <p className="mt-1 text-xs font-bold text-slate-500">
                      {plot.createdAtLabel} · {farmAreaAccuracyLabels[plot.accuracyLevel]}
                    </p>
                    <p className="mt-2 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-900">
                      ข้อมูลอยู่ในเครื่องนี้เท่านั้น · {plot.disclaimer}
                    </p>
                    <button
                      className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-full bg-rose-50 px-4 text-sm font-extrabold text-rose-800"
                      onClick={() => farmArea.removePlot(plot.id)}
                      type="button"
                    >
                      <Trash2 aria-hidden="true" className="h-4 w-4" />
                      ลบรายการนี้
                    </button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-4">
              <p className="text-sm leading-6 text-slate-600">ยังไม่มีแปลงที่บันทึกไว้ในเครื่องนี้</p>
            </Card>
          )}
        </section>

        <Card className="p-4">
          <h2 className="font-extrabold text-kaset-ink">กติกาหน่วยที่ดินไทย</h2>
          <div className="mt-3 grid gap-2">
            {thaiLandUnitRules.map((rule) => (
              <p className="rounded-lg bg-kaset-mist p-3 text-sm font-bold leading-6 text-kaset-deep" key={rule}>
                {rule}
              </p>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-800">
              <Map aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">แผน GPS/แผนที่ในอนาคต</h2>
              <div className="mt-2 grid gap-2 text-sm leading-6 text-slate-600">
                <p>เดินขอบแปลงด้วย GPS ในอนาคต ต้องขออนุญาตตำแหน่งก่อนเท่านั้น</p>
                <p>วาดขอบแปลงบนแผนที่ในอนาคต ต้องใช้ map provider ผ่าน backend/permission policy</p>
                <p>ส่งออกหรือแชร์แปลงในอนาคต ต้องให้ผู้ใช้ยืนยันก่อนทุกครั้ง</p>
              </div>
              <p className="mt-3 rounded-lg bg-sky-50 p-3 text-xs leading-5 text-sky-900">
                เวอร์ชันนี้ไม่มี geolocation prompt ไม่มีแผนที่จริง และไม่มีการส่งพิกัดออกจากเครื่อง
              </p>
            </div>
          </div>
        </Card>

        <LargeActionButton
          description="วิธีวัดเองด้วยสายวัด สูตรพื้นที่ และข้อควรระวัง"
          icon={Ruler}
          label="อ่านคู่มือวัดพื้นที่แปลง"
          to="/app/farm-area-guide"
          variant="soft"
        />

        <Link className="text-center text-sm font-extrabold text-kaset-deep" to="/app/my-farm">
          กลับไปฟาร์มของฉัน
        </Link>
      </div>
    </div>
  );
}
