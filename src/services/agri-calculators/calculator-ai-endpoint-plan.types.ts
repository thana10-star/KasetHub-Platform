export type CalculatorAIEndpointReadiness = 'planning_only' | 'blocked_until_backend_exists' | 'staging_checklist_ready';

export type CalculatorAIEndpointCheckStatus = 'required' | 'blocked' | 'planned';

export type CalculatorAIEndpointCheck = {
  id: string;
  label: string;
  detail: string;
  status: CalculatorAIEndpointCheckStatus;
};

export type CalculatorAIRequiredEnvFlag = {
  key: 'VITE_CALCULATOR_AI_MODE' | 'VITE_ENABLE_CALCULATOR_AI_BACKEND' | 'VITE_ENABLE_CALCULATOR_AI_NETWORK';
  requiredValue: string;
  currentDefault: string;
  note: string;
};

export type CalculatorAIEndpointPlan = {
  id: string;
  readiness: CalculatorAIEndpointReadiness;
  readinessLabel: string;
  noRealNetworkInM58: true;
  backendEndpointExists: false;
  frontendProviderKeysAllowed: false;
  endpointFlow: string[];
  requiredBackendChecks: CalculatorAIEndpointCheck[];
  requiredSafetyChecks: CalculatorAIEndpointCheck[];
  blockedProductionConditions: string[];
  requiredEnvFlags: CalculatorAIRequiredEnvFlag[];
  recommendedRolloutOrder: string[];
};
