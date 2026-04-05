import { useState, useEffect, useCallback, useRef } from "react";
import {
  Plus, Pencil, Trash2, Search, RefreshCw, Loader2,
  Building2, Users, Clock, ImageIcon, X, CheckCircle,
  AlertTriangle, FilterX,
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
import { RichTextEditor } from "../../components/ui/RichTextEditor";
import { Badge } from "../../components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../../components/ui/select";
import { toast } from "sonner";
import api from "../../lib/api";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});
// ─── Types ────────────────────────────────────────────────────────────────────
interface CourtTypeRef {
  _id: string;
  name: string;
  icon: string;
  color: string;
  minPlayers: number;
  maxPlayers: number;
}

interface FacilityItem {
  _id: string;
  name: string;
  icon: string;
}

interface Court {
  _id: string;
  name: string;
  code?: string;
  typeId: CourtTypeRef;
  address: string;
  latitude: number;
  longitude: number;
  description?: string;
  capacity: number;
  openTime: string;
  closeTime: string;
  pricing: { morning: number; afternoon: number; evening: number };
  status: "active" | "maintenance";
  images: string[];
  mainImage?: string;
  facilities: FacilityItem[] | any[];
  createdAt: string;
}

interface CourtForm {
  name: string;
  code: string;
  typeId: string;
  address: string;
  provinceCode: string;
  districtCode: string;
  latitude: number;
  longitude: number;
  description: string;
  capacity: number;
  openTime: string;
  closeTime: string;
  facilities: string[];
  status: "active" | "maintenance";
}

interface Province {
  code: number;
  name: string;
}

interface District {
  code: number;
  name: string;
  provinceCode: number;
}

const defaultForm: CourtForm = {
  name: "",
  code: "",
  typeId: "",
  address: "",
  provinceCode: "",
  districtCode: "",
  latitude: 21.017554486572717,
  longitude: 105.84992408752441,
  description: "",
  capacity: 4,
  openTime: "06:00",
  closeTime: "22:00",
  facilities: [],
  status: "active",
};

