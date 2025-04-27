"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

// Định nghĩa kiểu của CategoryManagement dựa trên props của component
interface CategoryManagementProps {
  initialCategories: Category[];
}

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

// Ép kiểu trả về của import để khớp với CategoryManagementProps
const CategoryManagement = dynamic(
  () =>
    import("@/components/categories/category-management").then(
      (mod) => mod.CategoryManagement as ComponentType<CategoryManagementProps>
    ),
  {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-[500px]">Đang tải...</div>,
  }
);

export default function ClientCategoryManagement({ initialCategories }: CategoryManagementProps) {
  return <CategoryManagement initialCategories={initialCategories} />;
}