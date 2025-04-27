"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

// Định nghĩa kiểu của CategoryDetail dựa trên props của component
interface CategoryDetailProps {
  categoryId: string;
  initialCategory: Category;
  initialProducts: Product[];
  initialParentCategories: { id: string; name: string }[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parent: string | null;
  children: Category[];
  productCount: number;
  image?: string;
  isActive: boolean;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  displayOrder: number;
  attributes: CategoryAttribute[];
  createdAt: string;
  updatedAt: string;
}

interface CategoryAttribute {
  id: string;
  name: string;
  type: "text" | "number" | "boolean" | "select";
  required: boolean;
  options?: string[];
}

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  image: string;
  stock: number;
  isActive: boolean;
}

// Ép kiểu trả về của import để khớp với CategoryDetailProps
const CategoryDetail = dynamic(
  () =>
    import("@/components/categories/category-detail").then(
      (mod) => mod.CategoryDetail as ComponentType<CategoryDetailProps>
    ),
  {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-[500px]">Đang tải...</div>,
  }
);

export default function ClientCategoryDetail({
  categoryId,
  initialCategory,
  initialProducts,
  initialParentCategories,
}: CategoryDetailProps) {
  return (
    <CategoryDetail
      categoryId={categoryId}
      initialCategory={initialCategory}
      initialProducts={initialProducts}
      initialParentCategories={initialParentCategories}
    />
  );
}