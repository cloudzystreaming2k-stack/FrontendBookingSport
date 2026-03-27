import { useState, useEffect } from "react";
import api from "../../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Check,
  X,
  Eye,
  Search,
  UserCheck,
  Clock,
  UserX,
  Building2,
  Mail,
  Phone,
  Calendar,
  Landmark,
  Wallet,
  User,
  MapPin,
  FileText,
  Briefcase,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { initializeMockOwnerRegistrations } from "../../data/mockOwnerRegistrations.ts";

interface OwnerRegistration {
  id: string;
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  ownerName: string;
  identityNumber: string;
  businessName: string;
  taxCode: string;
  businessAddress: string;
  businessPhone: string;
  bankName: string;
  accountNumber: string;
  accountOwner: string;
  registeredAt: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  approvedAt?: string;
  approvedBy?: string;
}

export function AdminOwners() {
  const [owners, setOwners] = useState<OwnerRegistration[]>([]);
  const [filteredOwners, setFilteredOwners] = useState<OwnerRegistration[]>([]);
  const [selectedOwner, setSelectedOwner] = useState<OwnerRegistration | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected">("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  const loadOwners = async () => {
    try {
      const { data } = await api.get("/admin/owners");
      const mappedOwners = data.owners.map((user: any) => ({
        id: user._id,
        lastName: user.lastName || "",
        firstName: user.firstName || "",
        email: user.email,
        phone: user.phone || "",
        gender: user.gender || "",
        dateOfBirth: user.dateOfBirth || "",
        status: user.status,
        ownerName: user.ownerInfo?.ownerName || "",
        identityNumber: user.ownerInfo?.identityNumber || "",
        businessName: user.ownerInfo?.businessName || "",
        taxCode: user.ownerInfo?.taxCode || "",
        businessAddress: user.ownerInfo?.businessAddress || "",
        businessPhone: user.ownerInfo?.businessPhone || "",
        bankName: user.ownerInfo?.bankName || "",
        accountNumber: user.ownerInfo?.accountNumber || "",
        accountOwner: user.ownerInfo?.accountOwner || "",
        registeredAt: user.createdAt,
        rejectionReason: user.ownerInfo?.rejectionReason,
        approvedAt: user.ownerInfo?.approvedAt,
        approvedBy: user.ownerInfo?.approvedBy,
      }));
      setOwners(mappedOwners);
    } catch (e) {
      toast.error("Không thể tải danh sách tài khoản Chủ Sân");
    }
  };

  useEffect(() => {
    loadOwners();
  }, []);

  // Filter and sort owners
  useEffect(() => {
    let filtered = owners.filter((owner) => owner.status === activeTab);

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((owner) => {
        const searchLower = searchQuery.toLowerCase();
        return (
          owner.firstName.toLowerCase().includes(searchLower) ||
          owner.lastName.toLowerCase().includes(searchLower) ||
          owner.email.toLowerCase().includes(searchLower) ||
          owner.businessName.toLowerCase().includes(searchLower) ||
          owner.phone.includes(searchQuery)
        );
      });
    }

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.registeredAt).getTime();
      const dateB = new Date(b.registeredAt).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredOwners(filtered);
  }, [owners, activeTab, searchQuery, sortBy]);

  const handleApprove = async (owner: OwnerRegistration) => {
    try {
      await api.put(`/admin/owners/${owner.id}/status`, { status: "approved" });
      toast.success("Đã duyệt đăng ký chủ sân", {
        description: `${owner.firstName} ${owner.lastName} - ${owner.businessName}`,
      });
      loadOwners();
      setIsDetailOpen(false);
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Có lỗi xảy ra khi duyệt");
    }
  };

  const handleReject = async (owner: OwnerRegistration, reason?: string) => {
    try {
      await api.put(`/admin/owners/${owner.id}/status`, { 
         status: "rejected", 
         rejectionReason: reason || "Không đủ điều kiện" 
      });
      toast.error("Đã từ chối đăng ký", {
        description: `${owner.firstName} ${owner.lastName} - ${owner.businessName}`,
      });
      loadOwners();
      setIsDetailOpen(false);
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Có lỗi xảy ra khi cập nhật");
    }
  };

  const handleViewDetail = (owner: OwnerRegistration) => {
    setSelectedOwner(owner);
    setIsDetailOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Chờ duyệt
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <UserCheck className="w-3 h-3 mr-1" />
            Đã duyệt
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            <UserX className="w-3 h-3 mr-1" />
            Từ chối
          </Badge>
        );
      default:
        return null;
    }
  };

  const getGenderText = (gender: string) => {
    switch (gender) {
      case "male":
        return "Nam";
      case "female":
        return "Nữ";
      case "other":
        return "Khác";
      default:
        return gender;
    }
  };

  const stats = {
    pending: owners.filter((o) => o.status === "pending").length,
    approved: owners.filter((o) => o.status === "approved").length,
    rejected: owners.filter((o) => o.status === "rejected").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Quản lý Chủ Sân</h1>
        <p className="text-gray-600 mt-1">
          Duyệt đăng ký và quản lý thông tin chủ sân
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={activeTab === "pending" ? "ring-2 ring-yellow-500" : ""}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Chờ duyệt</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={activeTab === "approved" ? "ring-2 ring-green-500" : ""}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Đã duyệt</p>
                <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={activeTab === "rejected" ? "ring-2 ring-red-500" : ""}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Từ chối</p>
                <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <UserX className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-2 font-medium transition-colors relative ${
            activeTab === "pending"
              ? "text-yellow-600 border-b-2 border-yellow-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Chờ duyệt
          {stats.pending > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs">
              {stats.pending}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("approved")}
          className={`px-4 py-2 font-medium transition-colors relative ${
            activeTab === "approved"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Đã duyệt
          {stats.approved > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">
              {stats.approved}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("rejected")}
          className={`px-4 py-2 font-medium transition-colors relative ${
            activeTab === "rejected"
              ? "text-red-600 border-b-2 border-red-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Từ chối
          {stats.rejected > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">
              {stats.rejected}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("rejected")}
          className={`px-4 py-2 font-medium transition-colors relative ${
            activeTab === "rejected"
              ? "text-red-600 border-b-2 border-red-6 0"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Tài khoản
        </button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tên, email, số điện thoại, tên đơn vị..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Mới nhất</SelectItem>
                  <SelectItem value="oldest">Cũ nhất</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Owners List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Danh sách chủ sân {activeTab === "pending" ? "chờ duyệt" : activeTab === "approved" ? "đã duyệt" : "bị từ chối"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredOwners.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {searchQuery
                  ? "Không tìm thấy kết quả phù hợp"
                  : `Chưa có chủ sân ${activeTab === "pending" ? "chờ duyệt" : activeTab === "approved" ? "đã duyệt" : "bị từ chối"}`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Chủ sân
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Đơn vị kinh doanh
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Liên hệ
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Ngày đăng ký
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Trạng thái
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOwners.map((owner) => (
                    <tr key={owner.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {owner.firstName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {owner.lastName} {owner.firstName}
                            </p>
                            <p className="text-sm text-gray-500">{owner.ownerName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{owner.businessName}</p>
                          <p className="text-sm text-gray-500">MST: {owner.taxCode}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-600">{owner.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-600">{owner.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(owner.registeredAt).toLocaleDateString("vi-VN")}
                        </div>
                      </td>
                      <td className="py-4 px-4">{getStatusBadge(owner.status)}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetail(owner)}
                            className="flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            Chi tiết
                          </Button>
                          {owner.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApprove(owner)}
                                className="bg-green-600 hover:bg-green-700 flex items-center gap-1"
                              >
                                <Check className="w-4 h-4" />
                                Duyệt
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleReject(owner)}
                                className="flex items-center gap-1"
                              >
                                <X className="w-4 h-4" />
                                Từ chối
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-6 h-6 text-teal-600" />
              Chi tiết đăng ký chủ sân
            </DialogTitle>
            <DialogDescription>
              Thông tin đầy đủ về đơn đăng ký của chủ sân
            </DialogDescription>
          </DialogHeader>

          {selectedOwner && (
            <div className="space-y-6 mt-4">
              {/* Status */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Trạng thái đăng ký</p>
                  <div className="mt-1">{getStatusBadge(selectedOwner.status)}</div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Ngày đăng ký</p>
                  <p className="font-semibold">
                    {new Date(selectedOwner.registeredAt).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>

              {/* Personal Info */}
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-teal-600" />
                  Thông tin cá nhân
                </h3>
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Họ và đệm</p>
                    <p className="font-medium">{selectedOwner.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tên</p>
                    <p className="font-medium">{selectedOwner.firstName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedOwner.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Số điện thoại</p>
                    <p className="font-medium">{selectedOwner.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Giới tính</p>
                    <p className="font-medium">{getGenderText(selectedOwner.gender)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ngày sinh</p>
                    <p className="font-medium">
                      {new Date(selectedOwner.dateOfBirth).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Business Info */}
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-teal-600" />
                  Thông tin kinh doanh
                </h3>
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Tên chủ sân</p>
                    <p className="font-medium">{selectedOwner.ownerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Số CCCD</p>
                    <p className="font-medium">{selectedOwner.identityNumber}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Tên đơn vị</p>
                    <p className="font-medium">{selectedOwner.businessName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Mã số thuế</p>
                    <p className="font-medium">{selectedOwner.taxCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Số điện thoại đơn vị</p>
                    <p className="font-medium">{selectedOwner.businessPhone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600 mb-1">Địa chỉ</p>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <p className="font-medium">{selectedOwner.businessAddress}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-teal-600" />
                  Thông tin thanh toán
                </h3>
                <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg border border-teal-200">
                  <div>
                    <p className="text-sm text-gray-600">Ngân hàng</p>
                    <p className="font-semibold text-teal-700">{selectedOwner.bankName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Số tài khoản</p>
                    <p className="font-semibold font-mono text-teal-700">
                      {selectedOwner.accountNumber}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Chủ tài khoản</p>
                    <p className="font-semibold text-teal-700">{selectedOwner.accountOwner}</p>
                  </div>
                </div>
              </div>

              {/* Rejection Reason */}
              {selectedOwner.status === "rejected" && selectedOwner.rejectionReason && (
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-red-600 font-semibold mb-1">Lý do từ chối</p>
                  <p className="text-red-700">{selectedOwner.rejectionReason}</p>
                </div>
              )}

              {/* Approval Info */}
              {selectedOwner.status !== "pending" && selectedOwner.approvedAt && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-blue-600 font-semibold">
                        {selectedOwner.status === "approved" ? "Người duyệt" : "Người từ chối"}
                      </p>
                      <p className="text-blue-700">{selectedOwner.approvedBy}</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600 font-semibold">
                        {selectedOwner.status === "approved" ? "Ngày duyệt" : "Ngày từ chối"}
                      </p>
                      <p className="text-blue-700">
                        {new Date(selectedOwner.approvedAt).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              {selectedOwner.status === "pending" && (
                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setIsDetailOpen(false)}
                  >
                    Đóng
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleReject(selectedOwner)}
                    className="flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Từ chối
                  </Button>
                  <Button
                    onClick={() => handleApprove(selectedOwner)}
                    className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Duyệt đăng ký
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}