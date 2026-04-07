// import { useState } from "react";
// import { useNavigate, Link } from "react-router";
// import { 
//   Shield, Lock, Mail, Eye, EyeOff, 
//   ArrowRight, AlertCircle, CheckCircle2, Building2, UserCog, Clock, XCircle
// } from "lucide-react";
// import { Button } from "../../components/ui/button";
// import { Input } from "../../components/ui/input";
// import { Card, CardContent } from "../../components/ui/card";
// import { Alert, AlertDescription } from "../../components/ui/alert";
// import { useAuth } from "../../contexts/AuthContext";
// import { toast } from "sonner";

// type LoginMode = "admin" | "owner";

// export function AdminLoginPage() {
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const [loginMode, setLoginMode] = useState<LoginMode>("admin");
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPendingModal, setShowPendingModal] = useState(false);
//   const [pendingOwnerData, setPendingOwnerData] = useState<{
//     name: string;
//     email: string;
//   } | null>(null);
//   const [formData, setFormData] = useState({
//     email: "",
//     password: ""
//   });
//   const [errors, setErrors] = useState({
//     email: "",
//     password: ""
//   });

//   const validateForm = () => {
//     let isValid = true;
//     const newErrors = { email: "", password: "" };

//     if (!formData.email) {
//       newErrors.email = "Email là bắt buộc";
//       isValid = false;
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Email không hợp lệ";
//       isValid = false;
//     }

//     if (!formData.password) {
//       newErrors.password = "Mật khẩu là bắt buộc";
//       isValid = false;
//     } else if (formData.password.length < 6) {
//       newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
//       isValid = false;
//     }

//     setErrors(newErrors);
//     return isValid;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     setIsLoading(true);

