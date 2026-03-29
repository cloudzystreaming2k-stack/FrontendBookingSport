import { useState } from "react";
import {
  TrendingUp,
  Calendar,
  DollarSign,
  MapPin,
  Star,
  Users,
  ArrowUp,
  ArrowDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Package,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { useAuth } from "../../contexts/AuthContext";

export function OwnerDashboard() {
  const { user } = useAuth();
//   const { courts } = useCourts();

//   // Filter courts belonging to this owner
//   const myCourts = courts.filter(court => court.ownerId === user?._id);
//   const pendingCourts = myCourts.filter(c => c.approvalStatus === "pending").length;
//   const approvedCourts = myCourts.filter(c => c.approvalStatus === "approved").length;
//   const rejectedCourts = myCourts.filter(c => c.approvalStatus === "rejected").length;

  // Mock statistics
  const stats = {
    revenue: {
      total: 45600000,
      change: 12.5,
      trend: "up" as const,
    },
    bookings: {
      total: 156,
      change: 8.3,
      trend: "up" as const,
    },
    rating: {
      average: 4.7,
      total: 89,
      change: 0.3,
      trend: "up" as const,
    },
   //  courts: {
   //    total: myCourts.length,
   //    active: approvedCourts,
   //    pending: pendingCourts,
   //  },
  };

  // Recent bookings mock data
  const recentBookings = [
    {
      id: "1",
      courtName: "Sân Cầu Lông Số 1",
      customerName: "Nguyễn Văn A",
      date: "2026-03-29",
      time: "18:00 - 20:00",
      amount: 250000,
      status: "confirmed" as const,
    },
    {
      id: "2",
      courtName: "Sân Pickleball Số 2",
      customerName: "Trần Thị B",
      date: "2026-03-29",
      time: "14:00 - 16:00",
      amount: 180000,
      status: "confirmed" as const,
    },
    {
      id: "3",
      courtName: "Sân Cầu Lông Số 1",
      customerName: "Lê Văn C",
      date: "2026-03-30",
      time: "08:00 - 10:00",
      amount: 150000,
      status: "pending" as const,
    },
  ];

  // Revenue by time of day
  const revenueByTime = [
    { label: "Sáng", value: 12500000, percentage: 27 },
    { label: "Chiều", value: 15800000, percentage: 35 },
    { label: "Tối", value: 17300000, percentage: 38 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Xin chào, {user?.firstName}! 👋
            </h1>
            <p className="text-orange-100">
              Tổng quan hoạt động kinh doanh sân thể thao của bạn
            </p>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <p className="text-sm text-orange-100">Ngày hôm nay</p>
              <p className="text-2xl font-bold">
                {new Date().toLocaleDateString("vi-VN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Court Status Alert
      {pendingCourts > 0 && (
        <Card className="border-l-4 border-l-amber-500 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-amber-900">
                  Bạn có {pendingCourts} sân đang chờ admin duyệt
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  Thời gian xét duyệt thường từ 24-48 giờ làm việc
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {rejectedCourts > 0 && (
        <Card className="border-l-4 border-l-red-500 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-red-900">
                  Bạn có {rejectedCourts} sân bị từ chối
                </p>
                <p className="text-sm text-red-700 mt-1">
                  Vui lòng xem lý do và cập nhật lại thông tin sân
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )} */}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <Badge
                variant="secondary"
                className={`${
                  stats.revenue.trend === "up"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                <ArrowUp className="w-3 h-3 mr-1" />
                {stats.revenue.change}%
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-1">Doanh thu tháng này</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.revenue.total.toLocaleString()}đ
            </p>
          </CardContent>
        </Card>

        {/* Bookings Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-800"
              >
                <ArrowUp className="w-3 h-3 mr-1" />
                {stats.bookings.change}%
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-1">Lượt đặt sân</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.bookings.total}
            </p>
          </CardContent>
        </Card>

        {/* Rating Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <Badge
                variant="secondary"
                className="bg-amber-100 text-amber-800"
              >
                <ArrowUp className="w-3 h-3 mr-1" />
                {stats.rating.change}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-1">Đánh giá trung bình</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-gray-900">
                {stats.rating.average}
              </p>
              <p className="text-sm text-gray-500">/ 5.0</p>
              <p className="text-xs text-gray-400">({stats.rating.total} đánh giá)</p>
            </div>
          </CardContent>
        </Card>

        {/* Courts Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-800"
              >
                {/* {stats.courts.active} Hoạt động */}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-1">Tổng số sân</p>
            <p className="text-2xl font-bold text-gray-900">
              {/* {stats.courts.total} */}
            </p>
            {/* {stats.courts.pending > 0 && (
              <p className="text-xs text-amber-600 mt-1">
                {stats.courts.pending} sân chờ duyệt
              </p>
            )} */}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue by Time */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              Doanh Thu Theo Khung Giờ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {revenueByTime.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        idx === 0
                          ? "bg-teal-500"
                          : idx === 1
                          ? "bg-blue-500"
                          : "bg-purple-500"
                      }`}
                    />
                    <span className="font-medium text-gray-700">{item.label}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {item.value.toLocaleString()}đ
                    </p>
                    <p className="text-xs text-gray-500">{item.percentage}%</p>
                  </div>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">Tổng cộng</span>
                <span className="text-xl font-bold text-orange-600">
                  {revenueByTime
                    .reduce((sum, item) => sum + item.value, 0)
                    .toLocaleString()}
                  đ
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-orange-600" />
              Thống Kê Nhanh
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-900">
                  Đặt sân hôm nay
                </span>
              </div>
              <p className="text-3xl font-bold text-green-600">24</p>
              <p className="text-sm text-green-700 mt-1">+4 so với hôm qua</p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-900">
                  Khách hàng mới
                </span>
              </div>
              <p className="text-3xl font-bold text-blue-600">12</p>
              <p className="text-sm text-blue-700 mt-1">Trong tuần này</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-3 mb-2">
                <Star className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-purple-900">
                  Đánh giá mới
                </span>
              </div>
              <p className="text-3xl font-bold text-purple-600">8</p>
              <p className="text-sm text-purple-700 mt-1">Trong tuần này</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              Đặt Sân Gần Đây
            </div>
            <a
              href="/owner/bookings"
              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              Xem tất cả →
            </a>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    SÂN
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    KHÁCH HÀNG
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    NGÀY & GIỜ
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    SỐ TIỀN
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    TRẠNG THÁI
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">
                        {booking.courtName}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-700">{booking.customerName}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {new Date(booking.date).toLocaleDateString("vi-VN")}
                        </div>
                        <div className="text-gray-500">{booking.time}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-gray-900">
                        {booking.amount.toLocaleString()}đ
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        className={
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                        }
                      >
                        {booking.status === "confirmed"
                          ? "Đã xác nhận"
                          : "Chờ xác nhận"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
