import { User, Mail, Phone, Lock, Calendar } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import type { UserData, PasswordData } from "../types";

interface Props {
  userData: UserData;
  setUserData: (data: UserData) => void;
  handleUpdateProfile: () => void;
  passwordData: PasswordData;
  setPasswordData: (data: PasswordData) => void;
  handleChangePassword: () => void;
}

export function AccountTab({
  userData,
  setUserData,
  handleUpdateProfile,
  passwordData,
  setPasswordData,
  handleChangePassword,
}: Props) {
  return (
    <div className="space-y-6">
      {/* Personal Info Card */}
      <Card>
        <CardHeader className="border-b bg-gray-50">
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Thông tin cá nhân
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="lastName" className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                Họ và đệm
              </Label>
              <Input
                id="lastName"
                value={userData.lastName}
                onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                placeholder="Nhập họ và đệm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="firstName" className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                Tên
              </Label>
              <Input
                id="firstName"
                value={userData.firstName}
                onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                placeholder="Nhập tên"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={userData.email}
                readOnly
                disabled
                className="bg-gray-100 cursor-not-allowed text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                Số điện thoại
              </Label>
              <Input
                id="phone"
                value={userData.phone}
                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                placeholder="Nhập số điện thoại"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender" className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                Giới tính
              </Label>
              <Select
                value={userData.gender}
                onValueChange={(val) => setUserData({ ...userData, gender: val })}
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Nam</SelectItem>
                  <SelectItem value="female">Nữ</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob" className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                Ngày sinh
              </Label>
              <Input
                id="dob"
                type="date"
                value={userData.dateOfBirth}
                onChange={(e) => setUserData({ ...userData, dateOfBirth: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-6 pt-6 border-t">
            <Button onClick={handleUpdateProfile} className="w-full md:w-auto">
              Cập nhật thông tin
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Change Password Card */}
      <Card>
        <CardHeader className="border-b bg-gray-50">
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-600" />
            Đổi mật khẩu
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
              <Input
                id="current-password"
                type="password"
                value={passwordData.current}
                onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                placeholder="Nhập mật khẩu hiện tại"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Mật khẩu mới</Label>
              <Input
                id="new-password"
                type="password"
                value={passwordData.new}
                onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                placeholder="Nhập mật khẩu mới"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordData.confirm}
                onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>
            <Button onClick={handleChangePassword} className="w-full">
              Đổi mật khẩu
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
