import type { Article, SavedArticle } from '@/types/kaset';
import type { SavedVideo, YouTubeVideo } from '@/types/youtube';
import type {
  FarmHistoryRecord,
  FarmHistoryRecordInput,
  FollowedTopic,
  FollowedTopicInput,
  GuestMemoryExport,
  GuestMemoryState,
  LikeItem,
  LikeItemInput,
  RecentAIQuestion,
  RecentAIQuestionInput,
  SavedItem,
  SavedItemType,
  SaveItemInput,
} from '@/services/guest-memory/guest-memory.types';

const guestMemoryStorageKey = 'kasethub.guestMemory.v1';
const guestMemoryChangedEvent = 'kasethub:guest-memory-changed';
const legacySavedArticlesKey = 'kasethub.savedArticles.v1';
const legacySavedVideosKey = 'kasethub.savedVideos.v1';
const currentVersion = 1;

function now() {
  return new Date().toISOString();
}

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

function createId(prefix: string) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createSavedItemId(itemType: SavedItemType, itemId: string) {
  return `${itemType}:${itemId}`;
}

function createLikeId(itemType: SavedItemType, itemId: string) {
  return `like:${itemType}:${itemId}`;
}

function createDefaultState(): GuestMemoryState {
  const timestamp = now();

  return {
    version: currentVersion,
    profile: {
      guestId: createId('guest'),
      displayName: 'ผู้ใช้ทั่วไป',
      createdAt: timestamp,
      updatedAt: timestamp,
      mode: 'guest',
    },
    savedItems: [],
    likes: [],
    followedTopics: [],
    recentAIQuestions: [],
    farmRecords: [],
    migrations: [],
    updatedAt: timestamp,
  };
}

function safeParseJson<T>(rawValue: string | null): T | undefined {
  if (!rawValue) {
    return undefined;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return undefined;
  }
}

function normalizeSavedItem(item: SavedItem): SavedItem {
  const timestamp = now();

  return {
    id: item.id || createSavedItemId(item.itemType, item.itemId),
    itemType: item.itemType || 'future',
    itemId: item.itemId,
    title: item.title || 'รายการที่บันทึกไว้',
    summary: item.summary || '',
    thumbnailUrl: item.thumbnailUrl,
    sourceRoute: item.sourceRoute || '/app',
    tags: Array.isArray(item.tags) ? item.tags : [],
    savedAt: item.savedAt || timestamp,
    updatedAt: item.updatedAt || item.savedAt || timestamp,
    metadata: item.metadata && typeof item.metadata === 'object' ? item.metadata : {},
  };
}

export function migrateGuestMemoryState(input: unknown): GuestMemoryState {
  const fallback = createDefaultState();

  if (!input || typeof input !== 'object') {
    return fallback;
  }

  const partial = input as Partial<GuestMemoryState>;
  const timestamp = now();

  return {
    version: currentVersion,
    profile: {
      guestId: partial.profile?.guestId || fallback.profile.guestId,
      displayName: partial.profile?.displayName || fallback.profile.displayName,
      createdAt: partial.profile?.createdAt || timestamp,
      updatedAt: partial.profile?.updatedAt || timestamp,
      mode: 'guest',
    },
    savedItems: Array.isArray(partial.savedItems) ? partial.savedItems.map(normalizeSavedItem) : [],
    likes: Array.isArray(partial.likes) ? partial.likes : [],
    followedTopics: Array.isArray(partial.followedTopics) ? partial.followedTopics : [],
    recentAIQuestions: Array.isArray(partial.recentAIQuestions) ? partial.recentAIQuestions : [],
    farmRecords: Array.isArray(partial.farmRecords) ? partial.farmRecords : [],
    migrations: Array.isArray(partial.migrations) ? partial.migrations : [],
    updatedAt: partial.updatedAt || timestamp,
  };
}

function getStoredState() {
  if (!canUseStorage()) {
    return createDefaultState();
  }

  const parsed = safeParseJson<GuestMemoryState>(window.localStorage.getItem(guestMemoryStorageKey));
  return migrateGuestMemoryState(parsed);
}

function notifyMemoryChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(guestMemoryChangedEvent));
  }
}

