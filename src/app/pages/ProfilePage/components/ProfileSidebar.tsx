import { User, Heart, Calendar } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import type { APIBooking } from "../types";
import type { TabType, UserData } from "../types";

interface Props {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  userData: UserData;
  bookingTotal: number;
  userBookings: APIBooking[];
  favoriteCourtsCount: number;
}

export function ProfileSidebar({
  activeTab,
  setActiveTab,
  userData,
  bookingTotal,
  userBookings,
  favoriteCourtsCount,
}: Props) {
  const pendingCount = userBookings.filter((b) => b.status === "pending").length;
  const completedCount = userBookings.filter((b) => b.status === "completed").length;

  const navItems = [
    { key: "account" as TabType, icon: User, label: "Thông tin tài khoản", badge: null },
    {
      key: "favorites" as TabType,
      icon: Heart,
      label: "Sân yêu thích",
      badge: favoriteCourtsCount > 0 ? favoriteCourtsCount : null,
    },
    {
      key: "bookings" as TabType,
      icon: Calendar,
      label: "Lịch sử đặt sân",
      badge: pendingCount > 0 ? pendingCount : null,
    },
  ];

  return (
    <aside className="lg:col-span-3">
      <Card className="sticky top-6">
        <CardContent className="p-6">
          {/* User Info */}
          <div className="text-center mb-6 pb-6 border-b">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
              <User className="w-12 h-12 text-white" />
            </div>
            <h3 className="font-bold text-lg">
              {userData.lastName} {userData.firstName}
            </h3>
            <p className="text-sm text-gray-600 mt-0.5">{userData.email}</p>
            <div className="mt-3">
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">Thành viên</Badge>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-3 mb-6 pb-6 border-b">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Tổng đặt sân</span>
              <span className="font-bold text-blue-600">{bookingTotal}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Hoàn thành</span>
              <span className="font-bold text-green-600">{completedCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Sân yêu thích</span>
              <span className="font-bold text-pink-600">{favoriteCourtsCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Điểm tích lũy</span>
              <span className="font-bold text-purple-600">1,250</span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            {navItems.map(({ key, icon: Icon, label, badge }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === key
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                {badge !== null && (
                  <span
                    className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                      activeTab === key ? "bg-white/20" : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </CardContent>
      </Card>
    </aside>
  );
}
