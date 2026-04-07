import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card, CardContent } from "../../../components/ui/card";
import { Link } from "react-router";
import { LoginMode } from "./auth.types";

interface LoginFormProps {
   loginMode: LoginMode;
   showPassword: boolean;
   setShowPassword: (v: boolean) => void;
   isLoading: boolean;
   formData: { email: string; password: string };
   errors: { email: string; password: string };
   handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
   handleSubmit: (e: React.FormEvent) => Promise<void>;
   switchMode: (mode: LoginMode) => void;
}

export function LoginForm({ loginMode, showPassword, setShowPassword, isLoading, formData, errors, handleChange, handleSubmit, switchMode }: LoginFormProps) {
   return (
      <div className="flex-1 flex items-center justify-center p-8">
         <div className="w-full max-w-md">
            <div className="lg:hidden mb-8 text-center">
               <div className="inline-flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                     <svg className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-left">
                     <h1 className="text-2xl font-bold text-white">BookingSport</h1>
                     <p className="text-sm text-white/80">Hệ Thống Quản Trị</p>
                  </div>
               </div>
            </div>

            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
               <CardContent className="p-8">
                  <div className="flex gap-2 mb-8 p-1 bg-gray-100 rounded-lg">
                     <button
                        type="button"
                        onClick={() => switchMode("admin")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all ${loginMode === "admin"
                              ? "bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md"
                              : "text-gray-600 hover:text-gray-900"
                           }`}
                     >
                        <svg className="w-5 h-5" />
                        Quản Trị Viên
                     </button>
                     <button
                        type="button"
                        onClick={() => switchMode("owner")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all ${loginMode === "owner"
                              ? "bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md"
                              : "text-gray-600 hover:text-gray-900"
                           }`}
                     >
                        <svg className="w-5 h-5" />
                        Chủ Sân
                     </button>
                  </div>

                  <div className="mb-8">
                     <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {loginMode === "admin" ? "Đăng Nhập Admin" : "Đăng Nhập Chủ Sân"}
                     </h2>
                     <p className="text-gray-600">
                        {loginMode === "admin"
                           ? "Nhập thông tin đăng nhập để truy cập quản trị"
                           : "Nhập thông tin đăng nhập để quản lý sân của bạn"
                        }
                     </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                           Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                           <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                           <Input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder={loginMode === "admin" ? "admin@bookingsport.vn" : "owner@sportcourt.vn"}
                              className={`pl-10 h-12 ${errors.email ? 'border-red-500' : ''}`}
                           />
                        </div>
                        {errors.email && (
                           <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                           Mật khẩu <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                           <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                           <Input
                              type={showPassword ? "text" : "password"}
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              placeholder="••••••••"
                              className={`pl-10 pr-10 h-12 ${errors.password ? 'border-red-500' : ''}`}
                           />
                           <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                           >
                              {showPassword ? (
                                 <EyeOff className="w-5 h-5" />
                              ) : (
                                 <Eye className="w-5 h-5" />
                              )}
                           </button>
                        </div>
                        {errors.password && (
                           <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                        )}
                     </div>

                     <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                           <input
                              type="checkbox"
                              className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                           />
                           <span className="text-sm text-gray-700">Ghi nhớ đăng nhập</span>
                        </label>
                        <Link
                           to="/admin/forgot-password"
                           className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                        >
                           Quên mật khẩu?
                        </Link>
                     </div>

                     <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold mb-3"
                     >
                        {isLoading ? (
                           <div className="flex items-center gap-2">
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Đang xử lý...
                           </div>
                        ) : (
                           <div className="flex items-center gap-2">
                              Đăng nhập hệ thống
                              <ArrowRight className="w-5 h-5" />
                           </div>
                        )}
                     </Button>
                  </form>

                  <button
                     type="button"
                     disabled={isLoading}
                     className="w-full h-12 flex items-center justify-center gap-3 bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg font-semibold text-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                     </svg>
                     Đăng nhập với Google
                  </button>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                     <p className="text-center text-sm text-gray-600">
                        {loginMode === "owner" ? (
                           <>
                              Bạn muốn đăng ký làm chủ sân? <Link to="/owner/register" className="text-teal-600 hover:text-teal-700 font-semibold">Đăng ký ngay</Link>
                           </>
                        ) : (
                           <>
                              Bạn là người dùng? <Link to="/login" className="text-teal-600 hover:text-teal-700 font-semibold">Đăng nhập tại đây</Link>
                           </>
                        )}
                     </p>
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                     <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                        <div className="text-xs text-gray-600 leading-relaxed">
                           Trang đăng nhập này dành riêng cho {loginMode === "admin" ? "quản trị viên hệ thống" : "chủ sân thể thao"}. Mọi hoạt động đăng nhập đều được ghi lại và giám sát.
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <div className="mt-6 text-center">
               <p className="text-sm text-white/80">Cần hỗ trợ? Liên hệ: <a href="mailto:admin@bookingsport.vn" className="text-teal-400 hover:text-teal-300 font-medium">admin@bookingsport.vn</a></p>
            </div>
         </div>
      </div>
   );
}

export default LoginForm;