//     if (loginMode === "admin") {
//       try {
//         const success = await login(formData.email, formData.password, true);
//         if (success) {
//           toast.success("Đăng nhập Admin thành công!", {
//             description: "Chào mừng hệ thống quản trị viên"
//           });
//           navigate("/admin");
//         }
//       } catch (error: any) {
//         toast.error("Đăng nhập thất bại", {
//           description: error.response?.data?.message || "Email hoặc mật khẩu không chính xác"
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     } else {
//       try {
//         const success = await login(formData.email, formData.password, true);
//         if (success) {
//           toast.success("Đăng nhập Chủ Sân thành công!", {
//             description: "Chào mừng bạn đến với bảng quản lý sân"
//           });
//           navigate("/owner");
//         }
//       } catch (error: any) {
//         const statusCode = error.response?.status;
//         const errorMessage = error.response?.data?.message || "";

//         if (statusCode === 403 && errorMessage.toLowerCase().includes("chờ admin phê duyệt")) {
//           setPendingOwnerData({
//             name: formData.email.split('@')[0],
//             email: formData.email
//           });
//           setShowPendingModal(true);
//         } else {
//           toast.error("Đăng nhập thất bại", {
//             description: errorMessage || "Email hoặc mật khẩu không chính xác"
//           });
//         }
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     // Clear error when user starts typing
//     if (errors[name as keyof typeof errors]) {
//       setErrors(prev => ({ ...prev, [name]: "" }));
//     }
//   };

//   const switchMode = (mode: LoginMode) => {
//     setLoginMode(mode);
//     setFormData({ email: "", password: "" });
//     setErrors({ email: "", password: "" });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex">
//       {/* Left Side - Branding */}
//       <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-br from-teal-600/20 to-blue-600/20 z-10"></div>
//         <img
//           src="https://images.unsplash.com/photo-1711720743865-10787dd6934a?w=1200&h=1200&fit=crop"
//           alt="Office building"
//           className="absolute inset-0 w-full h-full object-cover"
//         />
//         <div className="relative z-20 flex flex-col justify-between p-12 text-white">
//           <div>
//             <div className="flex items-center gap-3 mb-8">
//               <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
//                 <Shield className="w-7 h-7 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold">BookingSport</h1>
//                 <p className="text-sm text-white/80">Hệ Thống Quản Trị</p>
//               </div>
//             </div>
//           </div>

//           <div className="space-y-6">
//             <h2 className="text-4xl font-bold leading-tight">
//               {loginMode === "admin" ? (
//                 <>Quản lý sân thể thao<br />một cách chuyên nghiệp</>
//               ) : (
//                 <>Quản lý sân của bạn<br />hiệu quả và dễ dàng</>
//               )}
//             </h2>
//             <p className="text-lg text-white/80">
//               {loginMode === "admin" 
//                 ? "Truy cập vào bảng điều khiển quản trị để quản lý sân, đặt lịch, thanh toán và nhiều hơn nữa."
//                 : "Theo dõi lịch đặt sân, quản lý doanh thu và khách hàng của sân thể thao một cách dễ dàng."
//               }
//             </p>

//             {/* Features */}
//             <div className="space-y-4 pt-8">
//               {loginMode === "admin" ? (
//                 <>
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
//                       <CheckCircle2 className="w-5 h-5 text-teal-400" />
//                     </div>
//                     <span className="text-white/90">Quản lý 500+ sân thể thao</span>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
//                       <CheckCircle2 className="w-5 h-5 text-teal-400" />
//                     </div>
//                     <span className="text-white/90">Theo dõi đặt sân real-time</span>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
//                       <CheckCircle2 className="w-5 h-5 text-teal-400" />
//                     </div>
//                     <span className="text-white/90">Báo cáo doanh thu chi tiết</span>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
//                       <CheckCircle2 className="w-5 h-5 text-teal-400" />
//                     </div>
//                     <span className="text-white/90">Quản lý lịch đặt sân dễ dàng</span>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
//                       <CheckCircle2 className="w-5 h-5 text-teal-400" />
//                     </div>
//                     <span className="text-white/90">Theo dõi doanh thu theo thời gian thực</span>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
//                       <CheckCircle2 className="w-5 h-5 text-teal-400" />
//                     </div>
//                     <span className="text-white/90">Quản lý khách hàng và đánh giá</span>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>

//           <div className="text-sm text-white/60">
//             © 2024 BookingSport. All rights reserved.
//           </div>
//         </div>
//       </div>

//       {/* Right Side - Login Form */}
//       <div className="flex-1 flex items-center justify-center p-8">
//         <div className="w-full max-w-md">
//           {/* Mobile Logo */}
//           <div className="lg:hidden mb-8 text-center">
//             <div className="inline-flex items-center gap-3 mb-4">
//               <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
//                 <Shield className="w-7 h-7 text-white" />
//               </div>
//               <div className="text-left">
//                 <h1 className="text-2xl font-bold text-white">BookingSport</h1>
//                 <p className="text-sm text-white/80">Hệ Thống Quản Trị</p>
//               </div>
//             </div>
//           </div>

//           <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
//             <CardContent className="p-8">
//               {/* Login Mode Tabs */}
//               <div className="flex gap-2 mb-8 p-1 bg-gray-100 rounded-lg">
//                 <button
//                   type="button"
//                   onClick={() => switchMode("admin")}
//                   className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all ${
//                     loginMode === "admin"
//                       ? "bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md"
//                       : "text-gray-600 hover:text-gray-900"
//                   }`}
//                 >
//                   <UserCog className="w-5 h-5" />
//                   Quản Trị Viên
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => switchMode("owner")}
//                   className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all ${
//                     loginMode === "owner"
//                       ? "bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md"
//                       : "text-gray-600 hover:text-gray-900"
//                   }`}
//                 >
//                   <Building2 className="w-5 h-5" />
//                   Chủ Sân
//                 </button>
//               </div>

//               <div className="mb-8">
//                 <h2 className="text-3xl font-bold text-gray-900 mb-2">
//                   {loginMode === "admin" ? "Đăng Nhập Admin" : "Đăng Nhập Chủ Sân"}
//                 </h2>
//                 <p className="text-gray-600">
//                   {loginMode === "admin"
//                     ? "Nhập thông tin đăng nhập để truy cập quản trị"
//                     : "Nhập thông tin đăng nhập để quản lý sân của bạn"
//                   }
//                 </p>
//               </div>

