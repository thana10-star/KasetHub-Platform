export type HomeFarmHubViewModel = {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryRoute: string;
  primaryLabel: string;
};

export function buildHomeFarmHubViewModel(): HomeFarmHubViewModel {
  return {
    eyebrow: 'ฟาร์มของฉัน',
    title: 'ฟาร์มของฉัน',
    subtitle: 'บันทึกงาน รายรับรายจ่าย และผลผลิต',
    primaryRoute: '/app/my-farm',
    primaryLabel: 'เปิดฟาร์มของฉัน',
  };
}
