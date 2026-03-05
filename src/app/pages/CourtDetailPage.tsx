import { useState } from "react";
import { useParams, Link } from "react-router";
import { MapPin, Star, Clock, DollarSign, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { mockCourts, mockReviews } from "../data/mockData";

export function CourtDetailPage() {
  const { id } = useParams();
  const court = mockCourts.find((c) => c.id === id);
  const courtReviews = mockReviews.filter((r) => r.courtId === id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!court) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Không tìm thấy sân</h1>
        <Link to="/courts">
          <Button>Quay lại danh sách sân</Button>
        </Link>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % court.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + court.images.length) % court.images.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link to="/courts" className="text-blue-600 hover:underline">
          ← Quay lại danh sách
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gallery */}
          <Card className="overflow-hidden">
            <div className="relative">
              <img
                src={court.images[currentImageIndex]}
                alt={court.name}
                className="w-full h-96 object-cover"
              />
              {court.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {court.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex ? "bg-white w-4" : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2 p-4">
              {court.images.slice(1, 4).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${court.name} - ${index + 2}`}
                  className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-80"
                  onClick={() => setCurrentImageIndex(index + 1)}
                />
              ))}
            </div>
          </Card>

          {/* Info Tabs */}
          <Card>
            <Tabs defaultValue="info" className="w-full">
              <CardHeader>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="info">Thông tin</TabsTrigger>
                  <TabsTrigger value="pricing">Bảng giá</TabsTrigger>
                  <TabsTrigger value="reviews">Đánh giá ({courtReviews.length})</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent>
                <TabsContent value="info" className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Info className="w-5 h-5 text-blue-600" />
                      Mô tả
                    </h3>
                    <p className="text-gray-600">{court.description}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Tiện nghi</h3>
                    <div className="flex flex-wrap gap-2">
                      {court.facilities.map((facility, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                        >
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="pricing">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-5 h-5 text-blue-600" />
                          <span className="font-semibold">Khung giờ sáng</span>
                        </div>
                        <span className="text-sm text-gray-600">06:00 - 12:00</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {court.pricing.morning.toLocaleString()}đ
                        </div>
                        <span className="text-sm text-gray-600">/ giờ</span>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-5 h-5 text-orange-600" />
                          <span className="font-semibold">Khung giờ chiều</span>
                        </div>
                        <span className="text-sm text-gray-600">12:00 - 18:00</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-orange-600">
                          {court.pricing.afternoon.toLocaleString()}đ
                        </div>
                        <span className="text-sm text-gray-600">/ giờ</span>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-5 h-5 text-purple-600" />
                          <span className="font-semibold">Khung giờ tối</span>
                        </div>
                        <span className="text-sm text-gray-600">18:00 - 22:00</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">
                          {court.pricing.evening.toLocaleString()}đ
                        </div>
                        <span className="text-sm text-gray-600">/ giờ</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="space-y-4">
                  {courtReviews.length > 0 ? (
                    courtReviews.map((review) => (
                      <div key={review.id} className="border-b pb-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="font-semibold text-blue-600">
                              {review.userName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold">{review.userName}</div>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                        <span className="text-xs text-gray-400 mt-2 block">
                          {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 text-center py-8">Chưa có đánh giá</p>
                  )}
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>{court.name}</CardTitle>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{court.rating}</span>
                <span className="text-sm text-gray-600">({court.reviewCount} đánh giá)</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2 text-gray-600">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{court.address}</span>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold">Giá từ</span>
                </div>
                <div className="text-3xl font-bold text-blue-600">
                  {court.pricing.morning.toLocaleString()}đ
                  <span className="text-sm font-normal text-gray-600">/giờ</span>
                </div>
              </div>

              <Link to={`/booking/${court.id}`}>
                <Button className="w-full" size="lg">
                  Đặt sân ngay
                </Button>
              </Link>

              <div className="text-xs text-gray-500 text-center">
                Xác nhận tự động • Thanh toán online
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
