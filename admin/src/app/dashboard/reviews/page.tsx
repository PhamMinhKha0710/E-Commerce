import { ReviewManagement } from "@/components/reviews/review-management"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Quản lý đánh giá | SmartMile Admin",
  description: "Quản lý tất cả đánh giá sản phẩm trong hệ thống SmartMile",
}

export default function ReviewsPage() {
  return <ReviewManagement />
}
