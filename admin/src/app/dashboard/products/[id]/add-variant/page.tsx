"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Plus, Save, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

interface VariantAttribute {
  name: string
  value: string
}

interface VariantFormData {
  name: string
  sku: string
  price: number
  stock: number
  attributes: VariantAttribute[]
}

const initialFormData: VariantFormData = {
  name: "",
  sku: "",
  price: 0,
  stock: 0,
  attributes: [
    { name: "Màu sắc", value: "" },
    { name: "Kích thước", value: "" }
  ]
}

export default function AddProductVariant() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  
  const [formData, setFormData] = useState<VariantFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: Number.parseFloat(value) || 0 }))
  }

  const handleAttributeChange = (index: number, field: "name" | "value", value: string) => {
    const newAttributes = [...formData.attributes]
    newAttributes[index][field] = value
    setFormData((prev) => ({ ...prev, attributes: newAttributes }))
  }

  const addAttribute = () => {
    setFormData((prev) => ({
      ...prev,
      attributes: [...prev.attributes, { name: "", value: "" }],
    }))
  }

  const removeAttribute = (index: number) => {
    const newAttributes = [...formData.attributes]
    newAttributes.splice(index, 1)
    setFormData((prev) => ({ ...prev, attributes: newAttributes }))
  }

  const updateVariantName = () => {
    const name = formData.attributes
      .filter(attr => attr.value)
      .map(attr => attr.value)
      .join(" / ")
    
    setFormData(prev => ({
      ...prev,
      name
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Update variant name from attribute combinations if empty
      if (!formData.name.trim()) {
        updateVariantName()
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // API call would go here
      // const response = await fetch(`/api/products/${productId}/variants`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // })
      
      toast({
        title: "Biến thể đã được tạo",
        description: "Biến thể sản phẩm đã được thêm thành công.",
      })
      
      router.push(`/dashboard/products/${productId}`)
    } catch (error) {
      console.error(error)
      toast({
        title: "Có lỗi xảy ra",
        description: "Không thể tạo biến thể sản phẩm. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
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
          <h2 className="text-3xl font-bold tracking-tight">Thêm biến thể mới</h2>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chi tiết biến thể</CardTitle>
          <CardDescription>Thêm biến thể mới cho sản phẩm</CardDescription>
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
                    placeholder="Đen / 128GB"
                  />
                  <p className="text-sm text-muted-foreground">
                    Để trống để tự động tạo từ tổ hợp thuộc tính
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">Mã SKU</Label>
                  <Input
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    placeholder="SP-001-BLACK-128"
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
                    placeholder="10000000"
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
                    placeholder="100"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4 my-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Thuộc tính biến thể</h3>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addAttribute}
                    aria-label="Thêm thuộc tính mới"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm thuộc tính
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.attributes.map((attr, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <div className="flex-1">
                        <Input
                          placeholder="Tên thuộc tính (VD: Màu sắc)"
                          value={attr.name}
                          onChange={(e) => handleAttributeChange(index, "name", e.target.value)}
                          required
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          placeholder="Giá trị (VD: Đen)"
                          value={attr.value}
                          onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
                          required
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => removeAttribute(index)}
                        aria-label="Xóa thuộc tính này"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
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
                  {isSubmitting ? "Đang lưu..." : "Lưu biến thể"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 