"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

// Định nghĩa kiểu của AddCategoryForm dựa trên props của component
interface AddCategoryFormProps {
  initialParentCategories: ParentCategory[];
}

interface ParentCategory {
  id: string;
  name: string;
}

// Ép kiểu trả về của import để khớp với AddCategoryFormProps
const AddCategoryForm = dynamic(
  () =>
    import("@/components/categories/add-category-form").then(
      (mod) => mod.AddCategoryForm as ComponentType<AddCategoryFormProps>
    ),
  {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-[500px]">Đang tải...</div>,
  }
);

export default function ClientAddCategoryForm({ initialParentCategories }: AddCategoryFormProps) {
  return <AddCategoryForm initialParentCategories={initialParentCategories} />;
}