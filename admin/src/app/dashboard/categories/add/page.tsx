import type { Metadata } from "next";
import ClientAddCategoryForm from "@/app/dashboard/categories/ClientAddCategoryForm";
import { cookies } from "next/headers";

interface ParentCategory {
  id: string;
  name: string;
}

interface ApiCategory {
  id?: string;
  categoryId?: string;
  name?: string;
  categoryName?: string;
  [key: string]: string | number | boolean | undefined | null;
}

export const metadata: Metadata = {
  title: "Thêm danh mục mới | SmartMile Admin",
  description: "Tạo danh mục sản phẩm mới",
};

async function fetchParentCategories(): Promise<ParentCategory[]> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5130';
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const response = await fetch(`${API_URL}/api/Categories`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      }
    });
    
    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`);
      return [];
    }
    
    const data = await response.json();
    // Handle both array responses and responses with a data property
    const categories: ApiCategory[] = Array.isArray(data) ? data : (data.data || []);
    
    return categories.map((category: ApiCategory) => ({
      id: category.id || category.categoryId || '',
      name: category.name || category.categoryName || '',
    }));
  } catch (error) {
    console.error("Error fetching parent categories:", error);
    return [];
  }
}

export default async function AddCategoryPage() {
  const parentCategories = await fetchParentCategories();
  console.log("Loaded parent categories:", parentCategories);
  return <ClientAddCategoryForm initialParentCategories={parentCategories} />;
}