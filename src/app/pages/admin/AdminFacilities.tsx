import { useState, useEffect, useCallback } from "react";
import {
  Plus, Pencil, Trash2, Search,
  RefreshCw, Loader2, Link2,
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
import { toast } from "sonner";
import api from "../../lib/api";

// ─── Types ────────────────────────────────────────────────────────
export interface FacilityItem {
  _id: string;
  name: string;
  icon: string;
  description: string;
  createdAt: string;
}

// ─── Constants ────────────────────────────────────────────────────

const defaultForm = {
  name: "",
  icon: "🛜",
  description: "",
};

// ─── Component ────────────────────────────────────────────────────
export function AdminFacilities() {
  const [facilities, setFacilities] = useState<FacilityItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog thêm/sửa
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<FacilityItem | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [isSaving, setIsSaving] = useState(false);

  // Dialog xóa
  const [deleteTarget, setDeleteTarget] = useState<FacilityItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ─── Fetch ────────────────────────────────────────────────────
  const fetchFacilities = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get<FacilityItem[]>("/admin/facilities");
      setFacilities(data);
    } catch {
      toast.error("Không thể tải danh sách tiện ích.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchFacilities(); }, [fetchFacilities]);

  // ─── Filter ───────────────────────────────────────────────────
  const filteredFacilities = facilities.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ─── Open Dialogs ─────────────────────────────────────────────
  const openAdd = () => {
    setEditingFacility(null);
    setForm(defaultForm);
    setIsDialogOpen(true);
  };

  const openEdit = (f: FacilityItem) => {
    setEditingFacility(f);
    setForm({
      name: f.name,
      icon: f.icon,
      description: f.description || "",
    });
    setIsDialogOpen(true);
  };

  // ─── Save (Create / Update) ───────────────────────────────────
  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Tên tiện ích không được để trống.");
      return;
    }
    setIsSaving(true);
    try {
      if (editingFacility) {
        await api.put(`/admin/facilities/${editingFacility._id}`, form);
        toast.success(`Đã cập nhật "${form.name}" thành công.`);
      } else {
        await api.post("/admin/facilities", form);
        toast.success(`Đã thêm tiện ích "${form.name}" thành công.`);
      }
      setIsDialogOpen(false);
      fetchFacilities();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không thể lưu tiện ích.");
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Delete ───────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.delete(`/admin/facilities/${deleteTarget._id}`);
      toast.success(`Đã xóa tiện ích "${deleteTarget.name}".`);
      setDeleteTarget(null);
      fetchFacilities();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không thể xóa tiện ích.");
    } finally {
      setIsDeleting(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý Tiện ích Sân</h2>
          <p className="text-gray-500 text-sm mt-1">
            Thêm, sửa, xóa và quản lý các tiện ích bổ sung cho nhà thể thao
          </p>
        </div>
        <Button onClick={openAdd} className="flex items-center gap-2 shrink-0 bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Thêm tiện ích
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Link2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng số tiện ích</p>
              <p className="text-xl font-bold text-gray-900">{facilities.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm tiện ích..."
            className="pl-9 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={fetchFacilities} disabled={isLoading} className="bg-white">
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Làm mới
        </Button>
      </div>

      {/* Facilities Grid */}
      {isLoading ? (
        <div className="text-center py-16 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" />
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : filteredFacilities.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Link2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Không tìm thấy tiện ích nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredFacilities.map((f) => (
            <Card
              key={f._id}
              className="border-0 shadow-sm overflow-hidden transition-all hover:shadow-md hover:-translate-y-1"
            >
              <CardContent className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl shadow-sm`}
                    >
                      {f.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg leading-tight">{f.name}</h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                        {f.description || "Không có mô tả"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 mt-4 border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1 h-8"
                    onClick={() => openEdit(f)}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Sửa
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50 hover:border-red-200"
                    onClick={() => setDeleteTarget(f)}
                    title="Xóa tiện ích"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ── Dialog Thêm / Sửa ─────────────────────────────────── */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingFacility ? "Chỉnh sửa tiện ích" : "Thêm tiện ích mới"}
            </DialogTitle>
            <DialogDescription>
              {editingFacility
                ? "Cập nhật thông tin tiện ích"
                : "Thêm một tiện ích mới để hiển thị cho hệ thống"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="f-name">Tên tiện ích <span className="text-red-500">*</span></Label>
              <Input
                id="f-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="VD: Wifi miễn phí, Căng tin..."
              />
            </div>

            {/* Icon input */}
            <div className="space-y-2">
              <Label htmlFor="f-icon">Biểu tượng (Icon - Text/Emoji)</Label>
              <div className="flex gap-3 items-center">
                <Input
                  id="f-icon"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  placeholder="VD: 🛜 hoặc Wifi..."
                  className="flex-1"
                />
                <div 
                  className="w-10 h-10 shrink-0 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-xl shadow-sm"
                  title="Xem trước icon"
                >
                  {form.icon || "❓"}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="f-desc">Mô tả ngắn gọn (Tùy chọn)</Label>
              <Input
                id="f-desc"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="VD: Có tính thêm phí 10.000đ/lần"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={!form.name.trim() || isSaving} className="bg-blue-600 hover:bg-blue-700">
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingFacility ? "Lưu thay đổi" : "Tạo tiện ích"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Dialog Xác nhận Xóa ───────────────────────────────── */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa tiện ích{" "}
              <span className="font-semibold text-gray-900">{deleteTarget?.name}</span>?{" "}
              Các sân thể thao đang sử dụng tiện ích này sẽ bị mất liên kết.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Xác nhận Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
