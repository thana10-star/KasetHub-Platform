import { Bookmark, PlaySquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { YouTubeVideoCard } from '@/components/kaset/YouTubeVideoCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useSavedVideos } from '@/hooks/useSavedVideos';

export function SavedVideosPage() {
  const { savedVideos } = useSavedVideos();

  return (
    <div>
      <PageHeader title="วิดีโอที่บันทึกไว้" subtitle="คลังวิดีโอเกษตรสำหรับกลับมาดูภายหลัง" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="bg-kaset-deep p-5 text-white">
          <div className="flex gap-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
              <Bookmark aria-hidden="true" className="h-7 w-7" />
            </span>
            <div>
              <h2 className="text-xl font-extrabold">Saved Videos Foundation</h2>
              <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                บันทึกวิดีโอด้วย localStorage เพื่อเตรียมต่อยอดสู่บัญชีผู้ใช้และ YouTube API จริง
              </p>
            </div>
          </div>
        </Card>

        {savedVideos.length > 0 ? (
          <section className="grid gap-4">
            {savedVideos.map((video) => (
              <YouTubeVideoCard key={video.videoId} savedView video={video} />
            ))}
          </section>
        ) : (
          <Card className="p-5 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <PlaySquare aria-hidden="true" className="h-7 w-7" />
            </span>
            <h2 className="mt-4 text-lg font-extrabold text-kaset-ink">ยังไม่มีวิดีโอที่บันทึกไว้</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              แตะ “บันทึกวิดีโอ” จาก YouTube Hub หรือหน้ารายละเอียดวิดีโอ เพื่อเก็บไว้ดูภายหลัง
            </p>
            <Link to="/app/youtube">
              <Button className="mt-5 w-full">
                <PlaySquare aria-hidden="true" className="h-4 w-4" />
                ไปที่ YouTube Hub
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
