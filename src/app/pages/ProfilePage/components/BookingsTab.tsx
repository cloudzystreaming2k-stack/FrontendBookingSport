import { useNavigate } from "react-router";
import { Calendar } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { BookingDetailModal } from "./BookingDetailModal";
import type { APIBooking } from "../types";
import { getStatusColor, getStatusLabel, getTimeRange } from "../utils";

interface Props {
  userBookings: APIBooking[];
  bookingTotal: number;
  bookingPage: number;
  bookingTotalPages: number;
  isLoadingBookings: boolean;
  fetchUserBookings: (page?: number) => void;
  handleCancelBooking: (booking: APIBooking) => void;
  selectedBooking: APIBooking | null;
  isDetailModalOpen: boolean;
  handleOpenDetailModal: (booking: APIBooking) => void;
  handleCloseDetailModal: () => void;
}

export function BookingsTab({
  userBookings,
  bookingTotal,
  bookingPage,
  bookingTotalPages,
  isLoadingBookings,
  fetchUserBookings,
  handleCancelBooking,
  selectedBooking,
  isDetailModalOpen,
  handleOpenDetailModal,
  handleCloseDetailModal,
}: Props) {
  const navigate = useNavigate();

  return (
    <>
      <Card>
        <CardHeader className="border-b bg-gray-50">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Lịch sử đặt sân
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {isLoadingBookings ? (
            <div className="py-12 text-center">
              <div className="inline-flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              </div>
              <p className="text-gray-600 mt-4">Đang tải lịch sử đặt sân...</p>
            </div>
          ) : userBookings.length > 0 ? (
            <div className="space-y-4">
              {userBookings.map((booking) => (
                <Card key={booking._id} className="border hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-lg">{booking.courtId.name}</h3>
                            <p className="text-sm text-gray-500 mt-0.5">
                              Mã đặt sân: {booking.bookingCode}
                            </p>
                          </div>
                          <Badge className={getStatusColor(booking.status)}>
                            {getStatusLabel(booking.status)}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Ngày đặt</p>
                            <p className="text-sm font-medium">
                              {new Date(booking.date).toLocaleDateString("vi-VN")}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Giờ chơi</p>
                            <p className="text-sm font-medium">
                              {getTimeRange(booking.slots).split(" (")[0]}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Thanh toán</p>
                            <p className="text-sm font-medium">
                              {booking.status === "completed"
                                ? "Hoàn tất"
                                : ["pending", "confirmed"].includes(booking.status)
                                ? "Chờ xử lý"
                                : "Hủy"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Tổng tiền</p>
                            <p className="text-sm font-bold text-blue-600">
                              {booking.finalPrice?.toLocaleString()}đ
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 lg:flex-col">
                        {["pending", "confirmed"].includes(booking.status) && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 lg:flex-none"
                            onClick={() => {
                              if (window.confirm("Bạn có chắc chắn muốn hủy đơn này?")) {
                                handleCancelBooking(booking);
                              }
                            }}
                          >
                            Hủy
                          </Button>
                        )}
                        <Button
                          size="sm"
                          className="flex-1 lg:flex-none"
                          onClick={() => handleOpenDetailModal(booking)}
                        >
                          Chi tiết
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Bạn chưa có lịch đặt sân nào</p>
              <p className="text-sm text-gray-500 mb-4">
                Khám phá và đặt sân yêu thích của bạn ngay hôm nay
              </p>
              <Button onClick={() => navigate("/courts")}>Đặt sân ngay</Button>
            </div>
          )}

          {/* Pagination Bar */}
          {bookingTotalPages > 1 && (
            <div className="flex items-center justify-between pt-4 mt-6 border-t px-2">
              <p className="text-sm text-gray-600">
                Tổng <span className="font-semibold text-gray-900">{bookingTotal}</span> đơn (Trang{" "}
                {bookingPage}/{bookingTotalPages})
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchUserBookings(bookingPage - 1)}
                  disabled={bookingPage <= 1 || isLoadingBookings}
                >
                  Trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchUserBookings(bookingPage + 1)}
                  disabled={bookingPage >= bookingTotalPages || isLoadingBookings}
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Booking Detail Modal */}
      <BookingDetailModal
        selectedBooking={selectedBooking}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        onCancel={handleCancelBooking}
      />
    </>
  );
}
