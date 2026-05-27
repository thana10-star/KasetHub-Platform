export const WEATHER_STRONG_WIND_KPH = 24;

type WeatherCurrentSummaryInput = {
  conditionLabel?: string;
  rainChancePercent?: number;
  windKph?: number;
};

function roundMetric(value?: number) {
  return typeof value === 'number' && Number.isFinite(value) ? Math.round(value) : undefined;
}

export function buildWeatherCurrentSummary(input: WeatherCurrentSummaryInput) {
  const condition = input.conditionLabel?.trim();
  const rainChance = roundMetric(input.rainChancePercent);
  const windKph = roundMetric(input.windKph);

  if (!condition || rainChance === undefined) {
    return 'เปิดดูพยากรณ์เพื่อวางแผนงานวันนี้';
  }

  const summaryParts: string[] = [];

  if (rainChance >= 50) {
    summaryParts.push(
      `${condition} และมีโอกาสฝน ${rainChance}% ในบางพื้นที่ของจังหวัด ควรเช็กก่อนพ่นยา/ให้น้ำ`,
    );
  } else if (rainChance >= 30) {
    summaryParts.push(`${condition} มีโอกาสฝนบางช่วง (${rainChance}%) ควรเผื่อแผนงานกลางแจ้ง`);
  } else {
    summaryParts.push(`${condition} โอกาสฝนต่ำ เหมาะกับงานกลางแจ้งบางส่วน`);
  }

  if (windKph !== undefined && windKph >= WEATHER_STRONG_WIND_KPH) {
    summaryParts.push(`ลม ${windKph} กม./ชม. ค่อนข้างแรง ควรระวังความเสียหายกับพืชหรือโครงสร้างเบา`);
  }

  return summaryParts.join(' ');
}
