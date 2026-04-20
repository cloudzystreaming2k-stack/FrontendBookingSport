import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Calendar, User, ArrowLeft, Loader2 } from "lucide-react";
import api from "../lib/api";

interface NewsArticle {
  _id: string;
  title: string;
  summary: string;
  content: string; // HTML content from Tiptap
  thumbnail: string;
  slug: string;
  author: string;
  category: "news" | "guide" | "health" | "event";
  createdAt: string;
  updatedAt: string;
}

export function NewsDetailPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get category colors based on backend enum
  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      "news": "Tin tức",
      "guide": "Hướng dẫn",
      "health": "Sức khỏe",
      "event": "Sự kiện",
    };
    return labels[category] || category;
  };

  useEffect(() => {
    if (slug) {
      window.scrollTo(0, 0);
      fetchArticle();
    }
  }, [slug]);

  const fetchArticle = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/news/${slug}`);
      setArticle(res.data);
      
      // Fetch related articles (just fetching recent news and filtering out current)
      const relatedRes = await api.get('/news', { params: { limit: 4 } });
      const relatedList = relatedRes.data.news || [];
      setRelatedArticles(relatedList.filter((n: NewsArticle) => n.slug !== slug).slice(0, 3));
    } catch (error) {
      console.error("Lỗi khi tải chi tiết bài viết:", error);
      setArticle(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
     return (
       <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
       </div>
     )
  }

  if (!article) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-4">Không tìm thấy bài viết</h1>
        <p className="text-gray-500 mb-8">Bài viết bạn đang tìm có thể đã bị gỡ hoặc không tồn tại.</p>
        <Link to="/news">
          <Button>Quay lại danh sách tin tức</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <Link to="/news" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors mb-6 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Quay lại danh sách</span>
      </Link>

      {/* Article Header */}
      <div className="mb-6">
        <Badge className="mb-3 bg-blue-100 text-blue-700 hover:bg-blue-200 border-none px-3 py-1 text-sm font-medium">
          {getCategoryLabel(article.category)}
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight text-gray-900">
          {article.title}
        </h1>
        {article.summary && (
           <p className="text-xl text-gray-600 mb-6 italic border-l-4 border-blue-500 pl-4 py-1">
             {article.summary}
           </p>
        )}
        <div className="flex flex-wrap items-center gap-6 text-gray-600 border-b border-gray-100 pb-6">
          <div className="flex items-center gap-2">
            <div className="bg-gray-100 p-2 rounded-full">
              <User className="w-4 h-4 text-gray-700" />
            </div>
            <span className="font-medium">{article.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-gray-100 p-2 rounded-full">
               <Calendar className="w-4 h-4 text-gray-700" />
            </div>
            <span>{new Date(article.createdAt).toLocaleDateString("vi-VN", { year: 'numeric', month: 'long', day: 'numeric'})}</span>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {article.thumbnail && (
        <img
          src={article.thumbnail}
          alt={article.title}
          className="w-full h-[60vh] object-cover rounded-2xl mb-10 shadow-lg"
        />
      )}

      {/* Article Content */}
      <div 
        className="prose prose-lg prose-blue max-w-none mb-16
                   prose-headings:font-bold prose-headings:text-gray-900
                   prose-a:text-blue-600 hover:prose-a:text-blue-500
                   prose-img:rounded-xl prose-img:shadow-md
                   prose-p:text-gray-700 prose-p:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="border-t border-gray-200 pt-12 mt-12 mb-8">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 border-l-4 border-blue-600 pl-4">Bài viết nổi bật khác</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedArticles.map((related) => (
              <Card key={related._id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full group">
                <Link to={`/news/${related.slug}`} className="block relative h-48 overflow-hidden">
                  <img
                    src={related.thumbnail || "https://placehold.co/400x300?text=No+Image"}
                    alt={related.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <Badge className="absolute top-3 left-3 bg-white/90 text-blue-700 hover:bg-white border-none shadow-sm backdrop-blur-sm">
                    {getCategoryLabel(related.category)}
                  </Badge>
                </Link>
                <CardContent className="p-5 flex flex-col flex-1">
                  <Link to={`/news/${related.slug}`}>
                    <h3 className="font-bold text-lg mb-3 hover:text-blue-600 transition-colors line-clamp-3 text-gray-900 leading-snug">
                      {related.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">
                    {related.summary || "Đọc thêm để biết thêm chi tiết..."}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-4 border-t border-gray-50">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(related.createdAt).toLocaleDateString("vi-VN")}</span>
                    <Link to={`/news/${related.slug}`} className="text-blue-600 hover:text-blue-800 font-semibold group-hover:translate-x-1 transition-transform flex items-center">
                      Đọc tiếp <ArrowLeft className="w-3 h-3 ml-1 rotate-180" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
