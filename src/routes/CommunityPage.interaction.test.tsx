import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Simulate } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import { CommunityPage } from '@/routes/CommunityPage';
import type {
  CommunityActionResult,
  CommunityComment,
  CommunityListPostsResult,
  CommunityPost,
  CommunityReadiness,
  CommunityService,
} from '@/services/community/community.types';
import { communityPostCategories } from '@/services/community/community.types';

const readiness: CommunityReadiness = {
  path: 'real',
  canReadPublishedPosts: true,
  canWrite: true,
  canUploadImage: true,
  canCreateNotifications: false,
  writesFeatureFlagEnabled: true,
  hasAuthenticatedUser: true,
  backendServiceReady: true,
  writeGateMessage: 'ready',
  imageGateMessage: 'ready',
  blockers: [],
};

const basePost: CommunityPost = {
  id: 'post-1',
  authorUserId: 'user-a',
  contentText: 'real staging post',
  category: communityPostCategories[6],
  image: {
    imagePath: 'user-a/post-1/photo.jpg',
    mimeType: 'image/jpeg',
    sizeBytes: 1200,
  },
  status: 'published',
  likeCount: 0,
  commentCount: 0,
  reportCount: 0,
  createdAt: '2026-05-26T00:00:00.000Z',
  updatedAt: '2026-05-26T00:00:00.000Z',
  likedByCurrentUser: false,
  ownedByCurrentUser: false,
};

const baseComment: CommunityComment = {
  id: 'comment-1',
  postId: 'post-1',
  authorUserId: 'user-b',
  contentText: 'comment from staging',
  status: 'published',
  reportCount: 0,
  createdAt: '2026-05-26T00:01:00.000Z',
  updatedAt: '2026-05-26T00:01:00.000Z',
};

function ok(): Promise<CommunityActionResult> {
  return Promise.resolve({ ok: true, data: undefined });
}

function createService(overrides: Partial<CommunityService> = {}) {
  let liked = false;
  let commentCount = 0;
  const createComment = vi.fn(async (): Promise<CommunityActionResult<CommunityComment>> => {
    commentCount = 1;
    return {
      ok: true,
      data: baseComment,
    };
  });

  const service: CommunityService = {
    getReadiness: () => readiness,
    listPosts: async (): Promise<CommunityListPostsResult> => ({
      posts: [
        {
          ...basePost,
          likeCount: liked ? 1 : 0,
          likedByCurrentUser: liked,
          commentCount,
        },
      ],
      readiness,
    }),
    createPost: async () => ({
      ok: true,
      data: basePost,
    }),
    hideOwnPost: async () => ok(),
    deleteOwnPost: async () => ok(),
    listComments: async () => ({ ok: true, data: [] }),
    createComment,
    hideOwnComment: async () => ok(),
    likePost: async () => {
      liked = true;
      return { ok: true, data: undefined };
    },
    unlikePost: async () => {
      liked = false;
      return { ok: true, data: undefined };
    },
    reportPost: async () => ok(),
    reportComment: async () => ok(),
    listNotifications: async () => ({ ok: false, code: 'notification_backend_needed', message: 'backend needed' }),
    markNotificationRead: async () => ({ ok: false, code: 'notification_backend_needed', message: 'backend needed' }),
    ...overrides,
  };

  return { service, createComment };
}

function setupDom() {
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
    url: 'http://localhost/app/community',
  });
  vi.stubGlobal('window', dom.window);
  vi.stubGlobal('document', dom.window.document);
  vi.stubGlobal('navigator', dom.window.navigator);
  vi.stubGlobal('HTMLElement', dom.window.HTMLElement);
  vi.stubGlobal('HTMLTextAreaElement', dom.window.HTMLTextAreaElement);
  vi.stubGlobal('Event', dom.window.Event);
  vi.stubGlobal('MouseEvent', dom.window.MouseEvent);
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  return dom;
}

function findButton(container: HTMLElement, text: string) {
  const button = Array.from(container.querySelectorAll('button')).find((element) =>
    element.textContent?.includes(text),
  );
  if (!button) {
    throw new Error(`Button not found: ${text}`);
  }
  return button;
}

function findCommentTextarea(container: HTMLElement) {
  const textarea = container.querySelector<HTMLTextAreaElement>(
    'textarea[placeholder="เขียนคอมเมนต์"]',
  );
  if (!textarea) {
    throw new Error('Missing comment textarea');
  }
  return textarea;
}

function setTextareaValue(textarea: HTMLTextAreaElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
  setter?.call(textarea, value);
  Simulate.change(textarea, { target: { value } as unknown as EventTarget });
}

async function flush() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

