'use client';

import useSWR, { SWRResponse } from 'swr';
import { Product, VariantCombination } from '@/app/products/ProductType';
import ProductImageCarousel from './ProductImageCarousel';
import ProductInfo from './ProductInfo';
import ProductRelated from './ProductRelated';
import NewsSidebar from './NewsSidebar';
import { useAddToCart } from '@/hooks/useAddToCart';

const fetcher = async (url: string) => {
  const res = await fetch(url, { headers: { accept: 'application/json' } });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch: ${res.status} - ${errorText}`);
  }
  return res.json();
};

interface ProductDetailProps {
  initialProduct: Product | undefined;
  slug: string;
}

export default function ProductDetail({ initialProduct, slug }: ProductDetailProps) {
  const productId = slug.split('-').pop() || slug;
  const handleAddToCart = useAddToCart();

  // API 1: Lấy thông tin sản phẩm và variantGroups
  const { data: product, error: productError }: SWRResponse<Product, Error> = useSWR(
    `http://localhost:5130/api/products/${productId}/detail`,
    fetcher,
    {
      fallbackData: initialProduct,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 0,
    }
  );

  // API 3: Lấy tất cả variantCombinations
  const { data: variantCombinations, error: variantsError }: SWRResponse<VariantCombination[], Error> = useSWR(
    `http://localhost:5130/api/products/${productId}/variant-combinations`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 0,
    }
  );

  if (productError || variantsError) return <div>Error: {productError?.message || variantsError?.message}</div>;
  if (!product || !variantCombinations) return <div>Loading...</div>;

  // Hàm xử lý khi thêm vào giỏ hàng từ ProductInfo
  const onAddToCart = (quantity: number, selectedVariant?: VariantCombination) => {
    const cartItem = {
      productId: parseInt(productId),
      productName: product.name,
      imageUrl: product.image,
      price: selectedVariant?.price || product.price,
      quantity,
      currency: product.currency || 'VND',
      hasVariations: product.hasVariations || false,
      productItemId: selectedVariant ? parseInt(selectedVariant.id) : null, // Dùng id từ VariantCombination hoặc null
    };

    handleAddToCart(cartItem);
  };

  return (
    <section className="product layout-product" itemScope itemType="https://schema.org/Product">
      <meta itemProp="category" content={product.category} />
      <meta itemProp="url" content={`//nd-mall.mysapo.net/${product.slug}`} />
      <meta itemProp="name" content={product.name} />
      <meta itemProp="image" content={product.image} />
      <meta itemProp="description" content={product.description.replace(/<[^>]+>/g, '')} />
      <meta itemProp="brand" content={product.brand} />
      <div className="d-none hidden" itemProp="offers" itemScope itemType="http://schema.org/Offer">
        <div className="inventory_quantity hidden" itemScope itemType="http://schema.org/ItemAvailability">
          <span className="a-stock" itemProp="supersededBy">
            {product.availability === 'InStock' ? 'Còn hàng' : 'Hết hàng'}
          </span>
        </div>
        <link itemProp="availability" href={`http://schema.org/${product.availability}`} />
        <meta itemProp="priceCurrency" content={product.currency} />
        <meta itemProp="price" content={product.price.toString()} />
        <meta itemProp="url" content={`${product.slug}.html`} />
        <span itemProp="UnitPriceSpecification" itemScope itemType="https://schema.org/Downpayment">
          <meta itemProp="priceType" content={product.price.toString()} />
        </span>
        <span itemProp="UnitPriceSpecification" itemScope itemType="https://schema.org/Downpayment">
          <meta itemProp="priceSpecification" content={product.oldPrice.toString()} />
        </span>
        <meta itemProp="priceValidUntil" content="2099-01-01" />
      </div>
      <div
        className="d-none hidden"
        id="https://nd-mall.mysapo.net"
        itemProp="seller"
        itemScope
        itemType="http://schema.org/Organization"
      >
        <meta itemProp="name" content={product.seller.name} />
        <meta itemProp="url" content="index.html" />
        <meta itemProp="logo" content={product.seller.logo} />
      </div>

      <div className="container">
        <div className="details-product">
          <div className="bg margin-bottom-20">
            <div className="row margin-am-10">
              <div className="product-detail-left product-images col-12 col-md-12 col-lg-5 col-left">
                <ProductImageCarousel images={product.images} alt={product.name} />
              </div>
              <ProductInfo product={product} variantCombinations={variantCombinations} onAddToCart={onAddToCart} />
            </div>
          </div>

          <div className="bg">
            <div className="row">
              <div className="col-lg-9 col-12">
                <div className="product-tab e-tabs not-dqtab">
                  <ul className="tabs tabs-title clearfix">
                    <li className="tab-link active" data-tab="#tab-1">
                      <h3>Thông tin sản phẩm</h3>
                    </li>
                  </ul>
                  <div className="tab-float">
                    <div id="tab-1" className="tab-content active content_extab">
                      <div className="rte product_getcontent">
                        <div id="content" dangerouslySetInnerHTML={{ __html: product.description }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-12">
                <NewsSidebar />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductRelated slug={slug} />
    </section>
  );
}