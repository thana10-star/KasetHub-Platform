import { BellPlus, PlaySquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { YouTubeChannelProfile } from '@/types/youtube';

type YouTubeChannelHeroProps = {
  channel: YouTubeChannelProfile;
};

export function YouTubeChannelHero({ channel }: YouTubeChannelHeroProps) {
  return (
    <Card className="overflow-hidden bg-kaset-deep text-white">
      <div className="relative p-5">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-14 left-10 h-28 w-28 rounded-full bg-kaset-leaf/25" />
        <div className="relative">
          <div className="mb-4 flex items-center gap-3">
            <span className="grid h-14 w-14 place-items-center rounded-lg bg-white text-kaset-deep">
              <PlaySquare aria-hidden="true" className="h-7 w-7" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-emerald-50/90">{channel.handle}</p>
              <h2 className="truncate text-xl font-extrabold">{channel.name}</h2>
            </div>
          </div>
          <p className="text-sm leading-6 text-emerald-50/90">{channel.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {channel.contentPillars.slice(0, 4).map((pillar) => (
              <Badge className="bg-white/15 text-white" key={pillar} tone="green">
                {pillar}
              </Badge>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <a
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-3 text-xs font-bold text-kaset-deep"
              href={channel.youtubeUrl}
              rel="noreferrer"
              target="_blank"
            >
              <BellPlus aria-hidden="true" className="h-4 w-4" />
              ติดตามช่อง YouTube
            </a>
            <Link to={`/app/youtube/${channel.latestVideoId}`}>
              <Button className="w-full bg-kaset-leaf px-3 text-xs hover:bg-emerald-600" variant="primary">
                ดูวิดีโอล่าสุด
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
