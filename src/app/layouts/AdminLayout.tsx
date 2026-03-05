import { Outlet, Link, useLocation } from "react-router";
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
} from "lucide-react";
import { useState } from "react";

export function AdminLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/courts", icon: MapPin, label: "Quản lý sân" },
    { path: "/admin/court-types", icon: Shapes, label: "Loại sân" },
    { path: "/admin/bookings", icon: Calendar, label: "Quản lý đặt sân" },
    { path: "/admin/payments", icon: CreditCard, label: "Quản lý thanh toán" },
    { path: "/admin/users", icon: Users, label: "Quản lý người dùng" },
    { path: "/admin/promotions", icon: Tag, label: "Khuyến mãi" },
    { path: "/admin/reviews", icon: Star, label: "Đánh giá" },
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
        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
          isActive
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
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-gray-900 text-white">
        <div className="p-6 border-b border-gray-800">
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

        <nav className="flex-1 p-4 space-y-0.5">
          {menuItems.map((item) => renderNavItem(item))}
        </nav>

        <div className="p-4 border-t border-gray-800">
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
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white shadow-sm">
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
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Admin</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}