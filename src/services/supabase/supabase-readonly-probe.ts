import { createClient } from '@supabase/supabase-js';
import { publicEnv } from '@/config/env';
import { checkSupabaseConfig } from '@/services/supabase/supabase-config-check';
import type {
  SupabaseReadonlyProbeOverallStatus,
  SupabaseReadonlyProbePlan,
  SupabaseReadonlyProbeResult,
  SupabaseReadonlyProbeTable,
  SupabaseReadonlyProbeTableName,
  SupabaseReadonlyProbeTableResult,
  SupabaseReadonlyProbeTableStatus,
} from '@/services/supabase/supabase-readonly-probe.types';

export const supabaseReadonlyProbeTables: SupabaseReadonlyProbeTable[] = [
  {
    name: 'articles',
    label: 'articles',
    purpose: 'published public article metadata/content check',
  },
  {
    name: 'videos',
    label: 'videos',
    purpose: 'visible public video metadata check',
  },
  {
    name: 'crop_price_snapshots',
    label: 'crop_price_snapshots',
    purpose: 'public crop price reference snapshot check',
  },
];

const noWriteGuarantees = [
  'select/count only; no insert, update, delete, upsert, RPC, or storage call',
  'public/read-safe tables only: articles, videos, crop_price_snapshots',
  'no service-role key and no privileged backend secret',
  'no auth session, no phone OTP, and no cloud sync',
  'no uploads, AI API calls, Edge Function calls, or app data writes',
];

function decodeJwtPayload(value: string) {
  const [, payload] = value.split('.');

  if (!payload) {
    return '';
  }

  try {
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    return atob(padded);
  } catch {
    return '';
  }
}

function looksLikeServiceRoleKey(value: string) {
  const lower = value.toLowerCase();
  const decodedPayload = decodeJwtPayload(value).toLowerCase();

  return (
    lower.includes('service_role') ||
    lower.includes('service-role') ||
    lower.includes('service role') ||
    decodedPayload.includes('"role":"service_role"') ||
    decodedPayload.includes('service_role')
  );
}

function sanitizeErrorMessage(value: string) {
  return value
    .replace(/https?:\/\/\S+/gi, '[url]')
    .replace(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, '[jwt]')
    .replace(/[A-Za-z0-9_-]{32,}/g, '[redacted]')
    .slice(0, 220);
}

function statusLabel(status: SupabaseReadonlyProbeOverallStatus) {
  const labels: Record<SupabaseReadonlyProbeOverallStatus, string> = {
    network_disabled: 'network disabled',
    config_missing: 'config missing',
    client_not_created: 'client not created',
    blocked_by_safety_flags: 'blocked by safety flags',
    running: 'running',
    success: 'success',
    partial: 'partial',
    blocked: 'blocked',
    error: 'error',
  };

  return labels[status];
}

function toneForStatus(status: SupabaseReadonlyProbeOverallStatus): SupabaseReadonlyProbePlan['statusTone'] {
  if (status === 'success') {
    return 'success';
  }

  if (status === 'blocked' || status === 'blocked_by_safety_flags' || status === 'error') {
    return 'danger';
  }

  if (status === 'network_disabled') {
    return 'info';
  }

  return 'warning';
}

function tableStatusLabel(status: SupabaseReadonlyProbeTableStatus) {
  const labels: Record<SupabaseReadonlyProbeTableStatus, string> = {
    not_attempted: 'not attempted',
    empty_success: 'empty table OK',
    read_success: 'read OK',
    rls_or_policy_blocked: 'RLS/policy blocked',
    table_missing: 'table missing',
    network_error: 'network error',
    unknown_error: 'unknown error',
  };

  return labels[status];
}

function createNotAttemptedTableResult(
  table: SupabaseReadonlyProbeTable,
  status: SupabaseReadonlyProbeTableStatus,
  message: string,
): SupabaseReadonlyProbeTableResult {
  return {
    table: table.name,
    label: table.label,
    status,
    statusLabel: tableStatusLabel(status),
    message,
    rowsReturned: null,
  };
}

