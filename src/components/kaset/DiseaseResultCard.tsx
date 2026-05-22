import { CheckCircle2, Microscope, Save, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShareButton } from '@/components/kaset/ShareButton';
import { VisualPlaceholder } from '@/components/kaset/VisualPlaceholder';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { diseaseAnalysisResult } from '@/data/mockData';
import { useGuestMemory } from '@/hooks/useGuestMemory';

export function DiseaseResultCard() {
  const [savedToFarm, setSavedToFarm] = useState(false);
  const { addFarmRecord, saveItem } = useGuestMemory();

  function handleSaveToFarm() {
    const recordId = 'analysis-result-brown-spot-demo';

    addFarmRecord({
      id: recordId,
      cropName: diseaseAnalysisResult.crop,
      diseaseName: diseaseAnalysisResult.diseaseName,
      date: 'ข้อมูลตัวอย่าง วันนี้',
      confidence: diseaseAnalysisResult.confidence,
      symptomsSummary: diseaseAnalysisResult.symptoms[0],
      treatmentSummary: diseaseAnalysisResult.treatments[0],
      status: 'กำลังรักษา',
      sourceRoute: '/app/analyze',
      metadata: {
        diseaseAnalysisResult,
      },
    });
    saveItem({
      itemType: 'analysis_result',
      itemId: recordId,
      title: diseaseAnalysisResult.diseaseName,
      summary: `${diseaseAnalysisResult.crop} · ความมั่นใจตัวอย่าง ${diseaseAnalysisResult.confidence}%`,
      sourceRoute: '/app/analyze',
      tags: [diseaseAnalysisResult.crop, 'โรคพืช'],
      metadata: {
        diseaseAnalysisResult,
      },
    });
    setSavedToFarm(true);
  }

  return (
    <Card className="overflow-hidden">
      <VisualPlaceholder className="aspect-[16/10] rounded-none" label="ภาพใบพืชสำหรับวิเคราะห์ตัวอย่าง" tone="leaf-scan" />
      <div className="p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <Badge tone="rose">ผลวิเคราะห์ตัวอย่าง</Badge>
            <h2 className="mt-3 text-xl font-extrabold leading-7 text-kaset-ink">
              {diseaseAnalysisResult.diseaseName}
            </h2>
            <p className="mt-1 text-sm text-slate-500">พืช: {diseaseAnalysisResult.crop}</p>
          </div>
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-kaset-mint text-center text-kaset-deep">
            <Microscope aria-hidden="true" className="h-6 w-6" />
            <span className="text-xs font-extrabold">{diseaseAnalysisResult.confidence}%</span>
          </div>
        </div>

        <div className="grid gap-4">
          <div>
            <h3 className="mb-2 text-sm font-bold text-kaset-ink">อาการที่ตรวจพบ</h3>
            <ul className="grid gap-2">
              {diseaseAnalysisResult.symptoms.map((item) => (
                <li className="flex gap-2 text-sm leading-6 text-slate-700" key={item}>
                  <CheckCircle2 aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-kaset-leaf" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-bold text-kaset-ink">คำแนะนำเบื้องต้น</h3>
            <ul className="grid gap-2">
              {diseaseAnalysisResult.treatments.map((item) => (
                <li className="flex gap-2 text-sm leading-6 text-slate-700" key={item}>
                  <CheckCircle2 aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-kaset-leaf" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-5 rounded-lg bg-amber-50 p-3 text-sm leading-6 text-amber-900">
          <div className="flex gap-2">
            <ShieldAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{diseaseAnalysisResult.disclaimer}</span>
          </div>
        </div>

        <div className="mt-5 grid gap-2">
          <Button className="w-full" onClick={handleSaveToFarm} variant={savedToFarm ? 'soft' : 'primary'}>
            <Save aria-hidden="true" className="h-4 w-4" />
            {savedToFarm ? 'บันทึกแล้วในฟาร์มของฉัน' : 'บันทึกเข้าฟาร์มของฉัน'}
          </Button>
          <ShareButton
            label="แชร์ผลวิเคราะห์"
            payload={{
              title: `ผลวิเคราะห์ ${diseaseAnalysisResult.crop}`,
              description: `${diseaseAnalysisResult.diseaseName} ความมั่นใจตัวอย่าง ${diseaseAnalysisResult.confidence}%\n${diseaseAnalysisResult.disclaimer}`,
              url: '/app/analyze',
            }}
          />
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-kaset-mint px-4 text-sm font-bold text-kaset-deep"
            to="/app/my-farm"
          >
            ดูประวัติพืชของฉัน
          </Link>
        </div>
      </div>
    </Card>
  );
}
