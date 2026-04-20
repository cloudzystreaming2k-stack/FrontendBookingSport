import { createBrowserRouter } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { OwnerLayout } from "./layouts/OwnerLayout";
import { NotFound } from "./pages/NotFound";
import { BookingSuccessPage } from "./pages/BookingSuccessPage";

// Customer Pages
import { HomePage } from "./pages/HomePage";
import { CourtsPage } from "./pages/CourtsPage";
import { CourtDetailPage } from "./pages/CourtDetail/CourtDetailPage";

import { PaymentPage } from "./pages/PaymentPage";
import { ProfilePage } from "./pages/ProfilePage";
import { NewsPage } from "./pages/NewsPage";
import { NewsDetailPage } from "./pages/NewsDetailPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";

// Admin Pages
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminCourts } from "./pages/admin/AdminCourts";
import { AdminBookings } from "./pages/admin/AdminBookings";
import { AdminUsers } from "./pages/admin/users/AdminUsers";
import { AdminPromotions } from "./pages/admin/AdminPromotions";
import { AdminReviews } from "./pages/admin/AdminReviews";
import { AdminNews } from "./pages/admin/news/AdminNews";
import { AdminCourtTypes } from "./pages/admin/court-types/AdminCourtTypes";
import { AdminFacilities } from "./pages/admin/facilities/AdminFacilities";
import { AdminLoginPage } from "./pages/admin/login/AdminLoginPage";
import { OwnerRegisterPage } from "./pages/owner/OwnerRegisterPage";
import { OwnerDashboard } from "./pages/owner/OwnerDashboard";
import { AdminOwners } from "./pages/admin/AdminOwners";
import { GuestRoute } from "./components/GuestRoute";
import { AdminCourtPricing } from "./pages/admin/court-pricing/AdminCourtPricing";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      // Guest-only routes: redirect về / nếu đã đăng nhập
      {
        Component: GuestRoute,
        children: [
          { path: "login", Component: LoginPage },
          { path: "register", Component: RegisterPage },
        ],
      },
      { path: "courts", Component: CourtsPage },
      { path: "courts/:id", Component: CourtDetailPage },
      { path: "payment", Component: PaymentPage },
      { path: "booking-success/:bookingId", Component: BookingSuccessPage },
      { path: "profile", Component: ProfilePage },
      { path: "news", Component: NewsPage },
      { path: "news/:slug", Component: NewsDetailPage },
      { path: "about", Component: AboutPage },
      { path: "contact", Component: ContactPage },
    ],
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "courts", Component: AdminCourts },
      { path: "court-types", Component: AdminCourtTypes },
      { path: "facilities", Component: AdminFacilities },
      { path: "court-pricing", Component: AdminCourtPricing },
      { path: "bookings", Component: AdminBookings },
      { path: "users", Component: AdminUsers },
      { path: "owners", Component: AdminOwners },
      { path: "promotions", Component: AdminPromotions },
      { path: "reviews", Component: AdminReviews },
      { path: "news", Component: AdminNews },
    ],
  },
  {
    path: "/owner",
    Component: OwnerLayout,
    children: [
      { index: true, Component: OwnerDashboard },
    ],
  },
  {
    Component: GuestRoute,
    children: [
      { path: "/admin/login", Component: AdminLoginPage },
      { path: "/owner/register", Component: OwnerRegisterPage },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);