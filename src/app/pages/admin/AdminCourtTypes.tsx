import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Search,
  Users,
  Building2,
  CheckCircle,
  XCircle,
  ChevronRight,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { mockCourtTypes, CourtType } from "../../data/mockData";
import { Link } from "react-router";

const COLOR_OPTIONS = [
  { label: "Cam", value: "bg-orange-500", preview: "bg-orange-500" },
  { label: "Xanh lá", value: "bg-green-500", preview: "bg-green-500" },
  { label: "Đỏ", value: "bg-red-500", preview: "bg-red-500" },
  { label: "Vàng", value: "bg-yellow-500", preview: "bg-yellow-500" },
  { label: "Xanh dương", value: "bg-blue-500", preview: "bg-blue-500" },
  { label: "Tím", value: "bg-purple-500", preview: "bg-purple-500" },
  { label: "Hồng", value: "bg-pink-500", preview: "bg-pink-500" },
  { label: "Xanh ngọc", value: "bg-teal-500", preview: "bg-teal-500" },
];

const ICON_OPTIONS = ["🏓", "🏸", "🏀", "🎾", "🏐", "⚽", "🏈", "🥊", "🏊", "🤸", "🏋️", "🎯"];

const defaultForm = {
  name: "",
  slug: "",
  description: "",
  icon: "🏓",
  color: "bg-blue-500",
  minPlayers: 2,
  maxPlayers: 4,
  status: "active" as "active" | "inactive",
};

export function AdminCourtTypes() {
  const [courtTypes, setCourtTypes] = useState<CourtType[]>(mockCourtTypes);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<CourtType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [form, setForm] = useState(defaultForm);

  const filteredTypes = courtTypes.filter((ct) => {
    const matchesSearch = ct.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || ct.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const openAdd = () => {
    setEditingType(null);
    setForm(defaultForm);
    setIsDialogOpen(true);
  };

  const openEdit = (ct: CourtType) => {
    setEditingType(ct);
    setForm({
      name: ct.name,
      slug: ct.slug,
      description: ct.description,
      icon: ct.icon,
      color: ct.color,
      minPlayers: ct.minPlayers,
      maxPlayers: ct.maxPlayers,
      status: ct.status,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingType) {
      setCourtTypes((prev) =>
        prev.map((ct) =>
          ct.id === editingType.id
            ? {
                ...ct,
                name: form.name,
                slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
                description: form.description,
                icon: form.icon,
                color: form.color,
                minPlayers: Number(form.minPlayers),
                maxPlayers: Number(form.maxPlayers),
                status: form.status,
              }
            : ct
        )
      );
    } else {
      const newType: CourtType = {
        id: `CT${Date.now()}`,
        name: form.name,
        slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
        description: form.description,
        icon: form.icon,
        color: form.color,
        features: [],
        minPlayers: Number(form.minPlayers),
        maxPlayers: Number(form.maxPlayers),
        courtCount: 0,
        status: form.status,
        createdAt: new Date().toISOString(),
      };
      setCourtTypes((prev) => [...prev, newType]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc muốn xóa loại sân này?")) {
      setCourtTypes((prev) => prev.filter((ct) => ct.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setCourtTypes((prev) =>
      prev.map((ct) =>
        ct.id === id
          ? { ...ct, status: ct.status === "active" ? "inactive" : "active" }
          : ct
      )
    );
  };

  const activeCount = courtTypes.filter((ct) => ct.status === "active").length;
  const inactiveCount = courtTypes.filter((ct) => ct.status === "inactive").length;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/admin/courts" className="hover:text-blue-600 transition-colors">
          Quản lý sân
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">Loại sân</span>
      </div>

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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Đang hoạt động</p>
              <p className="text-xl font-bold text-gray-900">{activeCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tạm dừng</p>
              <p className="text-xl font-bold text-gray-900">{inactiveCount}</p>
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
        <div className="flex gap-2">
          {(["all", "active", "inactive"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                filterStatus === s
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
              }`}
            >
              {s === "all" ? "Tất cả" : s === "active" ? "Hoạt động" : "Tạm dừng"}
            </button>
          ))}
        </div>
      </div>

      {/* Court Types Grid */}
      {filteredTypes.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Không tìm thấy loại sân nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTypes.map((ct) => (
            <Card
              key={ct.id}
              className={`border-0 shadow-sm overflow-hidden transition-shadow hover:shadow-md ${
                ct.status === "inactive" ? "opacity-70" : ""
              }`}
            >
              {/* Color bar */}
              <div className={`h-2 ${ct.color}`} />
              <CardContent className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl ${ct.color} flex items-center justify-center text-2xl shadow-sm`}
                    >
                      {ct.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{ct.name}</h3>
                      <span className="text-xs text-gray-400 font-mono">/{ct.slug}</span>
                    </div>
                  </div>
                  <Badge
                    variant={ct.status === "active" ? "default" : "secondary"}
                    className="shrink-0"
                  >
                    {ct.status === "active" ? "Hoạt động" : "Tạm dừng"}
                  </Badge>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{ct.description}</p>

                {/* Info */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    <span>{ct.courtCount} sân</span>
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
                    className="flex-1 gap-1"
                    onClick={() => handleToggleStatus(ct.id)}
                  >
                    {ct.status === "active" ? (
                      <>
                        <ToggleRight className="w-3.5 h-3.5 text-green-600" />
                        Tắt
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-3.5 h-3.5 text-gray-400" />
                        Bật
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(ct.id)}
                    className="text-red-500 hover:text-red-700 hover:border-red-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Dialog */}
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
            {/* Name & Slug */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ct-name">Tên loại sân *</Label>
                <Input
                  id="ct-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="VD: Pickleball"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ct-slug">Slug (URL) *</Label>
                <Input
                  id="ct-slug"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="VD: pickleball"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="ct-desc">Mô tả</Label>
              <Textarea
                id="ct-desc"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Mô tả ngắn về loại sân..."
                rows={3}
              />
            </div>

            {/* Icon picker */}
            <div className="space-y-2">
              <Label>Biểu tượng (Icon)</Label>
              <div className="flex flex-wrap gap-2">
                {ICON_OPTIONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setForm({ ...form, icon })}
                    className={`w-10 h-10 text-xl rounded-lg border-2 transition-all ${
                      form.icon === icon
                        ? "border-blue-500 bg-blue-50 scale-110"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Color picker */}
            <div className="space-y-2">
              <Label>Màu sắc</Label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setForm({ ...form, color: c.value })}
                    title={c.label}
                    className={`w-8 h-8 rounded-full ${c.preview} transition-transform ${
                      form.color === c.value
                        ? "ring-2 ring-offset-2 ring-blue-500 scale-110"
                        : "hover:scale-105"
                    }`}
                  />
                ))}
              </div>
              {/* Preview */}
              <div className="flex items-center gap-2 mt-2">
                <div
                  className={`w-10 h-10 rounded-xl ${form.color} flex items-center justify-center text-xl`}
                >
                  {form.icon}
                </div>
                <span className="text-sm text-gray-500">Xem trước biểu tượng</span>
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

            {/* Status */}
            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <div className="flex gap-3">
                {(["active", "inactive"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setForm({ ...form, status: s })}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                      form.status === s
                        ? s === "active"
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-400 bg-gray-50 text-gray-600"
                        : "border-gray-200 text-gray-400 hover:border-gray-300"
                    }`}
                  >
                    {s === "active" ? "✓ Hoạt động" : "✗ Tạm dừng"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={!form.name.trim()}>
              {editingType ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}