import api from "../../../lib/api";
import type { CourtTypeItem, CourtTypeForm } from "./court-type.types";

const BASE = "/admin/court-types";

export const courtTypeApi = {
  async getAll(): Promise<CourtTypeItem[]> {
    const { data } = await api.get<CourtTypeItem[]>(BASE);
    return data;
  },

  async create(form: CourtTypeForm) {
    const { data } = await api.post(BASE, form);
    return data;
  },

  async update(id: string, form: CourtTypeForm) {
    const { data } = await api.put(`${BASE}/${id}`, form);
    return data;
  },

  async remove(id: string) {
    const { data } = await api.delete(`${BASE}/${id}`);
    return data;
  },
};
