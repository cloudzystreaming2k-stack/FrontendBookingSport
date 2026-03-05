import { useState, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  Check,
  X,
  Download,
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  Clock,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { mockBookings, Booking } from "../../data/mockData";

// ── helpers ──────────────────────────────────────────────────────────────────

const STATUS_META: Record<
  string,
  { label: string; badge: string; calBg: string; calText: string; dot: string }
> = {
  pending: {
    label: "Chờ xác nhận",
    badge: "bg-yellow-100 text-yellow-800",
    calBg: "bg-yellow-100 border-yellow-300",
    calText: "text-yellow-800",
    dot: "bg-yellow-400",
  },
  confirmed: {
    label: "Đã xác nhận",
    badge: "bg-green-100 text-green-800",
    calBg: "bg-green-100 border-green-300",
    calText: "text-green-800",
    dot: "bg-green-500",
  },
  cancelled: {
    label: "Đã hủy",
    badge: "bg-red-100 text-red-800",
    calBg: "bg-red-100 border-red-300",
    calText: "text-red-700",
    dot: "bg-red-400",
  },
  completed: {
    label: "Hoàn thành",
    badge: "bg-gray-100 text-gray-700",
    calBg: "bg-blue-50 border-blue-200",
    calText: "text-blue-700",
    dot: "bg-blue-400",
  },
};

const MONTH_NAMES = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4",
  "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
  "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
];
const DAY_NAMES = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

function getCalendarDays(year: number, month: number) {
  // month is 0-based
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Monday-based: getDay() returns 0=Sun,1=Mon…6=Sat => convert to Mon=0
  const startDow = (firstDay.getDay() + 6) % 7; // 0=Mon
  const endDow = (lastDay.getDay() + 6) % 7;

  const days: (Date | null)[] = [];

  // leading blanks
  for (let i = 0; i < startDow; i++) {
    const d = new Date(year, month, -startDow + i + 1);
    days.push(d);
  }
  // current month
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }
  // trailing blanks to complete the last row
  const trailing = endDow === 6 ? 0 : 6 - endDow;
  for (let i = 1; i <= trailing; i++) {
    days.push(new Date(year, month + 1, i));
  }
  return days;
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// ── component ─────────────────────────────────────────────────────────────────

