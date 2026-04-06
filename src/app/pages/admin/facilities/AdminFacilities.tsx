import {
  Plus, Pencil, Trash2, Search,
  RefreshCw, Loader2, Link2,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "../../../components/ui/alert-dialog";
import { Input } from "../../../components/ui/input";

import { useFacilities } from "./useFacilities";
import { FacilityFormDialog } from "./FacilityFormDialog";

export function AdminFacilities() {
  const {
    facilities,
    filteredFacilities,
    isLoading,
    searchQuery,
    setSearchQuery,
    isDialogOpen,
    setIsDialogOpen,
    editingFacility,
    form,
    setForm,
    isSaving,
    deleteTarget,
    setDeleteTarget,
    isDeleting,
    fetchFacilities,
    openAdd,
    openEdit,
    handleSave,
    handleDelete
  } = useFacilities();

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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
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
                      className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl shadow-sm"
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
      <FacilityFormDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingFacility={editingFacility}
        form={form}
        setForm={setForm}
        onSave={handleSave}
        isSaving={isSaving}
      />

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
