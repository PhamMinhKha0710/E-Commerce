import type { Metadata } from "next";
import ClientBrandManagement from "./ClientBrandManagement";
import { Brand } from "@/lib/api/brands";

export const metadata: Metadata = {
  title: "Quản lý thương hiệu | SmartMile Admin",
  description: "Quản lý tất cả thương hiệu trong hệ thống SmartMile",
};

async function fetchBrands(): Promise<Brand[]> {
  try {
    const response = await fetch("http://localhost:5130/api/admin/brands", { 
      next: { revalidate: 3600 },
      headers: {
        'Content-Type': 'application/json',
      },
      // Trong môi trường phát triển, có thể cần bỏ qua lỗi xác thực
      cache: 'no-store',
    });
    
    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`);
      // Ném lỗi để component catch và xử lý
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw error;
  }
}

export default async function BrandsPage() {
  try {
    const brands = await fetchBrands();
    return <ClientBrandManagement initialBrands={brands} />;
  } catch (error) {
    console.error("Render error:", error);
    
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <h2 className="text-2xl font-bold mb-4">Không thể tải dữ liệu thương hiệu</h2>
        <p className="text-gray-600 mb-6">
          Có lỗi xảy ra khi tải dữ liệu từ API. Vui lòng kiểm tra API endpoint.
        </p>
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-md max-w-md">
          <p className="text-amber-700">
            Để phát triển không cần xác thực, bạn có thể cấu hình API để bỏ qua xác thực trong môi trường dev.
          </p>
        </div>
      </div>
    );
  }
}

export const revalidate = 3600;
