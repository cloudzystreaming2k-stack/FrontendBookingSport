import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Alert, AlertDescription } from "../ui/alert";
import { Lock, Phone, Calendar } from "lucide-react";
import api from "../../lib/api";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onCompleted: () => void;
}

export function GoogleCompleteProfileModal({ open, onCompleted }: Props) {
  const [form, setForm] = useState({
    phone: "",
    gender: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const validate = () => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!form.phone || !form.gender || !form.dateOfBirth || !form.password) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return false;
    }
    if (!phoneRegex.test(form.phone.replace(/\s/g, ""))) {
      setError("Số điện thoại không hợp lệ (phải là 10 chữ số).");
      return false;
    }
    if (form.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError("Xác nhận mật khẩu không khớp.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post("/auth/update-profile", {
        phone: form.phone,
        gender: form.gender,
        dateOfBirth: form.dateOfBirth,
        password: form.password,
      });
      toast.success("Hoàn thiện hồ sơ thành công! Chào mừng bạn!");
      onCompleted();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Đã có lỗi xảy ra.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">🎉 Chào mừng! Hoàn thiện hồ sơ</DialogTitle>
          <DialogDescription>
            Bạn đã đăng nhập bằng Google thành công. Vui lòng bổ sung thêm một số thông tin để hoàn tất tài khoản.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="cp-phone">Số điện thoại</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="cp-phone"
                type="tel"
                placeholder="0901234567"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Giới tính</Label>
              <Select value={form.gender} onValueChange={(v) => handleChange("gender", v)} disabled={loading}>
                <SelectTrigger>
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
              <Label htmlFor="cp-dob">Ngày sinh</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="cp-dob"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                  className="pl-10"
                  disabled={loading}
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cp-password">Đặt mật khẩu</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="cp-password"
                type="password"
                placeholder="Ít nhất 6 ký tự"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cp-confirm">Xác nhận mật khẩu</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="cp-confirm"
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={form.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Đang lưu..." : "Hoàn tất đăng ký"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
