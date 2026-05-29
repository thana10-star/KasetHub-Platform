export type GeminiSafetyCategory =
  | 'HARM_CATEGORY_HARASSMENT'
  | 'HARM_CATEGORY_HATE_SPEECH'
  | 'HARM_CATEGORY_SEXUALLY_EXPLICIT'
  | 'HARM_CATEGORY_DANGEROUS_CONTENT'
  | 'HARM_CATEGORY_CIVIC_INTEGRITY';

export type GeminiSafetyThreshold =
  | 'BLOCK_LOW_AND_ABOVE'
  | 'BLOCK_MEDIUM_AND_ABOVE'
  | 'BLOCK_ONLY_HIGH'
  | 'BLOCK_NONE';

export type GeminiSafetySetting = {
  category: GeminiSafetyCategory;
  threshold: GeminiSafetyThreshold;
};

export type GeminiSafetySettingsOptions = {
  includeCivicIntegrity?: boolean;
  additionalCategories?: string[];
};

const BASE_SAFETY_SETTINGS: GeminiSafetySetting[] = [
  {
    category: 'HARM_CATEGORY_HARASSMENT',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
  },
  {
    category: 'HARM_CATEGORY_HATE_SPEECH',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
  },
  {
    category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
  },
  {
    category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
    threshold: 'BLOCK_LOW_AND_ABOVE',
  },
];

const CIVIC_INTEGRITY_SETTING: GeminiSafetySetting = {
  category: 'HARM_CATEGORY_CIVIC_INTEGRITY',
  threshold: 'BLOCK_MEDIUM_AND_ABOVE',
};

const KNOWN_GEMINI_SAFETY_CATEGORIES = new Set<GeminiSafetyCategory>([
  'HARM_CATEGORY_HARASSMENT',
  'HARM_CATEGORY_HATE_SPEECH',
  'HARM_CATEGORY_SEXUALLY_EXPLICIT',
  'HARM_CATEGORY_DANGEROUS_CONTENT',
  'HARM_CATEGORY_CIVIC_INTEGRITY',
]);

export function isKnownGeminiSafetyCategory(category: string): category is GeminiSafetyCategory {
  return KNOWN_GEMINI_SAFETY_CATEGORIES.has(category as GeminiSafetyCategory);
}

export function buildGeminiSafetySetting(
  category: string,
  threshold: GeminiSafetyThreshold = 'BLOCK_MEDIUM_AND_ABOVE',
): GeminiSafetySetting | undefined {
  if (!isKnownGeminiSafetyCategory(category)) {
    return undefined;
  }

  return {
    category,
    threshold,
  };
}

export function buildGeminiSafetySettings(options: GeminiSafetySettingsOptions = {}): GeminiSafetySetting[] {
  const settings = [...BASE_SAFETY_SETTINGS];
  const includeCivicIntegrity = options.includeCivicIntegrity ?? true;

  // Civic category support can vary by model/API version; verify before live activation.
  if (includeCivicIntegrity) {
    settings.push(CIVIC_INTEGRITY_SETTING);
  }

  options.additionalCategories?.forEach((category) => {
    const setting = buildGeminiSafetySetting(category);

    if (!setting) {
      return;
    }

    if (!settings.some((existing) => existing.category === setting.category)) {
      settings.push(setting);
    }
  });

  return settings;
}
