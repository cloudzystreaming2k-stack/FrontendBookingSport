import { useParams, useNavigate } from "react-router";
import { useSearchParams } from "react-router";
import { CheckCircle, XCircle, Home, CalendarDays, History } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

export function BookingSuccessPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const status = searchParams.get("status");
  const reason = searchParams.get("reason");

  const isFailed = status === "failed";

  // Helper: Chọn thông điệp cảnh báo dựa vào mã Lỗi (reason) từ VNPay
  const getErrorMessage = () => {
    switch (reason) {
      case "cancelled":
        return "Quý khách đã chủ động hủy bỏ quá trình thanh toán.";
      case "invalid_checksum":
        return "Giao dịch từ chối: Chữ ký dữ liệu thanh toán không hợp lệ.";
      case "amount_mismatch":
        return "Giao dịch từ chối: Số tiền thanh toán không khớp với hóa đơn.";
      default:
        return "Giao dịch không thành công hoặc ngân hàng từ chối thẻ.";
    }
  };

  return (
    <div className="min-h-[70vh] bg-[#f4f8fb] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        <Card className="text-center shadow-lg border-0 overflow-hidden rounded-2xl">
          <div className={`h-2 ${isFailed ? "bg-red-500" : "bg-green-600"}`}></div>
          <CardContent className="pt-10 pb-8 px-8">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${isFailed ? "bg-red-50" : "bg-green-50"}`}>
              {isFailed ? (
                <XCircle className="w-12 h-12 text-red-500 shadow-sm rounded-full bg-white" />
              ) : (
                <CheckCircle className="w-12 h-12 text-green-600 shadow-sm rounded-full bg-white" />
              )}
            </div>
            
            <h2 className="text-3xl font-black mb-3 text-gray-900">
              {isFailed ? "Thanh toán thất bại!" : "Đặt sân thành công!"}
            </h2>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-6 mt-4 inline-block mx-auto min-w-[250px]">
              <p className="text-gray-500 text-sm mb-1 uppercase font-semibold">Mã đơn hàng</p>
              <p className={`text-2xl font-mono font-bold tracking-wider ${isFailed ? "text-red-500" : "text-blue-600"}`}>
                {bookingId || "BK000000"}
              </p>
            </div>

            <div className="mb-8 leading-relaxed max-w-sm mx-auto">
              {isFailed ? (
                <>
                  <p className="text-red-600 font-medium mb-2">{getErrorMessage()}</p>
                  <p className="text-gray-600 text-sm">Tuy nhiên, đơn đặt sân của bạn vẫn đã được khởi tạo để chờ nộp tiền mặt tại sân.</p>
                </>
              ) : (
                <p className="text-gray-600">
                  Thông tin đơn đặt sân của bạn đã được hệ thống ghi nhận. Vui lòng ghi nhớ mã đơn để đến sân làm thủ tục nhận khung giờ.
                </p>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {isFailed ? (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/profile")}
                    className="flex items-center gap-2"
                  >
                    <History className="w-4 h-4" />
                    Lịch sử Đặt sân
                  </Button>
                  <Button 
                    onClick={() => navigate(`/checkout`)} 
                    className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                  >
                    Thử thanh toán lại
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2"
                  >
                    <Home className="w-4 h-4" />
                    Về trang chủ
                  </Button>
                  <Button 
                    onClick={() => navigate("/courts")}
                    className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                  >
                    <CalendarDays className="w-4 h-4" />
                    Đặt thêm sân
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
