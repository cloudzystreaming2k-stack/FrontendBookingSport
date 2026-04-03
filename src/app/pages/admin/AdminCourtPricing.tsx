import { useState, useEffect, useCallback } from "react";
import {
  Clock, Copy, Save, RotateCcw, Calendar, TrendingUp,
  ChevronDown, Zap, ArrowRight, Sun, Sunset, Moon, DollarSign,
  Loader2,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { toast } from "sonner";
import api from "../../lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TimeSlot {
  startTime: string;
  endTime: string;
  price: number;
}

interface DayPricing {
  day: string;       // "monday" | "tuesday" | ...
  dayLabel: string;
  dayOfWeek: number; // 0=CN, 1=T2, ..., 6=T7
  timeSlots: TimeSlot[];
}

interface Court {
  _id: string;
  name: string;
  typeId?: { _id: string; name: string } | string;
}

interface CourtType {
  _id: string;
  name: string;
  icon?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

/** dayOfWeek số (chuẩn JS) → key string */
const DAY_OF_WEEK_MAP: { day: string; dayLabel: string; dayOfWeek: number }[] = [
  { day: "sunday",    dayLabel: "CN",  dayOfWeek: 0 },
  { day: "monday",    dayLabel: "T.2", dayOfWeek: 1 },
  { day: "tuesday",   dayLabel: "T.3", dayOfWeek: 2 },
  { day: "wednesday", dayLabel: "T.4", dayOfWeek: 3 },
  { day: "thursday",  dayLabel: "T.5", dayOfWeek: 4 },
  { day: "friday",    dayLabel: "T.6", dayOfWeek: 5 },
  { day: "saturday",  dayLabel: "T.7", dayOfWeek: 6 },
];

/** Thứ tự hiển thị cột: T2 → T7 → CN */
const DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

const DAY_LABELS: Record<string, string> = {
  monday: "T.2", tuesday: "T.3", wednesday: "T.4",
  thursday: "T.5", friday: "T.6", saturday: "T.7", sunday: "CN",
};

const DAY_TO_WEEK_NUM: Record<string, number> = {
  sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
  thursday: 4, friday: 5, saturday: 6,
};

const TIME_OPTIONS: string[] = [];
const baseTime = ["06:00","06:30","07:00","07:30","08:00","08:30",
  "09:00","09:30","10:00","10:30","11:00","11:30",
  "12:00","12:30","13:00","13:30","14:00","14:30",
  "15:00","15:30","16:00","16:30","17:00","17:30",
  "18:00","18:30","19:00","19:30","20:00","20:30",
  "21:00","21:30","22:00","22:30","23:00"];
TIME_OPTIONS.push(...baseTime);

const timeBlocks = [
  { id: "morning",   label: "Buổi Sáng", range: "06:00 – 12:00", icon: Sun,    color: "amber",  slotStart: "06:00", slotEnd: "12:00" },
  { id: "afternoon", label: "Buổi Chiều",range: "12:00 – 18:00", icon: Sunset, color: "sky",    slotStart: "12:00", slotEnd: "18:00" },
  { id: "evening",   label: "Buổi Tối",  range: "18:00 – 23:00", icon: Moon,   color: "violet", slotStart: "18:00", slotEnd: "23:00" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatK(price: number) { return `${Math.round(price / 1000)}k`; }
function formatVND(price: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
}

function getPriceLevel(price: number): "low" | "mid" | "peak" | "super" {
  if (price >= 200000) return "super";
  if (price >= 180000) return "peak";
  if (price >= 150000) return "mid";
  return "low";
}

const priceLevelStyle: Record<string, string> = {
  low:   "bg-teal-50   text-teal-700   border-teal-200   hover:bg-teal-100",
  mid:   "bg-blue-50   text-blue-700   border-blue-200   hover:bg-blue-100",
  peak:  "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100",
  super: "bg-red-50    text-red-700    border-red-200    hover:bg-red-100",
};

/** Map response từ API (group theo dayOfWeek 0–6) sang DayPricing[] */
function mapApiResponse(grouped: { dayOfWeek: number; timeSlots: TimeSlot[] }[]): DayPricing[] {
  return DAY_OF_WEEK_MAP.map(({ day, dayLabel, dayOfWeek }) => {
    const found = grouped.find(g => g.dayOfWeek === dayOfWeek);
    return {
      day, dayLabel, dayOfWeek,
      timeSlots: found?.timeSlots ?? [],
    };
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AdminCourtPricing() {
  const [courtTypes, setCourtTypes] = useState<CourtType[]>([]);
  const [selectedType, setSelectedType] = useState("");
  const [allCourts, setAllCourts] = useState<Court[]>([]);
  const [selectedCourt, setSelectedCourt] = useState("");
  const [pricing, setPricing] = useState<DayPricing[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [bulking, setBulking] = useState(false);

  // Editing state: click vào ô → input
  const [editing, setEditing] = useState<{ day: string; slotIndex: number } | null>(null);
  const [editValue, setEditValue] = useState("");

  // Accordion collapse
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
    morning: false, afternoon: false, evening: false,
  });

  // Bulk update
  const [bulkDays, setBulkDays] = useState<string[]>([]);
  const [bulkFrom, setBulkFrom] = useState("06:00");
  const [bulkTo, setBulkTo] = useState("12:00");
  const [bulkPrice, setBulkPrice] = useState("");

  // ── Load court-types + tất cả sân khi mount
  useEffect(() => {
    Promise.all([
      api.get("/admin/court-types"),
      api.get("/admin/courts"),
    ]).then(([typesRes, courtsRes]) => {
      const types: CourtType[] = Array.isArray(typesRes.data) ? typesRes.data : typesRes.data.courtTypes ?? [];
      const courtList: Court[] = Array.isArray(courtsRes.data) ? courtsRes.data : courtsRes.data.courts ?? [];
      setCourtTypes(types);
      setAllCourts(courtList);
      // Chọn loại sân đầu tiên mặc định
      if (types.length > 0) setSelectedType(types[0]._id);
    }).catch(() => toast.error("Không thể tải dữ liệu."));
  }, []);

  // ── Lọc danh sách sân theo loại đã chọn
  const courts = selectedType
    ? allCourts.filter(c => {
        const typeId = typeof c.typeId === "object" ? c.typeId?._id : c.typeId;
        return typeId === selectedType;
      })
    : allCourts;

  // ── Khi loại sân thay đổi → tự chọn sân đầu tiên của loại đó
  useEffect(() => {
    if (courts.length > 0) {
      setSelectedCourt(courts[0]._id);
    } else {
      setSelectedCourt("");
      setPricing([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType]);

  // ── Load pricing khi chọn sân
  const fetchPricing = useCallback(async (courtId: string) => {
    if (!courtId) return;
    setLoading(true);
    try {
      const res = await api.get(`/admin/courts/${courtId}/pricing`);
      setPricing(mapApiResponse(res.data.data));
    } catch {
      toast.error("Không thể tải cấu hình giá.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedCourt) fetchPricing(selectedCourt);
  }, [selectedCourt, fetchPricing]);

  // ── Stats
  const allPrices = pricing.flatMap(p => p.timeSlots.map(s => s.price));
  const maxPrice  = allPrices.length ? Math.max(...allPrices) : 0;
  const avgPrice  = allPrices.length ? Math.round(allPrices.reduce((a, b) => a + b, 0) / allPrices.length) : 0;
  const peakCount = allPrices.filter(p => p >= 180000).length;

  // ── Edit ô giá (click → input)
  const startEdit = (day: string, slotIndex: number, price: number) => {
    setEditing({ day, slotIndex });
    setEditValue(String(price));
  };

  const commitEdit = () => {
    if (!editing) return;
    const price = parseInt(editValue) || 0;
    setPricing(prev =>
      prev.map(d => d.day === editing.day
        ? { ...d, timeSlots: d.timeSlots.map((s, i) => i === editing.slotIndex ? { ...s, price } : s) }
        : d
      )
    );
    setEditing(null);
  };

  // ── Lưu toàn bộ batch lên API
  const handleSave = async () => {
    if (!selectedCourt) return;
    setSaving(true);
    try {
      const slots = pricing.flatMap(day =>
        day.timeSlots.map(slot => ({
          dayOfWeek: day.dayOfWeek,
          startTime: slot.startTime,
          endTime:   slot.endTime,
          price:     slot.price,
        }))
      );
      await api.post(`/admin/courts/${selectedCourt}/pricing/batch`, { slots });
      toast.success("Đã lưu cấu hình giá thành công!", {
        description: `Sân: ${courts.find(c => c._id === selectedCourt)?.name}`,
      });
    } catch {
      toast.error("Lưu thất bại. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  // ── Khôi phục mặc định (reload từ DB)
  const handleReset = async () => {
    await fetchPricing(selectedCourt);
    toast.success("Đã khôi phục dữ liệu từ server.");
  };

  // ── Bulk update lên API
  const handleApplyBulk = async () => {
    if (!bulkPrice || bulkDays.length === 0) {
      toast.error("Vui lòng chọn ngày và nhập giá mới!");
      return;
    }
    if (bulkFrom >= bulkTo) {
      toast.error("Giờ bắt đầu phải nhỏ hơn giờ kết thúc!");
      return;
    }
    setBulking(true);
    try {
      const res = await api.post(`/admin/courts/${selectedCourt}/pricing/bulk`, {
        days:     bulkDays.map(d => DAY_TO_WEEK_NUM[d]),
        fromTime: bulkFrom,
        toTime:   bulkTo,
        price:    parseInt(bulkPrice),
      });
      toast.success(`Đã cập nhật ${res.data.updated} slots thành công!`);
      // Reload lại bảng giá sau khi bulk
      await fetchPricing(selectedCourt);
      setBulkDays([]);
      setBulkPrice("");
    } catch {
      toast.error("Cập nhật hàng loạt thất bại.");
    } finally {
      setBulking(false);
    }
  };

  // ── Copy nhanh
  const applyWeekdayPricing = async () => {
    const mon = pricing.find(p => p.day === "monday");
    if (!mon) return;
    setPricing(prev => prev.map(p =>
      ["tuesday", "wednesday", "thursday", "friday"].includes(p.day)
        ? { ...p, timeSlots: mon.timeSlots.map(s => ({ ...s })) } : p
    ));
    toast.info("Đã áp giá T.2 cho T.3–T.6 (chưa lưu, nhấn Lưu cấu hình để xác nhận)");
  };

  const applyWeekendPricing = () => {
    const sat = pricing.find(p => p.day === "saturday");
    if (!sat) return;
    setPricing(prev => prev.map(p =>
      p.day === "sunday" ? { ...p, timeSlots: sat.timeSlots.map(s => ({ ...s })) } : p
    ));
    toast.info("Đã áp giá T.7 cho CN (chưa lưu, nhấn Lưu cấu hình để xác nhận)");
  };

  const toggleBulkDay = (day: string) => {
    setBulkDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 pb-8">

      {/* ── Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Cấu hình giá giờ</h1>
          <p className="text-gray-500 mt-0.5 text-sm">Thiết lập giá theo ngày và khung giờ cho từng sân</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleReset} disabled={loading || saving} className="gap-1.5">
            <RotateCcw className="w-4 h-4" /> Khôi phục
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving || loading} className="gap-1.5 bg-blue-600 hover:bg-blue-700">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Đang lưu..." : "Lưu cấu hình"}
          </Button>
        </div>
      </div>

      {/* ── Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Giá cao nhất",  value: formatVND(maxPrice),  icon: TrendingUp, gradient: "from-rose-500 to-orange-500" },
          { label: "Giá trung bình",value: formatVND(avgPrice),  icon: DollarSign, gradient: "from-blue-500 to-cyan-500" },
          { label: "Giờ cao điểm",  value: allPrices.length ? `${peakCount} / ${allPrices.length}` : "–", icon: Clock, gradient: "from-violet-500 to-purple-600" },
        ].map(stat => (
          <div key={stat.label} className="relative overflow-hidden rounded-2xl p-5 bg-white border border-gray-100 shadow-sm">
            <div className={`absolute inset-0 opacity-[0.06] bg-gradient-to-br ${stat.gradient}`} />
            <div className="flex items-center gap-4 relative">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${stat.gradient} shadow-sm`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
                <p className="text-xl font-extrabold text-gray-900 mt-0.5 leading-tight">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Court Selector + Quick Actions + Legend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Court Select – 2 bước: Loại sân → Sân */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Chọn sân</label>
          {/* Bước 1: Loại sân */}
          <div>
            <p className="text-[11px] text-gray-400 mb-1.5 font-medium">① Loại sân</p>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              disabled={loading || courtTypes.length === 0}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 font-medium disabled:opacity-60"
            >
              {courtTypes.length === 0
                ? <option value="">Đang tải...</option>
                : courtTypes.map(t => <option key={t._id} value={t._id}>{t.icon ? `${t.icon} ` : ""}{t.name}</option>)
              }
            </select>
          </div>
          {/* Bước 2: Sân */}
          <div>
            <p className="text-[11px] text-gray-400 mb-1.5 font-medium">② Sân</p>
            <select
              value={selectedCourt}
              onChange={e => setSelectedCourt(e.target.value)}
              disabled={loading || courts.length === 0}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 font-medium disabled:opacity-60"
            >
              {courts.length === 0
                ? <option value="">Không có sân nào</option>
                : courts.map(c => <option key={c._id} value={c._id}>{c.name}</option>)
              }
            </select>
          </div>
        </div>

        {/* Quick Copy */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            <Copy className="w-3.5 h-3.5 inline mr-1" />Sao chép nhanh
          </label>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full gap-2 justify-start" onClick={applyWeekdayPricing} disabled={loading}>
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="text-sm">Áp dụng giá T.2 → T.3 đến T.6</span>
            </Button>
            <Button variant="outline" size="sm" className="w-full gap-2 justify-start" onClick={applyWeekendPricing} disabled={loading}>
              <Calendar className="w-4 h-4 text-violet-500" />
              <span className="text-sm">Áp dụng giá T.7 → Chủ nhật</span>
            </Button>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Chú thích màu</label>
          <div className="space-y-1.5">
            {[
              { label: "Bình thường (< 150k)",    cls: "bg-teal-50 text-teal-700 border-teal-200" },
              { label: "Trung bình (150k – 179k)", cls: "bg-blue-50 text-blue-700 border-blue-200" },
              { label: "Cao điểm (180k – 199k)",   cls: "bg-orange-50 text-orange-700 border-orange-200" },
              { label: "Rất cao (≥ 200k)",          cls: "bg-red-50 text-red-700 border-red-200" },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-2">
                <span className={`w-7 h-5 rounded border text-[40 px] flex items-center justify-center font-bold ${l.cls}`}>$</span>
                <span className="text-sm text-gray-600">{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bulk Update Panel */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-sm font-bold text-gray-900">Cập nhật giá hàng loạt</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Day pills */}
          <div>
            <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide block mb-2">Chọn ngày</label>
            <div className="flex flex-wrap gap-1.5">
              {/* Nút Tất cả */}
              {(() => {
                const ALL_DAYS = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
                const isAllSelected = ALL_DAYS.every(d => bulkDays.includes(d));
                return (
                  <button
                    onClick={() => setBulkDays(isAllSelected ? [] : ALL_DAYS)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-all ${
                      isAllSelected
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    Tất cả
                  </button>
                );
              })()}
              {["monday","tuesday","wednesday","thursday","friday","saturday","sunday"].map(d => (
                <button
                  key={d}
                  onClick={() => toggleBulkDay(d)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-all ${
                    bulkDays.includes(d)
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                  }`}
                >
                  {DAY_LABELS[d]}
                </button>
              ))}
            </div>
          </div>

          {/* From */}
          <div>
            <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide block mb-2">Từ giờ</label>
            <select value={bulkFrom} onChange={e => setBulkFrom(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">
              {TIME_OPTIONS.slice(0, -1).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* To */}
          <div>
            <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide block mb-2">
              <ArrowRight className="w-3 h-3 inline" /> Đến giờ
            </label>
            <select value={bulkTo} onChange={e => setBulkTo(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">
              {TIME_OPTIONS.slice(1).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Price + Apply */}
          <div>
            <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide block mb-2">Giá mới (VNĐ)</label>
            <div className="flex gap-2">
              <Input
                type="number" placeholder="VD: 180000"
                value={bulkPrice} onChange={e => setBulkPrice(e.target.value)}
                className="flex-1 text-sm h-9" step={10000} min={0}
              />
              <Button size="sm" onClick={handleApplyBulk} disabled={bulking || loading}
                className="bg-blue-600 hover:bg-blue-700 h-9 px-4 gap-1.5">
                {bulking ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                Áp dụng
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Loading skeleton */}
      {loading && (
        <div className="flex items-center justify-center py-16 gap-3 text-blue-500">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-sm font-medium">Đang tải cấu hình giá...</span>
        </div>
      )}

      {/* ── Pricing Grid (Accordion) */}
      {!loading && pricing.length > 0 && (
        <div className="space-y-3">
          {timeBlocks.map(block => {
            const isOpen = !collapsed[block.id];
            const BlockIcon = block.icon;

            // Lọc slots theo time range của block
            const allBlockSlots = pricing[0]?.timeSlots.filter(
              s => s.startTime >= block.slotStart && s.startTime < block.slotEnd
            ) ?? [];

            const allBlockPrices = pricing.flatMap(d =>
              d.timeSlots.filter(s => s.startTime >= block.slotStart && s.startTime < block.slotEnd).map(s => s.price)
            );
            const blockAvg = allBlockPrices.length
              ? allBlockPrices.reduce((a, b) => a + b, 0) / allBlockPrices.length
              : 0;

            const headerColors: Record<string, string> = {
              amber:  "from-amber-400 to-orange-400",
              sky:    "from-sky-400 to-blue-500",
              violet: "from-violet-500 to-purple-600",
            };
            const bgColors: Record<string, string> = {
              amber:  "bg-amber-50 border-amber-100",
              sky:    "bg-sky-50 border-sky-100",
              violet: "bg-violet-50 border-violet-100",
            };

            // Thứ tự hiển thị cột: T2 T3 T4 T5 T6 T7 CN
            const orderedPricing = DISPLAY_ORDER.map(dow => pricing.find(p => p.dayOfWeek === dow)!).filter(Boolean);

            return (
              <div key={block.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Block header */}
                <button
                  onClick={() => setCollapsed(prev => ({ ...prev, [block.id]: !prev[block.id] }))}
                  className={`w-full flex items-center justify-between px-5 py-3.5 ${bgColors[block.color]}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br ${headerColors[block.color]}`}>
                      <BlockIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <span className="font-bold text-gray-900 text-sm">{block.label}</span>
                      <span className="text-sm text-gray-500 ml-2">{block.range}</span>
                    </div>
                    {blockAvg > 0 && (
                      <Badge variant="outline" className="text-sm ml-2 border-gray-200 text-gray-500 bg-white">
                        TB: {formatK(blockAvg)}
                      </Badge>
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Grid table */}
                {isOpen && (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50/50">
                          <th className="px-4 py-2.5 text-left text-sm font-semibold text-gray-500 border-b border-gray-100 w-28">
                            Khung giờ
                          </th>
                          {orderedPricing.map(day => (
                            <th key={day.day}
                              className={`px-2 py-2.5 text-center text-sm font-bold border-b border-gray-100 min-w-[80px] ${
                                ["saturday", "sunday"].includes(day.day)
                                  ? "text-violet-700 bg-violet-50/60" : "text-gray-700"
                              }`}
                            >
                              {day.dayLabel}
                              {["saturday", "sunday"].includes(day.day) && (
                                <span className="block text-[9px] font-normal text-violet-400">Cuối tuần</span>
                              )}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {allBlockSlots.map((slot, localIdx) => (
                          <tr key={slot.startTime} className="hover:bg-gray-50/40 transition-colors border-b border-gray-50 last:border-b-0">
                            <td className="px-4 py-1.5 text-sm font-medium text-gray-600 whitespace-nowrap">
                              {slot.startTime} <span className="text-gray-400">–</span> {slot.endTime}
                            </td>
                            {orderedPricing.map(day => {
                              const slotIndex = day.timeSlots.findIndex(s => s.startTime === slot.startTime);
                              const price = slotIndex >= 0 ? day.timeSlots[slotIndex].price : 0;
                              const level = getPriceLevel(price);
                              const isEditingThis = editing?.day === day.day && editing?.slotIndex === slotIndex;
                              return (
                                <td key={day.day} className={`px-2 py-1.5 text-center ${
                                  ["saturday", "sunday"].includes(day.day) ? "bg-violet-50/20" : ""
                                }`}>
                                  {isEditingThis ? (
                                    <input
                                      autoFocus type="number"
                                      value={editValue}
                                      onChange={e => setEditValue(e.target.value)}
                                      onBlur={commitEdit}
                                      onKeyDown={e => { if (e.key === "Enter") commitEdit(); if (e.key === "Escape") setEditing(null); }}
                                      className="w-full px-2 py-1 text-sm text-center border border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-gray-900"
                                      step={10000}
                                    />
                                  ) : (
                                    <button
                                      onClick={() => slotIndex >= 0 && startEdit(day.day, slotIndex, price)}
                                      className={`w-full px-2 py-1.5 rounded-lg text-sm font-bold border transition-all ${priceLevelStyle[level]}`}
                                      title={formatVND(price)}
                                    >
                                      {formatK(price)}
                                    </button>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!loading && pricing.length === 0 && selectedCourt && (
        <div className="text-center py-16 text-gray-400">
          <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Chưa có dữ liệu cấu hình giá cho sân này.</p>
        </div>
      )}
    </div>
  );
}