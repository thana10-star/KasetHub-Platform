import { describe, expect, test } from 'vitest';
import { parseGeminiFarmerAssistantResponse } from './gemini-response-parser';

describe('M145 Gemini response parser', () => {
  test('parses a normal mocked text response into the dry-run contract shape', () => {
    const parsed = parseGeminiFarmerAssistantResponse({
      candidates: [
        {
          content: {
            parts: [
              {
                text: 'สิ่งที่อาจเกิดขึ้น\nอาจเป็นอาการขาดธาตุอาหารหรือรากชื้นหลังฝนตก',
              },
            ],
          },
          finishReason: 'STOP',
          safetyRatings: [
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              probability: 'NEGLIGIBLE',
            },
          ],
        },
      ],
      usageMetadata: {
        promptTokenCount: 10,
      },
    });

    expect(parsed.ok).toBe(true);

    if (parsed.ok) {
      expect(parsed.response.status).toBe('ready');
      expect(parsed.response.provider).toBe('mock');
      expect(parsed.response.providerMode).toBe('dry_run');
      expect(parsed.response.answer).toContain('สิ่งที่อาจเกิดขึ้น');
      expect(parsed.safetyLevel).toBe('caution');
      expect(parsed.metadata.finishReason).toBe('STOP');
      expect(parsed.metadata.safetyCategories).toContain('HARM_CATEGORY_DANGEROUS_CONTENT');
    }
  });

  test('handles empty candidates', () => {
    const parsed = parseGeminiFarmerAssistantResponse({ candidates: [] });

    expect(parsed.ok).toBe(false);

    if (!parsed.ok) {
      expect(parsed.reasonCode).toBe('gemini_empty_candidates');
      expect(parsed.safetyLevel).toBe('caution');
    }
  });

  test('handles blocked safety responses without exposing raw provider details', () => {
    const parsed = parseGeminiFarmerAssistantResponse({
      promptFeedback: {
        blockReason: 'SAFETY',
        blockReasonMessage: 'raw provider detail with AIzaTESTSHOULDNOTLEAK',
      },
      candidates: [],
    });
    const serialized = JSON.stringify(parsed);

    expect(parsed.ok).toBe(false);

    if (!parsed.ok) {
      expect(parsed.reasonCode).toBe('gemini_safety_blocked');
      expect(parsed.safetyLevel).toBe('high_risk');
    }

    expect(serialized).not.toContain('raw provider detail');
    expect(serialized).not.toContain('AIzaTESTSHOULDNOTLEAK');
  });

  test('handles malformed responses', () => {
    const parsed = parseGeminiFarmerAssistantResponse('not an object');

    expect(parsed.ok).toBe(false);

    if (!parsed.ok) {
      expect(parsed.reasonCode).toBe('gemini_malformed_response');
    }
  });

  test('handles missing text', () => {
    const parsed = parseGeminiFarmerAssistantResponse({
      candidates: [
        {
          content: {
            parts: [{ text: '   ' }],
          },
          finishReason: 'STOP',
        },
      ],
    });

    expect(parsed.ok).toBe(false);

    if (!parsed.ok) {
      expect(parsed.reasonCode).toBe('gemini_missing_text');
    }
  });

  test('handles safety finish reasons as blocked output', () => {
    const parsed = parseGeminiFarmerAssistantResponse({
      candidates: [
        {
          content: {
            parts: [{ text: 'unsafe text should not be used' }],
          },
          finishReason: 'SAFETY',
          safetyRatings: [
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              probability: 'HIGH',
            },
          ],
        },
      ],
    });

    expect(parsed.ok).toBe(false);

    if (!parsed.ok) {
      expect(parsed.reasonCode).toBe('gemini_safety_blocked');
      expect(parsed.metadata.safetyProbabilities).toContain('HIGH');
    }
  });
});
