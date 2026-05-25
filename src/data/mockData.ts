import {
  Bot,
  Calculator,
  CloudSun,
  Coins,
  MessageCircleQuestion,
  Microscope,
  PlaySquare,
  Ruler,
  Sprout,
} from 'lucide-react';
import type {
  AiCreditState,
  Article,
  CommunityPost,
  DiseaseAnalysisResult,
  FarmAnalysisRecord,
  KasetVideo,
  NotificationItem,
  QuickAction,
  VideoCategory,
} from '@/types/kaset';
import { articleContents, contentToArticle } from '@/services/content/content-fixtures';
import { cropPriceItems } from '@/services/crop-prices/crop-price-fixtures';

export const quickActions: QuickAction[] = [
  {
    label: 'YouTube',
    description: 'คลังวิดีโอเกษตร',
    href: '/app/youtube',
    icon: PlaySquare,
    accent: 'green',
  },
  {
    label: 'AI ผู้ช่วยเกษตร',
    description: 'ถามเรื่องเกษตรได้ทันที',
    href: '/app/ai',
    icon: Bot,
    accent: 'gold',
  },
  {
    label: 'ถาม-ตอบชุมชน',
    description: 'คุยกับเกษตรกรไทย',
    href: '/app/community',
    icon: MessageCircleQuestion,
    accent: 'sky',
  },
  {
    label: 'วิเคราะห์โรคพืช',
    description: 'ดูผลตัวอย่าง',
    href: '/app/analyze',
    icon: Microscope,
    accent: 'rose',
  },
  {
    label: 'ราคาพืชผล',
    description: 'ติดตามแนวโน้มตลาด',
    href: '/app/prices',
    icon: Coins,
    accent: 'earth',
  },
  {
    label: 'สภาพอากาศเกษตร',
    description: 'เช็กฝน ลม และความเสี่ยง',
    href: '/app/weather',
    icon: CloudSun,
    accent: 'sky',
  },
  {
    label: 'เครื่องคำนวณเกษตร',
    description: 'ปุ๋ย ระยะปลูก ต้นทุน',
    href: '/app/calculators',
    icon: Calculator,
    accent: 'gold',
  },
  {
    label: 'วัดพื้นที่แปลง',
    description: 'แปลงเป็นไร่ งาน ตารางวา',
    href: '/app/farm-area',
    icon: Ruler,
    accent: 'green',
  },
];

export const videoCategories: VideoCategory[] = [
  'ทั้งหมด',
  'ข้าว',
  'ทุเรียน',
  'ดินและปุ๋ย',
  'ตลาด',
  'โรคพืช',
];

export const videos: KasetVideo[] = [
  {
    id: 'vid-rice-001',
    title: 'เทคนิคจัดการน้ำในนาข้าวช่วงอากาศแปรปรวน',
    channel: 'KasetHub Demo Studio',
    category: 'ข้าว',
    duration: '12:48',
    views: '24K',
    publishedAt: 'ตัวอย่าง 2 วันที่แล้ว',
    summary: 'แนวทางวางแผนน้ำ ลดความเสี่ยงต้นข้าวชะงักการเจริญเติบโต',
    tone: 'rice',
    isFeatured: true,
  },
  {
    id: 'vid-durian-002',
    title: 'ดูแลทุเรียนก่อนออกดอกให้สมบูรณ์',
    channel: 'สวนตัวอย่างภาคตะวันออก',
    category: 'ทุเรียน',
    duration: '09:15',
    views: '18K',
    publishedAt: 'ตัวอย่าง 4 วันที่แล้ว',
    summary: 'เช็กลำต้น ใบ และธาตุอาหารก่อนเข้าสู่ช่วงทำดอก',
    tone: 'orchard',
  },
  {
    id: 'vid-soil-003',
    title: 'อ่านค่าวิเคราะห์ดินเบื้องต้นก่อนใส่ปุ๋ย',
    channel: 'KasetHub Demo Studio',
    category: 'ดินและปุ๋ย',
    duration: '15:02',
    views: '31K',
    publishedAt: 'ตัวอย่าง 1 สัปดาห์ที่แล้ว',
    summary: 'เข้าใจ pH อินทรียวัตถุ และธาตุหลักแบบไม่ซับซ้อน',
    tone: 'soil',
  },
  {
    id: 'vid-market-004',
    title: 'วางแผนขายมันสำปะหลังเมื่อราคาแกว่ง',
    channel: 'ตลาดเกษตรรายวัน',
    category: 'ตลาด',
    duration: '07:36',
    views: '11K',
    publishedAt: 'ตัวอย่าง 1 สัปดาห์ที่แล้ว',
    summary: 'ดูสัญญาณราคาและต้นทุนขนส่งก่อนตัดสินใจขาย',
    tone: 'market',
  },
  {
    id: 'vid-disease-005',
    title: 'แยกอาการใบจุดจากเชื้อราและขาดธาตุอาหาร',
    channel: 'คลินิกพืชตัวอย่าง',
    category: 'โรคพืช',
    duration: '10:44',
    views: '28K',
    publishedAt: 'ตัวอย่าง 2 สัปดาห์ที่แล้ว',
    summary: 'ดูอาการที่ใบ สภาพแปลง และช่วงเวลาการระบาด',
    tone: 'disease',
  },
];

