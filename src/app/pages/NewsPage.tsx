import { Link } from "react-router";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { mockNews } from "../data/mockData";
import { Calendar, User } from "lucide-react";

export function NewsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Tin tức & Bài viết</h1>
        <p className="text-gray-600 text-lg">
          Cập nhật tin tức mới nhất về thể thao và sân chơi
        </p>
      </div>

      {/* Featured Article */}
      {mockNews.length > 0 && (
        <Card className="overflow-hidden mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <img
              src={mockNews[0].image}
              alt={mockNews[0].title}
              className="w-full h-64 md:h-full object-cover"
            />
            <CardContent className="p-8 flex flex-col justify-center">
              <Badge className="w-fit mb-3">{mockNews[0].category}</Badge>
              <Link to={`/news/${mockNews[0].id}`}>
                <h2 className="text-3xl font-bold mb-4 hover:text-blue-600 transition-colors">
                  {mockNews[0].title}
                </h2>
              </Link>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {mockNews[0].content}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {mockNews[0].author}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(mockNews[0].createdAt).toLocaleDateString("vi-VN")}
                </div>
              </div>
              <Link to={`/news/${mockNews[0].id}`}>
                <span className="text-blue-600 hover:underline mt-4 inline-block">
                  Đọc thêm →
                </span>
              </Link>
            </CardContent>
          </div>
        </Card>
      )}

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockNews.slice(1).map((article) => (
          <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-48 object-cover"
            />
            <CardContent className="p-5">
              <Badge className="mb-2">{article.category}</Badge>
              <Link to={`/news/${article.id}`}>
                <h3 className="font-semibold text-lg mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                  {article.title}
                </h3>
              </Link>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {article.content}
              </p>
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {article.author}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(article.createdAt).toLocaleDateString("vi-VN")}
                </div>
              </div>
              <Link to={`/news/${article.id}`}>
                <span className="text-blue-600 hover:underline text-sm">
                  Đọc thêm →
                </span>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
