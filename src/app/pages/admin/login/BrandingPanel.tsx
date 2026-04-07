import { CheckCircle2, Shield } from "lucide-react";

interface BrandingPanelProps {
   loginMode: "admin" | "owner";
}

export function BrandingPanel({ loginMode }: BrandingPanelProps) {
   return (
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-br from-teal-600/20 to-blue-600/20 z-10"></div>
         <img
            src="https://images.unsplash.com/photo-1711720743865-10787dd6934a?w=1200&h=1200&fit=crop"
            alt="Office building"
            className="absolute inset-0 w-full h-full object-cover"
         />
         <div className="relative z-20 flex flex-col justify-between p-12 text-white">
            <div>
               <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                     <Shield className="w-7 h-7 text-white" />
                  </div>
                  <div>
                     <h1 className="text-2xl font-bold">BookingSport</h1>
                     <p className="text-sm text-white/80">Hệ Thống Quản Trị</p>
                  </div>
               </div>
            </div>

            <div className="space-y-6">
               <h2 className="text-4xl font-bold leading-tight">
                  {loginMode === "admin" ? (
                     <>Quản lý sân thể thao<br />một cách chuyên nghiệp</>
                  ) : (
                     <>Quản lý sân của bạn<br />hiệu quả và dễ dàng</>
                  )}
               </h2>
               <p className="text-lg text-white/80">
                  {loginMode === "admin"
                     ? "Truy cập vào bảng điều khiển quản trị để quản lý sân, đặt lịch, thanh toán và nhiều hơn nữa."
                     : "Theo dõi lịch đặt sân, quản lý doanh thu và khách hàng của sân thể thao một cách dễ dàng."
                  }
               </p>

               <div className="space-y-4 pt-8">
                  {loginMode === "admin" ? (
                     <>
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                              <CheckCircle2 className="w-5 h-5 text-teal-400" />
                           </div>
                           <span className="text-white/90">Quản lý 500+ sân thể thao</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                              <CheckCircle2 className="w-5 h-5 text-teal-400" />
                           </div>
                           <span className="text-white/90">Theo dõi đặt sân real-time</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                              <CheckCircle2 className="w-5 h-5 text-teal-400" />
                           </div>
                           <span className="text-white/90">Báo cáo doanh thu chi tiết</span>
                        </div>
                     </>
                  ) : (
                     <>
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                              <CheckCircle2 className="w-5 h-5 text-teal-400" />
                           </div>
                           <span className="text-white/90">Quản lý lịch đặt sân dễ dàng</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                              <CheckCircle2 className="w-5 h-5 text-teal-400" />
                           </div>
                           <span className="text-white/90">Theo dõi doanh thu theo thời gian thực</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                              <CheckCircle2 className="w-5 h-5 text-teal-400" />
                           </div>
                           <span className="text-white/90">Quản lý khách hàng và đánh giá</span>
                        </div>
                     </>
                  )}
               </div>
            </div>

            <div className="text-sm text-white/60">
               © 2024 BookingSport. All rights reserved.
            </div>
         </div>
      </div>
   );
}

export default BrandingPanel;
