import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { YoutubePage } from '@/routes/YoutubePage';
import { YoutubeVideoDetailPage } from '@/routes/YoutubeVideoDetailPage';
import { filterChannelVideosBySearch } from '@/services/youtube/youtube-service';
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

function countText(text: string, needle: string) {
  return text.split(needle).length - 1;
}

function renderYoutubePage(videos: ChannelVideo[] = []) {
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

function renderYoutubeDetail(path: string, props: Parameters<typeof YoutubeVideoDetailPage>[0] = {}) {
  return renderToString(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/app/youtube/:videoId" element={<YoutubeVideoDetailPage {...props} />} />
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

  test('renders /app/youtube loading state before backend response', () => {
    const html = renderYoutubePageWithProps({});
    const text = visibleText(html);

    expect(text).toContain('กำลังโหลดวิดีโอจากช่อง');
    expect(text).toContain('กำลังเชื่อมวิดีโอจริงจากช่องเจ้าของระบบ');
    expect(text).not.toContain('กำลังเตรียมเชื่อมวิดีโอล่าสุดจากช่อง');
    expect(text).not.toContain('views');
    expect(text).not.toContain('ยอดดู');
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
      viewCount: 1200,
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
    expect(text).toContain('1.2 พันครั้ง');
    expect(text).toContain('à¹€à¸£à¸·à¹ˆà¸­à¸‡à¹€à¸à¸©à¸•à¸£à¸—à¸µà¹ˆà¸„à¸™à¹„à¸—à¸¢à¸„à¸§à¸£à¸£à¸¹à¹‰');
    expect(html).toContain('/app/youtube/backend-video');
    expect(html).not.toContain('href="https://www.youtube.com/watch?v=backend-video"');
    expect(text).toContain('ดูวิดีโอ');
    expect(text).not.toContain('ดูในแอพ');
    expect(text).not.toContain('เปิด YouTube');
    expect(text).not.toContain('views');
    expect(text).not.toContain('à¸¢à¸­à¸”à¸”à¸¹');
    expect(text).not.toContain('à¹„à¸¥à¸à¹Œ');
    expect(text).not.toContain('à¸„à¸­à¸¡à¹€à¸¡à¸™à¸•à¹Œ');
  });

  test('renders /app/youtube video items as compact title-only rows', () => {
    const compactVideo: ChannelVideo = {
      id: 'm128-compact-library-video',
      videoId: 'm128-compact-library-video',
      title: 'M128 compact video list title that can wrap cleanly without a description block',
      url: 'https://www.youtube.com/watch?v=m128-compact-library-video',
      thumbnailUrl: 'https://img.youtube.com/vi/m128-compact-library-video/hqdefault.jpg',
      publishedAt: '2026-05-20T00:00:00.000Z',
      description: 'M128 library full description should not render in compact list cards',
      source: 'youtube_api',
      isReal: true,
      channelName: 'M128 Channel',
      viewCount: 12300,
    };
    const html = renderYoutubePage([compactVideo]);
    const text = visibleText(html);

    expect(text).toContain('M128 Channel');
    expect(text).toContain('M128 compact video list title that can wrap cleanly without a description block');
    expect(text).toContain('เผยแพร่ 20 พ.ค. 2569');
    expect(text).toContain('1.2 หมื่นครั้ง');
    expect(html).toContain('/app/youtube/m128-compact-library-video');
    expect(html).not.toContain('href="https://www.youtube.com/watch?v=m128-compact-library-video"');
    expect(countText(text, 'ดูวิดีโอ')).toBe(1);
    expect(text).not.toContain('ดูในแอพ');
    expect(text).not.toContain('เปิด YouTube');
    expect(text).not.toContain('M128 library full description should not render in compact list cards');
    expect(html).toContain('grid-cols-[112px_minmax(0,1fr)]');
    expect(html).toContain('[-webkit-line-clamp:3]');
    expect(text).not.toContain('views');
  });

  test('renders compact in-channel search controls for loaded videos', () => {
    const html = renderYoutubePage([realVideo]);
    const text = visibleText(html);

    expect(text).toContain('ค้นหาวิดีโอในช่อง');
    expect(html).toContain('id="youtube-channel-search"');
    expect(html).toContain('placeholder="ค้นหาเรื่องที่สนใจ เช่น ขุดสระ ปุ๋ย น้ำ"');
  });

  test('filters loaded channel videos by title and description without calling YouTube search', () => {
    const pondVideo: ChannelVideo = {
      ...realVideo,
      id: 'pond-video',
      videoId: 'pond-video',
      title: 'ขุดสระให้เก็บน้ำได้ดี',
      url: 'https://www.youtube.com/watch?v=pond-video',
      description: 'วางผังบ่อและคันดิน',
    };
    const fertilizerVideo: ChannelVideo = {
      ...realVideo,
      id: 'fertilizer-video',
      videoId: 'fertilizer-video',
      title: 'ดูแลดินก่อนปลูก',
      url: 'https://www.youtube.com/watch?v=fertilizer-video',
      description: 'สูตรปุ๋ยหมักและน้ำหมักสำหรับแปลงผัก',
    };

    expect(filterChannelVideosBySearch([pondVideo, fertilizerVideo], 'ขุดสระ')).toEqual([pondVideo]);
    expect(filterChannelVideosBySearch([pondVideo, fertilizerVideo], 'น้ำหมัก')).toEqual([fertilizerVideo]);
    expect(filterChannelVideosBySearch([pondVideo, fertilizerVideo], '')).toEqual([pondVideo, fertilizerVideo]);
  });

  test('renders search results and no-match state from already loaded videos', () => {
    const pondVideo: ChannelVideo = {
      ...realVideo,
      id: 'm131-pond-video',
      videoId: 'm131-pond-video',
      title: 'M131 ขุดสระเก็บน้ำ',
      url: 'https://www.youtube.com/watch?v=m131-pond-video',
      description: 'เลือกมุมบ่อให้เหมาะกับพื้นที่',
    };
    const fertilizerVideo: ChannelVideo = {
      ...realVideo,
      id: 'm131-fertilizer-video',
      videoId: 'm131-fertilizer-video',
      title: 'M131 ปุ๋ยหมักในสวน',
      url: 'https://www.youtube.com/watch?v=m131-fertilizer-video',
      description: 'วิธีทำปุ๋ยหมักให้ปลอดภัย',
    };
    const matchHtml = renderYoutubePageWithProps({
      initialSearchTerm: 'ขุดสระ',
      videos: [pondVideo, fertilizerVideo],
    });
    const matchText = visibleText(matchHtml);

    expect(matchText).toContain('M131 ขุดสระเก็บน้ำ');
    expect(matchText).not.toContain('M131 ปุ๋ยหมักในสวน');
    expect(matchText).toContain('ล้างคำค้น');
    expect(matchHtml).not.toContain('search.list');

    const noMatchHtml = renderYoutubePageWithProps({
      initialSearchTerm: 'แตงโม',
      videos: [pondVideo, fertilizerVideo],
    });
    const noMatchText = visibleText(noMatchHtml);

    expect(noMatchText).toContain('ไม่พบวิดีโอที่ตรงกับคำค้น');
    expect(noMatchText).toContain('ล้างคำค้น');
    expect(noMatchText).not.toContain('M131 ขุดสระเก็บน้ำ');
    expect(noMatchText).not.toContain('M131 ปุ๋ยหมักในสวน');
  });

  test('renders stale /app/youtube backend videos with stale copy', () => {
    const staleVideo: ChannelVideo = {
      id: 'm129-stale-library-video',
      videoId: 'm129-stale-library-video',
      title: 'M129 stale library video',
      url: 'https://www.youtube.com/watch?v=m129-stale-library-video',
      thumbnailUrl: 'https://img.youtube.com/vi/m129-stale-library-video/hqdefault.jpg',
      publishedAt: '2026-05-20T00:00:00.000Z',
      description: 'M129 stale library description should stay hidden',
      source: 'youtube_api',
      isReal: true,
      channelName: 'M129 Channel',
      fetchedAt: '2026-05-28T02:00:00.000Z',
    };
    const html = renderYoutubePageWithProps({
      backendResponse: {
        status: 'stale',
        channel: {
          handle: '@ruengkaset',
          title: 'M129 Channel',
          url: 'https://www.youtube.com/@ruengkaset',
        },
        videos: [staleVideo],
      },
    });
    const text = visibleText(html);

    expect(text).toContain('แสดงข้อมูลล่าสุดที่เคยโหลดได้');
    expect(text).toContain('ข้อมูลอาจไม่ล่าสุด');
    expect(text).toContain('M129 stale library video');
    expect(text).not.toContain('M129 stale library description should stay hidden');
    expect(text).not.toContain('views');
  });

  test('renders friendly /app/youtube error state without raw backend errors', () => {
    const html = renderYoutubePageWithProps({
      backendResponse: {
        status: 'error',
        channel: {
          handle: '@ruengkaset',
          url: 'https://www.youtube.com/@ruengkaset',
        },
        videos: [],
        errorMessage: 'Raw YouTube backend error should not render',
      },
    });
    const text = visibleText(html);

    expect(text).toContain('ยังโหลดวิดีโอจากช่องไม่ได้');
    expect(text).toContain('กรุณาลองใหม่ภายหลัง');
    expect(text).toContain('เปิดช่อง YouTube');
    expect(html).toContain('https://www.youtube.com/@ruengkaset');
    expect(text).not.toContain('Raw YouTube backend error should not render');
    expect(text).not.toContain('views');
    expect(text).not.toContain('ยอดดู');
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
    const html = renderYoutubeDetail('/app/youtube/sample-video-id', { videos: [] });
    const text = visibleText(html);

    expect(text).toContain('ยังไม่พบวิดีโอนี้');
    expect(text).toContain('กำลังเตรียมเชื่อมวิดีโอจากช่อง');
    expect(html).not.toContain('youtube.com/embed/sample-video-id');
    expect(text).not.toContain('จัดการน้ำในนาข้าวช่วงฝนแปรปรวน');
    expect(text).not.toContain('views');
    expect(text).not.toContain('ยอดดู');
  });

  test('renders /app/youtube/:videoId with the official YouTube iframe player', () => {
    const detailVideo: ChannelVideo = {
      ...realVideo,
      videoId: 'real-owner-video',
      viewCount: 1200000,
    };
    const html = renderYoutubeDetail('/app/youtube/real-owner-video', { videos: [detailVideo] });
    const text = visibleText(html);

    expect(html).toContain('https://www.youtube.com/embed/real-owner-video');
    expect(html).not.toContain('autoplay=1');
    expect(html).toContain('allowfullscreen=""');
    expect(html).toContain('referrerPolicy="strict-origin-when-cross-origin"');
    expect(text).toContain('ปลูกผักให้รอดช่วงฝนจริงจากช่อง');
    expect(text).toContain('1.2 ล้านครั้ง');
    expect(text).toContain('เปิดใน YouTube');
    expect(text).toContain('วิดีโอทั้งหมด');
    expect(text).not.toContain('views');
    expect(text).not.toContain('ยอดดู');
  });
});
