import { Outlet, Link, useLocation, Navigate, useNavigate } from "react-router";
import {
  LayoutDashboard,
  MapPin,
  Calendar,
  CreditCard,
  Users,
  Tag,
  Star,
  Newspaper,
  Menu,
  X,
  Home,
  Shapes,
  Link2,
  Building2,
  LogOut,
  ChevronDown,
  User,
  DollarSign,
  MessageSquare,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (user?.role === "owner") {
    return <Navigate to="/owner" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  const menuItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/courts", icon: MapPin, label: "Quản lý sân" },
    { path: "/admin/court-types", icon: Shapes, label: "Loại sân" },
    { path: "/admin/facilities", icon: Link2, label: "Tiện ích" },
    { path: "/admin/court-pricing", icon: DollarSign, label: "Cấu hình giá giờ" },
    { path: "/admin/bookings", icon: Calendar, label: "Quản lý đặt sân" },
    { path: "/admin/users", icon: Users, label: "Quản lý người dùng" },
    { path: "/admin/owners", icon: Building2, label: "Quản lý chủ sân" },
    { path: "/admin/promotions", icon: Tag, label: "Khuyến mãi" },
    { path: "/admin/reviews", icon: Star, label: "Đánh giá" },
    { path: "/admin/contacts", icon: MessageSquare, label: "Liên hệ" },
    { path: "/admin/news", icon: Newspaper, label: "Tin tức" },
  ];

  const renderNavItem = (item: typeof menuItems[0], onClick?: () => void) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;
    return (
      <Link
        key={item.path}
        to={item.path}
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${isActive
            ? "bg-blue-600 text-white"
            : "text-gray-300 hover:bg-gray-800"
          }`}
      >
        <Icon className="w-5 h-5" />
        <span className="text-sm font-medium">{item.label}</span>
      </Link>
    );
  };

  return (
    <div className="h-screen flex bg-gray-100 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-gray-900 text-white h-full">
        <div className="p-6 border-b border-gray-800 shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="font-bold text-lg">SB</span>
            </div>
            <div>
              <h2 className="font-bold text-lg">SportBooking</h2>
              <p className="text-xs text-gray-400">Quản trị viên</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
          {menuItems.map((item) => renderNavItem(item))}
        </nav>

        <div className="p-4 border-t border-gray-800 shrink-0">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="text-sm font-medium">Về trang chủ</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setSidebarOpen(false)}>
          <aside className="w-64 bg-gray-900 text-white h-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                  <span className="font-bold text-lg">SB</span>
                </div>
                <div>
                  <h2 className="font-bold text-lg">SportBooking</h2>
                  <p className="text-xs text-gray-400">Quản trị viên</p>
                </div>
              </Link>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="p-4 space-y-0.5">
              {menuItems.map((item) => renderNavItem(item, () => setSidebarOpen(false)))}
            </nav>

            <div className="p-4 border-t border-gray-800">
              <Link
                to="/"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
              >
                <Home className="w-5 h-5" />
                <span className="text-sm font-medium">Về trang chủ</span>
              </Link>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm shrink-0">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <button
              className="lg:hidden p-2"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              {menuItems.find(item => item.path === location.pathname)?.label || "Dashboard"}
            </h1>

            {/* User Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                  {user?.firstName?.charAt(0).toUpperCase() || "A"}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-gray-900 leading-none">
                    {user?.lastName} {user?.firstName}
                  </p>
                  {/* <p className="text-xs text-gray-500 mt-0.5">
                    {user?.role === "admin" ? "Quản trị viên" : "Chủ sân"}
                  </p> */}
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  {/* User info header */}
                  {/* <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                        {user?.firstName?.charAt(0).toUpperCase() || "A"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{user?.lastName} {user?.firstName}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                  </div> */}

                  {/* Role badge */}
                  <div className="px-4 py-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${user?.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-teal-100 text-teal-700"
                      }`}>
                      <User className="w-3 h-3" />
                      {user?.role === "admin" ? "Quản trị viên" : "Chủ sân"}
                    </span>
                  </div>

                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}