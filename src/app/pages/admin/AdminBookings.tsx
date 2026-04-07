import { useState, useMemo } from "react";
import {
  Eye,
  Search,
  Filter,
  RefreshCw,
  CheckCircle,
  Clock,
  RotateCcw,
  List,
  Grid3x3,
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { mockBookings, Booking, mockCourts } from "../../data/mockData";
import { BookingDetailModal } from "../../components/admin/BookingDetailModal";
import { toast } from "sonner";

const STATUS_LABELS: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  cancelled: "Đã hủy",
  completed: "Đã xong",
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  vnpay: "VNPay",
  momo: "MoMo",
  banking: "Tiền mặt",
  card: "Thẻ",
};

const STATUS_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  pending: { bg: "bg-yellow-100", border: "border-yellow-300", text: "text-yellow-800" },
  confirmed: { bg: "bg-green-100", border: "border-green-300", text: "text-green-800" },
  cancelled: { bg: "bg-red-100", border: "border-red-300", text: "text-red-700" },
  completed: { bg: "bg-gray-100", border: "border-gray-300", text: "text-gray-800" },
};

// Time slots helper functions
function generateTimeSlots() {
  const slots: string[] = [];
  for (let hour = 6; hour < 23; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
    slots.push(`${hour.toString().padStart(2, "0")}:30`);
  }
  slots.push("23:00");
  return slots;
}

function timeToSlotIndex(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return (hours - 6) * 2 + (minutes >= 30 ? 1 : 0);
}

