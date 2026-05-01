import { useNavigate } from "react-router";
import {
  MapPin, Calendar, Clock, CreditCard, User, Phone,
  Image as ImageIcon, XCircle,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Separator } from "../../../components/ui/separator";
import type { APIBooking } from "../types";
import {
  getStatusColor,
  getStatusLabel,
  getStatusIcon,
  getTimeRange,
  getPaymentMethodLabel,
} from "../utils";

interface Props {
  selectedBooking: APIBooking | null;
  isOpen: boolean;
  onClose: () => void;
  onCancel: (booking: APIBooking) => void;
}

export function BookingDetailModal({ selectedBooking, isOpen, onClose, onCancel }: Props) {
  const navigate = useNavigate();

  if (!selectedBooking) return null;

  const court = selectedBooking.courtId;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">Chi tiết đơn đặt sân</DialogTitle>
              <p className="text-sm text-gray-500 mt-1">Mã đặt sân: {selectedBooking.bookingCode}</p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(selectedBooking.status)}
              <Badge className={getStatusColor(selectedBooking.status)}>
                {getStatusLabel(selectedBooking.status)}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Court Info Section */}
          <div>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Thông tin sân
            </h3>
            {court && (
              <div className="border rounded-lg overflow-hidden">
                <div className="relative h-48 bg-gray-200">
                  {court.mainImage || court.images?.[0] ? (
                    <img
                      src={court.mainImage || court.images?.[0]!}
                      alt={court.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3">
                    <Badge className="bg-white/90 text-gray-900 border-0">
                      {court.typeId?.name || "Không xác định"}
                    </Badge>
                  </div>
                </div>
                <div className="p-4 bg-gray-50">
                  <h4 className="font-bold text-lg mb-1">{court.name}</h4>
                  <p className="text-sm text-gray-600">{court.address}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                    <MapPin className="w-3 h-3" />
                    <span>{court.code}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Booking Info Section */}
          <div>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Thông tin đặt sân
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-600 font-medium mb-1">Ngày chơi</p>
                <p className="text-sm font-bold text-gray-900">
                  {new Date(selectedBooking.date).toLocaleDateString("vi-VN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <p className="text-xs text-green-600 font-medium mb-3 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Chi tiết giờ chơi
                </p>
                <div className="space-y-2">
                  {selectedBooking.slots && selectedBooking.slots.length > 0 ? (
                    selectedBooking.slots.map((slot, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-900">
                          Slot {idx + 1}: {slot.startTime} - {slot.endTime}
                        </span>
                        <span className="text-green-700 font-semibold">
                          {slot.price.toLocaleString()}đ
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Không có dữ liệu slot</p>
                  )}
                </div>
                <div className="border-t border-green-200 mt-3 pt-2">
                  <p className="text-xs text-gray-600">
                    Tổng thời gian: {getTimeRange(selectedBooking.slots)}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                <p className="text-xs text-purple-600 font-medium mb-1">Ngày đặt</p>
                <p className="text-sm font-bold text-gray-900">
                  {new Date(selectedBooking.createdAt).toLocaleDateString("vi-VN")}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {new Date(selectedBooking.createdAt).toLocaleTimeString("vi-VN", {
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
              <CreditCard className="w-5 h-5 text-blue-600" />
              Thông tin thanh toán
            </h3>
            <div className="border rounded-lg p-5 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Trạng thái đơn hàng</p>
                  <Badge className={getStatusColor(selectedBooking.status)}>
                    {getStatusLabel(selectedBooking.status)}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Phương thức thanh toán</p>
                  <p className="text-sm font-medium text-gray-900">
                    {getPaymentMethodLabel(selectedBooking.preferredPaymentMethod)}
                  </p>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Tổng giá tiền</span>
                  <span className="font-medium">{selectedBooking.finalPrice.toLocaleString()}đ</span>
                </div>
                {selectedBooking.discountAmount && selectedBooking.discountAmount > 0 && (
                  <div className="flex items-center justify-between text-sm text-green-700">
                    <span className="text-gray-600">Giảm giá</span>
                    <span className="font-medium">-{selectedBooking.discountAmount.toLocaleString()}đ</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold">Cần thanh toán</span>
                  <span className="text-xl font-bold text-blue-600">
                    {selectedBooking.finalPrice.toLocaleString()}đ
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Info Section */}
          <div>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Thông tin người đặt
            </h3>
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Họ và tên</p>
                    <p className="text-sm font-medium">{selectedBooking.customerName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Số điện thoại</p>
                    <p className="text-sm font-medium">{selectedBooking.customerPhone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            {(selectedBooking.status === "pending" || selectedBooking.status === "confirmed") && (
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => onCancel(selectedBooking)}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Hủy đặt sân
              </Button>
            )}
            {court && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  navigate(`/courts/${court._id}`);
                  onClose();
                }}
              >
                Đặt lại sân này
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