describe('M115 Community interactions', () => {
  let root: Root | null = null;

  beforeEach(() => {
    setupDom();
  });

  afterEach(() => {
    if (root) {
      act(() => root?.unmount());
      root = null;
    }
    vi.unstubAllGlobals();
  });

  test('clicking like and unlike updates the visible count', async () => {
    const { service } = createService();
    const container = document.getElementById('root');
    if (!container) throw new Error('Missing root');
    root = createRoot(container);

    await act(async () => {
      root?.render(
        <MemoryRouter>
          <CommunityPage readinessOverride={readiness} serviceOverride={service} />
        </MemoryRouter>,
      );
    });
    await flush();

    expect(container.textContent).toContain('Like 0');

    await act(async () => {
      findButton(container, 'Like 0').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    await flush();
    expect(container.textContent).toContain('เลิกไลก์ 1');

    await act(async () => {
      findButton(container, 'เลิกไลก์ 1').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    await flush();
    expect(container.textContent).toContain('Like 0');
  });

  test('successful like does not revert to zero when backend refresh returns stale counters', async () => {
    const { service } = createService({
      listPosts: async (): Promise<CommunityListPostsResult> => ({
        posts: [
          {
            ...basePost,
            likeCount: 0,
            likedByCurrentUser: false,
          },
        ],
        readiness,
      }),
    });
    const container = document.getElementById('root');
    if (!container) throw new Error('Missing root');
    root = createRoot(container);

    await act(async () => {
      root?.render(
        <MemoryRouter>
          <CommunityPage readinessOverride={readiness} serviceOverride={service} />
        </MemoryRouter>,
      );
    });
    await flush();

    await act(async () => {
      findButton(container, 'Like 0').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    await flush();
    await flush();
    expect(container.textContent).toContain('เลิกไลก์ 1');

    await act(async () => {
      findButton(container, 'เลิกไลก์ 1').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    await flush();
    await flush();
    expect(container.textContent).toContain('Like 0');
  });

  test('clicking comments opens a safe section even when listComments throws', async () => {
    const { service } = createService({
      listComments: async () => {
        throw new Error('staging comment policy failure');
      },
    });
    const container = document.getElementById('root');
    if (!container) throw new Error('Missing root');
    root = createRoot(container);

    await act(async () => {
      root?.render(
        <MemoryRouter>
          <CommunityPage readinessOverride={readiness} serviceOverride={service} />
        </MemoryRouter>,
      );
    });
    await flush();

    await act(async () => {
      findButton(container, 'คอมเมนต์ 0').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    await flush();

    expect(container.textContent).toContain('ยังไม่มีคอมเมนต์จริง');
    expect(container.textContent).toContain('โหลดคอมเมนต์ไม่สำเร็จ');
    expect(findCommentTextarea(container)).toBeTruthy();
  });

  test('valid comment submit calls service and empty comment stays on page gracefully', async () => {
    const { service, createComment } = createService();
    const container = document.getElementById('root');
    if (!container) throw new Error('Missing root');
    root = createRoot(container);

    await act(async () => {
      root?.render(
        <MemoryRouter>
          <CommunityPage readinessOverride={readiness} serviceOverride={service} />
        </MemoryRouter>,
      );
    });
    await flush();

    await act(async () => {
      findButton(container, 'คอมเมนต์ 0').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    await flush();

    await act(async () => {
      findButton(container, 'ส่งคอมเมนต์').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    await flush();
    expect(container.textContent).toContain('กรุณาเขียนคอมเมนต์');

    const textarea = findCommentTextarea(container);

    await act(async () => {
      setTextareaValue(textarea, 'reply from staging UI');
    });
    await act(async () => {
      findButton(container, 'ส่งคอมเมนต์').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    await flush();

    expect(createComment).toHaveBeenCalledWith('post-1', { contentText: 'reply from staging UI' });
    expect(container.textContent).toContain('comment from staging');
  });

  test('typing Thai text into the comment textarea keeps the app visible and controlled', async () => {
    const { service } = createService();
    const container = document.getElementById('root');
    if (!container) throw new Error('Missing root');
    root = createRoot(container);

    await act(async () => {
      root?.render(
        <MemoryRouter>
          <CommunityPage readinessOverride={readiness} serviceOverride={service} />
        </MemoryRouter>,
      );
    });
    await flush();

    await act(async () => {
      findButton(container, 'คอมเมนต์ 0').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    await flush();

    const textarea = findCommentTextarea(container);
    await act(async () => {
      setTextareaValue(textarea, 'ทดสอบคอมเมนต์จากมือถือ');
    });
    await flush();

    expect(findCommentTextarea(container).value).toBe('ทดสอบคอมเมนต์จากมือถือ');
    expect(container.textContent).toContain('ชุมชนเกษตร');
    expect(container.textContent).toContain('ส่งคอมเมนต์');
  });

  test('comment service errors show a friendly message instead of crashing', async () => {
    const createComment = vi.fn(async (): Promise<CommunityActionResult<CommunityComment>> => ({
      ok: false,
      code: 'supabase_write_failed',
      message: 'ส่งคอมเมนต์ไม่สำเร็จ ลองอีกครั้ง',
    }));
    const { service } = createService({ createComment });
    const container = document.getElementById('root');
    if (!container) throw new Error('Missing root');
    root = createRoot(container);

    await act(async () => {
      root?.render(
        <MemoryRouter>
          <CommunityPage readinessOverride={readiness} serviceOverride={service} />
        </MemoryRouter>,
      );
    });
    await flush();

    await act(async () => {
      findButton(container, 'คอมเมนต์ 0').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    await flush();

    await act(async () => {
      setTextareaValue(findCommentTextarea(container), 'มีโรคใบไหม้ควรทำอย่างไร');
    });
    await act(async () => {
      findButton(container, 'ส่งคอมเมนต์').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    await flush();

    expect(createComment).toHaveBeenCalledWith('post-1', { contentText: 'มีโรคใบไหม้ควรทำอย่างไร' });
    expect(container.textContent).toContain('ส่งคอมเมนต์ไม่สำเร็จ');
    expect(container.textContent).toContain('ชุมชนเกษตร');
  });
});
