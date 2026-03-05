import { useState } from "react";
import { Plus, Pencil, Trash2, Calendar } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { mockPromotions } from "../../data/mockData";

export function AdminPromotions() {
  const [promotions, setPromotions] = useState(mockPromotions);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<any>(null);

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc muốn xóa khuyến mãi này?")) {
      setPromotions(promotions.filter((p) => p.id !== id));
    }
  };

  const handleEdit = (promo: any) => {
    setEditingPromo(promo);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingPromo(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Quản lý khuyến mãi</h2>
          <p className="text-gray-600">Tạo và quản lý mã khuyến mãi</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm khuyến mãi
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingPromo ? "Chỉnh sửa khuyến mãi" : "Thêm khuyến mãi mới"}
              </DialogTitle>
              <DialogDescription>
                {editingPromo ? "Cập nhật thông tin khuyến mãi" : "Tạo mã khuyến mãi mới cho khách hàng"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="code">Mã khuyến mãi *</Label>
                <Input
                  id="code"
                  defaultValue={editingPromo?.code}
                  placeholder="VD: NEWUSER10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả *</Label>
                <Textarea
                  id="description"
                  defaultValue={editingPromo?.description}
                  placeholder="Mô tả về khuyến mãi..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount">Giảm giá (%) *</Label>
                <Input
                  id="discount"
                  type="number"
                  defaultValue={editingPromo?.discount}
                  placeholder="10"
                  min="0"
                  max="100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="validFrom">Từ ngày *</Label>
                  <Input
                    id="validFrom"
                    type="date"
                    defaultValue={editingPromo?.validFrom}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validTo">Đến ngày *</Label>
                  <Input
                    id="validTo"
                    type="date"
                    defaultValue={editingPromo?.validTo}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>
                  {editingPromo ? "Cập nhật" : "Thêm mới"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Promotions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promo) => (
          <Card key={promo.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {promo.code}
                  </div>
                  <Badge variant={promo.status === "active" ? "default" : "secondary"}>
                    {promo.status === "active" ? "Đang hoạt động" : "Hết hạn"}
                  </Badge>
                </div>
                <div className="text-3xl font-bold text-green-600">
                  -{promo.discount}%
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4">{promo.description}</p>

              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(promo.validFrom).toLocaleDateString("vi-VN")} -{" "}
                  {new Date(promo.validTo).toLocaleDateString("vi-VN")}
                </span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEdit(promo)}
                >
                  <Pencil className="w-4 h-4 mr-1" />
                  Sửa
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(promo.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}