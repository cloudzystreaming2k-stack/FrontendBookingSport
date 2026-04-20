import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Calendar, User, TrendingUp, ArrowRight, Clock, Loader2 } from "lucide-react";
import api from "../lib/api";

type CategoryKey = "all" | "news" | "guide" | "health" | "event";

// interface matching backend public response
interface NewsArticle {
  _id: string;
  title: string;
  summary: string;
  content: string; // HTML content from Tiptap
  thumbnail: string;
  slug: string;
  author: string;
  category: CategoryKey;
  createdAt: string;
  updatedAt: string;
}

export function NewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");

  const categories: { key: CategoryKey, label: string }[] = [
    { key: "all", label: "Tất cả" },
    { key: "news", label: "Tin tức" },
    { key: "guide", label: "Hướng dẫn" },
    { key: "health", label: "Sức khỏe" },
    { key: "event", label: "Sự kiện" },
  ];

  useEffect(() => {
    fetchNews();
  }, [activeCategory]);

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const params = activeCategory === "all" ? {} : { category: activeCategory };
      const res = await api.get('/news', { params });
      setNews(res.data.news || []);
    } catch (error) {
      console.error("Lỗi khi tải tin tức:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const featuredArticle = news[0];
  const trendingArticles = news.slice(1, 4);
  const latestArticles = news.slice(4);

  // Get category colors based on backend enum
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "news": "bg-blue-500",
      "guide": "bg-green-500",
      "health": "bg-pink-500",
      "event": "bg-purple-500",
    };
    return colors[category] || "bg-gray-500";
  };
  
  const getCategoryLabel = (category: string) => {
     const catInfo = categories.find(c => c.key === category);
     return catInfo ? catInfo.label : category;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Tin tức & Bài viết</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Cập nhật tin tức mới nhất về thể thao, hướng dẫn kỹ thuật và lời khuyên sức khỏe
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-10 justify-center">
          {categories.map((category) => (
            <Button
              key={category.key}
              variant={activeCategory === category.key ? "default" : "outline"}
              onClick={() => setActiveCategory(category.key)}
              className="rounded-full"
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading ? (
           <div className="flex justify-center items-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
           </div>
        ) : (
           <>
              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* Featured Article - Left Column (2/3) */}
                <div className="lg:col-span-2">
                  {featuredArticle && (
                    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 h-full group">
                      <div className="relative h-96 overflow-hidden">
                        <img
                          src={featuredArticle.thumbnail || "https://placehold.co/800x400?text=No+Image"}
                          alt={featuredArticle.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        <Badge
                          className={`absolute top-4 left-4 ${getCategoryColor(featuredArticle.category)} text-white`}
                        >
                          {getCategoryLabel(featuredArticle.category)}
                        </Badge>
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <div className="flex items-center gap-4 text-sm mb-3 text-gray-200">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {featuredArticle.author}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(featuredArticle.createdAt).toLocaleDateString("vi-VN")}
                            </div>
                          </div>
                          <Link to={`/news/${featuredArticle.slug}`}>
                            <h2 className="text-3xl font-bold mb-3 hover:text-blue-300 transition-colors">
                              {featuredArticle.title}
                            </h2>
                          </Link>
                          {featuredArticle.summary && (
                             <p className="text-gray-200 mb-4 line-clamp-2">
                               {featuredArticle.summary}
                             </p>
                          )}
                          <Link to={`/news/${featuredArticle.slug}`}>
                            <Button variant="secondary" className="group/btn mt-2">
                              Đọc thêm
                              <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>

                {/* Trending Articles - Right Column (1/3) */}
                <div className="space-y-4">
                  {trendingArticles.length > 0 && (
                     <div className="flex items-center gap-2 mb-4">
                       <TrendingUp className="w-5 h-5 text-red-500" />
                       <h3 className="text-xl font-bold">Tin tiếp theo</h3>
                     </div>
                  )}
                  {trendingArticles.map((article, index) => (
                    <Card key={article._id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                      <CardContent className="p-0">
                        <Link to={`/news/${article.slug}`}>
                          <div className="flex gap-3 p-4">
                            <div className="flex-shrink-0">
                              <div className="text-3xl font-bold text-gray-200 group-hover:text-blue-500 transition-colors">
                                {String(index + 2).padStart(2, '0')}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <Badge className={`${getCategoryColor(article.category)} text-white text-[10px] py-0 px-2 mb-2`}>
                                {getCategoryLabel(article.category)}
                              </Badge>
                              <h4 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                {article.title}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                {new Date(article.createdAt).toLocaleDateString("vi-VN")}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Latest Articles Section */}
              {latestArticles.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold">Bài viết cũ hơn</h3>
                    <div className="h-1 flex-1 bg-gradient-to-r from-blue-500 to-transparent ml-4 rounded" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {latestArticles.map((article) => (
                      <Card key={article._id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                        <Link to={`/news/${article.slug}`}>
                           <div className="relative h-48 overflow-hidden">
                             <img
                               src={article.thumbnail || "https://placehold.co/400x300?text=No+Image"}
                               alt={article.title}
                               className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                             />
                             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                             <Badge
                               className={`absolute top-3 left-3 ${getCategoryColor(article.category)} text-white`}
                             >
                               {getCategoryLabel(article.category)}
                             </Badge>
                           </div>
                        </Link>
                        <CardContent className="p-5">
                          <Link to={`/news/${article.slug}`}>
                            <h4 className="font-semibold text-lg mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                              {article.title}
                            </h4>
                          </Link>
                          {article.summary && (
                             <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                               {article.summary}
                             </p>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                <span className="line-clamp-1 max-w-[100px]">{article.author}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(article.createdAt).toLocaleDateString("vi-VN")}
                              </div>
                            </div>
                          </div>
                          <Link to={`/news/${article.slug}`} className="mt-4 block">
                            <Button variant="ghost" size="sm" className="w-full group/btn">
                              Đọc thêm
                              <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results Message */}
              {news.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-gray-400 mb-4">
                    <Calendar className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Chưa có bài viết nào
                  </h3>
                  <p className="text-gray-500">
                    Không tìm thấy bài viết trong danh mục này.
                  </p>
                </div>
              )}
           </>
        )}
      </div>
    </div>
  );
}
