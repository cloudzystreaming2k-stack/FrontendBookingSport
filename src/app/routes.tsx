import { createBrowserRouter } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import { AdminLayout } from "./layouts/AdminLayout";

// Customer Pages
import { HomePage } from "./pages/HomePage";
import { CourtsPage } from "./pages/CourtsPage";
import { CourtDetailPage } from "./pages/CourtDetailPage";
import { BookingPage } from "./pages/BookingPage";
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
import { AdminPayments } from "./pages/admin/AdminPayments";
import { AdminUsers } from "./pages/admin/AdminUsers";
import { AdminPromotions } from "./pages/admin/AdminPromotions";
import { AdminReviews } from "./pages/admin/AdminReviews";
import { AdminNews } from "./pages/admin/AdminNews";
import { AdminCourtTypes } from "./pages/admin/AdminCourtTypes";
import { AdminFacilities } from "./pages/admin/AdminFacilities";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "login", Component: LoginPage },
      { path: "register", Component: RegisterPage },
      { path: "courts", Component: CourtsPage },
      { path: "courts/:id", Component: CourtDetailPage },
      { path: "booking/:courtId", Component: BookingPage },
      { path: "payment/:bookingId", Component: PaymentPage },
      { path: "profile", Component: ProfilePage },
      { path: "news", Component: NewsPage },
      { path: "news/:id", Component: NewsDetailPage },
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
      { path: "bookings", Component: AdminBookings },
      { path: "payments", Component: AdminPayments },
      { path: "users", Component: AdminUsers },
      { path: "promotions", Component: AdminPromotions },
      { path: "reviews", Component: AdminReviews },
      { path: "news", Component: AdminNews },
    ],
  },
]);