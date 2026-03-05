import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { DollarSign, Calendar, MapPin, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Pie, PieChart, Cell, Legend } from "recharts";
import { mockStatistics } from "../../data/mockData";

export function AdminDashboard() {
  const stats = mockStatistics;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Doanh thu tháng này</p>
                <p className="text-2xl font-bold">
                  {stats.totalRevenue.toLocaleString()}đ
                </p>
                <p className="text-xs text-green-600 mt-1">+12% so với tháng trước</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tổng đặt sân</p>
                <p className="text-2xl font-bold">{stats.totalBookings}</p>
                <p className="text-xs text-green-600 mt-1">+8% so với tháng trước</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tổng số sân</p>
                <p className="text-2xl font-bold">{stats.totalCourts}</p>
                <p className="text-xs text-blue-600 mt-1">Đang hoạt động</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tỷ lệ lấp đầy</p>
                <p className="text-2xl font-bold">{stats.occupancyRate}%</p>
                <p className="text-xs text-green-600 mt-1">+5% so với tháng trước</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu theo tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: any) => `${value.toLocaleString()}đ`}
                />
                <Bar dataKey="revenue" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bookings by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Đặt sân theo loại</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.bookingsByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.type}: ${entry.count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {stats.bookingsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Đặt sân gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Mã</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Sân</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Khách hàng</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Ngày</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Giờ</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Giá</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">{booking.id}</td>
                    <td className="py-3 px-4 text-sm">{booking.courtName}</td>
                    <td className="py-3 px-4 text-sm">{booking.userName}</td>
                    <td className="py-3 px-4 text-sm">
                      {new Date(booking.date).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {booking.startTime} - {booking.endTime}
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold">
                      {booking.totalPrice.toLocaleString()}đ
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {booking.status === "confirmed"
                          ? "Đã xác nhận"
                          : booking.status === "pending"
                          ? "Chờ xác nhận"
                          : "Hoàn thành"}
                      </span>
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
