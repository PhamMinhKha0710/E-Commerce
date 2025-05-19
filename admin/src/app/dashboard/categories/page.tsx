import type { Metadata } from "next";
import ClientCategoryManagement from "./ClientCategoryManagement";
import { cookies } from "next/headers";

// Define the Category type compatible with what ClientCategoryManagement expects
interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parent: string | null;
  children: Category[];
  productCount: number;
  displayOrder?: number;
}

// Interface representing the category data from API
interface ApiCategoryResponse {
  id: number | string;
  name?: string;
  title?: string;
  slug?: string;
  description?: string;
  parentId?: number | string | null;
  children?: ApiCategoryResponse[];
  subCategories?: ApiCategoryResponse[];
  productCount?: number;
  displayOrder?: number;
}

export const metadata: Metadata = {
  title: "Quản lý danh mục | SmartMile Admin",
  description: "Quản lý cấu trúc danh mục sản phẩm trong hệ thống SmartMile",
};

// Helper function to recursively map API categories to our UI format
function mapApiCategoriesToUI(
  apiCategories: ApiCategoryResponse[]
): Category[] {
  return apiCategories.map(category => ({
    id: category.id.toString(),
    name: category.name || category.title || '',
    slug: category.slug || '',
    description: category.description || '',
    parent: category.parentId ? category.parentId.toString() : null,
    children: category.children 
      ? mapApiCategoriesToUI(category.children)
      : category.subCategories 
        ? mapApiCategoriesToUI(category.subCategories) 
        : [],
    productCount: category.productCount || 0,
    displayOrder: category.displayOrder || 0
  }));
}

// Helper to add server-side auth for fetch
async function fetchCategoriesWithAuth(): Promise<Category[]> {
  try {
    // Server-side API call with authentication
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5130';
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}/AdminCategories`, { 
      next: { revalidate: 3600 },
      headers
    });
    
    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`);
      throw new Error('Failed to fetch categories');
    }
    
    // Transform API response to match expected Category structure
    const apiData = await response.json() as ApiCategoryResponse[];
    
    return mapApiCategoriesToUI(apiData);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await fetchCategoriesWithAuth();
  return <ClientCategoryManagement initialCategories={categories} />;
}

export const revalidate = 3600; 