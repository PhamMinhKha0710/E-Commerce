// Service để quản lý wishlist trong localStorage

export interface WishlistItem {
  productId: number;
  addedAt: string;
}

export const wishlistService = {
  // Lấy danh sách wishlist
  getWishlist(): WishlistItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const wishlist = localStorage.getItem('wishlist');
      return wishlist ? JSON.parse(wishlist) : [];
    } catch (error) {
      console.error('Error getting wishlist:', error);
      return [];
    }
  },

  // Thêm sản phẩm vào wishlist
  addToWishlist(productId: number): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const wishlist = this.getWishlist();
      const exists = wishlist.some(item => item.productId === productId);
      
      if (!exists) {
        wishlist.push({
          productId,
          addedAt: new Date().toISOString(),
        });
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        // Dispatch event để các component khác có thể cập nhật
        window.dispatchEvent(new CustomEvent('wishlistUpdated'));
        return true; // Trả về true nếu thêm thành công
      }
      return false; // Trả về false nếu sản phẩm đã tồn tại
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return false;
    }
  },

  // Xóa sản phẩm khỏi wishlist
  removeFromWishlist(productId: number): void {
    if (typeof window === 'undefined') return;
    try {
      const wishlist = this.getWishlist();
      const filtered = wishlist.filter(item => item.productId !== productId);
      localStorage.setItem('wishlist', JSON.stringify(filtered));
      // Dispatch event để các component khác có thể cập nhật
      window.dispatchEvent(new CustomEvent('wishlistUpdated'));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  },

  // Kiểm tra sản phẩm có trong wishlist không
  isInWishlist(productId: number): boolean {
    const wishlist = this.getWishlist();
    return wishlist.some(item => item.productId === productId);
  },

  // Lấy số lượng sản phẩm trong wishlist
  getWishlistCount(): number {
    return this.getWishlist().length;
  },

  // Xóa toàn bộ wishlist
  clearWishlist(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('wishlist');
    window.dispatchEvent(new CustomEvent('wishlistUpdated'));
  },
};

