import { UserManagement } from "@/components/users/user-management"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Quản lý người dùng | SmartMile Admin",
  description: "Quản lý tất cả người dùng trong hệ thống SmartMile",
}

export default function UsersPage() {
  return <UserManagement />
}