function persistState(state: GuestMemoryState) {
  if (!canUseStorage()) {
    return state;
  }

  const nextState = {
    ...state,
    profile: {
      ...state.profile,
      updatedAt: now(),
    },
    updatedAt: now(),
  };

  try {
    window.localStorage.setItem(guestMemoryStorageKey, JSON.stringify(nextState));
    notifyMemoryChanged();
    return nextState;
  } catch {
    return state;
  }
}

function readLegacySavedArticles() {
  if (!canUseStorage()) {
    return [];
  }

  const parsed = safeParseJson<SavedArticle[]>(window.localStorage.getItem(legacySavedArticlesKey));
  return Array.isArray(parsed) ? parsed : [];
}

function readLegacySavedVideos() {
  if (!canUseStorage()) {
    return [];
  }

  const parsed = safeParseJson<SavedVideo[]>(window.localStorage.getItem(legacySavedVideosKey));
  return Array.isArray(parsed) ? parsed : [];
}

function createArticleSavedItem(article: Article | SavedArticle): SavedItem {
  const savedAt = 'savedAt' in article ? article.savedAt : now();

  return normalizeSavedItem({
    id: createSavedItemId('article', article.id),
    itemType: 'article',
    itemId: article.id,
    title: article.title,
    summary: article.excerpt,
    sourceRoute: `/app/articles#${article.id}`,
    tags: [article.category],
    savedAt,
    updatedAt: savedAt,
    metadata: {
      article,
      offlineReady: 'offlineReady' in article ? article.offlineReady : true,
    },
  });
}

function createVideoSavedItem(video: YouTubeVideo | SavedVideo): SavedItem {
  const savedAt = 'savedAt' in video ? video.savedAt : now();

  return normalizeSavedItem({
    id: createSavedItemId('video', video.videoId),
    itemType: 'video',
    itemId: video.videoId,
    title: video.title,
    summary: video.description,
    thumbnailUrl: video.thumbnailUrl,
    sourceRoute: video.shareUrl,
    tags: [video.category, ...video.tags],
    savedAt,
    updatedAt: savedAt,
    metadata: {
      video,
    },
  });
}

function migrateLegacySavedContent(state: GuestMemoryState) {
  let nextState = state;
  const migrations = new Set(state.migrations);

  if (!migrations.has('legacy-saved-articles-v1')) {
    const legacyArticles = readLegacySavedArticles();
    const legacyItems = legacyArticles.map(createArticleSavedItem);
    nextState = {
      ...nextState,
      savedItems: [
        ...legacyItems,
        ...nextState.savedItems.filter(
          (item) => !legacyItems.some((legacyItem) => legacyItem.itemType === item.itemType && legacyItem.itemId === item.itemId),
        ),
      ],
      migrations: [...migrations, 'legacy-saved-articles-v1'],
    };
    migrations.add('legacy-saved-articles-v1');
  }

  if (!migrations.has('legacy-saved-videos-v1')) {
    const legacyVideos = readLegacySavedVideos();
    const legacyItems = legacyVideos.map(createVideoSavedItem);
    nextState = {
      ...nextState,
      savedItems: [
        ...legacyItems,
        ...nextState.savedItems.filter(
          (item) => !legacyItems.some((legacyItem) => legacyItem.itemType === item.itemType && legacyItem.itemId === item.itemId),
        ),
      ],
      migrations: [...migrations, 'legacy-saved-videos-v1'],
    };
  }

  return nextState;
}

export function getState() {
  const migratedState = migrateLegacySavedContent(getStoredState());
  const storedState = getStoredState();

  if (
    migratedState.savedItems.length !== storedState.savedItems.length ||
    migratedState.migrations.length !== storedState.migrations.length
  ) {
    return persistState(migratedState);
  }

  return migratedState;
}

export function saveItem(input: SaveItemInput) {
  const state = getState();
  const timestamp = now();
  const nextItem = normalizeSavedItem({
    ...input,
    id: input.id || createSavedItemId(input.itemType, input.itemId),
    savedAt: input.savedAt || timestamp,
    updatedAt: input.updatedAt || timestamp,
  });
  const nextState = {
    ...state,
    savedItems: [nextItem, ...state.savedItems.filter((item) => item.id !== nextItem.id)],
  };

  return persistState(nextState);
}

export function unsaveItem(itemType: SavedItemType, itemId: string) {
  const state = getState();
  const nextState = {
    ...state,
    savedItems: state.savedItems.filter((item) => !(item.itemType === itemType && item.itemId === itemId)),
  };

  return persistState(nextState);
}