export function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);

  // List filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Calendar state
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth()); // 0-based
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  // ── filtered list ───────────────────────────────────────────────────────────
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        b.id.toLowerCase().includes(q) ||
        b.userName.toLowerCase().includes(q) ||
        b.courtName.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || b.status === statusFilter;
      const matchMin = !minPrice || b.totalPrice >= Number(minPrice);
      const matchMax = !maxPrice || b.totalPrice <= Number(maxPrice);
      return matchSearch && matchStatus && matchMin && matchMax;
    });
  }, [bookings, searchQuery, statusFilter, minPrice, maxPrice]);

  // ── calendar days ───────────────────────────────────────────────────────────
  const calDays = useMemo(() => getCalendarDays(calYear, calMonth), [calYear, calMonth]);

  const bookingsOnDay = (day: Date) =>
    bookings.filter((b) => sameDay(new Date(b.date), day));

  const selectedDayBookings = selectedDay ? bookingsOnDay(selectedDay) : [];

  // ── actions ─────────────────────────────────────────────────────────────────
  const handleConfirm = (id: string) =>
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "confirmed" as const } : b))
    );

  const handleCancel = (id: string) => {
    if (confirm("Bạn có chắc muốn hủy đặt sân này?"))
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "cancelled" as const } : b))
      );
  };

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear((y) => y - 1); }
    else setCalMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear((y) => y + 1); }
    else setCalMonth((m) => m + 1);
  };

  const statusCounts = useMemo(() => ({
    all: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  }), [bookings]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Quản lý đặt sân</h2>
          <p className="text-gray-500 text-sm mt-0.5">Xem và quản lý tất cả đặt sân</p>
        </div>
        <Button onClick={() => alert("Xuất báo cáo thành công! (Demo)")}>
          <Download className="w-4 h-4 mr-2" />
          Xuất báo cáo
        </Button>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">Danh sách</TabsTrigger>
          <TabsTrigger value="calendar">Lịch</TabsTrigger>
        </TabsList>

        {/* ══════════════ LIST VIEW ══════════════ */}
        <TabsContent value="list" className="mt-5 space-y-4">

          {/* ── Filter bar ── */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 space-y-4">
              {/* Row 1: Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  className="pl-9"
                  placeholder="Tìm theo mã đặt sân, tên khách hàng, tên sân..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Row 2: Status + Price */}
              <div className="flex flex-wrap gap-3 items-end">
                {/* Status pills */}
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      { key: "all", label: "Tất cả" },
                      { key: "pending", label: "Chờ xác nhận" },
                      { key: "confirmed", label: "Đã xác nhận" },
                      { key: "completed", label: "Hoàn thành" },
                      { key: "cancelled", label: "Đã hủy" },
                    ] as const
                  ).map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setStatusFilter(key)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                        statusFilter === key
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      {label}
                      <span className="ml-1.5 text-xs opacity-70">
                        ({statusCounts[key as keyof typeof statusCounts] ?? 0})
                      </span>
                    </button>
                  ))}
                </div>

                {/* Divider */}
                <div className="hidden sm:block w-px h-8 bg-gray-200 mx-1" />

                {/* Price filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400 shrink-0" />
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Giá từ (đ)</Label>
                    <Input
                      type="number"
                      className="w-32 h-8 text-sm"
                      placeholder="0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                  </div>
                  <span className="text-gray-400 mt-5">—</span>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Đến (đ)</Label>
                    <Input
                      type="number"
                      className="w-32 h-8 text-sm"
                      placeholder="∞"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                  {(minPrice || maxPrice) && (
                    <button
                      onClick={() => { setMinPrice(""); setMaxPrice(""); }}
                      className="mt-5 text-xs text-red-500 hover:underline"
                    >
                      Xóa
                    </button>
                  )}
                </div>
              </div>

              {/* Results count */}
              <p className="text-xs text-gray-400">
                Hiển thị <span className="font-semibold text-gray-600">{filteredBookings.length}</span> / {bookings.length} đặt sân
              </p>
            </CardContent>
          </Card>

          {/* ── Table ── */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      {["Mã đặt sân", "Sân", "Khách hàng", "Ngày", "Giờ", "Giá", "Trạng thái", "Hành động"].map(
                        (h) => (
                          <th key={h} className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-gray-400">
                          Không tìm thấy đặt sân phù hợp
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((booking) => (
                        <tr key={booking.id} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 text-sm font-medium text-blue-600">{booking.id}</td>
                          <td className="py-3 px-4 text-sm">{booking.courtName}</td>
                          <td className="py-3 px-4 text-sm">
                            <div className="font-medium">{booking.userName}</div>
                            <div className="text-xs text-gray-400">{booking.userId}</div>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {new Date(booking.date).toLocaleDateString("vi-VN")}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {booking.startTime} – {booking.endTime}
                          </td>
                          <td className="py-3 px-4 text-sm font-semibold text-gray-800">
                            {booking.totalPrice.toLocaleString()}đ
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_META[booking.status].badge}`}
                            >
                              {STATUS_META[booking.status].label}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <div className="flex gap-1">
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              {booking.status === "pending" && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleConfirm(booking.id)}
                                    title="Xác nhận"
                                  >
                                    <Check className="w-4 h-4 text-green-600" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCancel(booking.id)}
                                    title="Hủy"
                                  >
                                    <X className="w-4 h-4 text-red-600" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ══════════════ CALENDAR VIEW ══════════════ */}
        <TabsContent value="calendar" className="mt-5 space-y-5">

          {/* ── Month calendar grid ── */}
          <Card className="border-0 shadow-sm overflow-hidden">
            {/* Navigation header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
              <button
                onClick={prevMonth}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h3 className="font-semibold text-gray-900 text-lg">
                {MONTH_NAMES[calMonth]} {calYear}
              </h3>
              <button
                onClick={nextMonth}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <CardContent className="p-0">
              {/* Day-of-week header */}
              <div className="grid grid-cols-7 border-b bg-gray-50">
                {DAY_NAMES.map((d) => (
                  <div
                    key={d}
                    className="py-2.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide"
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7">
                {calDays.map((day, idx) => {
                  if (!day) return <div key={idx} className="border-r border-b min-h-[110px] bg-gray-50/50" />;

                  const isCurrentMonth = day.getMonth() === calMonth;
                  const isToday = sameDay(day, today);
                  const isSelected = selectedDay ? sameDay(day, selectedDay) : false;
                  const dayBookings = bookingsOnDay(day);

                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedDay(isSelected ? null : day)}
                      className={`border-r border-b min-h-[110px] p-1.5 cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-blue-50"
                          : isCurrentMonth
                          ? "bg-white hover:bg-gray-50"
                          : "bg-gray-50/60"
                      }`}
                    >
                      {/* Date number */}
                      <div className="flex justify-start mb-1">
                        <span
                          className={`text-sm w-7 h-7 flex items-center justify-center rounded-full font-medium ${
                            isToday
                              ? "bg-blue-600 text-white"
                              : isCurrentMonth
                              ? "text-gray-800"
                              : "text-gray-300"
                          }`}
                        >
                          {day.getDate()}
                        </span>
                      </div>

                      {/* Booking events */}
                      <div className="space-y-0.5">
                        {dayBookings.slice(0, 3).map((b) => {
                          const meta = STATUS_META[b.status];
                          return (
                            <div
                              key={b.id}
                              title={`${b.startTime} – ${b.courtName} (${meta.label})`}
                              className={`text-xs px-1.5 py-0.5 rounded border truncate ${meta.calBg} ${meta.calText}`}
                            >
                              {b.startTime} · {b.courtName.replace(/^Sân\s+/i, "")}
                            </div>
                          );
                        })}
                        {dayBookings.length > 3 && (
                          <div className="text-xs text-gray-400 px-1">
                            +{dayBookings.length - 3} khác
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-5 px-4 py-3 border-t bg-gray-50">
                {Object.entries(STATUS_META).map(([key, meta]) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <span className={`w-3 h-3 rounded-sm border ${meta.calBg}`} />
                    <span className="text-xs text-gray-600">{meta.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ── Selected-day detail panel ── */}
          {selectedDay && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-blue-600" />
                  Đặt sân ngày{" "}
                  {selectedDay.toLocaleDateString("vi-VN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDayBookings.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">
                    Không có đặt sân nào trong ngày này
                  </p>
                ) : (
                  <div className="space-y-3">
                    {selectedDayBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-start justify-between border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex gap-3">
                          {/* Color dot */}
                          <div className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${STATUS_META[booking.status].dot}`} />
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <h4 className="font-semibold text-sm">{booking.courtName}</h4>
                              <span className="text-xs text-gray-400">#{booking.id}</span>
                            </div>
                            <p className="text-sm text-gray-600">{booking.userName}</p>
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                              <Clock className="w-3.5 h-3.5" />
                              {booking.startTime} – {booking.endTime} ({booking.hours}h)
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          <p className="font-semibold text-sm mb-1">
                            {booking.totalPrice.toLocaleString()}đ
                          </p>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_META[booking.status].badge}`}
                          >
                            {STATUS_META[booking.status].label}
                          </span>
                          {booking.status === "pending" && (
                            <div className="flex gap-1.5 mt-2 justify-end">
                              <Button size="sm" onClick={() => handleConfirm(booking.id)}>
                                Xác nhận
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCancel(booking.id)}
                              >
                                Hủy
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
