import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { CreditCard, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";

export function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("vnpay");
  const [promoCode, setPromoCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Mock booking data
  const bookingData = {
    courtName: "Sân Pickleball Quận 1",
    date: "05/03/2026",
    time: "18:00 - 20:00",
    hours: 2,
    totalPrice: 500000,
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
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="vnpay" id="vnpay" />
                    <Label htmlFor="vnpay" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <img
                          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&h=60&fit=crop"
                          alt="VNPay"
                          className="w-12 h-8 object-contain"
                        />
                        <div>
                          <div className="font-semibold">VNPay</div>
                          <div className="text-xs text-gray-500">Thanh toán qua VNPay</div>
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="momo" id="momo" />
                    <Label htmlFor="momo" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 bg-pink-500 rounded flex items-center justify-center">
                          <span className="text-white font-bold text-xs">MoMo</span>
                        </div>
                        <div>
                          <div className="font-semibold">Ví MoMo</div>
                          <div className="text-xs text-gray-500">Thanh toán qua ví MoMo</div>
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="banking" id="banking" />
                    <Label htmlFor="banking" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 bg-blue-500 rounded flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold">Thẻ ATM / Internet Banking</div>
                          <div className="text-xs text-gray-500">Thanh toán bằng thẻ ngân hàng</div>
                        </div>
                      </div>
                    </Label>
                  </div>
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
                  <span>{bookingData.totalPrice.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí dịch vụ:</span>
                  <span>0đ</span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Giảm giá:</span>
                  <span>-0đ</span>
                </div>
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
