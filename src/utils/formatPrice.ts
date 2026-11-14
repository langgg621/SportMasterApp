// Giá có thể là số hoặc chuỗi "4 759" -> luôn đổi về số trước khi tính toán
export const parsePrice = (value: unknown): number =>
  parseInt(String(value ?? '0').replace(/[^0-9]/g, ''), 10) || 0;

// 4759 -> "4 759 ₽"
export const formatPrice = (value: unknown): string =>
  `${String(parsePrice(value)).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0')}\u00A0₽`;
