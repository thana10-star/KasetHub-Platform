import type { YouTubeChannelProfile, YouTubePlaylist, YouTubeVideo, VideoCategory } from '@/types/youtube';
import { youtubeChannelHandle, youtubeChannelUrl } from '@/config/channel';

export const youtubeCategories: Array<'ทั้งหมด' | VideoCategory> = [
  'ทั้งหมด',
  'เทคนิคปลูกพืช',
  'โรคพืชและแมลง',
  'ปุ๋ยและดิน',
  'เกษตรอินทรีย์',
  'ราคาพืชผล',
  'เครื่องมือเกษตร',
];

export const youtubeChannelProfile: YouTubeChannelProfile = {
  channelId: 'mock-channel-kasethub-th',
  name: 'KasetHub เกษตรไทย',
  handle: youtubeChannelHandle,
  subscriberCount: 35000,
  subscriberCountLabel: '35k',
  dailyViews: 20000,
  dailyViewsLabel: '20k/day',
  description:
    'ช่องความรู้เกษตรไทยสำหรับเจ้าของสวน ชาวนา และเกษตรกรรุ่นใหม่ รวมเทคนิคปลูกพืช การดูแลดิน ป้องกันโรคพืช และมุมมองตลาดแบบเข้าใจง่าย',
  contentPillars: [
    'เทคนิคปลูกพืช',
    'โรคพืชและแมลง',
    'ปุ๋ยและดิน',
    'เกษตรอินทรีย์',
    'ราคาพืชผล',
    'เครื่องมือเกษตร',
  ],
  youtubeUrl: youtubeChannelUrl,
  latestVideoId: 'sample-video-id',
  sourceStatus: 'api_ready',
};

export const youtubeVideos: YouTubeVideo[] = [
  {
    videoId: 'sample-video-id',
    title: 'จัดการน้ำในนาข้าวช่วงฝนแปรปรวน ลดเสี่ยงโรคใบจุด',
    description:
      'แนวทางสำรวจน้ำในแปลง ดูสภาพใบข้าว และวางแผนระบายน้ำหลังฝนต่อเนื่อง เหมาะสำหรับเกษตรกรที่ต้องการลดความเสี่ยงโรคพืชในฤดูฝน',
    duration: '12:48',
    publishedAt: 'ข้อมูลตัวอย่าง 22 พ.ค. 2569',
    viewCount: 24800,
    playlistId: 'pl-plant-techniques',
    category: 'เทคนิคปลูกพืช',
    tags: ['ข้าว', 'จัดการน้ำ', 'ฤดูฝน', 'โรคใบจุด'],
    isShort: false,
    sourceStatus: 'mock',
    shareUrl: '/app/youtube/sample-video-id',
  },
  {
    videoId: 'durian-flower-care',
    title: 'ดูแลทุเรียนก่อนออกดอกให้สมบูรณ์',
    description:
      'เช็กลำต้น ใบ น้ำ และธาตุอาหารก่อนเข้าสู่ช่วงทำดอก พร้อมข้อควรระวังสำหรับสวนที่เจออากาศแกว่ง',
    duration: '09:15',
    publishedAt: 'ข้อมูลตัวอย่าง 20 พ.ค. 2569',
    viewCount: 18200,
    playlistId: 'pl-plant-techniques',
    category: 'เทคนิคปลูกพืช',
    tags: ['ทุเรียน', 'ทำดอก', 'สวนผลไม้'],
    isShort: false,
    sourceStatus: 'mock',
    shareUrl: '/app/youtube/durian-flower-care',
  },
  {
    videoId: 'leaf-spot-checklist',
    title: 'แยกอาการใบจุดจากเชื้อราและขาดธาตุอาหาร',
    description:
      'ดูอาการที่ใบ สภาพแปลง และช่วงเวลาการระบาด เพื่อเตรียมข้อมูลก่อนปรึกษาผู้เชี่ยวชาญหรือใช้ระบบวิเคราะห์ภาพ',
    duration: '10:44',
    publishedAt: 'ข้อมูลตัวอย่าง 18 พ.ค. 2569',
    viewCount: 28100,
    playlistId: 'pl-disease-insects',
    category: 'โรคพืชและแมลง',
    tags: ['โรคพืช', 'เชื้อรา', 'ใบจุด', 'วิเคราะห์โรคพืช'],
    isShort: false,
    sourceStatus: 'api_ready',
    shareUrl: '/app/youtube/leaf-spot-checklist',
  },
  {
    videoId: 'soil-test-reading',
    title: 'อ่านค่าวิเคราะห์ดินเบื้องต้นก่อนใส่ปุ๋ย',
    description:
      'เข้าใจค่า pH อินทรียวัตถุ และธาตุอาหารหลักแบบไม่ซับซ้อน เพื่อช่วยวางแผนปุ๋ยให้เหมาะกับพืช',
    duration: '15:02',
    publishedAt: 'ข้อมูลตัวอย่าง 15 พ.ค. 2569',
    viewCount: 31500,
    playlistId: 'pl-soil-fertilizer',
    category: 'ปุ๋ยและดิน',
    tags: ['ดิน', 'ปุ๋ย', 'pH', 'ธาตุอาหาร'],
    isShort: false,
    sourceStatus: 'mock',
    shareUrl: '/app/youtube/soil-test-reading',
  },
  {
    videoId: 'organic-compost-short',
    title: 'ปุ๋ยหมัก 3 จุดที่ต้องเช็กก่อนใช้',
    description: 'วิดีโอสั้นสำหรับเช็กกลิ่น ความร้อน และเนื้อปุ๋ยหมักก่อนนำไปใช้ในแปลงผักปลอดภัย',
    duration: '00:58',
    publishedAt: 'ข้อมูลตัวอย่าง 14 พ.ค. 2569',
    viewCount: 40200,
    playlistId: 'pl-organic',
    category: 'เกษตรอินทรีย์',
    tags: ['ปุ๋ยหมัก', 'เกษตรอินทรีย์', 'shorts'],
    isShort: true,
    sourceStatus: 'mock',
    shareUrl: '/app/youtube/organic-compost-short',
  },
  {
    videoId: 'cassava-market-plan',
    title: 'วางแผนขายมันสำปะหลังเมื่อราคาแกว่ง',
    description: 'ดูสัญญาณราคา ต้นทุนขนส่ง และจุดรับซื้อ เพื่อช่วยตัดสินใจขายในช่วงตลาดผันผวน',
    duration: '07:36',
    publishedAt: 'ข้อมูลตัวอย่าง 12 พ.ค. 2569',
    viewCount: 11800,
    playlistId: 'pl-market-prices',
    category: 'ราคาพืชผล',
    tags: ['มันสำปะหลัง', 'ราคา', 'ตลาดเกษตร'],
    isShort: false,
    sourceStatus: 'api_ready',
    shareUrl: '/app/youtube/cassava-market-plan',
  },
  {
    videoId: 'sprayer-cleaning-short',
    title: 'ล้างหัวพ่นยาให้ไม่ตันใน 45 วินาที',
    description: 'เคล็ดลับสั้นสำหรับดูแลเครื่องมือเกษตรหลังใช้งาน ลดปัญหาหัวพ่นตันและแรงดันตก',
    duration: '00:45',
    publishedAt: 'ข้อมูลตัวอย่าง 10 พ.ค. 2569',
    viewCount: 36700,
    playlistId: 'pl-tools',
    category: 'เครื่องมือเกษตร',
    tags: ['เครื่องมือเกษตร', 'หัวพ่น', 'shorts'],
    isShort: true,
    sourceStatus: 'mock',
    shareUrl: '/app/youtube/sprayer-cleaning-short',
  },
];

