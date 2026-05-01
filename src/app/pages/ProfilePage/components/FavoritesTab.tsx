import { useNavigate } from "react-router";
import { Heart, MapPin, Star } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { mockCourts } from "../../../data/mockData";
import { toast } from "sonner";

// Mock data tạm thời cho đến khi có API thật
const DEFAULT_FAVORITES = mockCourts.filter((c) => ["C001", "C003", "C005"].includes(c.id));

interface Props {
  favoriteCourts: typeof DEFAULT_FAVORITES;
  handleRemoveFavorite: (courtId: string) => void;
}

export function FavoritesTab({ favoriteCourts, handleRemoveFavorite }: Props) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="border-b bg-gray-50">
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-600" />
          Sân yêu thích của bạn
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {favoriteCourts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favoriteCourts.map((court) => (
              <Card key={court.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <img
                    src={court.images[0]}
                    alt={court.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleRemoveFavorite(court.id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-lg"
                    title="Xóa khỏi yêu thích"
                  >
                    <Heart className="w-5 h-5 text-pink-600 fill-pink-600" />
                  </button>
                  <div className="absolute bottom-3 left-3">
                    <Badge className="bg-white/90 text-gray-900 border-0">
                      {court.type === "pickleball"
                        ? "Pickleball"
                        : court.type === "badminton"
                        ? "Cầu lông"
                        : court.type === "basketball"
                        ? "Bóng rổ"
                        : court.type === "tennis"
                        ? "Tennis"
                        : "Bóng chuyền"}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-1">{court.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{court.area}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-sm">{court.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">({court.reviewCount} đánh giá)</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div>
                      <p className="text-xs text-gray-500">Giá từ</p>
                      <p className="font-bold text-blue-600">
                        {Math.min(
                          court.pricing.morning,
                          court.pricing.afternoon,
                          court.pricing.evening
                        ).toLocaleString()}
                        đ/h
                      </p>
                    </div>
                    <Button size="sm" onClick={() => navigate(`/courts/${court.id}`)}>
                      Đặt sân
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Bạn chưa có sân yêu thích nào</p>
            <p className="text-sm text-gray-500 mb-4">
              Thêm sân vào danh sách yêu thích để dễ dàng đặt sân sau này
            </p>
            <Button onClick={() => navigate("/courts")}>Khám phá sân</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
