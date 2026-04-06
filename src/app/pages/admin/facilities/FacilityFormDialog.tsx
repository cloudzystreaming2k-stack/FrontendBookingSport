import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { FacilityForm, FacilityItem } from "./facility";

interface FacilityFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingFacility: FacilityItem | null;
  form: FacilityForm;
  setForm: (form: FacilityForm) => void;
  onSave: () => void;
  isSaving: boolean;
}

export function FacilityFormDialog({
  isOpen,
  onOpenChange,
  editingFacility,
  form,
  setForm,
  onSave,
  isSaving
}: FacilityFormDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value })}
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, icon: e.target.value })}
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, description: e.target.value })}
              placeholder="VD: Có tính thêm phí 10.000đ/lần"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Hủy
          </Button>
          <Button onClick={onSave} disabled={!form.name.trim() || isSaving} className="bg-blue-600 hover:bg-blue-700">
            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {editingFacility ? "Lưu thay đổi" : "Tạo tiện ích"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
