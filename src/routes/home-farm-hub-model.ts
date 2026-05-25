export type HomeFarmHubViewModel = {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryRoute: string;
  primaryLabel: string;
};

export function buildHomeFarmHubViewModel(): HomeFarmHubViewModel {
  return {
    eyebrow: 'My Farm',
    title: 'ฟาร์มของฉัน',
    subtitle: 'บันทึกงานในฟาร์ม รายรับรายจ่าย ต้นทุน และผลผลิต',
    primaryRoute: '/app/my-farm',
    primaryLabel: 'เปิดฟาร์มของฉัน',
  };
}
