"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ShieldX, Home, ArrowLeft, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function AccessDeniedPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Hiển thị toast nếu có query param error=access_denied
    const error = searchParams.get('error')
    if (error === 'access_denied') {
      toast.error("Bạn không có quyền truy cập khu vực quản trị!", {
        description: "Chỉ có role Admin mới được phép truy cập.",
        duration: 5000,
      })
    }
  }, [searchParams])

  const buildLoginUrl = () => {
    const redirectPath = searchParams.get('from') || '/dashboard'
    const params = new URLSearchParams({ redirect: redirectPath })
    return `/login?${params.toString()}`
  }

  const handleGoHome = () => {
    router.push(buildLoginUrl())
  }

  const handleGoBack = () => {
    const from = searchParams.get('from')
    if (from && from !== '/403' && from !== '/access-denied') {
      router.push(from)
    } else {
      router.push(buildLoginUrl())
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <ShieldX className="h-10 w-10 text-destructive" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold">Truy cập bị từ chối</CardTitle>
            <CardDescription className="text-base">
              Bạn không có quyền truy cập khu vực quản trị
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-muted">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="space-y-1 text-sm">
              <p className="font-medium">Yêu cầu quyền truy cập:</p>
              <p className="text-muted-foreground">
                Chỉ có tài khoản với role <span className="font-semibold text-foreground">Admin</span> mới được phép truy cập khu vực này.
              </p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Nếu bạn cho rằng đây là lỗi, vui lòng:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Liên hệ với quản trị viên hệ thống</li>
              <li>Kiểm tra lại tài khoản của bạn</li>
              <li>Đăng nhập lại với tài khoản có quyền Admin</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={handleGoBack}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <Button
            onClick={handleGoHome}
            className="w-full sm:w-auto"
          >
            <Home className="mr-2 h-4 w-4" />
            Về trang chủ
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

