import type React from "react"
import { AdminDashboardLayout } from "@/components/layout/admin-dashboard-layout"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminDashboardLayout>{children}</AdminDashboardLayout>
}
