import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router";
import { toast } from "sonner";
import { mockCourts } from "../../data/mockData";
import type { TabType, UserData, PasswordData } from "./types";
import { useBookings } from "./hooks/useBookings";
import { ProfileSidebar } from "./components/ProfileSidebar";
import { AccountTab } from "./components/AccountTab";
import { FavoritesTab } from "./components/FavoritesTab";
import { BookingsTab } from "./components/BookingsTab";

// Mock data tạm thời cho Favorites
const FAVORITE_COURT_IDS = ["C001", "C003", "C005"];

export function ProfilePage() {
  const { user, isAuthenticated, isLoading, updateProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<TabType>("account");

  // Booking hook (fetch, cancel, modal state)
  const bookings = useBookings();

  const [userData, setUserData] = useState<UserData>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    gender: user?.gender || "other",
    dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split("T")[0] : "",
  });

  const [passwordData, setPasswordData] = useState<PasswordData>({
    current: "",
    new: "",
    confirm: "",
  });

  const [favoriteCourts] = useState(
    mockCourts.filter((c) => FAVORITE_COURT_IDS.includes(c.id))
  );

  // Auth redirect
  useEffect(() => {
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

  // Fetch bookings when tab becomes active
  useEffect(() => {
    if (activeTab === "bookings" && isAuthenticated) {
      bookings.fetchUserBookings();
    }
  }, [activeTab, isAuthenticated]);

  // Sync userData khi user thay đổi
  useEffect(() => {
    if (user) {
      setUserData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email,
        phone: user.phone || "",
        gender: user.gender || "other",
        dateOfBirth: user.dateOfBirth
          ? new Date(user.dateOfBirth).toISOString().split("T")[0]
          : "",
      });
    }
  }, [user]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Handlers (Account)
  const handleUpdateProfile = () => {
    updateProfile({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      gender: userData.gender,
      dateOfBirth: userData.dateOfBirth,
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

  const handleRemoveFavorite = (_courtId: string) => {
    toast.success("Đã xóa khỏi danh sách yêu thích");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Tài khoản của tôi</h1>
        <p className="text-gray-600 mt-1">Quản lý thông tin cá nhân và sở thích của bạn</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar */}
        <ProfileSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userData={userData}
          bookingTotal={bookings.bookingTotal}
          userBookings={bookings.userBookings}
          favoriteCourtsCount={favoriteCourts.length}
        />

        {/* Main Content */}
        <div className="lg:col-span-9">
          {activeTab === "account" && (
            <AccountTab
              userData={userData}
              setUserData={setUserData}
              handleUpdateProfile={handleUpdateProfile}
              passwordData={passwordData}
              setPasswordData={setPasswordData}
              handleChangePassword={handleChangePassword}
            />
          )}

          {activeTab === "favorites" && (
            <FavoritesTab
              favoriteCourts={favoriteCourts}
              handleRemoveFavorite={handleRemoveFavorite}
            />
          )}

          {activeTab === "bookings" && (
            <BookingsTab
              userBookings={bookings.userBookings}
              bookingTotal={bookings.bookingTotal}
              bookingPage={bookings.bookingPage}
              bookingTotalPages={bookings.bookingTotalPages}
              isLoadingBookings={bookings.isLoadingBookings}
              fetchUserBookings={bookings.fetchUserBookings}
              handleCancelBooking={bookings.handleCancelBooking}
              selectedBooking={bookings.selectedBooking}
              isDetailModalOpen={bookings.isDetailModalOpen}
              handleOpenDetailModal={bookings.handleOpenDetailModal}
              handleCloseDetailModal={bookings.handleCloseDetailModal}
            />
          )}
        </div>
      </div>
    </div>
  );
}