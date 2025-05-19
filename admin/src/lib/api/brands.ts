/**
 * Brands API client library
 * Contains functions for communicating with the backend API for brands
 */

// Define brand types
export interface Brand {
  id: number;
  name: string;
  imageUrl?: string;
  description?: string;
  productCount: number;
}

export interface CreateBrandDto {
  name: string;
  imageUrl?: string;
  description?: string;
}

export interface UpdateBrandDto {
  name: string;
  imageUrl?: string;
  description?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5130';

// Helper function to get JWT token
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

// Thêm auth headers nếu có token
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
 * Fetch all brands from the API
 */
export async function getBrands(): Promise<Brand[]> {
  try {
    const response = await fetch(`${API_URL}/api/admin/brands`, {
      cache: 'no-store',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`);
      if (response.status === 401) {
        // Có thể chuyển hướng đến trang đăng nhập hoặc refresh token
        console.warn('Authentication required');
      }
      throw new Error('Failed to fetch brands');
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw error;
  }
}

/**
 * Fetch a single brand by ID
 */
export async function getBrandById(id: number): Promise<Brand> {
  try {
    const response = await fetch(`${API_URL}/api/admin/brands/${id}`, {
      cache: 'no-store',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`);
      if (response.status === 401) {
        console.warn('Authentication required');
      }
      throw new Error(`Failed to fetch brand with ID ${id}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching brand with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new brand
 */
export async function createBrand(data: CreateBrandDto): Promise<Brand> {
  try {
    const response = await fetch(`${API_URL}/api/admin/brands`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`);
      if (response.status === 401) {
        console.warn('Authentication required');
      }
      throw new Error('Failed to create brand');
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating brand:", error);
    throw error;
  }
}

/**
 * Update an existing brand
 */
export async function updateBrand(id: number, data: UpdateBrandDto): Promise<Brand> {
  try {
    const response = await fetch(`${API_URL}/api/admin/brands/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`);
      if (response.status === 401) {
        console.warn('Authentication required');
      }
      throw new Error(`Failed to update brand with ID ${id}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error updating brand with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a brand
 */
export async function deleteBrand(id: number): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/admin/brands/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`);
      if (response.status === 401) {
        console.warn('Authentication required');
      }
      throw new Error(`Failed to delete brand with ID ${id}`);
    }

    return true;
  } catch (error) {
    console.error(`Error deleting brand with ID ${id}:`, error);
    throw error;
  }
} 