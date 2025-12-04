import { getAuthToken } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5130/api";

// Type definitions
export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  price: number;
  salePrice: number;
  stock: number;
  status: string;
  categoryId: number;
  categoryName: string;
  brandId: number;
  brandName: string;
  hasVariants: boolean;
  imageUrl: string;
}

export interface ProductDetail {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice: number;
  sku: string;
  stock: number;
  status: string;
  featured: boolean;
  category: string;
  categoryId: number;
  categoryName: string;
  brand: string;
  brandId: number;
  brandName: string;
  hasVariations: boolean;
  images: string[];
  attributes: ProductAttribute[];
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
  sales: number;
  rating: number;
  reviews: number;
}

export interface ProductAttribute {
  name: string;
  value: string;
}

export interface ProductVariant {
  id: number;
  name: string;
  price: number;
  stock: number;
  sku: string;
  attributes: ProductAttribute[];
}

export interface CategoryFilterOption {
  id: number;
  name: string;
}

export interface BrandFilterOption {
  id: number;
  name: string;
}

export interface ProductListResponse {
  products: Product[];
  categories: string[];
  brands: string[];
  categoryOptions: CategoryFilterOption[];
  brandOptions: BrandFilterOption[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateUpdateProductDto {
  name: string;
  slug?: string;
  description: string;
  price: number;
  salePrice?: number;
  sku: string;
  stock: number;
  featured?: boolean;
  categoryId: number;
  brandId: number;
  images?: string[];
  attributes?: ProductAttribute[];
}

export interface ProductVariantDto {
  name?: string;
  sku: string;
  price: number;
  stock: number;
  attributes: ProductAttribute[];
}

/**
 * Lấy danh sách sản phẩm từ API admin
 */
export async function getProducts(
  pageNumber = 1, 
  pageSize = 10, 
  sortBy?: string, 
  searchTerm?: string,
  categoryId?: number,
  brandId?: number,
  status?: string,
  minPrice?: number,
  maxPrice?: number
): Promise<ProductListResponse> {
  const token = getAuthToken();
  
  try {
    const params = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
    });
    
    if (sortBy) {
      params.append('sortBy', sortBy);
    }
    
    if (searchTerm) {
      params.append('searchTerm', searchTerm);
    }

    if (categoryId) {
      params.append('categoryId', categoryId.toString());
    }

    if (brandId) {
      params.append('brandId', brandId.toString());
    }

    if (status) {
      params.append('status', status);
    }

    if (minPrice !== undefined) {
      params.append('minPrice', minPrice.toString());
    }

    if (maxPrice !== undefined) {
      params.append('maxPrice', maxPrice.toString());
    }
    
    const response = await fetch(
      `${API_URL}/admin/products?${params.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching products: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw error;
  }
}

/**
 * Lấy chi tiết một sản phẩm
 */
export async function getProductDetail(id: number): Promise<ProductDetail> {
  const token = getAuthToken();
  
  try {
    const response = await fetch(
      `${API_URL}/admin/products/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching product: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch product with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Tạo sản phẩm mới
 */
export async function createProduct(data: CreateUpdateProductDto): Promise<ProductDetail> {
  const token = getAuthToken();
  
  try {
    const response = await fetch(
      `${API_URL}/admin/products`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(`Error creating product: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to create product:", error);
    throw error;
  }
}

/**
 * Cập nhật thông tin sản phẩm
 */
export async function updateProduct(id: number, data: CreateUpdateProductDto): Promise<ProductDetail> {
  const token = getAuthToken();
  
  try {
    const response = await fetch(
      `${API_URL}/admin/products/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(`Error updating product: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to update product with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Xóa sản phẩm
 */
export async function deleteProduct(id: number): Promise<boolean> {
  const token = getAuthToken();
  
  try {
    const response = await fetch(
      `${API_URL}/admin/products/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error deleting product: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error(`Failed to delete product with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Tạo biến thể sản phẩm
 */
export async function createProductVariant(productId: number, variantData: ProductVariantDto): Promise<ProductVariant> {
  const token = getAuthToken();
  
  try {
    const response = await fetch(
      `${API_URL}/admin/products/${productId}/variants`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(variantData),
      }
    );

    if (!response.ok) {
      throw new Error(`Error creating product variant: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to create variant for product ID ${productId}:`, error);
    throw error;
  }
}

/**
 * Cập nhật biến thể sản phẩm
 */
export async function updateProductVariant(
  productId: number, 
  variantId: number, 
  variantData: ProductVariantDto
): Promise<ProductVariant> {
  const token = getAuthToken();
  
  try {
    const response = await fetch(
      `${API_URL}/admin/products/${productId}/variants/${variantId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(variantData),
      }
    );

    if (!response.ok) {
      throw new Error(`Error updating product variant: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to update variant ${variantId} for product ID ${productId}:`, error);
    throw error;
  }
}

/**
 * Xóa biến thể sản phẩm
 */
export async function deleteProductVariant(productId: number, variantId: number): Promise<boolean> {
  const token = getAuthToken();
  
  try {
    const response = await fetch(
      `${API_URL}/admin/products/${productId}/variants/${variantId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error deleting product variant: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error(`Failed to delete variant ${variantId} for product ID ${productId}:`, error);
    throw error;
  }
} 