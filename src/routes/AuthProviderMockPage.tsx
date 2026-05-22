import { ArrowRight, KeyRound, Lock, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

type ProviderConfig = {
  title: string;
  subtitle: string;
  label: string;
  description: string;
  icon: typeof MessageCircle;
};

const providerConfig: Record<'line' | 'google', ProviderConfig> = {
  line: {
    title: 'เชื่อมต่อ LINE',
    subtitle: 'LINE Login mock เท่านั้น',
    label: 'LINE เหมาะสำหรับคนที่ใช้ LINE เป็นประจำ',
    description:
      'ในอนาคตผู้ใช้จะเชื่อมบัญชี LINE เพื่อสำรองข้อมูล รับการแจ้งเตือน และกลับมาใช้งานจากชุมชน LINE ได้ง่ายขึ้น',
    icon: MessageCircle,
  },
  google: {
    title: 'เชื่อมต่อ Google',
    subtitle: 'Google mock เท่านั้น',
    label: 'Google สำหรับผู้ใช้ที่มีบัญชีอยู่แล้ว',
    description:
      'ในอนาคตผู้ใช้ที่คุ้นเคยกับบัญชี Google จะใช้เป็นทางเลือกเสริมในการสำรองและย้ายข้อมูลข้ามอุปกรณ์',
    icon: KeyRound,
  },
};

function AuthProviderMockPage({ provider }: { provider: 'line' | 'google' }) {
  const config = providerConfig[provider];
  const Icon = config.icon;

  return (
    <div>
      <PageHeader title={config.title} subtitle={config.subtitle} showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <Icon aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <Badge className="bg-white/15 text-white" tone="green">
                  ยังไม่เปิดใช้งาน
                </Badge>
                <h2 className="mt-3 text-xl font-extrabold">{config.label}</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">{config.description}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <Lock aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-kaset-deep" />
            <div>
              <h2 className="font-extrabold text-kaset-ink">ปลอดภัยแบบ mock-only</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                ไม่มี SDK ไม่มี redirect ไม่มี token และไม่มีการเชื่อมต่อบัญชีจริงในเวอร์ชันนี้
              </p>
            </div>
          </div>
        </Card>

        <Link to="/app/auth/sync-preview">
          <span className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-kaset-mint px-4 text-sm font-bold text-kaset-deep transition hover:bg-emerald-100">
            ดูตัวอย่างข้อมูลที่จะสำรอง
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </span>
        </Link>
      </div>
    </div>
  );
}

export function AuthLinePage() {
  return <AuthProviderMockPage provider="line" />;
}

export function AuthGooglePage() {
  return <AuthProviderMockPage provider="google" />;
}
