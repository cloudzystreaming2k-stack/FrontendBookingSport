import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "../lib/api";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  gender?: "male" | "female" | "other" | string;
  dateOfBirth?: string;
  role: "user" | "admin" | "owner";
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, throwError?: boolean) => Promise<boolean>;
  register: (firstName: string, lastName: string, email: string, password: string, phone: string, gender: string, dateOfBirth: string) => Promise<boolean>;
  googleLogin: (token: string) => Promise<{ success: boolean; isNew: boolean }>;
  facebookLogin: (token: string) => Promise<{ success: boolean; isNew: boolean }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Khôi phục phiên đăng nhập khi app khởi động
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const { data } = await api.get("/auth/profile");
          setUser(data);
        } catch {
          // Token hết hạn hoặc không hợp lệ, interceptor sẽ tự refresh hoặc logout
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string, throwError = false): Promise<boolean> => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      // Lưu Access Token vào localStorage, Refresh Token được lưu vào Cookie bởi Server
      localStorage.setItem("accessToken", data.accessToken);
      setUser({
        _id: data._id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        role: data.role,
        avatar: data.avatar,
      });
      return true;
    } catch (error: any) {
      if (throwError) throw error;
      return false;
    }
  };

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phone: string,
    gender: string,
    dateOfBirth: string
  ): Promise<boolean> => {
    try {
      const { data } = await api.post("/auth/register", { firstName, lastName, email, password, phone, gender, dateOfBirth });
      localStorage.setItem("accessToken", data.accessToken);
      setUser({
        _id: data._id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        role: data.role,
      });
      return true;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Đăng ký thất bại");
    }
  };

  const googleLogin = async (token: string): Promise<{ success: boolean; isNew: boolean }> => {
    try {
      const { data } = await api.post("/auth/google", { token });
      localStorage.setItem("accessToken", data.accessToken);
      setUser({
        _id: data._id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        role: data.role,
      });
      return { success: true, isNew: !!data.isNew };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Đăng nhập Google thất bại");
    }
  };

  const facebookLogin = async (token: string): Promise<{ success: boolean; isNew: boolean }> => {
    try {
      const { data } = await api.post("/auth/facebook", { token });
      localStorage.setItem("accessToken", data.accessToken);
      setUser({
        _id: data._id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        role: data.role,
      });
      return { success: true, isNew: !!data.isNew };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Đăng nhập Facebook thất bại");
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      localStorage.removeItem("accessToken");
      setUser(null);
    }
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        googleLogin,
        facebookLogin,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}