function LocationPicker({ position, setPosition }: { position: [number, number], setPosition: (p: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return <Marker position={position} />;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function AdminCourts() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [courtTypes, setCourtTypes] = useState<CourtTypeRef[]>([]);
  const [facilities, setFacilities] = useState<FacilityItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Province / District
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

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

      const [courtsRes, typesRes, facilitiesRes] = await Promise.all([
        api.get<Court[]>("/admin/courts", { params }),
        api.get<CourtTypeRef[]>("/admin/court-types"),
        api.get<FacilityItem[]>("/admin/facilities"),
      ]);
      setCourts(courtsRes.data);
      setCourtTypes(typesRes.data);
      setFacilities(facilitiesRes.data);
    } catch {
      toast.error("Không thể tải dữ liệu.");
    } finally {
      setIsLoading(false);
    }
  }, [typeFilter, statusFilter, searchQuery]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Load danh sách tỉnh khi mount
  useEffect(() => {
    api.get("/locations/provinces")
      .then(res => setProvinces(res.data.data ?? []))
      .catch(() => toast.error("Không thể tải danh sách tỉnh/thành phố."));
  }, []);

  // Load quận/huyện khi form.provinceCode thay đổi
  useEffect(() => {
    if (!form.provinceCode) { setDistricts([]); return; }
    setLoadingDistricts(true);
    api.get(`/locations/provinces/${form.provinceCode}/districts`)
      .then(res => setDistricts(res.data.data ?? []))
      .catch(() => toast.error("Không thể tải danh sách quận/huyện."))
      .finally(() => setLoadingDistricts(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.provinceCode]);

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
      provinceCode: (court as any).provinceCode ? String((court as any).provinceCode) : "",
      districtCode: (court as any).districtCode ? String((court as any).districtCode) : "",
      latitude: court.latitude || 20.967420728054737,
      longitude: court.longitude || 105.843186378479022,
      description: court.description || "",
      capacity: court.capacity,
      openTime: court.openTime,
      closeTime: court.closeTime,
      facilities: court.facilities?.map(f => typeof f === 'object' ? f._id : f) || [],
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
    if (!form.name.trim() || !form.typeId || !form.address.trim()) {
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

  const clearFilters = () => {
    setSearchQuery("");
    setTypeFilter("all");
    setStatusFilter("all");
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
        <Button
          variant="outline"
          onClick={clearFilters}
          disabled={isLoading || (!searchQuery && typeFilter === "all" && statusFilter === "all")}
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <FilterX className="w-4 h-4 mr-2" />
          Xóa bộ lọc
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
                    <th className="py-3 px-4 text-left">Ảnh</th>
                    <th className="py-3 px-4 text-left">Tên sân</th>
                    <th className="py-3 px-4 text-left">Mã sân</th>
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
                    <tr
                      key={court._id}
                      className="border-b hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => {
                        const selection = window.getSelection();
                        if (selection && selection.toString().length > 0) {
                          return; // Ignore click if user is selecting text
                        }
                        openEdit(court);
                      }}
                    >
                      {/* Ảnh */}
                      <td className="py-3 px-4">
                        {court.mainImage || court.images?.[0] ? (
                          <img
                            src={court.mainImage || court.images[0]}
                            alt={court.name}
                            className="w-50 h-25 object-cover rounded-lg shrink-0 border border-gray-100 shadow-sm"
                          />
                        ) : (
                          <div className="w-25 h-25 bg-blue-50 rounded-lg flex items-center justify-center shrink-0 border border-blue-100">
                            <ImageIcon className="w-5 h-5 text-blue-300" />
                          </div>
                        )}
                      </td>
                      {/* Tên sân */}
                      <td className="py-3 px-4">
                        <p className="font-semibold text-gray-900">{court.name}</p>
                      </td>
                      {/* Mã sân */}
                      <td className="py-3 px-4">
                        {court.code ? (
                          <span className="font-mono text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                            {court.code}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
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
                        <p className="text-xs text-gray-400 text-ellipsis overflow-hidden">📍 {court.latitude?.toFixed(4)}, {court.longitude?.toFixed(4)}</p>
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
                            <span key={i} className="px-1.5 py-0.5 bg-gray-100 text-gray-700 text-[11px] rounded flex items-center gap-1 font-medium border border-gray-200 whitespace-nowrap">
                              {typeof f === 'object' ? `${f.icon} ${f.name}` : f}
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleStatus(court);
                          }}
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
                            onClick={(e) => {
                              e.stopPropagation();
                              openEdit(court);
                            }}
                            className="text-blue-600 hover:bg-blue-50"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost" size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteTarget(court);
                            }}
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
        <DialogContent className="!w-[95vw] !max-w-[1300px] max-h-[90vh] overflow-y-auto">
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

            {/* Địa chỉ */}
            <div className="space-y-1.5">
              <Label>Địa chỉ <span className="text-red-500">*</span></Label>
              <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Số nhà, tên đường, khu vực..." />
            </div>

            {/* Tỉnh / Quận-Huyện */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Thành phố / Tỉnh</Label>
                <Select
                  value={form.provinceCode}
                  onValueChange={(v) => setForm({ ...form, provinceCode: v, districtCode: "" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tỉnh/thành phố" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {provinces.map(p => (
                      <SelectItem key={p.code} value={String(p.code)}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Quận / Huyện</Label>
                <Select
                  value={form.districtCode}
                  onValueChange={(v) => setForm({ ...form, districtCode: v })}
                  disabled={!form.provinceCode || loadingDistricts}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      !form.provinceCode ? "Chọn tỉnh trước" :
                        loadingDistricts ? "Đang tải..." : "Chọn quận/huyện"
                    } />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {districts.map(d => (
                      <SelectItem key={d.code} value={String(d.code)}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Bản đồ định vị */}
            <div className="space-y-3 p-4 border border-blue-100 bg-blue-50/40 rounded-xl">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <Label className="text-blue-800 font-semibold flex items-center gap-2">
                  Tọa độ (Bản đồ) <span className="text-red-500">*</span>
                </Label>
                <div className="text-xs text-gray-500">
                  <span className="font-semibold text-blue-600">Click vào bản đồ</span> để ghim điểm
                </div>
              </div>

              <div className="w-full h-[400px] border border-gray-200 rounded-lg overflow-hidden shadow-inner isolate z-0 relative">
                <MapContainer center={[form.latitude, form.longitude]} zoom={13} scrollWheelZoom={true} style={{ height: "100%", width: "100%", zIndex: 0 }}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationPicker
                    position={[form.latitude, form.longitude]}
                    setPosition={(p) => setForm({ ...form, latitude: p[0], longitude: p[1] })}
                  />
                </MapContainer>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-black-500 font-medium">Latitude (Vĩ độ)</Label>
                  <Input readOnly disabled value={form.latitude} className="bg-white/50 border-black-200 text-black-600 shadow-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-black-500 font-medium">Longitude (Kinh độ)</Label>
                  <Input readOnly disabled value={form.longitude} className="bg-white/50 border-black-200 text-black-600 shadow-sm" />
                </div>
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

            {/* Bảng giá đã chuyển vào trang Cấu hình Giá riêng */}
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700 flex items-center gap-2">
              ℹ️ Giá từng khung giờ được cấu hình chi tiết tại mục <strong className="mx-1">Cấu hình Giá</strong>. Giá mặc định 100.000đ/slot sẽ được tự động tạo khi thêm sân mới.
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
            <div className="space-y-2">
              <Label>Tiện ích bổ sung</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                {facilities.map((fac) => {
                  const isSelected = form.facilities.includes(fac._id);
                  return (
                    <label
                      key={fac._id}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all border ${isSelected
                          ? "bg-white border-blue-200 shadow-sm"
                          : "border-transparent hover:bg-gray-100 text-gray-600"
                        }`}
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        checked={isSelected}
                        onChange={() => {
                          setForm(prev => ({
                            ...prev,
                            facilities: prev.facilities.includes(fac._id)
                              ? prev.facilities.filter(id => id !== fac._id)
                              : [...prev.facilities, fac._id]
                          }));
                        }}
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{fac.icon}</span>
                        <span className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">{fac.name}</span>
                      </div>
                    </label>
                  );
                })}
                {facilities.length === 0 && (
                  <p className="text-xs text-gray-400 col-span-full">Chưa có tiện ích nào trong hệ thống, hãy thêm ở mục "Tiện Ích".</p>
                )}
              </div>
            </div>

            {/* Mô tả */}
            <div className="space-y-1.5">
              <Label>Mô tả</Label>
              <RichTextEditor
                content={form.description}
                onChange={(html) => setForm({ ...form, description: html })}
                placeholder="Mô tả chi tiết về sân, dịch vụ đi kèm, quy định đặc biệt..."
              />
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