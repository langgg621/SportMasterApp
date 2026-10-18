export interface SaleCampaign {
  id: string;
  title: string;             // Tên chương trình (Ví dụ: "Скидка месяца", "Товар дня")
  description?: string;      // Mô tả chi tiết khuyến mãi
  discountPercent?: number;  // Phần trăm giảm giá (nếu áp dụng toàn chiến dịch)
  bannerUrl: string;         // Ảnh banner quảng cáo sale
  startDate: string;         // Thời gian bắt đầu
  endDate: string;           // Thời gian kết thúc / thời hạn đếm ngược
  isActive: boolean;         // Trạng thái chiến dịch đang diễn ra hay không
}

export interface FlashSaleItem {
  id: string;
  productId: string;         // Liên kết tới sản phẩm trong cửa hàng
  salePrice: number;         // Giá sau khi giảm
  originalPrice: number;     // Giá gốc
  discountPercent: number;   // % giảm giá
  stockLimit: number;        // Số lượng giới hạn trong đợt sale
  soldCount: number;         // Số lượng đã bán được
  endTime: string;           // Thời gian kết thúc đợt sale (dùng cho đồng hồ đếm ngược)
}