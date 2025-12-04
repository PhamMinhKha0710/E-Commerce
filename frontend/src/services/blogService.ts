import apiClient from '@/lib/apiClient';

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: string;
  publishedDate: string;
  category: string;
  tags: string[];
  isHighlighted?: boolean;
  viewCount?: number;
  commentCount?: number;
}

export interface BlogPostDetail extends BlogPost {
  updatedDate?: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  comments: BlogComment[];
  relatedPosts: BlogPost[];
}

export interface BlogComment {
  id: number;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  postCount?: number;
}

export interface PaginatedBlogPosts {
  posts: BlogPost[];
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  pageSize: number;
}

class BlogService {
  private baseUrl = '/api/blog';

  async getPosts(params: {
    page?: number;
    pageSize?: number;
    category?: string;
    tag?: string;
    searchTerm?: string;
    onlyPublished?: boolean;
    onlyHighlighted?: boolean;
  } = {}): Promise<PaginatedBlogPosts> {
    const response = await apiClient.get<PaginatedBlogPosts>(this.baseUrl, { params });
    return response.data;
  }

  async getPostBySlug(slug: string): Promise<BlogPostDetail> {
    const response = await apiClient.get<BlogPostDetail>(`${this.baseUrl}/${slug}`);
    return response.data;
  }

  async getCategories(onlyActive: boolean = true): Promise<BlogCategory[]> {
    const response = await apiClient.get<BlogCategory[]>(`${this.baseUrl}/categories`, {
      params: { onlyActive }
    });
    return response.data;
  }

  async getHighlightedPosts(pageSize: number = 6): Promise<PaginatedBlogPosts> {
    const response = await apiClient.get<PaginatedBlogPosts>(`${this.baseUrl}/highlighted`, {
      params: { pageSize }
    });
    return response.data;
  }
}

export const blogService = new BlogService();
export default blogService;