export const communityPosts: CommunityPost[] = [
  {
    id: 'post-001',
    author: 'คุณสายฝน',
    province: 'สุพรรณบุรี',
    role: 'สมาชิกนาอินทรีย์',
    postedAt: 'ตัวอย่าง 18 นาทีที่แล้ว',
    body: 'ช่วงนี้ใบข้าวเริ่มมีจุดสีน้ำตาลหลังฝนตกติดกัน 3 วัน เพื่อน ๆ มีวิธีลดความชื้นในแปลงอย่างไรบ้างคะ',
    topic: 'ข้าว',
    imageTone: 'field',
    likes: 42,
    comments: 12,
  },
  {
    id: 'post-002',
    author: 'ไร่ลุงเพิ่ม',
    province: 'จันทบุรี',
    role: 'ชาวสวนผลไม้',
    postedAt: 'ตัวอย่าง 1 ชั่วโมงที่แล้ว',
    body: 'ทุเรียนแปลงใหม่เริ่มแตกใบอ่อน อยากแชร์ตารางให้น้ำแบบค่อยเป็นค่อยไป เผื่อเป็นไอเดียให้สวนอื่นครับ',
    topic: 'ทุเรียน',
    imageTone: 'fruit',
    likes: 76,
    comments: 19,
  },
  {
    id: 'post-003',
    author: 'แม่มะลิฟาร์ม',
    province: 'เชียงใหม่',
    role: 'ผู้ปลูกผักปลอดภัย',
    postedAt: 'ตัวอย่าง 3 ชั่วโมงที่แล้ว',
    body: 'มีใครใช้ปุ๋ยหมักร่วมกับน้ำหมักชีวภาพในผักสลัดไหมคะ อยากเทียบผลเรื่องรากและใบ',
    topic: 'ดินและปุ๋ย',
    imageTone: 'soil',
    likes: 33,
    comments: 8,
  },
];

export const cropPrices = cropPriceItems;

export const articles: Article[] = articleContents.map(contentToArticle);

export const notifications: NotificationItem[] = [
  {
    id: 'notice-001',
    title: 'คำถาม AI พร้อมใช้งาน',
    body: 'คุณมีเครดิตตัวอย่างสำหรับถาม AI อีก 1 คำถาม',
    time: 'ตัวอย่าง 5 นาทีที่แล้ว',
    type: 'ai',
    unread: true,
  },
  {
    id: 'notice-002',
    title: 'ราคาอ้างอิงทุเรียนปรับขึ้น',
    body: 'ข้อมูลตัวอย่างเดโม: ทุเรียนหมอนทอง จันทบุรี เพิ่มขึ้น 2.4% จาก mock data',
    time: 'ตัวอย่าง 38 นาทีที่แล้ว',
    type: 'price',
    unread: true,
  },
  {
    id: 'notice-003',
    title: 'มีคนตอบโพสต์ของคุณ',
    body: 'สมาชิกจากสุพรรณบุรีแนะนำวิธีจัดการความชื้นในแปลง',
    time: 'ตัวอย่าง 2 ชั่วโมงที่แล้ว',
    type: 'community',
  },
  {
    id: 'notice-004',
    title: 'บทความใหม่สำหรับฤดูฝน',
    body: 'อ่านเช็กลิสต์เตรียมแปลงก่อนฝนต่อเนื่อง',
    time: 'ตัวอย่าง เมื่อวานนี้',
    type: 'content',
  },
];

export const aiCreditState: AiCreditState = {
  remainingQuestions: 1,
  unlockCopy: 'ดูโฆษณา 1 ครั้ง = ถาม AI ได้ 1 คำถาม',
  disclaimer: 'ระบบนี้เป็นตัวอย่างหน้าจอ ยังไม่เชื่อมต่อ AI หรือโฆษณาจริง',
};

