import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5130';

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
  private baseUrl = `${API_BASE_URL}/api/blog`;

  async getPosts(params: {
    page?: number;
    pageSize?: number;
    category?: string;
    tag?: string;
    searchTerm?: string;
    onlyPublished?: boolean;
    onlyHighlighted?: boolean;
  } = {}): Promise<PaginatedBlogPosts> {
    try {
      const response = await axios.get<PaginatedBlogPosts>(this.baseUrl, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }
  }

  async getPostBySlug(slug: string): Promise<BlogPostDetail> {
    try {
      const response = await axios.get<BlogPostDetail>(`${this.baseUrl}/${slug}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching blog post:', error);
      throw error;
    }
  }

  async getCategories(onlyActive: boolean = true): Promise<BlogCategory[]> {
    try {
      const response = await axios.get<BlogCategory[]>(`${this.baseUrl}/categories`, {
        params: { onlyActive }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching blog categories:', error);
      throw error;
    }
  }

  async getHighlightedPosts(pageSize: number = 6): Promise<PaginatedBlogPosts> {
    try {
      const response = await axios.get<PaginatedBlogPosts>(`${this.baseUrl}/highlighted`, {
        params: { pageSize }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching highlighted posts:', error);
      throw error;
    }
  }
}

export const blogService = new BlogService();
export default blogService;

