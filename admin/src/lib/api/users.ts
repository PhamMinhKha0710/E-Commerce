/**
 * Users API client library
 * Contains functions for managing users with the backend API
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5130';

export interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  status: string;
  lastActive: string | null;
  createdAt: string;
  avatarUrl: string | null;
  initials: string;
}

export interface UserDetail {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  status: string;
  lastActive: string | null;
  createdAt: string;
  avatarUrl: string | null;
  initials: string;
  address: string | null;
  bio: string | null;
  ordersCount: number;
  totalSpent: number;
  wishlistCount: number;
}

export interface UsersListResponse {
  users: User[];
  total: number;
  page: number;
  pageSize: number;
}

export interface GetUsersParams {
  keyword?: string;
  role?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
}

/**
 * Get all users with pagination and filters
 */
export async function getUsers(params: GetUsersParams = {}): Promise<UsersListResponse> {
  const token = getAuthToken();
  const queryParams = new URLSearchParams();
  
  if (params.keyword) queryParams.append('keyword', params.keyword);
  if (params.role) queryParams.append('role', params.role);
  if (params.status) queryParams.append('status', params.status);
  if (params.page != null) queryParams.append('page', (params.page || 1).toString());
  if (params.pageSize != null) queryParams.append('pageSize', (params.pageSize || 10).toString());

  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/api/admin/users?${queryParams.toString()}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_info');
        throw new Error('Authentication expired. Please login again.');
      }
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Failed to get users: ${response.status}`);
    }

    const data = await response.json();
    
    // Map API response to match frontend interface
    return {
      users: (data.users || []).map((user: any) => ({
        id: user.id ?? user.Id ?? 0,
        name: user.name ?? user.Name ?? '',
        email: user.email ?? user.Email ?? '',
        phoneNumber: user.phoneNumber ?? user.PhoneNumber ?? '',
        role: user.role ?? user.Role ?? '',
        status: user.status ?? user.Status ?? '',
        lastActive: user.lastActive ?? user.LastActive ?? null,
        createdAt: user.createdAt ?? user.CreatedAt ?? '',
        avatarUrl: user.avatarUrl ?? user.AvatarUrl ?? null,
        initials: user.initials ?? user.Initials ?? '',
      })).filter((user: User) => user.id != null && user.id > 0), // Filter out invalid users
      total: data.total ?? data.Total ?? 0,
      page: data.page ?? data.Page ?? 1,
      pageSize: data.pageSize ?? data.PageSize ?? 10,
    };
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
}

/**
 * Get user by ID
 */
export async function getUserById(userId: number): Promise<UserDetail> {
  const token = getAuthToken();

  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/api/admin/users/${userId}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_info');
        throw new Error('Authentication expired. Please login again.');
      }
      if (response.status === 404) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'User not found');
      }
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Failed to get user: ${response.status}`);
    }

    const data = await response.json();
    
    // Map API response to match frontend interface
    return {
      id: data.id || data.Id,
      name: data.name || data.Name || '',
      firstName: data.firstName || data.FirstName || '',
      lastName: data.lastName || data.LastName || '',
      email: data.email || data.Email || '',
      phoneNumber: data.phoneNumber || data.PhoneNumber || '',
      role: data.role || data.Role || '',
      status: data.status || data.Status || '',
      lastActive: data.lastActive || data.LastActive || null,
      createdAt: data.createdAt || data.CreatedAt || '',
      avatarUrl: data.avatarUrl || data.AvatarUrl || null,
      initials: data.initials || data.Initials || '',
      address: data.address || data.Address || null,
      bio: data.bio || data.Bio || null,
      ordersCount: data.ordersCount || data.OrdersCount || 0,
      totalSpent: data.totalSpent || data.TotalSpent || 0,
      wishlistCount: data.wishlistCount || data.WishlistCount || 0,
    };
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}

