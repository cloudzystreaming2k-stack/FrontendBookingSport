import { useState } from "react";
import {
  Clock, Copy, Save, RotateCcw, Calendar, TrendingUp,
  ChevronDown, Zap, ArrowRight, Sun, Sunset, Moon, DollarSign,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { toast } from "sonner";

interface TimeSlot {
  startTime: string;
  endTime: string;
  price: number;
}

interface DayPricing {
  day: string;
  dayLabel: string;
  timeSlots: TimeSlot[];
}

const defaultTimeSlots: TimeSlot[] = [
  { startTime: "06:00", endTime: "06:30", price: 100000 },
  { startTime: "06:30", endTime: "07:00", price: 100000 },
  { startTime: "07:00", endTime: "07:30", price: 110000 },
  { startTime: "07:30", endTime: "08:00", price: 110000 },
  { startTime: "08:00", endTime: "08:30", price: 120000 },
  { startTime: "08:30", endTime: "09:00", price: 120000 },
  { startTime: "09:00", endTime: "09:30", price: 130000 },
  { startTime: "09:30", endTime: "10:00", price: 130000 },
  { startTime: "10:00", endTime: "10:30", price: 150000 },
  { startTime: "10:30", endTime: "11:00", price: 150000 },
  { startTime: "11:00", endTime: "11:30", price: 150000 },
  { startTime: "11:30", endTime: "12:00", price: 150000 },
  { startTime: "12:00", endTime: "12:30", price: 120000 },
  { startTime: "12:30", endTime: "13:00", price: 120000 },
  { startTime: "13:00", endTime: "13:30", price: 120000 },
  { startTime: "13:30", endTime: "14:00", price: 120000 },
  { startTime: "14:00", endTime: "14:30", price: 150000 },
  { startTime: "14:30", endTime: "15:00", price: 150000 },
  { startTime: "15:00", endTime: "15:30", price: 160000 },
  { startTime: "15:30", endTime: "16:00", price: 160000 },
  { startTime: "16:00", endTime: "16:30", price: 180000 },
  { startTime: "16:30", endTime: "17:00", price: 180000 },
  { startTime: "17:00", endTime: "17:30", price: 190000 },
  { startTime: "17:30", endTime: "18:00", price: 190000 },
  { startTime: "18:00", endTime: "18:30", price: 200000 },
  { startTime: "18:30", endTime: "19:00", price: 200000 },
  { startTime: "19:00", endTime: "19:30", price: 210000 },
  { startTime: "19:30", endTime: "20:00", price: 210000 },
  { startTime: "20:00", endTime: "20:30", price: 200000 },
  { startTime: "20:30", endTime: "21:00", price: 200000 },
  { startTime: "21:00", endTime: "21:30", price: 180000 },
  { startTime: "21:30", endTime: "22:00", price: 180000 },
  { startTime: "22:00", endTime: "22:30", price: 150000 },
  { startTime: "22:30", endTime: "23:00", price: 150000 },
];

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const DAY_LABELS: Record<string, string> = {
  monday: "T.2", tuesday: "T.3", wednesday: "T.4",
  thursday: "T.5", friday: "T.6", saturday: "T.7", sunday: "CN",
};

const timeBlocks = [
  { id: "morning", label: "Buổi Sáng", range: "06:00 – 12:00", icon: Sun,    color: "amber",   slotRange: [0, 12]  },
  { id: "afternoon",label: "Buổi Chiều",range: "12:00 – 18:00",icon: Sunset,  color: "sky",     slotRange: [12, 24] },
  { id: "evening",  label: "Buổi Tối", range: "18:00 – 23:00", icon: Moon,   color: "violet",  slotRange: [24, 34] },
];

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

export function AdminCourtPricing() {
  const [selectedCourt, setSelectedCourt] = useState("1");
  const [pricing, setPricing] = useState<DayPricing[]>([
    { day: "monday",    dayLabel: "Thứ 2",    timeSlots: defaultTimeSlots.map(s => ({ ...s })) },
    { day: "tuesday",   dayLabel: "Thứ 3",    timeSlots: defaultTimeSlots.map(s => ({ ...s })) },
    { day: "wednesday", dayLabel: "Thứ 4",    timeSlots: defaultTimeSlots.map(s => ({ ...s })) },
    { day: "thursday",  dayLabel: "Thứ 5",    timeSlots: defaultTimeSlots.map(s => ({ ...s })) },
    { day: "friday",    dayLabel: "Thứ 6",    timeSlots: defaultTimeSlots.map(s => ({ ...s })) },
    { day: "saturday",  dayLabel: "Thứ 7",    timeSlots: defaultTimeSlots.map(s => ({ ...s, price: Math.round(s.price * 1.2) })) },
    { day: "sunday",    dayLabel: "Chủ nhật", timeSlots: defaultTimeSlots.map(s => ({ ...s, price: Math.round(s.price * 1.2) })) },
  ]);

  // Editing state: {day, slotIndex} or null
  const [editing, setEditing] = useState<{ day: string; slotIndex: number } | null>(null);
  const [editValue, setEditValue] = useState("");

  // Collapsed blocks
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
    morning: false, afternoon: false, evening: false,
  });

  // Bulk update
  const [bulkDays, setBulkDays] = useState<string[]>([]);
  const [bulkFrom, setBulkFrom] = useState("06:00");
  const [bulkTo, setBulkTo] = useState("12:00");
  const [bulkPrice, setBulkPrice] = useState("");

  const courts = [
    { id: "1", name: "Sân Pickleball #1" },
    { id: "2", name: "Sân Pickleball #2" },
    { id: "3", name: "Sân Cầu lông #1" },
    { id: "4", name: "Sân Bóng rổ #1" },
  ];

  const timeOptions = defaultTimeSlots.map(s => s.startTime).concat(["23:00"]);

  // ─── handlers ────────────────────────────────────────────────────────────────

  const startEdit = (day: string, slotIndex: number, price: number) => {
    setEditing({ day, slotIndex });
    setEditValue(String(price));
  };

  const commitEdit = () => {
    if (!editing) return;
    const price = parseInt(editValue) || 0;
    setPricing(prev =>
      prev.map(d =>
        d.day === editing.day
          ? { ...d, timeSlots: d.timeSlots.map((s, i) => i === editing.slotIndex ? { ...s, price } : s) }
          : d
      )
    );
    setEditing(null);
  };

  const toggleBulkDay = (day: string) => {
    setBulkDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const applyBulkPricing = () => {
    if (!bulkPrice || bulkDays.length === 0) {
      toast.error("Vui lòng chọn ngày và nhập giá mới!");
      return;
    }
    const price = parseInt(bulkPrice);
    setPricing(prev =>
      prev.map(d => {
        if (!bulkDays.includes(d.day)) return d;
        return {
          ...d,
          timeSlots: d.timeSlots.map((s, i) => {
            const defaultSlot = defaultTimeSlots[i];
            const inRange = defaultSlot.startTime >= bulkFrom && defaultSlot.startTime < bulkTo;
            return inRange ? { ...s, price } : s;
          }),
        };
      })
    );
    toast.success(`Đã cập nhật giá ${formatVND(price)} cho ${bulkDays.length} ngày (${bulkFrom} – ${bulkTo})`);
    setBulkDays([]);
    setBulkPrice("");
  };

  const applyWeekdayPricing = () => {
    const mon = pricing.find(p => p.day === "monday");
    if (!mon) return;
    setPricing(prev => prev.map(p =>
      ["tuesday", "wednesday", "thursday", "friday"].includes(p.day)
        ? { ...p, timeSlots: [...mon.timeSlots] } : p
    ));
    toast.success("Đã áp dụng giá T.2 cho T.3 – T.6");
  };

  const applyWeekendPricing = () => {
    const sat = pricing.find(p => p.day === "saturday");
    if (!sat) return;
    setPricing(prev => prev.map(p =>
      p.day === "sunday" ? { ...p, timeSlots: [...sat.timeSlots] } : p
    ));
    toast.success("Đã áp dụng giá T.7 cho Chủ nhật");
  };

  const handleSave = () => {
    toast.success("Đã lưu cấu hình giá thành công!", {
      description: `Sân: ${courts.find(c => c.id === selectedCourt)?.name}`,
    });
  };

  const resetToDefault = () => {
    setPricing([
      { day: "monday",    dayLabel: "Thứ 2",    timeSlots: defaultTimeSlots.map(s => ({ ...s })) },
      { day: "tuesday",   dayLabel: "Thứ 3",    timeSlots: defaultTimeSlots.map(s => ({ ...s })) },
      { day: "wednesday", dayLabel: "Thứ 4",    timeSlots: defaultTimeSlots.map(s => ({ ...s })) },
      { day: "thursday",  dayLabel: "Thứ 5",    timeSlots: defaultTimeSlots.map(s => ({ ...s })) },
      { day: "friday",    dayLabel: "Thứ 6",    timeSlots: defaultTimeSlots.map(s => ({ ...s })) },
      { day: "saturday",  dayLabel: "Thứ 7",    timeSlots: defaultTimeSlots.map(s => ({ ...s, price: Math.round(s.price * 1.2) })) },
      { day: "sunday",    dayLabel: "Chủ nhật", timeSlots: defaultTimeSlots.map(s => ({ ...s, price: Math.round(s.price * 1.2) })) },
    ]);
    toast.success("Đã khôi phục cấu hình mặc định");
  };

  // ─── Stats ───────────────────────────────────────────────────────────────────
  const allPrices = pricing.flatMap(p => p.timeSlots.map(s => s.price));
  const maxPrice   = Math.max(...allPrices);
  const avgPrice   = Math.round(allPrices.reduce((a, b) => a + b, 0) / allPrices.length);
  const peakCount  = allPrices.filter(p => p >= 180000).length;

  // ─── render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 pb-8">

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Cấu hình giá giờ</h1>
          <p className="text-gray-500 mt-0.5 text-sm">Thiết lập giá theo ngày và khung giờ cho từng sân</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={resetToDefault} className="gap-1.5">
            <RotateCcw className="w-4 h-4" /> Khôi phục
          </Button>
          <Button size="sm" onClick={handleSave} className="gap-1.5 bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4" /> Lưu cấu hình
          </Button>
        </div>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Giá cao nhất", value: formatVND(maxPrice), icon: TrendingUp, gradient: "from-rose-500 to-orange-500" },
          { label: "Giá trung bình", value: formatVND(avgPrice), icon: DollarSign, gradient: "from-blue-500 to-cyan-500" },
          { label: "Giờ cao điểm", value: `${peakCount} / ${allPrices.length}`, icon: Clock, gradient: "from-violet-500 to-purple-600" },
        ].map(stat => (
          <div
            key={stat.label}
            className="relative overflow-hidden rounded-2xl p-5 bg-white border border-gray-100 shadow-sm"
          >
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

      {/* ── Court Selector + Quick Actions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Court Select */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Chọn sân</label>
          <select
            value={selectedCourt}
            onChange={e => setSelectedCourt(e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 font-medium"
          >
            {courts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {/* Quick copy */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            <Copy className="w-3.5 h-3.5 inline mr-1" />Sao chép nhanh
          </label>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full gap-2 justify-start" onClick={applyWeekdayPricing}>
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="text-sm">Áp dụng giá T.2 → T.3 đến T.6</span>
            </Button>
            <Button variant="outline" size="sm" className="w-full gap-2 justify-start" onClick={applyWeekendPricing}>
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
              { label: "Bình thường (< 150k)", cls: "bg-teal-50 text-teal-700 border-teal-200" },
              { label: "Trung bình (150k – 179k)", cls: "bg-blue-50 text-blue-700 border-blue-200" },
              { label: "Cao điểm (180k – 199k)", cls: "bg-orange-50 text-orange-700 border-orange-200" },
              { label: "Rất cao (≥ 200k)", cls: "bg-red-50 text-red-700 border-red-200" },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-2">
                <span className={`w-7 h-5 rounded border text-[10px] flex items-center justify-center font-bold ${l.cls}`}>A</span>
                <span className="text-sm text-gray-600">{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bulk Update Panel ── */}
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
              {DAYS.map(d => (
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

          {/* Time range */}
          <div>
            <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide block mb-2">Từ giờ</label>
            <select
              value={bulkFrom}
              onChange={e => setBulkFrom(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {timeOptions.slice(0, -1).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide block mb-2">
              <ArrowRight className="w-3 h-3 inline" /> Đến giờ
            </label>
            <select
              value={bulkTo}
              onChange={e => setBulkTo(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {timeOptions.slice(1).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Price input + apply */}
          <div>
            <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide block mb-2">Giá mới (VNĐ)</label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="VD: 180000"
                value={bulkPrice}
                onChange={e => setBulkPrice(e.target.value)}
                className="flex-1 text-sm h-9"
                step={10000}
                min={0}
              />
              <Button size="sm" onClick={applyBulkPricing} className="bg-blue-600 hover:bg-blue-700 h-9 px-4">
                Áp dụng
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Pricing Grid (Accordion by time block) ── */}
      <div className="space-y-3">
        {timeBlocks.map(block => {
          const slots = defaultTimeSlots.slice(block.slotRange[0], block.slotRange[1]);
          const isOpen = !collapsed[block.id];
          const blockAvg = pricing
            .flatMap(d => d.timeSlots.slice(block.slotRange[0], block.slotRange[1]).map(s => s.price))
            .reduce((a, b) => a + b, 0) / (pricing.length * slots.length);

          const BlockIcon = block.icon;
          const headerColors: Record<string, string> = {
            amber:  "from-amber-400 to-orange-400",
            sky:    "from-sky-400 to-blue-500",
            violet: "from-violet-500 to-purple-600",
          };
          const bgColors: Record<string, string> = {
            amber: "bg-amber-50 border-amber-100",
            sky: "bg-sky-50 border-sky-100",
            violet: "bg-violet-50 border-violet-100",
          };

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
                  <Badge variant="outline" className="text-sm ml-2 border-gray-200 text-gray-500 bg-white">
                    TB: {formatK(blockAvg)}
                  </Badge>
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
                        {pricing.map(day => (
                          <th
                            key={day.day}
                            className={`px-2 py-2.5 text-center text-sm font-bold border-b border-gray-100 min-w-[80px] ${
                              ["saturday", "sunday"].includes(day.day)
                                ? "text-violet-700 bg-violet-50/60"
                                : "text-gray-700"
                            }`}
                          >
                            {DAY_LABELS[day.day]}
                            {["saturday", "sunday"].includes(day.day) && (
                              <span className="block text-[9px] font-normal text-violet-400">Cuối tuần</span>
                            )}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {slots.map((slot, localIdx) => {
                        const globalIdx = block.slotRange[0] + localIdx;
                        return (
                          <tr key={globalIdx} className="hover:bg-gray-50/40 transition-colors border-b border-gray-50 last:border-b-0">
                            <td className="px-4 py-1.5 text-sm font-medium text-gray-600 whitespace-nowrap">
                              {slot.startTime} <span className="text-gray-400">–</span> {slot.endTime}
                            </td>
                            {pricing.map((day, dayIdx) => {
                              const price = day.timeSlots[globalIdx]?.price ?? 0;
                              const level = getPriceLevel(price);
                              const isEditingThis = editing?.day === day.day && editing?.slotIndex === globalIdx;
                              return (
                                <td key={day.day} className={`px-2 py-1.5 text-center ${
                                  ["saturday", "sunday"].includes(day.day) ? "bg-violet-50/20" : ""
                                }`}>
                                  {isEditingThis ? (
                                    <input
                                      autoFocus
                                      type="number"
                                      value={editValue}
                                      onChange={e => setEditValue(e.target.value)}
                                      onBlur={commitEdit}
                                      onKeyDown={e => { if (e.key === "Enter") commitEdit(); if (e.key === "Escape") setEditing(null); }}
                                      className="w-full px-2 py-1 text-sm text-center border border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-gray-900"
                                      step={10000}
                                    />
                                  ) : (
                                    <button
                                      onClick={() => startEdit(day.day, globalIdx, price)}
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
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}