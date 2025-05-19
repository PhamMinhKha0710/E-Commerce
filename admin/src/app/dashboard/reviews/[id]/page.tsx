import { ReviewDetail } from "@/components/reviews/review-detail"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Chi tiết đánh giá | SmartMile Admin",
  description: "Xem chi tiết và quản lý đánh giá sản phẩm trong hệ thống SmartMile",
}

export default function ReviewDetailPage({ params }: { params: { id: string } }) {
  return <ReviewDetail reviewId={params.id} />
}
