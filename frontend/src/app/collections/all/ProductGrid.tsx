"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductItem from "@/app/collections/all/ProductItem";
import { useFilters } from "@/app/collections/all/FilterContext";
import WishlistNotification from "@/components/WishlistNotification";

interface Product {
  productId: number;
  itemId: number;
  name: string;
  description?: string;
  category?: string;
  subCategory?: string;
  brand?: string;
  price: number;
  oldPrice?: number | null;
  stock?: number;
  sku?: string;
  imageUrl?: string;
  hasVariation: boolean;
  tags?: string[];
  rating?: number;
  totalRatingCount?: number;
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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const { filters, updateMetadata } = useFilters();
  const [showWishlistNotification, setShowWishlistNotification] = useState(false);
  const pageSize = 24;

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
        // Map frontend sort values to backend
        const sortMap: Record<string, string> = {
          'default': '',
          'alpha-asc': '', // Backend không hỗ trợ sort theo tên
          'alpha-desc': '', // Backend không hỗ trợ sort theo tên
          'price-asc': 'price_asc',
          'price-desc': 'price_desc',
        };

        const backendSort = sortMap[filters.sort] ?? '';

        const { sort, ...filterPayload } = filters;

        const response = await fetch(`http://localhost:5130/api/Search/search`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            query: query || "",
            filters: filterPayload,
            sort: backendSort,
            page: currentPage,
            pageSize: pageSize,
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
        setTotalProducts(Number(data.total));
        setTotalPages(Math.max(1, Math.ceil(Number(data.total) / pageSize)));
        
        const categories = Array.from(
          new Set(
            data.results
              .map((product) => product.category)
              .filter((value): value is string => Boolean(value))
          )
        );
        const brands = Array.from(
          new Set(
            data.results
              .map((product) => product.brand)
              .filter((value): value is string => Boolean(value))
          )
        );
        const priceValues = data.results
          .map((product) => product.price)
          .filter((value): value is number => typeof value === "number" && !Number.isNaN(value));

        updateMetadata({
          categories,
          brands,
          minPrice: priceValues.length ? Math.min(...priceValues) : 0,
          maxPrice: priceValues.length ? Math.max(...priceValues) : 100000000,
        });
        
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
  
    // Ưu tiên tìm kiếm văn bản nếu có query
    if (query) {
      fetchProducts();
    } else if (isImageSearch || isImageSearchStored) {
      loadImageSearchResults();
    } else {
      // Load tất cả sản phẩm khi không có query
      fetchProducts();
    }
  }, [query, isImageSearch, filters, currentPage]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWishlistSuccess = () => {
    setShowWishlistNotification(true);
  };

  const handleAddToCart = (variantId: string) => {
    console.log(`Added to cart: ${variantId}`);
  };

  return (
    <>
      <WishlistNotification
        show={showWishlistNotification}
        onClose={() => setShowWishlistNotification(false)}
        productCount={1}
      />
      <div className="products-view products-view-grid list_hover_pro">
        {isLoading && (
        <div className="loading-container" style={{ padding: '60px 0', textAlign: 'center' }}>
          <div className="spinner-border text-danger" role="status">
            <span className="sr-only">Đang tải...</span>
          </div>
          <p style={{ marginTop: '16px', color: '#666' }}>Đang tải sản phẩm...</p>
        </div>
      )}
      {error && (
        <div className="alert alert-danger" style={{ margin: '20px 0' }}>
          {error}
        </div>
      )}
      {!isLoading && !error && products.length === 0 && (
        <div className="no-products" style={{ padding: '60px 0', textAlign: 'center' }}>
          <p style={{ fontSize: '18px', color: '#999' }}>Không tìm thấy sản phẩm nào.</p>
        </div>
      )}
      {!isLoading && !error && products.length > 0 && (
        <>
          <div className="products-count" style={{ marginBottom: '20px', fontSize: '14px', color: '#666' }}>
            Hiển thị {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalProducts)} của {totalProducts} sản phẩm
          </div>
          <div className="row margin">
            {products.map((product) => (
          <ProductItem
                key={product.productId}
                id={product.productId.toString()}
            title={product.name}
                href={`/products/${product.productId}`}
                imgSrc={product.imageUrl || "/placeholder-product.jpg"}
            alt={product.name}
            price={product.price.toLocaleString("vi-VN") + "₫"}
            comparePrice={
              product.oldPrice && product.oldPrice > 0
                ? product.oldPrice.toLocaleString("vi-VN") + "₫"
                : undefined
            }
            discount={
              product.oldPrice && product.oldPrice > 0 && product.price
                ? `-${Math.round(
                    ((product.oldPrice - product.price) / product.oldPrice) * 100
                  )}%`
                : undefined
            }
                variantId={product.itemId.toString()}
            formAction="/cart/add"
            hasOptions={product.hasVariation}
            isContact={product.price === 0}
            onAddToWishlist={handleWishlistSuccess}
            onAddToCart={handleAddToCart}
          />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '40px', marginBottom: '40px' }}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: currentPage === 1 ? '#f5f5f5' : 'white',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  color: currentPage === 1 ? '#ccc' : '#333',
                }}
              >
                ‹ Trước
              </button>

              {[...Array(Math.min(totalPages, 7))].map((_, index) => {
                let pageNum: number;
                if (totalPages <= 7) {
                  pageNum = index + 1;
                } else if (currentPage <= 4) {
                  pageNum = index + 1;
                } else if (currentPage >= totalPages - 3) {
                  pageNum = totalPages - 6 + index;
                } else {
                  pageNum = currentPage - 3 + index;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      backgroundColor: currentPage === pageNum ? '#e31837' : 'white',
                      color: currentPage === pageNum ? 'white' : '#333',
                      cursor: 'pointer',
                      fontWeight: currentPage === pageNum ? 'bold' : 'normal',
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: currentPage === totalPages ? '#f5f5f5' : 'white',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  color: currentPage === totalPages ? '#ccc' : '#333',
                }}
              >
                Sau ›
              </button>
            </div>
          )}
        </>
      )}
    </div>
    </>
  );
};

export default ProductGrid;