import api from '../../../lib/api';

export interface NewsArticle {
  _id: string;
  title: string;
  summary: string;
  content: string;
  thumbnail: string;
  slug: string;
  author: string;
  category: 'news' | 'guide' | 'health' | 'event';
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export interface NewsResponse {
  news: NewsArticle[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const adminNewsService = {
  getNews: async (params: { page?: number; limit?: number; status?: string; category?: string; search?: string }) => {
    const response = await api.get<NewsResponse>('/admin/news', { params });
    return response.data;
  },

  getNewsById: async (id: string) => {
    const response = await api.get<NewsArticle>(`/admin/news/${id}`);
    return response.data;
  },

  createNews: async (data: Partial<NewsArticle>) => {
    const response = await api.post<NewsArticle>('/admin/news', data);
    return response.data;
  },

  updateNews: async (id: string, data: Partial<NewsArticle>) => {
    const response = await api.put<NewsArticle>(`/admin/news/${id}`, data);
    return response.data;
  },

  deleteNews: async (id: string) => {
    const response = await api.delete<{ message: string }>(`/admin/news/${id}`);
    return response.data;
  },
};
