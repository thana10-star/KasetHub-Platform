import {
  CheckCircle2,
  EyeOff,
  Flag,
  ListChecks,
  LockKeyhole,
  MessageSquareText,
  ShieldCheck,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { cx } from '@/components/ui/classNames';
import {
  getCommunityModerationAccessStatus,
  type CommunityModerationAccessStatus,
} from '@/services/community/community-admin-access';
import {
  createCommunityModerationReviewService,
  type CommunityModerationReportQueueItem,
  type CommunityModerationReportStatus,
  type CommunityModerationResult,
  type CommunityModerationReviewService,
  type CommunityModerationTargetType,
} from '@/services/community/community-moderation-review-service';
import {
  getCachedSupabaseAuthSessionSnapshot,
  getCurrentSupabaseAuthSession,
  subscribeToSupabaseAuthSession,
  type SupabaseAuthSessionSnapshot,
} from '@/services/auth/supabase-auth-session';

type QueueState =
  | {
      status: 'loading';
      items: CommunityModerationReportQueueItem[];
    }
  | {
      status: 'ready';
      items: CommunityModerationReportQueueItem[];
    }
  | {
      status: 'error';
      items: CommunityModerationReportQueueItem[];
      message: string;
      code: Exclude<CommunityModerationResult<never>, { ok: true }>['code'];
    };

type CommunityModerationPageProps = {
  authSessionOverride?: SupabaseAuthSessionSnapshot;
  adminEmailsOverride?: string[];
  initialQueueResult?: CommunityModerationResult<CommunityModerationReportQueueItem[]>;
  serviceOverride?: CommunityModerationReviewService;
};

const emptyQueue: CommunityModerationReportQueueItem[] = [];

function queueStateFromResult(
  result: CommunityModerationResult<CommunityModerationReportQueueItem[]>,
): QueueState {
  return result.ok
    ? {
        status: 'ready',
        items: result.data,
      }
    : {
        status: 'error',
        items: [],
        message: result.message,
        code: result.code,
      };
}

function targetTypeLabel(targetType: CommunityModerationTargetType) {
  return targetType === 'comment' ? 'คอมเมนต์' : 'โพสต์';
}

function statusLabel(status: CommunityModerationReportStatus) {
  switch (status) {
    case 'reviewed':
      return 'ตรวจแล้ว';
    case 'dismissed':
      return 'ยกเลิก';
    case 'action_taken':
      return 'ดำเนินการแล้ว';
    case 'pending':
    default:
      return 'รอตรวจสอบ';
  }
}

function statusTone(status: CommunityModerationReportStatus) {
  if (status === 'pending') return 'warning';
  if (status === 'action_taken') return 'success';
  return 'neutral';
}

function formatModerationDate(value: string) {
  if (!value) return 'ไม่ทราบเวลา';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('th-TH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function safeCommunityDisplayName(value: string | undefined) {
  if (!value) return 'ไม่ระบุชื่อผู้เขียน';
  return value.includes('@') ? 'ผู้เขียนในชุมชน' : value;
}

function SummaryCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Flag;
  label: string;
  value: number;
}) {
  return (
    <Card className="min-w-0 p-4">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
          <Icon aria-hidden="true" className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-2xl font-extrabold leading-7 text-kaset-ink">{value}</p>
          <p className="mt-1 text-xs font-bold leading-4 text-slate-500">{label}</p>
        </div>
      </div>
    </Card>
  );
}

