import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";
import { mockCourts } from "../../data/mockData";
import { ProfileSidebar } from "./components/ProfileSidebar";
import { PersonalInfoSection } from "./components/PersonalInfoSection";
import { ChangePasswordSection } from "./components/ChangePasswordSection";
import { FavoritesSection } from "./components/FavoritesSection";
import { BookingsSection } from "./components/BookingsSection";
import { BookingDetailModal } from "./components/BookingDetailModal";
import { useUserBookings } from "./hooks/useUserBookings";
import { TabType, UserData, PasswordData, APIBooking } from "./types";

export function ProfilePage() {
   const { user, isAuthenticated, updateProfile } = useAuth();
   const navigate = useNavigate();
   const [activeTab, setActiveTab] = useState<TabType>("account");

   // Booking data from API
   const { userBookings, isLoadingBookings, fetchUserBookings, cancelBooking } =
      useUserBookings();

   // Auth check
   useEffect(() => {
      if (!isAuthenticated) {
         navigate("/login", { state: { from: { pathname: "/profile" } } });
      }
   }, [isAuthenticated, navigate]);

   // Fetch bookings when tab changes
   useEffect(() => {
      if (activeTab === "bookings" && isAuthenticated) {
         fetchUserBookings();
      }
   }, [activeTab, isAuthenticated]);

   // User form state
   const [userData, setUserData] = useState<UserData>({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      gender: (user?.gender as "male" | "female" | "other" | undefined) || "other",
      dateOfBirth: user?.dateOfBirth
         ? new Date(user.dateOfBirth).toISOString().split("T")[0]
         : "",
   });

   const [passwordData, setPasswordData] = useState<PasswordData>({
      current: "",
      new: "",
      confirm: "",
   });

   // Favorite courts (mock data)
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
            email: user.email || "",
            phone: user.phone || "",
            gender: (user.gender as "male" | "female" | "other" | undefined) || "other",
            dateOfBirth: user.dateOfBirth
               ? new Date(user.dateOfBirth).toISOString().split("T")[0]
               : "",
         });
      }
   }, [user]);

   if (!user) {
      return null;
   }

   // ─── Handlers ────────────────────────────────────────────────────────────────

   const handleUpdateProfile = () => {
      updateProfile({
         firstName: userData.firstName,
         lastName: userData.lastName,
         email: userData.email,
         phone: userData.phone,
         gender: userData.gender,
         dateOfBirth: userData.dateOfBirth,
      });
   };

   const handleChangePassword = () => {
      setPasswordData({ current: "", new: "", confirm: "" });
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
      const success = await cancelBooking(booking._id);
      if (success) {
         handleCloseDetailModal();
      }
   };

   // ─── Render ──────────────────────────────────────────────────────────────────

   return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         <div className="mb-6">
            <h1 className="text-3xl font-bold">Tài khoản của tôi</h1>
            <p className="text-gray-600 mt-1">Quản lý thông tin cá nhân và sở thích của bạn</p>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sidebar */}
            <ProfileSidebar
               user={userData}
               activeTab={activeTab}
               onTabChange={setActiveTab}
               userBookingsCount={userBookings.length}
               pendingBookingsCount={userBookings.filter((b) => b.status === "pending").length}
               favoriteCourtsCount={favoriteCourts.length}
            />

            {/* Main Content */}
            <div className="lg:col-span-9">
               {/* Account Tab */}
               {activeTab === "account" && (
                  <div className="space-y-6">
                     <PersonalInfoSection
                        userData={userData}
                        onUserDataChange={setUserData}
                        onUpdate={handleUpdateProfile}
                     />
                     <ChangePasswordSection
                        passwordData={passwordData}
                        onPasswordDataChange={setPasswordData}
                        onChangePassword={handleChangePassword}
                     />
                  </div>
               )}

               {/* Favorites Tab */}
               {activeTab === "favorites" && <FavoritesSection favoriteCourts={favoriteCourts} />}

               {/* Bookings Tab */}
               {activeTab === "bookings" && (
                  <BookingsSection
                     userBookings={userBookings}
                     isLoadingBookings={isLoadingBookings}
                     onOpenDetailModal={handleOpenDetailModal}
                     onCancelBooking={handleCancelBooking}
                  />
               )}
            </div>
         </div>

         {/* Booking Detail Modal */}
         <BookingDetailModal
            isOpen={isDetailModalOpen}
            onClose={handleCloseDetailModal}
            selectedBooking={selectedBooking}
            onCancelBooking={handleCancelBooking}
         />
      </div>
   );
}
