import { useState, useEffect, useCallback } from "react";
import {
  Trash2, ShieldCheck, ShieldOff, Search, Plus,
  RefreshCw, Users, UserCog, Loader2, Pencil
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "../../components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../../components/ui/select";
import { toast } from "sonner";
import api from "../../lib/api";
import { useAuth } from "../../contexts/AuthContext";

// ─── Types ────────────────────────────────────────────────────────
interface UserItem {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
  createdAt: string;
}

interface UsersResponse {
  users: UserItem[];
  total: number;
  page: number;
  totalPages: number;
}

// ─── Component chính ──────────────────────────────────────────────
export function AdminUsers() {
  const { user: currentAdmin } = useAuth();

  // State dữ liệu
  const [users, setUsers] = useState<UserItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // State bộ lọc & phân trang
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const LIMIT = 10;

  // State Dialog xóa
  const [deleteTarget, setDeleteTarget] = useState<UserItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // State Dialog tạo mới
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createForm, setCreateForm] = useState({ firstName: "", lastName: "", email: "", password: "", phone: "", role: "user", gender: "", dateOfBirth: "" });
  const [isCreating, setIsCreating] = useState(false);

  // State Dialog chỉnh sửa
  const [editTarget, setEditTarget] = useState<UserItem | null>(null);
  const [editForm, setEditForm] = useState({ firstName: "", lastName: "", email: "", phone: "", role: "user" });
  const [isUpdating, setIsUpdating] = useState(false);

  const openEditDialog = (user: UserItem) => {
    setEditTarget(user);
    setEditForm({ firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone || "", role: user.role });
  };

  // ─── Fetch Users ────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: String(LIMIT) };
      if (search) params.search = search;
      if (roleFilter !== "all") params.role = roleFilter;

      const { data } = await api.get<UsersResponse>("/admin/users", { params });
      setUsers(data.users);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch {
      toast.error("Không thể tải danh sách người dùng.");
    } finally {
      setIsLoading(false);
    }
  }, [page, search, roleFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // Debounce search: reset về page 1 khi tìm kiếm
  useEffect(() => { setPage(1); }, [search, roleFilter]);

  // ─── Đổi Role ───────────────────────────────────────────────────
  const handleToggleRole = async (user: UserItem) => {
    if (user._id === currentAdmin?._id) {
      toast.error("Không thể thay đổi quyền của chính mình.");
      return;
    }
    const newRole = user.role === "admin" ? "user" : "admin";
    const label = newRole === "admin" ? "Quản trị viên" : "Người dùng";
    try {
      await api.put(`/admin/users/${user._id}`, { role: newRole });
      toast.success(`Đã đổi quyền "${user.lastName} ${user.firstName}" thành ${label}.`);
      fetchUsers();
    } catch {
      toast.error("Không thể cập nhật quyền hạn.");
    }
  };

  // ─── Xóa User ───────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.delete(`/admin/users/${deleteTarget._id}`);
      toast.success(`Đã xóa tài khoản "${deleteTarget.lastName} ${deleteTarget.firstName}".`);
      setDeleteTarget(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không thể xóa người dùng.");
    } finally {
      setIsDeleting(false);
    }
  };

  // ─── Cập nhật User ─────────────────────────────────────────────
  const handleUpdate = async () => {
    if (!editTarget) return;
    if (!editForm.firstName.trim() || !editForm.email) {
      toast.error("Tên và Email không được để trống.");
      return;
    }
    setIsUpdating(true);
    try {
      await api.put(`/admin/users/${editTarget._id}`, editForm);
      toast.success(`Đã cập nhật thông tin "${editForm.lastName} ${editForm.firstName}" thành công.`);
      setEditTarget(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không thể cập nhật thông tin.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreate = async () => {
    if (!createForm.firstName.trim() || !createForm.email || !createForm.password || !createForm.gender || !createForm.dateOfBirth) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc (Họ Tên, Email, Mật khẩu, Giới tính, Ngày sinh).");
      return;
    }
    setIsCreating(true);
    try {
      await api.post("/admin/users", createForm);
      toast.success(`Đã tạo tài khoản "${createForm.lastName} ${createForm.firstName}" thành công.`);
      setShowCreateDialog(false);
      setCreateForm({ firstName: "", lastName: "", email: "", password: "", phone: "", role: "user", gender: "", dateOfBirth: "" });
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không thể tạo tài khoản.");
    } finally {
      setIsCreating(false);
    }
  };

  // ─── Tính toán Stats ────────────────────────────────────────────
  const adminCount = users.filter((u) => u.role === "admin").length;
  const userCount = users.filter((u) => u.role === "user").length;

  // ─── Render ─────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quản lý Người dùng</h2>
          <p className="text-gray-500 text-sm mt-1">
            Tổng cộng <span className="font-semibold">{total}</span> tài khoản trong hệ thống
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" /> Thêm tài khoản
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="bg-blue-100 rounded-full p-3">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{total}</div>
              <p className="text-gray-500 text-sm">Tổng người dùng</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="bg-green-100 rounded-full p-3">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{userCount}</div>
              <p className="text-gray-500 text-sm">Khách hàng (trang này)</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="bg-purple-100 rounded-full p-3">
              <UserCog className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{adminCount}</div>
              <p className="text-gray-500 text-sm">Quản trị viên (trang này)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bộ lọc */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Tìm theo tên hoặc email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Lọc theo vai trò" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả vai trò</SelectItem>
            <SelectItem value="user">Khách hàng</SelectItem>
            <SelectItem value="admin">Quản trị viên</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={fetchUsers} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Làm mới
        </Button>
      </div>

      {/* Bảng người dùng */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Họ tên</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Số điện thoại</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Vai trò</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Ngày đăng ký</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-gray-400">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                      <p>Đang tải dữ liệu...</p>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-gray-400">
                      Không tìm thấy người dùng nào.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                            {user.firstName.charAt(0).toUpperCase()}
                          </div>
                          <span>{user.lastName} {user.firstName}</span>
                          {user._id === currentAdmin?._id && (
                            <Badge variant="outline" className="text-xs">Bạn</Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{user.email}</td>
                      <td className="py-3 px-4 text-gray-600">{user.phone || "—"}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={user.role === "admin" ? "default" : "secondary"}
                          className={user.role === "admin" ? "bg-purple-600" : ""}
                        >
                          {user.role === "admin" ? "Quản trị viên" : "Khách hàng"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          {/* Nút đổi role */}
                          <Button
                            variant="outline"
                            size="sm"
                            title={user.role === "admin" ? "Hạ xuống Khách hàng" : "Nâng lên Quản trị viên"}
                            onClick={() => handleToggleRole(user)}
                            disabled={user._id === currentAdmin?._id}
                          >
                            {user.role === "admin" ? (
                              <ShieldOff className="w-4 h-4 text-orange-500" />
                            ) : (
                              <ShieldCheck className="w-4 h-4 text-green-600" />
                            )}
                          </Button>
                          {/* Nút chỉnh sửa */}
                          <Button
                            variant="outline"
                            size="sm"
                            title="Chỉnh sửa thông tin"
                            onClick={() => openEditDialog(user)}
                          >
                            <Pencil className="w-4 h-4 text-blue-600" />
                          </Button>
                          {/* Nút xóa */}
                          <Button
                            variant="outline"
                            size="sm"
                            title="Xóa tài khoản"
                            onClick={() => setDeleteTarget(user)}
                            disabled={user._id === currentAdmin?._id}
                            className="text-red-600 hover:text-red-700 hover:border-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
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

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Trang {page} / {totalPages} (Tổng {total} người dùng)
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => p - 1)} disabled={page <= 1}>
              ← Trước
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages}>
              Tiếp →
            </Button>
          </div>
        </div>
      )}

      {/* ── Dialog Xác nhận Xóa ─────────────────────────────────── */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa tài khoản</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa tài khoản của{" "}
              <span className="font-semibold">{deleteTarget?.lastName} {deleteTarget?.firstName}</span> (
              {deleteTarget?.email})?{" "}
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
              Xóa tài khoản
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Dialog Tạo User Mới ─────────────────────────────────── */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tạo tài khoản mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="create-lastName">Họ và đệm <span className="text-red-500">*</span></Label>
                <Input
                  id="create-lastName"
                  placeholder="Nguyễn Văn"
                  value={createForm.lastName}
                  onChange={(e) => setCreateForm({ ...createForm, lastName: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="create-firstName">Tên <span className="text-red-500">*</span></Label>
                <Input
                  id="create-firstName"
                  placeholder="An"
                  value={createForm.firstName}
                  onChange={(e) => setCreateForm({ ...createForm, firstName: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="create-email">Email <span className="text-red-500">*</span></Label>
              <Input
                id="create-email"
                type="email"
                placeholder="user@example.com"
                value={createForm.email}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="create-password">Mật khẩu <span className="text-red-500">*</span></Label>
              <Input
                id="create-password"
                type="password"
                placeholder="Ít nhất 6 ký tự"
                value={createForm.password}
                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Giới tính <span className="text-red-500">*</span></Label>
                <Select
                  value={createForm.gender}
                  onValueChange={(v) => setCreateForm({ ...createForm, gender: v })}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Chọn" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Nam</SelectItem>
                    <SelectItem value="female">Nữ</SelectItem>
                    <SelectItem value="other">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="create-dob">Ngày sinh <span className="text-red-500">*</span></Label>
                <Input
                  id="create-dob"
                  type="date"
                  className="h-10"
                  value={createForm.dateOfBirth}
                  onChange={(e) => setCreateForm({ ...createForm, dateOfBirth: e.target.value })}
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="create-phone">Số điện thoại</Label>
              <Input
                id="create-phone"
                placeholder="0901234567"
                value={createForm.phone}
                onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Vai trò</Label>
              <Select
                value={createForm.role}
                onValueChange={(v) => setCreateForm({ ...createForm, role: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Khách hàng</SelectItem>
                  <SelectItem value="admin">Quản trị viên</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)} disabled={isCreating}>
              Hủy
            </Button>
            <Button onClick={handleCreate} disabled={isCreating}>
              {isCreating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Tạo tài khoản
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog Chỉnh sửa thông tin ──────────────────────────── */}
      <Dialog open={!!editTarget} onOpenChange={() => setEditTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin người dùng</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="edit-lastName">Họ và đệm <span className="text-red-500">*</span></Label>
                <Input
                  id="edit-lastName"
                  value={editForm.lastName}
                  onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="edit-firstName">Tên <span className="text-red-500">*</span></Label>
                <Input
                  id="edit-firstName"
                  value={editForm.firstName}
                  onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit-email">Email <span className="text-red-500">*</span></Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit-phone">Số điện thoại</Label>
              <Input
                id="edit-phone"
                placeholder="0901234567"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Vai trò</Label>
              <Select
                value={editForm.role}
                onValueChange={(v) => setEditForm({ ...editForm, role: v })}
                disabled={editTarget?._id === currentAdmin?._id}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Khách hàng</SelectItem>
                  <SelectItem value="admin">Quản trị viên</SelectItem>
                </SelectContent>
              </Select>
              {editTarget?._id === currentAdmin?._id && (
                <p className="text-xs text-gray-400">Không thể thay đổi vai trò của chính mình.</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)} disabled={isUpdating}>
              Hủy
            </Button>
            <Button onClick={handleUpdate} disabled={isUpdating}>
              {isUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