function isTableMissingError(error: { code?: string; message: string }) {
  const lowerMessage = error.message.toLowerCase();

  return (
    error.code === '42P01' ||
    error.code === 'PGRST205' ||
    lowerMessage.includes('could not find') ||
    lowerMessage.includes('does not exist') ||
    lowerMessage.includes('schema cache')
  );
}

function isPolicyBlockedError(error: { code?: string; message: string; status?: number }) {
  const lowerMessage = error.message.toLowerCase();

  return (
    error.code === '42501' ||
    error.status === 401 ||
    error.status === 403 ||
    lowerMessage.includes('permission denied') ||
    lowerMessage.includes('row-level security') ||
    lowerMessage.includes('rls')
  );
}

export function buildSupabaseReadonlyProbePlan(): SupabaseReadonlyProbePlan {
  const config = checkSupabaseConfig();
  const serviceRoleLikeKeyDetected = looksLikeServiceRoleKey(publicEnv.supabaseAnonKey);
  const networkEnabled = publicEnv.enableSupabaseDryRunNetworkCheck;
  const unsafeFeatureFlagsEnabled = publicEnv.enableAuth || publicEnv.enableCloudSync;
  const blockers: string[] = [];
  const warnings = [...config.warnings];

  if (!publicEnv.enableSupabase) {
    blockers.push('VITE_ENABLE_SUPABASE is false, so the read-only probe will not create a client.');
  }

  if (!config.hasRequiredEnv) {
    blockers.push('VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required locally before probing.');
  }

  if (!config.canCreateClient || serviceRoleLikeKeyDetected) {
    blockers.push('Supabase config is not client-safe enough to create an anon client.');
  }

  if (!networkEnabled) {
    warnings.push('VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK is false, so no network read will run.');
  }

  if (unsafeFeatureFlagsEnabled) {
    blockers.push('VITE_ENABLE_AUTH and VITE_ENABLE_CLOUD_SYNC must stay false for M43.');
  }

  const allowedByGuards =
    publicEnv.enableSupabase &&
    networkEnabled &&
    config.canCreateClient &&
    !serviceRoleLikeKeyDetected &&
    !unsafeFeatureFlagsEnabled;

  const status: SupabaseReadonlyProbeOverallStatus = unsafeFeatureFlagsEnabled
    ? 'blocked_by_safety_flags'
    : !networkEnabled
      ? 'network_disabled'
      : !config.hasRequiredEnv
        ? 'config_missing'
        : !config.canCreateClient || serviceRoleLikeKeyDetected
          ? 'client_not_created'
          : 'running';

  return {
    milestone: 'M43',
    status,
    statusLabel: statusLabel(status),
    statusTone: toneForStatus(status),
    connectionStatus: allowedByGuards
      ? 'Ready to create anon Supabase client for read-only public table checks.'
      : 'No live Supabase read will run until all local guards pass.',
    configSafetyStatus: serviceRoleLikeKeyDetected
      ? 'blocked: service-role-like key detected'
      : config.canCreateClient
        ? 'client-safe anon config shape detected'
        : 'waiting for client-safe staging URL and anon key',
    config: {
      hasUrl: config.hasUrl,
      hasAnonKey: config.hasAnonKey,
      hasRequiredEnv: config.hasRequiredEnv,
      urlLooksValid: config.urlLooksValid,
      anonKeyLooksUsable: config.anonKeyLooksUsable,
      serviceRoleLikeKeyDetected,
    },
    flags: {
      enableSupabase: publicEnv.enableSupabase,
      enableDryRunNetworkCheck: networkEnabled,
      enableAuth: publicEnv.enableAuth,
      enableCloudSync: publicEnv.enableCloudSync,
    },
    clientCreated: false,
    networkEnabled,
    allowedByGuards,
    tables: supabaseReadonlyProbeTables,
    noWriteGuarantees,
    blockers,
    warnings,
    nextSteps: allowedByGuards
      ? [
          'Run the probe only on kasethub-staging.',
          'Review each table result; empty table success is OK for a fresh staging database.',
          'Turn VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK back to false after the check if desired.',
        ]
      : [
          'Add only VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to local .env.local.',
          'Set VITE_ENABLE_SUPABASE=true and VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=true only for this read-only check.',
          'Keep VITE_ENABLE_AUTH=false and VITE_ENABLE_CLOUD_SYNC=false.',
        ],
  };
}

