import { OrderManagement } from "@/components/orders/order-management"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Quản lý đơn hàng | SmartMile Admin",
  description: "Quản lý tất cả đơn hàng trong hệ thống SmartMile",
}

export default function OrdersPage() {
  return <OrderManagement />
}
