import {
  User,
  Mail,
  Phone,
  MapPin,
  Star,
  CreditCard,
  CheckCircle,
  AlertCircle,
  XCircle,
  Calendar,
  Clock,
  Check,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Booking, mockCourts } from "../../data/mockData";

interface BookingDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Booking | null;
  onConfirm?: (id: string) => void;
  onCancel?: (id: string) => void;
  onStatusChange?: (id: string, status: string) => void;
}

export function BookingDetailModal({
  open,
  onOpenChange,
  booking,
  onConfirm,
  onCancel,
  onStatusChange,
}: BookingDetailModalProps) {
  if (!booking) return null;

  const court = mockCourts.find((c) => c.id === booking.courtId);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case "pending":
        return <AlertCircle className="w-6 h-6 text-yellow-600" />;
      case "cancelled":
        return <XCircle className="w-6 h-6 text-red-600" />;
      case "completed":
        return <CheckCircle className="w-6 h-6 text-blue-600" />;
      default:
        return <AlertCircle className="w-6 h-6 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận";
      case "pending":
        return "Chờ xác nhận";
      case "cancelled":
        return "Đã hủy";
      case "completed":
        return "Hoàn thành";
      default:
        return status;
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
    switch (method) {
      case "vnpay":
        return "VNPay";
      case "momo":
        return "MoMo";
      case "banking":
        return "Chuyển khoản ngân hàng";
      case "card":
        return "Thẻ tín dụng/ghi nợ";
      default:
        return "Chưa thanh toán";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">Chi tiết đơn đặt sân</DialogTitle>
              <p className="text-sm text-gray-500 mt-1">Mã đặt sân: {booking.id}</p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(booking.status)}
              <Badge className={getStatusColor(booking.status)}>
                {getStatusLabel(booking.status)}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Court Info Section */}
          <div>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-teal-600" />
              Thông tin sân
            </h3>
            {court && (
              <div className="border rounded-lg overflow-hidden">
                <div className="relative h-48">
                  <img
                    src={court.images[0]}
                    alt={court.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3">
                    <Badge className="bg-white/90 text-gray-900 border-0">
                      {court.type === "pickleball"
                        ? "Pickleball"
                        : court.type === "badminton"
                        ? "Cầu lông"
                        : court.type === "basketball"
                        ? "Bóng rổ"
                        : court.type === "tennis"
                        ? "Tennis"
                        : "Bóng chuyền"}
                    </Badge>
                  </div>
                </div>
                <div className="p-4 bg-gray-50">
                  <h4 className="font-bold text-lg mb-1">{booking.courtName}</h4>
                  <p className="text-sm text-gray-600">{court.address}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{court.rating}</span>
                      <span className="text-gray-500">({court.reviewCount} đánh giá)</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">Mã sân: {court.code}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Booking Info Section */}
          <div>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-600" />
              Thông tin đặt sân
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 bg-teal-50 rounded-lg border border-teal-100">
                <p className="text-xs text-teal-600 font-medium mb-1">Ngày chơi</p>
                <p className="text-sm font-bold text-gray-900">
                  {new Date(booking.date).toLocaleDateString("vi-VN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-600 font-medium mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Giờ chơi
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {booking.startTime} - {booking.endTime}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">({booking.hours} giờ)</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                <p className="text-xs text-purple-600 font-medium mb-1">Ngày đặt</p>
                <p className="text-sm font-bold text-gray-900">
                  {new Date(booking.createdAt).toLocaleDateString("vi-VN")}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {new Date(booking.createdAt).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Info Section */}
          <div>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-teal-600" />
              Thông tin thanh toán
            </h3>
            <div className="border rounded-lg p-5 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Trạng thái thanh toán</p>
                  <Badge
                    className={
                      booking.paymentStatus === "paid"
                        ? "bg-green-100 text-green-800"
                        : booking.paymentStatus === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {getPaymentStatusLabel(booking.paymentStatus)}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Phương thức thanh toán</p>
                  <p className="text-sm font-medium text-gray-900">
                    {getPaymentMethodLabel(booking.paymentMethod)}
                  </p>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Giá thuê sân ({booking.hours} giờ)</span>
                  <span className="font-medium">{booking.totalPrice.toLocaleString()}đ</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Phí dịch vụ</span>
                  <span className="font-medium">0đ</span>
                </div>
                <Separator className="my-2" />
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold">Tổng cộng</span>
                  <span className="text-xl font-bold text-teal-600">
                    {booking.totalPrice.toLocaleString()}đ
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Info Section */}
          <div>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-teal-600" />
              Thông tin khách hàng
            </h3>
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Họ và tên</p>
                    <p className="text-sm font-medium">{booking.userName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                    ID: {booking.userId}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium">customer@example.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Số điện thoại</p>
                    <p className="text-sm font-medium">0901234567</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            {booking.status === "pending" && (
              <>
                <Button
                  className="flex-1 bg-teal-600 hover:bg-teal-700"
                  onClick={() => {
                    onConfirm?.(booking.id);
                    onOpenChange(false);
                  }}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Xác nhận đặt sân
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => {
                    onCancel?.(booking.id);
                    onOpenChange(false);
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Hủy đặt sân
                </Button>
              </>
            )}
            {booking.status === "confirmed" && booking.paymentStatus === "pending" && (
              <Button className="flex-1 bg-yellow-600 hover:bg-yellow-700">
                <CreditCard className="w-4 h-4 mr-2" />
                Xác nhận thanh toán
              </Button>
            )}
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Đóng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}