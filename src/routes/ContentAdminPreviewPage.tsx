import { BookOpenCheck, Database, FileText, ShieldCheck, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { articleContents, videoContentItems } from '@/services/content/content-fixtures';
import { buildOfflineArticleCachePlan } from '@/services/content/offline-article-cache';
import { contentDifficultyLabels } from '@/services/content/content-taxonomy';
import { buildYouTubeImportPlan } from '@/services/content/youtube-import-planner';
import type { ContentStatus } from '@/services/content/content.types';

const contentStatusLabels: Record<ContentStatus, string> = {
  draft: 'ร่าง',
  review: 'รอตรวจ',
  scheduled: 'ตั้งเวลา',
  published: 'เผยแพร่',
  archived: 'เก็บถาวร',
};

function formatBytes(value: number) {
  if (value < 1024) {
    return `${value.toLocaleString()} B`;
  }

  return `${(value / 1024).toFixed(1)} KB`;
}

export function ContentAdminPreviewPage() {
  const importPlan = buildYouTubeImportPlan();
  const cachePlan = buildOfflineArticleCachePlan();

  return (
    <div>
      <PageHeader title="Content Admin Preview" subtitle="Publishing foundation" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <NoticeBox title="Local preview only" tone="warning">
          หน้านี้ใช้ข้อมูลตัวอย่างในเครื่อง ไม่มี CMS จริง ไม่มี YouTube API ไม่มี backend write และไม่มี network call
        </NoticeBox>

        <section className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <FileText aria-hidden="true" className="h-6 w-6 text-kaset-deep" />
            <p className="mt-3 text-2xl font-extrabold text-kaset-ink">{articleContents.length}</p>
            <p className="text-xs font-bold text-slate-500">articles</p>
          </Card>
          <Card className="p-4">
            <Video aria-hidden="true" className="h-6 w-6 text-sky-700" />
            <p className="mt-3 text-2xl font-extrabold text-kaset-ink">{videoContentItems.length}</p>
            <p className="text-xs font-bold text-slate-500">video items</p>
          </Card>
          <Card className="p-4">
            <BookOpenCheck aria-hidden="true" className="h-6 w-6 text-kaset-leaf" />
            <p className="mt-3 text-2xl font-extrabold text-kaset-ink">{cachePlan.offlineReadyArticles}</p>
            <p className="text-xs font-bold text-slate-500">offline ready</p>
          </Card>
          <Card className="p-4">
            <Database aria-hidden="true" className="h-6 w-6 text-amber-700" />
            <p className="mt-3 text-2xl font-extrabold text-kaset-ink">{formatBytes(cachePlan.estimatedTotalBytes)}</p>
            <p className="text-xs font-bold text-slate-500">cache estimate</p>
          </Card>
        </section>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <ShieldCheck aria-hidden="true" className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-extrabold text-kaset-ink">Publishing workflow</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">{'ร่าง -> ตรวจทาน -> ตั้งเวลา -> เผยแพร่ -> เก็บถาวร'}</p>
            </div>
          </div>
          <div className="mt-4 grid gap-2">
            {['draft', 'review', 'scheduled', 'published', 'archived'].map((status) => (
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2" key={status}>
                <span className="text-sm font-bold text-slate-700">{contentStatusLabels[status as ContentStatus]}</span>
                <StatusPill tone={status === 'published' ? 'success' : 'neutral'}>{status}</StatusPill>
              </div>
            ))}
          </div>
        </Card>

        <section className="grid gap-3">
          <h2 className="text-xl font-extrabold text-kaset-ink">Article inventory</h2>
          {articleContents.map((article) => (
            <Card className="p-4" key={article.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link className="line-clamp-2 font-extrabold leading-6 text-kaset-ink" to={`/app/articles/${article.id}`}>
                    {article.title}
                  </Link>
                  <p className="mt-1 text-xs font-bold text-slate-500">{article.author.sourceLabel}</p>
                </div>
                <StatusPill tone="success">{contentStatusLabels[article.status]}</StatusPill>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone="sky">{article.category}</Badge>
                <Badge tone="neutral">{contentDifficultyLabels[article.difficulty]}</Badge>
                <Badge tone="green">v{article.offlineCacheVersion}</Badge>
              </div>
            </Card>
          ))}
        </section>

        <section className="grid gap-3">
          <h2 className="text-xl font-extrabold text-kaset-ink">YouTube import planner</h2>
          <Card className="p-4">
            <div className="mb-4 rounded-lg bg-kaset-mist p-3">
              <p className="text-xs font-bold text-slate-500">Owner channel source</p>
              <p className="mt-1 break-all text-sm font-extrabold text-kaset-ink">{importPlan.channelHandle}</p>
              <a
                className="mt-2 inline-flex text-xs font-bold text-kaset-deep"
                href={importPlan.channelUrl}
                rel="noreferrer"
                target="_blank"
              >
                {importPlan.channelUrl}
              </a>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xl font-extrabold text-kaset-ink">{importPlan.candidateCount}</p>
                <p className="text-[11px] font-bold text-slate-500">candidates</p>
              </div>
              <div>
                <p className="text-xl font-extrabold text-kaset-ink">{importPlan.readyForOutlineCount}</p>
                <p className="text-[11px] font-bold text-slate-500">outlines</p>
              </div>
              <div>
                <p className="text-xl font-extrabold text-kaset-ink">{importPlan.needsTranscriptCount}</p>
                <p className="text-[11px] font-bold text-slate-500">transcripts</p>
              </div>
            </div>
          </Card>
          {importPlan.candidates.slice(0, 4).map((candidate) => (
            <Card className="p-4" key={candidate.videoId}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="line-clamp-2 text-sm font-extrabold leading-5 text-kaset-ink">{candidate.title}</p>
                  <p className="mt-1 text-xs font-bold text-slate-500">{candidate.videoId}</p>
                </div>
                <StatusPill tone={candidate.editorReview === 'ready_for_outline' ? 'success' : 'warning'}>{candidate.editorReview}</StatusPill>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone="sky">{candidate.proposedCategory}</Badge>
                <Badge tone="neutral">{contentDifficultyLabels[candidate.proposedDifficulty]}</Badge>
                <Badge tone={candidate.ownershipCheck === 'mock_owner_channel' ? 'green' : 'gold'}>{candidate.ownershipCheck}</Badge>
              </div>
            </Card>
          ))}
        </section>

        <section className="grid gap-3">
          <h2 className="text-xl font-extrabold text-kaset-ink">Offline cache readiness</h2>
          {cachePlan.statuses.map((status) => (
            <Card className="p-4" key={status.articleId}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="line-clamp-2 text-sm font-extrabold leading-5 text-kaset-ink">{status.title}</p>
                  <p className="mt-1 text-xs font-bold text-slate-500">
                    {status.bodySectionCount} sections · {formatBytes(status.sizeBytesEstimate)}
                  </p>
                </div>
                <StatusPill tone={status.offlineAvailable ? 'success' : 'warning'}>{status.offlineAvailable ? 'ready' : 'pending'}</StatusPill>
              </div>
            </Card>
          ))}
        </section>
      </div>
    </div>
  );
}
