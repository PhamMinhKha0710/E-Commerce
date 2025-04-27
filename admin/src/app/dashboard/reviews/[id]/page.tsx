import { ReviewDetail } from "@/components/reviews/review-detail"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Chi tiết đánh giá | SmartMile Admin",
  description: "Xem và quản lý chi tiết đánh giá sản phẩm",
}

interface ReviewDetailPageProps {
  params: {
    id: string
  }
}

export default function ReviewDetailPage({ params }: ReviewDetailPageProps) {
  return <ReviewDetail reviewId={params.id} />
}
