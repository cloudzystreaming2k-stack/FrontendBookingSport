import { useParams, Link } from "react-router";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { mockNews } from "../data/mockData";
import { Calendar, User, ArrowLeft } from "lucide-react";

export function NewsDetailPage() {
  const { id } = useParams();
  const article = mockNews.find((n) => n.id === id);
  const relatedArticles = mockNews.filter((n) => n.id !== id).slice(0, 3);

  if (!article) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Không tìm thấy bài viết</h1>
        <Link to="/news">
          <Button>Quay lại danh sách tin tức</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <Link to="/news" className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" />
        Quay lại danh sách
      </Link>

      {/* Article Header */}
      <div className="mb-6">
        <Badge className="mb-3">{article.category}</Badge>
        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
        <div className="flex items-center gap-4 text-gray-600">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <span>{article.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <span>{new Date(article.createdAt).toLocaleDateString("vi-VN")}</span>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <img
        src={article.image}
        alt={article.title}
        className="w-full h-96 object-cover rounded-lg mb-8"
      />

      {/* Article Content */}
      <div className="prose prose-lg max-w-none mb-12">
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {article.content}
        </p>
        <p className="text-gray-700 leading-relaxed mt-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        <p className="text-gray-700 leading-relaxed mt-4">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <h2 className="text-2xl font-bold mt-8 mb-4">Lợi ích</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Cải thiện sức khỏe tim mạch</li>
          <li>Tăng cường sự linh hoạt và phản xạ</li>
          <li>Giảm stress và cải thiện tinh thần</li>
          <li>Tạo cơ hội giao lưu, kết nối với cộng đồng</li>
        </ul>
        <p className="text-gray-700 leading-relaxed mt-6">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
        </p>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="border-t pt-12">
          <h2 className="text-2xl font-bold mb-6">Bài viết liên quan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((related) => (
              <Card key={related.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={related.image}
                  alt={related.title}
                  className="w-full h-40 object-cover"
                />
                <CardContent className="p-4">
                  <Badge className="mb-2 text-xs">{related.category}</Badge>
                  <Link to={`/news/${related.id}`}>
                    <h3 className="font-semibold mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                      {related.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {related.content}
                  </p>
                  <Link to={`/news/${related.id}`}>
                    <span className="text-blue-600 hover:underline text-sm">
                      Đọc thêm →
                    </span>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
