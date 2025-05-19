/**
 * Reviews API client library
 * Contains functions for communicating with the backend API for reviews
 */

// Define review types
export interface ReviewDto {
  id: number;
  ratingValue: number;
  comment: string;
  created: string;
  isStatus: boolean;
  user: UserMinimalDto;
  product: ProductMinimalDto;
  order: OrderMinimalDto;
}

export interface ReviewDetailDto extends ReviewDto {
  helpfulCount: number;
  unhelpfulCount: number;
  isVerifiedPurchase: boolean;
  replies: ReviewReplyDto[];
}

export interface UserMinimalDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface ProductMinimalDto {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
}

export interface OrderMinimalDto {
  id: number;
  orderDate: string;
}

export interface ReviewReplyDto {
  id: number;
  content: string;
  created: string;
  isAdmin: boolean;
  authorName: string;
  edited?: boolean;
  editDate?: string;
}

export interface ReviewsListDto {
  reviews: ReviewDto[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateReplyDto {
  content: string;
}

export interface UpdateReplyDto {
  content: string;
}

export interface UpdateReviewStatusDto {
  isStatus: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5130';

// Helper function to get JWT token
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

// Add auth headers if token exists
const getAuthHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

/**
 * Fetch all reviews with pagination
 */
export async function getReviews(page: number = 1, pageSize: number = 10): Promise<ReviewsListDto> {
  try {
    const response = await fetch(`${API_URL}/api/reviews?page=${page}&pageSize=${pageSize}`, {
      cache: 'no-store',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`);
      if (response.status === 401) {
        console.warn('Authentication required');
      }
      throw new Error('Failed to fetch reviews');
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
}

/**
 * Fetch a single review by ID
 */
export async function getReviewById(id: number): Promise<ReviewDetailDto> {
  try {
    const response = await fetch(`${API_URL}/api/reviews/${id}`, {
      cache: 'no-store',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`);
      if (response.status === 401) {
        console.warn('Authentication required');
      }
      throw new Error(`Failed to fetch review with ID ${id}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching review with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Update review status (approve/reject)
 */
export async function updateReviewStatus(id: number, isStatus: boolean): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/reviews/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ isStatus }),
    });

    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`);
      if (response.status === 401) {
        console.warn('Authentication required');
      }
      throw new Error(`Failed to update status for review with ID ${id}`);
    }

    return true;
  } catch (error) {
    console.error(`Error updating status for review with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Add admin reply to a review
 */
export async function addAdminReplyToReview(id: number, content: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/reviews/${id}/admin-reply`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`);
      if (response.status === 401) {
        console.warn('Authentication required');
      }
      throw new Error(`Failed to add reply to review with ID ${id}`);
    }

    return true;
  } catch (error) {
    console.error(`Error adding reply to review with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Update a reply
 */
export async function updateReply(replyId: number, content: string): Promise<ReviewReplyDto> {
  try {
    const response = await fetch(`${API_URL}/api/reviews/replies/${replyId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`);
      if (response.status === 401) {
        console.warn('Authentication required');
      }
      throw new Error(`Failed to update reply with ID ${replyId}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error updating reply with ID ${replyId}:`, error);
    throw error;
  }
}

/**
 * Delete a reply
 */
export async function deleteReply(replyId: number): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/reviews/replies/${replyId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`);
      if (response.status === 401) {
        console.warn('Authentication required');
      }
      throw new Error(`Failed to delete reply with ID ${replyId}`);
    }

    return true;
  } catch (error) {
    console.error(`Error deleting reply with ID ${replyId}:`, error);
    throw error;
  }
}

/**
 * Delete a review
 */
export async function deleteReview(id: number): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/reviews/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`);
      if (response.status === 401) {
        console.warn('Authentication required');
      }
      throw new Error(`Failed to delete review with ID ${id}`);
    }

    return true;
  } catch (error) {
    console.error(`Error deleting review with ID ${id}:`, error);
    throw error;
  }
} 