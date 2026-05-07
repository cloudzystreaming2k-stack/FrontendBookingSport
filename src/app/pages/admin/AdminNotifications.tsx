import { useState } from "react";
import { Send, Info, Megaphone, Bell as BellIcon, AlertCircle } from "lucide-react";
import { toast } from "sonner";

type NotificationType = "promotion" | "system";

interface NotificationForm {
   type: NotificationType;
   title: string;
   content: string;
}

export function AdminNotifications() {
   const [form, setForm] = useState<NotificationForm>({
      type: "promotion",
      title: "",
      content: "",
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (!form.title.trim() || !form.content.trim()) {
         toast.error("Vui lòng điền đầy đủ thông tin");
         return;
      }

      // Giả lập gửi thông báo
      toast.success("Đã gửi thông báo thành công!", {
         description: `Thông báo "${form.title}" đã được gửi đến tất cả người dùng`,
         duration: 5000,
      });

      // Reset form
      setForm({
         type: "promotion",
         title: "",
         content: "",
      });
   };

   return (
      <div className="max-w-7xl mx-auto">
         <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Quản lý thông báo</h1>
            <p className="text-gray-600 mt-1">Gửi thông báo đến tất cả người dùng</p>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form gửi thông báo */}
            <div className="lg:col-span-2">
               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-6">
                     <BellIcon className="w-5 h-5 text-teal-600" />
                     <h2 className="text-lg font-semibold text-gray-900">Gửi thông báo mới</h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                     {/* Loại thông báo */}
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                           Loại thông báo
                        </label>
                        <div className="flex gap-3">
                           <button
                              type="button"
                              onClick={() => setForm({ ...form, type: "promotion" })}
                              className={`flex-1 px-4 py-2.5 rounded-lg border-2 transition-all ${form.type === "promotion"
                                    ? "border-teal-600 bg-teal-50 text-teal-700"
                                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                                 }`}
                           >
                              <div className="flex items-center justify-center gap-2">
                                 <Megaphone className="w-4 h-4" />
                                 <span className="font-medium">Khuyến mãi</span>
                              </div>
                           </button>
                           <button
                              type="button"
                              onClick={() => setForm({ ...form, type: "system" })}
                              className={`flex-1 px-4 py-2.5 rounded-lg border-2 transition-all ${form.type === "system"
                                    ? "border-blue-600 bg-blue-50 text-blue-700"
                                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                                 }`}
                           >
                              <div className="flex items-center justify-center gap-2">
                                 <Info className="w-4 h-4" />
                                 <span className="font-medium">Hệ thống</span>
                              </div>
                           </button>
                        </div>
                     </div>

                     {/* Tiêu đề */}
                     <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                           Tiêu đề
                        </label>
                        <input
                           type="text"
                           id="title"
                           value={form.title}
                           onChange={(e) => setForm({ ...form, title: e.target.value })}
                           placeholder="Giảm 50%"
                           className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                     </div>

                     {/* Nội dung */}
                     <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                           Nội dung
                        </label>
                        <textarea
                           id="content"
                           value={form.content}
                           onChange={(e) => setForm({ ...form, content: e.target.value })}
                           placeholder="mã giảm giá : sale"
                           rows={5}
                           className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                        />
                     </div>

                     {/* Nút gửi */}
                     <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                     >
                        <Send className="w-5 h-5" />
                        Gửi thông báo đến tất cả
                     </button>
                  </form>
               </div>
            </div>

            {/* Hướng dẫn */}
            <div className="lg:col-span-1">
               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Hướng dẫn</h3>

                  <div className="space-y-4">
                     {/* Thông báo khuyến mãi */}
                     <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                           <Megaphone className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                           <div>
                              <h4 className="font-semibold text-green-900 mb-1">
                                 Thông báo khuyến mãi
                              </h4>
                              <p className="text-sm text-green-700">
                                 Dùng để gửi các chương trình ưu đãi, giảm giá, sự kiện đặc biệt.
                              </p>
                           </div>
                        </div>
                     </div>

                     {/* Thông báo hệ thống */}
                     <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                           <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                           <div>
                              <h4 className="font-semibold text-blue-900 mb-1">
                                 Thông báo hệ thống
                              </h4>
                              <p className="text-sm text-blue-700">
                                 Dùng để thông báo bảo trì, cập nhật tính năng, thông tin quan trọng.
                              </p>
                           </div>
                        </div>
                     </div>

                     {/* Lưu ý */}
                     <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                           <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                           <div>
                              <h4 className="font-semibold text-red-900 mb-2">Lưu ý</h4>
                              <ul className="text-sm text-red-700 space-y-1.5">
                                 <li className="flex items-start gap-2">
                                    <span className="mt-1.5 w-1 h-1 bg-red-600 rounded-full flex-shrink-0"></span>
                                    <span>Thông báo sẽ được gửi đến tất cả người dùng</span>
                                 </li>
                                 <li className="flex items-start gap-2">
                                    <span className="mt-1.5 w-1 h-1 bg-red-600 rounded-full flex-shrink-0"></span>
                                    <span>Người dùng online sẽ nhận thông báo ngay lập tức (real-time)</span>
                                 </li>
                                 <li className="flex items-start gap-2">
                                    <span className="mt-1.5 w-1 h-1 bg-red-600 rounded-full flex-shrink-0"></span>
                                    <span>Người dùng offline sẽ thấy thông báo khi đăng nhập</span>
                                 </li>
                              </ul>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
