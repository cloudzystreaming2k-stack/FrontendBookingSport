import { useState } from "react";
import { Link } from "react-router";
import { MapPin, Search, Map as MapIcon, SlidersHorizontal } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent } from "../components/ui/card";
import { Slider } from "../components/ui/slider";
import { mockCourts } from "../data/mockData";

export function CourtsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [radius, setRadius] = useState(10);
  // const [selectedArea, setSelectedArea] = useState("all");
  // const [priceRange, setPriceRange] = useState([0, 500000]);

  const filteredCourts = mockCourts.filter((court) => {
    const matchesSearch = court.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || court.type === selectedType;
    return matchesSearch && matchesType;
  });

  const courtTypes = [
    { value: "all", label: "Tất cả môn thể thao" },
    { value: "pickleball", label: "Pickleball" },
    { value: "badminton", label: "Cầu lông" },
    { value: "basketball", label: "Bóng rổ" },
    { value: "tennis", label: "Tennis" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans p-4 sm:p-6 lg:p-2">
      <div className="w-full mx-auto bg-white border-[5px] border-[#b6d6e6] rounded-[2rem] overflow-hidden relative pb-24 shadow-[0_4px_30px_rgb(0,0,0,0.03)]">
        {/* Top Filter Bar */}
        <div className="bg-[#f0f8fb] border-b-[2.5px] border-[#e1eff5] sticky top-0 z-40">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
          
          {/* Main Search Row */}
          <div className="flex gap-3 mb-5 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4ba2c9]" />
              <Input 
                placeholder="Tìm địa điểm khác..."
                className="w-full pl-[52px] h-12 rounded-xl border-white shadow-sm hover:shadow-md transition-shadow text-[15px] focus-visible:ring-[#4ba2c9]/30 font-medium placeholder:text-[#8daab9]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button className="h-12 w-12 bg-white text-[#1a769d] hover:bg-[#eaf4f9] rounded-xl shadow-sm flex items-center justify-center shrink-0 border border-white">
              <MapIcon className="w-5 h-5" />
            </Button>
          </div>

          {/* Sub Filters Row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center text-[15px] mr-auto">
              <span className="font-extrabold text-[#111827] mr-1">{filteredCourts.length} kết quả</span> 
              <span className="text-[#8daab9] mx-1">ở</span> 
              <span className="font-bold text-[#1a769d] flex items-center gap-1 cursor-pointer hover:underline">
                 <MapPin className="w-4 h-4 ml-1" />
                 Thành phố Hồ Chí Minh
              </span>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="h-11 bg-white border-white hover:bg-gray-50 text-[#1a769d] font-bold rounded-xl px-4 shadow-sm w-[210px] shrink-0 border-0">
                  <SelectValue placeholder="Tất cả môn thể thao" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-[#dceef7] shadow-xl">
                  {courtTypes.map(t => <SelectItem key={t.value} value={t.value} className="font-medium cursor-pointer rounded-lg mx-1 my-1">{t.label}</SelectItem>)}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-4 bg-white border-white px-5 h-11 rounded-xl shadow-sm shrink-0 min-w-[320px]">
                <span className="text-[13px] font-bold text-[#64748b] whitespace-nowrap">Bán kính tìm kiếm:</span>
                <Slider 
                  value={[radius]} 
                  onValueChange={(val) => setRadius(val[0])}
                  min={0}
                  max={50} 
                  step={1} 
                  className="w-32 cursor-pointer" 
                />
                <span className="text-[13px] font-bold text-[#1a769d] whitespace-nowrap min-w-[40px] text-right">{radius} km</span>
              </div>

              <Button variant="outline" className="h-11 bg-white border-white text-[#111827] hover:bg-[#ebf4f8] hover:text-[#1a769d] rounded-xl font-bold shadow-sm px-6 shrink-0 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Bộ lọc
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
          {filteredCourts.map((court, index) => {
            const mockDistance = Math.floor(Math.random() * (900 - 100 + 1)) + 100; // 100m - 900m
            const staticDistances = [299, 312, 314, 333, 409, 471, 494, 495];
            const dist = index < staticDistances.length ? staticDistances[index] : mockDistance;

            return (
            <Card key={court.id} className="overflow-hidden border-[#e1eff5] shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] rounded-[1.5rem] transition-all duration-300 hover:-translate-y-1.5 bg-white group flex flex-col cursor-pointer">
              <Link to={`/courts/${court.id}`} className="block relative w-full pt-[65%] overflow-hidden bg-gray-100">
                <img
                  src={court.images[0]}
                  alt={court.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Image top gradient for text legibility if needed */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>

              <CardContent className="p-6 flex flex-col flex-1">
                <Link to={`/courts/${court.id}`} className="flex flex-col h-full flex-1">
                  
                  {/* Title row */}
                  <div className="flex items-start justify-between gap-3 mb-3 shrink-0">
                    <h3 className="font-extrabold text-[17px] text-[#111827] leading-snug line-clamp-2 group-hover:text-[#1a769d] transition-colors">{court.name}</h3>
                    <div className="bg-[#e6f4fa] px-2 py-0.5 rounded flex shrink-0 items-center -mt-0.5">
                      <span className="text-[12px] font-bold text-[#4ba2c9]">{dist} m</span>
                    </div>
                  </div>
                  
                  {/* Subtitle */}
                  <p className="text-[13px] font-medium text-[#64748b] mb-4 line-clamp-2 leading-relaxed">
                    Sân thể thao chất lượng cao tại Việt Nam
                  </p>

                  {/* Spacer to push location & price to bottom */}
                  <div className="flex-1"></div>

                  {/* Location Address */}
                  <div className="flex items-start gap-2 text-[#8daab9] mb-4 shrink-0">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="text-[13px] font-medium line-clamp-1">{court.address}</span>
                  </div>

                  {/* Price Row */}
                  <div className="pt-3 border-t border-dashed border-[#dceef7] flex items-center justify-between shrink-0">
                    <div>
                      <span className="text-[12px] font-medium text-[#8daab9]">từ </span>
                      <span className="text-[15px] font-black text-[#4ba2c9]">
                        {court.pricing.morning.toLocaleString()} đ
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#f4f8fb] flex items-center justify-center text-[#1a769d] group-hover:bg-[#1a769d] group-hover:text-white transition-colors">
                      <Search className="w-3.5 h-3.5" />
                    </div>
                  </div>

                </Link>
              </CardContent>
            </Card>
          )})}

          {filteredCourts.length === 0 && (
            <div className="col-span-full text-center py-20">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy kết quả</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Rất tiếc, chúng tôi không tìm thấy sân nào phù hợp với tìm kiếm của bạn. Hãy thử thay đổi bộ lọc.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Map Button is moved inside the relative container */}
      <button className="absolute bottom-8 right-8 w-[60px] h-[60px] bg-[#1a769d] hover:bg-[#156082] text-white rounded-2xl shadow-[0_8px_30px_rgb(26,118,157,0.4)] flex items-center justify-center transition-transform hover:-translate-y-1.5 z-50 group">
        <MapIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      </div>
    </div>
  );
}
