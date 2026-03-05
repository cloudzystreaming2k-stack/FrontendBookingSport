import { useState } from "react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { mockNews } from "../../data/mockData";

export function AdminNews() {
  const [news, setNews] = useState(mockNews);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any>(null);

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc muốn xóa bài viết này?")) {
      setNews(news.filter((n) => n.id !== id));
    }
  };

  const handleEdit = (article: any) => {
    setEditingArticle(article);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingArticle(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Quản lý tin tức</h2>
          <p className="text-gray-600">Quản lý bài viết và nội dung</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm bài viết
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingArticle ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
              </DialogTitle>
              <DialogDescription>
                {editingArticle ? "Cập nhật thông tin bài viết" : "Tạo bài viết tin tức mới"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề *</Label>
                <Input
                  id="title"
                  defaultValue={editingArticle?.title}
                  placeholder="Tiêu đề bài viết"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Danh mục *</Label>
                <Select defaultValue={editingArticle?.category}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tin tức">Tin tức</SelectItem>
                    <SelectItem value="Hướng dẫn">Hướng dẫn</SelectItem>
                    <SelectItem value="Sức khỏe">Sức khỏe</SelectItem>
                    <SelectItem value="Sự kiện">Sự kiện</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Nội dung *</Label>
                <Textarea
                  id="content"
                  defaultValue={editingArticle?.content}
                  placeholder="Nội dung bài viết..."
                  rows={10}
                />
              </div>

              <div className="space-y-2">
                <Label>Ảnh đại diện</Label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  <Input type="file" accept="image/*" className="mb-2" />
                  <p className="text-sm text-gray-500">
                    Kéo thả hoặc click để tải ảnh lên
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Tác giả</Label>
                <Input
                  id="author"
                  defaultValue={editingArticle?.author || "Admin"}
                  placeholder="Tên tác giả"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>
                  {editingArticle ? "Cập nhật" : "Xuất bản"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* News List */}
      <div className="grid grid-cols-1 gap-4">
        {news.map((article) => (
          <Card key={article.id}>
            <CardContent className="p-5">
              <div className="flex gap-4">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-40 h-28 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{article.title}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge>{article.category}</Badge>
                        <span className="text-sm text-gray-500">
                          Bởi {article.author}
                        </span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-500">
                          {new Date(article.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" title="Xem">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(article)}
                        title="Sửa"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(article.id)}
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {article.content}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}