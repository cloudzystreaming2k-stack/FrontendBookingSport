import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { User, Menu, X, LogOut, Instagram, Facebook, Twitter, FacebookIcon, Bell } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { toast } from "sonner";

// Mock notification data
const mockNotifications = [
  {
    id: 1,
    title: "Đặt sân thành công",
    message: "Lịch đặt sân của bạn vào lúc 14:00 hôm nay đã được xác nhận",
    time: "5 phút trước",
    read: false,
    type: "booking",
  },
  {
    id: 2,
    title: "Thanh toán thành công",
    message: "Thanh toán 250.000đ cho sân bóng đá Riverside",
    time: "1 giờ trước",
    read: false,
    type: "payment",
  }
];

export function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const { user, isAuthenticated, logout } = useAuth();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    toast.success("Đã đăng xuất thành công");
  };

  const navItems = [
    { path: "/", label: "Trang chủ" },
    { path: "/courts", label: "Tìm sân" },
    { path: "/news", label: "Tin tức" },
    { path: "/about", label: "Giới thiệu" },
    { path: "/contact", label: "Liên hệ" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">SB</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">SportBooking</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${location.pathname === item.path
                    ? "text-blue-600"
                    : "text-gray-600"
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  {/* Notification Bell */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="relative hidden sm:flex"
                      >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                            {unreadCount}
                          </span>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                      <DropdownMenuLabel className="flex justify-between items-center">
                        <span>Thông báo</span>
                        {unreadCount > 0 && (
                          <span className="text-xs text-red-600 font-semibold">
                            {unreadCount} chưa đọc
                          </span>
                        )}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`flex flex-col px-3 py-3 cursor-pointer border-b last:border-b-0 hover:bg-gray-50 transition-colors ${!notification.read ? "bg-blue-50" : ""
                                }`}
                            >
                              <div className="flex justify-between gap-2">
                                <div className="flex-1">
                                  <p className="font-semibold text-sm text-gray-900">
                                    {notification.title}
                                  </p>
                                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                    {notification.message}
                                  </p>
                                </div>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-2">
                                {notification.time}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="px-3 py-8 text-center text-sm text-gray-500">
                            Không có thông báo
                          </div>
                        )}
                      </div>
                      <DropdownMenuSeparator />
                      <div className="px-3 py-2 text-center">
                        <button className="text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors">
                          Xem tất cả thông báo
                        </button>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{user?.firstName}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user?.lastName} {user?.firstName}</p>
                          <p className="text-xs leading-none text-gray-500">{user?.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="w-full cursor-pointer">
                          Hồ sơ của tôi
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate("/profile", { state: { activeTab: "bookings" } })}
                        className="w-full cursor-pointer"
                      >
                        Lịch sử đặt sân
                      </DropdownMenuItem>
                      {user?.role === "admin" && (
                        <DropdownMenuItem asChild>
                          <Link to="/admin" className="w-full cursor-pointer">
                            Quản trị
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="text-red-600 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Đăng xuất
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {user?.role === "admin" && (
                    <Link to="/admin">
                      <Button size="sm" className="hidden sm:inline-flex">
                        Quản trị
                      </Button>
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm" className="hidden sm:inline-flex">
                      Đăng ký
                    </Button>
                  </Link>
                </>
              )}

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <nav className="flex flex-col gap-3">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === item.path
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    {item.label}
                  </Link>
                ))}
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100"
                    >
                      Hồ sơ của tôi
                    </Link>
                    {user?.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Quản trị
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 text-left"
                    >
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100"
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Đăng ký
                    </Link>
                  </>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer (Hidden on Search Page) */}
      {location.pathname !== '/courts' && (
        <footer className="bg-gray-900 text-white mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-4">SportBooking</h3>
                <p className="text-gray-400 text-sm">
                  Hệ thống đặt sân thể thao trực tuyến hàng đầu Việt Nam
                </p>
                <div className="flex gap-5 mt-4 text-gray-400 text-sm cursor-pointer">
                  <FacebookIcon></FacebookIcon>
                  <Instagram></Instagram>
                  <Twitter></Twitter>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Liên kết</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><Link to="/courts" className="hover:text-white">Tìm sân</Link></li>
                  <li><Link to="/news" className="hover:text-white">Tin tức</Link></li>
                  <li><Link to="/about" className="hover:text-white">Giới thiệu</Link></li>
                  <li><Link to="/contact" className="hover:text-white">Liên hệ</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Hỗ trợ</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white">Hướng dẫn đặt sân</a></li>
                  <li><a href="#" className="hover:text-white">Chính sách hoàn tiền</a></li>
                  <li><a href="#" className="hover:text-white">Liên hệ</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Liên hệ</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>Email: support@sportbooking.vn</li>
                  <li>Hotline: 1900 xxxx</li>
                  <li>TP. Hà Nội, Việt Nam</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
              © 2026 SportBooking. All rights reserved.
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}