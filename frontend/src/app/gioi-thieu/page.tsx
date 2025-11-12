import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './AboutPage.css';

export const metadata = {
  title: 'Giới thiệu - SmileMart',
  description: 'Tìm hiểu về SmileMart - Sứ mệnh, tầm nhìn và giá trị cốt lõi của chúng tôi',
};

const AboutPage = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            Chúng tôi tin vào sức mạnh của <span className="highlight">mua sắm trực tuyến</span>
          </h1>
          <p className="hero-subtitle">
            Kết nối người mua và người bán, mang đến trải nghiệm mua sắm tuyệt vời nhất
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="container">
          <div className="story-grid">
            <div className="story-content">
              <span className="section-label">CÂU CHUYỆN CỦA CHÚNG TÔI</span>
              <h2 className="section-title">Khởi đầu từ một ý tưởng đơn giản</h2>
              <p className="story-text">
                SmileMart được thành lập với mục tiêu làm cho thương mại điện tử trở nên dễ dàng và 
                tiếp cận cho mọi người. Chúng tôi tin rằng mọi doanh nghiệp, dù lớn hay nhỏ, đều xứng 
                đáng có cơ hội phát triển trong thế giới số.
              </p>
              <p className="story-text">
                Với hơn 10 năm kinh nghiệm trong ngành, chúng tôi đã giúp hàng nghìn doanh nghiệp 
                chuyển đổi số và phát triển vượt bậc. Từ những cửa hàng nhỏ đến các thương hiệu lớn, 
                SmileMart luôn đồng hành cùng bạn.
              </p>
              <div className="story-stats">
                <div className="stat-item">
                  <div className="stat-number">10+</div>
                  <div className="stat-label">Năm kinh nghiệm</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">50K+</div>
                  <div className="stat-label">Khách hàng</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">1M+</div>
                  <div className="stat-label">Đơn hàng</div>
                </div>
              </div>
            </div>
            <div className="story-image">
              <div className="image-wrapper">
                <img 
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800" 
                  alt="SmileMart Office" 
                  className="rounded-image"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="mission-vision-section">
        <div className="container">
          <div className="mv-grid">
            <div className="mv-card mission-card">
              <div className="mv-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h3 className="mv-title">Sứ mệnh</h3>
              <p className="mv-description">
                Trao quyền cho các doanh nghiệp bằng cách cung cấp nền tảng thương mại điện tử 
                đơn giản, mạnh mẽ và đáng tin cậy. Chúng tôi cam kết giúp bạn thành công trong 
                thế giới số hóa.
              </p>
            </div>
            <div className="mv-card vision-card">
              <div className="mv-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <h3 className="mv-title">Tầm nhìn</h3>
              <p className="mv-description">
                Trở thành nền tảng thương mại điện tử hàng đầu tại Việt Nam, nơi mọi người có thể 
                dễ dàng mua bán trực tuyến và xây dựng thương hiệu của riêng mình một cách hiệu quả.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">GIÁ TRỊ CỐT LÕI</span>
            <h2 className="section-title">Những điều chúng tôi tin tưởng</h2>
          </div>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
              </div>
              <h3 className="value-title">Chất lượng đỉnh cao</h3>
              <p className="value-description">
                Chúng tôi cam kết cung cấp sản phẩm và dịch vụ chất lượng cao nhất, 
                đảm bảo sự hài lòng của khách hàng.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3 className="value-title">Khách hàng là trung tâm</h3>
              <p className="value-description">
                Mọi quyết định của chúng tôi đều hướng đến việc mang lại giá trị 
                tốt nhất cho khách hàng.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <h3 className="value-title">Đổi mới không ngừng</h3>
              <p className="value-description">
                Chúng tôi luôn tìm kiếm và áp dụng công nghệ mới để cải thiện 
                trải nghiệm người dùng.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h3 className="value-title">Minh bạch & Tin cậy</h3>
              <p className="value-description">
                Chúng tôi xây dựng niềm tin thông qua sự minh bạch trong mọi 
                hoạt động kinh doanh.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <h3 className="value-title">Phát triển bền vững</h3>
              <p className="value-description">
                Chúng tôi cam kết phát triển kinh doanh một cách bền vững, 
                có trách nhiệm với cộng đồng.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <h3 className="value-title">Tốc độ & Hiệu quả</h3>
              <p className="value-description">
                Chúng tôi làm việc nhanh chóng và hiệu quả, đảm bảo mang lại 
                kết quả tốt nhất trong thời gian ngắn nhất.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div className="stat-number-large">50,000+</div>
              <div className="stat-label-large">Khách hàng hài lòng</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
              </div>
              <div className="stat-number-large">1,000,000+</div>
              <div className="stat-label-large">Đơn hàng đã giao</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <div className="stat-number-large">10,000+</div>
              <div className="stat-label-large">Cửa hàng đối tác</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div className="stat-number-large">63</div>
              <div className="stat-label-large">Tỉnh thành phủ sóng</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">ĐỘI NGŨ</span>
            <h2 className="section-title">Gặp gỡ đội ngũ của chúng tôi</h2>
            <p className="section-description">
              Những con người đam mê và tài năng đằng sau thành công của SmileMart
            </p>
          </div>
          <div className="team-grid">
            <div className="team-card">
              <div className="team-image">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400" 
                  alt="CEO" 
                />
              </div>
              <div className="team-info">
                <h3 className="team-name">Nguyễn Văn A</h3>
                <p className="team-role">CEO & Founder</p>
                <div className="team-social">
                  <a href="#" aria-label="LinkedIn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                  <a href="#" aria-label="Twitter">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="team-card">
              <div className="team-image">
                <img 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400" 
                  alt="CTO" 
                />
              </div>
              <div className="team-info">
                <h3 className="team-name">Trần Thị B</h3>
                <p className="team-role">CTO</p>
                <div className="team-social">
                  <a href="#" aria-label="LinkedIn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                  <a href="#" aria-label="Twitter">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="team-card">
              <div className="team-image">
                <img 
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400" 
                  alt="CMO" 
                />
              </div>
              <div className="team-info">
                <h3 className="team-name">Lê Văn C</h3>
                <p className="team-role">CMO</p>
                <div className="team-social">
                  <a href="#" aria-label="LinkedIn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                  <a href="#" aria-label="Twitter">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="team-card">
              <div className="team-image">
                <img 
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400" 
                  alt="Head of Design" 
                />
              </div>
              <div className="team-info">
                <h3 className="team-name">Phạm Thị D</h3>
                <p className="team-role">Head of Design</p>
                <div className="team-social">
                  <a href="#" aria-label="LinkedIn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                  <a href="#" aria-label="Twitter">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Sẵn sàng bắt đầu hành trình cùng chúng tôi?</h2>
            <p className="cta-description">
              Tham gia cùng hàng nghìn doanh nghiệp đã tin tưởng và phát triển với SmileMart
            </p>
            <div className="cta-buttons">
              <Link href="/auth/register" className="cta-button primary">
                Bắt đầu ngay
              </Link>
              <Link href="/" className="cta-button secondary">
                Khám phá sản phẩm
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;


