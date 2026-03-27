import { useState } from "react";
import { useNavigate, Link } from "react-router";
import api from "../../lib/api";
import { toast } from "sonner";
import {
  Building2, User, Briefcase, CreditCard, ArrowRight, ArrowLeft,
  Check, Mail, Lock, Phone, Calendar, MapPin, FileText, Landmark, Wallet, CheckCircle2
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent } from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

// Function to remove Vietnamese accents and convert to uppercase
const removeVietnameseAccents = (str: string): string => {
  const from = "àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ";
  const to = "aaaaaaaaaaaaaaaaaeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyAAAAAAAAAAAAAAAAAAEEEEEEEEEEEIIIIIOOOOOOOOOOOOOOOOOUUUUUUUUUUUYYYYYD";

  let result = str;
  for (let i = 0; i < from.length; i++) {
    result = result.replace(new RegExp(from[i], 'g'), to[i]);
  }
  return result.toUpperCase();
};

interface FormData {
  // Step 1: Personal Info
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  password: string;
  confirmPassword: string;

  // Step 2: Business Info
  ownerName: string;
  identityNumber: string;
  businessName: string;
  taxCode: string;
  businessAddress: string;
  businessPhone: string;

  // Step 3: Payment Info
  bankName: string;
  accountNumber: string;
  accountOwner: string;
}

interface StepErrors {
  [key: string]: string;
}

