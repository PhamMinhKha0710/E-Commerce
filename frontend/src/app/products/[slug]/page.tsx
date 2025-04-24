// app/products/[slug]/page.tsx
import ProductDetail from '@/app/products/ProductDetail';
import { Product } from '@/app/products/ProductType';
// import Breadcrumb from '@/components/sections/Breadcrum';

// Hàm fetch dữ liệu ban đầu trong Server Component
async function fetchInitialProduct(slug: string): Promise<Product | undefined> {
  try {
    const productId = slug.split('-').pop() || slug; // Lấy ID từ slug hoặc dùng slug trực tiếp
    const res = await fetch(`http://localhost:5130/api/Products/${productId}/detail`, {
      headers: {
        'accept': 'text/plain',
      },
    });
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`API error: ${res.status} - ${errorText}`);
      return undefined;
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return undefined;
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; // Await params để lấy slug
  const initialProduct = await fetchInitialProduct(slug);

  if (!initialProduct) {
    return <div>Product not found</div>;
  }

  return (
    <>
      {/* <Breadcrumb items={[
                    { label: "Trang chủ", href: "/" },
                    { label: "Dành cho bạn", href: "/danh-cho-ban" },
                    { label: "Dành cho bạn", isActive: true }
                ]} /> */}
      <ProductDetail initialProduct={initialProduct} slug={slug} />
    </>
  );
}