export function isSaved(itemType: SavedItemType, itemId: string) {
  return getState().savedItems.some((item) => item.itemType === itemType && item.itemId === itemId);
}

export function toggleLike(input: LikeItemInput) {
  const state = getState();
  const likeId = input.id || createLikeId(input.itemType, input.itemId);
  const exists = state.likes.some((item) => item.id === likeId);
  const nextLikes = exists
    ? state.likes.filter((item) => item.id !== likeId)
    : [
        {
          ...input,
          id: likeId,
          likedAt: input.likedAt || now(),
        } satisfies LikeItem,
        ...state.likes,
      ];

  return persistState({
    ...state,
    likes: nextLikes,
  });
}

export function isLiked(itemType: SavedItemType, itemId: string) {
  return getState().likes.some((item) => item.itemType === itemType && item.itemId === itemId);
}

export function followTopic(input: FollowedTopicInput) {
  const state = getState();
  const nextTopic: FollowedTopic = {
    ...input,
    followedAt: input.followedAt || now(),
  };

  return persistState({
    ...state,
    followedTopics: [nextTopic, ...state.followedTopics.filter((topic) => topic.id !== nextTopic.id)],
  });
}

export function unfollowTopic(topicId: string) {
  const state = getState();

  return persistState({
    ...state,
    followedTopics: state.followedTopics.filter((topic) => topic.id !== topicId),
  });
}

export function isFollowingTopic(topicId: string) {
  return getState().followedTopics.some((topic) => topic.id === topicId);
}

export function addFarmRecord(input: FarmHistoryRecordInput) {
  const state = getState();
  const timestamp = now();
  const nextRecord: FarmHistoryRecord = {
    ...input,
    createdAt: input.createdAt || timestamp,
    updatedAt: input.updatedAt || timestamp,
  };

  return persistState({
    ...state,
    farmRecords: [nextRecord, ...state.farmRecords.filter((record) => record.id !== nextRecord.id)],
  });
}

export function updateFarmRecordStatus(recordId: string, status: FarmHistoryRecord['status']) {
  const state = getState();

  return persistState({
    ...state,
    farmRecords: state.farmRecords.map((record) =>
      record.id === recordId
        ? {
            ...record,
            status,
            updatedAt: now(),
          }
        : record,
    ),
  });
}

export function addRecentAIQuestion(input: RecentAIQuestionInput) {
  const state = getState();
  const nextQuestion: RecentAIQuestion = {
    ...input,
    id: input.id || createId('ai-question'),
    askedAt: input.askedAt || now(),
  };

  return persistState({
    ...state,
    recentAIQuestions: [nextQuestion, ...state.recentAIQuestions.filter((question) => question.id !== nextQuestion.id)].slice(0, 20),
  });
}

export function clearMemory() {
  const nextState = createDefaultState();

  if (canUseStorage()) {
    try {
      window.localStorage.removeItem(legacySavedArticlesKey);
      window.localStorage.removeItem(legacySavedVideosKey);
    } catch {
      // Ignore storage cleanup errors in guest mode.
    }
  }

  return persistState(nextState);
}

export function exportMemory(): GuestMemoryExport {
  return {
    exportedAt: now(),
    app: 'KasetHub Platform',
    state: getState(),
  };
}

export function importMemory(memoryExport: GuestMemoryExport | GuestMemoryState) {
  const importedState = 'state' in memoryExport ? memoryExport.state : memoryExport;
  return persistState(migrateGuestMemoryState(importedState));
}

export function subscribeGuestMemory(listener: () => void) {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const storageListener = (event: StorageEvent) => {
    if (event.key === guestMemoryStorageKey || event.key === legacySavedArticlesKey || event.key === legacySavedVideosKey) {
      listener();
    }
  };

  window.addEventListener(guestMemoryChangedEvent, listener);
  window.addEventListener('storage', storageListener);

  return () => {
    window.removeEventListener(guestMemoryChangedEvent, listener);
    window.removeEventListener('storage', storageListener);
  };
}

export function createArticleMemoryItem(article: Article | SavedArticle) {
  return createArticleSavedItem(article);
}

export function createVideoMemoryItem(video: YouTubeVideo | SavedVideo) {
  return createVideoSavedItem(video);
}
