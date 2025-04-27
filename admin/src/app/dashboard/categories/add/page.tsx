import type { Metadata } from "next";
import ClientAddCategoryForm from "@/app/dashboard/categories/ClientAddCategoryForm";

interface ParentCategory {
  id: string;
  name: string;
}

export const metadata: Metadata = {
  title: "Thêm danh mục mới | SmartMile Admin",
  description: "Tạo danh mục sản phẩm mới",
};


async function fetchParentCategories(): Promise<ParentCategory[]> {
  const response = await fetch("/api/parent-categories", { next: { revalidate: 3600 } });
  return response.json();
}

export default async function AddCategoryPage() {
  const parentCategories = await fetchParentCategories();
  return <ClientAddCategoryForm initialParentCategories={parentCategories} />;
}