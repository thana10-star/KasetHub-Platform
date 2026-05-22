import type { Article } from '@/types/kaset';
import type { VideoCategory } from '@/types/youtube';
import type { ArticleContent, ContentCategory, OfflineArticleBodyCache, VideoContent } from '@/services/content/content.types';
import { findContentAuthor, findContentTags } from '@/services/content/content-taxonomy';
import { youtubeVideos } from '@/data/youtubeData';

export const articleContents: ArticleContent[] = [
  {
    id: 'article-001',
    kind: 'article',
    title: 'เช็กลิสต์เตรียมแปลงก่อนฤดูฝนสำหรับเกษตรกรรายย่อย',
    excerpt: 'สำรวจดิน ระบายน้ำ และวางแผนป้องกันโรคพืชก่อนฝนต่อเนื่อง',
    category: 'เทคนิคปลูกพืช',
    legacyCategory: 'องค์ความรู้' as Article['category'],
    tags: findContentTags(['tag-rain-season', 'tag-rice', 'tag-soil']),
    author: findContentAuthor('author-editorial'),
    status: 'published',
    source: 'manual',
    language: 'th',
    difficulty: 'beginner',
    publishedAt: 'ข้อมูลตัวอย่าง 22 พ.ค. 2569',
    updatedAt: '2026-05-22',
    sourceRoute: '/app/articles/article-001',
    readTime: 'อ่าน 4 นาที',
    readingTimeMinutes: 4,
    imageTone: 'soil',
    keyTakeaways: [
      'ดูทางน้ำออกก่อนฝนยาว ไม่รอให้แปลงท่วม',
      'จดจุดเสี่ยงโรคและแมลงไว้ก่อนเริ่มฤดู',
      'เตรียมรูปแปลงและอาการพืชไว้ถามผู้เชี่ยวชาญหรือ AI',
    ],
    bodySections: [
      {
        heading: 'เริ่มจากทางน้ำ',
        body: 'เดินดูร่องน้ำ คันนา และจุดที่น้ำขังบ่อย ถ้ามีน้ำขังนาน รากพืชจะอ่อนแอและโรคเชื้อรามักตามมาได้ง่าย',
        checklist: ['เปิดทางน้ำออก', 'เก็บเศษวัชพืชที่อุดร่อง', 'ถ่ายรูปจุดเสี่ยงเก็บไว้'],
      },
      {
        heading: 'ตรวจดินแบบง่าย',
        body: 'สังเกตดินแน่น ดินแฉะ หรือดินแตกระแหงก่อนใส่ปุ๋ย การรู้สภาพดินช่วยให้ลดการใช้ปุ๋ยเกินจำเป็นและวางแผนให้น้ำได้ดีขึ้น',
      },
      {
        heading: 'เตรียมแผนโรคพืช',
        body: 'ฤดูฝนมักเพิ่มความชื้นในแปลง ควรดูใบล่าง ใบแก่ และจุดที่ลมไม่ผ่าน ถ้าพบจุดผิดปกติให้ถ่ายรูปใกล้ใบพืชและบันทึกวันที่ไว้',
      },
    ],
    safetyNote: 'คำแนะนำนี้เป็นข้อมูลทั่วไป ควรตรวจสอบกับผู้เชี่ยวชาญในพื้นที่ก่อนใช้สารป้องกันกำจัดโรคพืช',
    relatedArticleIds: ['article-003', 'article-004'],
    relatedVideoIds: ['sample-video-id', 'leaf-spot-checklist'],
    offlineCacheVersion: 1,
  },
  {
    id: 'article-002',
    kind: 'article',
    title: 'แนวโน้มตลาดผลไม้ภาคตะวันออกและการวางแผนเก็บเกี่ยว',
    excerpt: 'มองราคาตัวอย่าง แรงงาน และโลจิสติกส์ เพื่อช่วยตัดสินใจช่วงผลผลิตออกมาก',
    category: 'ราคาพืชผล',
    legacyCategory: 'ตลาด' as Article['category'],
    tags: findContentTags(['tag-market']),
    author: findContentAuthor('author-market-lab'),
    status: 'published',
    source: 'manual',
    language: 'th',
    difficulty: 'intermediate',
    publishedAt: 'ข้อมูลตัวอย่าง 21 พ.ค. 2569',
    updatedAt: '2026-05-21',
    sourceRoute: '/app/articles/article-002',
    readTime: 'อ่าน 5 นาที',
    readingTimeMinutes: 5,
    imageTone: 'market',
    keyTakeaways: [
      'ดูต้นทุนเก็บเกี่ยวคู่กับราคาหน้าสวน',
      'วางรอบแรงงานก่อนผลผลิตออกมาก',
      'ราคาในแอปเป็นราคาอ้างอิง ไม่ใช่ราคาซื้อขายยืนยัน',
    ],
    bodySections: [
      {
        heading: 'ดูราคาอย่างใจเย็น',
        body: 'ราคาผลไม้เปลี่ยนได้จากคุณภาพสินค้า ปริมาณออกสู่ตลาด และค่าขนส่ง ควรดูหลายแหล่งก่อนตัดสินใจขาย',
      },
      {
        heading: 'เตรียมแรงงานและจุดรับซื้อ',
        body: 'ถ้าผลผลิตออกพร้อมกันหลายสวน ค่าแรงและคิวรับซื้ออาจตึงตัว การนัดหมายล่วงหน้าช่วยลดความเสียหายหลังเก็บเกี่ยว',
      },
    ],
    safetyNote: 'ข้อมูลราคาเป็นตัวอย่างสำหรับ prototype และควรใช้เป็นราคาอ้างอิงเท่านั้น',
    relatedArticleIds: ['article-001'],
    relatedVideoIds: ['cassava-market-plan'],
    offlineCacheVersion: 1,
  },
  {
    id: 'article-003',
    kind: 'article',
    title: 'AI ช่วยเกษตรกรได้อย่างไรโดยไม่แทนที่ประสบการณ์ในแปลง',
    excerpt: 'เข้าใจบทบาท AI ในการตั้งคำถาม วิเคราะห์ภาพ และจัดระบบความรู้',
    category: 'เรื่องน่ารู้จากช่อง YouTube',
    legacyCategory: 'เทคโนโลยี' as Article['category'],
    tags: findContentTags(['tag-ai', 'tag-disease']),
    author: findContentAuthor('author-video-team'),
    status: 'published',
    source: 'ai_assisted',
    language: 'th',
    difficulty: 'beginner',
    publishedAt: 'ข้อมูลตัวอย่าง 20 พ.ค. 2569',
    updatedAt: '2026-05-20',
    sourceRoute: '/app/articles/article-003',
    readTime: 'อ่าน 6 นาที',
    readingTimeMinutes: 6,
    imageTone: 'tech',
    keyTakeaways: [
      'AI เหมาะกับการช่วยตั้งคำถามและสรุปแนวทาง',
      'ภาพโรคพืชควรใช้เป็นข้อมูลเบื้องต้นเท่านั้น',
      'ประสบการณ์ในแปลงและผู้เชี่ยวชาญยังสำคัญ',
    ],
    bodySections: [
      {
        heading: 'AI ช่วยจัดความคิด',
        body: 'เมื่อเจอปัญหาในแปลง เกษตรกรสามารถเล่าอาการ พื้นที่ และสิ่งที่ลองทำแล้ว เพื่อให้ AI ช่วยจัดลำดับสิ่งที่ควรตรวจต่อ',
      },
      {
        heading: 'AI ไม่ใช่คำตอบสุดท้าย',
        body: 'โรคพืช ปุ๋ย และสารเคมีมีความเสี่ยง คำตอบจาก AI จึงควรเป็นข้อมูลเบื้องต้นและต้องตรวจสอบก่อนใช้งานจริง',
      },
    ],
    safetyNote: 'สำหรับคำแนะนำเกี่ยวกับโรคพืช ปุ๋ย หรือสารเคมี ควรยืนยันกับผู้เชี่ยวชาญก่อนปฏิบัติจริง',
    relatedArticleIds: ['article-001', 'article-004'],
    relatedVideoIds: ['leaf-spot-checklist', 'soil-test-reading'],
    offlineCacheVersion: 1,
  },
  {
    id: 'article-004',
    kind: 'article',
    title: 'ชุมชนเกษตรออนไลน์กับการแลกเปลี่ยนความรู้ที่ปลอดภัย',
    excerpt: 'หลักคิดเรื่องการยืนยันข้อมูล การรายงานโพสต์ และการช่วยกันตอบอย่างรับผิดชอบ',
    category: 'ข่าวเกษตร',
    legacyCategory: 'ชุมชน' as Article['category'],
    tags: findContentTags(['tag-community', 'tag-disease']),
    author: findContentAuthor('author-editorial'),
    status: 'published',
    source: 'community_curated',
    language: 'th',
    difficulty: 'beginner',
    publishedAt: 'ข้อมูลตัวอย่าง 19 พ.ค. 2569',
    updatedAt: '2026-05-19',
    sourceRoute: '/app/articles/article-004',
    readTime: 'อ่าน 3 นาที',
    readingTimeMinutes: 3,
    imageTone: 'community',
    keyTakeaways: [
      'ถามให้ครบ: พืช พื้นที่ อาการ และช่วงเวลา',
      'แยกประสบการณ์ส่วนตัวออกจากคำยืนยันทางวิชาการ',
      'รายงานโพสต์ที่เสี่ยงหรือชวนใช้สารอันตราย',
    ],
    bodySections: [
      {
        heading: 'ถามให้คนอื่นช่วยได้ง่าย',
        body: 'โพสต์ที่ดีควรมีรูปชัด ชื่อพืช พื้นที่โดยคร่าว และสิ่งที่ลองทำแล้ว ชุมชนจะช่วยได้ตรงขึ้น',
      },
      {
        heading: 'ช่วยกันรักษาความปลอดภัย',
        body: 'ถ้ามีคำแนะนำที่เสี่ยง เช่น ใช้สารเข้มข้นเกินฉลาก หรือไม่ใส่อุปกรณ์ป้องกัน ควรรายงานให้ผู้ดูแลตรวจสอบ',
      },
    ],
    safetyNote: 'คำตอบจากชุมชนเป็นประสบการณ์ของสมาชิก ควรตรวจสอบก่อนนำไปใช้จริง',
    relatedArticleIds: ['article-003'],
    relatedVideoIds: ['leaf-spot-checklist'],
    offlineCacheVersion: 1,
  },
];

