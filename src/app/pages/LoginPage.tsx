import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "../components/ui/dialog";
import { useAuth } from "../contexts/AuthContext";
import { Eye, EyeOff, Lock, Mail, LogIn, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useGoogleLogin } from "@react-oauth/google";
import { GoogleCompleteProfileModal } from "../components/auth/GoogleCompleteProfileModal";
import FacebookLogin from "@greatsumini/react-facebook-login";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, googleLogin, facebookLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  const [showInactiveModal, setShowInactiveModal] = useState(false);

  // Get redirect path from location state
  const from = (location.state as any)?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setLoading(true);
    try {
      // Pass `true` as the 3rd argument to throw errors when catching HTTP requests
      const success = await login(email, password, true);
      if (success) {
        toast.success("Đăng nhập thành công!");
        navigate(from, { replace: true });
      } else {
        setError("Email hoặc mật khẩu không chính xác");
        toast.error("Đăng nhập thất bại");
      }
    } catch (err: any) {
      const message = err.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.";
      
      if (err.response?.status === 403 && message.toLowerCase().includes("khóa")) {
        setShowInactiveModal(true);
      } else {
        setError(message);
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (tokenResponse: any) => {
    if (!tokenResponse.access_token) return;
    setLoading(true);
    try {
      const { isNew } = await googleLogin(tokenResponse.access_token);
      if (isNew) {
        setShowCompleteProfile(true);
      } else {
        toast.success("Đăng nhập bằng Google thành công!");
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(err.message || "Đăng nhập Google thất bại.");
      toast.error("Đăng nhập Google thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => {
      setError("Đăng nhập Google thất bại. Vui lòng thử lại.");
      toast.error("Đăng nhập Google thất bại.");
    }
  });

  const handleFacebookSuccess = async (response: any) => {
    if (!response.accessToken) return;
    setLoading(true);
    try {
      const { isNew } = await facebookLogin(response.accessToken);
      if (isNew) {
        setShowCompleteProfile(true);
      } else {
        toast.success("Đăng nhập bằng Facebook thành công!");
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(err.message || "Đăng nhập Facebook thất bại.");
      toast.error("Đăng nhập Facebook thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center mb-4">
            <LogIn className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl">Đăng nhập</CardTitle>
          <CardDescription>
            Đăng nhập vào tài khoản của bạn để tiếp tục
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Đăng nhập với tài khoản thực tế - Demo accounts đả được xóa */}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mật khẩu</Label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-blue-600 hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
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
              onClick={() => loginWithGoogle()}
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
              Đăng nhập với Google
            </Button>
            <FacebookLogin
              appId={import.meta.env.VITE_FACEBOOK_APP_ID}
              onSuccess={handleFacebookSuccess}
              onFail={(error) => {
                console.error("Facebook login failed", error);
                setError("Đăng nhập Facebook thất bại. Vui lòng thử lại.");
                toast.error("Đăng nhập Facebook thất bại.");
              }}
              onProfileSuccess={(response) => {
                console.log('Get Profile Success!', response);
              }}
              render={({ onClick }) => (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={onClick}
                  disabled={loading}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                      fill="#1877F2"
                    />
                  </svg>
                  Đăng nhập với Facebook
                </Button>
              )}
            />
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
            Chưa có tài khoản?{" "}
            <Link to="/register" className="text-blue-600 hover:underline font-semibold">
              Đăng ký ngay
            </Link>
          </div>
        </CardFooter>
      </Card>

      <GoogleCompleteProfileModal
        open={showCompleteProfile}
        onCompleted={() => {
          setShowCompleteProfile(false);
          toast.success("Đã hoàn thiện hồ sơ! Chào mừng bạn đến SportBooking!");
          navigate(from, { replace: true });
        }}
      />

      {/* Modal Tài khoản bị khóa */}
      <Dialog open={showInactiveModal} onOpenChange={setShowInactiveModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 mt-2">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <DialogTitle className="text-center text-xl text-red-600">Tài khoản bị vô hiệu hóa</DialogTitle>
            <DialogDescription className="text-center text-base mt-2 pt-2 text-gray-700">
              Tài khoản của bạn đã dừng hoạt động. Bạn không thể đăng nhập vào hệ thống lúc này.
              <br /><br />
              Vui lòng liên hệ với Admin qua email <span className="font-semibold text-gray-900">admin@bookingsport.vn</span> hoặc Hotline <span className="font-semibold text-gray-900">1900 1234</span> để được hỗ trợ mở lại tài khoản.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center mt-6">
            <Button onClick={() => setShowInactiveModal(false)} className="bg-red-600 hover:bg-red-700 w-full sm:w-auto px-8">
              Đã hiểu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}