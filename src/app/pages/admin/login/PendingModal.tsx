import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Button } from "../../../components/ui/button";

interface PendingModalProps {
   open: boolean;
   pendingOwnerData: { name: string; email: string } | null;
   onClose: () => void;
}

export function PendingModal({ open, pendingOwnerData, onClose }: PendingModalProps) {
   if (!open || !pendingOwnerData) return null;

   return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
         <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-8 text-center relative">
               <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
               <div className="relative">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white/30">
                     <Clock className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Tài Khoản Đang Chờ Duyệt</h2>
                  <p className="text-white/90 text-sm">Xin vui lòng chờ admin phê duyệt</p>
               </div>
            </div>

            <div className="p-8">
               <div className="mb-6 space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                     <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                           <p className="text-sm text-amber-900 leading-relaxed">
                              <strong>Xin chào {pendingOwnerData.name}!</strong>
                              <br />
                              Tài khoản chủ sân của bạn đã được đăng ký thành công nhưng hiện đang trong quá trình xem xét.
                           </p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-3">
                     <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                           <CheckCircle2 className="w-4 h-4 text-teal-600" />
                        </div>
                        <div>
                           <p className="text-sm font-medium text-gray-900">Thời gian xét duyệt</p>
                           <p className="text-sm text-gray-600">Trong vòng 24-48 giờ làm việc</p>
                        </div>
                     </div>

                     <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                           <CheckCircle2 className="w-4 h-4 text-teal-600" />
                        </div>
                        <div>
                           <p className="text-sm font-medium text-gray-900">Thông báo qua email</p>
                           <p className="text-sm text-gray-600">Chúng tôi sẽ gửi thông báo đến <span className="font-medium text-teal-600">{pendingOwnerData.email}</span></p>
                        </div>
                     </div>

                     <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                           <CheckCircle2 className="w-4 h-4 text-teal-600" />
                        </div>
                        <div>
                           <p className="text-sm font-medium text-gray-900">Hỗ trợ</p>
                           <p className="text-sm text-gray-600">Liên hệ: <a href="mailto:admin@bookingsport.vn" className="text-teal-600 hover:text-teal-700 font-medium">admin@bookingsport.vn</a></p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="flex gap-3">
                  <Button onClick={onClose} className="flex-1 h-11 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold">Đã hiểu</Button>
               </div>

               <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600 text-center leading-relaxed">Bạn có thể thử đăng nhập lại sau khi tài khoản được phê duyệt. Cảm ơn bạn đã kiên nhẫn!</p>
               </div>
            </div>
         </div>
      </div>
   );
}

export default PendingModal;
