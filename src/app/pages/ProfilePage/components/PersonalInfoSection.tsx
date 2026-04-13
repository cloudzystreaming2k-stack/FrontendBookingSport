import { User, Mail, Phone, Calendar } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { toast } from "sonner";
import { UserData } from "../types";

interface PersonalInfoSectionProps {
   userData: UserData;
   onUserDataChange: (data: UserData) => void;
   onUpdate: (data: UserData) => void;
}

export function PersonalInfoSection({ userData, onUserDataChange, onUpdate }: PersonalInfoSectionProps) {
   const handleUpdate = () => {
      onUpdate(userData);
      toast.success("Cập nhật thông tin thành công!");
   };

   return (
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
                     onChange={(e) => onUserDataChange({ ...userData, lastName: e.target.value })}
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
                     onChange={(e) => onUserDataChange({ ...userData, firstName: e.target.value })}
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
                     onChange={(e) => onUserDataChange({ ...userData, phone: e.target.value })}
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
                     onValueChange={(val) => onUserDataChange({ ...userData, gender: val as any })}
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
                     onChange={(e) => onUserDataChange({ ...userData, dateOfBirth: e.target.value })}
                  />
               </div>
            </div>
            <div className="mt-6 pt-6 border-t">
               <Button onClick={handleUpdate} className="w-full md:w-auto">
                  Cập nhật thông tin
               </Button>
            </div>
         </CardContent>
      </Card>
   );
}
