import { useState } from "react";
import { toast } from "sonner";
import api from "../../../lib/api";
import type { APIBooking } from "../types";

export function useBookings() {
  const [userBookings, setUserBookings] = useState<APIBooking[]>([]);
  const [bookingTotal, setBookingTotal] = useState(0);
  const [bookingPage, setBookingPage] = useState(1);
  const [bookingTotalPages, setBookingTotalPages] = useState(1);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  // Modal state
  const [selectedBooking, setSelectedBooking] = useState<APIBooking | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const fetchUserBookings = async (page = 1) => {
    setIsLoadingBookings(true);
    try {
      const response = await api.get(`/bookings/my?page=${page}&limit=5`);
      setUserBookings(response.data.bookings || []);
      setBookingTotal(response.data.total || 0);
      setBookingTotalPages(response.data.totalPages || 1);
      setBookingPage(page);
    } catch (error) {
      toast.error("Không thể tải lịch sử đặt sân");
      console.error(error);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  const handleCancelBooking = async (booking: APIBooking) => {
    try {
      await api.patch(`/bookings/${booking._id}/status`, { status: "cancelled" });
      toast.success("Đã hủy đặt sân thành công!");
      await fetchUserBookings(bookingPage);
      handleCloseDetailModal();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể hủy đơn đặt sân");
    }
  };

  const handleOpenDetailModal = (booking: APIBooking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setSelectedBooking(null);
    setIsDetailModalOpen(false);
  };

  return {
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
  };
}
