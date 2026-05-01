// ─── TypeScript Types & Interfaces ────────────────────────────────────────────

export interface APIBooking {
  _id: string;
  bookingCode: string;
  userId?: { _id: string; fullName: string; email: string; phone: string };
  courtId: {
    _id: string;
    name: string;
    address: string;
    images?: string[];
    mainImage?: string;
    code?: string;
    typeId?: { _id: string; name: string; color: string; icon: string };
  };
  date: string;
  customerName: string;
  customerPhone: string;
  slots: { startTime: string; endTime: string; price: number }[];
  totalPrice: number;
  discountCode?: string;
  discountAmount?: number;
  finalPrice: number;
  preferredPaymentMethod: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  createdAt: string;
}

export type TabType = "account" | "favorites" | "bookings";

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
}

export interface PasswordData {
  current: string;
  new: string;
  confirm: string;
}
