import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { YoutubePage } from '@/routes/YoutubePage';
import { YoutubeVideoDetailPage } from '@/routes/YoutubeVideoDetailPage';

function visibleText(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function renderYoutubePage() {
  return renderToString(
    <MemoryRouter>
      <YoutubePage />
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

  test('keeps unknown /app/youtube detail routes honest instead of falling back to mock data', () => {
    const text = visibleText(renderYoutubeDetail('/app/youtube/sample-video-id'));

    expect(text).toContain('ยังไม่มีวิดีโอจริงสำหรับรายการนี้');
    expect(text).toContain('กำลังเตรียมเชื่อมวิดีโอจากช่อง');
    expect(text).not.toContain('จัดการน้ำในนาข้าวช่วงฝนแปรปรวน');
    expect(text).not.toContain('views');
    expect(text).not.toContain('ยอดดู');
  });
});
