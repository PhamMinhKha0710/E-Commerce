'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '@/components/sections/Breadcrum';
import { wishlistService, WishlistItem, AUTH_REQUIRED_ERROR } from '@/services/wishlistService';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import './WishlistPage.css';

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const loadWishlist = async (force = false) => {
      if (!isLoggedIn) {
        setAuthMessage('Vui lòng đăng nhập để xem danh sách yêu thích');
        setWishlistItems([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      setAuthMessage(null);

      try {
        const items = await wishlistService.getWishlist(force);
        if (isMounted) {
          setWishlistItems(items);
        }
      } catch (err) {
        const message = (err as Error)?.message;
        if (message === AUTH_REQUIRED_ERROR) {
          if (isMounted) {
            setAuthMessage('Vui lòng đăng nhập để xem danh sách yêu thích');
            setWishlistItems([]);
          }
        } else {
          console.error('Error loading wishlist:', err);
          if (isMounted) {
            setError('Không thể tải danh sách yêu thích. Vui lòng thử lại sau.');
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadWishlist(true);

    const handleWishlistUpdate = () => {
      setWishlistItems(wishlistService.getCachedWishlist());
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('wishlistUpdated', handleWishlistUpdate as EventListener);
    }

    return () => {
      isMounted = false;
      if (typeof window !== 'undefined') {
        window.removeEventListener('wishlistUpdated', handleWishlistUpdate as EventListener);
      }
    };
  }, [isLoggedIn]);

  const handleRemoveFromWishlist = async (productId: number) => {
    try {
      await wishlistService.removeFromWishlist(productId);
      setWishlistItems(wishlistService.getCachedWishlist());
    } catch (err) {
      const message = (err as Error)?.message;
      if (message === AUTH_REQUIRED_ERROR) {
        setAuthMessage('Vui lòng đăng nhập để xem danh sách yêu thích');
      } else {
        setError('Không thể xóa sản phẩm khỏi danh sách yêu thích. Vui lòng thử lại.');
      }
    }
  };

  const handleAddToCart = async (product: WishlistItem) => {
    if (product.hasVariation) {
      // Nếu có biến thể, chuyển đến trang chi tiết
      window.location.href = `/products/${product.productId}`;
    } else {
      // Thêm trực tiếp vào giỏ hàng
      await addToCart({
        productId: product.productId,
        productName: product.name,
        imageUrl: product.imageUrl,
        price: product.price,
        quantity: 1,
        currency: product.currency || 'VND',
        hasVariations: product.hasVariation,
        productItemId: product.productItemId ?? null,
        categoryId: product.categoryId ?? 0,
      });
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + '₫';
  };

  const calculateDiscount = (oldPrice: number, price: number) => {
    if (oldPrice > 0 && price < oldPrice) {
      return Math.round(((oldPrice - price) / oldPrice) * 100);
    }
    return 0;
  };

  return (
    <div className="wishlist-page">
      <div className="container">
        <Breadcrumb items={[
          { label: "Trang chủ", href: "/" },
          { label: "Yêu thích", isActive: true }
        ]} />

        <div className="wishlist-header">
          <h1 className="wishlist-title">Danh sách yêu thích</h1>
          {wishlistItems.length > 0 && (
            <p className="wishlist-count">
              Bạn có <strong>{wishlistItems.length}</strong> sản phẩm trong danh sách yêu thích
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="wishlist-loading">
            <div className="loading-spinner"></div>
            <p>Đang tải danh sách yêu thích...</p>
          </div>
        ) : error ? (
          <div className="wishlist-error">
            <p>{error}</p>
          </div>
        ) : authMessage ? (
          <div className="wishlist-error">
            <p>{authMessage}</p>
            <Link href="/auth/login" className="continue-shopping-btn">
              Đăng nhập ngay
            </Link>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="wishlist-empty">
            <div className="empty-icon">
              <svg width="120" height="120" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"
                  fill="#e0e0e0"
                />
              </svg>
            </div>
            <h2>Danh sách yêu thích trống</h2>
            <p>Hãy thêm sản phẩm bạn yêu thích khi mua sắm để xem lại thuận tiện nhất</p>
            <Link href="/" className="continue-shopping-btn">
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="wishlist-content">
            <div className="wishlist-grid">
              {wishlistItems.map((product) => {
                const discount = calculateDiscount(product.oldPrice, product.price);
                const imageSrc = product.imageUrl || '/images/placeholder.jpg';
                const isExternalImage = imageSrc.startsWith('http');
                const productUrl = `/products/${product.productId}`;
                return (
                  <div key={product.productId} className="wishlist-item">
                    <div className="wishlist-item-image">
                      <Link href={productUrl}>
                        {isExternalImage ? (
                          <img
                            src={imageSrc}
                            alt={product.name}
                            className="product-image"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/images/placeholder.jpg';
                            }}
                          />
                        ) : (
                          <Image
                            src={imageSrc}
                            alt={product.name}
                            width={300}
                            height={300}
                            className="product-image"
                          />
                        )}
                      </Link>
                      {discount > 0 && (
                        <span className="discount-badge">-{discount}%</span>
                      )}
                      <button
                        className="remove-wishlist-btn"
                        onClick={() => handleRemoveFromWishlist(product.productId)}
                        title="Xóa khỏi yêu thích"
                      >
                        <svg width="20" height="20" viewBox="0 0 512 512" fill="currentColor">
                          <path d="M256 448l-30.164-27.211C118.718 322.442 48 258.61 48 179.095 48 114.221 97.918 64 162.4 64c36.399 0 70.717 16.742 93.6 43.947C278.882 80.742 313.199 64 349.6 64 414.082 64 464 114.221 464 179.095c0 79.516-70.719 143.348-177.836 241.694L256 448z" />
                        </svg>
                      </button>
                    </div>
                    <div className="wishlist-item-info">
                      <h3 className="product-name">
                        <Link href={productUrl}>{product.name}</Link>
                      </h3>
                      <div className="product-price">
                        {product.price > 0 ? (
                          <>
                            <span className="current-price">{formatPrice(product.price)}</span>
                            {product.oldPrice > 0 && product.oldPrice > product.price && (
                              <span className="old-price">{formatPrice(product.oldPrice)}</span>
                            )}
                          </>
                        ) : (
                          <span className="contact-price">Liên hệ</span>
                        )}
                      </div>
                      <div className="product-stock">
                        {product.qtyInStock > 0 ? (
                          <span className="in-stock">Còn hàng</span>
                        ) : (
                          <span className="out-of-stock">Hết hàng</span>
                        )}
                      </div>
                      <div className="wishlist-item-actions">
                        <button
                          className="btn-add-to-cart"
                          onClick={() => handleAddToCart(product)}
                          disabled={product.qtyInStock === 0}
                        >
                          {product.hasVariation ? 'Chọn mua' : 'Thêm vào giỏ'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

