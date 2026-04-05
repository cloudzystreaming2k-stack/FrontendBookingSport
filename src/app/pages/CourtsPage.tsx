import { useState, useEffect } from "react";
import { Link } from "react-router";
import { MapPin, Search, Map as MapIcon, SlidersHorizontal, List, User, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent } from "../components/ui/card";
import { Slider } from "../components/ui/slider";
import { mockCourts } from "../data/mockData";
import api from "../lib/api";

interface Province { code: number; name: string; }
interface District { code: number; name: string; }

export function CourtsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [radius, setRadius] = useState(10);
  const [isMapView, setIsMapView] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Location filter
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedProvince, setSelectedProvince] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  useEffect(() => {
    api.get("/locations/provinces")
      .then(res => setProvinces(res.data.data ?? []))
      .catch(() => { });
  }, []);

  useEffect(() => {
    if (selectedProvince === "all") { setDistricts([]); setSelectedDistrict("all"); return; }
    setLoadingDistricts(true);
    api.get(`/locations/provinces/${selectedProvince}/districts`)
      .then(res => setDistricts(res.data.data ?? []))
      .catch(() => { })
      .finally(() => setLoadingDistricts(false));
    setSelectedDistrict("all");
  }, [selectedProvince]);

  // Default coordinate for Hochiminh center if courts lack coordinates
  const hcmCenter: [number, number] = [10.7769, 106.7009];

  const createCustomIcon = (index: number) => {
    return L.divIcon({
      className: 'custom-map-marker',
      html: `<div style="background-color: #4ba2c9; color: white; width: 28px; height: 28px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 13px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); transition: transform 0.2s;" onmouseover="this.style.backgroundColor='#FBBF24'; this.style.transform='scale(1.1)';" onmouseout="this.style.backgroundColor='#4ba2c9'; this.style.transform='scale(1)';">${index}</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -14]
    });
  };

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
    <div className="h-[calc(100vh-64px)] bg-[#f8fafc] font-sans p-4 lg:p-2 sm:p-6 flex flex-col overflow-hidden">
      <div className="w-full mx-auto flex-1 flex flex-col bg-white border-[5px] border-[#b6d6e6] rounded-[2rem] overflow-hidden relative shadow-[0_4px_30px_rgb(0,0,0,0.03)]">

        {isMapView ? (
          /* Map View Layout */
          <div className="flex flex-1 w-full h-full overflow-hidden">
            {/* Left Sidebar */}
            <div className={`relative flex flex-col bg-[#f0f8fb] transition-all duration-300 ease-in-out border-r border-[#dceef7] shadow-[4px_0_24px_rgba(0,0,0,0.05)] z-10 ${isSidebarOpen ? 'w-[400px] shrink-0' : 'w-0 overflow-hidden'}`}>
              <div className="p-4 border-b border-[#e1eff5] bg-white z-20">
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4ba2c9]" />
                  <Input
                    placeholder="Tìm địa điểm khác..."
                    className="w-full pl-9 h-11 bg-[#f9fcfe] shadow-inner border-[#e1eff5] rounded-xl text-[14px] font-medium placeholder:text-[#8daab9] focus-visible:ring-[#4ba2c9]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <div>
                    <span className="font-extrabold text-[#111827] text-[14px]">{filteredCourts.length} kết quả</span>
                    <span className="text-[#8daab9] mx-1">ở Thành phố Hồ Chí Minh</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-[#1a769d] hover:bg-[#eaf4f9]">
                    <SlidersHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-3 z-10 custom-scrollbar">
                {filteredCourts.map((court, idx) => (
                  <div key={court.id} className="bg-white p-3.5 border border-[#e1eff5] hover:border-[#b6d6e6] rounded-xl cursor-pointer hover:shadow-[0_4px_12px_rgba(32,126,168,0.08)] transition-all group relative overflow-hidden">
                    <div className="flex justify-between items-start mb-1.5 gap-2 relative z-10">
                      <h4 className="font-bold text-[14px] text-[#111827] line-clamp-2 leading-tight flex-1 group-hover:text-[#1a769d]">{court.name}</h4>
                      <span className="bg-[#eaf4f9] text-[#4ba2c9] text-[11px] font-bold px-1.5 py-0.5 rounded shrink-0">{idx < 5 ? (299 + idx * 15) : Math.floor(Math.random() * 500) + 100} m</span>
                    </div>
                    <p className="text-[#64748b] text-[12px] mb-2.5 relative z-10">Sân thể thao chất lượng cao tại Việt Nam</p>
                    <div className="flex items-center gap-2 text-[#8daab9] mb-2.5 relative z-10">
                      <User className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-[12px] line-clamp-1">{court.address}</span>
                    </div>
                    <div className="text-[14px] font-black text-[#4ba2c9] relative z-10">
                      <span className="text-[#8daab9] text-[11px] font-medium mr-1.5 inline-block">từ</span>
                      {court.pricing.morning.toLocaleString()} đ
                    </div>
                  </div>
                ))}
              </div>

              <div className="absolute bottom-4 left-4 z-20">
                <Button onClick={() => setIsMapView(false)} className="bg-white text-[#111827] hover:bg-gray-50 border border-[#e1eff5] shadow-[0_4px_16px_rgba(0,0,0,0.08)] rounded-full px-5 h-10 flex items-center gap-2 font-bold text-[13px] hover:-translate-y-0.5 transition-transform">
                  <List className="w-4 h-4 text-[#1a769d]" /> Danh sách
                </Button>
              </div>
            </div>

            {/* Map Area */}
            <div className="flex-1 relative bg-[#e5e5e5]">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="absolute top-1/2 -translate-y-1/2 left-0 z-[1000] w-5 h-14 bg-white border border-[#e1eff5] border-l-0 rounded-r-lg shadow-[4px_0_12px_rgba(0,0,0,0.05)] flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                {isSidebarOpen ? <ChevronLeft className="w-3.5 h-3.5 text-gray-500" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-500" />}
              </button>

              <MapContainer
                center={hcmCenter}
                zoom={13}
                className="w-full h-full z-0 relative"
                zoomControl={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filteredCourts.map((court, idx) => {
                  const pos = court.coordinates || [hcmCenter[0] + (Math.random() - 0.5) * 0.08, hcmCenter[1] + (Math.random() - 0.5) * 0.08];
                  return (
                    <Marker
                      key={court.id}
                      position={pos as [number, number]}
                      icon={createCustomIcon(idx + 1)}
                    >
                      <Popup className="font-sans rounded-xl overflow-hidden border-0 shadow-lg p-0">
                        <div className="p-3">
                          <div className="font-extrabold text-[#111827] text-sm mb-1 leading-tight">{court.name}</div>
                          <div className="text-xs text-[#64748b] mb-2 flex items-start gap-1">
                            <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{court.address}</span>
                          </div>
                          <div className="text-sm font-black text-[#4ba2c9]">
                            <span className="text-[10px] text-[#8daab9] font-medium mr-1 uppercase">Từ</span>
                            {court.pricing.morning.toLocaleString()} đ
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>
          </div>
        ) : (
          /* Grid View Layout */
          <div className="flex flex-col flex-1 overflow-y-auto pb-24 relative custom-scrollbar">
            {/* Top Filter Bar */}
            <div className="bg-[#f0f8fb] border-b-[2.5px] border-[#e1eff5] sticky top-0 z-40">
              <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 py-4 w-full">

                {/* Main Search Row */}
                <div className="flex gap-3 mb-4 w-full">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4ba2c9]" />
                    <Input
                      placeholder="Tìm địa điểm khác..."
                      className="w-full pl-[50px] h-[46px] rounded-xl border border-[#e1eff5] shadow-sm hover:shadow-md transition-shadow text-[15px] focus-visible:ring-[#4ba2c9]/30 font-medium placeholder:text-[#4ba2c9]/60 text-[#1a769d]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button onClick={() => setIsMapView(true)} className="h-[46px] w-[46px] bg-white text-[#1a769d] hover:bg-[#eaf4f9] rounded-xl shadow-sm flex items-center justify-center shrink-0 border border-[#e1eff5] transition-all hover:scale-105 active:scale-95">
                    <MapIcon className="w-5 h-5" />
                  </Button>
                </div>

                {/* Sub Filters Row */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
                  <div className="flex items-center text-[15px] mr-auto">
                    <span className="font-extrabold text-[#111827] mr-1">{filteredCourts.length} kết quả</span>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                    {/* Dropdown loại sân */}
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger className="h-[42px] bg-white border border-[#e1eff5] hover:bg-gray-50 text-[#4ba2c9] font-medium rounded-xl px-4 shadow-sm w-[210px] shrink-0">
                        <SelectValue placeholder="Tất cả môn thể thao" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-[#dceef7] shadow-xl">
                        {courtTypes.map(t => <SelectItem key={t.value} value={t.value} className="font-medium cursor-pointer rounded-lg mx-1 my-1">{t.label}</SelectItem>)}
                      </SelectContent>
                    </Select>

                    {/* Dropdown Tỉnh/Thành phố */}
                    <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                      <SelectTrigger className="h-[42px] bg-white border border-[#e1eff5] hover:bg-gray-50 text-[#4ba2c9] font-medium rounded-xl px-4 shadow-sm w-[220px] shrink-0">
                        <SelectValue placeholder="Tất cả tỉnh/thành" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-[#dceef7] shadow-xl max-h-64 overflow-y-auto">
                        <SelectItem value="all" className="font-medium cursor-pointer rounded-lg mx-1 my-1">Tất cả tỉnh/thành</SelectItem>
                        {provinces.map(p => (
                          <SelectItem key={p.code} value={String(p.code)} className="font-medium cursor-pointer rounded-lg mx-1 my-1">{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Dropdown Quận/Huyện */}
                    <Select
                      value={selectedDistrict}
                      onValueChange={setSelectedDistrict}
                      disabled={selectedProvince === "all" || loadingDistricts}
                    >
                      <SelectTrigger className="h-[42px] bg-white border border-[#e1eff5] hover:bg-gray-50 text-[#4ba2c9] font-medium rounded-xl px-4 shadow-sm w-[200px] shrink-0 disabled:opacity-60">
                        <SelectValue placeholder={
                          selectedProvince === "all" ? "Chọn tỉnh trước" :
                            loadingDistricts ? "Đang tải..." : "Tất cả quận/huyện"
                        } />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-[#dceef7] shadow-xl max-h-64 overflow-y-auto">
                        <SelectItem value="all" className="font-medium cursor-pointer rounded-lg mx-1 my-1">Tất cả quận/huyện</SelectItem>
                        {districts.map(d => (
                          <SelectItem key={d.code} value={String(d.code)} className="font-medium cursor-pointer rounded-lg mx-1 my-1">{d.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="flex items-center gap-4 bg-white border border-[#e1eff5] px-5 h-[42px] rounded-xl shadow-sm shrink-0 min-w-[320px]">
                      <span className="text-[13px] font-medium text-[#64748b] whitespace-nowrap">Bán kính tìm kiếm:</span>
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

                    <Button variant="outline" className="h-[42px] bg-white border border-[#e1eff5] text-[#111827] hover:bg-[#ebf4f8] hover:text-[#1a769d] rounded-xl font-medium shadow-sm px-6 shrink-0 flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      Bộ lọc
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid Content */}
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-30 py-8 md:py-4 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-3">
                {filteredCourts.map((court, index) => {
                  const mockDistance = Math.floor(Math.random() * (900 - 100 + 1)) + 100; // 100m - 900m
                  const staticDistances = [299, 312, 314, 333, 409, 471, 494, 495];
                  const dist = index < staticDistances.length ? staticDistances[index] : mockDistance;

                  return (
                    <Card key={court.id} className="overflow-hidden border border-[#e1eff5] shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-[1.25rem] transition-all duration-300 hover:-translate-y-1 bg-[#fcfdfe] group flex flex-col cursor-pointer">
                      <Link to={`/courts/${court.id}`} className="block relative w-full pt-[55%] overflow-hidden bg-gray-100">
                        <img
                          src={court.images[0]}
                          alt={court.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Image top gradient for text legibility if needed */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </Link>

                      <CardContent className="p-4 flex flex-col flex-1">
                        <Link to={`/courts/${court.id}`} className="flex flex-col h-full flex-1">

                          {/* Title row */}
                          <div className="flex items-start justify-between gap-2 mb-2 shrink-0">
                            <h3 className="font-extrabold text-[15px] text-[#111827] leading-snug line-clamp-2 group-hover:text-[#1a769d] transition-colors">{court.name}</h3>
                            <div className="bg-[#eaf4f9] px-2 py-0.5 rounded flex shrink-0 items-center -mt-0.5">
                              <span className="text-[12px] font-bold text-[#4ba2c9]">{dist} m</span>
                            </div>
                          </div>

                          {/* Subtitle */}
                          <p className="text-[12px] font-medium text-[#64748b] mb-3 line-clamp-2 leading-relaxed">
                            Sân thể thao chất lượng cao tại Việt Nam
                          </p>

                          {/* Spacer to push location & price to bottom */}
                          <div className="flex-1"></div>

                          {/* Location Address */}
                          <div className="flex items-start gap-1.5 text-[#8daab9] mb-3 shrink-0">
                            <User className="w-3.5 h-3.5 shrink-0 mt-[2px]" />
                            <span className="text-[12px] font-medium line-clamp-1">{court.address}</span>
                          </div>

                          {/* Price Row */}
                          <div className="flex items-center shrink-0">
                            <span className="text-[12px] font-medium text-[#8daab9] mr-1">từ </span>
                            <span className="text-[14px] font-black text-[#1a769d]">
                              {court.pricing.morning.toLocaleString()} đ
                            </span>
                          </div>

                        </Link>
                      </CardContent>
                    </Card>
                  )
                })}

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
          </div>
        )}
      </div>
    </div>
  );
}
