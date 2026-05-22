import type { GuestMemorySyncRequestPayload } from '@/services/backend/guest-sync-endpoint.types';
import type {
  GuestSyncMockScenario,
  MockGuestSyncResponse,
} from '@/server/guest-sync/mock-guest-sync.types';

export type GuestSyncMode = 'local_fixture' | 'backend_test_disabled' | 'backend_test_ready' | 'production_disabled';

export type GuestSyncAdapterStatus = {
  mode: GuestSyncMode;
  modeLabel: string;
  backendSyncEnabled: boolean;
  localHandlerEnabled: boolean;
  canUseLocalFixture: boolean;
  canAttemptBackend: boolean;
  canUseLocalHandler: boolean;
  serviceRoleAvailableInFrontend: false;
  networkCallsEnabled: false;
  currentAdapterPath: 'local_fixture' | 'local_backend_handler' | 'disabled_response';
  environmentReadiness:
    | 'local_fixture_active'
    | 'backend_disabled'
    | 'backend_test_ready_no_fetch'
    | 'backend_test_ready_local_handler'
    | 'production_disabled';
  readinessLabel: string;
  supportedProviders: Array<'phone' | 'line' | 'google'>;
  supportedRecordTypes: string[];
  lastSyncStatus?: {
    syncRequestId: string;
    status: MockGuestSyncResponse['status'];
    mode: GuestSyncMode;
    createdAt: string;
  };
  warnings: string[];
};

export type RunGuestSyncInput = {
  payload: GuestMemorySyncRequestPayload;
  scenario?: GuestSyncMockScenario;
};

export type GuestSyncAdapter = {
  runDryRun(input: RunGuestSyncInput): MockGuestSyncResponse;
  getStatus(): GuestSyncAdapterStatus;
};
