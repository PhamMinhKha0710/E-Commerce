"use client";

import { useEffect, useState } from "react";
import ProductSection from "@/components/sections/ProductSection";
import apiClient from "@/lib/apiClient";

interface ProductDto {
  categoryId: number;
  productId: number;
  productName: string;
  href: string;
  slug: string;
  imageUrl: string;
  price?: string;
  comparePrice?: string;
  discount?: string;
  hasVariations?: boolean;
  contact?: boolean;
  productItemId?: number | null;
}

const fallbackProducts: ProductDto[] = [
  {
    categoryId: 1,
    productId: 32899086,
    productName: "iPhone 14 Pro Max",
    href: "/products/32899086-iphone-14-pro-max",
    slug: "iphone-14-pro-max",
    imageUrl: "https://bizweb.dktcdn.net/thumb/large/100/497/938/products/a2.jpg?v=1696321699110",
    price: "26.000.000₫",
    comparePrice: "28.000.000₫",
    discount: "-7%",
    hasVariations: true,
    productItemId: 1,
  },
  {
    categoryId: 1,
    productId: 32898940,
    productName: "iPhone 15 Pro Max Titan Xanh 256g",
    href: "/products/32898940-iphone-15-pro-max-titan-xanh-256g",
    slug: "iphone-15-pro-max-titan-xanh-256g",
    imageUrl: "https://bizweb.dktcdn.net/thumb/large/100/497/938/products/a1.jpg?v=1696321359880",
    price: "34.000.000₫",
    comparePrice: "36.000.000₫",
    discount: "-6%",
    hasVariations: false,
    productItemId: 1,
  },
];

const RecommendProduct = () => {
  const [productsData, setProductsData] = useState<ProductDto[]>(fallbackProducts);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiClient.get<ProductDto[]>("/api/recommendations/recommend", {
          params: { limit: 12 },
        });
        if (Array.isArray(res.data) && res.data.length > 0) {
          setProductsData(res.data);
        }
      } catch (err) {
        // fallback giữ nguyên
        console.error("Failed to load recommendations", err);
      }
    };
    load();
  }, []);

  // Ép kiểu an toàn sang ProductSection props (đảm bảo productItemId luôn có giá trị null nếu undefined)
  const mapped = productsData.map(p => ({
    ...p,
    productItemId: p.productItemId ?? null,
  }));

  return <ProductSection productsData={mapped} />;
};

export default RecommendProduct;