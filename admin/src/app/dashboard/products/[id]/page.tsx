import { ProductDetail } from "@/components/products/product-detail"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Chi tiết sản phẩm | SmartMile Admin",
  description: "Xem và chỉnh sửa thông tin chi tiết sản phẩm",
}

interface ProductDetailPageProps {
  params: {
    id: string
  }
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  return <ProductDetail productId={params.id} />
}
