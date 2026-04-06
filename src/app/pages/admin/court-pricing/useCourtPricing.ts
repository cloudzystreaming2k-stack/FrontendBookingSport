import { useState, useCallback } from "react";
import { toast } from "sonner";
import { pricingService } from "./pricing.service";
import { DayPricing, TimeSlot, BatchPricingSlot } from "./pricing";

// ─── Constants ────────────────────────────────────────────────────────────────
export const DAY_OF_WEEK_MAP: { day: string; dayLabel: string; dayOfWeek: number }[] = [
  { day: "sunday", dayLabel: "CN", dayOfWeek: 0 },
  { day: "monday", dayLabel: "T.2", dayOfWeek: 1 },
  { day: "tuesday", dayLabel: "T.3", dayOfWeek: 2 },
  { day: "wednesday", dayLabel: "T.4", dayOfWeek: 3 },
  { day: "thursday", dayLabel: "T.5", dayOfWeek: 4 },
  { day: "friday", dayLabel: "T.6", dayOfWeek: 5 },
  { day: "saturday", dayLabel: "T.7", dayOfWeek: 6 },
];

export const DAY_TO_WEEK_NUM: Record<string, number> = {
  sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
  thursday: 4, friday: 5, saturday: 6,
};

export const DAY_LABELS: Record<string, string> = {
  monday: "T.2", tuesday: "T.3", wednesday: "T.4",
  thursday: "T.5", friday: "T.6", saturday: "T.7", sunday: "CN",
};

/** Map response từ API sang DayPricing[] */
export function mapApiResponse(grouped: { dayOfWeek: number; timeSlots: TimeSlot[] }[]): DayPricing[] {
  return DAY_OF_WEEK_MAP.map(({ day, dayLabel, dayOfWeek }) => {
    const found = grouped.find(g => g.dayOfWeek === dayOfWeek);
    return {
      day, dayLabel, dayOfWeek,
      timeSlots: found?.timeSlots ?? [],
    };
  });
}

export function useCourtPricing(selectedCourt: string) {
  const [pricing, setPricing] = useState<DayPricing[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [bulking, setBulking] = useState(false);

  // ── Fetch pricing
  const fetchPricing = useCallback(async (courtId: string) => {
    if (!courtId) return;
    setLoading(true);
    try {
      const data = await pricingService.getCourtPricing(courtId);
      setPricing(mapApiResponse(data));
    } catch {
      toast.error("Không thể tải cấu hình giá.");
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Save whole batch
  const handleSave = async (courtName?: string) => {
    if (!selectedCourt) return;
    setSaving(true);
    try {
      const slots: BatchPricingSlot[] = pricing.flatMap(day =>
        day.timeSlots.map(slot => ({
          dayOfWeek: day.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
          price: slot.price,
        }))
      );
      await pricingService.saveBatchPricing(selectedCourt, slots);
      toast.success("Đã lưu cấu hình giá thành công!", {
        description: courtName ? `Sân: ${courtName}` : "",
      });
    } catch {
      toast.error("Lưu thất bại. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  // ── Bulk update 
  const handleApplyBulk = async (payload: { days: string[], fromTime: string, toTime: string, price: number }) => {
    if (!selectedCourt) return false;
    setBulking(true);
    try {
      const res = await pricingService.bulkUpdatePricing(selectedCourt, {
        days: payload.days.map(d => DAY_TO_WEEK_NUM[d]),
        fromTime: payload.fromTime,
        toTime: payload.toTime,
        price: payload.price
      });
      toast.success(`Đã cập nhật ${res.updated} slots thành công!`);
      await fetchPricing(selectedCourt);
      return true;
    } catch {
      toast.error("Cập nhật hàng loạt thất bại.");
      return false;
    } finally {
      setBulking(false);
    }
  };

  // ── Actions
  const updatePrice = (day: string, slotIndex: number, price: number) => {
    setPricing(prev =>
      prev.map(d => d.day === day
        ? { ...d, timeSlots: d.timeSlots.map((s, i) => i === slotIndex ? { ...s, price } : s) }
        : d
      )
    );
  };

  const applyWeekdayPricing = () => {
    setPricing(prev => {
      const mon = prev.find(p => p.day === "monday");
      if (!mon) return prev;
      return prev.map(p =>
        ["tuesday", "wednesday", "thursday", "friday"].includes(p.day)
          ? { ...p, timeSlots: mon.timeSlots.map(s => ({ ...s })) } : p
      );
    });
    toast.info("Đã áp giá T.2 cho T.3–T.6 (chưa lưu)");
  };

  const applyWeekendPricing = () => {
    setPricing(prev => {
      const sat = prev.find(p => p.day === "saturday");
      if (!sat) return prev;
      return prev.map(p =>
        p.day === "sunday" ? { ...p, timeSlots: sat.timeSlots.map(s => ({ ...s })) } : p
      );
    });
    toast.info("Đã áp giá T.7 cho CN (chưa lưu)");
  };

  return {
    pricing,
    setPricing,
    loading,
    saving,
    bulking,
    fetchPricing,
    handleSave,
    handleApplyBulk,
    updatePrice,
    applyWeekdayPricing,
    applyWeekendPricing
  };
}
