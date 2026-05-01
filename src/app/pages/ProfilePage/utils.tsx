// ─── Helper / Pure Utility Functions ──────────────────────────────────────────
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";

/**
 * Tính khoảng thời gian từ slot đầu tiên đến slot cuối cùng
 * VD: slots[09:00-09:30, 09:30-10:00] → "09:00 - 10:00 (1.0 giờ)"
 */
export const getTimeRange = (slots: { startTime: string; endTime: string }[]): string => {
  if (!slots || slots.length === 0) return "Không xác định";

  const firstSlot = slots[0];
  const lastSlot = slots[slots.length - 1];
  const startTime = firstSlot.startTime;
  const endTime = lastSlot.endTime;

  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);
  const totalMinutes = endH * 60 + endM - (startH * 60 + startM);
  const hours = totalMinutes / 60;

  return `${startTime} - ${endTime} (${hours.toFixed(1)} giờ)`;
};

export const getTotalSlotPrice = (slots: { price: number }[]): number => {
  return slots.reduce((sum, slot) => sum + (slot.price || 0), 0);
};

export const getStatusColor = (status: string): string => {
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

export const getStatusLabel = (status: string): string => {
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

export const getPaymentStatusLabel = (status: string): string => {
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

export const getPaymentMethodLabel = (method?: string): string => {
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

export const getStatusIcon = (status: string) => {
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
