import { useState, useEffect } from "react";
import { User, Calendar, Heart, Lock, Mail, Phone, MapPin, Star, X, Clock, CreditCard, CheckCircle, AlertCircle, XCircle, Image as ImageIcon } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Separator } from "../components/ui/separator";
import { mockCourts, Booking } from "../data/mockData";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import api from "../lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface APIBooking {
  _id: string;
  bookingCode: string;
  userId?: { _id: string; fullName: string; email: string; phone: string };
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
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  createdAt: string;
}

type TabType = "account" | "favorites" | "bookings";

export function ProfilePage() {
  const { user, isAuthenticated, isLoading, updateProfile } = useAuth();
  const navigate = useNavigate();
    const location = useLocation();
  const [activeTab, setActiveTab] = useState<TabType>("account");

  // Booking state - from API
  const [userBookings, setUserBookings] = useState<APIBooking[]>([]);
  const [bookingTotal, setBookingTotal] = useState(0);
  const [bookingPage, setBookingPage] = useState(1);
  const [bookingTotalPages, setBookingTotalPages] = useState(1);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  useEffect(() => {
    // Chỉ redirect nếu đã load xong auth context mà vẫn không authenticated
    if (!isLoading && !isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/profile" } } });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Set active tab from navigation state
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state?.activeTab]);

  // Fetch user bookings from API when tab becomes active
  useEffect(() => {
    if (activeTab === "bookings" && isAuthenticated) {
      fetchUserBookings();
    }
  }, [activeTab, isAuthenticated]);

  const fetchUserBookings = async (page = 1) => {
    setIsLoadingBookings(true);
    try {
      const response = await api.get(`/bookings/my?page=${page}&limit=5`);
      setUserBookings(response.data.bookings || []);
      setBookingTotal(response.data.total || 0);
      setBookingTotalPages(response.data.totalPages || 1);
      setBookingPage(page);
    } catch (error) {
      toast.error("Không thể tải lịch sử đặt sân");
      console.error(error);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  const [userData, setUserData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    gender: user?.gender || "other",
    dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : "",
  });

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // Mock favorite courts (would come from user preferences)
  const [favoriteCourts] = useState(mockCourts.filter((c) => ["C001", "C003", "C005"].includes(c.id)));

  // Booking detail modal state
  const [selectedBooking, setSelectedBooking] = useState<APIBooking | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Update local state when user changes
  useEffect(() => {
    if (user) {
      setUserData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email,
        phone: user.phone || "",
        gender: user.gender || "other",
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : "",
      });
    }
  }, [user]);

  // Show loading state while auth is initializing
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // ─── Helper Functions ────────────────────────────────────────────────────────

  /**
   * Tính khoảng thời gian từ slot đầu tiên đến slot cuối cùng
   * VD: slots[09:00-09:30, 09:30-10:00] → "09:00 - 10:00" (1 giờ)
   */
  const getTimeRange = (slots: { startTime: string; endTime: string }[]): string => {
    if (!slots || slots.length === 0) return "Không xác định";

    const firstSlot = slots[0];
    const lastSlot = slots[slots.length - 1];

    // Tính tổng giờ từ startTime slot đầu đến endTime slot cuối
    const startTime = firstSlot.startTime;
    const endTime = lastSlot.endTime;

    // Parse time
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);
    const totalMinutes = (endH * 60 + endM) - (startH * 60 + startM);
    const hours = totalMinutes / 60;

    return `${startTime} - ${endTime} (${hours.toFixed(1)} giờ)`;
  };

  const getTotalSlotPrice = (slots: { price: number }[]): number => {
    return slots.reduce((sum, slot) => sum + (slot.price || 0), 0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận";
      case "pending":
        return "Chờ xác nhận";
      case "cancelled":
        return "Đã hủy";
      case "completed":
        return "Hoàn thành";
      default:
        return status;
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case "paid":
        return "Đã thanh toán";
      case "pending":
        return "Chờ thanh toán";
      case "refunded":
        return "Đã hoàn tiền";
      default:
        return status;
    }
  };

  const handleUpdateProfile = () => {
    updateProfile({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      gender: userData.gender,
      dateOfBirth: userData.dateOfBirth
    });
    toast.success("Cập nhật thông tin thành công!");
  };

  const handleChangePassword = () => {
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (passwordData.new !== passwordData.confirm) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }
    if (passwordData.new.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }
    toast.success("Đổi mật khẩu thành công!");
    setPasswordData({ current: "", new: "", confirm: "" });
  };

  const handleRemoveFavorite = (courtId: string) => {
    toast.success("Đã xóa khỏi danh sách yêu thích");
  };

  const handleOpenDetailModal = (booking: APIBooking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setSelectedBooking(null);
    setIsDetailModalOpen(false);
  };

  const handleCancelBooking = async (booking: APIBooking) => {
    try {
      await api.patch(`/bookings/${booking._id}/status`, { status: "cancelled" });
      toast.success("Đã hủy đặt sân thành công!");
      // Reload booking list
      await fetchUserBookings();
      handleCloseDetailModal();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể hủy đơn đặt sân");
    }
  };

  const getPaymentMethodLabel = (method?: string) => {
    switch (method) {
      case "vnpay":
        return "VNPay";
      case "momo":
        return "MoMo";
      case "banking":
        return "Chuyển khoản ngân hàng";
      case "card":
        return "Thẻ tín dụng/ghi nợ";
      default:
        return "Chưa thanh toán";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case "pending":
        return <AlertCircle className="w-6 h-6 text-yellow-600" />;
      case "cancelled":
        return <XCircle className="w-6 h-6 text-red-600" />;
      case "completed":
        return <CheckCircle className="w-6 h-6 text-blue-600" />;
      default:
        return <AlertCircle className="w-6 h-6 text-gray-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Tài khoản của tôi</h1>
        <p className="text-gray-600 mt-1">Quản lý thông tin cá nhân và sở thích của bạn</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-3">
          <Card className="sticky top-6">
            <CardContent className="p-6">
              {/* User Info */}
              <div className="text-center mb-6 pb-6 border-b">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h3 className="font-bold text-lg">{userData.lastName} {userData.firstName}</h3>
                <p className="text-sm text-gray-600 mt-0.5">{userData.email}</p>
                <div className="mt-3">
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                    Thành viên
                  </Badge>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tổng đặt sân</span>
                  <span className="font-bold text-blue-600">{bookingTotal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Hoàn thành</span>
                  <span className="font-bold text-green-600">
                    {userBookings.filter((b) => b.status === "completed").length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Sân yêu thích</span>
                  <span className="font-bold text-pink-600">{favoriteCourts.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Điểm tích lũy</span>
                  <span className="font-bold text-purple-600">1,250</span>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("account")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "account"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <User className="w-4 h-4" />
                  Thông tin tài khoản
                </button>
                <button
                  onClick={() => setActiveTab("favorites")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "favorites"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <Heart className="w-4 h-4" />
                  Sân yêu thích
                  {favoriteCourts.length > 0 && (
                    <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${activeTab === "favorites" ? "bg-white/20" : "bg-blue-100 text-blue-600"
                      }`}>
                      {favoriteCourts.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("bookings")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "bookings"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <Calendar className="w-4 h-4" />
                  Lịch sử đặt sân
                  {userBookings.filter(b => b.status === 'pending').length > 0 && (
                    <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${activeTab === "bookings" ? "bg-white/20" : "bg-yellow-100 text-yellow-600"
                      }`}>
                      {userBookings.filter(b => b.status === 'pending').length}
                    </span>
                  )}
                </button>
              </nav>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-9">
          {/* Account Tab */}
          {activeTab === "account" && (
            <div className="space-y-6">
              {/* Personal Info Card */}
              <Card>
                <CardHeader className="border-b bg-gray-50">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Thông tin cá nhân
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        Họ và đệm
                      </Label>
                      <Input
                        id="lastName"
                        value={userData.lastName}
                        onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                        placeholder="Nhập họ và đệm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        Tên
                      </Label>
                      <Input
                        id="firstName"
                        value={userData.firstName}
                        onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                        placeholder="Nhập tên"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={userData.email}
                        readOnly
                        disabled
                        className="bg-gray-100 cursor-not-allowed text-gray-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        Số điện thoại
                      </Label>
                      <Input
                        id="phone"
                        value={userData.phone}
                        onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                        placeholder="Nhập số điện thoại"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender" className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        Giới tính
                      </Label>
                      <Select
                        value={userData.gender}
                        onValueChange={(val) => setUserData({ ...userData, gender: val })}
                      >
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Nam</SelectItem>
                          <SelectItem value="female">Nữ</SelectItem>
                          <SelectItem value="other">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob" className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        Ngày sinh
                      </Label>
                      <Input
                        id="dob"
                        type="date"
                        value={userData.dateOfBirth}
                        onChange={(e) => setUserData({ ...userData, dateOfBirth: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t">
                    <Button onClick={handleUpdateProfile} className="w-full md:w-auto">
                      Cập nhật thông tin
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Change Password Card */}
              <Card>
                <CardHeader className="border-b bg-gray-50">
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-blue-600" />
                    Đổi mật khẩu
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4 max-w-md">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                      <Input
                        id="current-password"
                        type="password"
                        value={passwordData.current}
                        onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                        placeholder="Nhập mật khẩu hiện tại"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Mật khẩu mới</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={passwordData.new}
                        onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                        placeholder="Nhập mật khẩu mới"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={passwordData.confirm}
                        onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                        placeholder="Nhập lại mật khẩu mới"
                      />
                    </div>
                    <Button onClick={handleChangePassword} className="w-full">
                      Đổi mật khẩu
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === "favorites" && (
            <Card>
              <CardHeader className="border-b bg-gray-50">
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-600" />
                  Sân yêu thích của bạn
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {favoriteCourts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {favoriteCourts.map((court) => (
                      <Card key={court.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative h-48">
                          <img
                            src={court.images[0]}
                            alt={court.name}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => handleRemoveFavorite(court.id)}
                            className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-lg"
                            title="Xóa khỏi yêu thích"
                          >
                            <Heart className="w-5 h-5 text-pink-600 fill-pink-600" />
                          </button>
                          <div className="absolute bottom-3 left-3">
                            <Badge className="bg-white/90 text-gray-900 border-0">
                              {court.type === 'pickleball' ? 'Pickleball' :
                                court.type === 'badminton' ? 'Cầu lông' :
                                  court.type === 'basketball' ? 'Bóng rổ' :
                                    court.type === 'tennis' ? 'Tennis' : 'Bóng chuyền'}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-bold text-lg mb-1">{court.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                            <MapPin className="w-4 h-4" />
                            <span className="truncate">{court.area}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold text-sm">{court.rating}</span>
                            </div>
                            <span className="text-sm text-gray-500">({court.reviewCount} đánh giá)</span>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t">
                            <div>
                              <p className="text-xs text-gray-500">Giá từ</p>
                              <p className="font-bold text-blue-600">
                                {Math.min(court.pricing.morning, court.pricing.afternoon, court.pricing.evening).toLocaleString()}đ/h
                              </p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => navigate(`/courts/${court.id}`)}
                            >
                              Đặt sân
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Bạn chưa có sân yêu thích nào</p>
                    <p className="text-sm text-gray-500 mb-4">
                      Thêm sân vào danh sách yêu thích để dễ dàng đặt sân sau này
                    </p>
                    <Button onClick={() => navigate("/courts")}>
                      Khám phá sân
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Bookings Tab */}
          {activeTab === "bookings" && (
            <Card>
              <CardHeader className="border-b bg-gray-50">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Lịch sử đặt sân
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isLoadingBookings ? (
                  <div className="py-12 text-center">
                    <div className="inline-flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                    <p className="text-gray-600 mt-4">Đang tải lịch sử đặt sân...</p>
                  </div>
                ) : userBookings.length > 0 ? (
                  <div className="space-y-4">
                    {userBookings.map((booking) => (
                      <Card key={booking._id} className="border hover:shadow-md transition-shadow">
                        <CardContent className="p-5">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h3 className="font-bold text-lg">{booking.courtId.name}</h3>
                                  <p className="text-sm text-gray-500 mt-0.5">Mã đặt sân: {booking.bookingCode}</p>
                                </div>
                                <Badge className={getStatusColor(booking.status)}>
                                  {getStatusLabel(booking.status)}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Ngày đặt</p>
                                  <p className="text-sm font-medium">
                                    {new Date(booking.date).toLocaleDateString("vi-VN")}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Giờ chơi</p>
                                  <p className="text-sm font-medium">
                                    {getTimeRange(booking.slots).split(" (")[0]}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Thanh toán</p>
                                  <p className="text-sm font-medium">
                                    {booking.status === 'completed' ? 'Hoàn tất' :
                                      ['pending', 'confirmed'].includes(booking.status) ? 'Chờ xử lý' : 'Hủy'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Tổng tiền</p>
                                  <p className="text-sm font-bold text-blue-600">
                                    {booking.finalPrice?.toLocaleString()}đ
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 lg:flex-col">
                              {['pending', 'confirmed'].includes(booking.status) && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 lg:flex-none"
                                  onClick={() => {
                                    if (window.confirm('Bạn có chắc chắn muốn hủy đơn này?')) {
                                      handleCancelBooking(booking);
                                    }
                                  }}
                                >
                                  Hủy
                                </Button>
                              )}
                              <Button size="sm" className="flex-1 lg:flex-none" onClick={() => handleOpenDetailModal(booking)}>
                                Chi tiết
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Bạn chưa có lịch đặt sân nào</p>
                    <p className="text-sm text-gray-500 mb-4">
                      Khám phá và đặt sân yêu thích của bạn ngay hôm nay
                    </p>
                    <Button onClick={() => navigate("/courts")}>
                      Đặt sân ngay
                    </Button>
                  </div>
                )}

                {/* Pagination Bar */}
                {bookingTotalPages > 1 && (
                  <div className="flex items-center justify-between pt-4 mt-6 border-t px-2">
                    <p className="text-sm text-gray-600">
                      Tổng <span className="font-semibold text-gray-900">{bookingTotal}</span> đơn (Trang {bookingPage}/{bookingTotalPages})
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchUserBookings(bookingPage - 1)}
                        disabled={bookingPage <= 1 || isLoadingBookings}
                      >
                        Trước
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchUserBookings(bookingPage + 1)}
                        disabled={bookingPage >= bookingTotalPages || isLoadingBookings}
                      >
                        Sau
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Booking Detail Modal */}
      {isDetailModalOpen && selectedBooking && (() => {
        const court = selectedBooking.courtId;

        return (
          <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader className="border-b pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-2xl">Chi tiết đơn đặt sân</DialogTitle>
                    <p className="text-sm text-gray-500 mt-1">Mã đặt sân: {selectedBooking.bookingCode}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedBooking.status)}
                    <Badge className={getStatusColor(selectedBooking.status)}>
                      {getStatusLabel(selectedBooking.status)}
                    </Badge>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 pt-4">
                {/* Court Info Section */}
                <div>
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Thông tin sân
                  </h3>
                  {court && (
                    <div className="border rounded-lg overflow-hidden">
                      <div className="relative h-48 bg-gray-200">
                        {court.mainImage || court.images?.[0] ? (
                          <img
                            src={court.mainImage || court.images?.[0]!}
                            alt={court.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute bottom-3 left-3">
                          <Badge className="bg-white/90 text-gray-900 border-0">
                            {court.typeId?.name || 'Không xác định'}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50">
                        <h4 className="font-bold text-lg mb-1">{court.name}</h4>
                        <p className="text-sm text-gray-600">{court.address}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                          <MapPin className="w-3 h-3" />
                          <span>{court.code}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Booking Info Section */}
                <div>
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Thông tin đặt sân
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-xs text-blue-600 font-medium mb-1">Ngày chơi</p>
                      <p className="text-sm font-bold text-gray-900">
                        {new Date(selectedBooking.date).toLocaleDateString("vi-VN", {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                      <p className="text-xs text-green-600 font-medium mb-3 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Chi tiết giờ chơi
                      </p>
                      <div className="space-y-2">
                        {selectedBooking.slots && selectedBooking.slots.length > 0 ? (
                          selectedBooking.slots.map((slot, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                              <div>
                                <span className="font-medium text-gray-900">
                                  Slot {idx + 1}: {slot.startTime} - {slot.endTime}
                                </span>
                              </div>
                              <span className="text-green-700 font-semibold">
                                {slot.price.toLocaleString()}đ
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">Không có dữ liệu slot</p>
                        )}
                      </div>
                      <div className="border-t border-green-200 mt-3 pt-2">
                        <p className="text-xs text-gray-600">
                          Tổng thời gian: {getTimeRange(selectedBooking.slots)}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                      <p className="text-xs text-purple-600 font-medium mb-1">Ngày đặt</p>
                      <p className="text-sm font-bold text-gray-900">
                        {new Date(selectedBooking.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(selectedBooking.createdAt).toLocaleTimeString("vi-VN", {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Payment Info Section */}
                <div>
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    Thông tin thanh toán
                  </h3>
                  <div className="border rounded-lg p-5 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Trạng thái đơn hàng</p>
                        <Badge className={
                          selectedBooking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            selectedBooking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              selectedBooking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                        }>
                          {getStatusLabel(selectedBooking.status)}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Phương thức thanh toán</p>
                        <p className="text-sm font-medium text-gray-900">
                          {getPaymentMethodLabel(selectedBooking.preferredPaymentMethod)}
                        </p>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Tổng giá tiền</span>
                        <span className="font-medium">{selectedBooking.finalPrice.toLocaleString()}đ</span>
                      </div>
                      {selectedBooking.discountAmount && selectedBooking.discountAmount > 0 && (
                        <div className="flex items-center justify-between text-sm text-green-700">
                          <span className="text-gray-600">Giảm giá</span>
                          <span className="font-medium">-{selectedBooking.discountAmount.toLocaleString()}đ</span>
                        </div>
                      )}
                      <Separator className="my-2" />
                      <div className="flex items-center justify-between">
                        <span className="text-base font-semibold">Cần thanh toán</span>
                        <span className="text-xl font-bold text-blue-600">
                          {selectedBooking.finalPrice.toLocaleString()}đ
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Info Section */}
                <div>
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Thông tin người đặt
                  </h3>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Họ và tên</p>
                          <p className="text-sm font-medium">{selectedBooking.customerName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Số điện thoại</p>
                          <p className="text-sm font-medium">{selectedBooking.customerPhone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  {(selectedBooking.status === 'pending' || selectedBooking.status === 'confirmed') && (
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => handleCancelBooking(selectedBooking)}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Hủy đặt sân
                    </Button>
                  )}
                  {court && (
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        navigate(`/courts/${court._id}`);
                        handleCloseDetailModal();
                      }}
                    >
                      Đặt lại sân này
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={handleCloseDetailModal}
                  >
                    Đóng
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        );
      })()}
    </div>
  );
}