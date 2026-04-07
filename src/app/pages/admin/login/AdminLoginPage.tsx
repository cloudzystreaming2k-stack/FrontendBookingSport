import { useState } from "react";
import { useNavigate } from "react-router";
import BrandingPanel from "./BrandingPanel";
import LoginForm from "./LoginForm";
import PendingModal from "./PendingModal";
import { useAuth } from "../../../contexts/AuthContext";
import { toast } from "sonner";
import { LoginMode } from "./auth.types";

export function AdminLoginPage() {
   const navigate = useNavigate();
   const { login } = useAuth();
   const [loginMode, setLoginMode] = useState<LoginMode>("admin");
   const [showPassword, setShowPassword] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [showPendingModal, setShowPendingModal] = useState(false);
   const [pendingOwnerData, setPendingOwnerData] = useState<{ name: string; email: string } | null>(null);
   const [formData, setFormData] = useState({ email: "", password: "" });
   const [errors, setErrors] = useState({ email: "", password: "" });

   const validateForm = () => {
      let isValid = true;
      const newErrors = { email: "", password: "" };

      if (!formData.email) {
         newErrors.email = "Email là bắt buộc";
         isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
         newErrors.email = "Email không hợp lệ";
         isValid = false;
      }

      if (!formData.password) {
         newErrors.password = "Mật khẩu là bắt buộc";
         isValid = false;
      } else if (formData.password.length < 6) {
         newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
         isValid = false;
      }

      setErrors(newErrors);
      return isValid;
   };

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const switchMode = (mode: LoginMode) => {
      setLoginMode(mode);
      setFormData({ email: "", password: "" });
      setErrors({ email: "", password: "" });
   };

   const handleSubmit = async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();

      if (!validateForm()) return;

      setIsLoading(true);
      try {
         const ok = await login(formData.email, formData.password, true);
         if (ok) {
            toast.success("Đăng nhập thành công");
            navigate(loginMode === "admin" ? "/admin" : "/owner/dashboard");
         } else {
            toast.error("Đăng nhập thất bại");
         }
      } catch (err: any) {
         const message = err?.response?.data?.message || err?.message || "Đăng nhập thất bại";
         if (typeof message === "string" && (message.toLowerCase().includes("pending") || message.includes("chờ"))) {
            setPendingOwnerData({ name: formData.email.split("@")[0], email: formData.email });
            setShowPendingModal(true);
         } else {
            toast.error(message);
         }
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex">
         <BrandingPanel loginMode={loginMode} />

         <LoginForm
            loginMode={loginMode}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            isLoading={isLoading}
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            switchMode={switchMode}
         />

         <PendingModal
            open={showPendingModal}
            pendingOwnerData={pendingOwnerData}
            onClose={() => {
               setShowPendingModal(false);
               setPendingOwnerData(null);
               setFormData({ email: "", password: "" });
            }}
         />
      </div>
   );
}

export default AdminLoginPage;
