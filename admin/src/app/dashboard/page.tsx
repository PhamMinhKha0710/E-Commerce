import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard | SmartMile Admin",
  description: "Tổng quan về hoạt động kinh doanh của SmartMile",
}

export default function DashboardPage() {
  return <DashboardOverview />
}