async function probeTable(table: SupabaseReadonlyProbeTable): Promise<SupabaseReadonlyProbeTableResult> {
  const client = createClient(publicEnv.supabaseUrl, publicEnv.supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });

  try {
    const { count, error } = await client
      .from(table.name)
      .select('*', { count: 'exact', head: true })
      .limit(1);

    if (!error) {
      const rowsReturned = count ?? 0;
      const status: SupabaseReadonlyProbeTableStatus = rowsReturned === 0 ? 'empty_success' : 'read_success';

      return {
        table: table.name,
        label: table.label,
        status,
        statusLabel: tableStatusLabel(status),
        message: rowsReturned === 0
          ? 'Read-only count succeeded and the table is empty or has no public rows; this is OK for staging.'
          : 'Read-only count succeeded without returning row data.',
        rowsReturned,
      };
    }

    const status: SupabaseReadonlyProbeTableStatus = isTableMissingError(error)
      ? 'table_missing'
      : isPolicyBlockedError(error)
        ? 'rls_or_policy_blocked'
        : 'unknown_error';

    return {
      table: table.name,
      label: table.label,
      status,
      statusLabel: tableStatusLabel(status),
      message: status === 'table_missing'
        ? 'Table was not found by the anon read probe.'
        : status === 'rls_or_policy_blocked'
          ? 'Anon read was blocked by table grants, RLS, or policy configuration.'
          : 'Read-only probe failed without exposing key material.',
      rowsReturned: null,
      errorCode: error.code,
      safeErrorMessage: sanitizeErrorMessage(error.message),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown network error';

    return {
      table: table.name,
      label: table.label,
      status: 'network_error',
      statusLabel: tableStatusLabel('network_error'),
      message: 'Network request failed before the table result could be read.',
      rowsReturned: null,
      safeErrorMessage: sanitizeErrorMessage(message),
    };
  }
}

function finalizeStatus(tableResults: SupabaseReadonlyProbeTableResult[]): SupabaseReadonlyProbeOverallStatus {
  if (tableResults.every((result) => result.status === 'read_success' || result.status === 'empty_success')) {
    return 'success';
  }

  if (tableResults.some((result) => result.status === 'rls_or_policy_blocked')) {
    return 'blocked';
  }

  if (tableResults.some((result) => result.status === 'table_missing')) {
    return 'partial';
  }

  return 'error';
}

export async function runSupabaseReadonlyProbe(): Promise<SupabaseReadonlyProbeResult> {
  const plan = buildSupabaseReadonlyProbePlan();

  if (!plan.allowedByGuards) {
    return {
      ...plan,
      attempted: false,
      completedAt: null,
      tableResults: plan.tables.map((table) =>
        createNotAttemptedTableResult(
          table,
          'not_attempted',
          plan.networkEnabled
            ? 'Probe not attempted because config or safety guards did not pass.'
            : 'Network disabled; no Supabase request was made.',
        ),
      ),
      tablesChecked: [],
      totalRowsReturned: 0,
    };
  }

  const tableResults = await Promise.all(plan.tables.map((table) => probeTable(table)));
  const status = finalizeStatus(tableResults);
  const totalRowsReturned = tableResults.reduce((sum, result) => sum + (result.rowsReturned ?? 0), 0);

  return {
    ...plan,
    status,
    statusLabel: statusLabel(status),
    statusTone: toneForStatus(status),
    connectionStatus: 'Anon Supabase client was created only for read-only public table count probes.',
    clientCreated: true,
    attempted: true,
    completedAt: new Date().toISOString(),
    tableResults,
    tablesChecked: plan.tables.map((table) => table.name),
    totalRowsReturned,
  };
}

export function getSupabaseReadonlyProbeTableNames(): SupabaseReadonlyProbeTableName[] {
  return supabaseReadonlyProbeTables.map((table) => table.name);
}
