import { AddUserForm } from "@/components/users/add-user-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Thêm người dùng mới | SmartMile Admin",
  description: "Tạo người dùng mới trong hệ thống SmartMile",
}

export default function AddUserPage() {
  return <AddUserForm />
}
