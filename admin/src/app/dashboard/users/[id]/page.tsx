import { UserDetail } from "@/components/users/user-detail"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Chi tiết người dùng | SmartMile Admin",
  description: "Xem và chỉnh sửa thông tin chi tiết người dùng",
}

interface UserDetailPageProps {
  params: {
    id: string
  }
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
  return <UserDetail userId={params.id} />
}
