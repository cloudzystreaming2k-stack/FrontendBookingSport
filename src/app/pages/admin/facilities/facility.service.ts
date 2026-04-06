import api from "../../../lib/api";
import { FacilityItem, FacilityForm } from "./facility";

export const facilityService = {
  async getFacilities(): Promise<FacilityItem[]> {
    const { data } = await api.get<FacilityItem[]>("/admin/facilities");
    return data;
  },

  async createFacility(form: FacilityForm) {
    const { data } = await api.post("/admin/facilities", form);
    return data;
  },

  async updateFacility(id: string, form: FacilityForm) {
    const { data } = await api.put(`/admin/facilities/${id}`, form);
    return data;
  },

  async deleteFacility(id: string) {
    const { data } = await api.delete(`/admin/facilities/${id}`);
    return data;
  }
};
