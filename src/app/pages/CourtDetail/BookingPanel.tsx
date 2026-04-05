import {
  Calendar, Check, ChevronLeft, ChevronRight,
  Clock, Loader2, Shield, Star, TicketPercent, Zap,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { ApiCourt, ApiSlot, SlotGroup } from "./types";
import { toLocalISO, formatDisplayDate, getCalendarDays } from "./useCourtDetail";

// ── Types ─────────────────────────────────────────────────────────────────────
interface BookingPanelProps {
  court: ApiCourt;

  // Calendar
  currentMonth: Date;
  setCurrentMonth: (d: Date) => void;
  days: ReturnType<typeof getCalendarDays>;
  selectedDay: string;
  onDaySelect: (day: string) => void;

  // Slots
  slots: ApiSlot[];
  isLoadingSlots: boolean;
  selectedSlots: string[];
  toggleSlot: (time: string) => void;

  // Discount
  discountCodeInput: string;
  setDiscountCodeInput: (v: string) => void;
  appliedDiscount: { code: string; percent: number } | null;
  onApplyDiscount: () => void;
  onRemoveDiscount: () => void;

  // Computed
  totalPrice: number;
  discountAmount: number;
  finalPrice: number;
  groupedSelectedSlots: SlotGroup[];

  // Actions
  onBook: () => void;
}

// ── Session definitions ───────────────────────────────────────────────────────
const SESSIONS = [
  { label: "🌅 Buổi sáng",  range: ["06:00", "12:00"], color: "text-amber-600"  },
  { label: "☀️ Buổi chiều", range: ["12:00", "18:00"], color: "text-orange-600" },
  { label: "🌙 Buổi tối",   range: ["18:00", "23:00"], color: "text-violet-600" },
];

const WEEKDAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

// ── Component ─────────────────────────────────────────────────────────────────
export function BookingPanel({
  court,
  currentMonth, setCurrentMonth,
  days, selectedDay, onDaySelect,
  slots, isLoadingSlots, selectedSlots, toggleSlot,
  discountCodeInput, setDiscountCodeInput,
  appliedDiscount, onApplyDiscount, onRemoveDiscount,
  totalPrice, discountAmount, finalPrice, groupedSelectedSlots,
  onBook,
}: BookingPanelProps) {
  const today = toLocalISO(new Date());

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="p-5 border-b border-gray-50">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" /> Chọn ngày & giờ
        </h2>
        <p className="text-base text-gray-400 mt-0.5">Click vào ô trống để chọn khung giờ mong muốn</p>
      </div>

      {/* ── Calendar ────────────────────────────────────────────────────── */}
      <div className="p-5 sm:p-6 border-b border-gray-50">
        {/* Month header */}
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="font-bold text-gray-900 text-base">
            Tháng {currentMonth.getMonth() + 1}, {currentMonth.getFullYear()}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
              className="p-1.5 rounded-md border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
              className="p-1.5 rounded-md border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 md:gap-3">
          {/* Weekday headers */}
          {WEEKDAY_LABELS.map((d) => (
            <div key={d} className="text-center text-xs font-bold text-gray-400 mb-2 py-1">{d}</div>
          ))}

          {/* Day cells */}
          {days.map((d) => {
            const isSelected = selectedDay === d.iso;
            const isToday    = today === d.iso;
            const isPast     = d.iso < today;

            return (
              <button
                key={d.iso}
                disabled={isPast}
                onClick={() => onDaySelect(d.iso)}
                className={`h-12 sm:h-14 md:h-[68px] flex flex-col items-center justify-center rounded-xl text-sm font-semibold transition-all relative ${
                  isSelected ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : isPast   ? "text-gray-300 bg-gray-50/50 cursor-not-allowed"
                  : isToday  ? "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                  : d.isCurrentMonth ? "bg-white text-gray-700 hover:bg-gray-100 border border-gray-100 hover:border-gray-200"
                  : "bg-white text-gray-400 hover:bg-gray-50 border border-transparent"
                }`}
              >
                {d.dateNum}
                {isToday && !isSelected && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-blue-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Slot grid ───────────────────────────────────────────────────── */}
      <div className="p-5">
        {/* Legend */}
        <div className="flex items-center gap-4 mb-4 text-base text-gray-500">
          <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded bg-white border-2 border-gray-200" />Còn trống</div>
          <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded bg-blue-600 border-2 border-blue-600" />Đã chọn</div>
          <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded bg-gray-100 border-2 border-gray-200" />Đã đặt</div>
        </div>

        {/* Slots content */}
        {isLoadingSlots ? (
          <div className="flex items-center justify-center py-10 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Đang tải khung giờ...</span>
          </div>
        ) : slots.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>Không có khung giờ nào cho ngày này.</p>
          </div>
        ) : (
          SESSIONS.map((session) => {
            const sessionSlots = slots.filter(
              (s: ApiSlot) => s.time >= session.range[0] && s.time < session.range[1]
            );
            if (sessionSlots.length === 0) return null;
            return (
              <div key={session.label} className="mb-5">
                <p className={`text-base font-bold mb-2 ${session.color}`}>{session.label}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {sessionSlots.map((slot: ApiSlot) => {
                    const isSelected = selectedSlots.includes(slot.time);
                    const isBooked   = slot.status === "booked";
                    return (
                      <button
                        key={slot.time}
                        disabled={isBooked}
                        onClick={() => toggleSlot(slot.time)}
                        className={`relative flex flex-col items-center py-3 rounded-xl border-2 text-center transition-all ${
                          isBooked   ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                          : isSelected ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200 scale-[1.02]"
                          : "bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50 cursor-pointer"
                        }`}
                      >
                        <span className="font-bold text-[13px] tracking-tight whitespace-nowrap">
                          {slot.time} - {slot.endTime}
                        </span>
                        <span className={`text-[11px] mt-0.5 ${isSelected ? "text-blue-100" : isBooked ? "text-gray-300" : "text-gray-500 font-medium"}`}>
                          {isBooked ? "Đã đặt" : `${(slot.price / 1000).toFixed(0)}k`}
                        </span>
                        {isSelected && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <Check className="w-2.5 h-2.5 text-blue-600" strokeWidth={3} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Mã giảm giá ─────────────────────────────────────────────────── */}
      {selectedSlots.length > 0 && (
        <div className="px-5 pb-4 border-t border-gray-50 pt-4">
          <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
            <TicketPercent className="w-4 h-4 text-green-500" /> Mã giảm giá
          </p>
          {appliedDiscount ? (
            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
              <span className="text-green-700 font-semibold text-sm">
                {appliedDiscount.code} — Giảm {appliedDiscount.percent}%
              </span>
              <button onClick={onRemoveDiscount} className="text-red-400 hover:text-red-600 text-xs font-bold">Gỡ</button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={discountCodeInput}
                onChange={(e) => setDiscountCodeInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && onApplyDiscount()}
                placeholder="Nhập mã..."
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 uppercase"
              />
              <button
                onClick={onApplyDiscount}
                className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Áp dụng
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── BookingSummary (sidebar phải) ─────────────────────────────────────────────
interface BookingSummaryProps {
  court: ApiCourt;
  selectedDay: string;
  selectedSlots: string[];
  groupedSelectedSlots: SlotGroup[];
  totalPrice: number;
  discountAmount: number;
  finalPrice: number;
  appliedDiscount: { code: string; percent: number } | null;
  onBook: () => void;
}

export function BookingSummary({
  court, selectedDay, selectedSlots, groupedSelectedSlots,
  totalPrice, discountAmount, finalPrice, appliedDiscount, onBook,
}: BookingSummaryProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-5 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <p className="text-base font-bold uppercase tracking-widest text-blue-200 mb-1">Đặt sân</p>
        <h3 className="text-xl font-black leading-tight">{court.name}</h3>
        {court.rating != null && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-bold text-base">{court.rating}</span>
            <span className="text-blue-200 text-base">· {court.reviewCount ?? 0} đánh giá</span>
          </div>
        )}
      </div>

      <div className="p-5 space-y-4">
        {selectedSlots.length > 0 ? (
          <div className="space-y-4">
            {/* Ngày đã chọn */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-gray-500 font-medium text-sm">
                <Calendar className="w-4 h-4" /> Ngày đã chọn
              </div>
              <div className="bg-gray-50 rounded-xl p-3 px-4 font-semibold text-gray-900 border border-gray-100/80">
                {formatDisplayDate(selectedDay)}, {new Date(selectedDay).getFullYear()}
              </div>
            </div>

            {/* Khung giờ đã chọn */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-gray-500 font-medium text-sm">
                <Clock className="w-4 h-4" /> Khung giờ đã chọn
              </div>
              <div className="space-y-2">
                {groupedSelectedSlots.map((group, i) => (
                  <div key={i} className="bg-green-100/70 flex justify-between items-center rounded-xl p-3 px-4 text-green-700 font-bold border border-green-200/50">
                    <span>{group.startTime} - {group.endTime}</span>
                    <span>{group.price.toLocaleString()}đ</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tổng tiền */}
            <div className="bg-blue-50/50 rounded-xl p-4 space-y-2 border border-blue-100/50">
              <div className="flex justify-between text-base">
                <span className="text-gray-500 font-medium">Số slot</span>
                <span className="font-bold text-gray-900">{selectedSlots.length} × 30 phút</span>
              </div>
              {appliedDiscount && (
                <>
                  <div className="flex justify-between text-base">
                    <span className="text-gray-500 font-medium">Tạm tính</span>
                    <span className="font-bold text-gray-900">{totalPrice.toLocaleString()}đ</span>
                  </div>
                  <div className="flex justify-between text-base text-green-600">
                    <span className="font-medium flex items-center gap-1">
                      <TicketPercent className="w-4 h-4" /> Mã ({appliedDiscount.code})
                    </span>
                    <span className="font-bold">- {discountAmount.toLocaleString()}đ</span>
                  </div>
                </>
              )}
              <div className="border-t border-blue-100 pt-2 flex justify-between items-end">
                <span className="font-bold text-gray-900">Tổng tiền</span>
                <div className="text-right">
                  {appliedDiscount && (
                    <span className="text-xs text-gray-400 line-through mr-1.5">{totalPrice.toLocaleString()}đ</span>
                  )}
                  <span className="text-xl font-black text-blue-600">{finalPrice.toLocaleString()}đ</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-base text-gray-400 font-medium">Chưa chọn khung giờ</p>
            <p className="text-base text-gray-300 mt-0.5">Chọn ngày và giờ bên trái</p>
          </div>
        )}

        {/* CTA */}
        <Button
          onClick={onBook}
          className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-200 hover:shadow-xl transition-all hover:-translate-y-0.5"
        >
          {selectedSlots.length > 0 ? `Đặt ngay · ${finalPrice.toLocaleString()}đ` : "Chọn khung giờ"}
        </Button>

        {/* Trust signals */}
        <div className="space-y-2">
          {[
            { icon: <Zap    className="w-3.5 h-3.5 text-green-500" />, label: "Xác nhận tức thì" },
            { icon: <Shield className="w-3.5 h-3.5 text-blue-500"  />, label: "Thanh toán bảo mật" },
            { icon: <Check  className="w-3.5 h-3.5 text-purple-500"/>, label: "Hủy miễn phí trước 24h" },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-base text-gray-500">
              {icon} {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
