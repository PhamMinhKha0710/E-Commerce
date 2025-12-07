'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import './BlogPage.css';
import { getAllPosts, getHighlightedPosts, getPostsByCategory, BlogPostData } from '@/data/blogPosts';

export default function BlogPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  // Sử dụng dữ liệu có sẵn
  const allPosts = useMemo(() => getAllPosts(), []);
  const highlightedPosts = useMemo(() => getHighlightedPosts(), []);
  const tipsPosts = useMemo(() => getPostsByCategory('Mẹo vặt'), []);

  // Tính toán phân trang
  const totalPages = Math.ceil(allPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const posts = allPosts.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="blog-page">
      <div className="container">
        <div className="page-header-blog">
          <h1 className="page-title-blog">Tin tức</h1>
        </div>

        <div className="blog-layout">
          {/* Main Content */}
          <div className="blog-main">
            {posts.length === 0 ? (
              <div className="no-posts">
                <p>Chưa có bài viết nào. Vui lòng thêm dữ liệu vào database.</p>
              </div>
            ) : (
              <>
                <div className="blog-grid">
                  {posts.map((post, index) => (
                <article key={post.id} className={`blog-card ${index === 0 ? 'featured' : ''}`}>
                  <Link href={`/tin-tuc/${post.slug}`} className="blog-card-link">
                    <div className="blog-card-image">
                      <img src={post.imageUrl} alt={post.title} />
                      <div className="blog-card-overlay">
                        <span className="read-more-btn">Đọc thêm</span>
                      </div>
                    </div>
                    <div className="blog-card-content">
                      <h2 className="blog-card-title">{post.title}</h2>
                      <div className="blog-card-meta">
                        <span className="blog-date">{post.publishedDate || new Date().toLocaleDateString('vi-VN')}</span>
                        {post.author && (
                          <>
                            <span className="separator">-</span>
                            <span className="blog-author">{post.author}</span>
                          </>
                        )}
                      </div>
                      <p className="blog-card-excerpt">{post.excerpt || post.description || ''}</p>
                    </div>
                  </Link>
                </article>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                  </button>
                </div>
              )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <aside className="blog-sidebar">
            {/* Tin nổi bật */}
            {highlightedPosts.length > 0 && (
              <div className="sidebar-widget">
                <h3 className="widget-title">Tin nổi bật</h3>
                <div className="widget-content">
                  {highlightedPosts.map((post, index) => (
                  <div key={post.id} className="sidebar-post">
                    <span className="sidebar-post-number">{index + 1}</span>
                    <Link href={`/tin-tuc/${post.slug}`} className="sidebar-post-title">
                      {post.title}
                    </Link>
                  </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mẹo vặt */}
            {tipsPosts.length > 0 && (
              <div className="sidebar-widget">
                <h3 className="widget-title">Mẹo vặt</h3>
                <div className="widget-content">
                  {tipsPosts.map((post) => (
                  <div key={post.id} className="sidebar-post-item">
                    <Link href={`/tin-tuc/${post.slug}`} className="sidebar-post-link">
                      <div className="sidebar-post-image">
                        <img src={post.imageUrl} alt={post.title} />
                      </div>
                      <div className="sidebar-post-info">
                        <h4 className="sidebar-post-title-small">{post.title}</h4>
                        <span className="sidebar-post-date">{post.publishedDate || new Date().toLocaleDateString('vi-VN')}</span>
                      </div>
                    </Link>
                  </div>
                  ))}
                </div>
              </div>
            )}

            {/* Newsletter */}
            <div className="sidebar-widget newsletter-widget">
              <h3 className="widget-title">Đăng ký nhận tin</h3>
              <p className="newsletter-description">
                Nhận tin tức và ưu đãi mới nhất qua email
              </p>
              <form className="newsletter-form">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="newsletter-button">
                  Đăng ký
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

