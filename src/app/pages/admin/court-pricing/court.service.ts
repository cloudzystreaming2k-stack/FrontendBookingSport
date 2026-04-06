import api from "../../../lib/api";
import { Court, CourtType } from "./court";

export const courtService = {
  /**
   * Lấy danh sách các loại sân
   */
  async getCourtTypes(): Promise<CourtType[]> {
    const res = await api.get("/admin/court-types");
    return Array.isArray(res.data) ? res.data : res.data.courtTypes ?? [];
  },

  /**
   * Lấy danh sách tất cả các sân
   */
  async getCourts(): Promise<Court[]> {
    const res = await api.get("/admin/courts");
    return Array.isArray(res.data) ? res.data : res.data.courts ?? [];
  }
};