//               {/* Demo Credentials Alert */}
//               {/* <Alert className="mb-6 bg-blue-50 border-blue-200">
//                 <AlertCircle className="h-4 w-4 text-blue-600" />
//                 <AlertDescription className="text-sm text-blue-800">
//                   {loginMode === "admin" ? (
//                     <><strong>Demo Admin:</strong> admin@bookingsport.vn / admin123</>
//                   ) : (
//                     <div className="space-y-1">
//                       <div><strong>Demo Chủ Sân (Đã duyệt):</strong> owner@sportcourt.vn / owner123</div>
//                       <div><strong>Demo Chủ Sân (Chờ duyệt):</strong> pending@sportcourt.vn / pending123</div>
//                     </div>
//                   )}
//                 </AlertDescription>
//               </Alert> */}

//               <form onSubmit={handleSubmit} className="space-y-5">
//                 {/* Email Field */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Email <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                     <Input
//                       type="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       placeholder={loginMode === "admin" ? "admin@bookingsport.vn" : "owner@sportcourt.vn"}
//                       className={`pl-10 h-12 ${errors.email ? 'border-red-500' : ''}`}
//                     />
//                   </div>
//                   {errors.email && (
//                     <p className="mt-1 text-sm text-red-600">{errors.email}</p>
//                   )}
//                 </div>

//                 {/* Password Field */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Mật khẩu <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                     <Input
//                       type={showPassword ? "text" : "password"}
//                       name="password"
//                       value={formData.password}
//                       onChange={handleChange}
//                       placeholder="••••••••"
//                       className={`pl-10 pr-10 h-12 ${errors.password ? 'border-red-500' : ''}`}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                     >
//                       {showPassword ? (
//                         <EyeOff className="w-5 h-5" />
//                       ) : (
//                         <Eye className="w-5 h-5" />
//                       )}
//                     </button>
//                   </div>
//                   {errors.password && (
//                     <p className="mt-1 text-sm text-red-600">{errors.password}</p>
//                   )}
//                 </div>

//                 {/* Remember & Forgot */}
//                 <div className="flex items-center justify-between">
//                   <label className="flex items-center gap-2 cursor-pointer">
//                     <input
//                       type="checkbox"
//                       className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
//                     />
//                     <span className="text-sm text-gray-700">Ghi nhớ đăng nhập</span>
//                   </label>
//                   <Link
//                     to="/admin/forgot-password"
//                     className="text-sm text-teal-600 hover:text-teal-700 font-medium"
//                   >
//                     Quên mật khẩu?
//                   </Link>
//                 </div>

//                 {/* Submit Button */}
//                 <Button
//                   type="submit"
//                   disabled={isLoading}
//                   className="w-full h-12 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold mb-3"
//                 >
//                   {isLoading ? (
//                     <div className="flex items-center gap-2">
//                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                       Đang xử lý...
//                     </div>
//                   ) : (
//                     <div className="flex items-center gap-2">
//                       Đăng nhập hệ thống
//                       <ArrowRight className="w-5 h-5" />
//                     </div>
//                   )}
//                 </Button>
//               </form>

//                             {/* Google Sign In Button */}
//               <button
//                 type="button"
//                 // onClick={handleGoogleLogin}
//                 disabled={isLoading}
//                 className="w-full h-12 flex items-center justify-center gap-3 bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg font-semibold text-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <svg className="w-5 h-5" viewBox="0 0 24 24">
//                   <path
//                     fill="#4285F4"
//                     d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                   />
//                   <path
//                     fill="#34A853"
//                     d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                   />
//                   <path
//                     fill="#FBBC05"
//                     d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                   />
//                   <path
//                     fill="#EA4335"
//                     d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                   />
//                 </svg>
//                 Đăng nhập với Google
//               </button>

