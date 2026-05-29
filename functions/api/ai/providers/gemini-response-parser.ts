import type { FarmerAssistantResponse, FarmerAssistantSafetyLevel } from './provider-types';

export type GeminiResponseParserReasonCode =
  | 'gemini_empty_candidates'
  | 'gemini_safety_blocked'
  | 'gemini_malformed_response'
  | 'gemini_missing_text';

export type GeminiParsedResponseMetadata = {
  candidateCount: number;
  finishReason?: string;
  safetyCategories: string[];
  safetyProbabilities: string[];
};

export type GeminiParsedResponse =
  | {
      ok: true;
      response: FarmerAssistantResponse;
      safetyLevel: FarmerAssistantSafetyLevel;
      reasonCodes: string[];
      metadata: GeminiParsedResponseMetadata;
    }
  | {
      ok: false;
      reasonCode: GeminiResponseParserReasonCode;
      safetyLevel: FarmerAssistantSafetyLevel;
      reasonCodes: string[];
      metadata: GeminiParsedResponseMetadata;
    };

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readString(value: unknown) {
  return typeof value === 'string' ? value : undefined;
}

function readPromptBlockReason(response: UnknownRecord) {
  const promptFeedback = response.promptFeedback;

  if (!isRecord(promptFeedback)) {
    return undefined;
  }

  return readString(promptFeedback.blockReason);
}

function readSafetyRatings(value: unknown) {
  if (!Array.isArray(value)) {
    return {
      categories: [] as string[],
      probabilities: [] as string[],
    };
  }

  const categories: string[] = [];
  const probabilities: string[] = [];

  value.forEach((rating) => {
    if (!isRecord(rating)) {
      return;
    }

    const category = readString(rating.category);
    const probability = readString(rating.probability);

    if (category) {
      categories.push(category);
    }

    if (probability) {
      probabilities.push(probability);
    }
  });

  return { categories, probabilities };
}

function extractCandidateText(candidate: UnknownRecord) {
  const content = candidate.content;

  if (!isRecord(content) || !Array.isArray(content.parts)) {
    return undefined;
  }

  const textParts = content.parts
    .map((part) => {
      if (!isRecord(part)) {
        return undefined;
      }

      return readString(part.text);
    })
    .filter((text): text is string => Boolean(text?.trim()));

  if (textParts.length === 0) {
    return undefined;
  }

  return textParts.join('\n').trim();
}

function isSafetyFinishReason(finishReason?: string) {
  if (!finishReason) {
    return false;
  }

  return ['SAFETY', 'BLOCKLIST', 'PROHIBITED_CONTENT', 'RECITATION', 'SPII'].includes(finishReason);
}

function makeMetadata(
  candidateCount: number,
  finishReason?: string,
  safetyRatings?: ReturnType<typeof readSafetyRatings>,
): GeminiParsedResponseMetadata {
  return {
    candidateCount,
    finishReason,
    safetyCategories: safetyRatings?.categories ?? [],
    safetyProbabilities: safetyRatings?.probabilities ?? [],
  };
}

function failure(
  reasonCode: GeminiResponseParserReasonCode,
  safetyLevel: FarmerAssistantSafetyLevel,
  metadata: GeminiParsedResponseMetadata,
): GeminiParsedResponse {
  return {
    ok: false,
    reasonCode,
    safetyLevel,
    reasonCodes: [reasonCode],
    metadata,
  };
}

export function parseGeminiFarmerAssistantResponse(value: unknown): GeminiParsedResponse {
  if (!isRecord(value)) {
    return failure('gemini_malformed_response', 'caution', makeMetadata(0));
  }

  const promptBlockReason = readPromptBlockReason(value);

  if (promptBlockReason) {
    return failure('gemini_safety_blocked', 'high_risk', makeMetadata(0, promptBlockReason));
  }

  if (!Array.isArray(value.candidates)) {
    return failure('gemini_malformed_response', 'caution', makeMetadata(0));
  }

  if (value.candidates.length === 0) {
    return failure('gemini_empty_candidates', 'caution', makeMetadata(0));
  }

  const candidate = value.candidates[0];

  if (!isRecord(candidate)) {
    return failure('gemini_malformed_response', 'caution', makeMetadata(value.candidates.length));
  }

  const finishReason = readString(candidate.finishReason);
  const safetyRatings = readSafetyRatings(candidate.safetyRatings);
  const metadata = makeMetadata(value.candidates.length, finishReason, safetyRatings);

  if (isSafetyFinishReason(finishReason)) {
    return failure('gemini_safety_blocked', 'high_risk', metadata);
  }

  const answer = extractCandidateText(candidate);

  if (!answer) {
    return failure('gemini_missing_text', 'caution', metadata);
  }

  const safetyLevel: FarmerAssistantSafetyLevel = safetyRatings.categories.length > 0 ? 'caution' : 'normal';

  return {
    ok: true,
    response: {
      status: 'ready',
      answer,
      safetyLevel,
      provider: 'mock',
      providerMode: 'dry_run',
    },
    safetyLevel,
    reasonCodes: [],
    metadata,
  };
}
