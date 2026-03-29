import { Outlet, Link, useLocation, useNavigate, Navigate } from "react-router";
import { 
  LayoutDashboard, 
  MapPin, 
  Calendar, 
  CreditCard, 
  Tag, 
  Star,
  Menu,
  X,
  Home,
  LogOut,
  ChevronDown,
  User,
  TrendingUp,
  Package,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { Badge } from "../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

export function OwnerLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
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

  // Redirect if not authenticated or not owner
  if (!user || user.role !== "owner") {
    return <Navigate to="/admin/login" replace />;
  }

  // Menu items for owner
  const menuItems = [
    { path: "/owner", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/owner/courts", icon: MapPin, label: "Sân Của Tôi" },
    { path: "/owner/bookings", icon: Calendar, label: "Đặt Sân" },
    { path: "/owner/revenue", icon: TrendingUp, label: "Doanh Thu" },   
    { path: "/owner/payments", icon: CreditCard, label: "Thanh Toán" },
    { path: "/owner/reviews", icon: Star, label: "Đánh Giá" },
    { path: "/owner/services", icon: Package, label: "Dịch Vụ" },
    { path: "/owner/profile", icon: User, label: "Hồ Sơ" },
  ];

  const handleLogout = async () => {
    await logout();
    toast.success("Đăng xuất thành công", {
      description: "Hẹn gặp lại bạn!"
    });
    navigate("/admin/login", { replace: true });
  };

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
            ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg"
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
      <aside className="hidden lg:flex lg:flex-col w-64 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white">
        <div className="p-6 border-b border-gray-800">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="font-bold text-lg">🏟️</span>
            </div>
            <div>
              <h2 className="font-bold text-lg">SportBooking</h2>
              <p className="text-xs text-orange-400">
                  Chủ Sân
              </p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-0.5">
          {menuItems.map((item) => renderNavItem(item))}
        </nav>

        <div className="p-4 border-t border-gray-800 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="text-sm font-medium">Về trang chủ</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-gray-800 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setSidebarOpen(false)}>
          <aside className="w-64 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white h-full flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="font-bold text-lg"></span>
                </div>
                <div>
                  <h2 className="font-bold text-lg">SportBooking</h2>
                  <p className="text-xs text-orange-400">Quản Lý Chủ Sân</p>
                </div>
              </Link>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* User Profile in Mobile Sidebar */}
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-lg border border-orange-500/20">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center overflow-hidden">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.firstName} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-semibold">
                      {user.firstName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user.firstName}</p>
                  <Badge 
                    className="mt-1 text-xs bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 border-0"
                  >
                    Chủ Sân
                  </Badge>
                </div>
              </div>
            </div>

            <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
              {menuItems.map((item) => renderNavItem(item, () => setSidebarOpen(false)))}
            </nav>

            <div className="p-4 border-t border-gray-800 space-y-2">
              <Link
                to="/"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
              >
                <Home className="w-5 h-5" />
                <span className="text-sm font-medium">Về trang chủ</span>
              </Link>
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-gray-800 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Đăng xuất</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b-2 border-orange-100">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <button
              className="lg:hidden p-2"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              {menuItems.find(item => item.path === location.pathname)?.label || "Dashboard"}
            </h1>
            
            {/* User Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors"
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white text-sm font-bold overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    user?.firstName?.charAt(0).toUpperCase() || "O"
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-gray-900 leading-none">
                    {user?.lastName} {user?.firstName}
                  </p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-orange-100 py-2 z-50 animate-in fade-in zoom-in duration-200">
                  {/* User info header */}
                  {/* <div className="px-4 py-3 border-b border-orange-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold overflow-hidden">
                        {user.avatar ? (
                          <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          user?.firstName?.charAt(0).toUpperCase() || "O"
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user?.lastName} {user?.firstName}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                    </div>
                  </div> */}

                  {/* Role badge */}
                  <div className="px-4 py-2 border-b border-orange-50">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800">
                      <User className="w-3 h-3" />
                      Chủ sân
                    </span>
                  </div>

                  {/* Dashboard / Profile link */}
                  <div className="p-1">
                    <Link
                      to="/owner/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 rounded-md transition-colors"
                    >
                      <User className="w-4 h-4 text-gray-500" />
                      Hồ sơ cá nhân
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="p-1 border-t border-orange-50">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
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
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-orange-50/30 to-amber-50/30">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
