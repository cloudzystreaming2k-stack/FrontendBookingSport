import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { courtTypeApi } from "./court-type.api";
import { defaultForm, type CourtTypeItem, type CourtTypeForm } from "./court-type.types";

export function useCourtTypes() {
  // ─── List state ───────────────────────────────────────────────
  const [courtTypes, setCourtTypes] = useState<CourtTypeItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // ─── Dialog thêm/sửa ──────────────────────────────────────────
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<CourtTypeItem | null>(null);
  const [form, setForm] = useState<CourtTypeForm>(defaultForm);
  const [isSaving, setIsSaving] = useState(false);

  // ─── Dialog xóa ───────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState<CourtTypeItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ─── Computed ─────────────────────────────────────────────────
  const filteredTypes = courtTypes.filter((ct) =>
    ct.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalCourts = courtTypes.reduce((sum, ct) => sum + (ct.courtCount || 0), 0);

  // ─── Fetch ────────────────────────────────────────────────────
  const fetchCourtTypes = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await courtTypeApi.getAll();
      setCourtTypes(data);
    } catch {
      toast.error("Không thể tải danh sách loại sân.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchCourtTypes(); }, [fetchCourtTypes]);

  // ─── Open Dialog handlers ──────────────────────────────────────
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
        await courtTypeApi.update(editingType._id, form);
        toast.success(`Đã cập nhật "${form.name}" thành công.`);
      } else {
        await courtTypeApi.create(form);
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
      await courtTypeApi.remove(deleteTarget._id);
      toast.success(`Đã xóa loại sân "${deleteTarget.name}".`);
      setDeleteTarget(null);
      fetchCourtTypes();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không thể xóa loại sân.");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    // list
    courtTypes,
    isLoading,
    searchQuery,
    setSearchQuery,
    filteredTypes,
    totalCourts,
    fetchCourtTypes,
    // add/edit dialog
    isDialogOpen,
    setIsDialogOpen,
    editingType,
    form,
    setForm,
    isSaving,
    openAdd,
    openEdit,
    handleSave,
    // delete dialog
    deleteTarget,
    setDeleteTarget,
    isDeleting,
    handleDelete,
  };
}
