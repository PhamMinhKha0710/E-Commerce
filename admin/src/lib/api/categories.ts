/**
 * Categories API client library
 * Contains functions for communicating with the backend API for categories
 */

// Define category types
export interface Category {
  id: number;
  name?: string;
  title?: string;  // Backend might return either name or title
  slug?: string;
  description?: string;
  imageUrl?: string;
  parentId?: number;
  isActive?: boolean;
  displayOrder?: number;
  productCount?: number;
  subCategories?: Category[];
  children?: Category[];  // Some endpoints may return children instead of subCategories
}

export interface CreateCategoryDto {
  name: string;
  parentId?: number;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
  displayOrder?: number;
}

export interface UpdateCategoryDto {
  name: string;
  parentId?: number;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
  displayOrder?: number;
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
 * Fetch all public categories (for client-facing views)
 * This uses /api/Categories endpoint
 */
export async function getPublicCategories(): Promise<Category[]> {
  try {
    console.log("Fetching public categories from:", `${API_URL}/api/Categories`);
    const response = await fetch(`${API_URL}/api/Categories`, {
      method: 'GET',
      cache: 'no-store',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`);
      const errorText = await response.text();
      console.error("Error details:", errorText);
      
      if (response.status === 401) {
        console.warn('Authentication required');
      }
      throw new Error('Failed to fetch categories');
    }

    const data = await response.json();
    
    // Handle different response structures
    const categories = Array.isArray(data) 
      ? data 
      : data.data || data.items || data.categories || [];
      
    return categories;
  } catch (error) {
    console.error("Error fetching public categories:", error);
    throw error;
  }
}

/**
 * Fetch all admin categories (for admin views)
 * This uses /AdminCategories endpoint
 */
export async function getAdminCategories(): Promise<Category[]> {
  try {
    console.log("Fetching admin categories from:", `${API_URL}/AdminCategories`);
    const response = await fetch(`${API_URL}/AdminCategories`, {
      method: 'GET',
      cache: 'no-store',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`);
      const errorText = await response.text();
      console.error("Error details:", errorText);
      
      if (response.status === 401) {
        console.warn('Authentication required');
      }
      throw new Error('Failed to fetch admin categories');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching admin categories:", error);
    throw error;
  }
}

/**
 * Fetch a single category by ID
 */
export async function getCategoryById(id: number): Promise<Category> {
  try {
    console.log(`Fetching category by ID ${id} from:`, `${API_URL}/api/Categories/${id}`);
    const response = await fetch(`${API_URL}/api/Categories/${id}`, {
      cache: 'no-store',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`);
      const errorText = await response.text();
      console.error("Error details:", errorText);
      
      if (response.status === 401) {
        console.warn('Authentication required');
      }
      throw new Error(`Failed to fetch category with ID ${id}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching category with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new category
 */
export async function createCategory(data: CreateCategoryDto): Promise<Category> {
  try {
    const response = await fetch(`${API_URL}/api/Categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`);
      const errorText = await response.text();
      console.error("Error details:", errorText);
      
      if (response.status === 401) {
        console.warn('Authentication required');
      }
      throw new Error('Failed to create category');
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
}

/**
 * Update an existing category
 */
export async function updateCategory(id: number, data: UpdateCategoryDto): Promise<Category> {
  try {
    const response = await fetch(`${API_URL}/api/Categories/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`);
      const errorText = await response.text();
      console.error("Error details:", errorText);
      
      if (response.status === 401) {
        console.warn('Authentication required');
      }
      throw new Error(`Failed to update category with ID ${id}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error updating category with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a category
 */
export async function deleteCategory(id: number): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/Categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`);
      const errorText = await response.text();
      console.error("Error details:", errorText);
      
      if (response.status === 401) {
        console.warn('Authentication required');
      }
      throw new Error(`Failed to delete category with ID ${id}`);
    }

    return true;
  } catch (error) {
    console.error(`Error deleting category with ID ${id}:`, error);
    throw error;
  }
} 