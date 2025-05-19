import type { Metadata } from "next";
import ClientCategoryDetail from "@/app/dashboard/categories/ClientCategoryDetail";
import { cookies } from "next/headers";

// Định nghĩa interface cho category từ API
interface CategoryFromApi {
  id: string | number;
  name?: string;
  title?: string;
  // Các trường khác của category
}

// Định nghĩa interface cho parent category (đơn giản hóa)
interface ParentCategory {
  id: string;
  name: string;
}

// Định nghĩa interface cho product
interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  image?: string;
  imageUrl?: string;
  stock: number;
  isActive: boolean;
}

/**
 * Helper function để lấy token xác thực từ cookie (server-side)
 */
async function getAuthHeader(): Promise<HeadersInit> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

/**
 * Fetches category data and related information from API
 * @param categoryId - ID of the category to fetch
 * @returns Object containing category data, products and parent categories
 */
async function fetchCategoryData(categoryId: string) {
  try {
    console.log(`Fetching data for category ID: ${categoryId}`);
    
    // Cấu hình API URL dựa trên brands.ts
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5130';
    
    // Lấy headers có token xác thực
    const headers = await getAuthHeader();
    
    // 1. Fetch category details
    const categoryResponse = await fetch(`${API_URL}/api/Categories/${categoryId}`, {
      cache: 'no-store',
      headers,
    });
    
    if (!categoryResponse.ok) {
      console.error(`API returned error status for category: ${categoryResponse.status}`);
      const errorText = await categoryResponse.text();
      console.error(`API error response: ${errorText}`);
      throw new Error(`Failed to fetch category data: ${categoryResponse.status}`);
    }
    
    const categoryData = await categoryResponse.json();
    console.log("Fetched category data:", categoryData);
    
    // 2. Đảm bảo children là mảng nếu chưa có
    if (!categoryData.children) {
      categoryData.children = [];
    }
    
    // 3. Fetch products in this category 
    // Sử dụng AdminCategories endpoint nếu có
    const productsResponse = await fetch(`${API_URL}/api/Products?categoryId=${categoryId}`, {
      cache: 'no-store',
      headers,
    });
    
    let productsData: Product[] = [];
    if (productsResponse.ok) {
      const productResult = await productsResponse.json();
      productsData = productResult.items || productResult;
      console.log("Fetched products data:", productsData);
    } else {
      console.warn(`Could not fetch products: ${productsResponse.status}`);
    }
    
    // 4. Fetch all categories for parent dropdown selection
    const allCategoriesResponse = await fetch(`${API_URL}/AdminCategories`, {
      cache: 'no-store',
      headers,
    });
    
    let parentCategoriesData: ParentCategory[] = [];
    if (allCategoriesResponse.ok) {
      const allCategories = await allCategoriesResponse.json() as CategoryFromApi[];
      console.log("Fetched all categories:", allCategories);
      // Lọc ra những danh mục có thể là danh mục cha (loại bỏ danh mục hiện tại)
      parentCategoriesData = allCategories
        .filter((cat: CategoryFromApi) => cat.id.toString() !== categoryId)
        .map((cat: CategoryFromApi) => ({ 
          id: cat.id.toString(), 
          name: cat.name || cat.title || ""
        }));
    } else {
      console.warn(`Could not fetch categories for parent selection: ${allCategoriesResponse.status}`);
    }

    return { 
      categoryData, 
      productsData, 
      parentCategoriesData 
    };
  } catch (error) {
    console.error("Error fetching category data:", error);
    throw error; // Rethrow to allow error handling in the page component
  }
}

interface CategoryDetailPageProps {
  params: { id: string };
}

export const metadata: Metadata = {
  title: "Chi tiết danh mục | SmartMile Admin",
  description: "Quản lý chi tiết danh mục sản phẩm",
};

/**
 * Server component for category detail page
 * Fetches category data from API and renders client component
 */
export default async function CategoryDetailPage({ params }: CategoryDetailPageProps) {
  try {
    const data = await fetchCategoryData(params.id);
    
    // Transform API data to match the expected component structure
    const transformedCategory = {
      id: params.id,
      name: data.categoryData.name || data.categoryData.title || '',
      slug: data.categoryData.slug || '',
      description: data.categoryData.description || '',
      parent: data.categoryData.parentId ? data.categoryData.parentId.toString() : null,
      children: data.categoryData.children || [],
      productCount: data.productsData?.length || 0,
      image: data.categoryData.imageUrl || '',
      isActive: data.categoryData.isActive !== undefined ? data.categoryData.isActive : false,
      metaTitle: data.categoryData.metaTitle || '',
      metaDescription: data.categoryData.metaDescription || '',
      metaKeywords: data.categoryData.metaKeywords || '',
      displayOrder: data.categoryData.displayOrder || 0,
      attributes: data.categoryData.attributes || [],
      createdAt: data.categoryData.createdAt || new Date().toISOString(),
      updatedAt: data.categoryData.updatedAt || new Date().toISOString(),
    };
    
    // Transform products data if needed
    const transformedProducts = data.productsData?.map(product => ({
      id: product.id?.toString() || '',
      name: product.name || '',
      sku: product.sku || '',
      price: product.price || 0,
      image: product.imageUrl || product.image || '',
      stock: product.stock || 0,
      isActive: product.isActive !== undefined ? product.isActive : false,
    })) || [];
    
    return (
      <ClientCategoryDetail
        categoryId={params.id}
        initialCategory={transformedCategory}
        initialProducts={transformedProducts}
        initialParentCategories={data.parentCategoriesData || []}
      />
    );
  } catch (error) {
    // Display error state if API call fails
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <h2 className="text-2xl font-bold mb-4">Không thể tải dữ liệu danh mục</h2>
        <p className="text-gray-600 mb-6">
          Có lỗi xảy ra khi tải dữ liệu từ API. Vui lòng kiểm tra kết nối API endpoint.
        </p>
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-md max-w-md text-left">
          <h3 className="font-semibold text-amber-800 mb-2">Chi tiết lỗi:</h3>
          <p className="text-amber-700 mb-2">
            {(error as Error).message || "Unknown error"}
          </p>
          <p className="text-amber-700 text-sm mt-2">
            API URL: {`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5130'}/api/Categories/${params.id}`}
          </p>
          <p className="text-amber-700 text-sm mt-1">
            Lỗi 404 nghĩa là &quot;Not Found&quot;. Điều này có thể là do:
          </p>
          <ol className="list-decimal list-inside text-amber-700 text-sm ml-2 space-y-1 mt-1">
            <li>ID danh mục không tồn tại trong hệ thống</li>
            <li>URL endpoint không chính xác</li>
            <li>API yêu cầu xác thực nhưng token không hợp lệ hoặc thiếu</li>
          </ol>
        </div>
      </div>
    );
  }
}