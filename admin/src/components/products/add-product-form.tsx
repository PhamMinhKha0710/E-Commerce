"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { X, Image as ImageIcon, Plus, ArrowLeft, Save, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { 
  createProduct, 
  type CreateUpdateProductDto, 
  type ProductAttribute 
} from "@/lib/api/products"
import { getAdminCategories } from "@/lib/api/categories"
import { getBrands } from "@/lib/api/brands"
import { formatDescriptionToHtml } from "@/lib/descriptionFormatter"

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

const initialFormData: CreateUpdateProductDto = {
  name: "",
  description: "",
  price: 0,
  salePrice: 0,
  sku: "",
  stock: 0,
  status: "In Stock",
  featured: false,
  categoryId: 0,
  brandId: 0,
  images: [],
  attributes: []
}

export function AddProductForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<CreateUpdateProductDto>(initialFormData)
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [newImageUrl, setNewImageUrl] = useState("")
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [loadingBrands, setLoadingBrands] = useState(true)
  const [categories, setCategories] = useState<{id: number, name: string}[]>([])
  const [brands, setBrands] = useState<{id: number, name: string}[]>([])

  useEffect(() => {
    // Fetch categories and brands
    const fetchCategoriesAndBrands = async () => {
      try {
        // Fetch categories and brands from the correct endpoints
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
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: Number.parseFloat(value) || 0 }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: name.includes("Id") ? parseInt(value, 10) : value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleAttributeChange = (index: number, field: keyof ProductAttribute, value: string) => {
    const newAttributes = [...(formData.attributes || [])]
    newAttributes[index] = { ...newAttributes[index], [field]: value }
    setFormData((prev) => ({ ...prev, attributes: newAttributes }))
  }

  const addAttribute = () => {
    setFormData((prev) => ({
      ...prev,
      attributes: [...(prev.attributes || []), { name: "", value: "" }],
    }))
  }

  const removeAttribute = (index: number) => {
    const newAttributes = [...(formData.attributes || [])]
    newAttributes.splice(index, 1)
    setFormData((prev) => ({ ...prev, attributes: newAttributes }))
  }

  const addImage = () => {
    if (!newImageUrl.trim()) return
    setImageUrls((prev) => [...prev, newImageUrl])
    setFormData((prev) => ({ ...prev, images: [...(prev.images || []), newImageUrl] }))
    setNewImageUrl("")
  }

  const removeImage = (index: number) => {
    const newImages = [...imageUrls]
    newImages.splice(index, 1)
    setImageUrls(newImages)
    setFormData((prev) => ({ ...prev, images: newImages }))
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
    // Validate form
      if (!formData.name || !formData.description || formData.price <= 0 || !formData.sku || formData.categoryId <= 0 || formData.brandId <= 0) {
      toast({
          title: "Thông tin không đầy đủ",
          description: "Vui lòng điền đầy đủ thông tin sản phẩm",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

      // Format description thành HTML
      const formattedDescription = formatDescriptionToHtml(formData.description)

      // Cập nhật status tự động trước khi gửi (In Stock / Out of Stock)
      const payload: CreateUpdateProductDto = {
        ...formData,
        description: formattedDescription,
        status: formData.stock > 0 ? "In Stock" : "Out of Stock",
      }

      // Call API to create product
      const result = await createProduct(payload)
      
      toast({
        title: "Tạo sản phẩm thành công",
        description: "Sản phẩm \"" + result.name + "\" đã được tạo thành công.",
      })
      
      // Redirect to product detail page
      router.push(`/dashboard/products/${result.id}`)
    } catch (error) {
      console.error("Error creating product:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tạo sản phẩm. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="icon" onClick={() => router.push("/dashboard/products")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
            <h1 className="text-3xl font-bold tracking-tight">Thêm sản phẩm mới</h1>
        </div>
          <Button type="submit" disabled={isSubmitting || loadingCategories || loadingBrands}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
            <Save className="mr-2 h-4 w-4" />
                Lưu sản phẩm
              </>
            )}
          </Button>
      </div>

        <div className="grid gap-6 md:grid-cols-6">
          <div className="md:col-span-4 space-y-6">
        <Card>
          <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
                <CardDescription>Thông tin cơ bản của sản phẩm</CardDescription>
          </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="name">Tên sản phẩm</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Nhập tên sản phẩm"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="sku">Mã sản phẩm (SKU)</Label>
                    <Input
                      id="sku"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      placeholder="Ví dụ: SP-12345"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Mô tả sản phẩm</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Mô tả chi tiết về sản phẩm"
                      className="min-h-32"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hình ảnh sản phẩm</CardTitle>
                <CardDescription>Thêm hình ảnh sản phẩm</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Nhập URL hình ảnh"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                    />
                    <Button type="button" onClick={addImage} variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Thêm
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt={`Product image ${index + 1}`} className="w-full h-full object-cover" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    
                    {imageUrls.length === 0 && (
                      <div className="col-span-full flex items-center justify-center border border-dashed rounded-md p-6">
                        <div className="text-center">
                          <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                          <p className="mt-2 text-sm text-muted-foreground">Chưa có hình ảnh nào</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thuộc tính sản phẩm</CardTitle>
                <CardDescription>Thêm các thuộc tính cho sản phẩm</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button type="button" variant="outline" onClick={addAttribute}>
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm thuộc tính
                </Button>

                {formData.attributes && formData.attributes.length > 0 ? (
                  <div className="space-y-4">
                    {formData.attributes.map((attr, index) => (
                      <div key={index} className="flex items-end gap-2">
                        <div className="grid gap-2 flex-1">
                          <Label htmlFor={`attribute-name-${index}`}>Tên thuộc tính</Label>
                          <Input
                            id={`attribute-name-${index}`}
                            value={attr.name}
                            onChange={(e) => handleAttributeChange(index, "name", e.target.value)}
                            placeholder="Ví dụ: Màu sắc"
                          />
                        </div>
                        <div className="grid gap-2 flex-1">
                          <Label htmlFor={`attribute-value-${index}`}>Giá trị</Label>
                          <Input
                            id={`attribute-value-${index}`}
                            value={attr.value}
                            onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
                            placeholder="Ví dụ: Đen"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAttribute(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Xóa thuộc tính</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    Chưa có thuộc tính nào. Nhấn &quot;Thêm thuộc tính&quot; để bắt đầu.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Giá & Tồn kho</CardTitle>
                <CardDescription>Thông tin về giá và tồn kho</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="price">Giá bán (VND)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleNumberInputChange}
                      min="0"
                      step="1000"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="salePrice">Giá khuyến mãi (VND)</Label>
                    <Input
                      id="salePrice"
                      name="salePrice"
                      type="number"
                      value={formData.salePrice || ""}
                      onChange={handleNumberInputChange}
                      min="0"
                      step="1000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock">Số lượng tồn kho</Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      value={formData.stock}
                      onChange={handleNumberInputChange}
                      min="0"
                      required
                    />
                  </div>
                  </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Phân loại</CardTitle>
                <CardDescription>Danh mục và thương hiệu sản phẩm</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="category">Danh mục</Label>
                    <Select
                      value={formData.categoryId.toString()}
                      onValueChange={(value) => handleSelectChange("categoryId", value)}
                      required
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
                  </div>
                  <div>
                    <Label htmlFor="brand">Thương hiệu</Label>
                    <Select
                      value={formData.brandId.toString()}
                      onValueChange={(value) => handleSelectChange("brandId", value)}
                      required
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
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tùy chọn thêm</CardTitle>
                <CardDescription>Các tùy chọn bổ sung</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                  <Label htmlFor="featured" className="cursor-pointer">Sản phẩm nổi bật</Label>
                      <Switch
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) => handleSwitchChange("featured", checked)}
                      />
                    </div>
              </CardContent>
            </Card>
                  </div>
                </div>
      </form>
    </div>
  )
}
