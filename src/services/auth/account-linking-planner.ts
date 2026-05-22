import type {
  AccountLinkingPlan,
  AccountLinkingPlannerInput,
} from '@/services/auth/account-linking.types';

export function createAccountLinkingPlan(input: AccountLinkingPlannerInput): AccountLinkingPlan {
  const hasPhone = Boolean(input.phoneSession);
  const hasLine = Boolean(input.lineSession);

  if (input.hasProviderConflict) {
    return {
      status: 'provider_conflict',
      label: 'พบความขัดแย้งของบัญชี',
      description: 'มี provider ที่อาจผูกกับบัญชีอื่นอยู่ ต้องให้ผู้ใช้ยืนยันก่อนเชื่อมบัญชี',
      recommendedAction: 'ให้ผู้ใช้ตรวจสอบและยืนยันเจ้าของบัญชีก่อนซิงก์ข้อมูล',
      primaryRecoveryProvider: hasPhone ? 'phone' : null,
      linkedProvidersPreview: [hasPhone ? 'phone' : null, hasLine ? 'line' : null].filter(Boolean) as Array<
        'phone' | 'line'
      >,
      canPreviewLink: false,
      requiresUserConfirmation: true,
      canUseForGuestSyncOwnership: false,
      warnings: ['duplicate provider conflict requires user confirmation'],
    };
  }

  if (hasPhone && hasLine) {
    return {
      status: 'phone_line_link_candidate',
      label: 'พร้อมเชื่อม Phone + LINE แบบจำลอง',
      description: 'เบอร์โทรเป็นทางกู้คืนหลัก และ LINE เป็นช่องทางเสริมสำหรับผู้ใช้ที่ใช้ LINE เป็นประจำ',
      recommendedAction: 'ให้ผู้ใช้ยืนยันการเชื่อมบัญชีในอนาคตก่อนซิงก์ Guest Memory',
      primaryRecoveryProvider: 'phone',
      linkedProvidersPreview: ['phone', 'line'],
      canPreviewLink: true,
      requiresUserConfirmation: true,
      canUseForGuestSyncOwnership: true,
      warnings: ['ยังไม่เชื่อมบัญชีจริงในเวอร์ชันนี้'],
    };
  }

  if (hasPhone) {
    return {
      status: 'phone_only',
      label: 'มีเบอร์โทรเป็นเจ้าของบัญชีจำลอง',
      description: 'ใช้เบอร์โทรเป็นทางหลักสำหรับกู้คืนบัญชีและทดสอบ ownership gate ได้',
      recommendedAction: 'เชื่อม LINE ภายหลังเพื่อกลับมาใช้งานจากชุมชน LINE ได้ง่ายขึ้น',
      primaryRecoveryProvider: 'phone',
      linkedProvidersPreview: ['phone'],
      canPreviewLink: false,
      requiresUserConfirmation: false,
      canUseForGuestSyncOwnership: true,
      warnings: ['LINE ยังไม่ได้เชื่อม แม้ซิงก์จริงในอนาคตควรใช้บัญชีที่ยืนยันแล้ว'],
    };
  }

  if (hasLine) {
    return {
      status: 'line_only',
      label: 'มี LINE mock session',
      description: 'LINE เหมาะกับผู้ใช้ที่ใช้ LINE บ่อย แต่ควรเพิ่มเบอร์โทรไว้เป็นทางกู้คืนหลัก',
      recommendedAction: 'เพิ่มเบอร์โทรก่อนสำรองข้อมูลจริง เพื่อให้เจ้าของบัญชีชัดเจน',
      primaryRecoveryProvider: null,
      linkedProvidersPreview: ['line'],
      canPreviewLink: false,
      requiresUserConfirmation: true,
      canUseForGuestSyncOwnership: false,
      warnings: ['LINE-only preview ยังไม่ควรใช้เป็นเจ้าของ sync หลักจนกว่าจะยืนยันบัญชีจริง'],
    };
  }

  return {
    status: 'guest_only',
    label: 'ยังเป็น Guest',
    description: 'ใช้งานต่อได้เลย ไม่ต้องสมัคร ข้อมูลยังอยู่ในเครื่องนี้',
    recommendedAction: 'ยืนยันเบอร์โทรเมื่ออยากสำรองข้อมูล แล้วค่อยเชื่อม LINE ภายหลัง',
    primaryRecoveryProvider: null,
    linkedProvidersPreview: [],
    canPreviewLink: false,
    requiresUserConfirmation: false,
    canUseForGuestSyncOwnership: false,
    warnings: ['ยังไม่มีเจ้าของบัญชีสำหรับ cloud sync'],
  };
}
