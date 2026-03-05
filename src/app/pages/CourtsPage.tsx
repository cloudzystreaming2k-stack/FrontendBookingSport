import { useState } from "react";
import { Link } from "react-router";
import { MapPin, Star, Search } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent } from "../components/ui/card";
import { Slider } from "../components/ui/slider";
import { mockCourts } from "../data/mockData";

export function CourtsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedArea, setSelectedArea] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 500000]);

  const filteredCourts = mockCourts.filter((court) => {
    const matchesSearch = court.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || court.type === selectedType;
    const matchesArea = selectedArea === "all" || court.area === selectedArea;
    const matchesPrice =
      court.pricing.morning >= priceRange[0] && court.pricing.evening <= priceRange[1];
    return matchesSearch && matchesType && matchesArea && matchesPrice;
  });

  const courtTypes = [
    { value: "all", label: "Tất cả" },
    { value: "pickleball", label: "Pickleball" },
    { value: "badminton", label: "Cầu lông" },
    { value: "basketball", label: "Bóng rổ" },
    { value: "tennis", label: "Tennis" },
  ];

  const areas = [
    { value: "all", label: "Tất cả khu vực" },
    { value: "Quận 1", label: "Quận 1" },
    { value: "Tân Bình", label: "Tân Bình" },
    { value: "Phú Nhuận", label: "Phú Nhuận" },
    { value: "Thủ Đức", label: "Thủ Đức" },
    { value: "Bình Thạnh", label: "Bình Thạnh" },
    { value: "Quận 7", label: "Quận 7" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Tìm Sân Thể Thao</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <Card>
            <CardContent className="p-5 space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Tìm kiếm</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Tên sân..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Loại sân</h3>
                <div className="space-y-2">
                  {courtTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setSelectedType(type.value)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedType === type.value
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Khu vực</h3>
                <Select value={selectedArea} onValueChange={setSelectedArea}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {areas.map((area) => (
                      <SelectItem key={area.value} value={area.value}>
                        {area.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Khoảng giá</h3>
                <div className="space-y-4">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={0}
                    max={500000}
                    step={10000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{priceRange[0].toLocaleString()}đ</span>
                    <span>{priceRange[1].toLocaleString()}đ</span>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedType("all");
                  setSelectedArea("all");
                  setPriceRange([0, 500000]);
                }}
              >
                Xóa bộ lọc
              </Button>
            </CardContent>
          </Card>
        </aside>

        {/* Courts List */}
        <div className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-gray-600">
              Tìm thấy <span className="font-semibold">{filteredCourts.length}</span> sân
            </p>
            <Select defaultValue="rating">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
                <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
                <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredCourts.map((court) => (
              <Card key={court.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                  <img
                    src={court.images[0]}
                    alt={court.name}
                    className="w-full h-48 md:h-full object-cover"
                  />
                  <CardContent className="md:col-span-2 p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-xl mb-1">{court.name}</h3>
                        <div className="flex items-center text-gray-600 text-sm">
                          <MapPin className="w-4 h-4 mr-1" />
                          {court.address}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{court.rating}</span>
                        <span className="text-sm text-gray-600">({court.reviewCount})</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {court.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {court.facilities.slice(0, 4).map((facility, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                        >
                          {facility}
                        </span>
                      ))}
                      {court.facilities.length > 4 && (
                        <span className="px-2 py-1 text-gray-500 text-xs">
                          +{court.facilities.length - 4} tiện ích
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-gray-600">Từ </span>
                        <span className="text-2xl font-bold text-blue-600">
                          {court.pricing.morning.toLocaleString()}đ
                        </span>
                        <span className="text-sm text-gray-600">/giờ</span>
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/courts/${court.id}`}>
                          <Button variant="outline">Xem chi tiết</Button>
                        </Link>
                        <Link to={`/booking/${court.id}`}>
                          <Button>Đặt sân</Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}

            {filteredCourts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">
                  Không tìm thấy sân phù hợp với tiêu chí tìm kiếm
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedType("all");
                    setSelectedArea("all");
                    setPriceRange([0, 500000]);
                  }}
                >
                  Xóa bộ lọc
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
