import { AI_TEXT_POLICY_VERSION } from '@/services/ai-text/ai-text-policy';
import type { AITextAuditPreview, AITextRateLimitPreview, AITextRequest } from '@/services/ai-text/ai-text-proxy.types';

export function buildAITextAuditPreview(request: Pick<AITextRequest, 'id' | 'requestType'>): AITextAuditPreview {
  return {
    requestId: request.id,
    policyVersion: AI_TEXT_POLICY_VERSION,
    wouldWriteAuditLog: false,
    noSupabaseWrite: true,
    noCloudSyncWrite: true,
    releaseGateRequired: true,
    events: [
      'request_received',
      `request_type_checked:${request.requestType}`,
      'blocked_actions_checked',
      'rate_limit_preview_checked',
      'provider_key_frontend_absent',
      'service_role_frontend_absent',
      'release_gate_required_before_rollout',
    ],
  };
}

export function buildAITextRateLimitPreview(): AITextRateLimitPreview {
  return {
    scope: 'staging_user_or_device',
    dailyLimit: 20,
    remainingPreview: 20,
    cooldownSeconds: 30,
    rateLimitRequired: true,
    wouldWriteRateLimit: false,
  };
}
