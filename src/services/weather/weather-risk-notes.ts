export type WeatherRiskNote = {
  id: string;
  title: string;
  detail: string;
  boundary: string;
};

export const farmerWeatherRiskNotes: WeatherRiskNote[] = [
  {
    id: 'check-rain-wind-before-spray',
    title: 'ก่อนพ่นยาให้ดูฝนและลม',
    detail: 'ควรดูสภาพจริงที่แปลงและฉลากผลิตภัณฑ์ก่อนทำงานพ่นทุกครั้ง',
    boundary: 'เป็นข้อควรระวังทั่วไป ไม่ใช่คำแนะนำสารเคมีหรืออัตราการใช้',
  },
  {
    id: 'wind-drift-warning',
    title: 'ลมแรงอาจทำให้ละอองยาปลิว',
    detail: 'ถ้าลมแรงควรระวังการปลิวออกนอกพื้นที่ และตรวจเงื่อนไขบนฉลากจริง',
    boundary: 'ไม่ระบุความเร็วลมที่เป็นเกณฑ์ทางกฎหมายหรือฉลากเฉพาะผลิตภัณฑ์',
  },
  {
    id: 'rain-after-spray-warning',
    title: 'ฝนหลังพ่นยาอาจลดประสิทธิภาพ',
    detail: 'ฝนหลังทำงานพ่นอาจชะล้างสารบางชนิด ควรตรวจฉลากและคำแนะนำผู้เชี่ยวชาญ',
    boundary: 'ไม่ระบุระยะเวลาฝนหลังพ่นแบบตายตัว',
  },
  {
    id: 'forecast-can-be-wrong',
    title: 'พยากรณ์อากาศอาจคลาดเคลื่อนได้',
    detail: 'ฝนเฉพาะพื้นที่เปลี่ยนเร็ว ควรดูท้องฟ้า แหล่งข้อมูลท้องถิ่น และสถานการณ์จริงก่อนตัดสินใจ',
    boundary: 'ไม่รับประกันผลผลิต ความปลอดภัย หรือผลทางการเงิน',
  },
];

export function getFarmerWeatherRiskNotes() {
  return farmerWeatherRiskNotes;
}
