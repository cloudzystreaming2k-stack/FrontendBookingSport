import { Link } from "react-router";
import { Search, MapPin, Calendar, Star, Check, Zap, Globe, Target, CreditCard, ShieldCheck, CalendarDays, Users, Clock, Headphones, DollarSign, QrCode, BarChart3, TrendingUp, Smartphone, Mic, Layers } from "lucide-react";
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
      <section className="relative pt-20 pb-12 bg-gradient-to-br from-blue-50 via-white to-blue-50/50 overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] bg-blue-300/30 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">

            {/* Left side */}
            <div className="flex-1 max-w-xl">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-6 tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2"></span>
                Đặt sân trong 30 giây
              </div>

              <h1 className="text-5xl md:text-[4rem] font-black text-[#111827] leading-[1.1] mb-6 tracking-tighter drop-shadow-sm">
                Đặt sân thể thao <br />
                <span className="text-blue-600 drop-shadow-md">dễ dàng & nhanh</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed font-medium">
                Tìm sân gần bạn, đặt lịch online, thanh toán an toàn. Không cần gọi điện hay nhắn tin.
              </p>

              <div className="flex flex-wrap gap-3 mb-12">
                {['Không cần gọi điện', 'Xác nhận ngay', 'Thanh toán an toàn', 'Dễ dàng nhanh chóng'].map((text, i) => (
                  <div key={i} className="inline-flex items-center px-4 py-2 rounded-full border border-blue-200 bg-blue-50/50 text-2xs font-semibold text-gray-700 shadow-sm">
                    <Check className="w-3.5 h-3.5 text-blue-600 mr-1.5" />
                    {text}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-4 items-center">
                {[
                  { value: '500+', label: 'Sân thể thao' },
                  { value: '50K+', label: 'Người dùng' },
                  { value: '100K+', label: 'Lượt đặt' },
                  { value: '4.9', label: 'Đánh giá', icon: <Star className="w-4 h-4 text-orange-400 fill-orange-400 inline ml-1 -mt-1" /> },
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-3xl font-black text-gray-900 flex items-center">
                      {stat.value}{stat.icon}
                    </div>
                    <div className="text-[11px] text-blue-600 font-semibold tracking-wide uppercase mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side (Search Card) */}
            <div className="flex-1 w-full max-w-md lg:max-w-xl relative mt-10 lg:mt-0">

              {/* Float top right */}
              <div className="absolute -top-5 right-4 lg:-right-6 bg-white px-5 py-2.5 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-50 flex items-center gap-1.5 z-20 w-fit transform hover:-translate-y-1 transition-transform">
                <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                <span className="font-bold text-gray-900">4.9</span>
                <span className="text-xs font-medium text-blue-600">rating</span>
              </div>

              {/* Float bottom left */}
              <div className="absolute -bottom-5 -left-4 lg:-left-10 bg-white px-5 py-2.5 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-50 flex items-center gap-2 z-20 w-fit transform hover:-translate-y-1 transition-transform">
                <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
                  <Zap className="w-3 h-3 text-blue-600" />
                </div>
                <span className="font-bold text-xs text-gray-700">Đặt trong 30s</span>
              </div>

              <Card className="w-full bg-white/95 backdrop-blur-xl border border-white/50 shadow-[0_20px_50px_rgb(0,0,0,0.1)] rounded-[2rem] relative z-10 overflow-visible">
                <CardContent className="p-8 md:p-10">
                  <h3 className="text-lg font-black text-gray-900 mb-8">Đặt sân nhanh</h3>

                  <div className="space-y-6">
                    {/* Môn thể thao */}
                    <div>
                      <label className="block text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-3">Chọn loại sân muốn đặt</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                          <Target className="w-4 h-4" />
                        </div>
                        <Select defaultValue="all">
                          <SelectTrigger className="w-full pl-12 bg-gray-50 border-gray-100 h-14 rounded-2xl text-gray-700 font-medium hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-blue-600/20 focus:border-transparent outline-none shadow-none">
                            <SelectValue placeholder="Tất cả sân" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                            <SelectItem value="all" className="font-medium cursor-pointer rounded-lg mx-1 my-1">Tất cả sân</SelectItem>
                            <SelectItem value="squash" className="font-medium cursor-pointer rounded-lg mx-1 my-1">Squash</SelectItem>
                            <SelectItem value="futsal" className="font-medium cursor-pointer rounded-lg mx-1 my-1">Futsal</SelectItem>
                            <SelectItem value="tennis" className="font-medium cursor-pointer rounded-lg mx-1 my-1">Tennis</SelectItem>
                            <SelectItem value="badminton" className="font-medium cursor-pointer rounded-lg mx-1 my-1">Cầu lông</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Địa điểm */}
                    <div>
                      <label className="block text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-3">Địa điểm</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                          <Search className="w-4 h-4" />
                        </div>
                        <Input
                          className="pl-12 bg-gray-50 border-gray-100 h-14 rounded-2xl text-gray-700 font-medium hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-blue-600/20 outline-none placeholder:text-gray-400 placeholder:font-normal shadow-none"
                          placeholder="Quận 7, TP.HCM"
                        />
                      </div>
                    </div>

                    {/* Bán kính */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <label className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Bán kính tìm kiếm</label>
                      </div>
                      <div className="flex items-center gap-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                          <Globe className="w-4 h-4" />
                        </div>
                        <input
                          type="range"
                          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                          min="1"
                          max="50"
                          defaultValue="10"
                        />
                        <span className="text-sm font-bold text-gray-700 shrink-0 w-10 text-right">10 km</span>
                      </div>
                    </div>

                    {/* Nút tìm kiếm */}
                    <Link to="/courts" className="block mt-4">
                      <Button className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-[15px] font-bold shadow-[0_8px_20px_rgb(37,99,235,0.3)] hover:shadow-[0_12px_25px_rgb(37,99,235,0.4)] transition-all">
                        Tìm sân trống
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bottom sports categories row (Marquee Full Width) */}
          <div className="mt-28 w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden py-4">

            <style>{`
              @keyframes marquee {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
              }
              .animate-marquee {
                display: flex;
                width: max-content;
                animation: marquee 40s linear infinite;
              }
              .animate-marquee:hover {
                animation-play-state: paused;
              }
            `}</style>

            {/* Fade edges */}
            <div className="absolute top-0 left-0 w-24 md:w-64 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-24 md:w-64 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

            <div className="animate-marquee gap-4 items-center">
              {[
                { icon: '🎾', name: 'Squash', total: 15 },
                { icon: '⚽', name: 'Futsal', total: 70 },
                { icon: '🥎', name: 'Padel', total: 30 },
                { icon: '🎾', name: 'Tennis', total: 120 },
                { icon: '🏸', name: 'Cầu lông', total: 200 },
                { icon: '⚽', name: 'Bóng đá', total: 150 },
                { icon: '🥒', name: 'Pickleball', total: 85 },
                { icon: '🏀', name: 'Bóng rổ', total: 60 },
                { icon: '🏐', name: 'Bóng chuyền', total: 45 },
                { icon: '🏓', name: 'Bóng bàn', total: 90 },
                { icon: '⛳', name: 'Golf', total: 25 },
              ].concat([
                { icon: '🎾', name: 'Squash', total: 15 },
                { icon: '⚽', name: 'Futsal', total: 70 },
                { icon: '🥎', name: 'Padel', total: 30 },
                { icon: '🎾', name: 'Tennis', total: 120 },
                { icon: '🏸', name: 'Cầu lông', total: 200 },
                { icon: '⚽', name: 'Bóng đá', total: 150 },
                { icon: '🥒', name: 'Pickleball', total: 85 },
                { icon: '🏀', name: 'Bóng rổ', total: 60 },
                { icon: '🏐', name: 'Bóng chuyền', total: 45 },
                { icon: '🏓', name: 'Bóng bàn', total: 90 },
                { icon: '⛳', name: 'Golf', total: 25 },
              ]).map((sport, idx) => (
                <div key={idx} className="flex items-center gap-3 px-5 py-3.5 bg-white/90 backdrop-blur-md hover:bg-white border border-gray-100 rounded-full shadow-[0_8px_20px_rgb(0,0,0,0.04)] cursor-pointer transition-transform hover:-translate-y-1 whitespace-nowrap shrink-0">
                  <span className="text-xl leading-none">{sport.icon}</span>
                  <span className="text-[15px] font-extrabold text-gray-800 tracking-tight">{sport.name}</span>
                  <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{sport.total}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courts */}
      <section className="py-12 bg-gray-50">
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

      {/* For Players */}
      <section className="py-12 bg-[#f4f8fb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center px-5 py-2 rounded-full bg-blue-100/60 text-blue-600 text-sm font-semibold mb-6">
              Dành cho người chơi
            </div>
            <h2 className="text-3xl md:text-[2.5rem] font-black text-[#111827] mb-6 tracking-tight">
              Tính Năng Vượt Trội
            </h2>
            <p className="text-lg text-gray-600 font-medium">
              Những vấn đề bạn gặp hàng ngày - chúng tôi đã giải quyết
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <CreditCard className="w-6 h-6 text-blue-600" />,
                title: "Chia Tiền Nhóm Dễ Dàng",
                desc: "Một người đặt sân, hệ thống tạo link thanh toán cho cả nhóm. Mỗi người tự trả qua Momo, ZaloPay - không cần tạo tài khoản.",
                solve: "Loại bỏ hoàn toàn việc phải đi đòi tiền từng người."
              },
              {
                icon: <ShieldCheck className="w-6 h-6 text-blue-600" />,
                title: "Giữ Chỗ An Toàn 15 Phút",
                desc: "Khi chọn khung giờ, hệ thống giữ chỗ độc quyền 15 phút để hoàn tất thanh toán. Không ai chen ngang.",
                solve: "Không còn mất slot vì người khác thanh toán nhanh hơn vài giây."
              },
              {
                icon: <CalendarDays className="w-6 h-6 text-blue-600" />,
                title: "Đặt Định Kỳ, Hủy Linh Hoạt",
                desc: "Đặt sân định kỳ theo tuần nhưng vẫn có thể hủy từng buổi riêng lẻ mà không ảnh hưởng các buổi còn lại.",
                solve: "Hầu hết nền tảng khác bắt \"hủy tất hoặc giữ tất\" - không phù hợp thực tế."
              },
              {
                icon: <Users className="w-6 h-6 text-blue-600" />,
                title: "Tìm Người Chơi Cùng Trình Độ",
                desc: "Hệ thống đánh giá kỹ năng theo thang 0-7, xác minh qua kết quả trận đấu thực tế. Tìm đối thủ phù hợp.",
                solve: "Tránh người \"Trung bình\" gặp người \"Mới chơi\" - làm hỏng trải nghiệm."
              },
              {
                icon: <Clock className="w-6 h-6 text-blue-600" />,
                title: "Chính Sách Vắng Mặt Công Bằng",
                desc: "Nếu không đến buổi đã đặt, 30% số tiền phạt sẽ được chuyển thành credit cho lần đặt sân tiếp theo.",
                solve: "Bảo vệ chủ sân nhưng vẫn giữ chân người chơi."
              },
              {
                icon: <Headphones className="w-6 h-6 text-blue-600" />,
                title: "Cộng Đồng Thể Thao",
                desc: "Kết nối với người chơi cùng sở thích, chia sẻ kinh nghiệm, đặt sân cùng nhau.",
                solve: "Xây dựng mạng lưới thể thao - không chỉ đặt sân."
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-transparent border border-blue-200/60 rounded-3xl p-7 transition-all hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 group flex flex-col cursor-default">
                <div className="w-14 h-14 bg-white border border-blue-50/50 shadow-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform shrink-0">
                  {feature.icon}
                </div>
                <h3 className="text-[17px] font-extrabold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-[15px] font-medium text-gray-600 leading-relaxed flex-1 min-h-[90px]">
                  {feature.desc}
                </p>
                <div className="bg-white rounded-2xl p-5 flex gap-3.5 shadow-sm mt-auto">
                  <Check className="w-5 h-5 text-[#22c55e] shrink-0 mt-0.5" />
                  <p className="text-[14px]">
                    <span className="font-semibold text-gray-700">Giải quyết: </span>
                    <span className="text-blue-600 font-medium">{feature.solve}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Three Step */}
      <section className="py-16 bg-white relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-[2.5rem] font-black text-[#111827] mb-4 tracking-tight">
              Chỉ 3 bước đơn giản
            </h2>
            <p className="text-[#64748b] font-medium text-[15px]">
              Đặt sân dễ như đặt đồ ăn
            </p>
          </div>

          <div className="relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-[45px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-blue-200/80 to-transparent"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <div className="w-[90px] h-[90px] bg-blue-600 rounded-[1.25rem] flex items-center justify-center shadow-[0_10px_25px_rgb(37,99,235,0.2)] mb-6 transition-transform hover:-translate-y-1">
                  <span className="text-[32px] font-black text-white leading-none">01</span>
                </div>
                <h3 className="text-[17px] font-extrabold text-[#111827] mb-2">Tìm sân</h3>
                <p className="text-[14px] font-medium text-[#64748b]">Chọn môn, địa điểm</p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center">
                <div className="w-[90px] h-[90px] bg-blue-600 rounded-[1.25rem] flex items-center justify-center shadow-[0_10px_25px_rgb(37,99,235,0.2)] mb-6 transition-transform hover:-translate-y-1">
                  <span className="text-[32px] font-black text-white leading-none">02</span>
                </div>
                <h3 className="text-[17px] font-extrabold text-[#111827] mb-2">Đặt chỗ</h3>
                <p className="text-[14px] font-medium text-[#64748b]">Chọn sân, điền info</p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center">
                <div className="w-[90px] h-[90px] bg-blue-600 rounded-[1.25rem] flex items-center justify-center shadow-[0_10px_25px_rgb(37,99,235,0.2)] mb-6 transition-transform hover:-translate-y-1">
                  <span className="text-[32px] font-black text-white leading-none">03</span>
                </div>
                <h3 className="text-[17px] font-extrabold text-[#111827] mb-2">Thanh toán</h3>
                <p className="text-[14px] font-medium text-[#64748b]">Trả online, nhận QR</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Player Say */}
      <section className="py-16 bg-[#f4f8fb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-[2.5rem] font-black text-[#111827] tracking-tight">
              Người chơi nói gì?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                text: "Đặt sân nhanh gọn, rất tiện!",
                name: "Minh Tuấn",
                sport: "Tennis",
                initial: "M",
              },
              {
                text: "Thanh toán online an toàn.",
                name: "Thu Hương",
                sport: "Cầu lông",
                initial: "T",
              },
              {
                text: "Tìm được sân giá tốt gần nhà.",
                name: "Đức Anh",
                sport: "Bóng đá",
                initial: "Đ",
              }
            ].map((review, idx) => (
              <div key={idx} className="bg-transparent border border-blue-200/60 rounded-[1.5rem] p-8 transition-all hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 group flex flex-col">
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-orange-400 fill-orange-400" />
                  ))}
                </div>
                <p className="text-[17px] font-medium text-gray-700 leading-relaxed mb-8 flex-1">
                  "{review.text}"
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-[#1a769d] flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm border border-blue-700/20">
                    {review.initial}
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-gray-900">{review.name}</h4>
                    <p className="text-[13px] font-medium text-[#4ba2c9]">{review.sport}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Owner Court */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">

            {/* Left side */}
            <div className="flex-1 max-w-lg">
              <div className="inline-flex items-center px-5 py-2 rounded-full bg-blue-100/60 text-blue-600 text-sm font-semibold mb-6">
                Dành cho chủ sân
              </div>
              <h2 className="text-3xl md:text-[2.5rem] font-black text-[#111827] leading-[1.2] mb-5 tracking-tight">
                Trở thành đối tác Sportis
              </h2>
              <p className="text-lg text-gray-600 font-medium mb-8">
                Đưa sân của bạn lên Sportis để tiếp cận hàng nghìn người chơi thể thao mỗi ngày.
              </p>

              <div className="space-y-8">
                {[
                  {
                    icon: <DollarSign className="w-5 h-5 text-blue-600" />,
                    title: "Định Giá Thông Minh Tự Động",
                    desc: "Thiết lập quy tắc giá một lần (cuối tuần, giờ vàng, ngày lễ...) và hệ thống sẽ tự động tính toán."
                  },
                  {
                    icon: <ShieldCheck className="w-5 h-5 text-blue-600" />,
                    title: "Bảo Vệ Doanh Thu No-Show",
                    desc: "Thu hồi tới 50% doanh thu bị mất do khách không đến, đồng thời đảm bảo an toàn pháp lý."
                  },
                  {
                    icon: <QrCode className="w-5 h-5 text-blue-600" />,
                    title: "Check-in QR Tự Động",
                    desc: "Khách quét mã, hệ thống thông báo cho nhân viên. Giảm tải công việc lễ tân."
                  },
                  {
                    icon: <CreditCard className="w-5 h-5 text-blue-600" />,
                    title: "Chi Phí Thanh Toán Tối Ưu",
                    desc: "Mức phí giao dịch thấp hơn khoảng 3.5 lần so với chỉ sử dụng cổng thanh toán quốc tế."
                  },
                  {
                    icon: <BarChart3 className="w-5 h-5 text-blue-600" />,
                    title: "Sổ Cái Minh Bạch",
                    desc: "Chủ sân luôn biết chính xác được trả bao nhiêu và khi nào tiền về tài khoản."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex flex-shrink-0 items-center justify-center mt-1">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-[16px] font-bold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-[14px] font-medium text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button className="mt-8 h-14 px-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[16px] font-bold shadow-[0_8px_20px_rgb(37,99,235,0.3)] hover:shadow-[0_12px_25px_rgb(37,99,235,0.4)] transition-all transform hover:-translate-y-1">
                Liên hệ đăng ký đối tác
              </Button>
            </div>

            {/* Right side */}
            <div className="flex-1 w-full relative mt-16 lg:mt-0 lg:pl-4 xl:pl-10">

              {/* Floating Top Right Badge */}
              <div className="absolute -top-6 right-4 md:-right-6 bg-white px-5 py-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-blue-50 z-20 w-fit flex gap-3 transform hover:-translate-y-1 transition-transform">
                <div className="w-8 h-8 rounded-lg bg-[#ebf4f8] flex items-center justify-center shrink-0 mt-0.5">
                  <BarChart3 className="w-4 h-4 text-[#4ba2c9]" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-gray-900 leading-tight mb-0.5">Sổ Cái</p>
                  <p className="text-[12px] font-medium text-[#4ba2c9]">Minh bạch 100%</p>
                </div>
              </div>

              {/* Floating Bottom Left Badge */}
              <div className="absolute -bottom-8 -left-4 md:-left-8 bg-white px-5 py-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-blue-50 z-20 w-fit flex flex-col gap-1 transform hover:-translate-y-1 transition-transform">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#4ba2c9]" />
                  <span className="font-bold text-[14px] text-gray-900">100+ Cổng</span>
                </div>
                <span className="text-[12px] font-medium text-[#4ba2c9]">Thanh toán</span>
              </div>

              {/* Card Dashboard */}
              <div className="bg-[#f0f8fb] border border-[#e1eff5] rounded-[2.5rem] p-6 md:p-8 relative shadow-[0_20px_60px_rgb(0,0,0,0.05)] w-full max-w-[500px] xl:max-w-none mx-auto lg:mr-0 z-10 overflow-hidden">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8 mt-2">
                  <div className="w-12 h-12 bg-[#d1e6f0] shadow-sm rounded-xl flex items-center justify-center shrink-0">
                    <BarChart3 className="w-5 h-5 text-[#1a769d]" />
                  </div>
                  <div>
                    <h3 className="text-[17px] font-extrabold text-[#111827]">Dashboard Chủ Sân</h3>
                    <p className="text-[13px] font-medium text-[#4ba2c9]">Quản lý toàn diện</p>
                  </div>
                </div>

                {/* Info Blocks */}
                <div className="space-y-4 mb-8">
                  <div className="bg-white rounded-[1.25rem] p-5 py-4 flex items-center justify-between shadow-[0_2px_15px_rgb(0,0,0,0.02)]">
                    <div className="flex items-center gap-3.5">
                      <Calendar className="w-5 h-5 text-[#4ba2c9]" />
                      <span className="font-semibold text-[15px] text-gray-700">Lượt đặt hôm nay</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[17px] font-black text-gray-900">24</span>
                      <span className="text-[11px] font-bold text-[#22c55e] bg-green-50 px-2.5 py-1 rounded-md tracking-wide">+12%</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-[1.25rem] p-5 py-4 flex items-center justify-between shadow-[0_2px_15px_rgb(0,0,0,0.02)]">
                    <div className="flex items-center gap-3.5">
                      <TrendingUp className="w-5 h-5 text-[#4ba2c9]" />
                      <span className="font-semibold text-[15px] text-gray-700">Doanh thu tháng</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[17px] font-black text-gray-900">45.2M</span>
                      <span className="text-[11px] font-bold text-[#22c55e] bg-green-50 px-2.5 py-1 rounded-md tracking-wide">+8%</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-[1.25rem] p-5 py-4 flex items-center justify-between shadow-[0_2px_15px_rgb(0,0,0,0.02)]">
                    <div className="flex items-center gap-3.5">
                      <Star className="w-5 h-5 text-[#4ba2c9]" />
                      <span className="font-semibold text-[15px] text-gray-700">Rating trung bình</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[17px] font-black text-gray-900">4.8</span>
                      <Star className="w-4 h-4 fill-[#f59e0b] text-[#f59e0b] mb-0.5" />
                    </div>
                  </div>
                </div>

                {/* Chart Frame */}
                <div className="bg-white rounded-[1.5rem] p-6 pb-5 shadow-sm h-[200px] flex flex-col justify-end relative">
                  <div className="absolute top-5 left-6 right-6 flex items-center justify-between">
                    <span className="font-bold text-[14px] text-[#4ba2c9]">Doanh thu 7 ngày</span>
                    <span className="text-[18px] font-black text-gray-900">315M</span>
                  </div>

                  {/* Bars */}
                  <div className="flex items-end justify-between gap-2.5 h-[100px] mt-10 px-1">
                    {[
                      { h: '35%', day: 'T2', active: false },
                      { h: '45%', day: 'T3', active: false },
                      { h: '40%', day: 'T4', active: false },
                      { h: '55%', day: 'T5', active: false },
                      { h: '65%', day: 'T6', active: false },
                      { h: '95%', day: 'T7', active: true },
                      { h: '50%', day: 'CN', active: false },
                    ].map((bar, i) => (
                      <div key={i} className="flex flex-col items-center justify-end h-full w-full group">
                        <div
                          className={`w-full rounded-t-[4px] transition-all duration-300 group-hover:bg-[#1a769d] ${bar.active ? 'bg-[#1a769d]' : 'bg-[#b8d6e6]'}`}
                          style={{ height: bar.h }}
                        ></div>
                        <span className={`text-[11px] font-bold mt-2 ${bar.active ? 'text-[#1a769d]' : 'text-[#8daab9]'}`}>{bar.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Compare Traditional Method */}
      <section className="py-24 bg-[#f0f8fb]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-[2.5rem] font-black text-[#111827] tracking-tight">
              So Sánh Với Cách Truyền Thống
            </h2>
          </div>

          <div className="bg-white rounded-[1.25rem] lg:rounded-[1.5rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-[#e1eff5]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr>
                    <th className="py-6 px-8 text-[16px] font-extrabold text-[#111827] w-[30%] bg-white border-b border-[#e1eff5]">Tiêu chí</th>
                    <th className="py-6 px-8 text-center text-[16px] font-extrabold text-[#1a769d] bg-[#dceef7] w-[35%] border-b border-[#dceef7]">Sportis</th>
                    <th className="py-6 px-8 text-center text-[16px] font-extrabold text-[#4ba2c9] w-[35%] bg-white border-b border-[#e1eff5]">Cách truyền thống</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eaf4f9]">
                  {[
                    { crit: "Thanh toán nhóm", sportis: "Mỗi người tự trả qua link", trad: "Người tổ chức đi thu tiền" },
                    { crit: "Đặt trùng slot", sportis: "Không thể xảy ra", trad: "Thường xuyên xảy ra" },
                    { crit: "Xử lý vắng mặt", sportis: "Tự động + tuân thủ luật", trad: "Xử lý thủ công hoặc không có" },
                    { crit: "Định giá linh hoạt", sportis: "Tự động theo quy tắc", trad: "Điều chỉnh thủ công" },
                    { crit: "Phí thanh toán", sportis: "~1% (cổng nội địa)", trad: "~3.5% (cổng quốc tế)" }
                  ].map((row, idx) => (
                    <tr key={idx} className="transition-colors hover:bg-slate-50/50">
                      <td className="py-5 px-8 text-[15px] font-medium text-[#111827] bg-white">{row.crit}</td>
                      <td className="py-5 px-8 text-center bg-white relative">
                        <div className="flex items-center justify-center gap-2">
                          <Check className="w-[18px] h-[18px] text-[#22c55e] shrink-0" strokeWidth={3} />
                          <span className="text-[15px] font-medium text-[#111827]">{row.sportis}</span>
                        </div>
                      </td>
                      <td className="py-5 px-8 text-center text-[15px] font-medium text-[#4ba2c9] bg-white">{row.trad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Coming soon */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center px-5 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[13px] font-bold mb-6 shadow-[0_4px_15px_rgb(168,85,247,0.3)]">
              Sắp Ra Mắt
            </div>
            <h2 className="text-3xl md:text-[2.5rem] font-black text-[#111827] mb-4 tracking-tight">
              Tiếp Theo Trên Lộ Trình
            </h2>
            <p className="text-[16px] text-[#4ba2c9] font-medium">
              Sẽ triển khai sau khi các tính năng cốt lõi ổn định trên production
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quarter: "Q2 2026",
                icon: <Smartphone className="w-6 h-6 text-[#1a769d]" strokeWidth={2} />,
                title: "Ứng Dụng Di Động",
                desc: "App native iOS & Android với thông báo đẩy, đặt sân mọi lúc mọi nơi, check-in bằng QR. Sân chơi chỉ cách một chạm."
              },
              {
                quarter: "Q3 2026",
                icon: <Mic className="w-6 h-6 text-[#1a769d]" strokeWidth={2} />,
                title: "Đặt Sân Bằng Giọng Nói AI",
                desc: "Đặt sân bằng lệnh giọng nói tự nhiên. Trợ lý AI tìm slot trống, đặt nhắc nhở, và đồng bộ lịch tự động."
              },
              {
                quarter: "Q4 2026",
                icon: <Layers className="w-6 h-6 text-[#1a769d]" strokeWidth={2} />,
                title: "Địa Điểm Đặc Biệt",
                desc: "Mở rộng ra ngoài sân truyền thống — hồ bơi, phòng bi-a, gym, bowling và nhiều loại hình địa điểm đặc biệt khác."
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-[#f2f8fb] border-[1.5px] border-dashed border-[#b3d4e6] rounded-[1.5rem] p-8 relative flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.04)] hover:border-[#1a769d]/40 hover:bg-[#ebf4f8] group">
                <div className="absolute top-6 right-6 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[12px] font-bold shadow-sm">
                  {item.quarter}
                </div>

                <div className="w-[52px] h-[52px] bg-[#e1eff5] rounded-[1rem] flex items-center justify-center mb-8 shadow-sm">
                  {item.icon}
                </div>

                <h3 className="text-[18px] font-extrabold text-[#111827] mb-3">{item.title}</h3>
                <p className="text-[15px] font-medium text-[#64748b] leading-relaxed flex-1">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ready to play & CTA Section */}
      <section className="py-16 bg-[#1a769d]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-4 pb-4">
          <h2 className="text-[2.5rem] font-black text-white mb-4 tracking-tight">
            Sẵn sàng chơi chưa?
          </h2>
          <p className="text-[17px] text-[#b3d9eb] font-medium mb-10">
            Tham gia cùng hàng nghìn người chơi mỗi ngày
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/courts">
              <Button className="bg-white text-[#1a769d] hover:bg-[#eaf4f9] px-7 rounded-[0.8rem] font-extrabold h-12 shadow-[0_8px_20px_rgb(0,0,0,0.1)] hover:shadow-[0_12px_25px_rgb(0,0,0,0.15)] transition-all transform hover:-translate-y-1 text-[16px]">
                Đặt sân ngay
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="border-white border-[2px] bg-transparent text-white hover:bg-white/10 px-7 rounded-[0.8rem] font-bold h-12 transition-all transform hover:-translate-y-1 text-[16px]">
                Đăng nhập
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
