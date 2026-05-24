import type { CalculatorCategory } from '@/services/agri-calculators/agri-calculator.types';
import type { CalculatorResultSummary } from '@/services/agri-calculators/calculator-result-summary.types';

export type CalculatorAIExplanationAllowedAction =
  | 'explain_inputs'
  | 'explain_formulas'
  | 'explain_result_meaning'
  | 'suggest_what_to_double_check'
  | 'suggest_asking_expert'
  | 'explain_safety_disclaimer';

export type CalculatorAIExplanationBlockedAction =
  | 'change_deterministic_result'
  | 'recommend_chemical_products'
  | 'recommend_exact_fertilizer_dose_not_in_calculator'
  | 'mention_sponsor_product'
  | 'claim_guaranteed_yield_or_profit'
  | 'override_label_instructions'
  | 'hide_uncertainty';

export type CalculatorAIExplanationRisk = 'low' | 'medium' | 'high';

export type CalculatorAIExplanationActionDefinition<TAction extends string> = {
  id: TAction;
  label: string;
  description: string;
};

export type CalculatorAIExplanationBoundary = {
  allowedActions: Array<CalculatorAIExplanationActionDefinition<CalculatorAIExplanationAllowedAction>>;
  blockedActions: Array<CalculatorAIExplanationActionDefinition<CalculatorAIExplanationBlockedAction>>;
  defaultSafetyDisclaimers: string[];
  highRiskCalculatorCategories: CalculatorCategory[];
};

export type CalculatorAIExplanationRequest = {
  summary: CalculatorResultSummary;
  calculatorType: CalculatorCategory;
  cropLabel?: string;
  warnings?: string[];
  safetyDisclaimers?: string[];
  requestedActions?: ReadonlyArray<CalculatorAIExplanationAllowedAction | CalculatorAIExplanationBlockedAction>;
  userQuestion?: string;
};

export type CalculatorAIExplanationPlan = {
  requestId: string;
  calculatorType: CalculatorCategory;
  calculatorLabel: string;
  cropLabel?: string;
  explanationMode: 'local_policy_preview';
  riskLevel: CalculatorAIExplanationRisk;
  allowedSections: Array<{
    id: CalculatorAIExplanationAllowedAction;
    title: string;
    bullets: string[];
  }>;
  blockedSections: Array<{
    id: CalculatorAIExplanationBlockedAction;
    title: string;
    reason: string;
  }>;
  allowedRequestedActions: CalculatorAIExplanationAllowedAction[];
  blockedRequestedActions: CalculatorAIExplanationBlockedAction[];
  promptScaffoldPreview: string;
  safetyDisclaimers: string[];
  resultValueSnapshot: string[];
  formulaIntegrity: {
    deterministicResultUnchanged: true;
    noFormulaMutation: true;
    noHiddenRecommendation: true;
  };
  noRealAICall: true;
};
