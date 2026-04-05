import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
  ChevronLeft, ChevronRight, Clock,
  Heart, MapPin, Share2, Star, Users, Zap,
} from "lucide-react";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";

import { useCourtDetail, formatDisplayDate } from "./CourtDetail/useCourtDetail";
import { BookingPanel, BookingSummary } from "./CourtDetail/BookingPanel";
import { CourtInfoTabs } from "./CourtDetail/CourtInfoTabs";

// ── Skeleton ──────────────────────────────────────────────────────────────────
function CourtDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#f4f8fb] pb-12 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="w-full h-[320px] lg:h-[460px] bg-gray-200 rounded-3xl" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-gray-200 rounded-2xl" />)}
            </div>
            <div className="h-64 bg-gray-200 rounded-2xl" />
            <div className="h-96 bg-gray-200 rounded-2xl" />
          </div>
          <div className="h-80 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

// ── Not Found ─────────────────────────────────────────────────────────────────
function CourtNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🏟️</div>
        <h1 className="text-2xl font-bold mb-2 text-gray-900">Không tìm thấy sân</h1>
        <p className="text-gray-500 mb-6">Sân này có thể đã bị xóa hoặc không tồn tại.</p>
        <Link to="/courts" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
          ← Quay lại danh sách
        </Link>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export function CourtDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ── Custom hook — toàn bộ state & logic ─────────────────────────────────
  const {
    court, slots, courtReviews,
    isLoadingCourt, isLoadingSlots,
    currentMonth, setCurrentMonth, days,
    selectedDay, setSelectedDay,
    selectedSlots, toggleSlot,
    discountCodeInput, setDiscountCodeInput,
    appliedDiscount, handleApplyDiscount, handleRemoveDiscount,
    totalPrice, discountAmount, finalPrice, groupedSelectedSlots,
  } = useCourtDetail(id);

  // ── Image gallery state (local, không cần hook) ──────────────────────────
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);

  // ── Early returns ────────────────────────────────────────────────────────
  if (isLoadingCourt) return <CourtDetailSkeleton />;
  if (!court) return <CourtNotFound />;

  // ── Booking handler ──────────────────────────────────────────────────────
  const handleBook = () => {
    if (!selectedSlots.length) {
      toast.error("Vui lòng chọn ít nhất 1 khung giờ.");
      return;
    }
    const bookingId = `BK${Math.floor(Math.random() * 1_000_000).toString().padStart(6, "0")}`;
    const payload = {
      courtId: court._id,
      courtName: court.name,
      date: formatDisplayDate(selectedDay),
      time: groupedSelectedSlots.map((g) => `${g.startTime} - ${g.endTime}`).join(", "),
      hours: selectedSlots.length * 0.5,
      totalPrice: finalPrice,
      discountAmount,
      originalPrice: totalPrice,
    };
    navigate(`/payment/${bookingId}`, { state: payload });
  };

  // ── Image nav ────────────────────────────────────────────────────────────
  const images = court.images?.length ? court.images : [court.mainImage ?? ""];
  const prevImage = () => setCurrentImageIndex((p) => (p - 1 + images.length) % images.length);
  const nextImage = () => setCurrentImageIndex((p) => (p + 1) % images.length);

  return (
    <div className="min-h-screen bg-[#f4f8fb] pb-12">

      {/* ── Hero Gallery ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative w-full h-[320px] lg:h-[460px] bg-gray-900 rounded-3xl overflow-hidden shadow-md">
          <img
            src={images[currentImageIndex] || ""}
            alt={court.name}
            className="w-full h-full object-cover transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {/* Nav arrows */}
          {images.length > 1 && (
            <>
              <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/40 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/40 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute bottom-24 right-4 flex gap-1.5">
                {images.map((_, i) => (
                  <button key={i} onClick={() => setCurrentImageIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${i === currentImageIndex ? "w-6 bg-white" : "w-1.5 bg-white/50"}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Bottom overlay */}
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
                    {court.rating != null && (
                      <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-white font-bold text-base">{court.rating}</span>
                        <span className="text-white/70 text-base">({court.reviewCount ?? 0})</span>
                      </div>
                    )}
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
      {images.length > 1 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {images.map((img, i) => (
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

          {/* ── LEFT COLUMN ───────────────────────────────────────────── */}
          <div className="space-y-6">

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Mở cửa",   value: `${court.openTime  ?? "06:00"} – ${court.closeTime ?? "22:00"}`, icon: <Clock className="w-5 h-5 text-blue-500"   /> },
                { label: "Sức chứa", value: `${court.capacity  ?? 4} người`,                                  icon: <Users className="w-5 h-5 text-violet-500" /> },
                { label: "Từ",       value: `${court.pricing.morning.toLocaleString()}đ`,                     icon: <Zap   className="w-5 h-5 text-orange-500" /> },
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

            {/* Booking Panel (Calendar + Slot picker + Discount input) */}
            <BookingPanel
              court={court}
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
              days={days}
              selectedDay={selectedDay}
              onDaySelect={setSelectedDay}
              slots={slots}
              isLoadingSlots={isLoadingSlots}
              selectedSlots={selectedSlots}
              toggleSlot={toggleSlot}
              discountCodeInput={discountCodeInput}
              setDiscountCodeInput={setDiscountCodeInput}
              appliedDiscount={appliedDiscount}
              onApplyDiscount={handleApplyDiscount}
              onRemoveDiscount={handleRemoveDiscount}
              totalPrice={totalPrice}
              discountAmount={discountAmount}
              finalPrice={finalPrice}
              groupedSelectedSlots={groupedSelectedSlots}
              onBook={handleBook}
            />

            {/* Info Tabs (Mô tả / Bảng giá / Đánh giá) */}
            <CourtInfoTabs court={court} courtReviews={courtReviews} />
          </div>

          {/* ── RIGHT COLUMN — Sticky Booking Summary ─────────────────── */}
          <div className="lg:sticky lg:top-[76px]">
            <BookingSummary
              court={court}
              selectedDay={selectedDay}
              selectedSlots={selectedSlots}
              groupedSelectedSlots={groupedSelectedSlots}
              totalPrice={totalPrice}
              discountAmount={discountAmount}
              finalPrice={finalPrice}
              appliedDiscount={appliedDiscount}
              onBook={handleBook}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
