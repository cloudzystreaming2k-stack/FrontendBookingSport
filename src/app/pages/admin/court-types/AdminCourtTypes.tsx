import { Plus, Search, Building2, RefreshCw, Pencil, Trash2, Loader2, Users } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { useCourtTypes } from "./useCourtTypes";
import { CourtTypeFormDialog } from "./CourtTypeFormDialog";
import { DeleteCourtTypeDialog } from "./DeleteCourtTypeDialog";

export function AdminCourtTypes() {
  const {
    courtTypes, isLoading, searchQuery, setSearchQuery,
    filteredTypes, totalCourts, fetchCourtTypes,
    isDialogOpen, setIsDialogOpen, editingType, form, setForm, isSaving,
    openAdd, openEdit, handleSave,
    deleteTarget, setDeleteTarget, isDeleting, handleDelete,
  } = useCourtTypes();

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
                    <span>{ct.minPlayers}–{ct.maxPlayers} người</span>
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

      {/* Dialogs */}
      <CourtTypeFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingType={editingType}
        form={form}
        setForm={setForm}
        isSaving={isSaving}
        onSave={handleSave}
      />

      <DeleteCourtTypeDialog
        target={deleteTarget}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}