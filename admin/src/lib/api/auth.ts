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
  firstName?: string;
  lastName?: string;
  bio?: string;
}

export interface UserProfile {
  id: string | number;
  email: string;
  firstName: string;
  lastName: string;
  bio?: string;
  role?: string;
}

export interface UpdateUserProfileDto {
  firstName: string;
  lastName: string;
  email?: string;
  bio?: string;
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

    const data = await response.json();
    
    // Handle both 'token', 'accessToken' (camelCase) and 'AccessToken' (PascalCase) from API
    const token = data.token || data.accessToken || data.AccessToken;
    if (!token) {
      console.error('No token found in login response.');
      throw new Error('No token received from server');
    }
    
    // Backend không trả về user trong login response, cần gọi API /me để lấy user info
    // Tạm thời return token, user sẽ được lấy sau khi set token
    return {
      token,
      expiresAt: data.expiresAt || data.ExpiresIn ? new Date(Date.now() + (data.ExpiresIn || data.expiresIn || 900) * 1000).toISOString() : undefined,
      user: data.user || data.User, // Có thể không có
    };
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
    
    // Map API response để đảm bảo tương thích với cả PascalCase và camelCase
    const mappedUser: CurrentUser = {
      id: userData.id || userData.Id,
      email: userData.email || userData.Email || '',
      name: userData.name || userData.Name,
      role: userData.role || userData.Role || '',
      firstName: userData.firstName || userData.FirstName,
      lastName: userData.lastName || userData.LastName,
      bio: userData.bio || userData.Bio,
    };
    
    return mappedUser;
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
    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.warn('No auth token found in localStorage');
    }
    return token;
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
 * Get user profile with full details
 */
export async function getUserProfile(): Promise<UserProfile | null> {
  const token = getAuthToken();
  if (!token) {
    console.warn('No auth token found');
    return null;
  }
  
  try {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_info');
        document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        return null;
      }
      throw new Error(`Failed to get user profile: ${response.status}`);
    }

    const userData = await response.json();
    
    // Map API response to UserProfile format
    // Handle both camelCase and PascalCase from API
    const profile: UserProfile = {
      id: userData.id || userData.Id,
      email: userData.email || userData.Email || '',
      firstName: userData.firstName || userData.FirstName || '',
      lastName: userData.lastName || userData.LastName || '',
      bio: userData.bio || userData.Bio || '',
      role: userData.role || userData.Role || '',
    };
    
    return profile;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(data: UpdateUserProfileDto): Promise<UserProfile> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Not authenticated');
  }
  
  try {
    const response = await fetch(`${API_URL}/api/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_info');
        document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        throw new Error('Authentication expired. Please login again.');
      }
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Failed to update profile: ${response.status}`);
    }

    const updatedProfile = await response.json();
    
    // Update user info in localStorage if available
    const userInfo = getUserInfo();
    if (userInfo) {
      const updatedUserInfo = {
        ...userInfo,
        firstName: updatedProfile.firstName,
        lastName: updatedProfile.lastName,
        email: updatedProfile.email,
      };
      localStorage.setItem('user_info', JSON.stringify(updatedUserInfo));
    }
    
    return updatedProfile;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
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