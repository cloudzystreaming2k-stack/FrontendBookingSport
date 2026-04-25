import { JSX, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
   Cloud,
   CloudRain,
   Sun,
   Wind,
   Droplets,
   Gauge,
   Eye,
   Sunrise,
   Sunset,
   MapPin,
   Calendar,
   ThermometerSun,
   CloudDrizzle,
   CloudSnow,
   Zap,
   Navigation,
   Search,
   Loader2
} from "lucide-react";

interface WeatherData {
   city: string;
   current: {
      temp: number;
      feelsLike: number;
      condition: string;
      icon: string;
      humidity: number;
      windSpeed: number;
      pressure: number;
      visibility: number;
      uvIndex: number;
      sunrise: string;
      sunset: string;
   };
   forecast: Array<{
      day: string;
      date: string;
      temp: { min: number; max: number };
      condition: string;
      icon: string;
      precipitation: number;
   }>;
}

// OpenWeather API Configuration
// Thay YOUR_API_KEY_HERE bằng API key từ https://openweathermap.org/api
const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export function WeatherPage() {
   const [cityInput, setCityInput] = useState("");
   const [weather, setWeather] = useState<WeatherData | null>(null);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   // Chuyển đổi dữ liệu từ OpenWeather API sang định dạng app
   const convertApiData = (currentData: any, forecastData: any): WeatherData => {
      const formatTime = (timestamp: number) => {
         const date = new Date(timestamp * 1000);
         return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
      };

      const translateCondition = (desc: string): string => {
         const translations: Record<string, string> = {
            "clear sky": "Trời quang",
            "few clouds": "Ít mây",
            "scattered clouds": "Có mây",
            "broken clouds": "Nhiều mây",
            "overcast clouds": "U ám",
            "light rain": "Mưa nhẹ",
            "moderate rain": "Mưa vừa",
            "heavy rain": "Mưa lớn",
            "shower rain": "Mưa rào",
            "rain": "Mưa",
            "thunderstorm": "Giông bão",
            "snow": "Tuyết",
            "mist": "Sương mù",
            "fog": "Sương mù",
            "haze": "Sương mù",
         };
         return translations[desc.toLowerCase()] || desc;
      };

      const getIconFromCode = (code: string): string => {
         const iconMap: Record<string, string> = {
            "01d": "sun", "01n": "sun",
            "02d": "cloud", "02n": "cloud",
            "03d": "cloud", "03n": "cloud",
            "04d": "cloud", "04n": "cloud",
            "09d": "drizzle", "09n": "drizzle",
            "10d": "rain", "10n": "rain",
            "11d": "storm", "11n": "storm",
            "13d": "snow", "13n": "snow",
            "50d": "cloud", "50n": "cloud",
         };
         return iconMap[code] || "sun";
      };

      // Xử lý forecast - nhóm theo ngày
      const dailyData = new Map<string, any>();
      forecastData.list.forEach((item: any) => {
         const date = new Date(item.dt * 1000);
         const dateKey = date.toLocaleDateString("vi-VN");

         if (!dailyData.has(dateKey)) {
            dailyData.set(dateKey, {
               temps: [item.main.temp],
               icon: item.weather[0].icon,
               description: item.weather[0].description,
               pop: item.pop || 0,
            });
         } else {
            dailyData.get(dateKey).temps.push(item.main.temp);
         }
      });

      const daysOfWeek = ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
      const forecast: any[] = [];
      let dayIndex = 0;

      dailyData.forEach((value, dateKey) => {
         if (dayIndex < 7) {
            const date = new Date(dateKey.split("/").reverse().join("-"));
            const dayName = dayIndex === 0 ? "Hôm nay" : daysOfWeek[date.getDay()];

            forecast.push({
               day: dayName,
               date: dateKey.slice(0, 5),
               temp: {
                  min: Math.round(Math.min(...value.temps)),
                  max: Math.round(Math.max(...value.temps)),
               },
               condition: translateCondition(value.description),
               icon: getIconFromCode(value.icon),
               precipitation: Math.round(value.pop * 100),
            });
            dayIndex++;
         }
      });

      return {
         city: currentData.name,
         current: {
            temp: Math.round(currentData.main.temp),
            feelsLike: Math.round(currentData.main.feels_like),
            condition: translateCondition(currentData.weather[0].description),
            icon: getIconFromCode(currentData.weather[0].icon),
            humidity: currentData.main.humidity,
            windSpeed: Math.round(currentData.wind.speed * 3.6),
            pressure: currentData.main.pressure,
            visibility: Math.round(currentData.visibility / 1000),
            uvIndex: 0,
            sunrise: formatTime(currentData.sys.sunrise),
            sunset: formatTime(currentData.sys.sunset),
         },
         forecast,
      };
   };

   // Tìm kiếm thời tiết theo tên thành phố
   const searchWeather = async (cityName: string) => {
      if (!cityName.trim()) {
         setError("Vui lòng nhập tên thành phố");
         return;
      }

      setLoading(true);
      setError(null);

      try {
         const currentResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=vi`
         );

         if (!currentResponse.ok) {
            if (currentResponse.status === 404) {
               throw new Error("Không tìm thấy thành phố. Vui lòng kiểm tra lại tên thành phố.");
            } else if (currentResponse.status === 401) {
               throw new Error("API key không hợp lệ. Vui lòng cấu hình API key trong code.");
            }
            throw new Error("Không thể lấy dữ liệu thời tiết.");
         }

         const currentData = await currentResponse.json();

         const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cityName)}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=vi`
         );

         if (!forecastResponse.ok) {
            throw new Error("Không thể lấy dữ liệu dự báo.");
         }

         const forecastData = await forecastResponse.json();
         const weatherData = convertApiData(currentData, forecastData);

         setWeather(weatherData);
         setError(null);
      } catch (err: any) {
         setError(err.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
         setWeather(null);
      } finally {
         setLoading(false);
      }
   };

   // Lấy thời tiết theo vị trí hiện tại
   const getCurrentLocationWeather = () => {
      if (!navigator.geolocation) {
         setError("Trình duyệt không hỗ trợ định vị.");
         return;
      }

      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
         async (position) => {
            const { latitude, longitude } = position.coords;

            try {
               const currentResponse = await fetch(
                  `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=vi`
               );

               if (!currentResponse.ok) {
                  throw new Error("Không thể lấy dữ liệu thời tiết.");
               }

               const currentData = await currentResponse.json();

               const forecastResponse = await fetch(
                  `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=vi`
               );

               if (!forecastResponse.ok) {
                  throw new Error("Không thể lấy dữ liệu dự báo.");
               }

               const forecastData = await forecastResponse.json();
               const weatherData = convertApiData(currentData, forecastData);

               setWeather(weatherData);
               setCityInput(currentData.name);
               setError(null);
            } catch (err: any) {
               setError(err.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
            } finally {
               setLoading(false);
            }
         },
         () => {
            setLoading(false);
            setError("Không thể lấy vị trí. Vui lòng kiểm tra quyền truy cập vị trí.");
         }
      );
   };

   const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
         searchWeather(cityInput);
      }
   };

   const getWeatherIcon = (icon: string, size: string = "w-8 h-8") => {
      const icons: Record<string, JSX.Element> = {
         sun: <Sun className={`${size} text-yellow-500`} />,
         cloud: <Cloud className={`${size} text-gray-500`} />,
         rain: <CloudRain className={`${size} text-blue-500`} />,
         drizzle: <CloudDrizzle className={`${size} text-blue-400`} />,
         snow: <CloudSnow className={`${size} text-blue-200`} />,
         storm: <Zap className={`${size} text-yellow-600`} />,
      };
      return icons[icon] || icons.sun;
   };

   const getWeatherBg = (icon: string) => {
      const backgrounds: Record<string, string> = {
         sun: "from-orange-400 via-yellow-400 to-blue-400",
         cloud: "from-gray-400 via-gray-300 to-blue-300",
         rain: "from-blue-600 via-blue-400 to-gray-400",
         drizzle: "from-blue-500 via-blue-300 to-gray-300",
      };
      return backgrounds[icon] || backgrounds.sun;
   };

   const getRecommendation = (temp: number, condition: string) => {
      if (temp >= 32) {
         return { text: "Rất nóng - Nên tránh chơi thể thao ngoài trời vào giữa trưa", color: "text-red-600", bgColor: "bg-red-50" };
      } else if (temp >= 28) {
         return { text: "Thời tiết tốt - Phù hợp để chơi thể thao", color: "text-green-600", bgColor: "bg-green-50" };
      } else if (condition.includes("Mưa")) {
         return { text: "Có mưa - Nên đặt sân trong nhà", color: "text-blue-600", bgColor: "bg-blue-50" };
      } else {
         return { text: "Thời tiết mát mẻ - Lý tưởng cho hoạt động ngoài trời", color: "text-green-600", bgColor: "bg-green-50" };
      }
   };

   // Dữ liệu hiển thị (dùng weather nếu có, nếu không dùng placeholder)
   const displayData = weather || {
      city: "-",
      current: {
         temp: 0,
         feelsLike: 0,
         condition: "-",
         icon: "sun",
         humidity: 0,
         windSpeed: 0,
         pressure: 0,
         visibility: 0,
         uvIndex: 0,
         sunrise: "-",
         sunset: "-",
      },
      forecast: Array(7).fill(null).map((_, i) => ({
         day: i === 0 ? "Hôm nay" : ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"][i - 1] || "-",
         date: "-",
         temp: { min: 0, max: 0 },
         condition: "-",
         icon: "sun",
         precipitation: 0,
      })),
   };

   const displayValue = (value: any, suffix: string = "") => {
      if (!weather) return "-";
      return value === 0 ? "-" : `${value}${suffix}`;
   };

   return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
               <h1 className="text-4xl font-bold text-gray-800 mb-2">Thời tiết</h1>
               <p className="text-gray-600 mb-6">
                  Kiểm tra thời tiết để lên kế hoạch chơi thể thao tốt nhất
               </p>

               {/* Search Card */}
               <Card className="bg-gradient-to-r from-blue-600 to-blue-700 border-none shadow-xl">
                  <CardContent className="p-6">
                     <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                           <Input
                              type="text"
                              placeholder="Nhập tên thành phố... (ví dụ: Ha Noi, Da Nang, Ho Chi Minh)"
                              value={cityInput}
                              onChange={(e) => setCityInput(e.target.value)}
                              onKeyPress={handleKeyPress}
                              disabled={loading}
                              className="h-12 text-lg bg-white/95 border-none focus:bg-white"
                           />
                        </div>
                        <div className="flex gap-3">
                           <Button
                              onClick={() => searchWeather(cityInput)}
                              disabled={loading || !cityInput.trim()}
                              className="h-12 px-6 bg-white text-blue-700 hover:bg-blue-50"
                           >
                              {loading ? (
                                 <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                 <>
                                    <Search className="w-5 h-5 mr-2" />
                                    Tìm kiếm
                                 </>
                              )}
                           </Button>
                           <Button
                              onClick={getCurrentLocationWeather}
                              disabled={loading}
                              className="h-12 px-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                           >
                              {loading ? (
                                 <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                 <>
                                    <Navigation className="w-5 h-5 mr-2" />
                                    Vị trí hiện tại
                                 </>
                              )}
                           </Button>
                        </div>
                     </div>
                     {error && (
                        <div className="mt-4 p-4 bg-red-500/20 border border-red-300 rounded-lg text-white">
                           <p className="font-medium">{error}</p>
                        </div>
                     )}
                  </CardContent>
               </Card>
            </div>

            {/* Current Weather Card */}
            <Card className="mb-8 overflow-hidden shadow-2xl">
               <div className={`bg-gradient-to-br ${getWeatherBg(displayData.current.icon)} p-8 text-white`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div>
                        <div className="flex items-center gap-2 mb-4">
                           <MapPin className="w-5 h-5" />
                           <h2 className="text-2xl font-semibold">{displayData.city}</h2>
                        </div>
                        <div className="flex items-center gap-4 mb-6">
                           {getWeatherIcon(displayData.current.icon, "w-24 h-24")}
                           <div>
                              <div className="text-7xl font-bold">{displayValue(displayData.current.temp, "°")}</div>
                              <div className="text-xl opacity-90">Cảm giác như {displayValue(displayData.current.feelsLike, "°")}</div>
                           </div>
                        </div>
                        <div className="text-2xl font-medium mb-2">{displayData.current.condition}</div>
                        <div className="flex items-center gap-2 text-sm opacity-90">
                           <Calendar className="w-4 h-4" />
                           <span>Thứ Tư, 23 tháng 4 năm 2026</span>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                           <div className="flex items-center gap-2 mb-2">
                              <Droplets className="w-5 h-5" />
                              <span className="text-sm opacity-90">Độ ẩm</span>
                           </div>
                           <div className="text-2xl font-bold">{displayValue(displayData.current.humidity, "%")}</div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                           <div className="flex items-center gap-2 mb-2">
                              <Wind className="w-5 h-5" />
                              <span className="text-sm opacity-90">Gió</span>
                           </div>
                           <div className="text-2xl font-bold">{displayValue(displayData.current.windSpeed, " km/h")}</div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                           <div className="flex items-center gap-2 mb-2">
                              <Gauge className="w-5 h-5" />
                              <span className="text-sm opacity-90">Áp suất</span>
                           </div>
                           <div className="text-2xl font-bold">{displayValue(displayData.current.pressure, " hPa")}</div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                           <div className="flex items-center gap-2 mb-2">
                              <Eye className="w-5 h-5" />
                              <span className="text-sm opacity-90">Tầm nhìn</span>
                           </div>
                           <div className="text-2xl font-bold">{displayValue(displayData.current.visibility, " km")}</div>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                     <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                           <ThermometerSun className="w-5 h-5" />
                           <span className="text-sm opacity-90">Chỉ số UV</span>
                        </div>
                        <div className="text-2xl font-bold">
                           {displayValue(displayData.current.uvIndex)}
                           {weather && (
                              <span className="text-sm ml-2 opacity-90">
                                 {displayData.current.uvIndex >= 8 ? "Rất cao" : displayData.current.uvIndex >= 6 ? "Cao" : "Trung bình"}
                              </span>
                           )}
                        </div>
                     </div>
                     <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                           <Sunrise className="w-5 h-5" />
                           <span className="text-sm opacity-90">Bình minh</span>
                        </div>
                        <div className="text-2xl font-bold">{displayData.current.sunrise}</div>
                     </div>
                     <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                           <Sunset className="w-5 h-5" />
                           <span className="text-sm opacity-90">Hoàng hôn</span>
                        </div>
                        <div className="text-2xl font-bold">{displayData.current.sunset}</div>
                     </div>
                  </div>
               </div>
            </Card>

            {/* Recommendation Banner */}
            {(() => {
               if (!weather) {
                  return (
                     <Card className="mb-8 bg-gray-50 border-none shadow-lg">
                        <CardContent className="p-6">
                           <div className="flex items-center gap-4">
                              <div className="p-3 rounded-full bg-white text-gray-400">
                                 {getWeatherIcon("sun", "w-8 h-8")}
                              </div>
                              <div>
                                 <h3 className="font-semibold text-lg mb-1">Khuyến nghị cho hoạt động thể thao</h3>
                                 <p className="text-gray-600 font-medium">-</p>
                              </div>
                           </div>
                        </CardContent>
                     </Card>
                  );
               }

               const recommendation = getRecommendation(displayData.current.temp, displayData.current.condition);
               return (
                  <Card className={`mb-8 ${recommendation.bgColor} border-none shadow-lg`}>
                     <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                           <div className={`p-3 rounded-full bg-white ${recommendation.color}`}>
                              {getWeatherIcon(displayData.current.icon, "w-8 h-8")}
                           </div>
                           <div>
                              <h3 className="font-semibold text-lg mb-1">Khuyến nghị cho hoạt động thể thao</h3>
                              <p className={`${recommendation.color} font-medium`}>{recommendation.text}</p>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               );
            })()}

            {/* 7-Day Forecast */}
            <Card className="shadow-xl">
               <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                     <Calendar className="w-6 h-6 text-blue-600" />
                     Dự báo 7 ngày tới
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                     {displayData.forecast.map((day, index) => (
                        <Card
                           key={index}
                           className={`overflow-hidden transition-all hover:shadow-lg ${index === 0 ? "bg-blue-50 border-2 border-blue-500" : "hover:bg-gray-50"
                              }`}
                        >
                           <CardContent className="p-4 text-center">
                              <div className={`font-semibold mb-1 ${index === 0 ? "text-blue-600" : "text-gray-700"}`}>
                                 {day.day}
                              </div>
                              <div className="text-sm text-gray-500 mb-3">{day.date}</div>
                              <div className="flex justify-center mb-3">
                                 {getWeatherIcon(day.icon, "w-12 h-12")}
                              </div>
                              <div className="text-sm text-gray-600 mb-3 font-medium">
                                 {day.condition}
                              </div>
                              <div className="flex justify-center gap-2 mb-2">
                                 <span className="text-xl font-bold text-gray-800">
                                    {weather ? `${day.temp.max}°` : "-"}
                                 </span>
                                 <span className="text-xl text-gray-400">
                                    {weather ? `${day.temp.min}°` : "-"}
                                 </span>
                              </div>
                              <div className="flex items-center justify-center gap-1 text-xs text-blue-600">
                                 <Droplets className="w-3 h-3" />
                                 <span>{weather ? `${day.precipitation}%` : "-"}</span>
                              </div>
                           </CardContent>
                        </Card>
                     ))}
                  </div>
               </CardContent>
            </Card>

            {/* Tips Section */}
            <Card className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border-none shadow-lg">
               <CardHeader>
                  <CardTitle className="text-xl">💡 Mẹo chơi thể thao theo thời tiết</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                           <Sun className="w-6 h-6 text-yellow-500" />
                           <h4 className="font-semibold">Ngày nắng</h4>
                        </div>
                        <ul className="text-sm text-gray-600 space-y-2">
                           <li>• Uống nhiều nước trước và sau khi chơi</li>
                           <li>• Đeo mũ và kính bảo vệ</li>
                           <li>• Tránh giờ cao điểm 11h-15h</li>
                           <li>• Thoa kem chống nắng</li>
                        </ul>
                     </div>
                     <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                           <CloudRain className="w-6 h-6 text-blue-500" />
                           <h4 className="font-semibold">Ngày mưa</h4>
                        </div>
                        <ul className="text-sm text-gray-600 space-y-2">
                           <li>• Ưu tiên đặt sân trong nhà</li>
                           <li>• Kiểm tra dự báo trước khi đi</li>
                           <li>• Mang theo áo mưa</li>
                           <li>• Chú ý sân trơn trượt</li>
                        </ul>
                     </div>
                     <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                           <Wind className="w-6 h-6 text-gray-500" />
                           <h4 className="font-semibold">Ngày gió</h4>
                        </div>
                        <ul className="text-sm text-gray-600 space-y-2">
                           <li>• Điều chỉnh cách chơi phù hợp</li>
                           <li>• Chọn sân có che chắn gió</li>
                           <li>• Mặc quần áo vừa vặn</li>
                           <li>• Cẩn thận với bóng bay xa</li>
                        </ul>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}