function getSlotSpan(startTime: string, endTime: string): { start: number; span: number } {
  const start = timeToSlotIndex(startTime);
  const end = timeToSlotIndex(endTime);
  return { start, span: end - start };
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Time grid state
  const today = new Date();
  const [gridDate, setGridDate] = useState<Date>(today);
  const [selectedCourtType, setSelectedCourtType] = useState<string>("all");

  // Detail modal state
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailBooking, setDetailBooking] = useState<Booking | null>(null);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: bookings.length,
      pending: bookings.filter((b) => b.status === "pending").length,
      confirmed: bookings.filter((b) => b.status === "confirmed").length,
      completed: bookings.filter((b) => b.status === "completed").length,
    };
  }, [bookings]);

  // Filter bookings for list view
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        b.id.toLowerCase().includes(q) ||
        b.userName.toLowerCase().includes(q) ||
        b.courtName.toLowerCase().includes(q);

      const matchStatus = statusFilter === "all" || b.status === statusFilter;

      const matchDateFrom = !dateFrom || b.date >= dateFrom;
      const matchDateTo = !dateTo || b.date <= dateTo;

      return matchSearch && matchStatus && matchDateFrom && matchDateTo;
    });
  }, [bookings, searchQuery, statusFilter, dateFrom, dateTo]);

  // Filter courts for time grid
  const filteredCourts = useMemo(() => {
    if (selectedCourtType === "all") return mockCourts;
    return mockCourts.filter((c) => c.type === selectedCourtType);
  }, [selectedCourtType]);

  // Get bookings for selected date
  const dayBookings = useMemo(() => {
    return bookings.filter((b) => sameDay(new Date(b.date), gridDate));
  }, [bookings, gridDate]);

  // Actions
  const handleConfirm = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "confirmed" as const } : b))
    );
    toast.success("Đã xác nhận đặt sân");
  };

  const handleCancel = (id: string) => {
    if (confirm("Bạn có chắc muốn hủy đặt sân này?")) {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "cancelled" as const } : b))
      );
      toast.success("Đã hủy đặt sân");
    }
  };

  const handleReset = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setDateFrom("");
    setDateTo("");
    toast.success("Đã reset bộ lọc");
  };

  const prevDay = () => {
    const newDate = new Date(gridDate);
    newDate.setDate(newDate.getDate() - 1);
    setGridDate(newDate);
  };

  const nextDay = () => {
    const newDate = new Date(gridDate);
    newDate.setDate(newDate.getDate() + 1);
    setGridDate(newDate);
  };

  const goToToday = () => {
    setGridDate(new Date());
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h2>
        <p className="text-sm text-gray-500 mt-1">Quản lý và theo dõi các đơn đặt sân</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium mb-1">Tổng đơn hàng</p>
                <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center">
                <RotateCcw className="w-6 h-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700 font-medium mb-1">Chờ xác nhận</p>
                <p className="text-3xl font-bold text-yellow-900">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-200 flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cyan-700 font-medium mb-1">Đã xác nhận</p>
                <p className="text-3xl font-bold text-cyan-900">{stats.confirmed}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-cyan-200 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-cyan-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium mb-1">Đã xong</p>
                <p className="text-3xl font-bold text-green-900">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for switching view */}
      <Tabs defaultValue="list" className="space-y-6">
        <TabsList className="bg-gray-100 p-1">
          <TabsTrigger value="list" className="gap-2">
            <List className="w-4 h-4" />
            Danh sách
          </TabsTrigger>
          <TabsTrigger value="grid" className="gap-2">
            <Grid3x3 className="w-4 h-4" />
            Lưới thời gian
          </TabsTrigger>
        </TabsList>

        {/* LIST VIEW */}
        <TabsContent value="list" className="space-y-4 mt-0">
          {/* Search & Filters */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-3">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    className="pl-9"
                    placeholder="Tìm theo mã đơn, tên khách hàng..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full lg:w-48">
                    <SelectValue placeholder="Tất cả trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="pending">Chờ xác nhận</SelectItem>
                    <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                    <SelectItem value="completed">Đã xong</SelectItem>
                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>

                {/* Date From */}
                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    placeholder="Từ ngày"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full lg:w-40"
                  />
                  <span className="text-gray-400">→</span>
                  <Input
                    type="date"
                    placeholder="Đến ngày"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full lg:w-40"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Filter className="w-4 h-4 mr-2" />
                    Lọc
                  </Button>
                  <Button variant="outline" onClick={handleReset}>
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      {[
                        "Mã đơn",
                        "Khách hàng",
                        "Sân",
                        "Ngày đặt",
                        "Khung giờ",
                        "Thanh toán",
                        "Tổng tiền",
                        "Trạng thái",
                        "Thao tác",
                      ].map((header) => (
                        <th
                          key={header}
                          className="text-left py-3 px-4 text-sm font-semibold text-gray-700"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-12 text-center text-gray-400">
                          Không tìm thấy đơn đặt sân phù hợp
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((booking) => (
                        <tr key={booking.id} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-4">
                            <span className="text-sm font-medium text-blue-600">{booking.id}</span>
                          </td>
                          <td className="py-4 px-4">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{booking.userName}</p>
                              <p className="text-xs text-gray-500">tluan131@gmail.com</p>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-gray-900">{booking.courtName}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-gray-600">
                              {new Date(booking.date).toLocaleDateString("vi-VN")}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-gray-600">
                              {booking.startTime} - {booking.endTime}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-gray-600">
                              {PAYMENT_METHOD_LABELS[booking.paymentMethod || ""] || "-"}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm font-semibold text-green-600">
                              {booking.totalPrice.toLocaleString()}đ
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <Badge
                              className={
                                booking.status === "completed"
                                  ? "bg-gray-100 text-gray-800"
                                  : booking.status === "confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : booking.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }
                            >
                              {STATUS_LABELS[booking.status]}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setDetailBooking(booking);
                                setDetailModalOpen(true);
                              }}
                              className="hover:bg-gray-100"
                            >
                              <Eye className="w-4 h-4 text-gray-600" />
                            </Button>
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

        {/* TIME GRID VIEW */}
        <TabsContent value="grid" className="space-y-4 mt-0">
          {/* Date Navigation & Filters */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Date Navigation */}
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" onClick={prevDay}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center gap-2 min-w-[280px] justify-center">
                    <CalendarIcon className="w-5 h-5 text-teal-600" />
                    <span className="font-semibold text-gray-900">
                      {gridDate.toLocaleDateString("vi-VN", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" onClick={nextDay}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

                {/* Court Type Filter & Today Button */}
                <div className="flex items-center gap-3">
                  <Select value={selectedCourtType} onValueChange={setSelectedCourtType}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Tất cả loại sân" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả loại sân</SelectItem>
                      <SelectItem value="pickleball">Pickleball</SelectItem>
                      <SelectItem value="badminton">Cầu lông</SelectItem>
                      <SelectItem value="basketball">Bóng rổ</SelectItem>
                      <SelectItem value="tennis">Tennis</SelectItem>
                      <SelectItem value="volleyball">Bóng chuyền</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={goToToday}>
                    Hôm nay
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legend */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-sm font-medium text-gray-600">Chú thích:</span>
                {Object.entries(STATUS_COLORS).map(([status, colors]) => (
                  <div key={status} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded ${colors.bg} border ${colors.border}`} />
                    <span className="text-sm text-gray-600">{STATUS_LABELS[status]}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Time Grid */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* Grid Header - Court Names */}
                  <div className="grid border-b bg-gray-50 sticky top-0 z-10" style={{ gridTemplateColumns: "80px repeat(auto-fit, minmax(150px, 1fr))" }}>
                    <div className="p-3 border-r font-semibold text-sm text-gray-700">Thời gian</div>
                    {filteredCourts.map((court) => (
                      <div key={court.id} className="p-3 border-r text-center">
                        <p className="font-semibold text-sm text-gray-900">{court.name}</p>
                        <p className="text-xs text-gray-500">{court.code}</p>
                      </div>
                    ))}
                  </div>

                  {/* Grid Body - Time Slots */}
                  <div className="relative">
                    {timeSlots.map((time, timeIdx) => (
                      <div
                        key={time}
                        className="grid border-b hover:bg-gray-50"
                        style={{ gridTemplateColumns: "80px repeat(auto-fit, minmax(150px, 1fr))" }}
                      >
                        {/* Time Label */}
                        <div className="p-3 border-r bg-gray-50 font-medium text-sm text-gray-700">
                          {time}
                        </div>

                        {/* Court Columns */}
                        {filteredCourts.map((court) => {
                          // Find bookings for this court at this time
                          const courtBookings = dayBookings.filter(
                            (b) => b.courtId === court.id
                          );

                          // Check if there's a booking starting at this slot
                          const bookingAtSlot = courtBookings.find((b) => {
                            const { start } = getSlotSpan(b.startTime, b.endTime);
                            return start === timeIdx;
                          });

                          if (bookingAtSlot) {
                            const { span } = getSlotSpan(
                              bookingAtSlot.startTime,
                              bookingAtSlot.endTime
                            );
                            const colors = STATUS_COLORS[bookingAtSlot.status];

                            return (
                              <div
                                key={court.id}
                                className={`border-r p-2 ${colors.bg} border ${colors.border} cursor-pointer hover:opacity-80 transition-opacity`}
                                style={{ gridRow: `span ${span}` }}
                                onClick={() => {
                                  setDetailBooking(bookingAtSlot);
                                  setDetailModalOpen(true);
                                }}
                              >
                                <div className="h-full flex flex-col justify-center">
                                  <p className={`text-xs font-bold ${colors.text} truncate`}>
                                    {bookingAtSlot.id}
                                  </p>
                                  <p className={`text-xs ${colors.text} truncate mt-0.5`}>
                                    {bookingAtSlot.userName}
                                  </p>
                                  <p className={`text-xs ${colors.text} mt-0.5`}>
                                    {bookingAtSlot.startTime} - {bookingAtSlot.endTime}
                                  </p>
                                  <Badge
                                    className={`mt-1 text-[10px] px-1.5 py-0 ${colors.bg} ${colors.text} border-0`}
                                  >
                                    {STATUS_LABELS[bookingAtSlot.status]}
                                  </Badge>
                                </div>
                              </div>
                            );
                          }

                          // Check if this slot is part of an existing booking (don't render anything)
                          const isPartOfBooking = courtBookings.some((b) => {
                            const { start, span } = getSlotSpan(b.startTime, b.endTime);
                            return timeIdx > start && timeIdx < start + span;
                          });

                          if (isPartOfBooking) {
                            return null;
                          }

                          // Empty slot
                          return (
                            <div
                              key={court.id}
                              className="border-r p-3 bg-white hover:bg-blue-50 cursor-pointer transition-colors"
                              onClick={() => {
                                toast.info("Chức năng đặt sân trực tiếp đang phát triển");
                              }}
                            >
                              <div className="text-center text-xs text-gray-300">Trống</div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Empty State */}
              {dayBookings.length === 0 && (
                <div className="p-12 text-center">
                  <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Không có đặt sân nào trong ngày này</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Booking Detail Modal */}
      <BookingDetailModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        booking={detailBooking}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}
