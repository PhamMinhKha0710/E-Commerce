import CategoryMenu from "@/app/collections/all/CategoryMenu";
import FilterContainer from "@/app/collections/all/FilterContainer";
import ProductGrid from "@/app/collections/all/ProductGrid";
import ThreeBanner from "@/app/collections/all/ThreeBanner";
import Breadcrumb from "@/components/sections/Breadcrum";
import { FilterProvider } from "@/app/collections/all/FilterContext";
import { categoryService } from "@/services/categoryService";
import CategoryProductGrid from "./CategoryProductGrid";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  
  // Tìm category từ slug
  const category = await categoryService.findCategoryBySlug(slug);
  const categoryName = category?.title || categoryService.slugToCategoryName(slug);

  return (
    <FilterProvider>
      <div className="bodywrap" style={{marginTop: '-30px'}}>
        <div className="layout-collection">
          <Breadcrumb items={[
            { label: "Trang chủ", href: "/" },
            { label: "Sản phẩm", href: "/collections/all" },
            { label: categoryName, isActive: true }
          ]} />
          <div className="container">
            <div className="page-title" style={{ margin: '24px 0' }}>
              <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a' }}>
                {categoryName.toUpperCase()}
              </h1>
            </div>
            <div className="row">
              <aside className="dqdt-sidebar sidebar col-lg-3 col-12">
                <div className="bg">
                  <CategoryMenu />
                  <FilterContainer />
                </div>
              </aside> 
              <div className="block-collection col-lg-9 col-12">
                <ThreeBanner />
                <div className="category-products">
                  <CategoryProductGrid categoryName={categoryName} slug={slug} />
                </div>
              </div>  
            </div>
          </div>
        </div>
      </div>
    </FilterProvider>
  );
}

