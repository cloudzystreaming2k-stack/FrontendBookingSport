import { Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import type { CourtTypeItem, CourtTypeForm } from "./court-type.types";

interface CourtTypeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingType: CourtTypeItem | null;
  form: CourtTypeForm;
  setForm: (form: CourtTypeForm) => void;
  isSaving: boolean;
  onSave: () => void;
}

export function CourtTypeFormDialog({
  open,
  onOpenChange,
  editingType,
  form,
  setForm,
  isSaving,
  onSave,
}: CourtTypeFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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

          {/* Icon */}
          <div className="space-y-2">
            <Label htmlFor="ct-icon">Biểu tượng (Icon - Text/Emoji)</Label>
            <Input
              id="ct-icon"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              placeholder="VD: 🏓 hoặc Cầu lông..."
            />
          </div>

          {/* Color */}
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
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Hủy
          </Button>
          <Button onClick={onSave} disabled={!form.name.trim() || isSaving}>
            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {editingType ? "Cập nhật" : "Thêm mới"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
