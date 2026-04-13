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
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";

interface BookingDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: any | null; // Using any for APIBooking
  onStatusChange?: (id: string, status: string) => void;
  onPaymentConfirm?: (id: string, amount: number, method: string) => void;
}

export function BookingDetailModal({
  open,
  onOpenChange,
  booking,
  onStatusChange,
  onPaymentConfirm,
}: BookingDetailModalProps) {
  if (!booking) return null;

  // Get court data from API response (booking.courtId is fully populated)
  const court = booking.courtId;
  const courtType = court?.typeId;

  // Get image URL (prefer mainImage, fallback to first in images array)
  const courtImageUrl = court?.mainImage || court?.images?.[0];

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
      case "cash":
        return "Tiền mặt tại sân";
      default:
        return "Chưa xác định";
    }
  };

  const getCourtTypeName = (type: any): string => {
    // type là courtType object từ API populate
    if (type && typeof type === "object" && type.name) {
      return type.name;
    }
    // Fallback - không có data
    return "Loại sân";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">Chi tiết đơn đặt sân</DialogTitle>
              <p className="text-sm text-gray-500 mt-1">Mã đặt sân: {booking.bookingCode || booking._id}</p>
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
                {/* Court Image */}
                <div className="relative h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                  {courtImageUrl ? (
                    <img
                      src={courtImageUrl}
                      alt={court.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback if image fails to load
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                      <ImageIcon className="w-8 h-8" />
                      <span className="text-sm">Chưa có ảnh sân</span>
                    </div>
                  )}

                  {/* Court Type Badge */}
                  {courtType && (
                    <div className="absolute bottom-3 left-3">
                      <Badge
                        className="bg-white/90 text-gray-900 border-0 font-medium"
                        style={{
                          backgroundColor: courtType?.color || '#ffffff',
                          color: courtType?.color ? '#ffffff' : '#111827'
                        }}
                      >
                        {getCourtTypeName(courtType)}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Court Info */}
                <div className="p-4 bg-gray-50">
                  <h4 className="font-bold text-lg mb-1">{court.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{court.address}</p>
                  {court.code && (
                    <p className="text-xs text-gray-500">Mã sân: <span className="font-mono font-semibold">{court.code}</span></p>
                  )}
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
                  Giờ chơi (Các Slot)
                </p>
                {booking.slots?.map((slot: any, idx: number) => (
                  <p key={idx} className="text-sm font-bold text-gray-900">
                    {slot.startTime} - {slot.endTime} <span className="font-normal text-xs text-gray-500">({slot.price?.toLocaleString()}đ)</span>
                  </p>
                ))}
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
                    {getPaymentMethodLabel(booking.preferredPaymentMethod || booking.paymentMethod)}
                  </p>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Giá trị đơn</span>
                  <span className="font-medium">{booking.totalPrice?.toLocaleString()}đ</span>
                </div>
                {booking.discountAmount > 0 && (
                  <div className="flex items-center justify-between text-sm text-green-600">
                    <span>Giảm giá ({booking.discountCode})</span>
                    <span className="font-medium">-{booking.discountAmount?.toLocaleString()}đ</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold">Tổng thu</span>
                  <span className="text-xl font-bold text-teal-600">
                    {booking.finalPrice?.toLocaleString()}đ
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
                    <p className="text-sm font-medium">{booking.customerName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                    Người đặt ({booking.user?.role === 'admin' ? 'Admin' : 'Khách'})
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Email TK</p>
                    <p className="text-sm font-medium">{booking.user?.email || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Số điện thoại liên hệ</p>
                    <p className="text-sm font-medium">{booking.customerPhone}</p>
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
                    onStatusChange?.(booking._id, "confirmed");
                  }}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Xác nhận đặt sân
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => {
                    if (window.confirm('Bạn có chắc chắn muốn hủy đơn đặt sân này?')) {
                      onStatusChange?.(booking._id, "cancelled");
                    }
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Hủy đặt sân
                </Button>
              </>
            )}

            {booking.status === "confirmed" && booking.paymentStatus === "unpaid" && (
              <Button
                className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                onClick={() => {
                  if (window.confirm(`Xác nhận KHÁCH ĐÃ THANH TOÁN ${booking.finalPrice.toLocaleString()}đ ?`)) {
                    onPaymentConfirm?.(booking._id, booking.finalPrice, booking.preferredPaymentMethod || "cash");
                  }
                }}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Đã thu tiền ({booking.finalPrice.toLocaleString()}đ)
              </Button>
            )}

            {booking.status === "confirmed" && booking.paymentStatus === "paid" && (
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  onStatusChange?.(booking._id, "completed");
                }}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Hoàn thành đơn (Khách đã chơi xong)
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