export const youtubePlaylists: YouTubePlaylist[] = [
  {
    playlistId: 'pl-plant-techniques',
    title: 'เทคนิคปลูกพืชตามฤดูกาล',
    description: 'วางแผนแปลง ดูแลน้ำ และเตรียมพืชให้พร้อมตามสภาพอากาศ',
    category: 'เทคนิคปลูกพืช',
    videoIds: ['sample-video-id', 'durian-flower-care'],
    sourceStatus: 'api_ready',
  },
  {
    playlistId: 'pl-disease-insects',
    title: 'โรคพืชและแมลงที่พบบ่อย',
    description: 'สังเกตอาการ เก็บข้อมูล และเตรียมปรึกษาผู้เชี่ยวชาญ',
    category: 'โรคพืชและแมลง',
    videoIds: ['leaf-spot-checklist'],
    sourceStatus: 'api_ready',
  },
  {
    playlistId: 'pl-soil-fertilizer',
    title: 'ปุ๋ยและดิน',
    description: 'พื้นฐานดิน ปุ๋ย และธาตุอาหารสำหรับเกษตรกรไทย',
    category: 'ปุ๋ยและดิน',
    videoIds: ['soil-test-reading'],
    sourceStatus: 'mock',
  },
  {
    playlistId: 'pl-organic',
    title: 'เกษตรอินทรีย์และผักปลอดภัย',
    description: 'แนวทางดูแลแปลงด้วยวัสดุในฟาร์มและการจัดการที่ปลอดภัย',
    category: 'เกษตรอินทรีย์',
    videoIds: ['organic-compost-short'],
    sourceStatus: 'mock',
  },
  {
    playlistId: 'pl-market-prices',
    title: 'ตลาดและราคาพืชผล',
    description: 'มองสัญญาณราคาและวางแผนขายอย่างมีข้อมูล',
    category: 'ราคาพืชผล',
    videoIds: ['cassava-market-plan'],
    sourceStatus: 'api_ready',
  },
  {
    playlistId: 'pl-tools',
    title: 'เครื่องมือเกษตรใช้งานจริง',
    description: 'ดูแลเครื่องมือให้พร้อมใช้และลดต้นทุนซ่อมบำรุง',
    category: 'เครื่องมือเกษตร',
    videoIds: ['sprayer-cleaning-short'],
    sourceStatus: 'mock',
  },
];

export function findYoutubeVideo(videoId: string) {
  return youtubeVideos.find((video) => video.videoId === videoId);
}

export function getPlaylistVideos(playlistId: string) {
  const playlist = youtubePlaylists.find((item) => item.playlistId === playlistId);
  return playlist ? playlist.videoIds.map((videoId) => findYoutubeVideo(videoId)).filter(Boolean) : [];
}
