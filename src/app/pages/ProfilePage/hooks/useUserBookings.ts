import { useState } from "react";
import { toast } from "sonner";
import api from "../../../lib/api";
import { APIBooking } from "../types";

export function useUserBookings() {
   const [userBookings, setUserBookings] = useState<APIBooking[]>([]);
   const [isLoadingBookings, setIsLoadingBookings] = useState(false);

   const fetchUserBookings = async () => {
      setIsLoadingBookings(true);
      try {
         const response = await api.get("/bookings/my");
         setUserBookings(response.data || []);
      } catch (error) {
         toast.error("Không thể tải lịch sử đặt sân");
         console.error(error);
      } finally {
         setIsLoadingBookings(false);
      }
   };

   const cancelBooking = async (bookingId: string) => {
      try {
         await api.patch(`/bookings/${bookingId}/status`, { status: "cancelled" });
         toast.success("Đã hủy đặt sân thành công!");
         // Reload booking list
         await fetchUserBookings();
         return true;
      } catch (error: any) {
         toast.error(error.response?.data?.message || "Không thể hủy đơn đặt sân");
         return false;
      }
   };

   return {
      userBookings,
      setUserBookings,
      isLoadingBookings,
      fetchUserBookings,
      cancelBooking,
   };
}
