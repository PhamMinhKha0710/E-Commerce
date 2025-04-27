import { BrandManagement } from "@/components/brands/brand-management"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Quản lý thương hiệu | SmartMile Admin",
  description: "Quản lý tất cả thương hiệu trong hệ thống SmartMile",
}

export default function BrandsPage() {
  return <BrandManagement />
}
