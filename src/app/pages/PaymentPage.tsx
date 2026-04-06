import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { CreditCard, CheckCircle, AlertCircle, Wallet, Banknote, User } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";

export function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const stateData = location.state as any;

  const [paymentMethod, setPaymentMethod] = useState("vnpay");
  const [promoCode, setPromoCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Mock booking data (Lấy từ state truyền sang hoặc mock mặc định)
  const bookingData = stateData || {
    courtName: "Sân Pickleball Quận 1",
    date: "05/03/2026",
    time: "18:00 - 20:00",
    hours: 2,
    totalPrice: 500000,
    originalPrice: 500000,
    discountAmount: 0
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    // Mock payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);

      // Redirect to profile after 2 seconds
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    }, 2000);
  };

  if (paymentSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="text-center">
          <CardContent className="pt-12 pb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Đặt sân thành công!</h2>
            <p className="text-gray-600 mb-6">
              Mã đặt sân: <span className="font-semibold">{bookingId}</span>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Thông tin chi tiết đã được gửi về email của bạn
            </p>
            <Button onClick={() => navigate("/profile")}>Xem lịch sử đặt sân</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Thanh toán</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Booking Info */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin đặt sân</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Mã đặt sân:</span>
                <span className="font-semibold">{bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sân:</span>
                <span className="font-semibold">{bookingData.courtName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ngày:</span>
                <span className="font-semibold">{bookingData.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Giờ:</span>
                <span className="font-semibold">{bookingData.time}</span>
              </div>
            </CardContent>
          </Card>
          {/* Info User Booking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Thông tin người đặt
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customer-name">Họ và tên <span className="text-red-500">*</span></Label>
                <Input id="customer-name" placeholder="Ví dụ: Nguyễn Văn A" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer-phone">Số điện thoại <span className="text-red-500">*</span></Label>
                <Input id="customer-phone" type="tel" placeholder="Ví dụ: 0912345678" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer-notes">Ghi chú thêm (Tùy chọn)</Label>
                <textarea 
                  id="customer-notes" 
                  className="flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Yêu cầu thêm về sân bãi, dụng cụ..." 
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Phương thức thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="space-y-4">
                  {/* Tại sân */}
                  <Label 
                    htmlFor="cash" 
                    className={`flex items-center space-x-4 border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      paymentMethod === "cash" 
                        ? "border-blue-600 bg-blue-50/50" 
                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <RadioGroupItem value="cash" id="cash" className={paymentMethod === "cash" ? "text-blue-600 border-blue-600" : ""} />
                    <div className="flex-1 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                        <Banknote className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900 text-sm">Thanh toán tại sân</div>
                        <div className="text-sm text-gray-500 mt-0.5 font-normal">Thanh toán trực tiếp khi đến sân</div>
                      </div>
                      {paymentMethod === "cash" && (
                        <CheckCircle className="w-5 h-5 text-blue-600 shrink-0" />
                      )}
                    </div>
                  </Label>

                  {/* MoMo */}
                  <Label 
                    htmlFor="momo" 
                    className={`flex items-center space-x-4 border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      paymentMethod === "momo" 
                        ? "border-blue-600 bg-blue-50/50" 
                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <RadioGroupItem value="momo" id="momo" className={paymentMethod === "momo" ? "text-blue-600 border-blue-600" : ""} />
                    <div className="flex-1 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center shrink-0">
                        <Wallet className="w-5 h-5 text-pink-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900 text-sm">Thanh toán MoMo</div>
                        <div className="text-sm text-gray-500 mt-0.5 font-normal">Thanh toán qua ví điện tử MoMo</div>
                      </div>
                      {paymentMethod === "momo" && (
                        <CheckCircle className="w-5 h-5 text-blue-600 shrink-0" />
                      )}
                    </div>
                  </Label>

                  {/* VNPay */}
                  <Label 
                    htmlFor="vnpay" 
                    className={`flex items-center space-x-4 border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      paymentMethod === "vnpay" 
                        ? "border-blue-600 bg-blue-50/50" 
                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <RadioGroupItem value="vnpay" id="vnpay" className={paymentMethod === "vnpay" ? "text-blue-600 border-blue-600" : ""} />
                    <div className="flex-1 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900 text-sm">Thanh toán VNPay</div>
                        <div className="text-sm text-gray-500 mt-0.5 font-normal">Thanh toán qua cổng VNPay</div>
                      </div>
                      {paymentMethod === "vnpay" && (
                        <CheckCircle className="w-5 h-5 text-blue-600 shrink-0" />
                      )}
                    </div>
                  </Label>

                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Promo Code */}
          <Card>
            <CardHeader>
              <CardTitle>Mã khuyến mãi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Nhập mã khuyến mãi"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <Button variant="outline">Áp dụng</Button>
              </div>
              <div className="mt-3 p-3 bg-blue-50 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <div className="font-semibold mb-1">Khuyến mãi có sẵn:</div>
                  <div>• NEWUSER10 - Giảm 10% cho khách hàng mới</div>
                  <div>• MORNING20 - Giảm 20% khung giờ sáng</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Tổng thanh toán</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Giá sân ({bookingData.hours} giờ):</span>
                  <span>{(bookingData.originalPrice || bookingData.totalPrice).toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí dịch vụ:</span>
                  <span>0đ</span>
                </div>
                {bookingData.discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Giảm giá:</span>
                    <span>-{bookingData.discountAmount.toLocaleString()}đ</span>
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-baseline mb-6">
                  <span className="font-semibold">Tổng cộng:</span>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">
                      {bookingData.totalPrice.toLocaleString()}đ
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Đang xử lý..." : "Thanh toán ngay"}
                </Button>
              </div>

              <div className="text-xs text-gray-500 space-y-1">
                <p>✓ Xác nhận tự động sau khi thanh toán</p>
                <p>✓ Hoàn tiền 100% nếu hủy trước 24h</p>
                <p>✓ Thông tin được mã hóa an toàn</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
