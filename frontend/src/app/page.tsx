// src/app/page.tsx
import React from 'react';
import CategoryMenu from "@/components/Categories/CategoryMenu";
import TrendingSearches from '@/components/sections/TrendingSearchs'; // Import component mới
import ShopNesPopup from '@/components/popups/ShopNesPopup';
import FlashSaleSection from '@/components/sections/FlashSaleSection';
import BannerSlider from '@/components/home/BannerSlider';
import ShortcutSlider from '@/components/ui/ShorcutSlider';
import HomeSlider from '@/components/home/HomeSlider';
import BrandSection from '@/components/sections/BrandSection';
import ThreeBanner from '@/components/Banner/ThreeBanner';
import CategorySection from '@/components/sections/CategorySection';
import BestSellingSectionRight from '@/components/Section_two_col/BestSellingSectionRight';
import BestSellingSectionLeft from '@/components/Section_two_col/BestSellingSectionLeft';
import ProductTab from '@/components/product/ProductTab';
import BlogSection from '@/components/Section_two_col/BlogSection';
import RecommendProduct from '@/components/sections/RecommendProduct';

export default function HomePage() {
  return (
    <>
      <div className="bodywrap">
        <h1 className="d-none">ShopNest - </h1>
        <div className="bg-index">
          <div className="section_first">
            <div className="container">
              <div className="row">
                <div className="col-lg-3 col-left d-lg-block d-none">
                  <CategoryMenu />
                  <TrendingSearches /> {/* Thêm component Xu hướng tìm kiếm */}
                </div>
                <div className="col-lg-9 col-right">
                  <div className="position-sticky">
                    <div className="row">
                      <div className="col-lg-8 col-md-8 col-12">
                        <HomeSlider />
                        <ShortcutSlider />
                      </div>
                      <BannerSlider/>
                    </div>
                    <FlashSaleSection />
                  </div>   
                </div>
              </div>
            </div>
          </div>
          <BrandSection />
          <ThreeBanner />
          <CategorySection />
          <div className="section_two_col">
            <div className="container">
              <div className="row">
                <BestSellingSectionLeft />
                <BestSellingSectionRight />
              </div>
            </div>
          </div>
          <ProductTab />
          <RecommendProduct />
          <BlogSection />
          
        </div>
      </div>
      <ShopNesPopup />
    </>
  );
}