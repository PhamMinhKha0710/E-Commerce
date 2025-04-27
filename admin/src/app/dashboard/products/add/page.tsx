import { AddProductForm } from "@/components/products/add-product-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Thêm sản phẩm mới | SmartMile Admin",
  description: "Tạo sản phẩm mới trong hệ thống SmartMile",
}

export default function AddProductPage() {
  return <AddProductForm />
}
