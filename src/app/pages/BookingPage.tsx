import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Calendar as CalendarIcon, Clock, MapPin, Plus, Minus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Calendar } from "../components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { mockCourts } from "../data/mockData";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export function BookingPage() {
  const { courtId } = useParams();
  const navigate = useNavigate();
  const court = mockCourts.find((c) => c.id === courtId);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState("08:00");
  const [hours, setHours] = useState(1);

  if (!court) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Không tìm thấy sân</h1>
        <Button onClick={() => navigate("/courts")}>Quay lại danh sách sân</Button>
      </div>
    );
  }

  const timeSlots = [
    "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
    "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
    "18:00", "19:00", "20:00", "21:00"
  ];

  const calculatePrice = () => {
    const startHour = parseInt(selectedTime.split(":")[0]);
    let totalPrice = 0;

    for (let i = 0; i < hours; i++) {
      const currentHour = startHour + i;
      if (currentHour < 12) {
        totalPrice += court.pricing.morning;
      } else if (currentHour < 18) {
        totalPrice += court.pricing.afternoon;
      } else {
        totalPrice += court.pricing.evening;
      }
    }

    return totalPrice;
  };

  const handleBooking = () => {
    if (!selectedDate) return;

    // Mock booking creation
    const bookingId = "BK" + Date.now();
    navigate(`/payment/${bookingId}`);
  };

  const totalPrice = calculatePrice();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Đặt sân</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Court Info */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin sân</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <img
                  src={court.images[0]}
                  alt={court.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold text-lg">{court.name}</h3>
                  <div className="flex items-center text-gray-600 text-sm mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {court.address}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Date Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Chọn ngày
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={vi}
                disabled={(date) => date < new Date()}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          {/* Time Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Chọn giờ bắt đầu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      selectedTime === time
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white hover:bg-gray-50 border-gray-300"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Duration Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Số giờ chơi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setHours(Math.max(1, hours - 1))}
                  disabled={hours <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <div className="text-center min-w-[80px]">
                  <div className="text-3xl font-bold">{hours}</div>
                  <div className="text-sm text-gray-600">giờ</div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setHours(Math.min(6, hours + 1))}
                  disabled={hours >= 6}
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <div className="ml-4 text-sm text-gray-600">
                  <div>Kết thúc lúc: <span className="font-semibold">
                    {`${(parseInt(selectedTime.split(":")[0]) + hours).toString().padStart(2, '0')}:00`}
                  </span></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Tóm tắt đặt sân</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ngày:</span>
                  <span className="font-medium">
                    {selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: vi }) : "-"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Giờ:</span>
                  <span className="font-medium">
                    {selectedTime} - {`${(parseInt(selectedTime.split(":")[0]) + hours).toString().padStart(2, '0')}:00`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Thời gian:</span>
                  <span className="font-medium">{hours} giờ</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Giá sân:</span>
                    <span>{totalPrice.toLocaleString()}đ</span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline border-t pt-4">
                  <span className="font-semibold">Tổng cộng:</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {totalPrice.toLocaleString()}đ
                    </div>
                  </div>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleBooking}
                disabled={!selectedDate}
              >
                Tiếp tục thanh toán
              </Button>

              <div className="text-xs text-gray-500 text-center">
                Bạn sẽ không bị tính phí cho đến khi hoàn tất đặt sân
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
