"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Eye, EyeOff, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { login, setAuth, getCurrentUser } from "@/lib/api/auth"

// Validate schema
const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  // Mặc định thông tin đăng nhập cho dev environment
  const defaultValues: Partial<LoginFormValues> = {
    email: "admin@example.com", // Thay bằng email thực tế
    password: "", // Không đặt mật khẩu mặc định vì lý do bảo mật
  }

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues,
  })

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true)

    try {
      const response = await login(data)
      
      // Lưu token
      if (response.token) {
        // Nếu không có user trong response, gọi API /me để lấy user info
        let userInfo = response.user
        if (!userInfo) {
          try {
            // Set token trước để có thể gọi API /me
            setAuth(response.token, undefined)
            const currentUser = await getCurrentUser()
            if (currentUser) {
              userInfo = currentUser
              // Update lại với user info
              setAuth(response.token, userInfo)
            }
          } catch (err) {
            console.warn('Could not fetch user info after login:', err)
            // Vẫn tiếp tục với token, user info sẽ được lấy sau
          }
        } else {
          setAuth(response.token, userInfo)
        }
        
        if (process.env.NODE_ENV !== "production") {
          const savedToken = localStorage.getItem("auth_token")
          if (!savedToken) {
            console.warn("Token was not persisted to storage as expected.")
          }
        }
      } else {
        console.error('No token in login response')
        throw new Error('No token received from server')
      }
      
      toast.success("Đăng nhập thành công")
      
      // Redirect về trang được yêu cầu hoặc dashboard mặc định
      const redirectTo = searchParams.get('redirect') || "/dashboard"
      router.push(redirectTo)
      router.refresh() // Làm mới trạng thái toàn ứng dụng
    } catch (error) {
      console.error("Login error:", error)
      const errorMessage = error instanceof Error ? error.message : "Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu."
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Đăng nhập</CardTitle>
        <CardDescription>
          Nhập thông tin đăng nhập để truy cập quản trị
        </CardDescription>
        </CardHeader>
        <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                <Input
                      placeholder="admin@example.com" 
                  type="email"
                      {...field} 
                      disabled={isLoading}
                      autoComplete="email"
                />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
              <div className="relative">
                <Input
                        placeholder="••••••••" 
                  type={showPassword ? "text" : "password"}
                        {...field} 
                        disabled={isLoading}
                        autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                        onClick={toggleShowPassword}
                        className="absolute right-0 top-0 h-full px-3 py-2"
                >
                  {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                  ) : (
                          <Eye className="h-4 w-4" />
                  )}
                        <span className="sr-only">
                          {showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                        </span>
                </Button>
              </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Đăng nhập"
              )}
            </Button>
          </form>
        </Form>
        </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-muted-foreground text-center">
          <p>Nếu bạn không thể đăng nhập, vui lòng liên hệ với quản trị viên.</p>
          </div>
        </CardFooter>
      </Card>
  )
}