const youtubeCategoryToContentCategory: Record<VideoCategory, ContentCategory> = {
  'เทคนิคปลูกพืช': 'เทคนิคปลูกพืช',
  'โรคพืชและแมลง': 'โรคพืชและแมลง',
  'ปุ๋ยและดิน': 'ดินและปุ๋ย',
  'เกษตรอินทรีย์': 'เกษตรอินทรีย์',
  'ราคาพืชผล': 'ราคาพืชผล',
  'เครื่องมือเกษตร': 'เครื่องมือเกษตร',
};

export function mapYoutubeCategoryToContentCategory(category: VideoCategory): ContentCategory {
  return youtubeCategoryToContentCategory[category] ?? 'เรื่องน่ารู้จากช่อง YouTube';
}

export const videoContentItems: VideoContent[] = youtubeVideos.map((video) => ({
  id: `content-video-${video.videoId}`,
  kind: 'video',
  videoId: video.videoId,
  title: video.title,
  excerpt: video.description,
  category: mapYoutubeCategoryToContentCategory(video.category),
  tags: [],
  author: findContentAuthor('author-video-team'),
  status: 'published',
  source: 'youtube_import',
  language: 'th',
  difficulty: video.isShort ? 'beginner' : 'intermediate',
  publishedAt: video.publishedAt,
  updatedAt: '2026-05-22',
  sourceRoute: `/app/youtube/${video.videoId}`,
  duration: video.duration,
  playlistId: video.playlistId,
  importStatus: video.sourceStatus === 'imported' ? 'imported_mock' : 'planned',
  ownershipVerified: false,
}));