//               {/* Divider */}
//               <div className="mt-8 pt-6 border-t border-gray-200">
//                 <p className="text-center text-sm text-gray-600">
//                   {loginMode === "owner" ? (
//                     <>
//                       Bạn muốn đăng ký làm chủ sân?{" "}
//                       <Link to="/owner/register" className="text-teal-600 hover:text-teal-700 font-semibold">
//                         Đăng ký ngay
//                       </Link>
//                     </>
//                   ) : (
//                     <>
//                       Bạn là người dùng?{" "}
//                       <Link to="/login" className="text-teal-600 hover:text-teal-700 font-semibold">
//                         Đăng nhập tại đây
//                       </Link>
//                     </>
//                   )}
//                 </p>
//               </div>

//               {/* Security Notice */}
//               <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
//                 <div className="flex items-start gap-3">
//                   <Shield className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
//                   <div className="text-xs text-gray-600 leading-relaxed">
//                     Trang đăng nhập này dành riêng cho {loginMode === "admin" ? "quản trị viên hệ thống" : "chủ sân thể thao"}. 
//                     Mọi hoạt động đăng nhập đều được ghi lại và giám sát.
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Help Text */}
//           <div className="mt-6 text-center">
//             <p className="text-sm text-white/80">
//               Cần hỗ trợ? Liên hệ:{" "}
//               <a href="mailto:admin@bookingsport.vn" className="text-teal-400 hover:text-teal-300 font-medium">
//                 admin@bookingsport.vn
//               </a>
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Pending Approval Modal */}
//       {showPendingModal && pendingOwnerData && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in duration-200">
//             {/* Header with gradient background */}
//             <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-8 text-center relative">
//               <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
//               <div className="relative">
//                 <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white/30">
//                   <Clock className="w-10 h-10 text-white" />
//                 </div>
//                 <h2 className="text-2xl font-bold text-white mb-2">
//                   Tài Khoản Đang Chờ Duyệt
//                 </h2>
//                 <p className="text-white/90 text-sm">
//                   Xin vui lòng chờ admin phê duyệt
//                 </p>
//               </div>
//             </div>

//             {/* Content */}
//             <div className="p-8">
//               <div className="mb-6 space-y-4">
//                 <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
//                   <div className="flex items-start gap-3">
//                     <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
//                     <div className="flex-1">
//                       <p className="text-sm text-amber-900 leading-relaxed">
//                         <strong>Xin chào {pendingOwnerData.name}!</strong>
//                         <br />
//                         Tài khoản chủ sân của bạn đã được đăng ký thành công nhưng hiện đang trong quá trình xem xét.
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-3">
//                   <div className="flex items-start gap-3">
//                     <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
//                       <CheckCircle2 className="w-4 h-4 text-teal-600" />
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-900">Thời gian xét duyệt</p>
//                       <p className="text-sm text-gray-600">Trong vòng 24-48 giờ làm việc</p>
//                     </div>
//                   </div>

//                   <div className="flex items-start gap-3">
//                     <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
//                       <CheckCircle2 className="w-4 h-4 text-teal-600" />
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-900">Thông báo qua email</p>
//                       <p className="text-sm text-gray-600">
//                         Chúng tôi sẽ gửi thông báo đến <span className="font-medium text-teal-600">{pendingOwnerData.email}</span>
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex items-start gap-3">
//                     <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
//                       <CheckCircle2 className="w-4 h-4 text-teal-600" />
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-900">Hỗ trợ</p>
//                       <p className="text-sm text-gray-600">
//                         Liên hệ: <a href="mailto:admin@bookingsport.vn" className="text-teal-600 hover:text-teal-700 font-medium">admin@bookingsport.vn</a>
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex gap-3">
//                 <Button
//                   onClick={() => {
//                     setShowPendingModal(false);
//                     setPendingOwnerData(null);
//                     setFormData({ email: "", password: "" });
//                   }}
//                   className="flex-1 h-11 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold"
//                 >
//                   Đã hiểu
//                 </Button>
//               </div>

//               <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
//                 <p className="text-xs text-gray-600 text-center leading-relaxed">
//                   Bạn có thể thử đăng nhập lại sau khi tài khoản được phê duyệt. 
//                   Cảm ơn bạn đã kiên nhẫn!
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }