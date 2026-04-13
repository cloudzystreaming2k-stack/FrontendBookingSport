import { User, Heart, Calendar } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { TabType, UserData } from "../types";

interface ProfileSidebarProps {
   user: UserData;
   activeTab: TabType;
   onTabChange: (tab: TabType) => void;
   userBookingsCount: number;
   pendingBookingsCount: number;
   favoriteCourtsCount: number;
}

export function ProfileSidebar({
   user,
   activeTab,
   onTabChange,
   userBookingsCount,
   pendingBookingsCount,
   favoriteCourtsCount,
}: ProfileSidebarProps) {
   return (
      <aside className="lg:col-span-3">
         <Card className="sticky top-6">
            <CardContent className="p-6">
               {/* User Info */}
               <div className="text-center mb-6 pb-6 border-b">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                     <User className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="font-bold text-lg">{user.lastName} {user.firstName}</h3>
                  <p className="text-sm text-gray-600 mt-0.5">{user.email}</p>
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
                     <span className="font-bold text-blue-600">{userBookingsCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-sm text-gray-600">Hoàn thành</span>
                     <span className="font-bold text-green-600">
                        {userBookingsCount - pendingBookingsCount}
                     </span>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-sm text-gray-600">Sân yêu thích</span>
                     <span className="font-bold text-pink-600">{favoriteCourtsCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-sm text-gray-600">Điểm tích lũy</span>
                     <span className="font-bold text-purple-600">1,250</span>
                  </div>
               </div>

               {/* Navigation Menu */}
               <nav className="space-y-1">
                  <Button
                     onClick={() => onTabChange("account")}
                     variant={activeTab === "account" ? "default" : "ghost"}
                     className={`w-full justify-start gap-3 ${activeTab === "account"
                           ? "bg-blue-600 text-white hover:bg-blue-700"
                           : "text-gray-700 hover:bg-gray-100"
                        }`}
                  >
                     <User className="w-4 h-4" />
                     Thông tin tài khoản
                  </Button>
                  <Button
                     onClick={() => onTabChange("favorites")}
                     variant={activeTab === "favorites" ? "default" : "ghost"}
                     className={`w-full justify-start gap-3 ${activeTab === "favorites"
                           ? "bg-blue-600 text-white hover:bg-blue-700"
                           : "text-gray-700 hover:bg-gray-100"
                        }`}
                  >
                     <Heart className="w-4 h-4" />
                     Sân yêu thích
                     {favoriteCourtsCount > 0 && (
                        <span
                           className={`ml-auto text-xs px-2 py-0.5 rounded-full ${activeTab === "favorites" ? "bg-white/20" : "bg-blue-100 text-blue-600"
                              }`}
                        >
                           {favoriteCourtsCount}
                        </span>
                     )}
                  </Button>
                  <Button
                     onClick={() => onTabChange("bookings")}
                     variant={activeTab === "bookings" ? "default" : "ghost"}
                     className={`w-full justify-start gap-3 ${activeTab === "bookings"
                           ? "bg-blue-600 text-white hover:bg-blue-700"
                           : "text-gray-700 hover:bg-gray-100"
                        }`}
                  >
                     <Calendar className="w-4 h-4" />
                     Lịch sử đặt sân
                     {pendingBookingsCount > 0 && (
                        <span
                           className={`ml-auto text-xs px-2 py-0.5 rounded-full ${activeTab === "bookings" ? "bg-white/20" : "bg-yellow-100 text-yellow-600"
                              }`}
                        >
                           {pendingBookingsCount}
                        </span>
                     )}
                  </Button>
               </nav>
            </CardContent>
         </Card>
      </aside>
   );
}