export const diseaseAnalysisResult: DiseaseAnalysisResult = {
  diseaseName: 'โรคใบจุดสีน้ำตาล (เชื้อรา)',
  confidence: 82,
  crop: 'ข้าว',
  symptoms: [
    'พบจุดสีน้ำตาลรูปรีบนใบและมีขอบเข้ม',
    'มักชัดขึ้นหลังความชื้นสูงหรือฝนต่อเนื่อง',
    'ใบล่างเริ่มเหลืองและแห้งเป็นบางส่วน',
  ],
  treatments: [
    'ลดความชื้นในแปลงและเพิ่มการระบายอากาศ',
    'หลีกเลี่ยงการใส่ปุ๋ยไนโตรเจนมากเกินไป',
    'เก็บตัวอย่างใบไปตรวจยืนยันก่อนใช้สารป้องกันกำจัดโรคพืช',
  ],
  disclaimer: 'ผลวิเคราะห์เป็นข้อมูลเบื้องต้น ควรตรวจสอบกับผู้เชี่ยวชาญก่อนใช้งานจริง',
};

export const farmAnalysisRecords: FarmAnalysisRecord[] = [
  {
    id: 'farm-record-001',
    cropName: 'ข้าว กข43',
    diseaseName: 'โรคใบจุดสีน้ำตาล (เชื้อรา)',
    date: 'ข้อมูลตัวอย่าง 22 พ.ค. 2569',
    confidence: 82,
    symptomsSummary: 'จุดสีน้ำตาลรูปรีบนใบล่าง พบมากหลังฝนต่อเนื่อง',
    treatmentSummary: 'ลดความชื้น เพิ่มการระบายอากาศ และตรวจยืนยันก่อนใช้สาร',
    status: 'กำลังรักษา',
  },
  {
    id: 'farm-record-002',
    cropName: 'พริกแดงจินดา',
    diseaseName: 'อาการใบเหลืองจากความเครียดน้ำ',
    date: 'ข้อมูลตัวอย่าง 18 พ.ค. 2569',
    confidence: 74,
    symptomsSummary: 'ใบล่างเหลือง ขอบใบแห้งบางส่วน ไม่พบแผลเชื้อราชัดเจน',
    treatmentSummary: 'ปรับรอบให้น้ำ ตรวจราก และเสริมอินทรียวัตถุ',
    status: 'เฝ้าระวัง',
  },
  {
    id: 'farm-record-003',
    cropName: 'ทุเรียนหมอนทอง',
    diseaseName: 'ใบอ่อนชะงักจากธาตุอาหารไม่สมดุล',
    date: 'ข้อมูลตัวอย่าง 12 พ.ค. 2569',
    confidence: 69,
    symptomsSummary: 'ใบอ่อนสีซีด แตกใบไม่สม่ำเสมอในแปลงทดลอง',
    treatmentSummary: 'อ่านค่าวิเคราะห์ดิน ปรับปุ๋ยรองพื้น และติดตามใบชุดถัดไป',
    status: 'ดีขึ้นแล้ว',
  },
];

export const assistantPrompts = [
  'แนะนำการปลูกพืช',
  'วิเคราะห์โรคพืช',
  'ปัญหาดินและปุ๋ย',
  'ราคาพืชผลวันนี้',
];

export const profileStats = [
  { label: 'คำถาม AI', value: '12' },
  { label: 'วิดีโอบันทึก', value: '8' },
  { label: 'โพสต์ของฉัน', value: '5' },
];

export const demoUser = {
  name: 'คุณกานต์',
  province: 'นครปฐม',
  plan: 'สมาชิกทดลองใช้',
  cropFocus: 'ข้าว ผักสวนครัว และไม้ผล',
  badge: 'KasetHub Early Member',
};

export const platformHighlights = [
  {
    title: 'ความรู้จากวิดีโอ',
    body: 'รวมวิดีโอเกษตรไทย จัดหมวดหมู่ให้ค้นง่าย',
    icon: PlaySquare,
  },
  {
    title: 'ผู้ช่วย AI เกษตร',
    body: 'ออกแบบไว้สำหรับถามปัญหาในแปลงแบบเป็นขั้นตอน',
    icon: Bot,
  },
  {
    title: 'ชุมชนที่มีบริบท',
    body: 'โพสต์ตามพืช พื้นที่ และปัญหาที่เจอจริง',
    icon: Sprout,
  },
];
