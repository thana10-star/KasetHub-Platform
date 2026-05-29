import { describe, expect, test } from 'vitest';
import {
  buildGeminiSafetySetting,
  buildGeminiSafetySettings,
  isKnownGeminiSafetyCategory,
} from './gemini-safety-settings';

describe('M145 Gemini safety settings mapper', () => {
  test('returns conservative planned safety settings', () => {
    const settings = buildGeminiSafetySettings();

    expect(settings).toContainEqual({
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_LOW_AND_ABOVE',
    });
    expect(settings).toContainEqual({
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    });
    expect(settings).toContainEqual({
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    });
    expect(settings).toContainEqual({
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    });
    expect(settings).toContainEqual({
      category: 'HARM_CATEGORY_CIVIC_INTEGRITY',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    });
  });

  test('can omit civic integrity if the live API version does not support it', () => {
    const settings = buildGeminiSafetySettings({ includeCivicIntegrity: false });

    expect(settings.some((setting) => setting.category === 'HARM_CATEGORY_CIVIC_INTEGRITY')).toBe(false);
  });

  test('handles unsupported categories safely', () => {
    const settings = buildGeminiSafetySettings({
      additionalCategories: ['HARM_CATEGORY_UNSUPPORTED_FUTURE_VALUE'],
    });

    expect(isKnownGeminiSafetyCategory('HARM_CATEGORY_DANGEROUS_CONTENT')).toBe(true);
    expect(isKnownGeminiSafetyCategory('HARM_CATEGORY_UNSUPPORTED_FUTURE_VALUE')).toBe(false);
    expect(buildGeminiSafetySetting('HARM_CATEGORY_UNSUPPORTED_FUTURE_VALUE')).toBeUndefined();
    expect(settings.some((setting) => setting.category === 'HARM_CATEGORY_UNSUPPORTED_FUTURE_VALUE')).toBe(false);
  });
});
