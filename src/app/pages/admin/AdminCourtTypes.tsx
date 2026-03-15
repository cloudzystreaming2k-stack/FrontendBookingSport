import { useState, useEffect, useCallback } from "react";
import {
  Plus, Pencil, Trash2, Search, Users, Building2,
  RefreshCw, Loader2,
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
interface CourtTypeItem {
  _id: string;
  name: string;
  icon: string;
  color: string;
  minPlayers: number;
  maxPlayers: number;
  courtCount: number;
  createdAt: string;
}

// ─── Constants ────────────────────────────────────────────────────

const defaultForm = {
  name: "",
  icon: "🏓",
  color: "#3b82f6", // Default blue hex
  minPlayers: 2,
  maxPlayers: 4,
};

// ─── Component ────────────────────────────────────────────────────
export function AdminCourtTypes() {
  const [courtTypes, setCourtTypes] = useState<CourtTypeItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog thêm/sửa
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<CourtTypeItem | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [isSaving, setIsSaving] = useState(false);

  // Dialog xóa
  const [deleteTarget, setDeleteTarget] = useState<CourtTypeItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ─── Fetch ────────────────────────────────────────────────────
  const fetchCourtTypes = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get<CourtTypeItem[]>("/admin/court-types");
      setCourtTypes(data);
    } catch {
      toast.error("Không thể tải danh sách loại sân.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchCourtTypes(); }, [fetchCourtTypes]);

  // ─── Filter ───────────────────────────────────────────────────
  const filteredTypes = courtTypes.filter((ct) =>
    ct.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCourts = courtTypes.reduce((sum, ct) => sum + (ct.courtCount || 0), 0);

  // ─── Open Dialogs ─────────────────────────────────────────────
  const openAdd = () => {
    setEditingType(null);
    setForm(defaultForm);
    setIsDialogOpen(true);
  };

  const openEdit = (ct: CourtTypeItem) => {
    setEditingType(ct);
    setForm({
      name: ct.name,
      icon: ct.icon,
      color: ct.color,
      minPlayers: ct.minPlayers,
      maxPlayers: ct.maxPlayers,
    });
    setIsDialogOpen(true);
  };

  // ─── Save (Create / Update) ───────────────────────────────────
  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Tên loại sân không được để trống.");
      return;
    }
    setIsSaving(true);
    try {
      if (editingType) {
        await api.put(`/admin/court-types/${editingType._id}`, form);
        toast.success(`Đã cập nhật "${form.name}" thành công.`);
      } else {
        await api.post("/admin/court-types", form);
        toast.success(`Đã thêm loại sân "${form.name}" thành công.`);
      }
      setIsDialogOpen(false);
      fetchCourtTypes();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không thể lưu loại sân.");
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Delete ───────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.delete(`/admin/court-types/${deleteTarget._id}`);
      toast.success(`Đã xóa loại sân "${deleteTarget.name}".`);
      setDeleteTarget(null);
      fetchCourtTypes();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không thể xóa loại sân.");
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
          <h2 className="text-2xl font-bold text-gray-900">Quản lý Loại sân</h2>
          <p className="text-gray-500 text-sm mt-1">
            Thêm, sửa, xóa và quản lý các loại sân thể thao trong hệ thống
          </p>
        </div>
        <Button onClick={openAdd} className="flex items-center gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          Thêm loại sân
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng loại sân</p>
              <p className="text-xl font-bold text-gray-900">{courtTypes.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng số sân</p>
              <p className="text-xl font-bold text-gray-900">{totalCourts}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm loại sân..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={fetchCourtTypes} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Làm mới
        </Button>
      </div>

      {/* Court Types Grid */}
      {isLoading ? (
        <div className="text-center py-16 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" />
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : filteredTypes.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Không tìm thấy loại sân nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTypes.map((ct) => (
            <Card
              key={ct._id}
              className="border-0 shadow-sm overflow-hidden transition-shadow hover:shadow-md"
            >
              {/* Color bar */}
              <div
                className={`h-2 ${ct.color?.startsWith('bg-') ? ct.color : 'bg-gray-200'}`}
                style={ct.color?.startsWith('#') || ct.color?.startsWith('rgb') ? { backgroundColor: ct.color } : {}}
              />
              <CardContent className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm ${ct.color?.startsWith('bg-') ? ct.color : 'bg-gray-100'}`}
                      style={ct.color?.startsWith('#') || ct.color?.startsWith('rgb') ? { backgroundColor: ct.color } : {}}
                    >
                      {ct.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{ct.name}</h3>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    <span>{ct.courtCount || 0} sân</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>
                      {ct.minPlayers}–{ct.maxPlayers} người
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1"
                    onClick={() => openEdit(ct)}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Sửa
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteTarget(ct)}
                    className="text-red-500 hover:text-red-700 hover:border-red-300"
                    disabled={(ct.courtCount || 0) > 0}
                    title={(ct.courtCount || 0) > 0 ? `Không thể xóa: đang có ${ct.courtCount} sân` : "Xóa loại sân"}
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
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingType ? "Chỉnh sửa loại sân" : "Thêm loại sân mới"}
            </DialogTitle>
            <DialogDescription>
              {editingType
                ? "Cập nhật thông tin loại sân thể thao"
                : "Thêm loại sân thể thao mới vào hệ thống"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="ct-name">Tên loại sân <span className="text-red-500">*</span></Label>
              <Input
                id="ct-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="VD: Pickleball"
              />
            </div>

            {/* Icon input */}
            <div className="space-y-2">
              <Label htmlFor="ct-icon">Biểu tượng (Icon - Text/Emoji)</Label>
              <Input
                id="ct-icon"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                placeholder="VD: 🏓 hoặc Cầu lông..."
              />
            </div>

            {/* Color input */}
            <div className="space-y-2">
              <Label htmlFor="ct-color">Màu sắc (Chọn màu hoặc nhập mã HEX)</Label>
              <div className="flex gap-3">
                <div className="relative w-12 h-10 shrink-0 rounded-lg overflow-hidden border border-gray-300 shadow-sm">
                  <input
                    type="color"
                    id="ct-color-picker"
                    value={form.color?.startsWith('#') ? form.color : '#3b82f6'}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                  />
                </div>
                <Input
                  id="ct-color"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  placeholder="VD: #3b82f6"
                  className="flex-1 font-mono uppercase"
                />
              </div>
              {/* Preview */}
              <div className="flex items-center gap-3 mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm ${form.color?.startsWith('bg-') ? form.color : 'bg-gray-200'}`}
                  style={form.color?.startsWith('#') || form.color?.startsWith('rgb') ? { backgroundColor: form.color } : {}}
                >
                  {form.icon || "❓"}
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">Xem trước hiển thị</p>
                  <p className="text-gray-500">Màu và Icon khi lên giao diện</p>
                </div>
              </div>
            </div>

            {/* Players */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ct-min">Số người tối thiểu</Label>
                <Input
                  id="ct-min"
                  type="number"
                  min={1}
                  value={form.minPlayers}
                  onChange={(e) => setForm({ ...form, minPlayers: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ct-max">Số người tối đa</Label>
                <Input
                  id="ct-max"
                  type="number"
                  min={1}
                  value={form.maxPlayers}
                  onChange={(e) => setForm({ ...form, maxPlayers: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={!form.name.trim() || isSaving}>
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingType ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Dialog Xác nhận Xóa ───────────────────────────────── */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa loại sân</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa loại sân{" "}
              <span className="font-semibold">{deleteTarget?.name}</span>?{" "}
              <span className="text-red-600">Hành động này không thể hoàn tác.</span>
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
              Xóa loại sân
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}