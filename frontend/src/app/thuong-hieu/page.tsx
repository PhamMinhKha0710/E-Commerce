'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '@/components/sections/Breadcrum';

interface Brand {
  id: number;
  name: string;
  imageUrl: string;
  productCount: number;
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5130/api/admin/brands');
        
        if (!response.ok) {
          throw new Error('Không thể tải danh sách thương hiệu');
        }

        const data = await response.json();
        setBrands(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi');
        console.error('Error fetching brands:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return (
    <div className="bodywrap">
      <div className="layout-collection">
        <Breadcrumb items={[
          { label: "Trang chủ", href: "/" },
          { label: "Thương hiệu", isActive: true }
        ]} />
        
        <div className="container">
          <div className="page-title" style={{ margin: '24px 0' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a' }}>
              THƯƠNG HIỆU CHÍNH HÃNG
            </h1>
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <div className="spinner-border text-danger" role="status">
                <span className="sr-only">Đang tải...</span>
              </div>
              <p style={{ marginTop: '16px', color: '#666' }}>Đang tải danh sách thương hiệu...</p>
            </div>
          ) : error ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#d32f2f' }}>
              <p>{error}</p>
            </div>
          ) : brands.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
              <p>Chưa có thương hiệu nào</p>
            </div>
          ) : (
            <div className="brands-grid" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '30px',
              padding: '20px 0'
            }}>
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/collections/all?brand=${brand.id}`}
                  className="brand-card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '20px',
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    textDecoration: 'none',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  }}
                >
                  <div style={{ 
                    width: '150px', 
                    height: '150px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    marginBottom: '15px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                    padding: '10px'
                  }}>
                    <Image
                      src={brand.imageUrl || '/default-brand.png'}
                      alt={brand.name}
                      width={150}
                      height={150}
                      style={{ 
                        objectFit: 'contain',
                        maxWidth: '100%',
                        maxHeight: '100%'
                      }}
                      onError={(e) => {
                        e.currentTarget.src = '/default-brand.png';
                      }}
                    />
                  </div>
                  <h3 style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: '#1a1a1a',
                    margin: '10px 0 5px 0',
                    textAlign: 'center'
                  }}>
                    {brand.name}
                  </h3>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#666',
                    margin: 0
                  }}>
                    {brand.productCount} sản phẩm
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

