import { useState, JSX } from "react";
import {
  Check, ChevronDown, ChevronUp, Info, MessageSquare,
  Star, Wifi, Car, Coffee, Wind, Zap,
} from "lucide-react";
import { ApiCourt } from "./types";

// ── Facility icon map ─────────────────────────────────────────────────────────
const facilityIcons: Record<string, JSX.Element> = {
  Wifi:       <Wifi  className="w-4 h-4" />,
  "Bãi đỗ xe": <Car   className="w-4 h-4" />,
  "Căn tin":  <Coffee className="w-4 h-4" />,
  "Điều hòa": <Wind  className="w-4 h-4" />,
  default:    <Check className="w-4 h-4" />,
};

// ── Quy định sân cố định ──────────────────────────────────────────────────────
const COURT_RULES = [
  "Có mặt trước giờ đặt ít nhất 5 phút",
  "Không mặc quần áo chứa đinh hoặc kim loại sắc nhọn",
  "Hủy miễn phí trước 24 giờ",
  "Mang theo QR Code khi vào sân",
];

// ── Types ─────────────────────────────────────────────────────────────────────
interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  courtId: string;
}

interface CourtInfoTabsProps {
  court: ApiCourt;
  courtReviews: Review[];
}

// ── Component ─────────────────────────────────────────────────────────────────
export function CourtInfoTabs({ court, courtReviews }: CourtInfoTabsProps) {
  const [activeTab, setActiveTab] = useState<"info" | "pricing" | "reviews">("info");
  const [showAllReviews, setShowAllReviews] = useState(false);

  const displayedReviews = showAllReviews ? courtReviews : courtReviews.slice(0, 3);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* ── Tab navigation ────────────────────────────────────────────────── */}
      <div className="flex border-b border-gray-100">
        {(["info", "pricing", "reviews"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 text-base font-semibold transition-colors border-b-2 ${
              activeTab === tab
                ? "text-blue-600 border-blue-600"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            {tab === "info"    && <><Info          className="w-4 h-4 inline mr-1" />Thông tin</>}
            {tab === "pricing" && <><Zap           className="w-4 h-4 inline mr-1" />Bảng giá</>}
            {tab === "reviews" && <><MessageSquare className="w-4 h-4 inline mr-1" />Đánh giá ({courtReviews.length})</>}
          </button>
        ))}
      </div>

      <div className="p-6">
        {/* ── Tab: Thông tin ────────────────────────────────────────────── */}
        {activeTab === "info" && (
          <div className="space-y-5">
            {/* Mô tả */}
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Mô tả</h3>
              <div 
                className="text-gray-600 text-base leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: court.description || "" }} 
              />
            </div>

            {/* Tiện nghi */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Tiện nghi</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(court.facilities ?? []).map((f, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl text-base text-gray-700 font-medium">
                    <span className="text-blue-500">
                      {facilityIcons[f.name] ?? facilityIcons.default}
                    </span>
                    {f.icon} {f.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Quy định */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Quy định sân</h3>
              <ul className="space-y-2">
                {COURT_RULES.map((rule, i) => (
                  <li key={i} className="flex items-start gap-2 text-base text-gray-600">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ── Tab: Bảng giá ─────────────────────────────────────────────── */}
        {activeTab === "pricing" && (
          <div className="space-y-3">
            {[
              { label: "Buổi sáng",  range: "06:00 – 12:00", price: court.pricing.morning,   color: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-100"  },
              { label: "Buổi chiều", range: "12:00 – 18:00", price: court.pricing.afternoon,  color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-100" },
              { label: "Buổi tối",   range: "18:00 – 22:00", price: court.pricing.evening,    color: "text-violet-700", bg: "bg-violet-50", border: "border-violet-100" },
            ].map((p) => (
              <div key={p.label} className={`${p.bg} ${p.border} border rounded-2xl p-4 flex items-center justify-between`}>
                <div>
                  <p className={`font-bold text-base ${p.color}`}>{p.label}</p>
                  <p className="text-base text-gray-500 mt-0.5">{p.range}</p>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-black ${p.color}`}>
                    {p.price.toLocaleString()}<span className="text-base font-medium ml-0.5">đ</span>
                  </p>
                  <p className="text-base text-gray-400">/ 30 phút</p>
                </div>
              </div>
            ))}
            <p className="text-base text-gray-400 text-center mt-2">* Giá có thể thay đổi theo ngày đặc biệt</p>
          </div>
        )}

        {/* ── Tab: Đánh giá ─────────────────────────────────────────────── */}
        {activeTab === "reviews" && (
          <div className="space-y-4">
            {/* Rating tổng quan */}
            <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-2xl mb-4">
              <div className="text-center">
                <p className="text-5xl font-black text-gray-900">{court.rating ?? "—"}</p>
                <div className="flex gap-0.5 mt-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i <= Math.round(court.rating ?? 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                    />
                  ))}
                </div>
                <p className="text-base text-gray-400 mt-1">{court.reviewCount ?? 0} đánh giá</p>
              </div>
              <div className="flex-1 space-y-1.5">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-base text-gray-400 w-3">{star}</span>
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full"
                        style={{ width: `${star === 5 ? 65 : star === 4 ? 20 : star === 3 ? 10 : 5}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Danh sách đánh giá */}
            {displayedReviews.map((review) => (
              <div key={review.id} className="border-b border-gray-50 pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-base shrink-0">
                    {review.userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-base text-gray-900">{review.userName}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className={`w-3 h-3 ${i <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                      ))}
                      <span className="text-base text-gray-400 ml-1">
                        {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-base text-gray-600 leading-relaxed">{review.comment}</p>
              </div>
            ))}

            {courtReviews.length > 3 && (
              <button
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="w-full flex items-center justify-center gap-1.5 py-2 text-base font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                {showAllReviews
                  ? <><ChevronUp className="w-4 h-4" />Thu gọn</>
                  : <><ChevronDown className="w-4 h-4" />Xem tất cả {courtReviews.length} đánh giá</>}
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
  );
}
