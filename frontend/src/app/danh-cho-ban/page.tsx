import CategoryMenu from "@/app/danh-cho-ban/CategoryMenu";
import FilterContainer from "@/app/danh-cho-ban/FilterContainer";
import ProductGrid from "@/app/danh-cho-ban/ProductGrid";
import ThreeBanner from "@/app/danh-cho-ban/ThreeBanner";
import Breadcrumb from "@/components/sections/Breadcrum";
import { FilterProvider } from "@/app/danh-cho-ban/FilterContext";


export default function DanhChoBan() {
    return (
        <FilterProvider>
            <div className="bodywrap" style={{marginTop: '-30px'}}>
                <div className="layout-collection">
                    <Breadcrumb items={[
                        { label: "Trang chủ", href: "/" },
                        { label: "Tất cả sản phẩm", isActive: true }
                    ]} />
                    <div className="container">
                        <div className="page-title" style={{ margin: '24px 0' }}>
                            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a' }}>
                                TẤT CẢ SẢN PHẨM
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
                                    <ProductGrid />
                                </div>
                            </div>  
                        </div>
                    </div>
                </div>
            </div>
        </FilterProvider>
    )
}