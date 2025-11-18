'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '@/components/sections/Breadcrum';
import { wishlistService, WishlistItem } from '@/services/wishlistService';
import { useCart } from '@/context/CartContext';
import './WishlistPage.css';

interface Product {
  id: number;
  name: string;
  slug: string;
  imageUrl: string;
  price: number;
  oldPrice: number;
  currency: string;
  hasVariation: boolean;
  qtyInStock: number;
  categoryId?: number;
  productItemId?: number | null;
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  // Load wishlist và fetch product details
  useEffect(() => {
    const loadWishlist = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const items = wishlistService.getWishlist();
        setWishlistItems(items);

        if (items.length === 0) {
          setIsLoading(false);
          return;
        }

        // Fetch product details từ API
        const productIds = items.map(item => item.productId);
        const productPromises = productIds.map(async (id) => {
          try {
            const response = await fetch(`http://localhost:5130/api/Products/${id}/detail`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            if (response.ok) {
              const data = await response.json();
              // API trả về ProductId, Image, HasVariations, Availability
              const isInStock = data.availability === 'InStock';
              return {
                id: data.productId || data.id,
                name: data.name,
                slug: data.slug || `products/${data.productId || data.id}`,
                imageUrl: data.image || data.imageUrl || '/images/placeholder.jpg',
                price: data.price || 0,
                oldPrice: data.oldPrice || 0,
                currency: '₫',
                hasVariation: data.hasVariations || data.hasVariation || false,
                qtyInStock: isInStock ? 1 : 0, // Sử dụng Availability để xác định stock
                categoryId: data.categoryId || 0,
                productItemId: data.defaultCombinationId ? parseInt(data.defaultCombinationId) : null,
              };
            }
            return null;
          } catch (err) {
            console.error(`Error fetching product ${id}:`, err);
            return null;
          }
        });

        const fetchedProducts = await Promise.all(productPromises);
        const validProducts = fetchedProducts.filter(p => p !== null) as Product[];
        setProducts(validProducts);
      } catch (err) {
        console.error('Error loading wishlist:', err);
        setError('Không thể tải danh sách yêu thích. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlist();

    // Lắng nghe event khi wishlist được cập nhật
    const handleWishlistUpdate = () => {
      loadWishlist();
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, []);

  const handleRemoveFromWishlist = (productId: number) => {
    wishlistService.removeFromWishlist(productId);
    setProducts(products.filter(p => p.id !== productId));
    setWishlistItems(wishlistItems.filter(item => item.productId !== productId));
  };

  const handleAddToCart = async (product: Product) => {
    if (product.hasVariation) {
      // Nếu có biến thể, chuyển đến trang chi tiết
      window.location.href = `/products/${product.id}`;
    } else {
      // Thêm trực tiếp vào giỏ hàng
      await addToCart({
        productId: product.id,
        productName: product.name,
        imageUrl: product.imageUrl,
        price: product.price,
        quantity: 1,
        currency: 'VND',
        hasVariations: product.hasVariation,
        productItemId: product.productItemId || null,
        categoryId: product.categoryId || 0,
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
        ) : products.length === 0 ? (
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
              {products.map((product) => {
                const discount = calculateDiscount(product.oldPrice, product.price);
                const imageSrc = product.imageUrl || '/images/placeholder.jpg';
                const isExternalImage = imageSrc.startsWith('http');
                return (
                  <div key={product.id} className="wishlist-item">
                    <div className="wishlist-item-image">
                      <Link href={`/products/${product.id}`}>
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
                        onClick={() => handleRemoveFromWishlist(product.id)}
                        title="Xóa khỏi yêu thích"
                      >
                        <svg width="20" height="20" viewBox="0 0 512 512" fill="currentColor">
                          <path d="M256 448l-30.164-27.211C118.718 322.442 48 258.61 48 179.095 48 114.221 97.918 64 162.4 64c36.399 0 70.717 16.742 93.6 43.947C278.882 80.742 313.199 64 349.6 64 414.082 64 464 114.221 464 179.095c0 79.516-70.719 143.348-177.836 241.694L256 448z" />
                        </svg>
                      </button>
                    </div>
                    <div className="wishlist-item-info">
                      <h3 className="product-name">
                        <Link href={`/products/${product.id}`}>{product.name}</Link>
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

