import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import api from "../../lib/api";
import { mockReviews } from "../../data/mockData";
import { ApiCourt, ApiSlot, SlotGroup } from "./types";

// ── Helpers ───────────────────────────────────────────────────────────────────

export function toLocalISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatDisplayDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const dayName = dayNames[d.getDay()];
  const dateNum = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${dayName} ${dateNum}/${month}`;
}

export function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  // Chuyển CN(0) thành 7 để T2 = đầu tuần
  const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

  const days = [];
  const prevLastDay = new Date(year, month, 0).getDate();

  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, prevLastDay - i);
    days.push({ date: d, dateNum: d.getDate(), iso: toLocalISO(d), isCurrentMonth: false });
  }
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const d = new Date(year, month, i);
    days.push({ date: d, dateNum: i, iso: toLocalISO(d), isCurrentMonth: true });
  }
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    const d = new Date(year, month + 1, i);
    days.push({ date: d, dateNum: i, iso: toLocalISO(d), isCurrentMonth: false });
  }
  return days;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export interface UseCourtDetailReturn {
  // Data
  court: ApiCourt | null;
  slots: ApiSlot[];
  courtReviews: { id: string; userName: string; rating: number; comment: string; createdAt: string; courtId: string }[];

  // Loading
  isLoadingCourt: boolean;
  isLoadingSlots: boolean;

  // Calendar
  currentMonth: Date;
  setCurrentMonth: (d: Date) => void;
  days: ReturnType<typeof getCalendarDays>;
  selectedDay: string;
  setSelectedDay: (day: string) => void;

  // Slot selection
  selectedSlots: string[];
  toggleSlot: (time: string) => void;

  // Discount
  discountCodeInput: string;
  setDiscountCodeInput: (v: string) => void;
  appliedDiscount: { code: string; percent: number } | null;
  handleApplyDiscount: () => void;
  handleRemoveDiscount: () => void;

  // Computed
  totalPrice: number;
  discountAmount: number;
  finalPrice: number;
  groupedSelectedSlots: SlotGroup[];
}

export function useCourtDetail(id: string | undefined): UseCourtDetailReturn {
  // ── Court data ──────────────────────────────────────────────────────────────
  const [court, setCourt] = useState<ApiCourt | null>(null);
  const [isLoadingCourt, setIsLoadingCourt] = useState(true);

  useEffect(() => {
    if (!id) return;
    setIsLoadingCourt(true);
    api
      .get(`/courts/${id}`)
      .then((res) => setCourt(res.data))
      .catch(() => setCourt(null))
      .finally(() => setIsLoadingCourt(false));
  }, [id]);

  // ── Slots ───────────────────────────────────────────────────────────────────
  const [slots, setSlots] = useState<ApiSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // ── Calendar ────────────────────────────────────────────────────────────────
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const days = useMemo(
    () => getCalendarDays(currentMonth.getFullYear(), currentMonth.getMonth()),
    [currentMonth]
  );

  const [selectedDay, setSelectedDay] = useState<string>(() => toLocalISO(new Date()));
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

  // ── Discount ────────────────────────────────────────────────────────────────
  const [discountCodeInput, setDiscountCodeInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent: number } | null>(null);

  // ── Fetch slots khi đổi ngày ────────────────────────────────────────────────
  useEffect(() => {
    if (!id || !selectedDay) return;
    setIsLoadingSlots(true);
    setSelectedSlots([]);
    setAppliedDiscount(null);
    api
      .get(`/courts/${id}/slots`, { params: { date: selectedDay } })
      .then((res) => setSlots(res.data.slots ?? []))
      .catch(() => setSlots([]))
      .finally(() => setIsLoadingSlots(false));
  }, [id, selectedDay]);

  // ── Reviews (giữ mock tạm) ──────────────────────────────────────────────────
  // TODO: Replace with real API when Review endpoint is ready
  const courtReviews = mockReviews.filter((r: { courtId: string }) => r.courtId === id);

  // ── Actions ─────────────────────────────────────────────────────────────────
  const toggleSlot = (time: string) => {
    const slot = slots.find((s) => s.time === time);
    if (slot?.status === "booked") return;
    setSelectedSlots((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  const handleApplyDiscount = () => {
    if (!discountCodeInput.trim()) return;
    const code = discountCodeInput.trim().toUpperCase();
    const discountMap: Record<string, number> = { SPORT10: 10, SPORT20: 20 };
    if (discountMap[code]) {
      setAppliedDiscount({ code, percent: discountMap[code] });
      toast.success(`Áp dụng mã giảm giá ${discountMap[code]}% thành công!`);
    } else {
      toast.error("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
      setAppliedDiscount(null);
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCodeInput("");
    toast.info("Đã gỡ mã giảm giá!");
  };

  // ── Computed values ─────────────────────────────────────────────────────────
  const totalPrice = useMemo(
    () => selectedSlots.reduce((sum, time) => sum + (slots.find((s) => s.time === time)?.price ?? 0), 0),
    [selectedSlots, slots]
  );

  const discountAmount = appliedDiscount ? (totalPrice * appliedDiscount.percent) / 100 : 0;
  const finalPrice = totalPrice - discountAmount;

  const groupedSelectedSlots = useMemo<SlotGroup[]>(() => {
    if (selectedSlots.length === 0) return [];

    const sortedIndices = selectedSlots
      .map((time) => slots.findIndex((s) => s.time === time))
      .filter((i) => i !== -1)
      .sort((a, b) => a - b);

    if (sortedIndices.length === 0) return [];

    const groups: SlotGroup[] = [];
    let current = {
      startIdx: sortedIndices[0],
      endIdx: sortedIndices[0],
      price: slots[sortedIndices[0]].price,
    };

    for (let i = 1; i < sortedIndices.length; i++) {
      const idx = sortedIndices[i];
      if (idx === current.endIdx + 1) {
        current.endIdx = idx;
        current.price += slots[idx].price;
      } else {
        groups.push({
          startTime: slots[current.startIdx].time,
          endTime: slots[current.endIdx].endTime,
          price: current.price,
        });
        current = { startIdx: idx, endIdx: idx, price: slots[idx].price };
      }
    }
    groups.push({
      startTime: slots[current.startIdx].time,
      endTime: slots[current.endIdx].endTime,
      price: current.price,
    });

    return groups;
  }, [selectedSlots, slots]);

  return {
    court, slots, courtReviews,
    isLoadingCourt, isLoadingSlots,
    currentMonth, setCurrentMonth, days, selectedDay, setSelectedDay,
    selectedSlots, toggleSlot,
    discountCodeInput, setDiscountCodeInput,
    appliedDiscount, handleApplyDiscount, handleRemoveDiscount,
    totalPrice, discountAmount, finalPrice, groupedSelectedSlots,
  };
}
