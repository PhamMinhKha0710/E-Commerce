import { ReportsManagement } from "@/components/reports/reports-management"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Báo cáo & Thống kê | SmartMile Admin",
  description: "Xem và tạo báo cáo thống kê trong hệ thống SmartMile",
}

export default function ReportsPage() {
  return <ReportsManagement />
}
