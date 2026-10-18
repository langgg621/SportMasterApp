export type GenderTargetType = 'MEN' | 'WOMEN' | 'KIDS' | 'UNISEX';

export interface GenderCategory {
  id: string;
  name: string;        // Tên hiển thị (Ví dụ: "Мужчинам", "Женщинам", "Детям")
  slug: string;        // Đường dẫn URL-friendly (men, women, kids)
  icon?: string;       // Biểu tượng đại diện
}