import { BrandForm } from "@/components/brands/brand-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Chỉnh sửa thương hiệu | SmartMile Admin",
  description: "Cập nhật thông tin thương hiệu trong hệ thống SmartMile",
}

export default function EditBrandPage({ params }: { params: { id: string } }) {
  return <BrandForm id={parseInt(params.id)} />
}