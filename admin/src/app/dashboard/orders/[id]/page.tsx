import { OrderDetail } from "@/components/orders/order-detail"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Chi tiết đơn hàng | SmartMile Admin",
  description: "Xem và chỉnh sửa thông tin chi tiết đơn hàng",
}

interface OrderDetailPageProps {
  params: {
    id: string
  }
}

export default function OrderPage({ params }: OrderDetailPageProps) {
  return <OrderDetail orderId={params.id} />
}
