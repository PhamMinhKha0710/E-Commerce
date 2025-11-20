const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5130";
export const AUTH_REQUIRED_ERROR = "AUTH_REQUIRED";

export interface WishlistItem {
  id: number;
  productId: number;
  name: string;
  slug: string;
  imageUrl: string;
  price: number;
  oldPrice: number;
  currency: string;
  hasVariation: boolean;
  qtyInStock: number;
  productItemId?: number | null;
  categoryId?: number | null;
  addedAt: string;
}

type WishlistEventDetail = {
  type: "synced" | "added" | "removed";
  productId?: number;
};

const createAuthError = () => {
  const error = new Error(AUTH_REQUIRED_ERROR);
  (error as Error & { code?: string }).code = AUTH_REQUIRED_ERROR;
  return error;
};

class WishlistService {
  private items = new Map<number, WishlistItem>();
  private initialized = false;
  private syncing: Promise<void> | null = null;

  private isBrowser() {
    return typeof window !== "undefined";
  }

  private getToken() {
    if (!this.isBrowser()) return null;
    return localStorage.getItem("accessToken");
  }

  private dispatch(detail: WishlistEventDetail) {
    if (!this.isBrowser()) return;
    window.dispatchEvent(new CustomEvent<WishlistEventDetail>("wishlistUpdated", { detail }));
  }

  private async fetchFromApi() {
    const token = this.getToken();
    if (!token) {
      this.clearCache();
      throw createAuthError();
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        this.clearCache();
        throw createAuthError();
      }

      if (!response.ok) {
        let errorMessage = "Không thể tải danh sách yêu thích";
        try {
          const errorText = await response.text();
          if (errorText) {
            try {
              const errorJson = JSON.parse(errorText);
              errorMessage = errorJson.message || errorJson.title || errorText;
            } catch {
              errorMessage = errorText || errorMessage;
            }
          }
        } catch {
          // Use default error message if parsing fails
        }
        console.error(`Wishlist API error (${response.status}):`, errorMessage);
        throw new Error(errorMessage);
      }

      const data: WishlistItem[] = await response.json();
      this.items.clear();
      data.forEach((item) => this.items.set(item.productId, item));
      this.initialized = true;
      this.dispatch({ type: "synced" });
    } catch (error) {
      if (error instanceof Error && error.message === AUTH_REQUIRED_ERROR) {
        throw error;
      }
      console.error("Error fetching wishlist:", error);
      throw error instanceof Error 
        ? error 
        : new Error("Không thể tải danh sách yêu thích");
    }
  }

  async sync(force = false) {
    if (!this.isBrowser()) return;
    if (this.initialized && !force) return;
    if (this.syncing) {
      await this.syncing;
      return;
    }
    this.syncing = this.fetchFromApi().finally(() => {
      this.syncing = null;
    });
    await this.syncing;
  }

  async getWishlist(force = false) {
    await this.sync(force);
    return this.getCachedWishlist();
  }

  getCachedWishlist() {
    return Array.from(this.items.values());
  }

  getWishlistCount() {
    return this.items.size;
  }

  isInWishlist(productId: number) {
    return this.items.has(productId);
  }

  async addToWishlist(productId: number) {
    const token = this.getToken();
    if (!token) {
      this.clearCache();
      throw createAuthError();
    }

    const response = await fetch(`${API_BASE_URL}/api/wishlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId }),
    });

    if (response.status === 401) {
      this.clearCache();
      throw createAuthError();
    }

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "Không thể thêm sản phẩm vào yêu thích");
    }

    const item: WishlistItem = await response.json();
    this.items.set(item.productId, item);
    this.initialized = true;
    this.dispatch({ type: "added", productId: item.productId });
    return item;
  }

  async removeFromWishlist(productId: number) {
    const token = this.getToken();
    if (!token) {
      this.clearCache();
      throw createAuthError();
    }

    const response = await fetch(`${API_BASE_URL}/api/wishlist/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      this.clearCache();
      throw createAuthError();
    }

    if (!response.ok && response.status !== 404) {
      const message = await response.text();
      throw new Error(message || "Không thể xóa sản phẩm khỏi yêu thích");
    }

    this.items.delete(productId);
    this.dispatch({ type: "removed", productId });
  }

  clearCache() {
    this.items.clear();
    this.initialized = false;
    if (this.isBrowser()) {
      this.dispatch({ type: "synced" });
    }
  }
}

export const wishlistService = new WishlistService();