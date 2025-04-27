import type { Metadata } from "next";
import ClientCategoryDetail from "@/app/dashboard/categories/ClientCategoryDetail";

async function fetchCategoryData(categoryId: string) {
  const categoryData = await fetch(`/api/categories/${categoryId}`, {
    next: { revalidate: 3600 },
  }).then((res) => res.json());
  const productsData = await fetch(`/api/categories/${categoryId}/products`, {
    next: { revalidate: 3600 },
  }).then((res) => res.json());
  const parentCategoriesData = await fetch("/api/parent-categories", {
    next: { revalidate: 3600 },
  }).then((res) => res.json());

  return { categoryData, productsData, parentCategoriesData };
}

interface CategoryDetailPageProps {
  params: { id: string };
}

export const metadata: Metadata = {
  title: "Chi tiết danh mục | SmartMile Admin",
  description: "Quản lý chi tiết danh mục sản phẩm",
};

export default async function CategoryDetailPage({ params }: CategoryDetailPageProps) {
  const { categoryData, productsData, parentCategoriesData } = await fetchCategoryData(params.id);
  return (
    <ClientCategoryDetail
      categoryId={params.id}
      initialCategory={categoryData}
      initialProducts={productsData}
      initialParentCategories={parentCategoriesData}
    />
  );
}