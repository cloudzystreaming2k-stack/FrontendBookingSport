import { useState, useMemo } from "react";
import {
   DollarSign,
   TrendingUp,
   TrendingDown,
   Activity,
   BarChart3,
   PieChart,
   Download,
   Filter,
   Loader2,
   Calendar,
   MapPin,
   Trophy,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import {
   LineChart,
   Line,
   BarChart,
   Bar,
   PieChart as RechartsPieChart,
   Pie,
   Cell,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   Legend,
   ResponsiveContainer,
   Area,
   AreaChart,
} from "recharts";
import { mockBookings, mockCourts } from "../../data/mockData";
import { toast } from "sonner";
import * as XLSX from "xlsx";

const PAYMENT_METHOD_LABELS: Record<string, string> = {
   vnpay: "VNPay",
   momo: "MoMo",
   banking: "Chuyển khoản",
   card: "Thẻ tín dụng",
   cash: "Tiền mặt",
};

export function AdminRevenue() {
   const [isExporting, setIsExporting] = useState(false);
   const [courtFilter, setCourtFilter] = useState("all");
   const [sportTypeFilter, setSportTypeFilter] = useState("all");
   const [dateFrom, setDateFrom] = useState("");
   const [dateTo, setDateTo] = useState("");
   const [timeRange, setTimeRange] = useState("30days");

   // Lọc dữ liệu theo sân và loại sân
   const filteredBookings = useMemo(() => {
      return mockBookings.filter((booking) => {
         if (booking.paymentStatus !== "paid") return false;

         const matchCourt = courtFilter === "all" || booking.courtName === courtFilter;

         const court = mockCourts.find((c) => c.name === booking.courtName);
         const matchSportType =
            sportTypeFilter === "all" || court?.type === sportTypeFilter;

         const matchDateFrom = !dateFrom || booking.createdAt >= dateFrom;
         const matchDateTo = !dateTo || booking.createdAt <= dateTo;

         return matchCourt && matchSportType && matchDateFrom && matchDateTo;
      });
   }, [mockBookings, courtFilter, sportTypeFilter, dateFrom, dateTo]);

   // Thống kê tổng quan
   const overviewStats = useMemo(() => {
      const totalRevenue = filteredBookings.reduce((sum, b) => sum + b.totalPrice, 0);
      const totalBookings = filteredBookings.length;

      // Doanh thu tháng này
      const today = new Date();
      const thisMonthBookings = filteredBookings.filter((b) => {
         const bDate = new Date(b.createdAt);
         return (
            bDate.getMonth() === today.getMonth() &&
            bDate.getFullYear() === today.getFullYear()
         );
      });
      const thisMonthRevenue = thisMonthBookings.reduce(
         (sum, b) => sum + b.totalPrice,
         0
      );

      // Doanh thu tháng trước
      const lastMonthDate = new Date(today);
      lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
      const lastMonthBookings = filteredBookings.filter((b) => {
         const bDate = new Date(b.createdAt);
         return (
            bDate.getMonth() === lastMonthDate.getMonth() &&
            bDate.getFullYear() === lastMonthDate.getFullYear()
         );
      });
      const lastMonthRevenue = lastMonthBookings.reduce(
         (sum, b) => sum + b.totalPrice,
         0
      );

      const growthRate =
         lastMonthRevenue > 0
            ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
            : 0;

      const avgBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

      return {
         totalRevenue,
         totalBookings,
         thisMonthRevenue,
         lastMonthRevenue,
         growthRate,
         avgBookingValue,
         thisMonthBookings: thisMonthBookings.length,
      };
   }, [filteredBookings]);

   // Dữ liệu biểu đồ theo ngày (30/60/90 ngày)
   const revenueByDayData = useMemo(() => {
      const days = timeRange === "30days" ? 30 : timeRange === "60days" ? 60 : 90;
      const data = [];

      for (let i = days - 1; i >= 0; i--) {
         const date = new Date();
         date.setDate(date.getDate() - i);

         const dayBookings = filteredBookings.filter((b) => {
            const bDate = new Date(b.createdAt);
            return bDate.toDateString() === date.toDateString();
         });

         const revenue = dayBookings.reduce((sum, b) => sum + b.totalPrice, 0);

         data.push({
            date: `${date.getDate()}/${date.getMonth() + 1}`,
            doanhthu: revenue / 1000,
            giaodich: dayBookings.length,
         });
      }

      return data;
   }, [filteredBookings, timeRange]);

   // Doanh thu theo từng sân
   const revenueByCourtData = useMemo(() => {
      const courtStats: Record<string, number> = {};

      filteredBookings.forEach((b) => {
         courtStats[b.courtName] = (courtStats[b.courtName] || 0) + b.totalPrice;
      });

      return Object.entries(courtStats)
         .map(([name, amount]) => ({
            name,
            doanhthu: amount / 1000,
            amount,
         }))
         .sort((a, b) => b.amount - a.amount);
   }, [filteredBookings]);

   // Doanh thu theo loại sân
   const revenueBySportTypeData = useMemo(() => {
      const sportStats: Record<string, number> = {};

      filteredBookings.forEach((b) => {
         const court = mockCourts.find((c) => c.name === b.courtName);
         if (court) {
            sportStats[court.type] =
               (sportStats[court.type] || 0) + b.totalPrice;
         }
      });

      const sportTypeLabels: Record<string, string> = {
         pickleball: "Pickleball",
         badminton: "Cầu lông",
         basketball: "Bóng rổ",
      };

      return Object.entries(sportStats).map(([type, amount]) => ({
         name: sportTypeLabels[type] || type,
         value: amount,
         amount,
      }));
   }, [filteredBookings]);

   // Doanh thu theo phương thức thanh toán
   const revenueByMethodData = useMemo(() => {
      const methodStats: Record<string, number> = {};

      filteredBookings.forEach((b) => {
         const method = b.paymentMethod || "vnpay";
         methodStats[method] = (methodStats[method] || 0) + b.totalPrice;
      });

      return Object.entries(methodStats).map(([method, amount]) => ({
         name: PAYMENT_METHOD_LABELS[method] || method,
         doanhthu: amount / 1000,
         amount,
      }));
   }, [filteredBookings]);

   // Màu cho biểu đồ
   const CHART_COLORS = ["#0d9488", "#14b8a6", "#2dd4bf", "#5eead4", "#99f6e4"];
   const SPORT_COLORS = ["#0d9488", "#3b82f6", "#f59e0b"];

   const handleExport = async () => {
      setIsExporting(true);
      try {
         toast.info("Đang tạo file báo cáo...");

         // 1. Dữ liệu Tổng quan
         const overviewData = [
            {
               "Chỉ số": "Tổng doanh thu",
               "Giá trị": overviewStats.totalRevenue,
            },
            {
               "Chỉ số": "Tổng số đơn",
               "Giá trị": overviewStats.totalBookings,
            },
            {
               "Chỉ số": "Doanh thu tháng này",
               "Giá trị": overviewStats.thisMonthRevenue,
            },
            {
               "Chỉ số": "Tăng trưởng so với tháng trước (%)",
               "Giá trị": overviewStats.growthRate.toFixed(2),
            },
            {
               "Chỉ số": "Giá trị trung bình/đơn",
               "Giá trị": overviewStats.avgBookingValue,
            },
         ];

         // 2. Chi tiết giao dịch
         const transactionsData = filteredBookings.map((b) => ({
            "Mã giao dịch": b.id,
            "Tên sân": b.courtName,
            "Khách hàng": b.customerName || b.user?.name || "N/A",
            "Số điện thoại": b.customerPhone || b.user?.phoneNumber || "N/A",
            "Tổng tiền (VNĐ)": b.totalPrice,
            "Trạng thái": b.paymentStatus === "paid" ? "Đã thanh toán" : b.paymentStatus,
            "Phương thức": PAYMENT_METHOD_LABELS[b.paymentMethod || "vnpay"] || b.paymentMethod,
            "Ngày đặt": new Date(b.createdAt).toLocaleString("vi-VN"),
         }));

         // 3. Theo ngày
         const byDayData = revenueByDayData.map((d) => ({
            "Ngày": d.date,
            "Doanh thu (VNĐ)": d.doanhthu * 1000,
            "Số giao dịch": d.giaodich,
         }));

         // 4. Theo sân
         const byCourtData = revenueByCourtData.map((c) => ({
            "Tên sân": c.name,
            "Doanh thu (VNĐ)": c.amount,
            "Số giao dịch": filteredBookings.filter((b) => b.courtName === c.name).length,
         }));

         // Tạo Workbook
         const wb = XLSX.utils.book_new();

         // Hàm helper tạo sheet có layout đẹp
         const appendSheetWithLayout = (data: any[], sheetName: string, title: string) => {
            // 1. Tạo sheet với tiêu đề và thông tin chung
            const wsData = [
               [title.toUpperCase()], // Dòng 1: Tiêu đề lớn
               [], // Dòng 2: Trống
               [`Ngày lập báo cáo: ${new Date().toLocaleString("vi-VN")}`], // Dòng 3: Thời gian
               [`Bộ lọc: Sân (${courtFilter === "all" ? "Tất cả" : courtFilter}) - Loại (${sportTypeFilter === "all" ? "Tất cả" : sportTypeFilter})`], // Dòng 4: Filter
               [], // Dòng 5: Trống
            ];
            
            const ws = XLSX.utils.aoa_to_sheet(wsData);

            // 2. Thêm dữ liệu bảng bắt đầu từ dòng 6 (A6)
            if (data.length > 0) {
               XLSX.utils.sheet_add_json(ws, data, { origin: "A6" });
            } else {
               XLSX.utils.sheet_add_aoa(ws, [["Không có dữ liệu"]], { origin: "A6" });
            }

            // 3. Tính toán độ rộng cột cho bảng dữ liệu
            const keys = Object.keys(data[0] || {});
            const colWidths = keys.map((key) => {
               const maxLen = Math.max(
                  key.length,
                  ...data.map((row) => (row[key] ? row[key].toString().length : 0))
               );
               return { wch: Math.max(maxLen + 2, 15) }; // Rộng tối thiểu 15, có padding
            });
            
            // Đảm bảo cột đầu tiên đủ rộng để hiển thị tiêu đề nếu bảng ít cột
            if (colWidths[0] && colWidths[0].wch < 35) {
               colWidths[0].wch = 35; 
            }

            ws["!cols"] = colWidths;

            // 4. Merge ô cho tiêu đề lớn (ví dụ: A1 -> E1)
            const numCols = Math.max(keys.length, 5); 
            ws["!merges"] = [
               { s: { r: 0, c: 0 }, e: { r: 0, c: numCols - 1 } },
            ];

            XLSX.utils.book_append_sheet(wb, ws, sheetName);
         };

         appendSheetWithLayout(overviewData, "Tổng Quan", "BÁO CÁO TỔNG QUAN DOANH THU");
         appendSheetWithLayout(transactionsData, "Chi Tiết Giao Dịch", "BẢNG CHI TIẾT GIAO DỊCH ĐẶT SÂN");
         appendSheetWithLayout(byDayData, "Theo Ngày", "THỐNG KÊ DOANH THU THEO NGÀY");
         appendSheetWithLayout(byCourtData, "Theo Sân", "THỐNG KÊ DOANH THU THEO TỪNG SÂN");

         // Tên file theo ngày
         const today = new Date();
         const dateString = `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, "0")}${today.getDate().toString().padStart(2, "0")}`;
         const fileName = `Bao_Cao_Doanh_Thu_${dateString}.xlsx`;

         // Xuất file
         XLSX.writeFile(wb, fileName);
         toast.success("Đã xuất báo cáo thành công!");
      } catch (error) {
         console.error("Lỗi khi xuất Excel:", error);
         toast.error("Có lỗi xảy ra khi xuất báo cáo.");
      } finally {
         setIsExporting(false);
      }
   };

   const handleReset = () => {
      setCourtFilter("all");
      setSportTypeFilter("all");
      setDateFrom("");
      setDateTo("");
      setTimeRange("30days");
      toast.success("Đã reset bộ lọc");
   };

   return (
      <div className="space-y-6">
         {/* Header */}
         <div className="flex items-center justify-between">
            <div>
               <h2 className="text-2xl font-bold text-gray-900">Báo cáo doanh thu</h2>
               <p className="text-sm text-gray-500 mt-1">
                  Phân tích doanh thu theo sân, loại sân và phương thức thanh toán
               </p>
            </div>
            <Button 
               onClick={handleExport} 
               disabled={isExporting}
               className="bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400"
            >
               {isExporting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
               ) : (
                  <Download className="w-4 h-4 mr-2" />
               )}
               {isExporting ? "Đang xuất..." : "Xuất báo cáo"}
            </Button>
         </div>

         {/* Bộ lọc */}
         <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
               <div className="flex flex-col lg:flex-row gap-3">
                  <Select value={sportTypeFilter} onValueChange={setSportTypeFilter}>
                     <SelectTrigger className="w-full lg:w-48">
                        <SelectValue placeholder="Loại sân" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="all">Tất cả loại sân</SelectItem>
                        <SelectItem value="pickleball">Pickleball</SelectItem>
                        <SelectItem value="badminton">Cầu lông</SelectItem>
                        <SelectItem value="basketball">Bóng rổ</SelectItem>
                     </SelectContent>
                  </Select>

                  <Select value={courtFilter} onValueChange={setCourtFilter}>
                     <SelectTrigger className="w-full lg:w-48">
                        <SelectValue placeholder="Chọn sân" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="all">Tất cả sân</SelectItem>
                        {mockCourts.map((court) => (
                           <SelectItem key={court.id} value={court.name}>
                              {court.name}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>

                  <Select value={timeRange} onValueChange={setTimeRange}>
                     <SelectTrigger className="w-full lg:w-48">
                        <SelectValue placeholder="Khoảng thời gian" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="30days">30 ngày gần nhất</SelectItem>
                        <SelectItem value="60days">60 ngày gần nhất</SelectItem>
                        <SelectItem value="90days">90 ngày gần nhất</SelectItem>
                     </SelectContent>
                  </Select>

                  <div className="flex items-center gap-2">
                     <Input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="w-full lg:w-40"
                     />
                     <span className="text-gray-400">→</span>
                     <Input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="w-full lg:w-40"
                     />
                  </div>

                  <div className="flex gap-2">
                     <Button className="bg-teal-600 hover:bg-teal-700">
                        <Filter className="w-4 h-4 mr-2" />
                        Áp dụng
                     </Button>
                     <Button variant="outline" onClick={handleReset}>
                        Reset
                     </Button>
                  </div>
               </div>
            </CardContent>
         </Card>

         {/* Card thống kê tổng quan */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-0 shadow-sm bg-gradient-to-br from-teal-50 to-teal-100">
               <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm text-teal-700 font-medium mb-1">Tổng doanh thu</p>
                        <p className="text-2xl font-bold text-teal-900">
                           {overviewStats.totalRevenue.toLocaleString()}đ
                        </p>
                        <p className="text-xs text-teal-600 mt-1">
                           {overviewStats.totalBookings} đơn đặt sân
                        </p>
                     </div>
                     <div className="w-12 h-12 rounded-full bg-teal-200 flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-teal-700" />
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
               <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm text-blue-700 font-medium mb-1">Tháng này</p>
                        <p className="text-2xl font-bold text-blue-900">
                           {overviewStats.thisMonthRevenue.toLocaleString()}đ
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                           {overviewStats.thisMonthBookings} đơn
                        </p>
                     </div>
                     <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center">
                        <Activity className="w-6 h-6 text-blue-700" />
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
               <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm text-green-700 font-medium mb-1">Tăng trưởng</p>
                        <p className="text-2xl font-bold text-green-900">
                           {overviewStats.growthRate > 0 ? "+" : ""}
                           {overviewStats.growthRate.toFixed(1)}%
                        </p>
                        <p className="text-xs text-green-600 mt-1">So với tháng trước</p>
                     </div>
                     <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${overviewStats.growthRate >= 0 ? "bg-green-200" : "bg-red-200"
                           }`}
                     >
                        {overviewStats.growthRate >= 0 ? (
                           <TrendingUp className="w-6 h-6 text-green-700" />
                        ) : (
                           <TrendingDown className="w-6 h-6 text-red-700" />
                        )}
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100">
               <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm text-purple-700 font-medium mb-1">
                           Giá trị trung bình
                        </p>
                        <p className="text-2xl font-bold text-purple-900">
                           {overviewStats.avgBookingValue.toLocaleString()}đ
                        </p>
                        <p className="text-xs text-purple-600 mt-1">Mỗi đơn đặt sân</p>
                     </div>
                     <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-purple-700" />
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Biểu đồ đường - Doanh thu theo ngày */}
         <Card className="border-0 shadow-sm">
            <CardHeader>
               <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-teal-600" />
                  Biểu đồ doanh thu theo ngày
               </CardTitle>
            </CardHeader>
            <CardContent>
               <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={revenueByDayData}>
                     <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                           <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                     <XAxis dataKey="date" style={{ fontSize: "12px" }} stroke="#6b7280" />
                     <YAxis style={{ fontSize: "12px" }} stroke="#6b7280" />
                     <Tooltip
                        contentStyle={{
                           backgroundColor: "#fff",
                           border: "1px solid #e5e7eb",
                           borderRadius: "8px",
                        }}
                        formatter={(value: any, name: string) => [
                           name === "doanhthu"
                              ? `${(value * 1000).toLocaleString()}đ`
                              : value,
                           name === "doanhthu" ? "Doanh thu" : "Giao dịch",
                        ]}
                     />
                     <Legend />
                     <Area
                        type="monotone"
                        dataKey="doanhthu"
                        name="Doanh thu (nghìn đ)"
                        stroke="#0d9488"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                     />
                  </AreaChart>
               </ResponsiveContainer>
            </CardContent>
         </Card>

         {/* Biểu đồ cột và tròn */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Biểu đồ cột - Doanh thu theo sân */}
            <Card className="border-0 shadow-sm">
               <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                     <MapPin className="w-5 h-5 text-blue-600" />
                     Doanh thu theo từng sân
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                     <BarChart data={revenueByCourtData.slice(0, 10)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                           dataKey="name"
                           style={{ fontSize: "11px" }}
                           stroke="#6b7280"
                           angle={-45}
                           textAnchor="end"
                           height={100}
                        />
                        <YAxis style={{ fontSize: "12px" }} stroke="#6b7280" />
                        <Tooltip
                           contentStyle={{
                              backgroundColor: "#fff",
                              border: "1px solid #e5e7eb",
                              borderRadius: "8px",
                           }}
                           formatter={(value: any) => [
                              `${(value * 1000).toLocaleString()}đ`,
                              "Doanh thu",
                           ]}
                        />
                        <Bar
                           dataKey="doanhthu"
                           name="Doanh thu (nghìn đ)"
                           fill="#3b82f6"
                           radius={[8, 8, 0, 0]}
                        />
                     </BarChart>
                  </ResponsiveContainer>
               </CardContent>
            </Card>

            {/* Biểu đồ tròn - Doanh thu theo loại sân */}
            <Card className="border-0 shadow-sm">
               <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                     <Trophy className="w-5 h-5 text-teal-600" />
                     Doanh thu theo loại sân
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                     <RechartsPieChart>
                        <Pie
                           data={revenueBySportTypeData}
                           cx="50%"
                           cy="50%"
                           labelLine={false}
                           label={({ name, percent }) =>
                              `${name}: ${(percent * 100).toFixed(0)}%`
                           }
                           outerRadius={100}
                           fill="#8884d8"
                           dataKey="value"
                        >
                           {revenueBySportTypeData.map((entry, index) => (
                              <Cell
                                 key={`cell-${index}`}
                                 fill={SPORT_COLORS[index % SPORT_COLORS.length]}
                              />
                           ))}
                        </Pie>
                        <Tooltip
                           formatter={(value: any) => `${value.toLocaleString()}đ`}
                        />
                     </RechartsPieChart>
                  </ResponsiveContainer>
               </CardContent>
            </Card>
         </div>

         {/* Top sân theo doanh thu và phương thức thanh toán */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top 5 sân */}
            <Card className="border-0 shadow-sm">
               <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                     <Trophy className="w-5 h-5 text-amber-600" />
                     Top 5 sân có doanh thu cao nhất
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="space-y-4">
                     {revenueByCourtData.slice(0, 5).map((court, index) => (
                        <div
                           key={court.name}
                           className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                           <div className="flex items-center gap-3">
                              <div
                                 className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${index === 0
                                    ? "bg-amber-500"
                                    : index === 1
                                       ? "bg-gray-400"
                                       : index === 2
                                          ? "bg-orange-600"
                                          : "bg-teal-500"
                                    }`}
                              >
                                 {index + 1}
                              </div>
                              <div>
                                 <p className="font-semibold text-gray-900">{court.name}</p>
                                 <p className="text-sm text-gray-500">
                                    {(
                                       (court.amount /
                                          revenueByCourtData.reduce((sum, c) => sum + c.amount, 0)) *
                                       100
                                    ).toFixed(1)}
                                    % tổng doanh thu
                                 </p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="font-bold text-teal-600">
                                 {court.amount.toLocaleString()}đ
                              </p>
                              <p className="text-sm text-gray-500">
                                 {
                                    filteredBookings.filter((b) => b.courtName === court.name)
                                       .length
                                 }{" "}
                                 đơn
                              </p>
                           </div>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>

            {/* Phương thức thanh toán */}
            <Card className="border-0 shadow-sm">
               <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                     <PieChart className="w-5 h-5 text-purple-600" />
                     Doanh thu theo phương thức thanh toán
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="space-y-4">
                     {revenueByMethodData
                        .sort((a, b) => b.amount - a.amount)
                        .map((method, index) => (
                           <div
                              key={method.name}
                              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                           >
                              <div className="flex items-center gap-3">
                                 <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                                    style={{
                                       backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                                    }}
                                 >
                                    {index + 1}
                                 </div>
                                 <div>
                                    <p className="font-semibold text-gray-900">{method.name}</p>
                                    <p className="text-sm text-gray-500">
                                       {(
                                          (method.amount /
                                             revenueByMethodData.reduce(
                                                (sum, m) => sum + m.amount,
                                                0
                                             )) *
                                          100
                                       ).toFixed(1)}
                                       % tổng doanh thu
                                    </p>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <p className="font-bold text-teal-600">
                                    {method.amount.toLocaleString()}đ
                                 </p>
                                 <p className="text-sm text-gray-500">
                                    {
                                       filteredBookings.filter((b) =>
                                          PAYMENT_METHOD_LABELS[b.paymentMethod || "vnpay"] ===
                                          method.name
                                       ).length
                                    }{" "}
                                    đơn
                                 </p>
                              </div>
                           </div>
                        ))}
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}
