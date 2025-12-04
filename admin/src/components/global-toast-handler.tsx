"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { toast } from "sonner"

/**
 * Component toàn cục để xử lý hiển thị toast từ query params
 * Chạy trên tất cả các trang để bắt các thông báo từ middleware redirect
 */
export function GlobalToastHandler() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const error = searchParams.get('error')
    
    // Chỉ xử lý trên các trang không phải login và 403 (để tránh duplicate toast)
    if (pathname === '/login' || pathname === '/403' || pathname === '/access-denied') {
      return
    }

    if (error === 'access_denied') {
      toast.error("Bạn không có quyền truy cập khu vực quản trị!", {
        description: "Chỉ có role Admin mới được phép truy cập.",
        duration: 5000,
      })
      
      // Xóa query param sau khi hiển thị toast
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('error')
      router.replace(newUrl.pathname + newUrl.search, { scroll: false })
    }
  }, [pathname, searchParams, router])

  return null
}

