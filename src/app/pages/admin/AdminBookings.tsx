import { useState, useMemo, useCallback, useEffect } from "react";
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
import { BookingDetailModal } from "../../components/admin/BookingDetailModal";
import { toast } from "sonner";
import api from "../../lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface APIBooking {
  _id: string;
  bookingCode: string;
  user?: { _id: string; fullName: string; email: string; phone: string };
  courtId: {
    _id: string;
    name: string;
    address: string;
    images?: string[];
    mainImage?: string;
    code?: string;
    typeId?: { _id: string; name: string; color: string; icon: string };
  };
  date: string;
  customerName: string;
  customerPhone: string;
  slots: { startTime: string; endTime: string; price: number }[];
  totalPrice: number;
  discountCode?: string;
  discountAmount?: number;
  finalPrice: number;
  preferredPaymentMethod: string;
  paymentStatus: "unpaid" | "paid";
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  createdAt: string;
}

export interface APICourt {
  _id: string;
  name: string;
  code?: string;
  typeId?: { _id: string; name: string; color: string; icon: string; };
  address: string;
  images?: string[];
  mainImage?: string;
}

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
  // === LIST VIEW STATE ===
  const [listBookings, setListBookings] = useState<APIBooking[]>([]);
  const [listTotal, setListTotal] = useState(0);
  const [listTotalPages, setListTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // === GRID VIEW STATE ===
  const [gridBookings, setGridBookings] = useState<APIBooking[]>([]);
  const [isGridLoading, setIsGridLoading] = useState(false);

  // === STATS STATE ===
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, completed: 0 });

  // === COURTS STATE ===
  const [courts, setCourts] = useState<APICourt[]>([]);

  // === FILTER STATE ===
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // === TIME GRID STATE ===
  const today = new Date();
  const [gridDate, setGridDate] = useState<Date>(today);
  const [selectedCourtType, setSelectedCourtType] = useState<string>("all");

  // === DETAIL MODAL STATE ===
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailBooking, setDetailBooking] = useState<APIBooking | null>(null);

  // Fetch danh sách đơn cho Tab Danh Sách (có phân trang + filter)
  const fetchListBookings = useCallback(async (
    page = 1,
    overrideFilters?: { search?: string; status?: string; dateFrom?: string; dateTo?: string }
  ) => {
    setIsLoading(true);
    const f = overrideFilters ?? { search: searchQuery, status: statusFilter, dateFrom, dateTo };
    try {
      const params = new URLSearchParams({ page: String(page), limit: '10' });
      if (f.status && f.status !== 'all') params.append('status', f.status);
      if (f.search?.trim()) params.append('search', f.search.trim());
      if (f.dateFrom) params.append('dateFrom', f.dateFrom);
      if (f.dateTo) params.append('dateTo', f.dateTo);

      const res = await api.get(`/admin/bookings?${params}`);
      setListBookings(res.data.bookings || []);
      setListTotal(res.data.total || 0);
      setListTotalPages(res.data.totalPages || 1);
      setCurrentPage(page);
    } catch {
      toast.error("Không thể tải danh sách đơn đặt sân.");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, statusFilter, dateFrom, dateTo]);

  // Fetch đơn cho Tab Lưới Thời Gian (chỉ theo ngày, lấy đủ không phân trang)
  const fetchGridBookings = useCallback(async (date: Date) => {
    setIsGridLoading(true);
    try {
      const dateStr = date.toISOString().split('T')[0]; // "2026-04-14"
      const res = await api.get(`/admin/bookings?dateFrom=${dateStr}&dateTo=${dateStr}&limit=200`);
      setGridBookings(res.data.bookings || []);
    } catch {
      toast.error("Không thể tải lưới thời gian.");
    } finally {
      setIsGridLoading(false);
    }
  }, []);

  // Fetch stats tổng (chính xác, không bị ảnh hưởng phân trang)
  const fetchStats = useCallback(async () => {
    try {
      const [totalRes, pendingRes, confirmedRes, completedRes] = await Promise.all([
        api.get('/admin/bookings?limit=1'),
        api.get('/admin/bookings?status=pending&limit=1'),
        api.get('/admin/bookings?status=confirmed&limit=1'),
        api.get('/admin/bookings?status=completed&limit=1'),
      ]);
      setStats({
        total: totalRes.data.total || 0,
        pending: pendingRes.data.total || 0,
        confirmed: confirmedRes.data.total || 0,
        completed: completedRes.data.total || 0,
      });
    } catch { /* stats không hiện lỗi */ }
  }, []);

  // Fetch danh sách sân (dùng chung cho cả 2 tab)
  const fetchCourts = useCallback(async () => {
    try {
      const res = await api.get("/admin/courts");
      setCourts(res.data || []);
    } catch { /* silent */ }
  }, []);

  // Load lần đầu
  useEffect(() => {
    fetchListBookings(1);
    fetchStats();
    fetchGridBookings(today);
    fetchCourts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Khi đổi ngày Grid → fetch lại Grid
  useEffect(() => {
    fetchGridBookings(gridDate);
  }, [gridDate, fetchGridBookings]);

  // Filter courts cho Grid view
  const filteredCourts = useMemo(() => {
    if (selectedCourtType === "all") return courts;
    return courts.filter((c) => c.typeId?._id === selectedCourtType || c.typeId?.name.toLowerCase().includes(selectedCourtType));
  }, [courts, selectedCourtType]);

  // dayBookings dùng gridBookings (độc lập với listBookings)
  const dayBookings = useMemo(() => {
    return gridBookings.filter((b) => sameDay(new Date(b.date), gridDate));
  }, [gridBookings, gridDate]);

  // === ACTIONS ===
  const handleFilter = () => {
    fetchListBookings(1); // Reset về trang 1 khi lọc mới
  };

  const handleReset = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setDateFrom("");
    setDateTo("");
    fetchListBookings(1, { search: '', status: 'all', dateFrom: '', dateTo: '' });
    toast.success("Đã reset bộ lọc");
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/admin/bookings/${id}/status`, { status: newStatus });
      toast.success("Đã cập nhật trạng thái đơn thành công.");
      fetchListBookings(currentPage); // Giữ nguyên trang đang xem
      fetchStats();                   // Cập nhật stats
      if (detailBooking?._id === id) {
        setDetailBooking(prev => prev ? { ...prev, status: newStatus as any } : null);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không thể cập nhật trạng thái.");
    }
  };

  const handlePaymentConfirm = async (id: string, amount: number, method: string) => {
    try {
      await api.post(`/admin/payments`, { bookingId: id, amount, paymentMethod: method });
      toast.success("Đã xác nhận thanh toán thành công!");
      fetchListBookings(currentPage);
      fetchStats();
      if (detailBooking?._id === id) {
        setDetailBooking(prev => prev ? { ...prev, paymentStatus: 'paid' } : null);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Xác nhận thanh toán thất bại.");
    }
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
                  <Button className="bg-green-600 hover:bg-green-700" onClick={handleFilter}>
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
                    {isLoading ? (
                      <tr>
                        <td colSpan={9} className="py-12 text-center text-gray-400">
                          Đang tải dữ liệu...
                        </td>
                      </tr>
                    ) : listBookings.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-12 text-center text-gray-400">
                          Không tìm thấy đơn đặt sân phù hợp
                        </td>
                      </tr>
                    ) : (
                      listBookings.map((booking) => (
                        <tr key={booking._id} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-4">
                            <span className="text-sm font-medium text-blue-600">{booking.bookingCode || 'BK00?'}</span>
                          </td>
                          <td className="py-4 px-4">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{booking.customerName}</p>
                              <p className="text-xs text-gray-500">{booking.customerPhone}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-gray-900">{booking.courtId?.name || "Không rõ"}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-gray-600">
                              {new Date(booking.date).toLocaleDateString("vi-VN")}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-gray-600 whitespace-nowrap">
                              {booking.slots?.length > 0 ? (
                                booking.slots.map((s, i) => (
                                  <div key={i}>{s.startTime} - {s.endTime}</div>
                                ))
                              ) : "Không rõ"}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            {booking.paymentStatus === 'paid' ? (
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">Đã thanh toán ({PAYMENT_METHOD_LABELS[booking.preferredPaymentMethod] || booking.preferredPaymentMethod})</Badge>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-0">Chưa thanh toán</Badge>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm font-semibold text-green-600">
                              {booking.finalPrice?.toLocaleString()}đ
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <Select
                              value={booking.status}
                              onValueChange={(value) => handleStatusChange(booking._id, value)}
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                    <span>Chờ xác nhận</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="confirmed">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    <span>Đã xác nhận</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="completed">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-gray-500" />
                                    <span>Đã xong</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="cancelled">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500" />
                                    <span>Đã hủy</span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
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

          {/* Pagination Bar */}
          <div className="flex items-center justify-between px-2 py-1">
            <p className="text-sm text-gray-600">
              Tổng <span className="font-semibold text-gray-900">{listTotal}</span> đơn đặt sân
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchListBookings(currentPage - 1)}
                disabled={currentPage <= 1 || isLoading}
                className="gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Trước
              </Button>
              <span className="text-sm text-gray-700 px-3">
                Trang <span className="font-semibold">{currentPage}</span> / {listTotalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchListBookings(currentPage + 1)}
                disabled={currentPage >= listTotalPages || isLoading}
                className="gap-1"
              >
                Sau
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
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
              <div className="overflow-x-auto overflow-y-auto max-h-[600px] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400">
                <div className="min-w-max">
                  {/* Grid Header - Court Names */}
                  <div className="grid border-b bg-gray-50 sticky top-0 z-10" style={{ gridTemplateColumns: `80px repeat(${filteredCourts.length}, 200px)` }}>
                    <div className="p-3 border-r font-semibold text-sm text-gray-700 sticky left-0 bg-gray-50 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Thời gian</div>
                    {filteredCourts.map((court) => (
                      <div key={court._id} className="p-3 border-r text-center">
                        <p className="font-semibold text-sm text-gray-900">{court.name}</p>
                        <p className="text-xs text-gray-500">{court.code || '-'}</p>
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
                            (b) => b.courtId?._id === court._id || (b.courtId as any) === court._id
                          );

                          // Temporary disabling drawing the booking on the mock grid
                          // Because slot structure changed (array of slots vs startTime/endTime)
                          const bookingAtSlot = courtBookings.find((b) => {
                            // Find if any slot inside the booking matches this time block
                            return b.slots?.some(s => {
                              const { start } = getSlotSpan(s.startTime, s.endTime);
                              return start === timeIdx;
                            });
                          });

                          if (bookingAtSlot) {
                            // Find the correct slot
                            const matchedSlot = bookingAtSlot.slots.find(s => {
                              const { start } = getSlotSpan(s.startTime, s.endTime);
                              return start === timeIdx;
                            });

                            const { span } = getSlotSpan(
                              matchedSlot!.startTime,
                              matchedSlot!.endTime
                            );
                            const colors = STATUS_COLORS[bookingAtSlot.status];

                            return (
                              <div
                                key={`${court._id}-${bookingAtSlot._id}-${timeIdx}`}
                                className={`border-r p-2 ${colors.bg} border ${colors.border} cursor-pointer hover:opacity-80 transition-opacity`}
                                style={{ gridRow: `span ${span}` }}
                                onClick={() => {
                                  setDetailBooking(bookingAtSlot);
                                  setDetailModalOpen(true);
                                }}
                              >
                                <div className="h-full flex flex-col justify-center">
                                  <p className={`text-xs font-bold ${colors.text} truncate`}>
                                    {bookingAtSlot.bookingCode}
                                  </p>
                                  <p className={`text-xs ${colors.text} truncate mt-0.5`}>
                                    {bookingAtSlot.customerName}
                                  </p>
                                  <p className={`text-xs ${colors.text} mt-0.5`}>
                                    {matchedSlot!.startTime} - {matchedSlot!.endTime}
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
                            return b.slots?.some(s => {
                              const { start, span } = getSlotSpan(s.startTime, s.endTime);
                              return timeIdx > start && timeIdx < start + span;
                            });
                          });

                          if (isPartOfBooking) {
                            return null;
                          }

                          // Empty slot
                          return (
                            <div
                              key={court._id}
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
        booking={detailBooking as any}
        onStatusChange={handleStatusChange}
        onPaymentConfirm={handlePaymentConfirm}
      />
    </div>
  );
}