"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createBrand, getBrandById, updateBrand } from "@/lib/api/brands"

// Form schema
const brandFormSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự").max(100, "Tên tối đa 100 ký tự"),
  imageUrl: z.string().url("Phải là URL hợp lệ").max(500, "URL tối đa 500 ký tự"),
  description: z.string().optional(),
})

type BrandFormValues = z.infer<typeof brandFormSchema>

interface BrandFormProps {
  id?: number
}

export function BrandForm({ id }: BrandFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const isEditMode = !!id

  // Initialize the form
  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
      description: "",
    },
  })

  // Fetch brand data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchBrand = async () => {
        try {
          setIsLoading(true)
          const brand = await getBrandById(id)
          form.reset({
            name: brand.name,
            imageUrl: brand.imageUrl || "",
            description: brand.description || "",
          })
        } catch (error) {
          console.error("Error fetching brand:", error)
          toast.error("Không thể tải thông tin thương hiệu")
        } finally {
          setIsLoading(false)
        }
      }

      fetchBrand()
    }
  }, [id, form, isEditMode])

  // Handle form submission
  const onSubmit = async (data: BrandFormValues) => {
    try {
      setIsLoading(true)
      if (isEditMode) {
        await updateBrand(id, data)
        toast.success("Cập nhật thương hiệu thành công")
      } else {
        await createBrand(data)
        toast.success("Tạo thương hiệu mới thành công")
      }
      router.push("/dashboard/brands")
      router.refresh()
    } catch (error) {
      console.error("Error saving brand:", error)
      toast.error(isEditMode ? "Không thể cập nhật thương hiệu" : "Không thể tạo thương hiệu mới")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.push('/dashboard/brands')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{isEditMode ? "Chỉnh sửa thương hiệu" : "Thêm thương hiệu mới"}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? "Chỉnh sửa thông tin thương hiệu" : "Thông tin thương hiệu"}</CardTitle>
          <CardDescription>
            {isEditMode 
              ? "Cập nhật thông tin cho thương hiệu này" 
              : "Nhập thông tin cho thương hiệu mới"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên thương hiệu</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên thương hiệu" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormDescription>
                      Tên thương hiệu sẽ hiển thị trong toàn bộ hệ thống.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Logo</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/logo.png" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormDescription>
                      Đường dẫn trực tiếp đến hình ảnh logo của thương hiệu. Nên là hình vuông để hiển thị tốt nhất.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Nhập mô tả về thương hiệu" 
                        {...field} 
                        disabled={isLoading} 
                        className="resize-none" 
                        rows={4}
                      />
                    </FormControl>
                    <FormDescription>
                      Mô tả ngắn gọn về thương hiệu này.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard/brands')}
                  disabled={isLoading}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Đang lưu..." : isEditMode ? "Cập nhật thương hiệu" : "Tạo thương hiệu"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
} 