import ProductDetail from '@/app/products/ProductDetail';
import { Product } from '@/app/products/ProductType';

async function fetchInitialProduct(productId: string): Promise<Product | undefined> {
  try {
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
  const { slug } = await params;
  // Tách productId từ URL (dạng [productId]-[slug])
  const [productId] = slug.split('-'); // Lấy phần productId từ URL
  if (!productId) {
    return <div>Invalid product URL</div>;
  }

  const initialProduct = await fetchInitialProduct(productId);

  if (!initialProduct) {
    return <div>Product not found</div>;
  }

  return (
    <>
      <ProductDetail initialProduct={initialProduct} productId={productId} slug={slug} />
    </>
  );
}