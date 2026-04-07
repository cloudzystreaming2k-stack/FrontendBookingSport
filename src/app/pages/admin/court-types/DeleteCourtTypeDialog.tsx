import { Loader2 } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "../../../components/ui/alert-dialog";
import type { CourtTypeItem } from "./court-type.types";

interface DeleteCourtTypeDialogProps {
  target: CourtTypeItem | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteCourtTypeDialog({
  target,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteCourtTypeDialogProps) {
  return (
    <AlertDialog open={!!target} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa loại sân</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc muốn xóa loại sân{" "}
            <span className="font-semibold">{target?.name}</span>?{" "}
            <span className="text-red-600">Hành động này không thể hoàn tác.</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Xóa loại sân
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
