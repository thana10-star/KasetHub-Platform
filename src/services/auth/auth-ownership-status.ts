import { getMockSession } from '@/services/auth/phone-auth-local-mock';
import { getSupabasePhoneStagingSessionPreview } from '@/services/auth/phone-auth-staging-adapter';
import type {
  AuthOwnershipStatus,
  AuthOwnershipStatusInput,
} from '@/services/auth/auth-ownership-status.types';

function maskId(value: string) {
  if (value.length <= 10) return `${value.slice(0, 3)}...`;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

export function getAuthOwnershipStatus(input: AuthOwnershipStatusInput = {}): AuthOwnershipStatus {
  const phoneMockSession = input.phoneMockSession === undefined ? getMockSession() : input.phoneMockSession;
  const supabaseSessionPreview =
    input.supabaseSessionPreview === undefined
      ? getSupabasePhoneStagingSessionPreview()
      : input.supabaseSessionPreview;

  if (supabaseSessionPreview) {
    return {
      source: 'supabase_phone_staging',
      label: 'พบ Supabase Phone Auth staging session',
      realSupabaseSessionDetected: true,
      localMockSessionDetected: Boolean(phoneMockSession),
      ownershipVerified: true,
      syncAllowed: false,
      userIdMasked: supabaseSessionPreview.userIdMasked,
      phoneNumberMasked: supabaseSessionPreview.phoneNumberMasked,
      sessionCreatedAt: supabaseSessionPreview.createdAt,
      explanation:
        'พบ session preview จาก Supabase Phone Auth staging แล้ว แต่ M62 ยังไม่อนุญาตให้ upload Guest Memory จนกว่าจะมี milestone ตรวจ owner/RLS และ consent เพิ่ม',
      nextRequiredMilestone: 'M63 ownership/RLS sync gate',
      warnings: [
        'syncAllowed ยังเป็น false',
        'ห้ามเขียน app tables หรือ Guest Memory cloud sync ใน M62',
        'ใช้ user id แบบ masked บน UI เท่านั้น',
      ],
    };
  }

  if (phoneMockSession) {
    return {
      source: 'local_mock_phone',
      label: 'พบ Phone mock session',
      realSupabaseSessionDetected: false,
      localMockSessionDetected: true,
      ownershipVerified: false,
      syncAllowed: false,
      userIdMasked: maskId(phoneMockSession.mockUserId),
      phoneNumberMasked: phoneMockSession.phoneNumberMasked,
      sessionCreatedAt: phoneMockSession.createdAt,
      explanation:
        'Phone mock session ใช้ทดสอบ UX เท่านั้น ไม่ใช่ owner จริงบน Supabase และไม่สามารถใช้ sync Guest Memory ได้',
      nextRequiredMilestone: 'M63 ownership/RLS sync gate',
      warnings: [
        'mock session ไม่ใช่ real ownership',
        'Guest Memory sync ยังถูก block',
      ],
    };
  }

  return {
    source: 'guest_only',
    label: 'Guest only',
    realSupabaseSessionDetected: false,
    localMockSessionDetected: false,
    ownershipVerified: false,
    syncAllowed: false,
    userIdMasked: null,
    phoneNumberMasked: null,
    sessionCreatedAt: null,
    explanation: 'ยังไม่พบ session ใดๆ ผู้ใช้ยังอยู่ใน Guest mode และข้อมูลยังอยู่ในเครื่องนี้เท่านั้น',
    nextRequiredMilestone: 'M62 controlled Phone Auth staging test',
    warnings: [
      'ยังไม่มี real Supabase Phone Auth session',
      'Guest Memory sync ยังถูก block',
    ],
  };
}
