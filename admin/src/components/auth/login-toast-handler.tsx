"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"

/**
 * Component để xử lý hiển thị toast từ query params trên trang login
 */
export function LoginToastHandler() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const error = searchParams.get('error')
    const expired = searchParams.get('expired')
    const redirect = searchParams.get('redirect')

    if (expired === 'true') {
      toast.error("Phiên đăng nhập đã hết hạn", {
        description: "Vui lòng đăng nhập lại để tiếp tục.",
        duration: 5000,
      })
    } else if (error === 'invalid_token') {
      toast.error("Token không hợp lệ", {
        description: "Vui lòng đăng nhập lại.",
        duration: 5000,
      })
    } else if (error === 'access_denied') {
      toast.error("Bạn không có quyền truy cập khu vực quản trị!", {
        description: "Chỉ có role Admin mới được phép truy cập.",
        duration: 5000,
      })
    } else if (redirect) {
      toast.info("Vui lòng đăng nhập để tiếp tục", {
        description: "Bạn cần đăng nhập để truy cập trang này.",
        duration: 3000,
      })
    }
  }, [searchParams])

  return null
}

