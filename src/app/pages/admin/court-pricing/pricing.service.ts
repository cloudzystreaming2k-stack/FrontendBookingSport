import api from "../../../lib/api";
import { BatchPricingSlot } from "./pricing";

export const pricingService = {
  /**
   * Lấy cấu hình giá hiện tại của một sân
   */
  async getCourtPricing(courtId: string) {
    const res = await api.get(`/admin/courts/${courtId}/pricing`);
    return res.data.data;
  },

  /**
   * Lưu lại toàn bộ cấu hình giá của một sân (Batch)
   */
  async saveBatchPricing(courtId: string, slots: BatchPricingSlot[]) {
    const res = await api.post(`/admin/courts/${courtId}/pricing/batch`, { slots });
    return res.data;
  },

  /**
   * Cập nhật giá hàng loạt theo khung giờ và các ngày trong tuần
   */
  async bulkUpdatePricing(courtId: string, payload: {
    days: number[];
    fromTime: string;
    toTime: string;
    price: number;
  }) {
    const res = await api.post(`/admin/courts/${courtId}/pricing/bulk`, payload);
    return res.data;
  }
};