export function OwnerRegisterPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    lastName: "",
    firstName: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
    ownerName: "",
    identityNumber: "",
    businessName: "",
    taxCode: "",
    businessAddress: "",
    businessPhone: "",
    bankName: "",
    accountNumber: "",
    accountOwner: "",
  });

  const [errors, setErrors] = useState<StepErrors>({});

  const steps = [
    {
      number: 1,
      title: "Thông tin cá nhân",
      icon: User,
      description: "Thông tin cơ bản của bạn"
    },
    {
      number: 2,
      title: "Thông tin kinh doanh",
      icon: Briefcase,
      description: "Thông tin về đơn vị kinh doanh"
    },
    {
      number: 3,
      title: "Thông tin thanh toán",
      icon: CreditCard,
      description: "Thông tin tài khoản ngân hàng"
    },
  ];

  const handleChange = (field: keyof FormData, value: string) => {
    let processedValue = value;

    // Auto uppercase and remove accents for specific fields
    if (field === "bankName" || field === "accountOwner") {
      processedValue = removeVietnameseAccents(value);
    }

    setFormData(prev => ({ ...prev, [field]: processedValue }));

    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: StepErrors = {};

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Vui lòng nhập họ và đệm";
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Vui lòng nhập tên";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại phải có 10 chữ số";
    }

    if (!formData.gender) {
      newErrors.gender = "Vui lòng chọn giới tính";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Vui lòng chọn ngày sinh";
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: StepErrors = {};

    if (!formData.ownerName.trim()) {
      newErrors.ownerName = "Vui lòng nhập tên chủ sân";
    }

    if (!formData.identityNumber.trim()) {
      newErrors.identityNumber = "Vui lòng nhập số CCCD";
    } else if (!/^[0-9]{9,12}$/.test(formData.identityNumber)) {
      newErrors.identityNumber = "Số CCCD phải có 9-12 chữ số";
    }

    if (!formData.businessName.trim()) {
      newErrors.businessName = "Vui lòng nhập tên đơn vị";
    }

    if (!formData.taxCode.trim()) {
      newErrors.taxCode = "Vui lòng nhập mã số thuế";
    }

    if (!formData.businessAddress.trim()) {
      newErrors.businessAddress = "Vui lòng nhập địa chỉ";
    }

    if (!formData.businessPhone.trim()) {
      newErrors.businessPhone = "Vui lòng nhập số điện thoại đơn vị";
    } else if (!/^[0-9]{10}$/.test(formData.businessPhone.replace(/\s/g, ""))) {
      newErrors.businessPhone = "Số điện thoại phải có 10 chữ số";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: StepErrors = {};

    if (!formData.bankName.trim()) {
      newErrors.bankName = "Vui lòng nhập tên ngân hàng";
    }

    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = "Vui lòng nhập số tài khoản";
    } else if (!/^[0-9]+$/.test(formData.accountNumber)) {
      newErrors.accountNumber = "Số tài khoản chỉ được chứa số";
    }

    if (!formData.accountOwner.trim()) {
      newErrors.accountOwner = "Vui lòng nhập tên chủ tài khoản";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;

    if (currentStep === 1) {
      isValid = validateStep1();
    } else if (currentStep === 2) {
      isValid = validateStep2();
    } else if (currentStep === 3) {
      isValid = validateStep3();
    }

    if (isValid) {
      // Mark step as completed
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }

      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (step: number) => {
    // Allow clicking on completed steps or next step
    if (completedSteps.includes(step - 1) || step === 1) {
      setCurrentStep(step);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep3()) {
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        ownerInfo: {
          ownerName: formData.ownerName,
          identityNumber: formData.identityNumber,
          businessName: formData.businessName,
          taxCode: formData.taxCode,
          businessAddress: formData.businessAddress,
          businessPhone: formData.businessPhone,
          bankName: formData.bankName,
          accountNumber: formData.accountNumber,
          accountOwner: formData.accountOwner
        }
      };

      await api.post("/auth/register-owner", payload);

      setIsLoading(false);
      setShowSuccessModal(true);
    } catch (error: any) {
      setIsLoading(false);
      const errorMessage = error.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại sau";
      toast.error("Lỗi đăng ký", { description: errorMessage });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold text-white">Đăng Ký Chủ Sân</h1>
              <p className="text-sm text-white/80">Đăng ký để quản lý sân thể thao của bạn</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-300"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              />
            </div>

            {steps.map((step) => {
              const Icon = step.icon;
              const isCompleted = completedSteps.includes(step.number);
              const isCurrent = currentStep === step.number;
              const isAccessible = step.number === 1 || completedSteps.includes(step.number - 1);

              return (
                <div
                  key={step.number}
                  className="flex flex-col items-center relative z-10 flex-1"
                >
                  <button
                    onClick={() => handleStepClick(step.number)}
                    disabled={!isAccessible}
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${isCompleted
                        ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg"
                        : isCurrent
                          ? "bg-white text-teal-600 shadow-lg ring-4 ring-teal-500/30"
                          : isAccessible
                            ? "bg-white/20 text-white/60 hover:bg-white/30 cursor-pointer"
                            : "bg-white/10 text-white/40 cursor-not-allowed"
                      }`}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </button>
                  <div className="text-center hidden sm:block">
                    <p className={`text-sm font-semibold ${isCurrent ? "text-white" : "text-white/60"
                      }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-white/50">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Card */}
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8">
            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Thông tin cá nhân</h3>
                  <p className="text-gray-600">Vui lòng cung cấp thông tin cá nhân của bạn</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Last Name */}
                  <div>
                    <Label htmlFor="lastName">Họ và đệm <span className="text-red-500">*</span></Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      placeholder="Nguyễn Văn"
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>
                    )}
                  </div>

                  {/* First Name */}
                  <div>
                    <Label htmlFor="firstName">Tên <span className="text-red-500">*</span></Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                      placeholder="An"
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="email@example.com"
                        className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <Label htmlFor="phone">Số điện thoại <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="0901234567"
                        className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
                    )}
                  </div>

                  {/* Gender */}
                  <div>
                    <Label htmlFor="gender">Giới tính <span className="text-red-500">*</span></Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => handleChange("gender", value)}
                    >
                      <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Nam</SelectItem>
                        <SelectItem value="female">Nữ</SelectItem>
                        <SelectItem value="other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.gender && (
                      <p className="text-sm text-red-600 mt-1">{errors.gender}</p>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <Label htmlFor="dateOfBirth">Ngày sinh <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                        className={`pl-10 ${errors.dateOfBirth ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.dateOfBirth && (
                      <p className="text-sm text-red-600 mt-1">{errors.dateOfBirth}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <Label htmlFor="password">Mật khẩu <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleChange("password", e.target.value)}
                        placeholder="••••••••"
                        className={`pl-10 ${errors.password ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-600 mt-1">{errors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <Label htmlFor="confirmPassword">Xác nhận mật khẩu <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleChange("confirmPassword", e.target.value)}
                        placeholder="••••••••"
                        className={`pl-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Business Info */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Thông tin kinh doanh</h3>
                  <p className="text-gray-600">Vui lòng cung cấp thông tin về đơn vị kinh doanh</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Owner Name */}
                  <div>
                    <Label htmlFor="ownerName">Tên chủ sân <span className="text-red-500">*</span></Label>
                    <Input
                      id="ownerName"
                      value={formData.ownerName}
                      onChange={(e) => handleChange("ownerName", e.target.value)}
                      placeholder="Nguyễn Văn An"
                      className={errors.ownerName ? "border-red-500" : ""}
                    />
                    {errors.ownerName && (
                      <p className="text-sm text-red-600 mt-1">{errors.ownerName}</p>
                    )}
                  </div>

                  {/* Identity Number */}
                  <div>
                    <Label htmlFor="identityNumber">Số CCCD <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="identityNumber"
                        value={formData.identityNumber}
                        onChange={(e) => handleChange("identityNumber", e.target.value)}
                        placeholder="001234567890"
                        className={`pl-10 ${errors.identityNumber ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.identityNumber && (
                      <p className="text-sm text-red-600 mt-1">{errors.identityNumber}</p>
                    )}
                  </div>

                  {/* Business Name */}
                  <div>
                    <Label htmlFor="businessName">Tên đơn vị <span className="text-red-500">*</span></Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => handleChange("businessName", e.target.value)}
                      placeholder="Công ty TNHH Sân Thể Thao ABC"
                      className={errors.businessName ? "border-red-500" : ""}
                    />
                    {errors.businessName && (
                      <p className="text-sm text-red-600 mt-1">{errors.businessName}</p>
                    )}
                  </div>

                  {/* Tax Code */}
                  <div>
                    <Label htmlFor="taxCode">Mã số thuế <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="taxCode"
                        value={formData.taxCode}
                        onChange={(e) => handleChange("taxCode", e.target.value)}
                        placeholder="0123456789"
                        className={`pl-10 ${errors.taxCode ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.taxCode && (
                      <p className="text-sm text-red-600 mt-1">{errors.taxCode}</p>
                    )}
                  </div>

                  {/* Business Address */}
                  <div className="md:col-span-2">
                    <Label htmlFor="businessAddress">Địa chỉ <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="businessAddress"
                        value={formData.businessAddress}
                        onChange={(e) => handleChange("businessAddress", e.target.value)}
                        placeholder="123 Đường ABC, Quận 1, TP. Hồ Chí Minh"
                        className={`pl-10 ${errors.businessAddress ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.businessAddress && (
                      <p className="text-sm text-red-600 mt-1">{errors.businessAddress}</p>
                    )}
                  </div>

                  {/* Business Phone */}
                  <div>
                    <Label htmlFor="businessPhone">Số điện thoại đơn vị <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="businessPhone"
                        type="tel"
                        value={formData.businessPhone}
                        onChange={(e) => handleChange("businessPhone", e.target.value)}
                        placeholder="0281234567"
                        className={`pl-10 ${errors.businessPhone ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.businessPhone && (
                      <p className="text-sm text-red-600 mt-1">{errors.businessPhone}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Payment Info */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Thông tin thanh toán</h3>
                  <p className="text-gray-600">Vui lòng cung cấp thông tin tài khoản ngân hàng để nhận thanh toán</p>
                </div>

                <div className="space-y-4">
                  {/* Bank Name */}
                  <div>
                    <Label htmlFor="bankName">
                      Tên ngân hàng <span className="text-red-500">*</span>
                      <span className="text-xs text-gray-500 ml-2">(Tự động UPPERCASE, không dấu)</span>
                    </Label>
                    <div className="relative">
                      <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="bankName"
                        value={formData.bankName}
                        onChange={(e) => handleChange("bankName", e.target.value)}
                        placeholder="Nhập: vietcombank → VIETCOMBANK"
                        className={`pl-10 ${errors.bankName ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.bankName && (
                      <p className="text-sm text-red-600 mt-1">{errors.bankName}</p>
                    )}
                    {formData.bankName && (
                      <p className="text-xs text-teal-600 mt-1">Sẽ hiển thị: {formData.bankName}</p>
                    )}
                  </div>

                  {/* Account Number */}
                  <div>
                    <Label htmlFor="accountNumber">Số tài khoản <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="accountNumber"
                        value={formData.accountNumber}
                        onChange={(e) => handleChange("accountNumber", e.target.value)}
                        placeholder="1234567890"
                        className={`pl-10 ${errors.accountNumber ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.accountNumber && (
                      <p className="text-sm text-red-600 mt-1">{errors.accountNumber}</p>
                    )}
                  </div>

                  {/* Account Owner */}
                  <div>
                    <Label htmlFor="accountOwner">
                      Tên chủ tài khoản <span className="text-red-500">*</span>
                      <span className="text-xs text-gray-500 ml-2">(Tự động UPPERCASE, không dấu)</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="accountOwner"
                        value={formData.accountOwner}
                        onChange={(e) => handleChange("accountOwner", e.target.value)}
                        placeholder="Nhập: nguyễn văn a → NGUYEN VAN A"
                        className={`pl-10 ${errors.accountOwner ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.accountOwner && (
                      <p className="text-sm text-red-600 mt-1">{errors.accountOwner}</p>
                    )}
                    {formData.accountOwner && (
                      <p className="text-xs text-teal-600 mt-1">Sẽ hiển thị: {formData.accountOwner}</p>
                    )}
                  </div>

                  {/* Preview Card */}
                  <div className="mt-6 p-6 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-200">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-teal-600" />
                      Xem trước thông tin thanh toán
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ngân hàng:</span>
                        <span className="font-semibold">{formData.bankName || "---"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Số tài khoản:</span>
                        <span className="font-semibold font-mono">{formData.accountNumber || "---"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Chủ tài khoản:</span>
                        <span className="font-semibold">{formData.accountOwner || "---"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <div>
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Link to="/admin/login">
                  <Button type="button" variant="ghost">
                    Hủy bỏ
                  </Button>
                </Link>

                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 flex items-center gap-2"
                  >
                    Tiếp tục
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Hoàn tất đăng ký
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-white/80">
            Đã có tài khoản?{" "}
            <Link to="/admin/login" className="text-teal-400 hover:text-teal-300 font-semibold">
              Đăng nhập tại đây
            </Link>
          </p>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center text-center py-6">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Title */}
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Đăng ký thành công chủ sân!
              </DialogTitle>
              <DialogDescription className="text-base text-gray-600 leading-relaxed px-4">
                Tài khoản của bạn sẽ được xem xét và duyệt trong vòng <span className="font-semibold text-teal-600">24 giờ</span>.
                <br />
                Chúng tôi sẽ gửi email thông báo khi tài khoản được kích hoạt.
              </DialogDescription>
            </DialogHeader>

            {/* Info Box */}
            <div className="mt-6 w-full p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Lưu ý:</strong> Vui lòng kiểm tra email của bạn để theo dõi trạng thái đăng ký.
              </p>
            </div>

            {/* Action Button */}
            <div className="flex flex-col gap-2 mt-8 w-full">
              <Button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate("/admin/login");
                }}
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold h-12"
              >
                Đi đến trang đăng nhập
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 