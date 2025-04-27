"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Plus, Save, Trash, Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"

export function AddProductForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: 0,
    salePrice: 0,
    sku: "",
    barcode: "",
    stock: 0,
    status: "Đang bán",
    featured: false,
    category: "",
    brand: "",
    attributes: [{ name: "", value: "" }],
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: Number.parseFloat(value) || 0 }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    if (!formData.name || !formData.price || !formData.category || !formData.brand) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Thành công!",
        description: "Sản phẩm đã được tạo thành công.",
      })
      router.push("/dashboard/products")
    }, 1000)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/products")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <motion.h2
            className="text-3xl font-bold tracking-tight"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Thêm sản phẩm mới
          </motion.h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push("/dashboard/products")}>
            <X className="mr-2 h-4 w-4" />
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Đang lưu..." : "Lưu sản phẩm"}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Thông tin sản phẩm</CardTitle>
            <CardDescription>Nhập thông tin chi tiết cho sản phẩm mới</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Thông tin cơ bản</TabsTrigger>
                <TabsTrigger value="images">Hình ảnh</TabsTrigger>
                <TabsTrigger value="attributes">Thuộc tính</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Tên sản phẩm <span className="text-destructive">*</span>
                    </Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      placeholder="tu-dong-tao-tu-ten"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">
                      Giá gốc <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price || ""}
                      onChange={handleNumberInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salePrice">Giá khuyến mãi</Label>
                    <Input
                      id="salePrice"
                      name="salePrice"
                      type="number"
                      value={formData.salePrice || ""}
                      onChange={handleNumberInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">Mã SKU</Label>
                    <Input id="sku" name="sku" value={formData.sku} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="barcode">Mã vạch</Label>
                    <Input id="barcode" name="barcode" value={formData.barcode} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">
                      Tồn kho <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      value={formData.stock || ""}
                      onChange={handleNumberInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Trạng thái</Label>
                    <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Đang bán">Đang bán</SelectItem>
                        <SelectItem value="Hết hàng">Hết hàng</SelectItem>
                        <SelectItem value="Ngừng kinh doanh">Ngừng kinh doanh</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">
                      Danh mục <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleSelectChange("category", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Điện thoại">Điện thoại</SelectItem>
                        <SelectItem value="Laptop">Laptop</SelectItem>
                        <SelectItem value="Máy tính bảng">Máy tính bảng</SelectItem>
                        <SelectItem value="Phụ kiện">Phụ kiện</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand">
                      Thương hiệu <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.brand}
                      onValueChange={(value) => handleSelectChange("brand", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn thương hiệu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Samsung">Samsung</SelectItem>
                        <SelectItem value="Apple">Apple</SelectItem>
                        <SelectItem value="Xiaomi">Xiaomi</SelectItem>
                        <SelectItem value="Sony">Sony</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="featured">Sản phẩm nổi bật</Label>
                      <Switch
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) => handleSwitchChange("featured", checked)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Mô tả</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={5}
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="images" className="pt-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Hình ảnh sản phẩm</h3>
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Tải lên
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-dashed rounded-md aspect-square flex items-center justify-center">
                      <Button variant="ghost" className="flex flex-col h-full w-full">
                        <Plus className="h-6 w-6 mb-2" />
                        <span>Thêm hình ảnh</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="attributes" className="pt-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Thuộc tính sản phẩm</h3>
                    <Button variant="outline" size="sm" onClick={addAttribute}>
                      <Plus className="mr-2 h-4 w-4" />
                      Thêm thuộc tính
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formData.attributes.map((attr, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <div className="flex-1">
                          <Input
                            placeholder="Tên thuộc tính"
                            value={attr.name}
                            onChange={(e) => handleAttributeChange(index, "name", e.target.value)}
                          />
                        </div>
                        <div className="flex-1">
                          <Input
                            placeholder="Giá trị"
                            value={attr.value}
                            onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => removeAttribute(index)}
                          disabled={formData.attributes.length <= 1}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Đang lưu..." : "Lưu sản phẩm"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
