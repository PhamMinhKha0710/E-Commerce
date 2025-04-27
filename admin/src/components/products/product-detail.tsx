"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowLeft, Edit, Plus, Save, Trash, Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
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
import { toast } from "@/components/ui/use-toast"

// Mock product data - in a real app, this would come from an API
const productData = {
  id: "PRD-1001",
  name: "Điện thoại Samsung Galaxy S23",
  slug: "dien-thoai-samsung-galaxy-s23",
  description: "Điện thoại Samsung Galaxy S23 với hiệu năng mạnh mẽ, camera chất lượng cao và thiết kế sang trọng.",
  price: 23990000,
  salePrice: 21990000,
  sku: "SS-GS23-128GB",
  
  stock: 45,
  status: "Đang bán",
  featured: true,
  category: "Điện thoại",
  brand: "Samsung",
  images: [
    "/placeholder.svg?height=500&width=500",
    "/placeholder.svg?height=500&width=500",
    "/placeholder.svg?height=500&width=500",
  ],
  attributes: [
    { name: "Màu sắc", value: "Đen" },
    { name: "Bộ nhớ", value: "128GB" },
    { name: "RAM", value: "8GB" },
    { name: "Màn hình", value: "6.1 inch" },
    { name: "Pin", value: "3900 mAh" },
  ],
  variants: [
    { id: "VAR-1001", name: "Đen / 128GB", price: 21990000, stock: 15 },
    { id: "VAR-1002", name: "Đen / 256GB", price: 23990000, stock: 10 },
    { id: "VAR-1003", name: "Trắng / 128GB", price: 21990000, stock: 12 },
    { id: "VAR-1004", name: "Trắng / 256GB", price: 23990000, stock: 8 },
  ],
  createdAt: "01/01/2023",
  updatedAt: "15/04/2023",
  sales: 156,
  rating: 4.5,
  reviews: 32,
}

