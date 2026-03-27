import { Navigate, Outlet } from "react-router";
import { useAuth } from "../contexts/AuthContext";

/**
 * GuestRoute - Chỉ cho phép truy cập khi CHƯA đăng nhập.
 * Nếu đã đăng nhập sẽ redirect về trang chủ.
 */
export function GuestRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  // Chờ AuthContext khởi tạo xong để tránh nhảy redirect sai
  if (isLoading) return null;

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
