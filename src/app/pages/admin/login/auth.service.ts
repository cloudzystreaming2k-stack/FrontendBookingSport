import api from "../../../lib/api";

export const adminAuthService = {
   async login(email: string, password: string, asAdmin = true) {
      const { data } = await api.post("/auth/login", { email, password, asAdmin });
      return data;
   },
};
