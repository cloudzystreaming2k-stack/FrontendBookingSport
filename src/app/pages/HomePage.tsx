import { Link } from "react-router";
import { Search, MapPin, Calendar, Star } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent } from "../components/ui/card";
import { mockCourts } from "../data/mockData";

export function HomePage() {
  const featuredCourts = mockCourts.slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Đặt Sân Thể Thao Dễ Dàng & Nhanh Chóng
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Tìm và đặt sân pickleball, cầu lông, bóng rổ, tennis tại khu vực của bạn
            </p>

            {/* Search Box */}
            <Card className="bg-white text-gray-900 shadow-xl">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Loại sân" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="pickleball">Pickleball</SelectItem>
                      <SelectItem value="badminton">Cầu lông</SelectItem>
                      <SelectItem value="basketball">Bóng rổ</SelectItem>
                      <SelectItem value="tennis">Tennis</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Khu vực" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="q1">Quận 1</SelectItem>
                      <SelectItem value="tanbinh">Tân Bình</SelectItem>
                      <SelectItem value="phunhuan">Phú Nhuận</SelectItem>
                      <SelectItem value="thuduc">Thủ Đức</SelectItem>
                    </SelectContent>
                  </Select>

                  <Link to="/courts">
                    <Button className="w-full" size="lg">
                      <Search className="w-5 h-5 mr-2" />
                      Tìm sân
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Tìm kiếm dễ dàng</h3>
              <p className="text-gray-600">
                Tìm sân phù hợp theo loại, khu vực và mức giá
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Đặt sân online</h3>
              <p className="text-gray-600">
                Chọn thời gian và đặt sân chỉ trong vài phút
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Đánh giá tin cậy</h3>
              <p className="text-gray-600">
                Xem đánh giá từ người dùng thực tế
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courts */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Sân Nổi Bật</h2>
            <p className="text-gray-600">Những sân được yêu thích nhất</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCourts.map((court) => (
              <Card key={court.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={court.images[0]}
                  alt={court.name}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg">{court.name}</h3>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{court.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    {court.area}
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {court.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-gray-600">Từ </span>
                      <span className="text-lg font-bold text-blue-600">
                        {court.pricing.morning.toLocaleString()}đ
                      </span>
                      <span className="text-sm text-gray-600">/giờ</span>
                    </div>
                    <Link to={`/courts/${court.id}`}>
                      <Button size="sm">Xem chi tiết</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/courts">
              <Button variant="outline" size="lg">
                Xem tất cả sân
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Bạn là chủ sân thể thao?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Đăng ký ngay để tiếp cận hàng nghìn khách hàng tiềm năng
          </p>
          <Button size="lg" variant="secondary">
            Đăng ký hợp tác
          </Button>
        </div>
      </section>
    </div>
  );
}
