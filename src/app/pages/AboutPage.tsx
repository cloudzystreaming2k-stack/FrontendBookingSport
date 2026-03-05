import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Target, Users, Award, TrendingUp } from "lucide-react";

export function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Về SportBooking
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Nền tảng đặt sân thể thao trực tuyến hàng đầu Việt Nam, kết nối người chơi và chủ sân một cách dễ dàng, nhanh chóng
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Sứ mệnh</h2>
              <p className="text-gray-600 leading-relaxed">
                Chúng tôi cam kết mang đến trải nghiệm đặt sân thể thao tốt nhất cho người dùng, 
                giúp mọi người dễ dàng tiếp cận và tận hưởng niềm đam mê thể thao của mình. 
                Đồng thời, hỗ trợ các chủ sân quản lý và phát triển kinh doanh hiệu quả.
              </p>
            </div>
            <div>
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Tầm nhìn</h2>
              <p className="text-gray-600 leading-relaxed">
                Trở thành nền tảng đặt sân thể thao số 1 tại Việt Nam, với hệ thống sân rộng khắp 
                cả nước và cộng đồng người chơi đông đảo. Chúng tôi hướng tới việc thúc đẩy phong 
                trào thể thao và nâng cao sức khỏe cộng đồng.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Sân thể thao</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50,000+</div>
              <div className="text-gray-600">Người dùng</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">100,000+</div>
              <div className="text-gray-600">Lượt đặt sân</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">4.8/5</div>
              <div className="text-gray-600">Đánh giá</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Giá trị cốt lõi</h2>
            <p className="text-gray-600">Những giá trị chúng tôi luôn theo đuổi</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Khách hàng là trung tâm</h3>
                <p className="text-gray-600">
                  Luôn lắng nghe và đáp ứng nhu cầu của khách hàng, mang đến trải nghiệm tốt nhất
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Chất lượng dịch vụ</h3>
                <p className="text-gray-600">
                  Cam kết cung cấp dịch vụ chất lượng cao, đảm bảo sự hài lòng của người dùng
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Đổi mới không ngừng</h3>
                <p className="text-gray-600">
                  Không ngừng cải tiến công nghệ và dịch vụ để mang đến giá trị tốt nhất
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Đội ngũ của chúng tôi</h2>
            <p className="text-gray-600">Những con người tạo nên SportBooking</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { name: "Nguyễn Văn A", role: "CEO & Founder", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop" },
              { name: "Trần Thị B", role: "CTO", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" },
              { name: "Lê Văn C", role: "Head of Operations", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" },
              { name: "Phạm Thị D", role: "Head of Marketing", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop" },
            ].map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                  <p className="text-gray-600 text-sm">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Bắt đầu trải nghiệm ngay hôm nay
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Tìm và đặt sân thể thao yêu thích của bạn chỉ trong vài phút
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Tìm sân ngay
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
              Liên hệ với chúng tôi
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
