import { useState, useEffect } from "react";
import { User, Calendar, CreditCard, Settings } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { mockBookings } from "../data/mockData";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export function ProfilePage() {
  const { user, isAuthenticated, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/profile" } } });
    }
  }, [isAuthenticated, navigate]);

  const [userData, setUserData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  // Update local state when user changes
  useEffect(() => {
    if (user) {
      setUserData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || "",
      });
    }
  }, [user]);

  if (!user) {
    return null;
  }

  const userBookings = mockBookings.filter((b) => b.userId === "U001");

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
      phone: userData.phone 
    });
    toast.success("Đã cập nhật thông tin thành công!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Tài khoản của tôi</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg">{userData.lastName} {userData.firstName}</h3>
                <p className="text-sm text-gray-600">{userData.email}</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600">Tổng đặt sân:</span>
                  <span className="font-semibold">{userBookings.length}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600">Hoàn thành:</span>
                  <span className="font-semibold">
                    {userBookings.filter((b) => b.status === "completed").length}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Tích điểm:</span>
                  <span className="font-semibold text-blue-600">1,250</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="bookings" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="bookings" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Lịch sử đặt sân
              </TabsTrigger>
              <TabsTrigger value="payments" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Thanh toán
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Cài đặt
              </TabsTrigger>
            </TabsList>

            {/* Bookings Tab */}
            <TabsContent value="bookings" className="mt-6 space-y-4">
              {userBookings.length > 0 ? (
                userBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-5">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{booking.courtName}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={getStatusColor(booking.status)}>
                                  {getStatusLabel(booking.status)}
                                </Badge>
                                <span className="text-sm text-gray-500">
                                  Mã: {booking.id}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                            <div>
                              <span className="text-gray-600">Ngày: </span>
                              <span className="font-medium">
                                {new Date(booking.date).toLocaleDateString("vi-VN")}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Giờ: </span>
                              <span className="font-medium">
                                {booking.startTime} - {booking.endTime}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Thanh toán: </span>
                              <span className="font-medium">
                                {getPaymentStatusLabel(booking.paymentStatus)}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Tổng tiền: </span>
                              <span className="font-medium text-blue-600">
                                {booking.totalPrice.toLocaleString()}đ
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {booking.status === "confirmed" && (
                            <Button variant="outline" size="sm">
                              Hủy đặt sân
                            </Button>
                          )}
                          <Button size="sm">Chi tiết</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Bạn chưa có lịch đặt sân nào</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lịch sử thanh toán</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between py-3 border-b last:border-0"
                      >
                        <div>
                          <div className="font-medium">{booking.courtName}</div>
                          <div className="text-sm text-gray-600">
                            {new Date(booking.createdAt).toLocaleDateString("vi-VN")}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            {booking.totalPrice.toLocaleString()}đ
                          </div>
                          <div className="text-sm text-gray-600">
                            {getPaymentStatusLabel(booking.paymentStatus)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin cá nhân</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Họ và đệm</Label>
                      <Input
                        id="lastName"
                        value={userData.lastName}
                        onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Tên</Label>
                      <Input
                        id="firstName"
                        value={userData.firstName}
                        onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userData.email}
                      onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input
                      id="phone"
                      value={userData.phone}
                      onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                    />
                  </div>
                  <Button
                    onClick={handleUpdateProfile}
                  >
                    Cập nhật thông tin
                  </Button>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Đổi mật khẩu</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Mật khẩu mới</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <Button>Đổi mật khẩu</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}