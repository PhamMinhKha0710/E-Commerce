/**
 * Authentication API client library
 * Contains functions for authentication with the backend API
 */

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresAt?: string; // ISO date string
  user?: {
    id: string | number;
    email: string;
    name?: string;
    role: string;
  };
}

export interface CurrentUser {
  id: string | number;
  email: string;
  name?: string;
  role: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5130';

/**
 * Login with email and password
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    // Sử dụng xác thực thực tế thay vì giả lập
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Login failed with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

/**
 * Get current user information
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token invalid or expired
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_info');
        document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        return null;
      }
      throw new Error(`Failed to get current user: ${response.status}`);
    }

    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Set authentication token and user info in local storage
 */
export function setAuth(token: string, user?: LoginResponse['user']): void {
  // Lưu vào localStorage cho client components
  localStorage.setItem('auth_token', token);
  if (user) {
    localStorage.setItem('user_info', JSON.stringify(user));
  }
  
  // Lưu vào cookie cho server components
  // Đặt cookie hết hạn sau 7 ngày
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7);
  
  // Đặt cookie với thuộc tính Path=/ để sử dụng trên toàn bộ trang web
  document.cookie = `auth_token=${token}; expires=${expiryDate.toUTCString()}; path=/`;
}

/**
 * Get authentication token from local storage
 */
export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
}

/**
 * Get user info from local storage
 */
export function getUserInfo(): CurrentUser | null {
  if (typeof window !== 'undefined') {
    const userInfo = localStorage.getItem('user_info');
    if (userInfo) {
      try {
        return JSON.parse(userInfo);
      } catch (e) {
        console.error('Error parsing user info', e);
      }
    }
  }
  return null;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

/**
 * Logout user
 */
export function logout(): void {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_info');
  // Xóa cookie
  document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  // Redirect to login page if needed
  window.location.href = '/login';
} 