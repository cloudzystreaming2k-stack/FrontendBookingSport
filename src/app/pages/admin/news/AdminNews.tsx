import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Eye, Search, Filter, X, Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { RichTextEditor } from "../../../components/ui/RichTextEditor";
import { toast } from "sonner";
import { adminNewsService, NewsArticle } from "./adminNewsService";

export function AdminNews() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Form State
  const [form, setForm] = useState<Partial<NewsArticle>>({
    title: "",
    summary: "",
    thumbnail: "",
    content: "",
    category: "news",
    status: "draft",
    author: ""
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = {
        limit: "8",
        page: currentPage.toString()
      };
      if (filterCategory !== "all") params.category = filterCategory;
      if (filterStatus !== "all") params.status = filterStatus;
      if (searchQuery) params.search = searchQuery;

      const res = await adminNewsService.getNews(params);
      setNews(res.news);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (error) {
      toast.error("Không thể tải danh sách tin tức");
    } finally {
      setIsLoading(false);
    }
  }, [filterCategory, filterStatus, searchQuery, currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const clearFilters = () => {
    setSearchQuery("");
    setFilterCategory("all");
    setFilterStatus("all");
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery !== "" || filterCategory !== "all" || filterStatus !== "all";

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc muốn xóa bài viết này?")) {
      try {
        await adminNewsService.deleteNews(id);
        toast.success("Xóa bài viết thành công!");
        fetchData();
      } catch (error) {
        toast.error("Lỗi khi xóa bài viết");
      }
    }
  };

  const handleEdit = (article: NewsArticle) => {
    setEditingArticle(article);
    setForm({
      title: article.title,
      summary: article.summary,
      thumbnail: article.thumbnail,
      content: article.content,
      category: article.category,
      status: article.status,
      author: article.author
    });
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingArticle(null);
    setForm({
      title: "",
      summary: "",
      thumbnail: "",
      content: "",
      category: "news",
      status: "draft",
      author: ""
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.content) {
      toast.error("Vui lòng nhập Tiêu đề và Nội dung bài viết.");
      return;
    }

    setIsSaving(true);
    try {
      if (editingArticle) {
        await adminNewsService.updateNews(editingArticle._id, form);
        toast.success("Cập nhật bài viết thành công!");
      } else {
        await adminNewsService.createNews(form);
        toast.success("Tạo bài viết thành công!");
      }
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lưu bài viết.");
    } finally {
      setIsSaving(false);
    }
  };

  // Helper function to get category label/color
  const getCategoryInfo = (category: string) => {
    switch (category) {
      case "news":
        return { label: "Tin tức", color: "bg-blue-100 text-blue-700 border-blue-300" };
      case "guide":
        return { label: "Hướng dẫn", color: "bg-purple-100 text-purple-700 border-purple-300" };
      case "health":
        return { label: "Sức khỏe", color: "bg-green-100 text-green-700 border-green-300" };
      case "event":
        return { label: "Sự kiện", color: "bg-orange-100 text-orange-700 border-orange-300" };
      default:
        return { label: "Không rõ", color: "bg-gray-100 text-gray-700 border-gray-300" };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản lý tin tức</h2>
          <p className="text-gray-600">Quản lý bài viết và nội dung website</p>
        </div>
        <Button onClick={handleAdd} className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700">
          <Plus className="w-4 h-4 mr-2" />
          Thêm bài viết
        </Button>

        {/* Dialog Thêm/Sửa */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="!w-[95vw] !max-w-[1300px] max-h-[90vh] overflow-y-auto">
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
                <Label htmlFor="title">Tiêu đề <span className="text-red-500">*</span></Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Tiêu đề bài viết"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Mô tả ngắn (Summary)</Label>
                <Input
                  id="summary"
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  placeholder="Mô tả tóm tắt..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Danh mục <span className="text-red-500">*</span></Label>
                  <Select value={form.category} onValueChange={(v: any) => setForm({ ...form, category: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="news">Tin tức</SelectItem>
                      <SelectItem value="guide">Hướng dẫn</SelectItem>
                      <SelectItem value="health">Sức khỏe</SelectItem>
                      <SelectItem value="event">Sự kiện</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Trạng thái <span className="text-red-500">*</span></Label>
                  <Select value={form.status} onValueChange={(v: any) => setForm({ ...form, status: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Xuất bản</SelectItem>
                      <SelectItem value="draft">Bản nháp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author">Tác giả</Label>
                  <Input
                    id="author"
                    value={form.author || ""}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    placeholder="Tên tác giả bài viết (Mặc định: Admin)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thumbnail">URL Ảnh đại diện (Thumbnail)</Label>
                  <Input
                    id="thumbnail"
                    value={form.thumbnail}
                    onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              {form.thumbnail && (
                <img src={form.thumbnail} alt="Thumbnail preview" className="h-32 object-cover rounded border border-gray-200" />
              )}

              <div className="space-y-2">
                <Label htmlFor="content">Nội dung <span className="text-red-500">*</span></Label>
                <div className="border rounded-md">
                  <RichTextEditor
                    content={form.content || ""}
                    onChange={(html) => setForm({ ...form, content: html })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t mt-6">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
                  Hủy
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingArticle ? "Cập nhật" : "Xuất bản"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search & Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm theo tiêu đề..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                <SelectItem value="news">Tin tức</SelectItem>
                <SelectItem value="guide">Hướng dẫn</SelectItem>
                <SelectItem value="health">Sức khỏe</SelectItem>
                <SelectItem value="event">Sự kiện</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="published">Xuất bản</SelectItem>
                <SelectItem value="draft">Bản nháp</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters} className="w-full md:w-auto">
                <X className="w-4 h-4 mr-2" /> Xóa bộ lọc
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Hiển thị <span className="font-semibold text-teal-600">{news.length}</span> bài viết
        </p>
      </div>

      {/* News Table */}
      {isLoading ? (
        <Card>
          <CardContent className="p-12 text-center text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" />
            Đang tải dữ liệu...
          </CardContent>
        </Card>
      ) : news.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">STT</TableHead>
                  <TableHead className="w-24">Hình ảnh</TableHead>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead className="w-32">Danh mục</TableHead>
                  <TableHead className="w-32">Tác giả</TableHead>
                  <TableHead className="w-32">Trạng thái</TableHead>
                  <TableHead className="w-32">Ngày tạo</TableHead>
                  <TableHead className="w-32">Ngày cập nhật</TableHead>
                  <TableHead className="w-32 text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {news.map((article, index) => {
                  const catInfo = getCategoryInfo(article.category);
                  return (
                    <TableRow key={article._id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <img
                          src={article.thumbnail || "https://placehold.co/150x100?text=No+Image"}
                          alt={article.title}
                          className="w-16 h-12 object-cover rounded border-2 border-gray-200 shadow-sm"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="max-w-lg">
                          <p className="font-semibold line-clamp-1">{article.title}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">{article.summary || "..."}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={catInfo.color} variant="outline">
                          {catInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{article.author}</TableCell>
                      <TableCell>
                        <Badge
                          variant={article.status === "published" ? "default" : "secondary"}
                          className={article.status === "published" ? "bg-emerald-100 text-emerald-700 border-emerald-300" : "bg-amber-100 text-amber-700 border-amber-300"}
                        >
                          {article.status === "published" ? "Xuất bản" : "Bản nháp"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(article.createdAt).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(article.updatedAt).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost" size="sm"
                            onClick={() => handleEdit(article)}
                            title="Sửa"
                            className="hover:bg-teal-50 hover:text-teal-600"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost" size="sm"
                            onClick={() => handleDelete(article._id)}
                            title="Xóa"
                            className="hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center p-4 border-t gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Trang trước
                </Button>
                <div className="text-sm text-gray-600 font-medium">
                  Trang {currentPage} / {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Trang sau
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-12">
            <div className="text-center text-gray-500">
              Không tìm thấy bài viết nào phù hợp với bộ lọc của bạn.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}