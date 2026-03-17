import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Checkbox } from "../components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useAuth } from "../contexts/AuthContext";
import { Eye, EyeOff, Lock, Mail, User as UserIcon, Phone, UserPlus, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useGoogleLogin } from "@react-oauth/google";
import { GoogleCompleteProfileModal } from "../components/auth/GoogleCompleteProfileModal";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, googleLogin } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "",
    dateOfBirth: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.gender || !formData.dateOfBirth) {
      setError("Vui lòng nhập đầy đủ thông tin (Kể cả ngày sinh, giới tính)");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
      setError("Số điện thoại không hợp lệ");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Email không hợp lệ");
      return false;
    }

    if (!acceptTerms) {
      setError("Vui lòng đồng ý với điều khoản sử dụng");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.phone,
        formData.gender,
        formData.dateOfBirth
      );
      toast.success("Đăng ký thành công! Chào mừng bạn đến với SportBooking!");
      navigate("/", { replace: true });
    } catch (err: any) {
      const message = err.message || "Email này đã được đăng ký. Vui lòng sử dụng email khác.";
      setError(message);
      toast.error("Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(""); // Clear error when user types
  };

  const handleGoogleSignup = async (tokenResponse: any) => {
    if (!tokenResponse.access_token) return;
    setLoading(true);
    try {
      const { isNew } = await googleLogin(tokenResponse.access_token);
      if (isNew) {
        setShowCompleteProfile(true);
      } else {
        toast.success("Đăng nhập bằng Google thành công!");
        navigate("/");
      }
    } catch (err: any) {
      setError(err.message || "Đăng ký Google thất bại.");
      toast.error("Đăng ký Google thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const signupWithGoogle = useGoogleLogin({
    onSuccess: handleGoogleSignup,
    onError: () => {
      setError("Đăng ký Google thất bại. Vui lòng thử lại.");
      toast.error("Đăng ký Google thất bại.");
    }
  });

  const handleFacebookSignup = () => {
    // Mock Facebook signup - in production, this would redirect to Facebook OAuth
    toast.info("Chức năng đăng ký với Facebook đang được phát triển");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center mb-4">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl">Đăng ký tài khoản</CardTitle>
          <CardDescription>
            Tạo tài khoản mới để bắt đầu đặt sân
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Họ và tên</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0901234567"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Giới tính</Label>
                <Select value={formData.gender} onValueChange={(value) => handleChange("gender", value)} disabled={loading}>
                  <SelectTrigger className="w-full h-10">
                    <SelectValue placeholder="Chọn" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Nam</SelectItem>
                    <SelectItem value="female">Nữ</SelectItem>
                    <SelectItem value="other">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                    className="pl-10 h-10"
                    disabled={loading}
                    max={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="pl-10 pr-10"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500">Mật khẩu phải có ít nhất 6 ký tự</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  className="pl-10 pr-10"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                disabled={loading}
              />
              <label
                htmlFor="terms"
                className="text-sm text-gray-600 leading-tight cursor-pointer"
              >
                Tôi đồng ý với{" "}
                <Link to="/terms" className="text-blue-600 hover:underline">
                  Điều khoản sử dụng
                </Link>{" "}
                và{" "}
                <Link to="/privacy" className="text-blue-600 hover:underline">
                  Chính sách bảo mật
                </Link>
              </label>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Đang đăng ký..." : "Đăng ký"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">hoặc</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => signupWithGoogle()}
              disabled={loading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Đăng ký với Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleFacebookSignup}
              disabled={loading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none">
                <path
                  d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                  fill="#1877F2"
                />
              </svg>
              Đăng ký với Facebook
            </Button>
          </CardContent>
        </form>
        <CardFooter className="flex flex-col space-y-4">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">hoặc</span>
            </div>
          </div>
          <div className="text-center text-sm text-gray-600">
            Đã có tài khoản?{" "}
            <Link to="/login" className="text-blue-600 hover:underline font-semibold">
              Đăng nhập
            </Link>
          </div>
        </CardFooter>
      </Card>

      <GoogleCompleteProfileModal
        open={showCompleteProfile}
        onCompleted={() => {
          setShowCompleteProfile(false);
          toast.success("Đã hoàn thiện hồ sơ! Chào mừng bạn đến SportBooking!");
          navigate("/");
        }}
      />
    </div>
  );
}