export function findArticleContent(articleId: string) {
  return articleContents.find((article) => article.id === articleId);
}

export function contentToArticle(article: ArticleContent): Article {
  return {
    id: article.id,
    title: article.title,
    category: article.legacyCategory,
    excerpt: article.excerpt,
    author: article.author.displayName,
    readTime: article.readTime,
    publishedAt: article.publishedAt,
    imageTone: article.imageTone,
  };
}

export function getRelatedArticles(article: ArticleContent) {
  return article.relatedArticleIds.map(findArticleContent).filter((item): item is ArticleContent => Boolean(item));
}

export function getRelatedVideos(article: ArticleContent) {
  return article.relatedVideoIds
    .map((videoId) => youtubeVideos.find((video) => video.videoId === videoId))
    .filter((item): item is (typeof youtubeVideos)[number] => Boolean(item));
}

export function createOfflineArticleCachePreview(articleId: string, cachedAt = new Date().toISOString()): OfflineArticleBodyCache | undefined {
  const article = findArticleContent(articleId);
  if (!article) {
    return undefined;
  }

  const bodyCachePreview = article.bodySections
    .map((section) => `${section.heading}\n${section.body}`)
    .join('\n\n')
    .slice(0, 2400);
  const sizeBytesEstimate = new TextEncoder().encode(bodyCachePreview).length;

  return {
    articleId,
    bodyCachePreview,
    cachedAt,
    cacheVersion: article.offlineCacheVersion,
    offlineAvailable: true,
    sizeBytesEstimate,
    sizeWarning: sizeBytesEstimate > 7000 ? 'บทความนี้ยาว ควรเก็บเฉพาะส่วนสำคัญก่อนทำ offline เต็มรูปแบบ' : undefined,
  };
}
