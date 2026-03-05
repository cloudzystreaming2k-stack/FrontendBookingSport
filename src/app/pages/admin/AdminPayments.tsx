import { useState } from "react";
import { Download, Eye, RefreshCw } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { mockBookings } from "../../data/mockData";

export function AdminPayments() {
  const [payments, setPayments] = useState(mockBookings);
  const [filter, setFilter] = useState("all");

  const filteredPayments = payments.filter((payment) => {
    if (filter === "all") return true;
    return payment.paymentStatus === filter;
  });

  const totalRevenue = payments
    .filter((p) => p.paymentStatus === "paid")
    .reduce((sum, p) => sum + p.totalPrice, 0);

  const totalPayment = payments
    .filter((p) => p.paymentStatus === "paid" || p.paymentStatus === "refunded")
    .reduce((sum, p) => sum + p.totalPrice, 0);

  const pendingAmount = payments
    .filter((p) => p.paymentStatus === "pending")
    .reduce((sum, p) => sum + p.totalPrice, 0);

  const handleRefund = (id: string) => {
    if (confirm("Bạn có chắc muốn hoàn tiền cho đặt sân này?")) {
      setPayments(
        payments.map((p) =>
          p.id === id ? { ...p, paymentStatus: "refunded" as const } : p
        )
      );
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "refunded":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case "paid":
        return "Đã thanh toán";
      case "pending":
        return "Chờ thanh toán";
      case "refunded":
        return "Đã hoàn tiền";
      default:
        return status;
    }
  };

  const getPaymentMethodLabel = (method?: string) => {
    if (!method) return "Chưa có";
    switch (method) {
      case "vnpay":
        return "VNPay";
      case "momo":
        return "MoMo";
      case "banking":
        return "Banking";
      case "card":
        return "Thẻ ATM";
      default:
        return method;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Quản lý thanh toán</h2>
          <p className="text-gray-600">Theo dõi và quản lý các giao dịch</p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Xuất báo cáo tài chính
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tổng doanh thu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {totalRevenue.toLocaleString()}đ
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Từ {payments.filter((p) => p.paymentStatus === "paid").length} giao dịch đã thanh toán
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tổng thanh toán</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {payments.filter((p) => p.paymentStatus === "paid").length}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              đơn đã thanh toán
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Chờ xử lý</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {payments.filter((p) => p.paymentStatus === "pending").length}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              đơn đang chờ xử lý
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex gap-2 items-center">
        <span className="text-sm text-gray-600">Lọc theo:</span>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="paid">Đã thanh toán</SelectItem>
            <SelectItem value="pending">Chờ thanh toán</SelectItem>
            <SelectItem value="refunded">Đã hoàn tiền</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Payments Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 text-sm font-semibold">Mã GD</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Mã đặt sân</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Khách hàng</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Sân</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Số tiền</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Phương thức thanh toán</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Ngày GD</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Trạng thái</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium">
                      PAY{payment.id}
                    </td>
                    <td className="py-3 px-4 text-sm">{payment.id}</td>
                    <td className="py-3 px-4 text-sm">
                      <div>{payment.userName}</div>
                      <div className="text-xs text-gray-500">{payment.userId}</div>
                    </td>
                    <td className="py-3 px-4 text-sm">{payment.courtName}</td>
                    <td className="py-3 px-4 text-sm">
                      <div className="font-semibold">
                        {payment.totalPrice.toLocaleString()}đ
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {getPaymentMethodLabel(payment.paymentMethod)}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {new Date(payment.createdAt).toLocaleDateString("vi-VN")}
                      <div className="text-xs text-gray-500">
                        {new Date(payment.createdAt).toLocaleTimeString("vi-VN")}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <Badge className={getPaymentStatusColor(payment.paymentStatus)}>
                        {getPaymentStatusLabel(payment.paymentStatus)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {payment.paymentStatus === "paid" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRefund(payment.id)}
                          >
                            <RefreshCw className="w-4 h-4 text-blue-600" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">VNPay</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45%</div>
            <p className="text-sm text-gray-600">của tổng giao dịch</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ví MoMo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">35%</div>
            <p className="text-sm text-gray-600">của tổng giao dịch</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Thẻ ATM/Banking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">20%</div>
            <p className="text-sm text-gray-600">của tổng giao dịch</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}