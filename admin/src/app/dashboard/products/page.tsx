import { ProductManagement } from "@/components/products/product-management"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Quản lý sản phẩm | SmartMile Admin",
  description: "Quản lý tất cả sản phẩm trong hệ thống SmartMile",
}

export default function ProductsPage() {
  return <ProductManagement />
}