function AccessGateCard({ access }: { access: CommunityModerationAccessStatus }) {
  const isSignedOut = access.state === 'signed_out';

  return (
    <Card className="p-4">
      <div className="flex gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-700">
          <LockKeyhole aria-hidden="true" className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-extrabold text-kaset-ink">{access.message}</h2>
            <StatusPill tone={isSignedOut ? 'warning' : 'danger'}>
              {isSignedOut ? 'ต้องเข้าสู่ระบบ' : 'จำกัดสิทธิ์'}
            </StatusPill>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            หน้านี้ใช้สำหรับทีมงานที่ได้รับสิทธิ์ตรวจรายงานชุมชนเท่านั้น รายงานจะไม่แสดงให้ผู้ใช้ทั่วไปเห็น
          </p>
          {isSignedOut ? (
            <Link
              className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-kaset-deep px-5 text-[15px] font-bold leading-5 text-white"
              to="/app/login?next=/app/community-moderation"
            >
              เข้าสู่ระบบ
            </Link>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

function ReportQueueCard({
  item,
  actionTarget,
  onHideComment,
  onHidePost,
  onMarkReviewed,
}: {
  item: CommunityModerationReportQueueItem;
  actionTarget: string;
  onHideComment: (item: CommunityModerationReportQueueItem) => void;
  onHidePost: (item: CommunityModerationReportQueueItem) => void;
  onMarkReviewed: (item: CommunityModerationReportQueueItem) => void;
}) {
  const isBusy = actionTarget === item.id || actionTarget === item.targetId;
  const isPost = item.targetType === 'post';
  const isComment = item.targetType === 'comment';

  return (
    <Card className="overflow-hidden">
      <div className="grid gap-4 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill tone={statusTone(item.status)}>{statusLabel(item.status)}</StatusPill>
          <StatusPill tone="info">{targetTypeLabel(item.targetType)}</StatusPill>
          <StatusPill tone="neutral">{item.reasonLabel}</StatusPill>
        </div>

        <div className="min-w-0">
          <p className="text-xs font-bold leading-5 text-slate-500">เนื้อหาที่ถูกรายงาน</p>
          <p className="mt-1 break-words text-base font-extrabold leading-7 text-kaset-ink">{item.targetPreview}</p>
          <p className="mt-1 break-words text-sm leading-6 text-slate-600">
            ผู้เขียน: {safeCommunityDisplayName(item.targetAuthorDisplayName)}
          </p>
        </div>

        <div className="grid gap-2 rounded-lg bg-kaset-mist p-3 text-sm leading-6 text-slate-600">
          <p className="break-words">
            <span className="font-bold text-kaset-ink">ผู้แจ้ง:</span> {item.reporterUserLabel}
          </p>
          <p>
            <span className="font-bold text-kaset-ink">เวลา:</span> {formatModerationDate(item.createdAt)}
          </p>
          {item.note ? (
            <p className="break-words">
              <span className="font-bold text-kaset-ink">หมายเหตุ:</span> {item.note}
            </p>
          ) : null}
        </div>

        <details className="rounded-lg border border-kaset-deep/10 bg-white p-3">
          <summary className="cursor-pointer text-sm font-extrabold text-kaset-deep">ดูรายละเอียด</summary>
          <div className="mt-2 grid gap-1 text-xs leading-5 text-slate-500">
            <p className="break-all">report: {item.id}</p>
            <p className="break-all">target: {item.targetId}</p>
            {item.reviewedAt ? <p>reviewed: {formatModerationDate(item.reviewedAt)}</p> : null}
          </div>
        </details>

        <div className="grid gap-2 sm:grid-cols-2">
          <Button disabled={isBusy || item.status !== 'pending'} onClick={() => onMarkReviewed(item)} variant="secondary">
            <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
            ทำเครื่องหมายว่าตรวจแล้ว
          </Button>
          <Button disabled={isBusy || !isPost} onClick={() => onHidePost(item)} variant="secondary">
            <EyeOff aria-hidden="true" className="h-4 w-4" />
            ซ่อนโพสต์
          </Button>
          <Button disabled={isBusy || !isComment} onClick={() => onHideComment(item)} variant="secondary">
            <EyeOff aria-hidden="true" className="h-4 w-4" />
            ซ่อนคอมเมนต์
          </Button>
          <Link
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-kaset-mint px-5 text-[15px] font-bold leading-5 text-kaset-deep"
            to="/app/community"
          >
            เปิดในชุมชน
          </Link>
        </div>
      </div>
    </Card>
  );
}

export function CommunityModerationPage({
  authSessionOverride,
  adminEmailsOverride,
  initialQueueResult,
  serviceOverride,
}: CommunityModerationPageProps = {}) {
  const [authSession, setAuthSession] = useState<SupabaseAuthSessionSnapshot>(
    () => authSessionOverride ?? getCachedSupabaseAuthSessionSnapshot(),
  );
  const [queueState, setQueueState] = useState<QueueState>(() =>
    initialQueueResult ? queueStateFromResult(initialQueueResult) : { status: 'loading', items: emptyQueue },
  );
  const [actionMessage, setActionMessage] = useState('');
  const [actionTarget, setActionTarget] = useState('');
  const service = useMemo(() => serviceOverride ?? createCommunityModerationReviewService(), [serviceOverride]);
  const access = getCommunityModerationAccessStatus(authSession, adminEmailsOverride);

  useEffect(() => {
    if (authSessionOverride) {
      setAuthSession(authSessionOverride);
      return undefined;
    }

    let active = true;
    void getCurrentSupabaseAuthSession().then((snapshot) => {
      if (active) setAuthSession(snapshot);
    });
    const unsubscribe = subscribeToSupabaseAuthSession((snapshot) => {
      if (active) setAuthSession(snapshot);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [authSessionOverride]);

  useEffect(() => {
    if (initialQueueResult || access.state !== 'admin') return;

    let active = true;
    setQueueState({ status: 'loading', items: emptyQueue });
    void service.listReports().then((result) => {
      if (active) setQueueState(queueStateFromResult(result));
    });

    return () => {
      active = false;
    };
  }, [access.state, initialQueueResult, service]);

  async function runAction(
    item: CommunityModerationReportQueueItem,
    operation: () => Promise<CommunityModerationResult>,
    successMessage: string,
    nextStatus: CommunityModerationReportStatus,
  ) {
    setActionMessage('');
    setActionTarget(nextStatus === 'reviewed' ? item.id : item.targetId);
    const result = await operation();
    setActionTarget('');

    if (!result.ok) {
      setActionMessage(result.message);
      return;
    }

    setQueueState((current) => ({
      ...current,
      items: current.items.map((queueItem) =>
        queueItem.id === item.id ? { ...queueItem, status: nextStatus, reviewedAt: new Date().toISOString() } : queueItem,
      ),
    }));
    setActionMessage(successMessage);
  }

  const reports = queueState.items;
  const pendingCount = reports.filter((item) => item.status === 'pending').length;
  const postCount = reports.filter((item) => item.targetType === 'post').length;
  const commentCount = reports.filter((item) => item.targetType === 'comment').length;

  return (
    <div>
      <PageHeader
        showBack
        subtitle="ดูโพสต์และคอมเมนต์ที่ถูกแจ้งรายงาน"
        title="ตรวจรายงานชุมชน"
      />

      <div className="grid min-w-0 gap-5 px-5 pb-6">
        {access.state !== 'admin' ? (
          <AccessGateCard access={access} />
        ) : (
          <>
            <NoticeBox tone="info" title={access.message}>
              <p>
                การเปิดหน้านี้ใช้รายชื่ออีเมลทีมงานจาก VITE_ADMIN_EMAILS และฐานข้อมูลยังต้องบังคับสิทธิ์ผ่าน RLS/RPC
              </p>
            </NoticeBox>

            <div className="grid min-w-0 grid-cols-2 gap-3">
              <SummaryCard icon={Flag} label="รายงานทั้งหมด" value={reports.length} />
              <SummaryCard icon={ListChecks} label="รอตรวจสอบ" value={pendingCount} />
              <SummaryCard icon={ShieldCheck} label="โพสต์ถูกรายงาน" value={postCount} />
              <SummaryCard icon={MessageSquareText} label="คอมเมนต์ถูกรายงาน" value={commentCount} />
            </div>

            {actionMessage ? (
              <NoticeBox tone={actionMessage.includes('ไม่สำเร็จ') || actionMessage.includes('ไม่มีสิทธิ์') ? 'danger' : 'success'}>
                <p>{actionMessage}</p>
              </NoticeBox>
            ) : null}

            {queueState.status === 'loading' ? (
              <Card className="p-4">
                <p className="font-extrabold text-kaset-ink">กำลังโหลดคิวรายงาน</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">ระบบกำลังขอข้อมูลจาก RPC ที่จำกัดสิทธิ์ผู้ดูแล</p>
              </Card>
            ) : null}

            {queueState.status === 'error' ? (
              <NoticeBox tone={queueState.code === 'moderation_rpc_not_ready' ? 'warning' : 'danger'} title={queueState.message}>
                <p>
                  ใช้ SQL draft ของ M116.13 ใน Supabase staging แล้วเพิ่มบัญชีเจ้าของเป็นผู้ดูแลก่อนรีเฟรชหน้านี้
                </p>
              </NoticeBox>
            ) : null}

            {queueState.status === 'ready' && reports.length === 0 ? (
              <Card className="p-4">
                <div className="flex gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                    <ShieldCheck aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="font-extrabold text-kaset-ink">ยังไม่มีรายงานรอตรวจสอบ</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      เมื่อมีผู้ใช้แจ้งรายงาน ระบบจะแสดงรายการจริงจากฐานข้อมูลที่นี่
                    </p>
                  </div>
                </div>
              </Card>
            ) : null}

            <div className={cx('grid min-w-0 gap-4', queueState.status !== 'ready' && 'hidden')}>
              {reports.map((item) => (
                <ReportQueueCard
                  actionTarget={actionTarget}
                  item={item}
                  key={item.id}
                  onHideComment={(queueItem) =>
                    void runAction(
                      queueItem,
                      () => service.hideReportedComment(queueItem.targetId),
                      'ซ่อนคอมเมนต์แล้ว',
                      'action_taken',
                    )
                  }
                  onHidePost={(queueItem) =>
                    void runAction(
                      queueItem,
                      () => service.hideReportedPost(queueItem.targetId),
                      'ซ่อนโพสต์แล้ว',
                      'action_taken',
                    )
                  }
                  onMarkReviewed={(queueItem) =>
                    void runAction(
                      queueItem,
                      () => service.markReportReviewed(queueItem.id),
                      'ทำเครื่องหมายว่าตรวจแล้ว',
                      'reviewed',
                    )
                  }
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
