// Service để fetch sản phẩm theo category
// Tách riêng để có thể tái sử dụng ở nhiều component

import apiClient from "@/lib/apiClient";
import { categoryService } from "./categoryService";

export interface CategoryProduct {
  productId: string;
  productName: string;
  price: string;
  comparePrice?: string;
  imageUrl: string;
  discount?: string;
  href: string;
  slug: string;
  hasVariations?: boolean;
  categoryId?: number;
  productItemId?: number;
}

export type RecommendationType = 'popularity' | 'content' | 'collaborative' | 'hybrid';

interface FetchCategoryProductsOptions {
  categorySlug?: string;
  categoryName?: string;
  categoryId?: number;
  limit?: number;
  useRecommendations?: boolean; // Nếu true, dùng API recommendations, nếu false dùng API products trực tiếp
  productId?: number; // ID sản phẩm đang xem (cho content-based recommendation)
  recommendationType?: RecommendationType; // Loại recommendation (chỉ dùng khi useRecommendations = true)
}

class CategoryProductService {
  private cache: Map<string, { data: CategoryProduct[]; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Tìm categoryId từ slug hoặc tên category
   */
  private async findCategoryId(
    categorySlug?: string,
    categoryName?: string
  ): Promise<number | null> {
    console.log(`[CategoryProductService] Finding categoryId for slug: "${categorySlug}", name: "${categoryName}"`);
    
    // Nếu có categorySlug, thử tìm bằng slug trước
    if (categorySlug) {
      let category = await categoryService.findCategoryBySlug(categorySlug);
      if (category?.id) {
        console.log(`[CategoryProductService] Found category by slug: ${category.id} - ${category.title}`);
        return category.id;
      } else {
        console.warn(`[CategoryProductService] Category not found by slug: "${categorySlug}"`);
      }
    }

    // Nếu có categoryName, thử tìm bằng tên
    if (categoryName) {
      let category = await categoryService.findCategoryByName(categoryName);
      if (category?.id) {
        console.log(`[CategoryProductService] Found category by name: ${category.id} - ${category.title}`);
        return category.id;
      } else {
        console.warn(`[CategoryProductService] Category not found by name: "${categoryName}"`);
      }
    }

    // Nếu vẫn không tìm được, thử fetch tất cả categories và tìm thủ công
    if (categorySlug || categoryName) {
      console.log(`[CategoryProductService] Trying to find category manually from all categories`);
      const allCategories = await categoryService.getAllCategories();
      console.log(`[CategoryProductService] Total categories available: ${allCategories.length}`);
      
      const searchTerm = categoryName || categorySlug || "";
      const normalizedSearch = searchTerm.toLowerCase().trim();
      console.log(`[CategoryProductService] Searching for: "${normalizedSearch}"`);

      const foundCategory = allCategories.find((cat) => {
        const normalizedTitle = cat.title.toLowerCase().trim();
        const matches = (
          normalizedTitle === normalizedSearch ||
          normalizedTitle.includes(normalizedSearch) ||
          normalizedSearch.includes(normalizedTitle)
        );
        if (matches) {
          console.log(`[CategoryProductService] Potential match: ${cat.id} - "${cat.title}"`);
        }
        return matches;
      });

      if (foundCategory) {
        console.log(`[CategoryProductService] Found category manually: ${foundCategory.id} - ${foundCategory.title}`);
        return foundCategory.id;
      } else {
        console.warn(`[CategoryProductService] No category found matching "${searchTerm}"`);
        // Log một số categories để debug
        if (allCategories.length > 0) {
          console.log(`[CategoryProductService] Sample categories:`, allCategories.slice(0, 5).map(c => `${c.id}: ${c.title}`));
        }
      }
    }

    console.error(`[CategoryProductService] Could not find categoryId for slug: "${categorySlug}", name: "${categoryName}"`);
    return null;
  }

  /**
   * Map dữ liệu từ API sang format CategoryProduct
   */
  private mapApiProductToCategoryProduct(item: any): CategoryProduct {
    const href = item.href || `/products/${item.productId}-${item.slug}`;

    return {
      productId: item.productId.toString(),
      productName: item.productName,
      price: item.price || "",
      comparePrice: item.comparePrice || undefined,
      imageUrl: item.imageUrl,
      discount: item.discount || undefined,
      href: href, // Format: /products/{id}-{slug}
      slug: item.slug,
      hasVariations: item.hasVariations || false,
      categoryId: item.categoryId,
      productItemId: item.productItemId,
    };
  }

  /**
   * Fetch sản phẩm từ API Recommendations
   * Hỗ trợ nhiều loại recommendation: popularity, content-based, collaborative, hybrid
   */
  private async fetchFromRecommendations(
    categoryId: number,
    limit: number,
    productId?: number,
    recommendationType: RecommendationType = 'hybrid'
  ): Promise<CategoryProduct[]> {
    try {
      // Build query params
      const params: any = { 
        limit 
      };

      // Chỉ thêm categoryId nếu > 0 (0 có nghĩa là không filter theo category)
      if (categoryId > 0) {
        params.categoryId = categoryId;
      }

      // Thêm productId nếu có (cho content-based recommendation)
      if (productId) {
        params.productId = productId;
      }

      // Note: Backend hiện tại tự động sử dụng hybrid system
      // recommendationType có thể được sử dụng trong tương lai khi backend hỗ trợ
      // Hiện tại chỉ gửi params cơ bản

      console.log(`[CategoryProductService] Fetching recommendations with params:`, params);

      const response = await apiClient.get("/api/recommendations/recommend", {
        params,
      });

      const data = response.data;

      if (!data || data.length === 0) {
        console.warn(`[CategoryProductService] No recommendations returned from API`);
        return [];
      }

      console.log(`[CategoryProductService] Received ${data.length} recommendations`);

      // Filter và map sản phẩm
      // Lưu ý: Backend đã filter theo category, nhưng vẫn kiểm tra lại để đảm bảo
      const filtered = data
        .filter((item: any) => {
          // Chỉ lấy sản phẩm cùng category (nếu có categoryId và categoryId > 0)
          if (categoryId > 0 && item.categoryId && item.categoryId !== categoryId) {
            return false;
          }
          return true;
        })
        .map((item: any) => this.mapApiProductToCategoryProduct(item));

      console.log(`[CategoryProductService] Mapped ${filtered.length} products after filtering`);
      return filtered;
    } catch (error: any) {
      console.error(`[CategoryProductService] Error fetching recommendations:`, error);
      console.error(`[CategoryProductService] Error details:`, {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      // Trả về mảng rỗng thay vì throw error để component có thể xử lý
      return [];
    }
  }

  /**
   * Fetch sản phẩm từ API Products trực tiếp
   */
  private async fetchFromProducts(
    categoryId: number,
    limit: number
  ): Promise<CategoryProduct[]> {
    const response = await apiClient.get("/api/Products", {
      params: {
        categoryId,
        page: 1,
        pageSize: limit,
      },
    });

    const data = response.data;

    if (!data || !data.products || data.products.length === 0) {
      return [];
    }

    // Map sản phẩm từ API Products
    return data.products.map((item: any) => {
      // API Products có format khác, cần map lại
      const productItem = item.items?.[0]; // Lấy item đầu tiên
      const imageUrl =
        productItem?.imageUrl ||
        item.images?.[0]?.imageUrl ||
        item.imageUrl ||
        "";

      return {
        productId: item.id.toString(),
        productName: item.name || item.productName || "",
        price: productItem?.price
          ? `${productItem.price.toLocaleString("vi-VN")}₫`
          : "",
        comparePrice: productItem?.comparePrice
          ? `${productItem.comparePrice.toLocaleString("vi-VN")}₫`
          : undefined,
        imageUrl: imageUrl,
        discount: productItem?.discount
          ? `-${productItem.discount}%`
          : undefined,
        href: `/products/${item.id}-${item.slug || item.name?.toLowerCase().replace(/\s+/g, "-")}`,
        slug: item.slug || item.name?.toLowerCase().replace(/\s+/g, "-") || "",
        hasVariations: (item.items?.length || 0) > 1,
        categoryId: item.productCategoryId || item.categoryId,
        productItemId: productItem?.id,
      };
    });
  }

  /**
   * Fetch sản phẩm theo category
   * Hỗ trợ nhiều loại recommendation và tùy chọn productId
   */
  async getProductsByCategory(
    options: FetchCategoryProductsOptions
  ): Promise<CategoryProduct[]> {
    const {
      categorySlug,
      categoryName,
      categoryId: providedCategoryId,
      limit = 10,
      useRecommendations = true,
      productId,
      recommendationType = 'hybrid',
    } = options;

    // Tạo cache key (bao gồm productId và recommendationType nếu có)
    const cacheKey = `category-products:${categorySlug || categoryName || providedCategoryId}:${limit}:${useRecommendations}:${productId || 'none'}:${recommendationType}`;

    // Kiểm tra cache
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      // Xác định categoryId
      let finalCategoryId: number | undefined = providedCategoryId;

      if (!finalCategoryId && (categorySlug || categoryName)) {
        const foundCategoryId = await this.findCategoryId(categorySlug, categoryName);
        finalCategoryId = foundCategoryId ?? undefined; // Convert null to undefined
      }

      // Khai báo biến products trước
      let products: CategoryProduct[];

      // Nếu không có categoryId và không có productId, không thể fetch
      if (!finalCategoryId && !productId) {
        console.warn(
          `[CategoryProductService] Cannot find categoryId for slug "${categorySlug}" or name "${categoryName}" and no productId provided`
        );
        console.warn(
          `[CategoryProductService] Attempting to fetch without categoryId (backend will use popularity-based)`
        );
        // Thử fetch không có categoryId - backend sẽ dùng popularity-based
        if (useRecommendations) {
          products = await this.fetchFromRecommendations(
            0, // Không filter theo category
            limit,
            undefined,
            recommendationType
          );
          if (products.length > 0) {
            console.log(`[CategoryProductService] Successfully fetched ${products.length} products without categoryId`);
            this.cache.set(cacheKey, {
              data: products,
              timestamp: Date.now(),
            });
            return products;
          }
        }
        return [];
      }

      // Fetch sản phẩm

      if (useRecommendations) {
        // Nếu có productId nhưng không có categoryId, vẫn có thể fetch (backend sẽ tự tìm categoryId)
        // Nếu categoryId = 0, backend sẽ bỏ qua filter category
        products = await this.fetchFromRecommendations(
          finalCategoryId || 0, // 0 hoặc undefined sẽ được backend xử lý
          limit,
          productId || undefined, // Convert null to undefined
          recommendationType
        );
        
        // Fallback: Nếu recommendations không trả về sản phẩm và có categoryId, thử dùng API Products trực tiếp
        if (products.length === 0 && finalCategoryId) {
          console.warn(
            `[CategoryProductService] No products from recommendations, trying direct Products API for categoryId: ${finalCategoryId}`
          );
          products = await this.fetchFromProducts(finalCategoryId, limit);
        }
      } else {
        // Nếu không dùng recommendations, cần có categoryId
        if (!finalCategoryId) {
          console.warn(
            `[CategoryProductService] categoryId is required when useRecommendations is false`
          );
          return [];
        }
        products = await this.fetchFromProducts(finalCategoryId, limit);
      }

      // Lưu vào cache
      this.cache.set(cacheKey, {
        data: products,
        timestamp: Date.now(),
      });

      return products;
    } catch (error: any) {
      console.error(
        `[CategoryProductService] Error fetching products:`,
        error
      );
      console.error(
        `[CategoryProductService] Error details:`,
        error.response?.data || error.message
      );
      return [];
    }
  }

  /**
   * Xóa cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Xóa cache cho một category cụ thể
   */
  clearCacheForCategory(categorySlug?: string, categoryName?: string): void {
    if (categorySlug) {
      const keysToDelete: string[] = [];
      this.cache.forEach((_, key) => {
        if (key.includes(categorySlug)) {
          keysToDelete.push(key);
        }
      });
      keysToDelete.forEach((key) => this.cache.delete(key));
    }

    if (categoryName) {
      const keysToDelete: string[] = [];
      this.cache.forEach((_, key) => {
        if (key.includes(categoryName)) {
          keysToDelete.push(key);
        }
      });
      keysToDelete.forEach((key) => this.cache.delete(key));
    }
  }
}

export const categoryProductService = new CategoryProductService();

