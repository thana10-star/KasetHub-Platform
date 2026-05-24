import { describe, expect, it } from 'vitest';
import {
  aiTextBlockedFixtureRequest,
  aiTextCalculatorFixtureRequest,
} from '@/services/ai-text/ai-text-fixtures';
import {
  buildAITextEndpointResponse,
  findFrontendAITextEndpointSecretKeys,
  getAITextEndpointContractSummary,
} from '@/services/ai-text/ai-text-endpoint-contract';
import { buildAITextEndpointDryRunPlan } from '@/services/ai-text/ai-text-endpoint-dry-run';

describe('AI text endpoint contract dry-run', () => {
  it('keeps the default build unable to call the endpoint', () => {
    const plan = buildAITextEndpointDryRunPlan();

    expect(plan.canCallEndpoint).toBe(false);
    expect(plan.fetchWouldRun).toBe(false);
    expect(plan.providerWouldRun).toBe(false);
    expect(plan.defaultNoNetworkProof).toBe(true);
  });

  it('does not enable network with endpoint URL alone', () => {
    const plan = buildAITextEndpointDryRunPlan(aiTextCalculatorFixtureRequest, {
      aiTextEndpointUrl: 'https://example.supabase.co/functions/v1/ai-text-proxy',
    });

    expect(plan.endpointUrlPresent).toBe(true);
    expect(plan.canCallEndpoint).toBe(false);
    expect(plan.blockers.map((blocker) => blocker.id)).toContain('endpoint_url_alone_not_enough');
  });

  it('does not enable network with network flag alone', () => {
    const plan = buildAITextEndpointDryRunPlan(aiTextCalculatorFixtureRequest, {
      enableAITextEndpointNetwork: true,
    });

    expect(plan.endpointNetworkEnabled).toBe(true);
    expect(plan.canCallEndpoint).toBe(false);
    expect(plan.fetchWouldRun).toBe(false);
  });

  it('keeps dry-run from calling a provider even when staging flags are present', () => {
    const plan = buildAITextEndpointDryRunPlan(aiTextCalculatorFixtureRequest, {
      enableRealAIText: true,
      aiTextMode: 'staging_proxy_ready',
      aiTextProxyMode: 'staging_proxy',
      enableAITextNetwork: true,
      aiTextEndpointUrl: 'https://example.supabase.co/functions/v1/ai-text-proxy',
      enableAITextEndpointDryRun: true,
      enableAITextEndpointNetwork: true,
    });

    expect(plan.dryRunEnabled).toBe(true);
    expect(plan.endpointNetworkEnabled).toBe(true);
    expect(plan.fetchWouldRun).toBe(false);
    expect(plan.providerWouldRun).toBe(false);
    expect(plan.blockers.map((blocker) => blocker.id)).toContain('m82_provider_call_blocked');
  });

  it('rejects provider keys from frontend config', () => {
    const secrets = findFrontendAITextEndpointSecretKeys({
      VITE_OPENAI_API_KEY: 'not-allowed',
      VITE_AI_TEXT_MODE: 'local_fixture',
    });

    expect(secrets).toContain('VITE_OPENAI_API_KEY');
  });

  it('rejects service-role keys from frontend config', () => {
    const plan = buildAITextEndpointDryRunPlan(aiTextCalculatorFixtureRequest, {
      frontendConfig: {
        VITE_SUPABASE_SERVICE_ROLE_KEY: 'not-allowed',
      },
    });

    expect(plan.blockers.map((blocker) => blocker.id)).toContain('service_role_frontend_blocked');
  });

  it('blocks unsafe endpoint requests', () => {
    const response = buildAITextEndpointResponse(aiTextBlockedFixtureRequest);

    expect(response.status).toBe('policy_blocked');
    expect(response.policyCheck.blockedActions.length).toBeGreaterThan(0);
    expect(response.providerCalled).toBe(false);
  });

  it('returns a safe timeout fallback plan', () => {
    const plan = buildAITextEndpointDryRunPlan();

    expect(plan.timeoutPlan.returnsFixtureOnTimeout).toBe(true);
    expect(plan.timeoutPlan.providerCallSkippedInM82).toBe(true);
    expect(plan.timeoutPlan.canMutateCalculatorOutput).toBe(false);
  });

  it('keeps audit and rate-limit previews planning-only', () => {
    const plan = buildAITextEndpointDryRunPlan();

    expect(plan.auditEvents.every((event) => event.wouldWriteSupabase === false)).toBe(true);
    expect(plan.rateLimitCheck.wouldWriteSupabase).toBe(false);
    expect(plan.noSupabaseWrite).toBe(true);
  });

  it('blocks production/default frontend provider calls', () => {
    const plan = buildAITextEndpointDryRunPlan(aiTextCalculatorFixtureRequest, {
      aiTextMode: 'production_disabled',
      aiTextEndpointUrl: 'https://example.supabase.co/functions/v1/ai-text-proxy',
      enableAITextEndpointDryRun: true,
      enableAITextEndpointNetwork: true,
    });

    expect(plan.productionBlocked).toBe(true);
    expect(plan.canCallEndpoint).toBe(false);
    expect(plan.providerWouldRun).toBe(false);
  });

  it('preserves calculator snapshots immutably', () => {
    const response = buildAITextEndpointResponse(aiTextCalculatorFixtureRequest);

    expect(response.immutableOutputPreserved).toBe(true);
    expect(response.timeoutPlan.canMutateCalculatorOutput).toBe(false);
    expect(response.lockedOutputSnapshot?.lockedHash).toBe(
      aiTextCalculatorFixtureRequest.lockedOutputSnapshot?.lockedHash,
    );
  });

  it('summarizes a backend-owned endpoint contract', () => {
    const summary = getAITextEndpointContractSummary();

    expect(summary.endpointName).toBe('ai-text-proxy');
    expect(summary.providerKeyBackendOnly).toBe(true);
    expect(summary.noProviderCallInM82).toBe(true);
  });
});
