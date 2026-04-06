import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { FacilityItem, FacilityForm, defaultFacilityForm } from "./facility";
import { facilityService } from "./facility.service";

export function useFacilities() {
  const [facilities, setFacilities] = useState<FacilityItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<FacilityItem | null>(null);
  const [form, setForm] = useState<FacilityForm>(defaultFacilityForm);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<FacilityItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchFacilities = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await facilityService.getFacilities();
      setFacilities(data);
    } catch {
      toast.error("Không thể tải danh sách tiện ích.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFacilities();
  }, [fetchFacilities]);

  const filteredFacilities = facilities.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAdd = () => {
    setEditingFacility(null);
    setForm(defaultFacilityForm);
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

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Tên tiện ích không được để trống.");
      return;
    }
    setIsSaving(true);
    try {
      if (editingFacility) {
        await facilityService.updateFacility(editingFacility._id, form);
        toast.success(`Đã cập nhật "${form.name}" thành công.`);
      } else {
        await facilityService.createFacility(form);
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

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await facilityService.deleteFacility(deleteTarget._id);
      toast.success(`Đã xóa tiện ích "${deleteTarget.name}".`);
      setDeleteTarget(null);
      fetchFacilities();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không thể xóa tiện ích.");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
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
  };
}
