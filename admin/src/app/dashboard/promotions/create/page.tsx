"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Save, 
  Loader2
} from "lucide-react"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { CategoryDto, CreatePromotionDto, createPromotion, getCategoriesForPromotion } from "@/lib/api/promotions"

// Type definition for creating a promotion form
interface PromotionFormData {
  name: string
  description: string
  code: string
  discountRate: number
  startDate: Date
  endDate: Date
  isActive: boolean
  categoryIds: number[]
  totalQuantity: number
}

export default function CreatePromotionPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<CategoryDto[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  
  // Initialize form data with default values
  const [formData, setFormData] = useState<PromotionFormData>({
    name: "",
    description: "",
    discountRate: 0,
    code: "",
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    isActive: true,
    categoryIds: [],
    totalQuantity: 100
  })

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true)
        const data = await getCategoriesForPromotion()
        setCategories(data)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
        toast.error("Không thể tải danh mục sản phẩm. Vui lòng thử lại sau.")
      } finally {
        setLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  const handleChange = (field: keyof PromotionFormData, value: unknown) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleCategoryChange = (categoryId: number, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        categoryIds: [...formData.categoryIds, categoryId]
      })
    } else {
      setFormData({
        ...formData,
        categoryIds: formData.categoryIds.filter(id => id !== categoryId)
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form data before setting loading state
    if (formData.startDate >= formData.endDate) {
      toast.error("Ngày bắt đầu phải trước ngày kết thúc")
      return
    }

    if (formData.discountRate < 0.01 || formData.discountRate > 100) {
      toast.error("Phần trăm giảm giá phải từ 0.01% đến 100%")
      return
    }

    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên khuyến mãi")
      return
    }

    if (!formData.code.trim()) {
      toast.error("Vui lòng nhập mã khuyến mãi")
      return
    }

    setIsLoading(true)
    
    try {
      // Create the DTO that matches the API's expected format
      const promotionDto: CreatePromotionDto = {
        name: formData.name,
        code: formData.code,
        description: formData.description || "",
        discountRate: Number(formData.discountRate), // Ensure it's a number
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString(),
        isActive: formData.isActive,
        categoryIds: formData.categoryIds.length > 0 ? formData.categoryIds : [],
        totalQuantity: Number(formData.totalQuantity)
      }
      
      console.log("Sending data to API:", promotionDto);
      const result = await createPromotion(promotionDto)
      console.log("Promotion created successfully:", result);
      
      toast.success("Tạo khuyến mãi thành công")
      
      // Wait a bit for the toast to show, then redirect
      setTimeout(() => {
        router.push('/dashboard/promotions')
        router.refresh()
      }, 500)
    } catch (error) {
      console.error("Failed to create promotion:", error)
      if (axios.isAxiosError(error) && error.response) {
        // Show the specific error message from the API if available
        const errorMessage = error.response.data?.message || error.response.data || "Không thể tạo mã khuyến mãi. Vui lòng thử lại."
        toast.error(errorMessage)
      } else {
        toast.error("Không thể tạo mã khuyến mãi. Vui lòng thử lại.")
      }
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Tạo mã khuyến mãi mới</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Thông tin khuyến mãi</CardTitle>
            <CardDescription>Nhập thông tin chi tiết cho mã khuyến mãi mới</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên khuyến mãi</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={e => handleChange("name", e.target.value)}
                  placeholder="Nhập tên khuyến mãi" 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Mã khuyến mãi</Label>
                <Input 
                  id="code" 
                  value={formData.code} 
                  onChange={e => handleChange("code", e.target.value)}
                  placeholder="Ví dụ: SUMMER20" 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountRate">Phần trăm giảm giá (%)</Label>
                <Input 
                  id="discountRate" 
                  type="number" 
                  value={formData.discountRate || ""} 
                  onChange={e => handleChange("discountRate", Number(e.target.value))}
                  placeholder="Ví dụ: 20"
                  min="0.01"
                  max="100"
                  step="0.01"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalQuantity">Tổng số lượng mã khuyến mãi</Label>
                <Input 
                  id="totalQuantity" 
                  type="number" 
                  value={formData.totalQuantity || ""} 
                  onChange={e => handleChange("totalQuantity", Number(e.target.value))}
                  placeholder="Ví dụ: 100"
                  min="1"
                  step="1"
                  required
                />
                <p className="text-xs text-muted-foreground">Số lượng mã khuyến mãi tối đa có thể sử dụng</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="isActive">Trạng thái</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Switch 
                    id="isActive" 
                    checked={formData.isActive} 
                    onCheckedChange={checked => handleChange("isActive", checked)} 
                  />
                  <Label htmlFor="isActive">{formData.isActive ? "Kích hoạt" : "Không kích hoạt"}</Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Ngày bắt đầu</Label>
                <div className="relative">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.startDate ? format(formData.startDate, "dd/MM/yyyy") : "Chọn ngày"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.startDate}
                        onSelect={(date) => date && handleChange("startDate", date)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Ngày kết thúc</Label>
                <div className="relative">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.endDate ? format(formData.endDate, "dd/MM/yyyy") : "Chọn ngày"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.endDate}
                        onSelect={(date) => date && handleChange("endDate", date)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea 
                  id="description" 
                  rows={4} 
                  value={formData.description} 
                  onChange={e => handleChange("description", e.target.value)}
                  placeholder="Mô tả chi tiết về chương trình khuyến mãi" 
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="mb-2 block">Áp dụng cho danh mục</Label>
                {loadingCategories ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Đang tải danh mục...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {categories.map(category => (
                      <div className="flex items-center space-x-2" key={category.id}>
                        <Checkbox 
                          id={`category-${category.id}`} 
                          checked={formData.categoryIds.includes(category.id)}
                          onCheckedChange={(checked: boolean) => handleCategoryChange(category.id, checked)}
                        />
                        <Label htmlFor={`category-${category.id}`}>{category.title}</Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => router.back()}
              >
                Hủy
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Tạo khuyến mãi
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
} 