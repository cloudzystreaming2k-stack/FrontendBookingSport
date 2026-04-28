import { useState, useEffect, useCallback } from "react";
import {
   Search,
   Eye,
   Trash2,
   Clock,
   Mail,
   CheckCircle,
   Archive,
   MessageSquare,
   Calendar,
   Send,
   Loader2,
   X,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { toast } from "sonner";
import api from "../../lib/api";

interface Contact {
   _id: string;
   name: string;
   email: string;
   subject: string;
   message: string;
   status: "new" | "read" | "replied";
   replyMessage?: string;
   createdAt: string;
}

interface Stats {
   total: number;
   new: number;
   read: number;
   replied: number;
}

const STATUS_LABELS: Record<string, string> = {
   new: "Mới",
   read: "Đã đọc",
   replied: "Đã phản hồi",
};

const STATUS_COLORS: Record<string, string> = {
   new: "bg-orange-100 text-orange-800 hover:bg-orange-100",
   read: "bg-blue-100 text-blue-800 hover:bg-blue-100",
   replied: "bg-green-100 text-green-800 hover:bg-green-100",
};

export function AdminContacts() {
   const [contacts, setContacts] = useState<Contact[]>([]);
   const [stats, setStats] = useState<Stats>({ total: 0, new: 0, read: 0, replied: 0 });
   const [isLoading, setIsLoading] = useState(true);
   const [searchQuery, setSearchQuery] = useState("");
   const [statusFilter, setStatusFilter] = useState("all");
   const [page, setPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);

   // Modal states
   const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
   const [detailModalOpen, setDetailModalOpen] = useState(false);
   const [replyText, setReplyText] = useState("");
   const [isSendingReply, setIsSendingReply] = useState(false);

   const fetchContacts = useCallback(async () => {
      setIsLoading(true);
      try {
         const params: Record<string, any> = { page, limit: 10 };
         if (statusFilter !== "all") params.status = statusFilter;
         if (searchQuery.trim()) params.search = searchQuery.trim();

         const res = await api.get("/admin/contacts", { params });
         setContacts(res.data.contacts);
         setStats(res.data.stats);
         setTotalPages(res.data.totalPages);
      } catch (error) {
         toast.error("Không thể tải danh sách liên hệ");
      } finally {
         setIsLoading(false);
      }
   }, [page, statusFilter, searchQuery]);

   useEffect(() => {
      const delayDebounce = setTimeout(() => {
         setPage(1);
         fetchContacts();
      }, 400);
      return () => clearTimeout(delayDebounce);
   }, [searchQuery, statusFilter]);

   useEffect(() => {
      fetchContacts();
   }, [page]);

   // Xem chi tiết và tự động cập nhật trạng thái -> "read"
   const handleView = async (contact: Contact) => {
      setSelectedContact(contact);
      setReplyText("");
      setDetailModalOpen(true);

      if (contact.status === "new") {
         try {
            await api.put(`/admin/contacts/${contact._id}/status`, { status: "read" });
            setContacts((prev) =>
               prev.map((c) => (c._id === contact._id ? { ...c, status: "read" } : c))
            );
            setStats((prev) => ({ ...prev, new: prev.new - 1, read: prev.read + 1 }));
         } catch {
            // Silent fail - not critical
         }
      }
   };

   // Gửi email phản hồi
   const handleSendReply = async () => {
      if (!selectedContact || !replyText.trim()) {
         toast.error("Vui lòng nhập nội dung phản hồi");
         return;
      }

      setIsSendingReply(true);
      try {
         await api.post(`/admin/contacts/${selectedContact._id}/reply`, {
            replyMessage: replyText.trim(),
         });

         toast.success(`Đã gửi email phản hồi đến ${selectedContact.email} thành công!`);

         // Cập nhật state local
         setContacts((prev) =>
            prev.map((c) =>
               c._id === selectedContact._id
                  ? { ...c, status: "replied", replyMessage: replyText.trim() }
                  : c
            )
         );
         setStats((prev) => ({
            ...prev,
            read: selectedContact.status === "read" ? prev.read - 1 : prev.read,
            replied: prev.replied + 1,
         }));
         setSelectedContact((prev) =>
            prev ? { ...prev, status: "replied", replyMessage: replyText.trim() } : null
         );
         setReplyText("");
      } catch (error: any) {
         toast.error(error?.response?.data?.message || "Gửi email thất bại. Kiểm tra lại cấu hình .env");
      } finally {
         setIsSendingReply(false);
      }
   };

   // Xóa liên hệ
   const handleDelete = async (id: string) => {
      if (!confirm("Bạn có chắc muốn xóa liên hệ này?")) return;
      try {
         await api.delete(`/admin/contacts/${id}`);
         setContacts((prev) => prev.filter((c) => c._id !== id));
         toast.success("Đã xóa liên hệ");
         fetchContacts(); // Refresh để cập nhật stats
      } catch {
         toast.error("Không thể xóa liên hệ");
      }
   };

   const closeModal = () => {
      setDetailModalOpen(false);
      setSelectedContact(null);
      setReplyText("");
   };

   return (
      <div className="space-y-6">
         {/* Header */}
         <div>
            <h2 className="text-2xl font-bold text-gray-900">Quản lý liên hệ</h2>
            <p className="text-sm text-gray-500 mt-1">Quản lý và phản hồi tin nhắn từ khách hàng</p>
         </div>

         {/* Stats Cards */}
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-amber-50">
               <CardContent className="p-5 flex items-center justify-between">
                  <div>
                     <p className="text-sm text-orange-700 font-medium mb-1">Tin mới</p>
                     <p className="text-3xl font-bold text-orange-900">{stats.new}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-orange-200 flex items-center justify-center">
                     <Clock className="w-6 h-6 text-orange-700" />
                  </div>
               </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
               <CardContent className="p-5 flex items-center justify-between">
                  <div>
                     <p className="text-sm text-blue-700 font-medium mb-1">Đã đọc</p>
                     <p className="text-3xl font-bold text-blue-900">{stats.read}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center">
                     <Mail className="w-6 h-6 text-blue-700" />
                  </div>
               </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
               <CardContent className="p-5 flex items-center justify-between">
                  <div>
                     <p className="text-sm text-green-700 font-medium mb-1">Đã phản hồi</p>
                     <p className="text-3xl font-bold text-green-900">{stats.replied}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center">
                     <CheckCircle className="w-6 h-6 text-green-700" />
                  </div>
               </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100">
               <CardContent className="p-5 flex items-center justify-between">
                  <div>
                     <p className="text-sm text-purple-700 font-medium mb-1">Tổng cộng</p>
                     <p className="text-3xl font-bold text-purple-900">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center">
                     <MessageSquare className="w-6 h-6 text-purple-700" />
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Search & Filters */}
         <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
               <div className="flex flex-col lg:flex-row gap-3">
                  <div className="flex-1 relative">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                     <Input
                        className="pl-9"
                        placeholder="Tìm kiếm theo tên, email, chủ đề..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                     />
                  </div>
                  <Select
                     value={statusFilter}
                     onValueChange={(val) => { setStatusFilter(val); setPage(1); }}
                  >
                     <SelectTrigger className="w-full lg:w-48">
                        <SelectValue placeholder="Tất cả trạng thái" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="all">Tất cả trạng thái</SelectItem>
                        <SelectItem value="new">Tin mới</SelectItem>
                        <SelectItem value="read">Đã đọc</SelectItem>
                        <SelectItem value="replied">Đã phản hồi</SelectItem>
                     </SelectContent>
                  </Select>
               </div>
            </CardContent>
         </Card>

         {/* Table */}
         <Card className="border-0 shadow-sm">
            <CardContent className="p-0">
               {isLoading ? (
                  <div className="flex justify-center items-center py-20">
                     <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  </div>
               ) : (
                  <div className="overflow-x-auto">
                     <table className="w-full">
                        <thead>
                           <tr className="border-b bg-gray-50">
                              {["Tên", "Email", "Chủ đề", "Trạng thái", "Ngày gửi", "Thao tác"].map(
                                 (header) => (
                                    <th
                                       key={header}
                                       className="text-left py-3 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider"
                                    >
                                       {header}
                                    </th>
                                 )
                              )}
                           </tr>
                        </thead>
                        <tbody>
                           {contacts.length === 0 ? (
                              <tr>
                                 <td colSpan={6} className="py-12 text-center text-gray-400">
                                    Không tìm thấy liên hệ phù hợp
                                 </td>
                              </tr>
                           ) : (
                              contacts.map((contact) => (
                                 <tr
                                    key={contact._id}
                                    className={`border-b hover:bg-gray-50 transition-colors ${
                                       contact.status === "new" ? "font-semibold bg-orange-50/30" : ""
                                    }`}
                                 >
                                    <td className="py-4 px-4">
                                       <p className="text-sm text-gray-900">{contact.name}</p>
                                    </td>
                                    <td className="py-4 px-4">
                                       <p className="text-sm text-gray-600">{contact.email}</p>
                                    </td>
                                    <td className="py-4 px-4">
                                       <p className="text-sm text-gray-900 max-w-[200px] truncate">{contact.subject}</p>
                                    </td>
                                    <td className="py-4 px-4">
                                       <Badge className={STATUS_COLORS[contact.status]}>
                                          {STATUS_LABELS[contact.status]}
                                       </Badge>
                                    </td>
                                    <td className="py-4 px-4">
                                       <div className="flex items-center gap-1 text-sm text-gray-500">
                                          <Calendar className="w-3 h-3" />
                                          {new Date(contact.createdAt).toLocaleDateString("vi-VN")}
                                       </div>
                                    </td>
                                    <td className="py-4 px-4">
                                       <div className="flex items-center gap-2">
                                          <Button
                                             variant="ghost"
                                             size="sm"
                                             onClick={() => handleView(contact)}
                                             className="hover:bg-blue-50"
                                          >
                                             <Eye className="w-4 h-4 text-blue-600" />
                                             Xem
                                          </Button>
                                          <Button
                                             variant="ghost"
                                             size="sm"
                                             onClick={() => handleDelete(contact._id)}
                                             className="hover:bg-red-50"
                                          >
                                             <Trash2 className="w-4 h-4 text-red-600" />
                                             Xóa
                                          </Button>
                                       </div>
                                    </td>
                                 </tr>
                              ))
                           )}
                        </tbody>
                     </table>
                  </div>
               )}

               {/* Pagination */}
               {totalPages > 1 && (
                  <div className="flex items-center justify-between px-4 py-3 border-t">
                     <p className="text-sm text-gray-500">Trang {page} / {totalPages}</p>
                     <div className="flex gap-2">
                        <Button
                           variant="outline"
                           size="sm"
                           onClick={() => setPage((p) => Math.max(1, p - 1))}
                           disabled={page === 1}
                        >
                           Trước
                        </Button>
                        <Button
                           variant="outline"
                           size="sm"
                           onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                           disabled={page === totalPages}
                        >
                           Sau
                        </Button>
                     </div>
                  </div>
               )}
            </CardContent>
         </Card>

         {/* Detail & Reply Modal */}
         {detailModalOpen && selectedContact && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
               <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto shadow-2xl">
                  <CardContent className="p-6">
                     {/* Modal Header */}
                     <div className="flex items-start justify-between mb-6">
                        <div>
                           <h3 className="text-xl font-bold text-gray-900 mb-1">Chi tiết liên hệ</h3>
                           <Badge className={STATUS_COLORS[selectedContact.status]}>
                              {STATUS_LABELS[selectedContact.status]}
                           </Badge>
                        </div>
                        <Button variant="ghost" size="sm" onClick={closeModal} className="hover:bg-gray-100">
                           <X className="w-5 h-5" />
                        </Button>
                     </div>

                     {/* Contact Info */}
                     <div className="space-y-4 mb-6">
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Họ tên</p>
                              <p className="text-sm font-semibold text-gray-900">{selectedContact.name}</p>
                           </div>
                           <div>
                              <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Email</p>
                              <p className="text-sm text-gray-900">{selectedContact.email}</p>
                           </div>
                        </div>
                        <div>
                           <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Chủ đề</p>
                           <p className="text-sm font-medium text-gray-900">{selectedContact.subject}</p>
                        </div>
                        <div>
                           <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Nội dung tin nhắn</p>
                           <div className="p-4 bg-gray-50 rounded-lg border">
                              <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedContact.message}</p>
                           </div>
                        </div>
                        <div>
                           <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Ngày gửi</p>
                           <p className="text-sm text-gray-900">
                              {new Date(selectedContact.createdAt).toLocaleString("vi-VN")}
                           </p>
                        </div>

                        {/* Nội dung phản hồi cũ (nếu đã reply) */}
                        {selectedContact.replyMessage && (
                           <div>
                              <p className="text-xs text-green-600 mb-1 uppercase tracking-wide font-semibold">
                                 Nội dung đã phản hồi
                              </p>
                              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                 <p className="text-sm text-green-800 whitespace-pre-wrap">
                                    {selectedContact.replyMessage}
                                 </p>
                              </div>
                           </div>
                        )}
                     </div>

                     {/* Reply Section */}
                     <div className="border-t pt-6">
                        <div className="flex items-center gap-2 mb-3">
                           <Send className="w-4 h-4 text-blue-600" />
                           <h4 className="font-semibold text-gray-900">
                              {selectedContact.status === "replied" ? "Gửi phản hồi thêm" : "Soạn phản hồi Email"}
                           </h4>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">
                           Email sẽ được gửi tới: <span className="font-medium text-blue-600">{selectedContact.email}</span>
                        </p>
                        <Textarea
                           placeholder="Nhập nội dung phản hồi cho khách hàng..."
                           rows={5}
                           value={replyText}
                           onChange={(e) => setReplyText(e.target.value)}
                           disabled={isSendingReply}
                           className="mb-4"
                        />
                        <div className="flex items-center justify-end gap-3">
                           <Button variant="outline" onClick={closeModal}>
                              Đóng
                           </Button>
                           <Button
                              onClick={handleSendReply}
                              disabled={isSendingReply || !replyText.trim()}
                              className="bg-blue-600 hover:bg-blue-700"
                           >
                              {isSendingReply ? (
                                 <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Đang gửi...
                                 </>
                              ) : (
                                 <>
                                    <Send className="w-4 h-4 mr-2" />
                                    Gửi email phản hồi
                                 </>
                              )}
                           </Button>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </div>
         )}
      </div>
   );
}