export function ProductDetail({ productId }: { productId: string }) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({ ...productData })
  const [activeTab, setActiveTab] = useState("details")

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

  const handleSave = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      setIsEditing(false)
      toast({
        title: "Thành công!",
        description: "Thông tin sản phẩm đã được cập nhật.",
        variant: "default",
      })
    }, 1000)
  }

  const handleDelete = () => {
    // Simulate API call
    setTimeout(() => {
      router.push("/dashboard/products")
      toast({
        title: "Đã xóa sản phẩm",
        description: "Sản phẩm đã được xóa khỏi hệ thống.",
        variant: "destructive",
      })
    }, 500)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đang bán":
        return "bg-green-500"
      case "Hết hàng":
        return "bg-red-500"
      case "Ngừng kinh doanh":
        return "bg-gray-500"
      default:
        return "bg-blue-500"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
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
            Chi tiết sản phẩm
          </motion.h2>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="mr-2 h-4 w-4" />
                Hủy
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </>
          ) : (
            <>
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
                      Hành động này không thể hoàn tác. Sản phẩm này sẽ bị xóa vĩnh viễn khỏi hệ thống.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                      Xóa
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
            <CardDescription>Thông tin cơ bản của sản phẩm</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden">
              <Image src={formData.images[0] || "/placeholder.svg"} alt={formData.name} fill className="object-cover" />
            </div>
            <h3 className="text-xl font-semibold">{formData.name}</h3>
            <p className="text-sm text-muted-foreground">{formData.sku}</p>
            <div className="mt-2">
              <Badge variant="outline" className={`${getStatusColor(formData.status)} text-white border-none`}>
                {formData.status}
              </Badge>
            </div>
            <div className="mt-4 w-full">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">ID</span>
                <span className="font-medium">{formData.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Danh mục</span>
                <span className="font-medium">{formData.category}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Thương hiệu</span>
                <span className="font-medium">{formData.brand}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Tồn kho</span>
                <span className="font-medium">{formData.stock}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Đã bán</span>
                <span className="font-medium">{formData.sales}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Chi tiết sản phẩm</CardTitle>
            <CardDescription>Xem và chỉnh sửa thông tin chi tiết</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="details" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Thông tin</TabsTrigger>
                <TabsTrigger value="images">Hình ảnh</TabsTrigger>
                <TabsTrigger value="variants">Biến thể</TabsTrigger>
                <TabsTrigger value="attributes">Thuộc tính</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên sản phẩm</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Giá gốc</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleNumberInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salePrice">Giá khuyến mãi</Label>
                    <Input
                      id="salePrice"
                      name="salePrice"
                      type="number"
                      value={formData.salePrice}
                      onChange={handleNumberInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">Mã SKU</Label>
                    <Input
                      id="sku"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Tồn kho</Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      value={formData.stock}
                      onChange={handleNumberInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Trạng thái</Label>
                    {isEditing ? (
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
                    ) : (
                      <Input id="status" value={formData.status} disabled />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Danh mục</Label>
                    {isEditing ? (
                      <Select
                        value={formData.category}
                        onValueChange={(value) => handleSelectChange("category", value)}
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
                    ) : (
                      <Input id="category" value={formData.category} disabled />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand">Thương hiệu</Label>
                    {isEditing ? (
                      <Select value={formData.brand} onValueChange={(value) => handleSelectChange("brand", value)}>
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
                    ) : (
                      <Input id="brand" value={formData.brand} disabled />
                    )}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="featured">Sản phẩm nổi bật</Label>
                      <Switch
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) => handleSwitchChange("featured", checked)}
                        disabled={!isEditing}
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
                      disabled={!isEditing}
                      rows={5}
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="images" className="pt-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Hình ảnh sản phẩm</h3>
                    {isEditing && (
                      <Button variant="outline" size="sm">
                        <Upload className="mr-2 h-4 w-4" />
                        Tải lên
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="relative aspect-square rounded-md overflow-hidden border">
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`Hình ảnh ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        {isEditing && (
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {isEditing && (
                      <div className="border border-dashed rounded-md aspect-square flex items-center justify-center">
                        <Button variant="ghost" className="flex flex-col h-full w-full">
                          <Plus className="h-6 w-6 mb-2" />
                          <span>Thêm hình ảnh</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="variants" className="pt-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Biến thể sản phẩm</h3>
                    {isEditing && (
                      <Button variant="outline" size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Thêm biến thể
                      </Button>
                    )}
                  </div>
                  <div className="rounded-md border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left font-medium">ID</th>
                          <th className="px-4 py-2 text-left font-medium">Tên biến thể</th>
                          <th className="px-4 py-2 text-left font-medium">Giá</th>
                          <th className="px-4 py-2 text-left font-medium">Tồn kho</th>
                          {isEditing && <th className="px-4 py-2 text-right font-medium">Hành động</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {formData.variants.map((variant) => (
                          <tr key={variant.id} className="border-b">
                            <td className="px-4 py-2">{variant.id}</td>
                            <td className="px-4 py-2">{variant.name}</td>
                            <td className="px-4 py-2">{formatCurrency(variant.price)}</td>
                            <td className="px-4 py-2">{variant.stock}</td>
                            {isEditing && (
                              <td className="px-4 py-2 text-right">
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-destructive">
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="attributes" className="pt-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Thuộc tính sản phẩm</h3>
                    {isEditing && (
                      <Button variant="outline" size="sm" onClick={addAttribute}>
                        <Plus className="mr-2 h-4 w-4" />
                        Thêm thuộc tính
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {formData.attributes.map((attr, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <div className="flex-1">
                          {isEditing ? (
                            <Input
                              placeholder="Tên thuộc tính"
                              value={attr.name}
                              onChange={(e) => handleAttributeChange(index, "name", e.target.value)}
                            />
                          ) : (
                            <div className="p-2 border rounded-md">{attr.name}</div>
                          )}
                        </div>
                        <div className="flex-1">
                          {isEditing ? (
                            <Input
                              placeholder="Giá trị"
                              value={attr.value}
                              onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
                            />
                          ) : (
                            <div className="p-2 border rounded-md">{attr.value}</div>
                          )}
                        </div>
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => removeAttribute(index)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {!isEditing && formData.attributes.length === 0 && (
                      <div className="text-center p-4 text-muted-foreground">Không có thuộc tính nào</div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
