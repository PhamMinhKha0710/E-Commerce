'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { blogService, BlogPostDetail } from '@/services/blogService';
import './BlogDetail.css';

interface BlogDetailProps {
  initialPost?: BlogPostDetail;
  slug: string;
}

export default function BlogDetail({ initialPost, slug }: BlogDetailProps) {
  const [post, setPost] = useState<BlogPostDetail | null>(initialPost || null);
  const [loading, setLoading] = useState(!initialPost);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialPost) {
      const fetchPost = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await blogService.getPostBySlug(slug);
          setPost(data);
        } catch (err: any) {
          setError(err.message || 'Không thể tải bài viết');
          setPost(null);
        } finally {
          setLoading(false);
        }
      };

      fetchPost();
    }
  }, [slug, initialPost]);

  if (loading) {
    return (
      <div className="blog-detail-page">
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Đang tải bài viết...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="blog-detail-page">
        <div className="container">
          <div className="error-message">
            <h2>Không tìm thấy bài viết</h2>
            <p>{error || 'Bài viết không tồn tại hoặc đã bị xóa.'}</p>
            <Link href="/tin-tuc" className="back-link">
              ← Quay lại trang tin tức
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="blog-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link href="/">Trang chủ</Link>
          <span className="breadcrumb-separator">/</span>
          <Link href="/tin-tuc">Tin tức</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{post.title}</span>
        </nav>

        <article className="blog-detail">
          {/* Header */}
          <header className="blog-detail-header">
            <div className="blog-detail-meta">
              <span className="blog-category">{post.category}</span>
              <span className="blog-date">{formatDate(post.publishedDate)}</span>
              {post.viewCount !== undefined && (
                <>
                  <span className="separator">•</span>
                  <span className="blog-views">{post.viewCount} lượt xem</span>
                </>
              )}
            </div>
            <h1 className="blog-detail-title">{post.title}</h1>
            {post.excerpt && (
              <p className="blog-detail-excerpt">{post.excerpt}</p>
            )}
            <div className="blog-detail-author">
              <span className="author-label">Tác giả:</span>
              <span className="author-name">{post.author}</span>
            </div>
          </header>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="blog-detail-image">
              <img src={post.featuredImage} alt={post.title} />
            </div>
          )}

          {/* Content */}
          <div className="blog-detail-content">
            <div 
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="blog-detail-tags">
              <span className="tags-label">Tags:</span>
              <div className="tags-list">
                {post.tags.map((tag, index) => (
                  <span key={index} className="tag-item">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Share Buttons */}
          <div className="blog-detail-share">
            <span className="share-label">Chia sẻ:</span>
            <div className="share-buttons">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn facebook"
              >
                Facebook
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn twitter"
              >
                Twitter
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn linkedin"
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* Comments Section */}
          {post.comments && post.comments.length > 0 && (
            <div className="blog-detail-comments">
              <h3 className="comments-title">
                Bình luận ({post.comments.length})
              </h3>
              <div className="comments-list">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-header">
                      <span className="comment-author">{comment.authorName}</span>
                      <span className="comment-date">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <div className="comment-content">{comment.content}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Posts */}
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <div className="blog-detail-related">
              <h3 className="related-title">Bài viết liên quan</h3>
              <div className="related-posts-grid">
                {post.relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/tin-tuc/${relatedPost.slug}`}
                    className="related-post-card"
                  >
                    {relatedPost.featuredImage && (
                      <div className="related-post-image">
                        <img
                          src={relatedPost.featuredImage}
                          alt={relatedPost.title}
                        />
                      </div>
                    )}
                    <div className="related-post-content">
                      <h4 className="related-post-title">{relatedPost.title}</h4>
                      {relatedPost.excerpt && (
                        <p className="related-post-excerpt">
                          {relatedPost.excerpt}
                        </p>
                      )}
                      <div className="related-post-meta">
                        <span className="related-post-date">
                          {formatDate(relatedPost.publishedDate)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Back to Blog Link */}
        <div className="blog-detail-footer">
          <Link href="/tin-tuc" className="back-to-blog-btn">
            ← Quay lại trang tin tức
          </Link>
        </div>
      </div>
    </div>
  );
}

