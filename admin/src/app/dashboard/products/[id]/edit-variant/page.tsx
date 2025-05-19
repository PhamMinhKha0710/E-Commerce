"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Save, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface VariantAttribute {
  name: string
  value: string
}

interface VariantData {
  id: string
  name: string
  sku: string
  price: number
  stock: number
  attributes: VariantAttribute[]
}

// Sample variant data - in a real app, this would come from an API
const sampleVariantData: VariantData = {
  id: "VAR-1001",
  name: "Đen / 128GB",
  sku: "SP-001-BLACK-128",
  price: 21990000,
  stock: 15,
  attributes: [
    { name: "Màu sắc", value: "Đen" },
    { name: "Bộ nhớ", value: "128GB" }
  ]
}

export default function EditProductVariant() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  const variantId = params.variantId as string
  
  const [formData, setFormData] = useState<VariantData>(sampleVariantData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API fetch
    const fetchVariant = async () => {
      try {
        // In a real application, this would be an API call
        // const response = await fetch(`/api/products/${productId}/variants/${variantId}`)
        // const data = await response.json()
        // setFormData(data)
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))
        setFormData({
          ...sampleVariantData,
          id: variantId
        })
      } catch (error) {
        console.error("Error fetching variant:", error)
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin biến thể sản phẩm",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchVariant()
  }, [productId, variantId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: Number.parseFloat(value) || 0 }))
  }

  const handleAttributeChange = (index: number, field: "name" | "value", value: string) => {
    const newAttributes = [...formData.attributes]
    newAttributes[index][field] = value
    setFormData(prev => ({ ...prev, attributes: newAttributes }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real application, this would be an API call
      // await fetch(`/api/products/${productId}/variants/${variantId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // })

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Thành công",
        description: "Biến thể sản phẩm đã được cập nhật",
      })
      
      router.push(`/dashboard/products/${productId}`)
    } catch (error) {
      console.error("Error updating variant:", error)
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật biến thể sản phẩm",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    try {
      // In a real application, this would be an API call
      // await fetch(`/api/products/${productId}/variants/${variantId}`, {
      //   method: 'DELETE'
      // })

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      toast({
        title: "Đã xóa",
        description: "Biến thể sản phẩm đã được xóa",
      })
      
      router.push(`/dashboard/products/${productId}`)
    } catch (error) {
      console.error("Error deleting variant:", error)
      toast({
        title: "Lỗi",
        description: "Không thể xóa biến thể sản phẩm",
        variant: "destructive"
      })
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải thông tin biến thể...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => router.push(`/dashboard/products/${productId}`)}
            aria-label="Quay lại trang chi tiết sản phẩm"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Chỉnh sửa biến thể</h2>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">
              <Trash className="mr-2 h-4 w-4" />
              Xóa
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
              <AlertDialogDescription>
                Hành động này không thể hoàn tác. Biến thể này sẽ bị xóa vĩnh viễn khỏi hệ thống.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete} 
                className="bg-destructive text-destructive-foreground"
              >
                Xóa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chi tiết biến thể</CardTitle>
          <CardDescription>Cập nhật thông tin biến thể sản phẩm</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên biến thể</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">Mã SKU</Label>
                  <Input
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Giá bán</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleNumberInputChange}
                    required
                  />
                  <p className="text-sm text-gray-500">
                    {formData.price > 0 ? formatCurrency(formData.price) : ""}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Tồn kho</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleNumberInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4 my-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Thuộc tính biến thể</h3>
                </div>
                <div className="space-y-2">
                  {formData.attributes.map((attr, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <div className="flex-1">
                        <Input
                          placeholder="Tên thuộc tính"
                          value={attr.name}
                          onChange={(e) => handleAttributeChange(index, "name", e.target.value)}
                          required
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          placeholder="Giá trị"
                          value={attr.value}
                          onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Lưu ý: Các thuộc tính xác định duy nhất một biến thể sản phẩm
                </p>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.push(`/dashboard/products/${productId}`)}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 