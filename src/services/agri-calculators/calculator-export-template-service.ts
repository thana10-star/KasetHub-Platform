import type { SharePayload } from '@/services/share/share-service';
import type {
  CalculatorClipboardLike,
  CalculatorExportTemplate,
  CalculatorExportTemplateOptions,
  CalculatorNativeShareLike,
  CalculatorShareFallbackResult,
  CalculatorTextClampResult,
} from '@/services/agri-calculators/calculator-export-template.types';
import type { CalculatorResultSummary } from '@/services/agri-calculators/calculator-result-summary.types';

export const calculatorExportSourceLabel = 'KasetHub เครื่องคำนวณเกษตร';
export const calculatorLineFriendlyMaxChars = 850;
export const calculatorLongDetailMaxChars = 3800;

const emptySummaryMessage = 'ยังไม่มีข้อความสรุปสำหรับแชร์';
const unsupportedShareMessage = 'อุปกรณ์นี้ไม่รองรับการแชร์โดยตรง';
const copyInsteadMessage = 'ลองคัดลอกข้อความแทน';
const copiedMessage = 'คัดลอกข้อความสำเร็จ';
const truncatedSuffix = '\n...\nดูรายละเอียดเต็มใน KasetHub และตรวจสอบข้อมูลจริงก่อนใช้';

function formatThaiDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'ไม่ทราบเวลา';
  }

  return date.toLocaleString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function cleanLines(lines: string[]) {
  return lines.map((line) => line.trim()).filter(Boolean);
}

function createSection(title: string, lines: string[]) {
  const visibleLines = cleanLines(lines);

  if (visibleLines.length === 0) {
    return '';
  }

  return [title, ...visibleLines.map((line) => `- ${line}`)].join('\n');
}

