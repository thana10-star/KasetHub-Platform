import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { YoutubePage } from '@/routes/YoutubePage';
import { YoutubeVideoDetailPage } from '@/routes/YoutubeVideoDetailPage';
import type { ChannelVideo } from '@/services/youtube/youtube.types';

const realVideo: ChannelVideo = {
  id: 'real-owner-video',
  title: 'ปลูกผักให้รอดช่วงฝนจริงจากช่อง',
  url: 'https://www.youtube.com/watch?v=real-owner-video',
  thumbnailUrl: 'https://img.youtube.com/vi/real-owner-video/hqdefault.jpg',
  publishedAt: '2026-05-20T00:00:00.000Z',
  description: 'วิดีโอจริงที่เจ้าของระบบเลือกให้แสดงในหน้าวิดีโอ',
  source: 'owner_curated',
  isReal: true,
  channelName: 'เรื่องเกษตรที่คนไทยควรรู้',
};

function visibleText(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function renderYoutubePage(videos?: ChannelVideo[]) {
  return renderToString(
    <MemoryRouter>
      <YoutubePage videos={videos} />
    </MemoryRouter>,
  );
}

function renderYoutubePageWithProps(props: Parameters<typeof YoutubePage>[0]) {
  return renderToString(
    <MemoryRouter>
      <YoutubePage {...props} />
    </MemoryRouter>,
  );
}

function renderYoutubeDetail(path: string) {
  return renderToString(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/app/youtube/:videoId" element={<YoutubeVideoDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('M124 YouTube latest video foundation route', () => {
  test('renders /app/youtube with a source-pending state when no real videos exist', () => {
    const html = renderYoutubePage();
    const text = visibleText(html);

    expect(text).toContain('วิดีโอเกษตร');
    expect(text).toContain('กำลังเตรียมเชื่อมวิดีโอล่าสุดจากช่อง');
    expect(text).toContain('วิดีโอเกษตรกำลังเตรียมเชื่อมต่อ');
    expect(text).toContain('กลับหน้าแรก');
    expect(html).toContain('/app');
    expect(html).toContain('https://www.youtube.com/@ruengkaset');
  });

  test('does not surface legacy mock video data or fake engagement on /app/youtube', () => {
    const text = visibleText(renderYoutubePage());

    expect(text).not.toContain('35k');
    expect(text).not.toContain('20k/day');
    expect(text).not.toContain('views');
    expect(text).not.toContain('ยอดดู');
    expect(text).not.toContain('ไลก์');
    expect(text).not.toContain('คอมเมนต์');
    expect(text).not.toContain('จัดการน้ำในนาข้าวช่วงฝนแปรปรวน');
  });

  test('renders a valid owner-curated video on /app/youtube without fake engagement', () => {
    const html = renderYoutubePage([realVideo]);
    const text = visibleText(html);

    expect(text).toContain('วิดีโอจากช่องจริง');
    expect(text).toContain('วิดีโอล่าสุดจากช่อง');
    expect(text).toContain('เรื่องเกษตรที่คนไทยควรรู้');
    expect(text).toContain('ปลูกผักให้รอดช่วงฝนจริงจากช่อง');
    expect(text).not.toContain('วิดีโอจริงที่เจ้าของระบบเลือกให้แสดงในหน้าวิดีโอ');
    expect(text).toContain('เผยแพร่ 20 พ.ค. 2569');
    expect(text).toContain('ดูวิดีโอ');
    expect(html).toContain('https://www.youtube.com/watch?v=real-owner-video');
    expect(html).toContain('https://img.youtube.com/vi/real-owner-video/hqdefault.jpg');
    expect(text).not.toContain('views');
    expect(text).not.toContain('ยอดดู');
    expect(text).not.toContain('ไลก์');
    expect(text).not.toContain('คอมเมนต์');
  });

  test('renders backend video library results on /app/youtube without fake engagement', () => {
    const backendVideo: ChannelVideo = {
      ...realVideo,
      id: 'backend-video',
      videoId: 'backend-video',
      title: 'à¸§à¸´à¸”à¸µà¹‚à¸­ backend à¸ˆà¸²à¸à¸Šà¹ˆà¸­à¸‡',
      url: 'https://www.youtube.com/watch?v=backend-video',
      source: 'youtube_api',
      fetchedAt: '2026-05-28T02:00:00.000Z',
    };
    const html = renderYoutubePageWithProps({
      backendResponse: {
        status: 'ready',
        channel: {
          handle: '@ruengkaset',
          title: 'à¹€à¸£à¸·à¹ˆà¸­à¸‡à¹€à¸à¸©à¸•à¸£à¸—à¸µà¹ˆà¸„à¸™à¹„à¸—à¸¢à¸„à¸§à¸£à¸£à¸¹à¹‰',
          url: 'https://www.youtube.com/@ruengkaset',
        },
        videos: [backendVideo],
      },
    });
    const text = visibleText(html);

    expect(text).toContain('à¸§à¸´à¸”à¸µà¹‚à¸­ backend à¸ˆà¸²à¸à¸Šà¹ˆà¸­à¸‡');
    expect(text).toContain('à¹€à¸£à¸·à¹ˆà¸­à¸‡à¹€à¸à¸©à¸•à¸£à¸—à¸µà¹ˆà¸„à¸™à¹„à¸—à¸¢à¸„à¸§à¸£à¸£à¸¹à¹‰');
    expect(html).toContain('https://www.youtube.com/watch?v=backend-video');
    expect(text).not.toContain('views');
    expect(text).not.toContain('à¸¢à¸­à¸”à¸”à¸¹');
    expect(text).not.toContain('à¹„à¸¥à¸à¹Œ');
    expect(text).not.toContain('à¸„à¸­à¸¡à¹€à¸¡à¸™à¸•à¹Œ');
  });

  test('renders /app/youtube video items as compact title-only rows', () => {
    const compactVideo: ChannelVideo = {
      id: 'm128-compact-library-video',
      title: 'M128 compact video list title that can wrap cleanly without a description block',
      url: 'https://www.youtube.com/watch?v=m128-compact-library-video',
      thumbnailUrl: 'https://img.youtube.com/vi/m128-compact-library-video/hqdefault.jpg',
      publishedAt: '2026-05-20T00:00:00.000Z',
      description: 'M128 library full description should not render in compact list cards',
      source: 'youtube_api',
      isReal: true,
      channelName: 'M128 Channel',
    };
    const html = renderYoutubePage([compactVideo]);
    const text = visibleText(html);

    expect(text).toContain('M128 Channel');
    expect(text).toContain('M128 compact video list title that can wrap cleanly without a description block');
    expect(text).toContain('เผยแพร่ 20 พ.ค. 2569');
    expect(text).not.toContain('M128 library full description should not render in compact list cards');
    expect(html).toContain('grid-cols-[112px_minmax(0,1fr)]');
    expect(html).toContain('[-webkit-line-clamp:3]');
    expect(text).not.toContain('views');
  });

  test('keeps /app/youtube source-pending when provided entries are not real videos', () => {
    const text = visibleText(
      renderYoutubePage([
        {
          ...realVideo,
          id: 'channel-only',
          title: 'หัวข้อที่ไม่ควรแสดง',
          url: 'https://www.youtube.com/@ruengkaset',
        },
        {
          ...realVideo,
          id: 'not-real',
          title: 'วิดีโอที่ยังไม่ยืนยัน',
          isReal: false,
        },
      ]),
    );

    expect(text).toContain('กำลังเตรียมเชื่อมวิดีโอล่าสุดจากช่อง');
    expect(text).toContain('วิดีโอเกษตรกำลังเตรียมเชื่อมต่อ');
    expect(text).not.toContain('หัวข้อที่ไม่ควรแสดง');
    expect(text).not.toContain('วิดีโอที่ยังไม่ยืนยัน');
  });

  test('keeps unknown /app/youtube detail routes honest instead of falling back to mock data', () => {
    const text = visibleText(renderYoutubeDetail('/app/youtube/sample-video-id'));

    expect(text).toContain('ยังไม่มีวิดีโอจริงสำหรับรายการนี้');
    expect(text).toContain('กำลังเตรียมเชื่อมวิดีโอจากช่อง');
    expect(text).not.toContain('จัดการน้ำในนาข้าวช่วงฝนแปรปรวน');
    expect(text).not.toContain('views');
    expect(text).not.toContain('ยอดดู');
  });
});
