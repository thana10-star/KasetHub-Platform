import { Search, Sparkles, Tv } from 'lucide-react';
import { useMemo, useState } from 'react';
import { YouTubeChannelHero } from '@/components/kaset/YouTubeChannelHero';
import { YouTubeVideoCard } from '@/components/kaset/YouTubeVideoCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { youtubeCategories, youtubeChannelProfile, youtubePlaylists, youtubeVideos } from '@/data/youtubeData';
import type { VideoCategory } from '@/types/youtube';

type ActiveCategory = 'ทั้งหมด' | VideoCategory;

export function YoutubePage() {
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState('');
  const featuredVideo = youtubeVideos.find((video) => video.videoId === youtubeChannelProfile.latestVideoId) ?? youtubeVideos[0];

  const filteredVideos = useMemo(() => {
    return youtubeVideos.filter((video) => {
      const matchesCategory = activeCategory === 'ทั้งหมด' ? true : video.category === activeCategory;
      const matchesSearch = searchQuery.trim()
        ? `${video.title} ${video.description} ${video.tags.join(' ')}`
            .toLowerCase()
            .includes(searchQuery.trim().toLowerCase())
        : true;

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const shorts = filteredVideos.filter((video) => video.isShort);
  const latestVideos = filteredVideos.filter((video) => !video.isShort && video.videoId !== featuredVideo.videoId);

  return (
    <div>
      <PageHeader title="YouTube Hub" subtitle="ฐานช่องวิดีโอเกษตรพร้อมต่อ API" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <YouTubeChannelHero channel={youtubeChannelProfile} />

        <NoticeBox tone="info" title="รวมวิดีโอเกษตรไว้หาเจอง่าย">
          ค้นหา เลือกหมวด บันทึกวิดีโอ และแชร์ให้เพื่อนได้ หน้านี้ยังใช้ข้อมูลตัวอย่างเพื่อเตรียมต่อ YouTube API
        </NoticeBox>

        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 text-center">
            <p className="text-xl font-extrabold text-kaset-deep">{youtubeChannelProfile.subscriberCountLabel}</p>
            <p className="mt-1 text-[11px] font-semibold leading-4 text-slate-500">Subscribers</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xl font-extrabold text-kaset-deep">{youtubeChannelProfile.dailyViewsLabel}</p>
            <p className="mt-1 text-[11px] font-semibold leading-4 text-slate-500">Daily views</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xl font-extrabold text-kaset-deep">{youtubeChannelProfile.contentPillars.length}</p>
            <p className="mt-1 text-[11px] font-semibold leading-4 text-slate-500">หมวดวิดีโอ</p>
          </Card>
        </div>

        <Card className="p-3">
          <label className="flex min-h-12 items-center gap-3 rounded-lg bg-kaset-mist px-3 text-sm text-slate-500">
            <Search aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <input
              className="min-w-0 flex-1 bg-transparent text-kaset-ink outline-none placeholder:text-slate-400"
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="ค้นหาวิดีโอ เช่น โรคใบจุด ปุ๋ย ดิน"
              value={searchQuery}
            />
          </label>
        </Card>

        <div className="-mx-5 overflow-x-auto px-5">
          <div className="flex min-w-max gap-2">
            {youtubeCategories.map((category) => (
              <button key={category} onClick={() => setActiveCategory(category)} type="button">
                <Badge className={activeCategory === category ? 'bg-kaset-deep text-white' : ''} tone="neutral">
                  {category}
                </Badge>
              </button>
            ))}
          </div>
        </div>

        {filteredVideos.length === 0 ? (
          <Card className="p-5 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <Search aria-hidden="true" className="h-7 w-7" />
            </span>
            <h2 className="mt-4 text-lg font-extrabold text-kaset-ink">ยังไม่พบวิดีโอที่ตรงกับการค้นหา</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">ลองเปลี่ยนคำค้นหรือเลือกหมวด “ทั้งหมด”</p>
          </Card>
        ) : (
          <>
            <section className="grid gap-3">
              <SectionHeader eyebrow="Featured" title="วิดีโอแนะนำจากช่อง" />
              <YouTubeVideoCard featured video={featuredVideo} />
            </section>

            <section className="grid gap-3">
              <SectionHeader eyebrow="Playlists" title="เพลย์ลิสต์หลัก" />
              <div className="grid gap-3">
                {youtubePlaylists.map((playlist) => {
                  const count = playlist.videoIds.length;

                  return (
                    <Card className="p-4" key={playlist.playlistId}>
                      <div className="flex items-start gap-3">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                          <Tv aria-hidden="true" className="h-5 w-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <Badge className="mb-2" tone="green">
                            {playlist.category}
                          </Badge>
                          <h3 className="font-extrabold leading-6 text-kaset-ink">{playlist.title}</h3>
                          <p className="mt-1 text-sm leading-6 text-slate-600">{playlist.description}</p>
                          <p className="mt-2 text-xs font-semibold text-slate-500">
                            {count} วิดีโอ · {playlist.sourceStatus}
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </section>

            <section className="grid gap-3">
              <SectionHeader eyebrow="Latest" title="วิดีโอล่าสุด" />
              <div className="grid gap-3">
                {latestVideos.map((video) => (
                  <YouTubeVideoCard key={video.videoId} video={video} />
                ))}
              </div>
            </section>

            {shorts.length > 0 ? (
              <section className="grid gap-3">
                <SectionHeader eyebrow="Shorts" title="คลิปสั้นเกษตร" />
                <div className="grid gap-3">
                  {shorts.map((video) => (
                    <YouTubeVideoCard compact key={video.videoId} video={video} />
                  ))}
                </div>
              </section>
            ) : null}

            <Card className="p-4">
              <div className="flex gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-800">
                  <Sparkles aria-hidden="true" className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-extrabold text-kaset-ink">พร้อมต่อ YouTube Data API</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    หน้านี้ใช้ mock data ที่จัดรูปแบบให้รองรับ channel, playlist, video, shorts และสถิติจริงในอนาคต
                  </p>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
