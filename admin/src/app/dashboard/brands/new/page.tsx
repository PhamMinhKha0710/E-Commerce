import { BrandForm } from "@/components/brands/brand-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Thêm thương hiệu mới | SmartMile Admin",
  description: "Thêm thương hiệu mới vào hệ thống SmartMile",
}

export default function NewBrandPage() {
  return <BrandForm />
} 