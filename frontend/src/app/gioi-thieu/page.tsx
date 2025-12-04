'use client';

import React from 'react';
import './AboutPage.css';

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="hero-wrapper">
            <div className="hero-content">
              <div className="hero-breadcrumb">
                <a href="/">Trang chủ</a>
                <span className="separator">/</span>
                <span>Giới thiệu</span>
              </div>
              <h1 className="hero-title">Về ND Mall</h1>
              <p className="hero-description">
                ND Mall là hệ thống bán lẻ đa kênh hàng đầu Việt Nam với hơn 40 cửa hàng trên toàn quốc. 
                Chúng tôi cam kết mang đến trải nghiệm mua sắm tuyệt vời với hơn 10,000 sản phẩm chính hãng từ các thương hiệu uy tín.
              </p>
              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-number">40+</div>
                  <div className="stat-label">Cửa hàng</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">10K+</div>
                  <div className="stat-label">Sản phẩm</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">1M+</div>
                  <div className="stat-label">Khách hàng</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">24/7</div>
                  <div className="stat-label">Hỗ trợ</div>
                </div>
              </div>
            </div>
            <div className="hero-image">
              <div className="image-placeholder">
                <svg width="400" height="400" viewBox="0 0 400 400" fill="none">
                  <circle cx="200" cy="200" r="180" fill="url(#gradient1)" opacity="0.1"/>
                  <circle cx="200" cy="200" r="140" fill="url(#gradient2)" opacity="0.15"/>
                  <circle cx="200" cy="200" r="100" fill="var(--maincolor)" opacity="0.2"/>
                  <path d="M200 120L240 180H160L200 120Z" fill="var(--maincolor)" opacity="0.3"/>
                  <rect x="160" y="180" width="80" height="100" fill="var(--hover)" opacity="0.3" rx="8"/>
                  <circle cx="170" cy="250" r="8" fill="white" opacity="0.8"/>
                  <circle cx="230" cy="250" r="8" fill="white" opacity="0.8"/>
                  <defs>
                    <linearGradient id="gradient1" x1="20" y1="20" x2="380" y2="380">
                      <stop offset="0%" stopColor="var(--maincolor)"/>
                      <stop offset="100%" stopColor="var(--hover)"/>
                    </linearGradient>
                    <linearGradient id="gradient2" x1="60" y1="60" x2="340" y2="340">
                      <stop offset="0%" stopColor="var(--hover)"/>
                      <stop offset="100%" stopColor="var(--maincolor)"/>
                    </linearGradient>
                  </defs>
                </svg>
                <div className="image-badge">
                  <span className="badge-text">Chất lượng</span>
                  <span className="badge-icon">✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="about-section story-section">
        <div className="container">
          <div className="story-header">
            <span className="section-badge">Câu chuyện</span>
            <h2 className="section-title-large">Hành trình xây dựng niềm tin</h2>
            <p className="section-subtitle">
              Từ một cửa hàng nhỏ đến hệ thống 40 cửa hàng trên toàn quốc
            </p>
          </div>
          <div className="story-timeline">
            <div className="timeline-item">
              <div className="timeline-year">2015</div>
              <div className="timeline-content">
                <h3>Khởi đầu hành trình</h3>
                <p>Cửa hàng đầu tiên được mở tại Hà Nội với mong muốn mang đến sản phẩm chất lượng cho người Việt</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-year">2018</div>
              <div className="timeline-content">
                <h3>Mở rộng toàn quốc</h3>
                <p>Phát triển thành chuỗi cửa hàng với 20 chi nhánh tại các thành phố lớn</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-year">2020</div>
              <div className="timeline-content">
                <h3>Chuyển đổi số</h3>
                <p>Ra mắt nền tảng thương mại điện tử với công nghệ AI và Machine Learning</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-year">2024</div>
              <div className="timeline-content">
                <h3>Dẫn đầu thị trường</h3>
                <p>Phục vụ hơn 1 triệu khách hàng với 40+ cửa hàng và 10,000+ sản phẩm</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="about-section mission-vision-section">
        <div className="container">
          <div className="mission-vision-grid">
            <div className="mission-vision-card mission">
              <div className="card-header">
                <div className="card-icon-large">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="card-title">Sứ mệnh của chúng tôi</h3>
              </div>
              <p className="card-text">
                Mang đến trải nghiệm mua sắm <strong>tiện lợi, nhanh chóng và đáng tin cậy</strong> cho mọi người.
                Chúng tôi cam kết cung cấp sản phẩm chính hãng với dịch vụ khách hàng xuất sắc, 
                xây dựng cầu nối giữa người tiêu dùng Việt với các thương hiệu uy tín toàn cầu.
              </p>
              <ul className="mission-list">
                <li>✓ Sản phẩm chính hãng 100%</li>
                <li>✓ Giá cả cạnh tranh nhất</li>
                <li>✓ Giao hàng nhanh chóng</li>
                <li>✓ Hỗ trợ khách hàng 24/7</li>
              </ul>
            </div>
            <div className="mission-vision-card vision">
              <div className="card-header">
                <div className="card-icon-large">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="card-title">Tầm nhìn của chúng tôi</h3>
              </div>
              <p className="card-text">
                Trở thành <strong>nền tảng thương mại điện tử hàng đầu Việt Nam</strong>, được khách hàng yêu thích
                và tin tưởng bởi sự đa dạng sản phẩm, chất lượng dịch vụ và công nghệ tiên tiến.
                Chúng tôi hướng tới tương lai nơi mọi người có thể tiếp cận dễ dàng với các sản phẩm chất lượng.
              </p>
              <ul className="mission-list">
                <li>→ Top 3 sàn TMĐT Việt Nam 2025</li>
                <li>→ 100+ cửa hàng toàn quốc</li>
                <li>→ 5 triệu khách hàng thân thiết</li>
                <li>→ Mở rộng thị trường quốc tế</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-section values-section">
        <div className="container">
          <div className="values-header">
            <span className="section-badge">Giá trị cốt lõi</span>
            <h2 className="section-title-large">Điều chúng tôi tin tưởng</h2>
          </div>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-number">01</div>
              <div className="value-icon-wrapper">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="value-title">Chất lượng đỉnh cao</h3>
              <p className="value-text">
                Cam kết 100% sản phẩm chính hãng từ các thương hiệu uy tín toàn cầu. 
                Mỗi sản phẩm đều được kiểm tra kỹ lưỡng trước khi đến tay khách hàng.
              </p>
            </div>
            <div className="value-card">
              <div className="value-number">02</div>
              <div className="value-icon-wrapper">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="value-title">Uy tín minh bạch</h3>
              <p className="value-text">
                Xây dựng niềm tin qua từng giao dịch với chính sách rõ ràng, 
                minh bạch về giá cả và cam kết hoàn tiền 100% nếu có vấn đề.
              </p>
            </div>
            <div className="value-card">
              <div className="value-number">03</div>
              <div className="value-icon-wrapper">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="value-title">Giao hàng thần tốc</h3>
              <p className="value-text">
                Giao hàng nhanh trong 2-4 giờ nội thành, 24h các tỉnh lân cận. 
                Đối tác vận chuyển uy tín đảm bảo hàng đến tay bạn an toàn.
              </p>
            </div>
            <div className="value-card">
              <div className="value-number">04</div>
              <div className="value-icon-wrapper">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="value-title">Chăm sóc tận tâm</h3>
              <p className="value-text">
                Đội ngũ tư vấn chuyên nghiệp luôn sẵn sàng hỗ trợ 24/7. 
                Chúng tôi không chỉ bán hàng mà còn đồng hành cùng bạn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="about-section stats-section">
        <div className="stats-overlay"></div>
        <div className="container">
          <div className="stats-content">
            <h2 className="stats-title">Con số ấn tượng</h2>
            <p className="stats-subtitle">Những thành tựu chúng tôi tự hào</p>
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="stat-number">40+</div>
              <div className="stat-label">Cửa hàng</div>
              <div className="stat-desc">Trên toàn quốc</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="stat-number">1M+</div>
              <div className="stat-label">Khách hàng</div>
              <div className="stat-desc">Tin tưởng và sử dụng</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="stat-number">10K+</div>
              <div className="stat-label">Sản phẩm</div>
              <div className="stat-desc">Đa dạng danh mục</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="stat-number">24/7</div>
              <div className="stat-label">Hỗ trợ</div>
              <div className="stat-desc">Luôn sẵn sàng phục vụ</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="about-section why-choose-section">
        <div className="container">
          <div className="why-choose-header">
            <span className="section-badge">Tại sao chọn chúng tôi</span>
            <h2 className="section-title-large">Trải nghiệm mua sắm khác biệt</h2>
          </div>
          <div className="why-choose-grid">
            <div className="why-choose-card">
              <div className="why-icon">🎁</div>
              <h3>Khuyến mãi hấp dẫn</h3>
              <p>Chương trình ưu đãi lên đến 50% và quà tặng giá trị mỗi tháng</p>
            </div>
            <div className="why-choose-card">
              <div className="why-icon">🔒</div>
              <h3>Thanh toán an toàn</h3>
              <p>Nhiều hình thức thanh toán được mã hóa SSL bảo mật tối đa</p>
            </div>
            <div className="why-choose-card">
              <div className="why-icon">↩️</div>
              <h3>Đổi trả dễ dàng</h3>
              <p>Chính sách đổi trả trong 30 ngày không cần lý do</p>
            </div>
            <div className="why-choose-card">
              <div className="why-icon">🎯</div>
              <h3>Tích điểm thưởng</h3>
              <p>Tích điểm mỗi đơn hàng và đổi quà giá trị hấp dẫn</p>
            </div>
            <div className="why-choose-card">
              <div className="why-icon">📱</div>
              <h3>App tiện lợi</h3>
              <p>Mua sắm mọi lúc mọi nơi với ứng dụng di động</p>
            </div>
            <div className="why-choose-card">
              <div className="why-icon">💬</div>
              <h3>Tư vấn miễn phí</h3>
              <p>Đội ngũ chuyên gia tư vấn nhiệt tình 24/7</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-section cta-section">
        <div className="cta-overlay"></div>
        <div className="container">
          <div className="cta-content">
            <span className="cta-badge">Bắt đầu ngay hôm nay</span>
            <h2 className="cta-title">Trải nghiệm mua sắm thông minh</h2>
            <p className="cta-text">
              Hơn 10,000 sản phẩm chính hãng đang chờ bạn khám phá<br/>
              Giao hàng nhanh - Giá tốt - Ưu đãi hấp dẫn mỗi ngày
            </p>
            <div className="cta-buttons">
              <a href="/collections/all" className="cta-btn primary">
                <span>Khám phá sản phẩm</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="/lien-he" className="cta-btn secondary">
                <span>Liên hệ tư vấn</span>
              </a>
            </div>
            <div className="cta-features">
              <div className="cta-feature">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Miễn phí vận chuyển</span>
              </div>
              <div className="cta-feature">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Đổi trả trong 30 ngày</span>
              </div>
              <div className="cta-feature">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Hỗ trợ 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