function normalizeText(text: string) {
  return text
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function clampCalculatorExportText(text: string, maxChars: number): CalculatorTextClampResult {
  const normalizedText = normalizeText(text);

  if (normalizedText.length <= maxChars) {
    return {
      text: normalizedText,
      wasTruncated: false,
      originalLength: normalizedText.length,
      maxChars,
    };
  }

  const safeLength = Math.max(0, maxChars - truncatedSuffix.length);

  return {
    text: `${normalizedText.slice(0, safeLength).trimEnd()}${truncatedSuffix}`,
    wasTruncated: true,
    originalLength: normalizedText.length,
    maxChars,
  };
}

export function buildCalculatorExportTemplate(
  summary: CalculatorResultSummary,
  options: CalculatorExportTemplateOptions = {},
): CalculatorExportTemplate {
  const generatedAt = options.generatedAt ?? summary.createdAt;
  const generatedAtLabel = formatThaiDateTime(generatedAt);
  const inputRecap = cleanLines(summary.inputRecap);
  const resultRecap = cleanLines(summary.resultRecap);
  const warningRecap = cleanLines(summary.warningRecap);
  const cropLine = options.cropLabel ? [`พืช: ${options.cropLabel}`] : [];
  const warningLine = warningRecap.length > 0 ? [`ข้อควรตรวจซ้ำ: ${warningRecap.join(' · ')}`] : ['ยังไม่พบคำเตือนจากสูตรคำนวณ'];
  const disclaimer = summary.safetyDisclaimer || 'ผลคำนวณเบื้องต้น ควรตรวจสอบฉลาก/ผู้เชี่ยวชาญก่อนใช้งานจริง';
  const shortBase = normalizeText(
    [
      summary.summaryTitle,
      ...cropLine,
      ...resultRecap.slice(0, 3),
      warningLine[0],
      disclaimer,
      `ที่มา: ${calculatorExportSourceLabel}`,
    ].join('\n'),
  );
  const longBase = normalizeText(
    [
      summary.summaryTitle,
      ...cropLine,
      `สร้างเมื่อ: ${generatedAtLabel}`,
      `ที่มา: ${calculatorExportSourceLabel}`,
      createSection('ข้อมูลที่กรอก', inputRecap),
      createSection('ผลคำนวณ', resultRecap),
      createSection('คำเตือน/ข้อควรตรวจซ้ำ', warningLine),
      `คำเตือน: ${disclaimer}`,
      summary.localOnlyNote,
      'ไม่มี PDF ไม่มี backend save ไม่มี Supabase write และไม่มี AI recommendation ในสรุปนี้',
    ].join('\n\n'),
  );
  const shortText = clampCalculatorExportText(shortBase, options.lineFriendlyMaxChars ?? calculatorLineFriendlyMaxChars);
  const longText = clampCalculatorExportText(longBase, options.longDetailMaxChars ?? calculatorLongDetailMaxChars);

  return {
    id: `export-template:${summary.id}`,
    category: summary.category,
    calculatorTitle: summary.calculatorLabel,
    calculatorRoute: summary.calculatorRoute,
    cropLabel: options.cropLabel,
    inputRecap,
    resultRecap,
    warningRecap,
    disclaimer,
    generatedAt,
    generatedAtLabel,
    sourceLabel: calculatorExportSourceLabel,
    shortLineText: shortText.text,
    longDetailText: longText.text,
    shortLineWasTruncated: shortText.wasTruncated,
    longDetailWasTruncated: longText.wasTruncated,
  };
}

export function createExportSharePayload(
  template: CalculatorExportTemplate,
  version: 'short_line' | 'long_detail' = 'long_detail',
  source: SharePayload['source'] = 'native',
): SharePayload {
  return {
    title: template.calculatorTitle,
    description: version === 'short_line' ? template.shortLineText : template.longDetailText,
    url: template.calculatorRoute,
    source,
  };
}

export function prepareCalculatorShareText(text: string, maxChars = calculatorLongDetailMaxChars): CalculatorShareFallbackResult {
  const clamped = clampCalculatorExportText(text, maxChars);

  if (!clamped.text) {
    return {
      status: 'empty',
      message: emptySummaryMessage,
      helperMessage: copyInsteadMessage,
      text: '',
      wasTruncated: false,
    };
  }

  return {
    status: 'ready',
    message: clamped.wasTruncated ? 'ข้อความยาวเกินไป ระบบย่อให้อ่านง่ายขึ้น' : 'พร้อมแชร์ข้อความ',
    text: clamped.text,
    wasTruncated: clamped.wasTruncated,
  };
}

export async function copyCalculatorExportText(
  text: string,
  clipboard?: CalculatorClipboardLike,
  maxChars = calculatorLongDetailMaxChars,
): Promise<CalculatorShareFallbackResult> {
  const prepared = prepareCalculatorShareText(text, maxChars);

  if (prepared.status === 'empty') {
    return prepared;
  }

  if (!clipboard?.writeText) {
    return {
      ...prepared,
      status: 'unsupported',
      message: 'อุปกรณ์นี้ไม่รองรับการคัดลอกอัตโนมัติ',
      helperMessage: copyInsteadMessage,
    };
  }

  try {
    await clipboard.writeText(prepared.text);
    return {
      ...prepared,
      status: 'copied',
      message: copiedMessage,
    };
  } catch {
    return {
      ...prepared,
      status: 'failed',
      message: 'คัดลอกข้อความไม่สำเร็จ',
      helperMessage: copyInsteadMessage,
    };
  }
}

export async function shareCalculatorExportText(options: {
  title: string;
  text: string;
  url?: string;
  nativeShare?: CalculatorNativeShareLike;
  clipboard?: CalculatorClipboardLike;
  maxChars?: number;
}): Promise<CalculatorShareFallbackResult> {
  const prepared = prepareCalculatorShareText(options.text, options.maxChars);

  if (prepared.status === 'empty') {
    return prepared;
  }

  const shareData: ShareData = {
    title: options.title,
    text: prepared.text,
    url: options.url,
  };
  const nativeShare = options.nativeShare;
  const canShareDirectly =
    Boolean(nativeShare?.share) && (!nativeShare?.canShare || nativeShare.canShare(shareData));

  if (!canShareDirectly) {
    const copied = await copyCalculatorExportText(prepared.text, options.clipboard, options.maxChars);

    return {
      ...prepared,
      status: copied.status === 'copied' ? 'copied_fallback' : copied.status,
      message: unsupportedShareMessage,
      helperMessage: copied.status === 'copied' ? copiedMessage : copyInsteadMessage,
    };
  }

  try {
    await nativeShare?.share?.(shareData);
    return {
      ...prepared,
      status: 'shared',
      message: 'แชร์ข้อความสำเร็จ',
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return {
        ...prepared,
        status: 'cancelled',
        message: 'ยกเลิกการแชร์แล้ว',
      };
    }

    const copied = await copyCalculatorExportText(prepared.text, options.clipboard, options.maxChars);

    return {
      ...prepared,
      status: copied.status === 'copied' ? 'copied_fallback' : 'failed',
      message: copied.status === 'copied' ? 'แชร์โดยตรงไม่สำเร็จ' : 'แชร์ข้อความไม่สำเร็จ',
      helperMessage: copied.status === 'copied' ? copiedMessage : copyInsteadMessage,
    };
  }
}

