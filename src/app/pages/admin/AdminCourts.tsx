import { useState } from "react";
import { Plus, Image as ImageIcon, Wrench, Pencil, Trash2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { mockCourts } from "../../data/mockData";

export function AdminCourts() {
  const [courts, setCourts] = useState(mockCourts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourt, setEditingCourt] = useState<any>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredCourts = courts.filter((court) => {
    const matchesSearch = searchQuery === "" || 
      court.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      court.code?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === "all" || court.type === typeFilter;
    const matchesStatus = statusFilter === "all" || court.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleEdit = (court: any) => {
    setEditingCourt(court);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingCourt(null);
    setIsDialogOpen(true);
  };

  const handleDelete = (e: React.MouseEvent, courtId: string) => {
    e.stopPropagation(); // Ngăn không cho trigger onClick của row
    if (window.confirm('Bạn có chắc chắn muốn xóa sân này?')) {
      setCourts(courts.filter(court => court.id !== courtId));
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setTypeFilter("all");
    setStatusFilter("all");
  };

  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      'pickleball': 'Pickleball',
      'badminton': 'Cầu Lông',
      'basketball': 'Bóng Đá',
      'tennis': 'Tennis',
      'volleyball': 'Bóng chuyền'
    };
    return typeMap[type] || type;
  };

  const getTypeIcon = (type: string) => {
    const iconMap: Record<string, string> = {
      'pickleball': '🏓',
      'badminton': '🏸',
      'basketball': '🏀',
      'tennis': '🎾',
      'volleyball': '🏐'
    };
    return iconMap[type] || '⚽';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Danh Sách Sân</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Thêm Sân Mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCourt ? "Chỉnh sửa sân" : "Thêm sân mới"}
              </DialogTitle>
              <DialogDescription>
                {editingCourt ? "Cập nhật thông tin sân thể thao" : "Thêm sân thể thao mới vào hệ thống"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Mã sân *</Label>
                  <Input
                    id="code"
                    defaultValue={editingCourt?.code}
                    placeholder="VD: CL01"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Loại sân *</Label>
                  <Select defaultValue={editingCourt?.type}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại sân" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pickleball">Pickleball</SelectItem>
                      <SelectItem value="badminton">Cầu lông</SelectItem>
                      <SelectItem value="basketball">Bóng rổ</SelectItem>
                      <SelectItem value="tennis">Tennis</SelectItem>
                      <SelectItem value="volleyball">Bóng chuyền</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Tên sân *</Label>
                <Input
                  id="name"
                  defaultValue={editingCourt?.name}
                  placeholder="VD: Sân Cầu Lông Số 1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  defaultValue={editingCourt?.description}
                  placeholder="Mô tả về sân..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Sức chứa (người) *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    defaultValue={editingCourt?.capacity}
                    placeholder="VD: 4"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="openingHours">Thời gian mở cửa *</Label>
                  <Input
                    id="openingHours"
                    defaultValue={editingCourt?.openingHours}
                    placeholder="VD: 06:00 - 22:00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ *</Label>
                <Input
                  id="address"
                  defaultValue={editingCourt?.address}
                  placeholder="Địa chỉ đầy đủ"
                />
              </div>

              <div className="space-y-2">
                <Label>Ảnh sân</Label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  <Input type="file" accept="image/*" multiple className="mb-2" />
                  <p className="text-sm text-gray-500">
                    Kéo thả hoặc click để tải ảnh lên
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Bảng giá (VNĐ/giờ)</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="morning" className="text-xs">
                      Sáng (6h-12h)
                    </Label>
                    <Input
                      id="morning"
                      type="number"
                      defaultValue={editingCourt?.pricing.morning}
                      placeholder="150000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="afternoon" className="text-xs">
                      Chiều (12h-18h)
                    </Label>
                    <Input
                      id="afternoon"
                      type="number"
                      defaultValue={editingCourt?.pricing.afternoon}
                      placeholder="180000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="evening" className="text-xs">
                      Tối (18h-22h)
                    </Label>
                    <Input
                      id="evening"
                      type="number"
                      defaultValue={editingCourt?.pricing.evening}
                      placeholder="250000"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>
                  {editingCourt ? "Cập nhật" : "Thêm mới"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Tìm kiếm theo tên, mã sân..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
        
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Tất Cả Loại" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất Cả Loại</SelectItem>
            <SelectItem value="pickleball">Pickleball</SelectItem>
            <SelectItem value="badminton">Cầu Lông</SelectItem>
            <SelectItem value="basketball">Bóng Rổ</SelectItem>
            <SelectItem value="tennis">Tennis</SelectItem>
            <SelectItem value="volleyball">Bóng chuyền</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Tất Cả Trạng Thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất Cả Trạng Thái</SelectItem>
            <SelectItem value="active">Hoạt Động</SelectItem>
            <SelectItem value="maintenance">Bảo Trì</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          variant="outline" 
          onClick={clearFilters}
          className="gap-2"
        >
          <Wrench className="w-4 h-4" />
          Xóa Bộ Lọc
        </Button>
      </div>

      {/* Courts Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">ẢNH</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">MÃ SÂN</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">TÊN SÂN</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">LOẠI</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">SỨC CHỨA</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">THỜI GIAN</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">TRẠNG THÁI</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourts.map((court) => (
                  <tr 
                    key={court.id} 
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      {court.images && court.images.length > 0 ? (
                        <img
                          src={court.images[0]}
                          alt={court.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-blue-400" />
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold">{court.code || court.id}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold">{court.name}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">
                        {court.description}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getTypeIcon(court.type)}</span>
                        <span>{getTypeLabel(court.type)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>{court.capacity || 0} người</div>
                    </td>
                    <td className="py-3 px-4">
                      <div>{court.openingHours || '06:00 - 22:00'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge 
                        className={
                          court.status === 'active'
                            ? 'bg-green-100 text-green-800 hover:bg-green-100'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                        }
                      >
                        {court.status === 'active' ? 'Hoạt Động' : 'Bảo Trì'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(court);
                          }}
                          className="hover:bg-blue-50 text-blue-600"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleDelete(e, court.id)}
                          className="hover:bg-red-50 text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}