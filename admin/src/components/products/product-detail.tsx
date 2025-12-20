"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { getProductDetail, updateProduct, deleteProduct, type ProductDetail as ProductDetailType } from "@/lib/api/products"
import { getAdminCategories } from "@/lib/api/categories"
import { getBrands } from "@/lib/api/brands"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDescriptionToHtml, htmlToPlainText } from "@/lib/descriptionFormatter"

// Define interfaces for API responses
interface CategoryResponse {
  id: number;
  name?: string;
  title?: string;
}

interface BrandResponse {
  id: number;
  name: string;
}

export function ProductDetail({ productId }: { productId: string }) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [product, setProduct] = useState<ProductDetailType | null>(null)
  const [formData, setFormData] = useState<ProductDetailType | null>(null)
  const [categories, setCategories] = useState<{id: number, name: string}[]>([])
  const [brands, setBrands] = useState<{id: number, name: string}[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [loadingBrands, setLoadingBrands] = useState(true)


  useEffect(() => {
    async function fetchProductDetail() {
      setIsLoading(true)
      setError(null)
      try {
        const id = parseInt(productId, 10)
        if (isNaN(id)) {
          throw new Error("Invalid product ID")
        }
        const data = await getProductDetail(id)
        setProduct(data)
        // Convert HTML description về plain text để hiển thị trong textarea
        const formDataWithPlainText = {
          ...data,
          description: htmlToPlainText(data.description)
        }
        setFormData(formDataWithPlainText)
      } catch (err) {
        console.error("Failed to fetch product details:", err)
        setError(err instanceof Error ? err.message : "Failed to load product details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProductDetail()
  }, [productId])

  useEffect(() => {
    // Fetch categories and brands
    const fetchCategoriesAndBrands = async () => {
      try {
        setLoadingCategories(true);
        setLoadingBrands(true);
        
        const categoriesData = await getAdminCategories() as CategoryResponse[];
        const brandsData = await getBrands() as BrandResponse[];
        
        setCategories(categoriesData.map(category => ({
          id: category.id,
          name: category.name || category.title || ""
        })));
        
        setBrands(brandsData.map(brand => ({
          id: brand.id,
          name: brand.name
        })));
      } catch (error) {
        console.error("Error fetching categories and brands:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải danh mục và thương hiệu. Vui lòng thử lại sau.",
          variant: "destructive",
        });
        // Fallback to empty arrays
        setCategories([]);
        setBrands([]);
      } finally {
        setLoadingCategories(false);
        setLoadingBrands(false);
      }
    };

    fetchCategoriesAndBrands();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!formData) return
    const { name, value } = e.target
    setFormData((prev) => prev ? ({ ...prev, [name]: value }) : null)
  }

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return
    const { name, value } = e.target
    setFormData((prev) => prev ? ({ ...prev, [name]: Number.parseFloat(value) || 0 }) : null)
  }

  const handleSelectChange = (name: string, value: string) => {
    if (!formData) return
    setFormData((prev) => prev ? ({ ...prev, [name]: value }) : null)
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    if (!formData) return
    setFormData((prev) => prev ? ({ ...prev, [name]: checked }) : null)
  }

  const handleAttributeChange = (index: number, field: "name" | "value", value: string) => {
    if (!formData) return
    const newAttributes = [...formData.attributes]
    newAttributes[index][field] = value
    setFormData((prev) => prev ? ({ ...prev, attributes: newAttributes }) : null)
  }

  const addAttribute = () => {
    if (!formData) return
    setFormData((prev) => prev ? ({
      ...prev,
      attributes: [...prev.attributes, { name: "", value: "" }],
    }) : null)
  }

  const removeAttribute = (index: number) => {
    if (!formData) return
    const newAttributes = [...formData.attributes]
    newAttributes.splice(index, 1)
    setFormData((prev) => prev ? ({ ...prev, attributes: newAttributes }) : null)
  }


  const handleSave = async () => {
    if (!formData) return
    setIsSaving(true)
    try {
      // Format description thành HTML nếu cần
      const formattedDescription = formatDescriptionToHtml(formData.description)
      
      // Tự động set status dựa trên stock
      const status = formData.stock > 0 ? "In Stock" : "Out of Stock"
      
      // Prepare the data for the API
      const updateData = {
        name: formData.name,
        slug: formData.slug,
        description: formattedDescription,
        price: formData.price,
        salePrice: formData.salePrice,
        sku: formData.sku,
        stock: formData.stock,
        status: status, // Backend requires status field
        featured: formData.featured ?? false,
        categoryId: typeof formData.categoryId === 'string' 
          ? parseInt(formData.categoryId, 10) 
          : formData.categoryId,
        brandId: typeof formData.brandId === 'string' 
          ? parseInt(formData.brandId, 10) 
          : formData.brandId,
        images: formData.images || [],
        attributes: formData.attributes || []
      }
      
      const updatedProduct = await updateProduct(formData.id, updateData)
      setProduct(updatedProduct)
      setFormData(updatedProduct)
      toast({
        title: "Thành công!",
        description: "Thông tin sản phẩm đã được cập nhật.",
        variant: "default",
      })
      setIsEditing(false)
    } catch (err) {
      console.error("Failed to update product:", err)
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật sản phẩm. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!product) return
    setIsDeleting(true)
    try {
      await deleteProduct(product.id)
      toast({
        title: "Đã xóa sản phẩm",
        description: "Sản phẩm đã được xóa khỏi hệ thống.",
        variant: "destructive",
      })
      router.push("/dashboard/products")
    } catch (err) {
      console.error("Failed to delete product:", err)
      toast({
        title: "Lỗi",
        description: "Không thể xóa sản phẩm. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-green-500"
      case "Out of Stock":
        return "bg-red-500"
      case "Discontinued":
        return "bg-gray-500"
      default:
        return "bg-blue-500"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" disabled>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Skeleton className="h-10 w-64" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <Skeleton className="w-full h-48 mb-4 rounded-md" />
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-32 mb-4" />
              <Skeleton className="h-6 w-24 rounded-full mb-4" />
              <div className="w-full space-y-3">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader>
              <Skeleton className="h-8 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/products")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Lỗi</h2>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center p-6">
              <h3 className="text-xl font-semibold text-destructive mb-2">Không thể tải thông tin sản phẩm</h3>
              <p className="mb-4">{error}</p>
              <Button onClick={() => router.push("/dashboard/products")}>
                Quay lại danh sách sản phẩm
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!product || !formData) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/products")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Không tìm thấy sản phẩm</h2>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center p-6">
              <h3 className="text-xl font-semibold mb-4">Sản phẩm không tồn tại hoặc đã bị xóa</h3>
              <Button onClick={() => router.push("/dashboard/products")}>
                Quay lại danh sách sản phẩm
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
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
                    <AlertDialogAction 
                      onClick={handleDelete} 
                      className="bg-destructive text-destructive-foreground"
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Đang xóa..." : "Xóa"}
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
                <span className="font-medium">
                  {formData?.categoryId && categories.length > 0
                    ? categories.find(c => c.id === formData.categoryId)?.name || "Không xác định"
                    : "Không xác định"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Thương hiệu</span>
                <span className="font-medium">
                  {formData?.brandId && brands.length > 0
                    ? brands.find(b => b.id === formData.brandId)?.name || "Không xác định"
                    : "Không xác định"}
                </span>
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
            <Tabs defaultValue="details" className="w-full">
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
                          <SelectItem value="In Stock">In Stock</SelectItem>
                          <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                          <SelectItem value="Discontinued">Discontinued</SelectItem>
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
                        value={formData.categoryId.toString()}
                        onValueChange={(value) => handleSelectChange("categoryId", value)}
                        disabled={loadingCategories}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={loadingCategories ? "Đang tải..." : "Chọn danh mục"} />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.length > 0 ? (
                            categories.map((category) => (
                              <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-category" disabled>
                              Không có danh mục nào
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input id="category" value={formData.category} disabled />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand">Thương hiệu</Label>
                    {isEditing ? (
                      <Select 
                        value={formData.brandId.toString()}
                        onValueChange={(value) => handleSelectChange("brandId", value)}
                        disabled={loadingBrands}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={loadingBrands ? "Đang tải..." : "Chọn thương hiệu"} />
                        </SelectTrigger>
                        <SelectContent>
                          {brands.length > 0 ? (
                            brands.map((brand) => (
                              <SelectItem key={brand.id} value={brand.id.toString()}>
                                {brand.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-brand" disabled>
                              Không có thương hiệu nào
                            </SelectItem>
                          )}
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
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push(`/dashboard/products/${productId}/add-variant`)}
                        aria-label="Thêm biến thể mới"
                      >
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
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => router.push(`/dashboard/products/${productId}/edit-variant/${variant.id}`)}
                                  aria-label="Chỉnh sửa biến thể này"
                                >
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
