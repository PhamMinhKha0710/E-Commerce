import ProductDetail from '@/app/products/ProductDetail';
import { Product } from '@/app/products/ProductType';

async function fetchInitialProduct(productId: string): Promise<Product | undefined> {
  try {
    // Sử dụng apiClient để đảm bảo consistency
    const apiClient = (await import("@/lib/apiClient")).default;
    const res = await apiClient.get(`/api/products/${productId}/detail`);
    return res.data;
  } catch (error: any) {
    console.error('Error fetching product:', error);
    if (error.response?.status === 404) {
      console.error(`Product ${productId} not found`);
    }
    return undefined;
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Tách productId từ URL (dạng [productId]-[slug])
  // Lấy số đầu tiên từ slug (productId luôn là số)
  const productIdMatch = slug.match(/^(\d+)/);
  const productId = productIdMatch ? productIdMatch[1] : null;
  
  if (!productId) {
    return <div>Invalid product URL: {slug}</div>;
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