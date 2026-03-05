import { useState } from "react";
import { Star, Eye, CheckCircle, XCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { mockReviews, mockCourts } from "../../data/mockData";

export function AdminReviews() {
  const [reviews, setReviews] = useState(mockReviews);
  const [filter, setFilter] = useState("all");

  const filteredReviews = reviews.filter((review) => {
    if (filter === "all") return true;
    return review.status === filter;
  });

  const getCourtName = (courtId: string) => {
    return mockCourts.find((c) => c.id === courtId)?.name || "N/A";
  };

  const handleApprove = (id: string) => {
    setReviews(
      reviews.map((r) =>
        r.id === id ? { ...r, status: "approved" as const } : r
      )
    );
  };

  const handleReject = (id: string) => {
    if (confirm("Bạn có chắc muốn từ chối đánh giá này?")) {
      setReviews(
        reviews.map((r) =>
          r.id === id ? { ...r, status: "rejected" as const } : r
        )
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "approved":
        return "Đã duyệt";
      case "pending":
        return "Chờ duyệt";
      case "rejected":
        return "Đã từ chối";
      default:
        return status;
    }
  };

  const totalReviews = reviews.length;
  const pendingReviews = reviews.filter((r) => r.status === "pending").length;
  const approvedReviews = reviews.filter((r) => r.status === "approved").length;
  const rejectedReviews = reviews.filter((r) => r.status === "rejected").length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Quản lý đánh giá</h2>
        <p className="text-gray-600">Quản lý đánh giá từ khách hàng</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tổng đánh giá</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalReviews}</div>
            <p className="text-sm text-gray-600 mt-1">đánh giá</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Chờ duyệt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{pendingReviews}</div>
            <p className="text-sm text-gray-600 mt-1">đánh giá</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Đã duyệt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{approvedReviews}</div>
            <p className="text-sm text-gray-600 mt-1">đánh giá</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Đã từ chối</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{rejectedReviews}</div>
            <p className="text-sm text-gray-600 mt-1">đánh giá</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex gap-2 items-center">
        <span className="text-sm text-gray-600">Lọc theo:</span>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="pending">Chờ duyệt</SelectItem>
            <SelectItem value="approved">Đã duyệt</SelectItem>
            <SelectItem value="rejected">Đã từ chối</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reviews Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 text-sm font-semibold">Người dùng</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Sân</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Đánh giá</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Nhận xét</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Trạng thái</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Ngày tạo</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.map((review) => (
                  <tr key={review.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-blue-600">
                            {review.userName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{review.userName}</div>
                          <div className="text-xs text-gray-500">{review.userId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {getCourtName(review.courtId)}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="ml-1 font-semibold">{review.rating}.0</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm max-w-xs">
                      <div className="line-clamp-2">{review.comment}</div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <Badge className={getStatusColor(review.status)}>
                        {getStatusLabel(review.status)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                      <div className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleTimeString("vi-VN")}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" title="Xem chi tiết">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {review.status !== "approved" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApprove(review.id)}
                            title="Phê duyệt"
                          >
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </Button>
                        )}
                        {review.status !== "rejected" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReject(review.id)}
                            title="Từ chối"
                          >
                            <XCircle className="w-4 h-4 text-red-600" />
                          </Button>
                        )}
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
