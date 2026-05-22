import type { ContentAuthor, ContentCategory, ContentDifficulty, ContentTag } from '@/services/content/content.types';

export const contentCategories: ContentCategory[] = [
  'เทคนิคปลูกพืช',
  'โรคพืชและแมลง',
  'ดินและปุ๋ย',
  'เกษตรอินทรีย์',
  'ราคาพืชผล',
  'เครื่องมือเกษตร',
  'ข่าวเกษตร',
  'เรื่องน่ารู้จากช่อง YouTube',
];

export const contentDifficultyLabels: Record<ContentDifficulty, string> = {
  beginner: 'เริ่มต้น',
  intermediate: 'ปานกลาง',
  advanced: 'เชิงลึก',
};

export const contentAuthors: ContentAuthor[] = [
  {
    id: 'author-editorial',
    displayName: 'ทีมบรรณาธิการ KasetHub',
    role: 'editor',
    sourceLabel: 'KasetHub Editorial',
  },
  {
    id: 'author-plant-clinic',
    displayName: 'ทีมคลินิกพืช KasetHub',
    role: 'agronomist',
    sourceLabel: 'Plant Clinic Demo',
  },
  {
    id: 'author-market-lab',
    displayName: 'KasetHub Market Lab',
    role: 'market_research',
    sourceLabel: 'Market Research Demo',
  },
  {
    id: 'author-video-team',
    displayName: 'ทีมวิดีโอ KasetHub',
    role: 'video_team',
    sourceLabel: 'YouTube Hub Demo',
  },
];

export const contentTags: ContentTag[] = [
  { id: 'tag-rain-season', label: 'ฤดูฝน', category: 'เทคนิคปลูกพืช' },
  { id: 'tag-rice', label: 'ข้าว', category: 'เทคนิคปลูกพืช' },
  { id: 'tag-soil', label: 'ดิน', category: 'ดินและปุ๋ย' },
  { id: 'tag-disease', label: 'โรคพืช', category: 'โรคพืชและแมลง' },
  { id: 'tag-market', label: 'ตลาด', category: 'ราคาพืชผล' },
  { id: 'tag-ai', label: 'AI', category: 'เรื่องน่ารู้จากช่อง YouTube' },
  { id: 'tag-community', label: 'ชุมชน', category: 'ข่าวเกษตร' },
];

export function findContentAuthor(authorId: string) {
  return contentAuthors.find((author) => author.id === authorId) ?? contentAuthors[0];
}

export function findContentTags(tagIds: string[]) {
  return tagIds.map((tagId) => contentTags.find((tag) => tag.id === tagId)).filter((tag): tag is ContentTag => Boolean(tag));
}
