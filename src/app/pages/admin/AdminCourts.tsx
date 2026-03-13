import { useState, useEffect, useCallback, useRef } from "react";
import {
  Plus, Pencil, Trash2, Search, RefreshCw, Loader2,
  Building2, Users, Clock, ImageIcon, X, CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "../../components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../../components/ui/select";
import { toast } from "sonner";
import api from "../../lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────
interface CourtTypeRef {
  _id: string;
  name: string;
  icon: string;
  color: string;
  minPlayers: number;
  maxPlayers: number;
}

interface Court {
  _id: string;
  name: string;
  code?: string;
  typeId: CourtTypeRef;
  address: string;
  district: string;
  description?: string;
  capacity: number;
  openTime: string;
  closeTime: string;
  pricing: { morning: number; afternoon: number; evening: number };
  status: "active" | "maintenance";
  images: string[];
  mainImage?: string;
  facilities: string[];
  createdAt: string;
}

interface CourtForm {
  name: string;
  code: string;
  typeId: string;
  address: string;
  district: string;
  description: string;
  capacity: number;
  openTime: string;
  closeTime: string;
  pricingMorning: number;
  pricingAfternoon: number;
  pricingEvening: number;
  facilities: string;
  status: "active" | "maintenance";
}

const defaultForm: CourtForm = {
  name: "",
  code: "",
  typeId: "",
  address: "",
  district: "",
  description: "",
  capacity: 4,
  openTime: "06:00",
  closeTime: "22:00",
  pricingMorning: 0,
  pricingAfternoon: 0,
  pricingEvening: 0,
  facilities: "",
  status: "active",
};

const DISTRICTS = [
  "Quận 1", "Quận 2", "Quận 3", "Quận 4", "Quận 5",
  "Quận 6", "Quận 7", "Quận 8", "Quận 9", "Quận 10",
  "Quận 11", "Quận 12", "Bình Thạnh", "Gò Vấp", "Phú Nhuận",
  "Tân Bình", "Tân Phú", "Thủ Đức", "Bình Tân", "Huyện khác",
];

// ─── Component ────────────────────────────────────────────────────────────────
export function AdminCourts() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [courtTypes, setCourtTypes] = useState<CourtTypeRef[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Dialog thêm/sửa
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourt, setEditingCourt] = useState<Court | null>(null);
  const [form, setForm] = useState<CourtForm>(defaultForm);
  const [isSaving, setIsSaving] = useState(false);

  // Upload ảnh
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dialog xóa
  const [deleteTarget, setDeleteTarget] = useState<Court | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ─── Fetch ────────────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = {};
      if (typeFilter !== "all") params.typeId = typeFilter;
      if (statusFilter !== "all") params.status = statusFilter;
      if (searchQuery) params.search = searchQuery;

      const [courtsRes, typesRes] = await Promise.all([
        api.get<Court[]>("/admin/courts", { params }),
        api.get<CourtTypeRef[]>("/admin/court-types"),
      ]);
      setCourts(courtsRes.data);
      setCourtTypes(typesRes.data);
    } catch {
      toast.error("Không thể tải dữ liệu.");
    } finally {
      setIsLoading(false);
    }
  }, [typeFilter, statusFilter, searchQuery]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ─── Image Handling ───────────────────────────────────────────────────────
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentCount = imagePreviews.filter(p => p.startsWith("http")).length;
    const MAX = 5 - currentCount;
    if (files.length > MAX) {
      toast.warning(`Chỉ được thêm tối đa ${MAX} ảnh nữa (tổng 5 ảnh).`);
    }
    const selected = files.slice(0, MAX);
    setImageFiles((prev) => [...prev, ...selected]);
    const previews = selected.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => [...prev, ...previews]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    const isFile = !imagePreviews[index].startsWith("http");
    if (isFile) {
      const fileIdx = imagePreviews.slice(0, index).filter((p) => !p.startsWith("http")).length;
      setImageFiles((prev) => prev.filter((_, i) => i !== fileIdx));
    }
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    if (mainImageIndex === index) setMainImageIndex(0);
    else if (mainImageIndex > index) setMainImageIndex((prev) => prev - 1);
  };

  // ─── Open Dialogs ─────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditingCourt(null);
    setForm(defaultForm);
    setImageFiles([]);
    setImagePreviews([]);
    setMainImageIndex(0);
    setIsDialogOpen(true);
  };

  const openEdit = (court: Court) => {
    setEditingCourt(court);
    setForm({
      name: court.name,
      code: court.code || "",
      typeId: court.typeId?._id || "",
      address: court.address,
      district: court.district,
      description: court.description || "",
      capacity: court.capacity,
      openTime: court.openTime,
      closeTime: court.closeTime,
      pricingMorning: court.pricing.morning,
      pricingAfternoon: court.pricing.afternoon,
      pricingEvening: court.pricing.evening,
      facilities: court.facilities.join(", "),
      status: court.status,
    });
    setImageFiles([]);
    setImagePreviews(court.images || []);
    const mainIdx = court.mainImage ? court.images.indexOf(court.mainImage) : 0;
    setMainImageIndex(mainIdx >= 0 ? mainIdx : 0);
    setIsDialogOpen(true);
  };

  // ─── Save ─────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.name.trim() || !form.typeId || !form.address.trim() || !form.district) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc (*).");
      return;
    }
    setIsSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
      formData.set("mainImageIndex", String(mainImageIndex));
      imageFiles.forEach((file) => formData.append("images", file));

      if (editingCourt) {
        await api.put(`/admin/courts/${editingCourt._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success(`Đã cập nhật sân "${form.name}".`);
      } else {
        await api.post("/admin/courts", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success(`Đã thêm sân "${form.name}" thành công.`);
      }
      setIsDialogOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không thể lưu sân.");
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.delete(`/admin/courts/${deleteTarget._id}`);
      toast.success(`Đã xóa sân "${deleteTarget.name}".`);
      setDeleteTarget(null);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không thể xóa sân.");
    } finally {
      setIsDeleting(false);
    }
  };

  // ─── Toggle Status ────────────────────────────────────────────────────────
  const handleToggleStatus = async (court: Court) => {
    const newStatus = court.status === "active" ? "maintenance" : "active";
    try {
      await api.patch(`/admin/courts/${court._id}/status`, { status: newStatus });
      toast.success(`Đã đổi trạng thái sân "${court.name}" thành ${newStatus === "active" ? "Hoạt động" : "Bảo trì"}.`);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không thể đổi trạng thái.");
    }
  };

  const fmt = (n: number) => n.toLocaleString("vi-VN") + "đ";

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý Sân thể thao</h2>
          <p className="text-gray-500 text-sm mt-1">Thêm, sửa, xóa và quản lý sân trong hệ thống</p>
        </div>
        <Button onClick={openAdd} className="flex items-center gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          Thêm sân mới
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm theo tên sân..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Tất cả loại" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại</SelectItem>
            {courtTypes.map((t) => (
              <SelectItem key={t._id} value={t._id}>
                {t.icon} {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Tất cả trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="active">Hoạt động</SelectItem>
            <SelectItem value="maintenance">Bảo trì</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={fetchData} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Làm mới
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="text-center py-16 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" />
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : courts.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Không tìm thấy sân nào</p>
        </div>
      ) : (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    <th className="py-3 px-4 text-left">Sân</th>
                    <th className="py-3 px-4 text-left">Loại</th>
                    <th className="py-3 px-4 text-left">Địa chỉ</th>
                    <th className="py-3 px-4 text-left">Giờ mở cửa</th>
                    <th className="py-3 px-4 text-left">Giờ đóng cửa</th>
                    <th className="py-3 px-4 text-left">Sức chứa</th>
                    <th className="py-3 px-4 text-left">Tiện ích</th>
                    <th className="py-3 px-4 text-left">Giá/giờ (Sáng)</th>
                    <th className="py-3 px-4 text-left">Trạng thái</th>
                    <th className="py-3 px-4 text-left">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {courts.map((court) => (
                    <tr key={court._id} className="border-b hover:bg-gray-50 transition-colors">
                      {/* Ảnh + Tên */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {court.mainImage || court.images?.[0] ? (
                            <img
                              src={court.mainImage || court.images[0]}
                              alt={court.name}
                              className="w-55 h-30 object-cover rounded-lg shrink-0"
                            />
                          ) : (
                            <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                              <ImageIcon className="w-6 h-6 text-blue-300" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">{court.name}</p>
                            {court.code && <p className="text-xs text-gray-400 font-mono">{court.code}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-7 h-7 rounded-md ${court.typeId?.color || 'bg-gray-200'} flex items-center justify-center text-sm`}>
                            {court.typeId?.icon || '❓'}
                          </span>
                          <span className="text-sm text-gray-700">{court.typeId?.name || 'Không xác định'}</span>
                        </div>
                      </td>
                      {/* Địa chỉ */}
                      <td className="py-3 px-4">
                        <p className="text-sm text-gray-700 max-w-[180px] truncate">{court.address}</p>
                        <p className="text-xs text-gray-400">{court.district}</p>
                      </td>
                      {/* Giờ mở cửa */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{court.openTime}</span>
                        </div>
                      </td>
                      {/* Giờ đóng cửa */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{court.closeTime}</span>
                        </div>
                      </td>
                      {/* Sức chứa */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Users className="w-3.5 h-3.5" />
                          <span>{court.capacity} người</span>
                        </div>
                      </td>
                      {/* Tiện ích */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[150px]">
                          {court.facilities?.length > 0 ? court.facilities.map((f, i) => (
                            <span key={i} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-md border border-gray-200 whitespace-nowrap">
                              {f}
                            </span>
                          )) : (
                            <span className="text-xs text-gray-400">Không có</span>
                          )}
                        </div>
                      </td>
                      {/* Giá */}
                      <td className="py-3 px-4">
                        <p className="text-sm font-semibold text-gray-700">{fmt(court.pricing.morning)}</p>
                        <p className="text-xs text-gray-400">Chiều: {fmt(court.pricing.afternoon)}</p>
                        <p className="text-xs text-gray-400">Tối: {fmt(court.pricing.evening)}</p>
                      </td>
                      {/* Trạng thái */}
                      <td className="py-3 px-4">
                        <Badge
                          className={
                            court.status === "active"
                              ? "bg-green-100 text-green-700 hover:bg-green-100 cursor-pointer"
                              : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 cursor-pointer"
                          }
                          onClick={() => handleToggleStatus(court)}
                          title="Click để đổi trạng thái"
                        >
                          {court.status === "active" ? "Hoạt động" : "Bảo trì"}
                        </Badge>
                      </td>
                      {/* Thao tác */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost" size="sm"
                            onClick={() => openEdit(court)}
                            className="text-blue-600 hover:bg-blue-50"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost" size="sm"
                            onClick={() => setDeleteTarget(court)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Dialog Thêm/Sửa ──────────────────────────────────────────────────── */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCourt ? "Chỉnh sửa sân" : "Thêm sân mới"}</DialogTitle>
            <DialogDescription>
              {editingCourt ? "Cập nhật thông tin sân thể thao" : "Thêm sân thể thao mới vào hệ thống"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Tên & Mã sân */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Tên sân <span className="text-red-500">*</span></Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="VD: Sân Cầu Lông Số 1" />
              </div>
              <div className="space-y-1.5">
                <Label>Mã sân</Label>
                <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="VD: CL01" />
              </div>
            </div>

            {/* Loại sân */}
            <div className="space-y-1.5">
              <Label>Loại sân <span className="text-red-500">*</span></Label>
              <Select value={form.typeId} onValueChange={(v) => setForm({ ...form, typeId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại sân" />
                </SelectTrigger>
                <SelectContent>
                  {courtTypes.map((t) => (
                    <SelectItem key={t._id} value={t._id}>
                      {t.icon} {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Địa chỉ & Quận */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Địa chỉ <span className="text-red-500">*</span></Label>
                <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Số nhà, tên đường" />
              </div>
              <div className="space-y-1.5">
                <Label>Quận/Huyện <span className="text-red-500">*</span></Label>
                <Select value={form.district} onValueChange={(v) => setForm({ ...form, district: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn quận" />
                  </SelectTrigger>
                  <SelectContent>
                    {DISTRICTS.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Sức chứa & Giờ mở/đóng */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label>Sức chứa (người)</Label>
                <Input type="number" min={1} value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} />
              </div>
              <div className="space-y-1.5">
                <Label>Giờ mở cửa</Label>
                <Input type="time" value={form.openTime} onChange={(e) => setForm({ ...form, openTime: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Giờ đóng cửa</Label>
                <Input type="time" value={form.closeTime} onChange={(e) => setForm({ ...form, closeTime: e.target.value })} />
              </div>
            </div>

            {/* Bảng giá */}
            <div className="space-y-2">
              <Label>Bảng giá (VNĐ/giờ)</Label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Sáng (06-12h)", key: "pricingMorning" },
                  { label: "Chiều (12-18h)", key: "pricingAfternoon" },
                  { label: "Tối (18-22h)", key: "pricingEvening" },
                ].map(({ label, key }) => (
                  <div key={key} className="space-y-1.5">
                    <Label className="text-xs text-gray-500">{label}</Label>
                    <Input
                      type="number" min={0} step={1000}
                      value={form[key as keyof CourtForm]}
                      onChange={(e) => setForm({ ...form, [key]: Number(e.target.value) })}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Trạng thái */}
            <div className="space-y-1.5">
              <Label>Trạng thái</Label>
              <div className="flex gap-3">
                {(["active", "maintenance"] as const).map((s) => (
                  <button
                    key={s} type="button"
                    onClick={() => setForm({ ...form, status: s })}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${form.status === s
                      ? s === "active" ? "border-green-500 bg-green-50 text-green-700" : "border-yellow-500 bg-yellow-50 text-yellow-700"
                      : "border-gray-200 text-gray-400 hover:border-gray-300"
                      }`}
                  >
                    {s === "active" ? "✓ Hoạt động" : "⚠ Bảo trì"}
                  </button>
                ))}
              </div>
            </div>

            {/* Tiện ích */}
            <div className="space-y-1.5">
              <Label>Tiện ích (cách nhau bằng dấu phẩy)</Label>
              <Input value={form.facilities} onChange={(e) => setForm({ ...form, facilities: e.target.value })} placeholder="VD: Wifi, Gửi xe, Căng tin, Phòng tắm" />
            </div>

            {/* Mô tả */}
            <div className="space-y-1.5">
              <Label>Mô tả</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Mô tả về sân..." rows={3} />
            </div>

            {/* Upload ảnh */}
            <div className="space-y-2">
              <Label>Ảnh sân (tối đa 5 ảnh)</Label>
              {imagePreviews.length < 5 && (
                <div
                  className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-blue-300 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="w-6 h-6 mx-auto text-gray-300 mb-1" />
                  <p className="text-sm text-gray-400">Click để chọn ảnh ({imagePreviews.length}/5)</p>
                  <input
                    ref={fileInputRef} type="file" multiple accept="image/*"
                    className="hidden" onChange={handleImageSelect}
                  />
                </div>
              )}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-5 gap-2">
                  {imagePreviews.map((src, idx) => (
                    <div key={idx} className="relative group aspect-square">
                      <img src={src} alt="" className="w-full h-full object-cover rounded-lg" />
                      {/* Ảnh chính */}
                      <button
                        type="button" onClick={() => setMainImageIndex(idx)}
                        className={`absolute top-1 left-1 w-5 h-5 rounded-full flex items-center justify-center transition-colors ${mainImageIndex === idx ? "bg-blue-500" : "bg-black/30 hover:bg-black/50"
                          }`}
                        title="Đặt làm ảnh chính"
                      >
                        <CheckCircle className="w-3 h-3 text-white" />
                      </button>
                      {/* Xóa */}
                      <button
                        type="button" onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                      {mainImageIndex === idx && (
                        <div className="absolute bottom-0 left-0 right-0 bg-blue-500/70 text-white text-[10px] text-center py-0.5 rounded-b-lg">
                          Ảnh chính
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>Hủy</Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingCourt ? "Cập nhật" : "Thêm sân"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Dialog Xác nhận Xóa ──────────────────────────────────────────────── */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Xác nhận xóa sân
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa sân <span className="font-semibold">"{deleteTarget?.name}"</span>?
              Tất cả ảnh của sân sẽ bị xóa khỏi Cloudinary.{" "}
              <span className="text-red-600 font-medium">Hành động này không thể hoàn tác.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
              {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Xóa sân
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}