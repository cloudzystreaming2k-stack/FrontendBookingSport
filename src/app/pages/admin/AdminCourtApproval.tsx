import { useState } from "react";
import { CheckCircle, XCircle, Eye, Clock, Filter, Search } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { type Court } from "../../data/mockData";
import { useCourts } from "../../contexts/CourtsContext";
import { toast } from "sonner";

export function AdminCourtApproval() {
   const { courts, approveCourt, rejectCourt } = useCourts();

   const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
   const [isDetailOpen, setIsDetailOpen] = useState(false);
   const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
   const [rejectionReason, setRejectionReason] = useState("");
   const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
   const [searchQuery, setSearchQuery] = useState("");

   const filteredCourts = courts.filter((court) => {
      const matchesStatus =
         statusFilter === "all" || court.approvalStatus === statusFilter;
      const matchesSearch =
         searchQuery === "" ||
         court.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         court.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         court.owner?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
   });

   const handleViewDetail = (court: Court) => {
      setSelectedCourt(court);
      setIsDetailOpen(true);
   };

   const handleApprove = (court: Court) => {
      approveCourt(court.id);
      toast.success("Phê duyệt sân thành công!", {
         description: `${court.name} đã được phê duyệt`,
      });
      setIsDetailOpen(false);
   };

   const handleReject = (court: Court) => {
      setSelectedCourt(court);
      setIsRejectDialogOpen(true);
      setIsDetailOpen(false);
   };

   const confirmReject = () => {
      if (!selectedCourt) return;

      if (!rejectionReason.trim()) {
         toast.error("Vui lòng nhập lý do từ chối");
         return;
      }

      rejectCourt(selectedCourt.id, rejectionReason);
      toast.success("Từ chối sân thành công!", {
         description: `${selectedCourt.name} đã bị từ chối`,
      });
      setIsRejectDialogOpen(false);
      setRejectionReason("");
   };

   const getTypeLabel = (type: string) => {
      const typeMap: Record<string, string> = {
         pickleball: "Pickleball",
         badminton: "Cầu Lông",
         basketball: "Bóng Rổ",
         tennis: "Tennis",
         volleyball: "Bóng chuyền",
      };
      return typeMap[type] || type;
   };

   const getTypeIcon = (type: string) => {
      const iconMap: Record<string, string> = {
         pickleball: "🏓",
         badminton: "🏸",
         basketball: "🏀",
         tennis: "🎾",
         volleyball: "🏐",
      };
      return iconMap[type] || "⚽";
   };

   const getStatusBadge = (status?: "pending" | "approved" | "rejected") => {
      switch (status) {
         case "pending":
            return (
               <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                  <Clock className="w-3 h-3 mr-1" />
                  Chờ duyệt
               </Badge>
            );
         case "approved":
            return (
               <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Đã duyệt
               </Badge>
            );
         case "rejected":
            return (
               <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                  <XCircle className="w-3 h-3 mr-1" />
                  Từ chối
               </Badge>
            );
         default:
            return null;
      }
   };

   const pendingCount = courts.filter((c) => c.approvalStatus === "pending").length;
   const approvedCount = courts.filter((c) => c.approvalStatus === "approved").length;
   const rejectedCount = courts.filter((c) => c.approvalStatus === "rejected").length;

   return (
      <div className="space-y-6">
         {/* Header */}
         <div>
            <h2 className="text-2xl font-bold mb-2">Duyệt Sân</h2>
            <p className="text-gray-600">
               Xem xét và phê duyệt các sân thể thao mới từ chủ sân
            </p>
         </div>

         {/* Stats Cards */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-amber-500">
               <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm text-gray-600">Chờ duyệt</p>
                        <p className="text-3xl font-bold text-amber-600">{pendingCount}</p>
                     </div>
                     <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                        <Clock className="w-6 h-6 text-amber-600" />
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
               <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm text-gray-600">Đã duyệt</p>
                        <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
                     </div>
                     <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
               <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm text-gray-600">Từ chối</p>
                        <p className="text-3xl font-bold text-red-600">{rejectedCount}</p>
                     </div>
                     <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <XCircle className="w-6 h-6 text-red-600" />
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Filters */}
         <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[250px]">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
               <Input
                  placeholder="Tìm kiếm theo tên sân, mã, chủ sân..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
               />
            </div>

            <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
               <SelectTrigger className="w-48">
                  <SelectValue placeholder="Lọc theo trạng thái" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="pending">Chờ duyệt</SelectItem>
                  <SelectItem value="approved">Đã duyệt</SelectItem>
                  <SelectItem value="rejected">Từ chối</SelectItem>
               </SelectContent>
            </Select>

            <Button
               variant="outline"
               onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("pending");
               }}
            >
               <Filter className="w-4 h-4 mr-2" />
               Đặt lại
            </Button>
         </div>

         {/* Courts Table */}
         <Card>
            <CardContent className="p-0">
               <div className="overflow-x-auto">
                  <table className="w-full">
                     <thead>
                        <tr className="border-b bg-gray-50">
                           <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                              MÃ SÂN
                           </th>
                           <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                              TÊN SÂN
                           </th>
                           <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                              LOẠI
                           </th>
                           <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                              CHủ SÂN
                           </th>
                           <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                              NGÀY GỬI
                           </th>
                           <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                              TRẠNG THÁI
                           </th>
                           <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                              THAO TÁC
                           </th>
                        </tr>
                     </thead>
                     <tbody>
                        {filteredCourts.length === 0 ? (
                           <tr>
                              <td colSpan={7} className="py-8 text-center text-gray-500">
                                 Không tìm thấy sân nào
                              </td>
                           </tr>
                        ) : (
                           filteredCourts.map((court) => (
                              <tr
                                 key={court.id}
                                 className="border-b hover:bg-gray-50 transition-colors"
                              >
                                 <td className="py-3 px-4">
                                    <div className="font-semibold">{court.code || court.id}</div>
                                 </td>
                                 <td className="py-3 px-4">
                                    <div className="font-semibold">{court.name}</div>
                                    <div className="text-sm text-gray-500">{court.address}</div>
                                 </td>
                                 <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                       <span className="text-xl">{getTypeIcon(court.type)}</span>
                                       <span>{getTypeLabel(court.type)}</span>
                                    </div>
                                 </td>
                                 <td className="py-3 px-4">
                                    <div className="font-medium">{court.owner || "N/A"}</div>
                                 </td>
                                 <td className="py-3 px-4">
                                    <div className="text-sm">
                                       {court.submittedAt
                                          ? new Date(court.submittedAt).toLocaleDateString("vi-VN")
                                          : "N/A"}
                                    </div>
                                 </td>
                                 <td className="py-3 px-4">{getStatusBadge(court.approvalStatus)}</td>
                                 <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                       <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleViewDetail(court)}
                                          className="hover:bg-blue-50 text-blue-600"
                                       >
                                          <Eye className="w-4 h-4" />
                                       </Button>
                                       {court.approvalStatus === "pending" && (
                                          <>
                                             <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleApprove(court)}
                                                className="hover:bg-green-50 text-green-600"
                                             >
                                                <CheckCircle className="w-4 h-4" />
                                             </Button>
                                             <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleReject(court)}
                                                className="hover:bg-red-50 text-red-600"
                                             >
                                                <XCircle className="w-4 h-4" />
                                             </Button>
                                          </>
                                       )}
                                    </div>
                                 </td>
                              </tr>
                           ))
                        )}
                     </tbody>
                  </table>
               </div>
            </CardContent>
         </Card>

         {/* Detail Dialog */}
         <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
               <DialogHeader>
                  <DialogTitle>Chi Tiết Sân</DialogTitle>
                  <DialogDescription>
                     Xem xét thông tin sân trước khi phê duyệt
                  </DialogDescription>
               </DialogHeader>
               {selectedCourt && (
                  <div className="space-y-4">
                     {/* Images */}
                     {selectedCourt.images && selectedCourt.images.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                           {selectedCourt.images.map((img, idx) => (
                              <img
                                 key={idx}
                                 src={img}
                                 alt={`${selectedCourt.name} ${idx + 1}`}
                                 className="w-full h-32 object-cover rounded-lg"
                              />
                           ))}
                        </div>
                     )}

                     {/* Info Grid */}
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <Label className="text-gray-600">Mã sân</Label>
                           <p className="font-semibold">{selectedCourt.code}</p>
                        </div>
                        <div>
                           <Label className="text-gray-600">Loại sân</Label>
                           <p className="font-semibold">
                              {getTypeIcon(selectedCourt.type)} {getTypeLabel(selectedCourt.type)}
                           </p>
                        </div>
                        <div>
                           <Label className="text-gray-600">Chủ sân</Label>
                           <p className="font-semibold">{selectedCourt.owner}</p>
                        </div>
                        <div>
                           <Label className="text-gray-600">Sức chứa</Label>
                           <p className="font-semibold">{selectedCourt.capacity} người</p>
                        </div>
                        <div className="col-span-2">
                           <Label className="text-gray-600">Địa chỉ</Label>
                           <p className="font-semibold">{selectedCourt.address}</p>
                        </div>
                        <div className="col-span-2">
                           <Label className="text-gray-600">Mô tả</Label>
                           <p className="text-gray-700">{selectedCourt.description}</p>
                        </div>
                     </div>

                     {/* Pricing */}
                     <div>
                        <Label className="text-gray-600 mb-2 block">Bảng giá</Label>
                        <div className="grid grid-cols-3 gap-3">
                           <div className="p-3 bg-gray-50 rounded-lg">
                              <p className="text-xs text-gray-600">Sáng (6h-12h)</p>
                              <p className="text-lg font-bold text-teal-600">
                                 {selectedCourt.pricing.morning.toLocaleString()}đ
                              </p>
                           </div>
                           <div className="p-3 bg-gray-50 rounded-lg">
                              <p className="text-xs text-gray-600">Chiều (12h-18h)</p>
                              <p className="text-lg font-bold text-blue-600">
                                 {selectedCourt.pricing.afternoon.toLocaleString()}đ
                              </p>
                           </div>
                           <div className="p-3 bg-gray-50 rounded-lg">
                              <p className="text-xs text-gray-600">Tối (18h-22h)</p>
                              <p className="text-lg font-bold text-purple-600">
                                 {selectedCourt.pricing.evening.toLocaleString()}đ
                              </p>
                           </div>
                        </div>
                     </div>

                     {/* Facilities */}
                     <div>
                        <Label className="text-gray-600 mb-2 block">Tiện nghi</Label>
                        <div className="flex flex-wrap gap-2">
                           {selectedCourt.facilities.map((facility, idx) => (
                              <Badge key={idx} variant="outline">
                                 {facility}
                              </Badge>
                           ))}
                        </div>
                     </div>

                     {/* Actions */}
                     {selectedCourt.approvalStatus === "pending" && (
                        <div className="flex gap-3 pt-4">
                           <Button
                              onClick={() => handleApprove(selectedCourt)}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                           >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Phê duyệt
                           </Button>
                           <Button
                              onClick={() => handleReject(selectedCourt)}
                              variant="outline"
                              className="flex-1 border-red-600 text-red-600 hover:bg-red-50"
                           >
                              <XCircle className="w-4 h-4 mr-2" />
                              Từ chối
                           </Button>
                        </div>
                     )}

                     {selectedCourt.approvalStatus === "rejected" &&
                        selectedCourt.rejectionReason && (
                           <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                              <Label className="text-red-800 mb-1 block">Lý do từ chối</Label>
                              <p className="text-red-700">{selectedCourt.rejectionReason}</p>
                           </div>
                        )}
                  </div>
               )}
            </DialogContent>
         </Dialog>

         {/* Reject Dialog */}
         <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Từ Chối Sân</DialogTitle>
                  <DialogDescription>
                     Vui lòng nhập lý do từ chối để gửi thông báo cho chủ sân
                  </DialogDescription>
               </DialogHeader>
               <div className="space-y-4">
                  <div>
                     <Label htmlFor="reason">Lý do từ chối *</Label>
                     <Textarea
                        id="reason"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="VD: Hình ảnh không rõ ràng, thiếu thông tin bảng giá..."
                        rows={4}
                        className="mt-2"
                     />
                  </div>
                  <div className="flex gap-3">
                     <Button
                        variant="outline"
                        onClick={() => {
                           setIsRejectDialogOpen(false);
                           setRejectionReason("");
                        }}
                        className="flex-1"
                     >
                        Hủy
                     </Button>
                     <Button
                        onClick={confirmReject}
                        className="flex-1 bg-red-600 hover:bg-red-700"
                     >
                        Xác nhận từ chối
                     </Button>
                  </div>
               </div>
            </DialogContent>
         </Dialog>
      </div>
   );
}