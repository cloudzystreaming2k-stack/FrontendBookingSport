import api from "../../../lib/api";
import { UserItem, UsersResponse, CreateUserForm, UpdateUserForm } from "./user";

export const userService = {
   async getUsers(params?: { page?: string; limit?: string; search?: string; role?: string }): Promise<UsersResponse> {
      const { data } = await api.get<UsersResponse>("/admin/users", { params });
      return data;
   },

   async updateRole(id: string, role: string) {
      const { data } = await api.put(`/admin/users/${id}`, { role });
      return data;
   },

   async toggleStatus(id: string) {
      const { data } = await api.patch(`/admin/users/${id}/status`);
      return data;
   },

   async deleteUser(id: string) {
      const { data } = await api.delete(`/admin/users/${id}`);
      return data;
   },

   async updateUser(id: string, form: UpdateUserForm) {
      const { data } = await api.put(`/admin/users/${id}`, form);
      return data;
   },

   async createUser(form: CreateUserForm) {
      const { data } = await api.post(`/admin/users`, form);
      return data;
   }
};
