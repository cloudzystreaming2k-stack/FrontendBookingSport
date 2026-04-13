import { Lock } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { toast } from "sonner";
import { PasswordData } from "../types";

interface ChangePasswordSectionProps {
   passwordData: PasswordData;
   onPasswordDataChange: (data: PasswordData) => void;
   onChangePassword: () => void;
}

export function ChangePasswordSection({
   passwordData,
   onPasswordDataChange,
   onChangePassword,
}: ChangePasswordSectionProps) {
   const handleSubmit = () => {
      if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
         toast.error("Vui lòng điền đầy đủ thông tin");
         return;
      }
      if (passwordData.new !== passwordData.confirm) {
         toast.error("Mật khẩu xác nhận không khớp");
         return;
      }
      if (passwordData.new.length < 6) {
         toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
         return;
      }
      onChangePassword();
      toast.success("Đổi mật khẩu thành công!");
   };

   return (
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
                     onChange={(e) => onPasswordDataChange({ ...passwordData, current: e.target.value })}
                     placeholder="Nhập mật khẩu hiện tại"
                  />
               </div>
               <div className="space-y-2">
                  <Label htmlFor="new-password">Mật khẩu mới</Label>
                  <Input
                     id="new-password"
                     type="password"
                     value={passwordData.new}
                     onChange={(e) => onPasswordDataChange({ ...passwordData, new: e.target.value })}
                     placeholder="Nhập mật khẩu mới"
                  />
               </div>
               <div className="space-y-2">
                  <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                  <Input
                     id="confirm-password"
                     type="password"
                     value={passwordData.confirm}
                     onChange={(e) => onPasswordDataChange({ ...passwordData, confirm: e.target.value })}
                     placeholder="Nhập lại mật khẩu mới"
                  />
               </div>
               <Button onClick={handleSubmit} className="w-full">
                  Đổi mật khẩu
               </Button>
            </div>
         </CardContent>
      </Card>
   );
}
