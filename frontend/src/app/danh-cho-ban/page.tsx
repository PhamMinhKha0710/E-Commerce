import CategoryMenu from "@/app/danh-cho-ban/CategoryMenu";
import FilterContainer from "@/app/danh-cho-ban/FilterContainer";
import ProductGrid from "@/app/danh-cho-ban/ProductGrid";
import ThreeBanner from "@/app/danh-cho-ban/ThreeBanner";
import Breadcrumb from "@/components/sections/Breadcrum";


export default function DanhChoBan() {
    return (
    
        <div className="bodywrap" style={{marginTop: '-30px'}}>
            <div className="layout-collection">
                <Breadcrumb items={[
                    { label: "Trang chủ", href: "/" },
                    { label: "Sản phẩm", href: "/products" },
                    { label: "Dành cho bạn", isActive: true }
                ]} />
                <div className="container">
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
    )
}