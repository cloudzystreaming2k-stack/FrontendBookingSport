import { useState, useMemo, JSX } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
  MapPin, Star, Clock, ChevronLeft, ChevronRight, Shield,
  Zap, Check, Calendar, Users, Wifi, Car, Coffee, Wind,
  ChevronDown, ChevronUp, Info, MessageSquare, Share2, Heart, TicketPercent
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { mockCourts, mockReviews } from "../data/mockData";
import { toast } from "sonner";

// ── Mock time slots ─────────────────────────────────────────────────────────
const MOCK_SLOTS = [
  { time: "06:00", price: 120000, status: "available" },
  { time: "06:30", price: 120000, status: "booked" },
  { time: "07:00", price: 120000, status: "available" },
  { time: "07:30", price: 120000, status: "available" },
  { time: "08:00", price: 130000, status: "booked" },
  { time: "08:30", price: 130000, status: "available" },
  { time: "09:00", price: 130000, status: "available" },
  { time: "09:30", price: 130000, status: "available" },
  { time: "10:00", price: 130000, status: "booked" },
  { time: "10:30", price: 130000, status: "available" },
  { time: "11:00", price: 130000, status: "available" },
  { time: "11:30", price: 130000, status: "available" },
  { time: "12:00", price: 150000, status: "available" },
  { time: "11:30", price: 130000, status: "available" },
  { time: "12:00", price: 150000, status: "available" },
  { time: "12:30", price: 150000, status: "booked" },
  { time: "13:00", price: 150000, status: "available" },
  { time: "13:30", price: 150000, status: "available" },
  { time: "14:00", price: 150000, status: "available" },
  { time: "14:30", price: 160000, status: "available" },
  { time: "15:00", price: 160000, status: "booked" },
  { time: "15:30", price: 160000, status: "available" },
  { time: "16:00", price: 160000, status: "available" },
  { time: "16:30", price: 160000, status: "available" },
  { time: "17:00", price: 160000, status: "booked" },
  { time: "17:30", price: 160000, status: "available" },
  { time: "18:00", price: 180000, status: "available" },
  { time: "18:30", price: 180000, status: "available" },
  { time: "19:00", price: 200000, status: "available" },
  { time: "19:30", price: 200000, status: "booked" },
  { time: "20:00", price: 200000, status: "available" },
  { time: "20:30", price: 200000, status: "available" },
  { time: "21:00", price: 180000, status: "available" },
  { time: "21:30", price: 180000, status: "available" },
  { time: "22:00", price: 150000, status: "available" },
  { time: "22:30", price: 150000, status: "available" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function toLocalISO(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // 0 = Mon, 6 = Sun
  
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
  for(let i=1; i <= remainingDays; i++) {
    const d = new Date(year, month + 1, i);
    days.push({ date: d, dateNum: i, iso: toLocalISO(d), isCurrentMonth: false });
  }
  return days;
}

function formatDisplayDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const dayName = dayNames[d.getDay()];
  const dateNum = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${dayName} ${dateNum}/${month}`;
}

function getSlotEndTime(time: string) {
  let [h, m] = time.split(":").map(Number);
  m += 30;
  if (m >= 60) {
    h += 1;
    m -= 60;
  }
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

const facilityIcons: Record<string, JSX.Element> = {
  "Wifi": <Wifi className="w-4 h-4" />,
  "Bãi đỗ xe": <Car className="w-4 h-4" />,
  "Căn tin": <Coffee className="w-4 h-4" />,
  "Điều hòa": <Wind className="w-4 h-4" />,
  "default": <Check className="w-4 h-4" />,
};

export function CourtDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const court = mockCourts.find((c) => c.id === id);
  const courtReviews = mockReviews.filter((r) => r.courtId === id);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const days = useMemo(() => getCalendarDays(currentMonth.getFullYear(), currentMonth.getMonth()), [currentMonth]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDay, setSelectedDay] = useState(() => toLocalISO(new Date()));
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"info"|"pricing"|"reviews">("info");
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [liked, setLiked] = useState(false);

  // Discount states
  const [discountCodeInput, setDiscountCodeInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{code: string; percent: number} | null>(null);

  if (!court) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏟️</div>
          <h1 className="text-2xl font-bold mb-2 text-gray-900">Không tìm thấy sân</h1>
          <p className="text-gray-500 mb-6">Sân này có thể đã bị xóa hoặc không tồn tại.</p>
          <Link to="/courts">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">← Quay lại danh sách</Button>
          </Link>
        </div>
      </div>
    );
  }

  const toggleSlot = (time: string) => {
    const slot = MOCK_SLOTS.find(s => s.time === time);
    if (slot?.status === "booked") return;
    setSelectedSlots(prev =>
      prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
    );
  };

  const totalPrice = selectedSlots.reduce((sum, time) => {
    const slot = MOCK_SLOTS.find(s => s.time === time);
    return sum + (slot?.price ?? 0);
  }, 0);

  const discountAmount = appliedDiscount ? (totalPrice * appliedDiscount.percent) / 100 : 0;
  const finalPrice = totalPrice - discountAmount;

  const handleApplyDiscount = () => {
    if (!discountCodeInput.trim()) return;
    const code = discountCodeInput.trim().toUpperCase();
    if (code === "SPORT10") {
      setAppliedDiscount({ code, percent: 10 });
      toast.success("Áp dụng mã giảm giá 10% thành công!");
    } else if (code === "SPORT20") {
      setAppliedDiscount({ code, percent: 20 });
      toast.success("Áp dụng mã giảm giá 20% thành công!");
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

  const groupedSelectedSlots = useMemo(() => {
    if (selectedSlots.length === 0) return [];
    const sortedIndices = selectedSlots
      .map(time => MOCK_SLOTS.findIndex(s => s.time === time))
      .filter(i => i !== -1)
      .sort((a, b) => a - b);
      
    const groups = [];
    let currentGroup = { 
      startIdx: sortedIndices[0], 
      endIdx: sortedIndices[0], 
      price: MOCK_SLOTS[sortedIndices[0]].price 
    };

    for (let i = 1; i < sortedIndices.length; i++) {
      const idx = sortedIndices[i];
      if (idx === currentGroup.endIdx + 1) {
        currentGroup.endIdx = idx;
        currentGroup.price += MOCK_SLOTS[idx].price;
      } else {
        groups.push({
          startTime: MOCK_SLOTS[currentGroup.startIdx].time,
          endTime: getSlotEndTime(MOCK_SLOTS[currentGroup.endIdx].time),
          price: currentGroup.price
        });
        currentGroup = { startIdx: idx, endIdx: idx, price: MOCK_SLOTS[idx].price };
      }
    }
    groups.push({
      startTime: MOCK_SLOTS[currentGroup.startIdx].time,
      endTime: getSlotEndTime(MOCK_SLOTS[currentGroup.endIdx].time),
      price: currentGroup.price
    });
    return groups;
  }, [selectedSlots]);

  const nextImage = () => setCurrentImageIndex(prev => (prev + 1) % court.images.length);
  const prevImage = () => setCurrentImageIndex(prev => (prev - 1 + court.images.length) % court.images.length);

  return (
    <div className="min-h-screen bg-[#f4f8fb] pb-12">
      {/* ── Hero Gallery ───────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative w-full h-[320px] lg:h-[460px] bg-gray-900 rounded-3xl overflow-hidden shadow-md">
        <img
          src={court.images[currentImageIndex]}
          alt={court.name}
          className="w-full h-full object-cover transition-opacity duration-500"
        />
        {/* Dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Nav arrows */}
        {court.images.length > 1 && (
          <>
            <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/40 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/40 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-24 right-4 flex gap-1.5">
              {court.images.map((_, i) => (
                <button key={i} onClick={() => setCurrentImageIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${i === currentImageIndex ? "w-6 bg-white" : "w-1.5 bg-white/50"}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Bottom info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between">
              <div>
                <Link to="/courts" className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-base mb-3 transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Danh sách sân
                </Link>
                <h1 className="text-3xl lg:text-4xl font-black text-white leading-tight mb-2 drop-shadow-md">
                  {court.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5 text-white/90">
                    <MapPin className="w-4 h-4 text-blue-300" />
                    <span className="text-base font-medium">{court.address}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-white font-bold text-base">{court.rating}</span>
                    <span className="text-white/70 text-base">({court.reviewCount})</span>
                  </div>
                  <Badge className="bg-green-500/30 text-green-200 border-green-400/30 backdrop-blur-sm text-base">
                    ✓ Xác nhận ngay
                  </Badge>
                </div>
              </div>
              {/* Action buttons */}
              <div className="hidden lg:flex items-center gap-2">
                <button onClick={() => setLiked(!liked)}
                  className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                  <Heart className={`w-5 h-5 ${liked ? "fill-red-400 text-red-400" : "text-white"}`} />
                </button>
                <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                  <Share2 className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* ── Thumbnail strip ──────────────────────────────────────────────── */}
      {court.images.length > 1 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {court.images.map((img, i) => (
              <button key={i} onClick={() => setCurrentImageIndex(i)}
                className={`relative shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors ${i === currentImageIndex ? "border-blue-500" : "border-transparent"}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">

          {/* ── LEFT COLUMN ─────────────────────────────────────────────── */}
          <div className="space-y-6">

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Mở cửa", value: `${court.openTime ?? "06:00"} – ${court.closeTime ?? "22:00"}`, icon: <Clock className="w-5 h-5 text-blue-500" /> },
                { label: "Sức chứa", value: `${court.capacity ?? 4} người`, icon: <Users className="w-5 h-5 text-violet-500" /> },
                { label: "Từ", value: `${court.pricing.morning.toLocaleString()}đ`, icon: <Zap className="w-5 h-5 text-orange-500" /> },
              ].map(({ label, value, icon }) => (
                <div key={label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">{icon}</div>
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
                    <p className="text-[13px] font-bold text-gray-900 leading-tight">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Booking Panel ───────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-50">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" /> Chọn ngày & giờ
                </h2>
                <p className="text-base text-gray-400 mt-0.5">Click vào ô trống để chọn khung giờ mong muốn</p>
              </div>

              {/* Day selector */}
              <div className="p-5 sm:p-6 border-b border-gray-50">
                <div className="w-full">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-4 px-1">
                     <h3 className="font-bold text-gray-900 capitalize text-base">
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

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1.5 sm:gap-2 md:gap-3">
                    {/* Weekdays */}
                    {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map(d => (
                      <div key={d} className="text-center text-xs font-bold text-gray-400 mb-2 py-1">
                        {d}
                      </div>
                    ))}
                    {/* Days */}
                    {days.map(d => {
                      const isSelected = selectedDay === d.iso;
                      const isToday = toLocalISO(new Date()) === d.iso;
                      
                      // Check validation (VD: không được chọn ngày trong quá khứ)
                      const isPast = d.iso < toLocalISO(new Date());

                      return (
                        <button
                          key={d.iso}
                          disabled={isPast}
                          onClick={() => { setSelectedDay(d.iso); setSelectedSlots([]); }}
                          className={`h-12 sm:h-14 md:h-[68px] flex flex-col items-center justify-center rounded-xl text-sm font-semibold transition-all relative ${
                            isSelected ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
                            : isPast ? "text-gray-300 bg-gray-50/50 cursor-not-allowed"
                            : isToday ? "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                            : d.isCurrentMonth ? "bg-white text-gray-700 hover:bg-gray-100 border border-gray-100 hover:border-gray-200" 
                            : "bg-white text-gray-400 hover:bg-gray-50 border border-transparent"
                          }`}
                        >
                          {d.dateNum}
                          {isToday && !isSelected && <span className="absolute bottom-1 w-1 h-1 rounded-full bg-blue-600"></span>}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Time slot grid */}
              <div className="p-5">
                {/* Legend */}
                <div className="flex items-center gap-4 mb-4 text-base text-gray-500">
                  <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded bg-white border-2 border-gray-200" />Còn trống</div>
                  <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded bg-blue-600 border-2 border-blue-600" />Đã chọn</div>
                  <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded bg-gray-100 border-2 border-gray-200" />Đã đặt</div>
                </div>

                {/* Slots by session */}
                {[
                  { label: "🌅 Buổi sáng", range: ["06:00", "12:00"], color: "text-amber-600" },
                  { label: "☀️ Buổi chiều", range: ["12:00", "18:00"], color: "text-orange-600" },
                  { label: "🌙 Buổi tối", range: ["18:00", "23:00"], color: "text-violet-600" },
                ].map(session => {
                  const sessionSlots = MOCK_SLOTS.filter(
                    s => s.time >= session.range[0] && s.time < session.range[1]
                  );
                  return (
                    <div key={session.label} className="mb-5">
                      <p className={`text-base font-bold mb-2 ${session.color}`}>{session.label}</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                        {sessionSlots.map(slot => {
                          const isSelected = selectedSlots.includes(slot.time);
                          const isBooked = slot.status === "booked";
                          return (
                            <button
                              key={slot.time}
                              disabled={isBooked}
                              onClick={() => toggleSlot(slot.time)}
                              className={`relative flex flex-col items-center py-3 rounded-xl border-2 text-center transition-all group ${
                                isBooked
                                  ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                                  : isSelected
                                  ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200 scale-[1.02]"
                                  : "bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50 cursor-pointer"
                              }`}
                            >
                              <span className="font-bold text-[13px] tracking-tight whitespace-nowrap">
                                {slot.time} - {getSlotEndTime(slot.time)}
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
                })}
              </div>
            </div>

            {/* ── Tabs: Info / Reviews ─────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex border-b border-gray-100">
                {(["info", "pricing", "reviews"] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 text-base font-semibold transition-colors border-b-2 ${
                      activeTab === tab
                        ? "text-blue-600 border-blue-600"
                        : "text-gray-500 border-transparent hover:text-gray-700"
                    }`}
                  >
                    {tab === "info" && <><Info className="w-4 h-4 inline mr-1" />Thông tin</>}
                    {tab === "pricing" && <><Zap className="w-4 h-4 inline mr-1" />Bảng giá</>}
                    {tab === "reviews" && <><MessageSquare className="w-4 h-4 inline mr-1" />Đánh giá ({courtReviews.length})</>}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === "info" && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Mô tả</h3>
                      <p className="text-gray-600 text-base leading-relaxed">{court.description}</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-3">Tiện nghi</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {court.facilities.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl text-base text-gray-700 font-medium">
                            <span className="text-blue-500">{facilityIcons[f] ?? facilityIcons.default}</span>
                            {f}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-3">Quy định sân</h3>
                      <ul className="space-y-2">
                        {[
                          "Có mặt trước giờ đặt ít nhất 5 phút",
                          "Không mặc quần áo chứa đinh hoặc kim loại sắc nhọn",
                          "Hủy miễn phí trước 24 giờ",
                          "Mang theo QR Code khi vào sân",
                        ].map((rule, i) => (
                          <li key={i} className="flex items-start gap-2 text-base text-gray-600">
                            <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                            {rule}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === "pricing" && (
                  <div className="space-y-3">
                    {[
                      { label: "Buổi sáng", range: "06:00 – 12:00", price: court.pricing.morning, color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-100" },
                      { label: "Buổi chiều", range: "12:00 – 18:00", price: court.pricing.afternoon, color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-100" },
                      { label: "Buổi tối", range: "18:00 – 22:00", price: court.pricing.evening, color: "text-violet-700", bg: "bg-violet-50", border: "border-violet-100" },
                    ].map(p => (
                      <div key={p.label} className={`${p.bg} ${p.border} border rounded-2xl p-4 flex items-center justify-between`}>
                        <div>
                          <p className={`font-bold text-base ${p.color}`}>{p.label}</p>
                          <p className="text-base text-gray-500 mt-0.5">{p.range}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-xl font-black ${p.color}`}>{p.price.toLocaleString()}<span className="text-base font-medium ml-0.5">đ</span></p>
                          <p className="text-base text-gray-400">/ 30 phút</p>
                        </div>
                      </div>
                    ))}
                    <p className="text-base text-gray-400 text-center mt-2">* Giá có thể thay đổi theo ngày đặc biệt</p>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-4">
                    {/* Rating summary */}
                    <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-2xl mb-4">
                      <div className="text-center">
                        <p className="text-5xl font-black text-gray-900">{court.rating}</p>
                        <div className="flex gap-0.5 mt-1">
                          {[1,2,3,4,5].map(i => (
                            <Star key={i} className={`w-4 h-4 ${i <= Math.round(court.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                          ))}
                        </div>
                        <p className="text-base text-gray-400 mt-1">{court.reviewCount} đánh giá</p>
                      </div>
                      <div className="flex-1 space-y-1.5">
                        {[5,4,3,2,1].map(star => (
                          <div key={star} className="flex items-center gap-2">
                            <span className="text-base text-gray-400 w-3">{star}</span>
                            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-yellow-400 rounded-full"
                                style={{ width: `${star === 5 ? 65 : star === 4 ? 20 : star === 3 ? 10 : 5}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {(showAllReviews ? courtReviews : courtReviews.slice(0, 3)).map(review => (
                      <div key={review.id} className="border-b border-gray-50 pb-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-base shrink-0">
                            {review.userName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-base text-gray-900">{review.userName}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              {[1,2,3,4,5].map(i => (
                                <Star key={i} className={`w-3 h-3 ${i <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                              ))}
                              <span className="text-base text-gray-400 ml-1">{new Date(review.createdAt).toLocaleDateString("vi-VN")}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-base text-gray-600 leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                    {courtReviews.length > 3 && (
                      <button onClick={() => setShowAllReviews(!showAllReviews)}
                        className="w-full flex items-center justify-center gap-1.5 py-2 text-base font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                        {showAllReviews ? <><ChevronUp className="w-4 h-4" />Thu gọn</> : <><ChevronDown className="w-4 h-4" />Xem tất cả {courtReviews.length} đánh giá</>}
                      </button>
                    )}
                    {courtReviews.length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        <p>Chưa có đánh giá nào</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN — Sticky Booking Summary ───────────────────── */}
          <div className="lg:sticky lg:top-[76px]">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
              {/* Header */}
              <div className="p-5 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                <p className="text-base font-bold uppercase tracking-widest text-blue-200 mb-1">Đặt sân</p>
                <h3 className="text-xl font-black leading-tight">{court.name}</h3>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-base">{court.rating}</span>
                  <span className="text-blue-200 text-base">· {court.reviewCount} đánh giá</span>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Selected summary */}
                {selectedSlots.length > 0 ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-gray-500 font-medium text-sm">
                        <Calendar className="w-4 h-4" /> Ngày đã chọn
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 px-4 font-semibold text-gray-900 border border-gray-100/80">
                        {formatDisplayDate(selectedDay)}, {new Date(selectedDay).getFullYear()}
                      </div>
                    </div>

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
                    
                    <div className="bg-blue-50/50 rounded-xl p-4 space-y-2 border border-blue-100/50">
                      <div className="flex justify-between text-base">
                        <span className="text-gray-500 font-medium">Số slot</span>
                        <span className="font-bold text-gray-900">{selectedSlots.length} × 30 phút</span>
                      </div>

                    {/* Tiền trước khi giảm (chỉ hiện nếu có mã) */}
                    {appliedDiscount && (
                      <div className="flex justify-between text-base">
                        <span className="text-gray-500 font-medium">Tạm tính</span>
                        <span className="font-bold text-gray-900">{totalPrice.toLocaleString()}đ</span>
                      </div>
                    )}

                    {/* Dòng giảm giá */}
                    {appliedDiscount && (
                      <div className="flex justify-between text-base text-green-600">
                        <span className="font-medium flex items-center gap-1">
                          <TicketPercent className="w-4 h-4" /> Mã ({appliedDiscount.code})
                        </span>
                        <span className="font-bold">- {discountAmount.toLocaleString()}đ</span>
                      </div>
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
                  onClick={() => {
                    if (!selectedSlots.length) { toast.error("Vui lòng chọn ít nhất 1 khung giờ."); return; }
                    const bookingId = `BK${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
                    const payload = {
                      courtName: court.name,
                      date: formatDisplayDate(selectedDay),
                      time: groupedSelectedSlots.map(g => `${g.startTime} - ${g.endTime}`).join(', '),
                      hours: selectedSlots.length * 0.5,
                      totalPrice: finalPrice,
                      discountAmount: discountAmount,
                      originalPrice: totalPrice
                    };
                    navigate(`/payment/${bookingId}`, { state: payload });
                  }}
                  className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-200 hover:shadow-xl transition-all hover:-translate-y-0.5"
                >
                  {selectedSlots.length > 0 ? `Đặt ngay · ${finalPrice.toLocaleString()}đ` : "Chọn khung giờ"}
                </Button>

                {/* Trust signals */}
                <div className="space-y-2">
                  {[
                    { icon: <Zap className="w-3.5 h-3.5 text-green-500" />, label: "Xác nhận tức thì" },
                    { icon: <Shield className="w-3.5 h-3.5 text-blue-500" />, label: "Thanh toán bảo mật" },
                    { icon: <Check className="w-3.5 h-3.5 text-purple-500" />, label: "Hủy miễn phí trước 24h" },
                  ].map(({ icon, label }) => (
                    <div key={label} className="flex items-center gap-2 text-base text-gray-500">
                      {icon} {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
