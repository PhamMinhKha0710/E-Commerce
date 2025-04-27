import type { Metadata } from "next";
import ClientCategoryManagement from "./ClientCategoryManagement";

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

export const metadata: Metadata = {
  title: "Quản lý danh mục | SmartMile Admin",
  description: "Quản lý cấu trúc danh mục sản phẩm trong hệ thống SmartMile",
};


async function fetchCategories(): Promise<Category[]> {
  const response = await fetch("http://localhost:5130/AdminCategories", { next: { revalidate: 3600 } });
  return response.json();
}

export default async function CategoriesPage() {
  const categories = await fetchCategories();
  return <ClientCategoryManagement initialCategories={categories} />;
}

export const revalidate = 3600; 