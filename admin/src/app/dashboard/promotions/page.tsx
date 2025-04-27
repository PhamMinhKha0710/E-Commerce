import { PromotionManagement } from "@/components/promotions/promotion-management"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Quản lý khuyến mãi | SmartMile Admin",
  description: "Quản lý tất cả khuyến mãi và mã giảm giá trong hệ thống SmartMile",
}

export default function PromotionsPage() {
  return <PromotionManagement />
}
