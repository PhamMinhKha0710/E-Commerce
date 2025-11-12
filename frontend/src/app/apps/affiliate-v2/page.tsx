'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import './AffiliatePage.css';

export default function AffiliatePage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    website: '',
    facebook: '',
    instagram: '',
    youtube: '',
    experience: '',
    audience: '',
    reason: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitStatus('success');
      setIsSubmitting(false);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        website: '',
        facebook: '',
        instagram: '',
        youtube: '',
        experience: '',
        audience: '',
        reason: ''
      });
      
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }, 1500);
  };

  return (
    <div className="affiliate-page">
      {/* Hero Section */}
      <section className="affiliate-hero">
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
              <span>Chương trình đối tác</span>
            </div>
            <h1 className="hero-title">
              Kiếm tiền cùng <span className="gradient-text">SmileMart</span>
            </h1>
            <p className="hero-description">
              Tham gia chương trình Affiliate của chúng tôi và nhận hoa hồng hấp dẫn lên đến 15% 
              cho mỗi đơn hàng thành công. Không giới hạn thu nhập, thanh toán nhanh chóng.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">15%</div>
                <div className="stat-label">Hoa hồng</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Đối tác</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Hỗ trợ</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">LỢI ÍCH</span>
            <h2 className="section-title">Tại sao nên tham gia?</h2>
            <p className="section-description">
              Chương trình Affiliate của SmileMart mang đến nhiều lợi ích vượt trội
            </p>
          </div>

          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <h3 className="benefit-title">Hoa hồng hấp dẫn</h3>
              <p className="benefit-description">
                Nhận hoa hồng lên đến 15% cho mỗi đơn hàng thành công. Thu nhập không giới hạn.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
              </div>
              <h3 className="benefit-title">Thanh toán nhanh chóng</h3>
              <p className="benefit-description">
                Thanh toán tự động vào cuối mỗi tháng qua chuyển khoản ngân hàng hoặc ví điện tử.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h3 className="benefit-title">Miễn phí tham gia</h3>
              <p className="benefit-description">
                Hoàn toàn miễn phí, không có chi phí ẩn. Đăng ký và bắt đầu kiếm tiền ngay.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <h3 className="benefit-title">Sản phẩm đa dạng</h3>
              <p className="benefit-description">
                Hơn 100,000 sản phẩm chất lượng từ nhiều danh mục khác nhau để bạn quảng bá.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <h3 className="benefit-title">Dashboard chuyên nghiệp</h3>
              <p className="benefit-description">
                Theo dõi doanh thu, clicks, conversions và nhiều chỉ số khác theo thời gian thực.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3 className="benefit-title">Hỗ trợ 24/7</h3>
              <p className="benefit-description">
                Đội ngũ hỗ trợ chuyên nghiệp luôn sẵn sàng giúp bạn thành công với chương trình.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">CÁCH THỨC HOẠT ĐỘNG</span>
            <h2 className="section-title">Bắt đầu chỉ với 3 bước đơn giản</h2>
          </div>

          <div className="steps-container">
            <div className="step-item">
              <div className="step-number">01</div>
              <div className="step-content">
                <h3 className="step-title">Đăng ký tài khoản</h3>
                <p className="step-description">
                  Điền form đăng ký bên dưới với thông tin cơ bản của bạn. Chúng tôi sẽ xét duyệt trong vòng 24h.
                </p>
              </div>
              <div className="step-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
            </div>

            <div className="step-arrow">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </div>

            <div className="step-item">
              <div className="step-number">02</div>
              <div className="step-content">
                <h3 className="step-title">Nhận link & Banner</h3>
                <p className="step-description">
                  Sau khi được duyệt, bạn sẽ nhận được link affiliate độc quyền và bộ banner marketing chuyên nghiệp.
                </p>
              </div>
              <div className="step-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
              </div>
            </div>

            <div className="step-arrow">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </div>

            <div className="step-item">
              <div className="step-number">03</div>
              <div className="step-content">
                <h3 className="step-title">Quảng bá & Kiếm tiền</h3>
                <p className="step-description">
                  Chia sẻ link trên website, social media của bạn. Mỗi đơn hàng thành công, bạn nhận hoa hồng ngay lập tức.
                </p>
              </div>
              <div className="step-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commission Structure */}
      <section className="commission-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">CẤU TRÚC HOA HỒNG</span>
            <h2 className="section-title">Hoa hồng theo cấp bậc</h2>
            <p className="section-description">
              Càng bán nhiều, hoa hồng càng cao. Không giới hạn thu nhập!
            </p>
          </div>

          <div className="commission-grid">
            <div className="commission-card">
              <div className="commission-badge bronze">Bronze</div>
              <div className="commission-rate">8%</div>
              <div className="commission-requirement">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                </svg>
                <span>0 - 50 đơn/tháng</span>
              </div>
              <ul className="commission-features">
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Dashboard cơ bản
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Thanh toán hàng tháng
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Hỗ trợ email
                </li>
              </ul>
            </div>

            <div className="commission-card featured">
              <div className="popular-badge">Phổ biến nhất</div>
              <div className="commission-badge silver">Silver</div>
              <div className="commission-rate">12%</div>
              <div className="commission-requirement">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                </svg>
                <span>51 - 100 đơn/tháng</span>
              </div>
              <ul className="commission-features">
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Dashboard nâng cao
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Thanh toán 2 lần/tháng
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Hỗ trợ ưu tiên
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Banner độc quyền
                </li>
              </ul>
            </div>

            <div className="commission-card">
              <div className="commission-badge gold">Gold</div>
              <div className="commission-rate">15%</div>
              <div className="commission-requirement">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                </svg>
                <span>100+ đơn/tháng</span>
              </div>
              <ul className="commission-features">
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Dashboard Pro
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Thanh toán linh hoạt
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Hỗ trợ VIP 24/7
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Account Manager riêng
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Marketing materials
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section className="registration-section">
        <div className="container">
          <div className="registration-wrapper">
            <div className="registration-info">
              <h2 className="registration-title">Đăng ký ngay hôm nay</h2>
              <p className="registration-description">
                Tham gia cùng hàng nghìn đối tác đang kiếm tiền cùng SmileMart. 
                Điền form bên cạnh và bắt đầu hành trình kiếm thu nhập thụ động.
              </p>

              <div className="why-join-list">
                <div className="why-join-item">
                  <div className="why-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div className="why-content">
                    <h4>Không cần vốn đầu tư</h4>
                    <p>Hoàn toàn miễn phí, bắt đầu ngay không cần chi phí</p>
                  </div>
                </div>

                <div className="why-join-item">
                  <div className="why-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div className="why-content">
                    <h4>Làm việc linh hoạt</h4>
                    <p>Làm việc mọi lúc, mọi nơi theo thời gian của bạn</p>
                  </div>
                </div>

                <div className="why-join-item">
                  <div className="why-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div className="why-content">
                    <h4>Thu nhập thụ động</h4>
                    <p>Kiếm tiền liên tục từ những khách hàng quay lại</p>
                  </div>
                </div>

                <div className="why-join-item">
                  <div className="why-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div className="why-content">
                    <h4>Hỗ trợ toàn diện</h4>
                    <p>Đội ngũ chuyên nghiệp hỗ trợ bạn 24/7</p>
                  </div>
                </div>
              </div>

              <div className="testimonial-box">
                <div className="testimonial-quote">"</div>
                <p className="testimonial-text">
                  Tôi đã kiếm được hơn 50 triệu trong 6 tháng đầu tiên. Chương trình affiliate 
                  của SmileMart thực sự đáng tin cậy và thanh toán đúng hạn!
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div className="author-info">
                    <div className="author-name">Nguyễn Văn A</div>
                    <div className="author-title">Affiliate Partner - Gold Tier</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="registration-form-container">
              <form onSubmit={handleSubmit} className="affiliate-form">
                <h3 className="form-title">Form đăng ký Affiliate</h3>

                <div className="form-group">
                  <label htmlFor="fullName" className="form-label">
                    Họ và tên <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Nhập họ và tên đầy đủ"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Email <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="email@example.com"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                      Số điện thoại <span className="required">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="0912345678"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="website" className="form-label">
                    Website/Blog
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="facebook" className="form-label">
                      Facebook Page/Profile
                    </label>
                    <input
                      type="text"
                      id="facebook"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="facebook.com/yourpage"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="instagram" className="form-label">
                      Instagram
                    </label>
                    <input
                      type="text"
                      id="instagram"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="@yourusername"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="youtube" className="form-label">
                    YouTube Channel
                  </label>
                  <input
                    type="text"
                    id="youtube"
                    name="youtube"
                    value={formData.youtube}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="youtube.com/yourchannel"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="experience" className="form-label">
                    Kinh nghiệm Affiliate Marketing <span className="required">*</span>
                  </label>
                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">Chọn mức độ kinh nghiệm</option>
                    <option value="beginner">Mới bắt đầu</option>
                    <option value="intermediate">Trung bình (1-2 năm)</option>
                    <option value="advanced">Có kinh nghiệm (3+ năm)</option>
                    <option value="expert">Chuyên nghiệp (5+ năm)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="audience" className="form-label">
                    Số lượng người theo dõi/Lượng traffic <span className="required">*</span>
                  </label>
                  <select
                    id="audience"
                    name="audience"
                    value={formData.audience}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">Chọn quy mô</option>
                    <option value="small">Dưới 1,000</option>
                    <option value="medium">1,000 - 10,000</option>
                    <option value="large">10,000 - 100,000</option>
                    <option value="xlarge">Trên 100,000</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="reason" className="form-label">
                    Tại sao bạn muốn tham gia? <span className="required">*</span>
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    className="form-textarea"
                    placeholder="Chia sẻ lý do và kế hoạch quảng bá của bạn..."
                    rows={4}
                    required
                  />
                </div>

                {submitStatus === 'success' && (
                  <div className="submit-success">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    <span>Đăng ký thành công! Chúng tôi sẽ xét duyệt và phản hồi trong vòng 24h.</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      <span>Đang gửi...</span>
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                      </svg>
                      <span>Đăng ký ngay</span>
                    </>
                  )}
                </button>

                <p className="form-note">
                  Bằng việc đăng ký, bạn đồng ý với{' '}
                  <Link href="#">Điều khoản dịch vụ</Link> và{' '}
                  <Link href="#">Chính sách bảo mật</Link> của chúng tôi.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">CÂU HỎI THƯỜNG GẶP</span>
            <h2 className="section-title">Có câu hỏi? Chúng tôi có câu trả lời</h2>
          </div>

          <div className="faq-grid">
            <div className="faq-item">
              <h3 className="faq-question">Làm thế nào để bắt đầu với chương trình Affiliate?</h3>
              <p className="faq-answer">
                Chỉ cần điền form đăng ký trên trang này. Sau khi được phê duyệt (thường trong vòng 24h), 
                bạn sẽ nhận được link affiliate và có thể bắt đầu quảng bá ngay lập tức.
              </p>
            </div>

            <div className="faq-item">
              <h3 className="faq-question">Tôi có cần có website để tham gia không?</h3>
              <p className="faq-answer">
                Không bắt buộc. Bạn có thể quảng bá qua social media (Facebook, Instagram, YouTube, TikTok) 
                hoặc các kênh online khác. Tuy nhiên, có website sẽ giúp bạn dễ dàng hơn.
              </p>
            </div>

            <div className="faq-item">
              <h3 className="faq-question">Khi nào tôi nhận được hoa hồng?</h3>
              <p className="faq-answer">
                Hoa hồng được tính ngay khi đơn hàng được xác nhận thành công. Thanh toán được thực hiện 
                tự động vào cuối mỗi tháng qua chuyển khoản ngân hàng hoặc ví điện tử.
              </p>
            </div>

            <div className="faq-item">
              <h3 className="faq-question">Có giới hạn về thu nhập không?</h3>
              <p className="faq-answer">
                Không có giới hạn! Thu nhập của bạn phụ thuộc hoàn toàn vào số lượng đơn hàng bạn mang lại. 
                Càng bán nhiều, bạn càng kiếm được nhiều và tỷ lệ hoa hồng còn tăng theo cấp bậc.
              </p>
            </div>

            <div className="faq-item">
              <h3 className="faq-question">Tôi có thể quảng bá những sản phẩm nào?</h3>
              <p className="faq-answer">
                Bạn có thể quảng bá bất kỳ sản phẩm nào trên SmileMart. Với hơn 100,000 sản phẩm từ nhiều 
                danh mục khác nhau, bạn có nhiều lựa chọn phù hợp với đối tượng khách hàng của mình.
              </p>
            </div>

            <div className="faq-item">
              <h3 className="faq-question">SmileMart hỗ trợ gì cho Affiliate Partners?</h3>
              <p className="faq-answer">
                Chúng tôi cung cấp dashboard theo dõi chi tiết, banner & creative materials chuyên nghiệp, 
                hỗ trợ kỹ thuật 24/7, và account manager riêng cho các partners cấp cao.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="cta-bottom">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Sẵn sàng bắt đầu kiếm tiền?</h2>
            <p className="cta-description">
              Tham gia cùng 10,000+ đối tác đang thành công với SmileMart Affiliate
            </p>
            <button 
              className="cta-button"
              onClick={() => {
                const form = document.querySelector('.registration-section');
                form?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Đăng ký miễn phí ngay
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}


