"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductItem from "./ProductItem";

interface Product {
  productId: number;
  itemId: number;
  name: string;
  description: string;
  category: string;
  subCategory: string;
  brand: string;
  price: number;
  oldPrice: number;
  stock: number;
  sku: string;
  imageUrl: string;
  popularityScore: number;
  hasVariation: boolean;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  rating: number;
  totalRatingCount: number;
  status: boolean;
}

interface SearchResponse {
  total: number;
  page: number;
  pageSize: number;
  results: Product[];
}

const ProductGrid: React.FC = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const isImageSearch = searchParams.get("imageSearch") === "true";
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Hàm tải dữ liệu từ localStorage
  const loadImageSearchResults = () => {
    const storedResults = localStorage.getItem("imageSearchResults");
    if (storedResults) {
      try {
        const results = JSON.parse(storedResults) as Product[];
        setProducts(results);
      } catch (err) {
        console.error("Error parsing image search results:", err);
        setError("Không thể tải kết quả tìm kiếm bằng hình ảnh.");
      }
    } else {
      setError("Không tìm thấy kết quả tìm kiếm bằng hình ảnh.");
    }
    setIsLoading(false);
  };

  // Lắng nghe custom event từ Header
  useEffect(() => {
    const handleImageSearchUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ results: Product[] }>;
      setProducts(customEvent.detail.results);
      setIsLoading(false);
      setError(null);
    };

    window.addEventListener("imageSearchUpdated", handleImageSearchUpdate);

    return () => {
      window.removeEventListener("imageSearchUpdated", handleImageSearchUpdate);
    };
  }, []);

  // Xử lý tìm kiếm và tải dữ liệu
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:5130/api/Search/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            query: query,
            filters: {
              category: [],
              subCategory: [],
              priceRange: { min: 0, max: 100000000 },
              brand: [],
              variations: [],
            },
            sort: "",
            page: 1,
            pageSize: 20,
          }),
        });
  
        if (!response.ok) {
          console.error(`API error: Status ${response.status}, StatusText: ${response.statusText}`);
          try {
            const errorData = await response.json();
            console.error("Error details:", errorData);
          } catch {
            console.error("Could not parse error response");
          }
          throw new Error("Failed to fetch products");
        }
  
        const data: SearchResponse = await response.json();
        setProducts(data.results);
        // Xóa dữ liệu tìm kiếm hình ảnh khi thực hiện tìm kiếm văn bản
        localStorage.removeItem("imageSearchResults");
        localStorage.removeItem("isImageSearch");
      } catch (err) {
        setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
        console.error("Error fetching products:", err);
      } finally {
        setIsLoading(false);
      }
    };
  
    const isImageSearchStored = localStorage.getItem("isImageSearch") === "true";
  
    if (isImageSearch || isImageSearchStored) {
      loadImageSearchResults();
    } else if (query) {
      fetchProducts();
    } else {
      // Kiểm tra localStorage ngay cả khi không có query hoặc imageSearch
      loadImageSearchResults();
    }
  }, [query, isImageSearch]);

  const handleAddToWishlist = (wish: string) => {
    console.log(`Added to wishlist: ${wish}`);
  };

  const handleAddToCart = (variantId: string) => {
    console.log(`Added to cart: ${variantId}`);
  };

  return (
    <div className="products-view products-view-grid list_hover_pro">
      {isLoading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}
      {!isLoading && !error && products.length === 0 && (
        <div>Không tìm thấy sản phẩm nào.</div>
      )}
      <div className="row margin">
        {products.map((product) => (
          <ProductItem
            key={product.productId}
            id={product.productId.toString()}
            title={product.name}
            href={`/products/${product.sku}`}
            imgSrc={product.imageUrl}
            alt={product.name}
            price={product.price.toLocaleString("vi-VN") + "₫"}
            comparePrice={
              product.oldPrice
                ? product.oldPrice.toLocaleString("vi-VN") + "₫"
                : undefined
            }
            discount={
              product.oldPrice && product.price
                ? `-${Math.round(
                    ((product.oldPrice - product.price) / product.oldPrice) * 100
                  )}%`
                : undefined
            }
            variantId={product.itemId.toString()}
            formAction="https://nd-mall.mysapo.net/cart/add"
            hasOptions={product.hasVariation}
            isContact={product.price === 0}
            onAddToWishlist={handleAddToWishlist}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;