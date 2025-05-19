"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { format } from "date-fns"
import axios from "axios"
import { 
  ArrowLeft, 
  Edit, 
  Trash, 
  Calendar as CalendarIcon, 
  Save,
  Info,
  Copy,
  AlertCircle,
  Loader2
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { 
  CategoryDto, 
  PromotionDto, 
  UpdatePromotionDto,
  deletePromotion, 
  getCategoriesForPromotion, 
  getPromotionById, 
  updatePromotion 
} from "@/lib/api/promotions"

export default function PromotionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [promotion, setPromotion] = useState<PromotionDto | null>(null)
  const [categories, setCategories] = useState<CategoryDto[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  
  const [isEditing, setIsEditing] = useState(false)
  const [editedPromotion, setEditedPromotion] = useState<PromotionDto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch promotion data and categories when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const promotionId = parseInt(params.id as string)
        
        // Load promotion data
        const promotionData = await getPromotionById(promotionId)
        setPromotion(promotionData)
        setEditedPromotion(promotionData)
        setError(null)
        
        // Load categories for the promotion selection
        setLoadingCategories(true)
        const categoryData = await getCategoriesForPromotion()
        setCategories(categoryData)
      } catch (error) {
        console.error("Failed to fetch data:", error)
        setError("Không thể tải thông tin khuyến mãi. Vui lòng thử lại sau.")
      } finally {
        setIsLoading(false)
        setLoadingCategories(false)
      }
    }
    
    fetchData()
  }, [params])

  const handleEditToggle = () => {
    if (isEditing && editedPromotion) {
      handleSave()
    } else {
      setIsEditing(!isEditing)
    }
  }

  const handleSave = async () => {
    if (!editedPromotion) return
    
    setIsLoading(true)
    try {
      // Validate form data
      if (new Date(editedPromotion.startDate) >= new Date(editedPromotion.endDate)) {
        toast.error("Ngày bắt đầu phải trước ngày kết thúc")
        setIsLoading(false)
        return
      }

      if (Number(editedPromotion.discountRate) < 0.01 || Number(editedPromotion.discountRate) > 100) {
        toast.error("Phần trăm giảm giá phải từ 0.01% đến 100%")
        setIsLoading(false)
        return
      }
      
      // Create update DTO from the edited promotion
      const updateDto: UpdatePromotionDto = {
        id: editedPromotion.id,
        name: editedPromotion.name,
        code: editedPromotion.code,
        description: editedPromotion.description || "",
        discountRate: Number(editedPromotion.discountRate), // Ensure it's a number
        startDate: new Date(editedPromotion.startDate).toISOString(),
        endDate: new Date(editedPromotion.endDate).toISOString(),
        isActive: editedPromotion.isActive,
        categoryIds: editedPromotion.categoryIds.length > 0 ? editedPromotion.categoryIds : [],
        totalQuantity: Number(editedPromotion.totalQuantity)
      }
      
      console.log("Sending update data to API:", updateDto);
      const updated = await updatePromotion(updateDto)
      setPromotion(updated)
      setIsEditing(false)
      toast.success("Thông tin khuyến mãi đã được cập nhật")
    } catch (error) {
      console.error("Failed to update promotion:", error)
      if (axios.isAxiosError(error) && error.response) {
        // Show the specific error message from the API if available
        toast.error(error.response.data || "Không thể cập nhật khuyến mãi. Vui lòng thử lại sau.")
      } else {
        toast.error("Không thể cập nhật khuyến mãi. Vui lòng thử lại sau.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePromotion = async () => {
    if (!promotion) return
    
    setIsLoading(true)
    try {
      await deletePromotion(promotion.id)
      toast.success("Khuyến mãi đã được xóa khỏi hệ thống")
      router.push('/dashboard/promotions')
    } catch (error) {
      console.error("Failed to delete promotion:", error)
      toast.error("Không thể xóa khuyến mãi. Vui lòng thử lại sau.")
    } finally {
      setIsLoading(false)
      setShowDeleteDialog(false)
    }
  }

  const handleCopyCode = () => {
    if (!promotion) return
    navigator.clipboard.writeText(promotion.code)
    toast.success(`Mã ${promotion.code} đã được sao chép vào clipboard`)
  }

  const handleChange = (field: keyof PromotionDto, value: unknown) => {
    if (!editedPromotion) return
    setEditedPromotion({ ...editedPromotion, [field]: value })
  }

  const handleCategoryChange = (categoryId: number, checked: boolean) => {
    if (!editedPromotion) return
    
    let newCategoryIds = [...editedPromotion.categoryIds]
    
    if (checked) {
      if (!newCategoryIds.includes(categoryId)) {
        newCategoryIds.push(categoryId)
      }
    } else {
      newCategoryIds = newCategoryIds.filter(id => id !== categoryId)
    }
    
    setEditedPromotion({
      ...editedPromotion,
      categoryIds: newCategoryIds
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đang diễn ra":
        return "bg-green-500"
      case "Sắp diễn ra":
        return "bg-blue-500"
      case "Đã kết thúc":
        return "bg-gray-500"
      case "Tạm dừng":
        return "bg-yellow-500"
      default:
        return "bg-yellow-500"
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, 'dd/MM/yyyy')
  }

  // Loading state content
  if (isLoading && !promotion) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Chi tiết khuyến mãi</h1>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <h3 className="text-lg font-medium">Đang tải thông tin khuyến mãi</h3>
              <p className="text-sm text-muted-foreground mt-2">Vui lòng đợi trong giây lát</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error state content
  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Chi tiết khuyến mãi</h1>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        
        <div className="flex justify-center mt-4">
          <Button onClick={() => window.location.reload()}>Thử lại</Button>
        </div>
      </div>
    )
  }

  if (!promotion) {
    return null
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">
            {isEditing ? "Chỉnh sửa khuyến mãi" : "Chi tiết khuyến mãi"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant={isEditing ? "default" : "outline"} 
            className="gap-2"
            onClick={handleEditToggle}
            disabled={isLoading}
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4" />
                Lưu
              </>
            ) : (
              <>
                <Edit className="h-4 w-4" />
                Chỉnh sửa
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            className="gap-2 text-red-500" 
            onClick={() => setShowDeleteDialog(true)}
            disabled={isEditing || isLoading}
          >
            <Trash className="h-4 w-4" />
            Xóa
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Thông tin cơ bản</span>
                <Badge 
                  variant="outline"
                  className={`${getStatusColor(promotion.status)} text-white border-none`}
                >
                  {promotion.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên khuyến mãi</Label>
                  {isEditing ? (
                    <Input 
                      id="name" 
                      value={editedPromotion?.name || ""} 
                      onChange={e => handleChange("name", e.target.value)}
                      placeholder="Nhập tên khuyến mãi" 
                      required
                    />
                  ) : (
                    <div className="p-2 bg-muted rounded-md font-medium">
                      {promotion.name}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="code">Mã khuyến mãi</Label>
                  {isEditing ? (
                    <Input 
                      id="code" 
                      value={editedPromotion?.code || ""} 
                      onChange={e => handleChange("code", e.target.value)}
                      placeholder="Ví dụ: SUMMER20" 
                      required
                    />
                  ) : (
                    <div className="p-2 bg-muted rounded-md font-medium flex items-center justify-between">
                      <code>{promotion.code}</code>
                      <Button variant="ghost" size="sm" onClick={handleCopyCode}>
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="discountRate">Phần trăm giảm giá (%)</Label>
                  {isEditing ? (
                    <Input 
                      id="discountRate" 
                      type="number" 
                      value={editedPromotion?.discountRate || 0} 
                      onChange={e => handleChange("discountRate", Number(e.target.value))}
                      placeholder="Ví dụ: 20" 
                      required
                      min="0.01"
                      max="100"
                      step="0.01"
                    />
                  ) : (
                    <div className="p-2 bg-muted rounded-md font-medium">
                      {promotion.discountRate}%
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="totalQuantity">Tổng số lượng mã</Label>
                  {isEditing ? (
                    <Input 
                      id="totalQuantity" 
                      type="number" 
                      value={editedPromotion?.totalQuantity || 0} 
                      onChange={e => handleChange("totalQuantity", Number(e.target.value))}
                      placeholder="Ví dụ: 100" 
                      required
                      min="1"
                      step="1"
                    />
                  ) : (
                    <div className="p-2 bg-muted rounded-md font-medium flex items-center">
                      <span>{promotion.usedQuantity || 0} / {promotion.totalQuantity || "∞"}</span>
                      {promotion.totalQuantity > 0 && (
                        <div className="w-24 bg-gray-200 rounded-full h-2 ml-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ 
                              width: `${Math.min(((promotion.usedQuantity || 0) / promotion.totalQuantity) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                      )}
                      {promotion.totalQuantity > 0 && promotion.usedQuantity >= promotion.totalQuantity && (
                        <Badge variant="destructive" className="ml-2">Đã đạt giới hạn</Badge>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="isActive">Trạng thái</Label>
                  {isEditing ? (
                    <div className="flex items-center space-x-2 mt-2">
                      <Switch 
                        id="isActive" 
                        checked={editedPromotion?.isActive || false} 
                        onCheckedChange={checked => handleChange("isActive", checked)} 
                      />
                      <Label htmlFor="isActive">
                        {editedPromotion?.isActive ? "Hoạt động" : "Không hoạt động"}
                      </Label>
                    </div>
                  ) : (
                    <div className="p-2 bg-muted rounded-md font-medium">
                      {promotion.isActive ? "Hoạt động" : "Không hoạt động"}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="startDate">Ngày bắt đầu</Label>
                  {isEditing ? (
                    <div className="relative">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {editedPromotion?.startDate ? formatDate(editedPromotion.startDate) : "Chọn ngày"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={new Date(editedPromotion?.startDate || Date.now())}
                            onSelect={(date) => date && handleChange("startDate", date.toISOString())}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  ) : (
                    <div className="p-2 bg-muted rounded-md font-medium">
                      {formatDate(promotion.startDate)}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate">Ngày kết thúc</Label>
                  {isEditing ? (
                    <div className="relative">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {editedPromotion?.endDate ? formatDate(editedPromotion.endDate) : "Chọn ngày"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={new Date(editedPromotion?.endDate || Date.now())}
                            onSelect={(date) => date && handleChange("endDate", date.toISOString())}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  ) : (
                    <div className="p-2 bg-muted rounded-md font-medium">
                      {formatDate(promotion.endDate)}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mô tả</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea 
                  value={editedPromotion?.description || ""} 
                  onChange={e => handleChange("description", e.target.value)}
                  placeholder="Mô tả chi tiết về chương trình khuyến mãi" 
                  rows={5}
                />
              ) : (
                <div className="bg-muted rounded-md p-3">
                  {promotion.description || "Không có mô tả"}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Danh mục áp dụng</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingCategories ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Đang tải danh mục...</span>
                </div>
              ) : isEditing ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {categories.map(category => (
                    <div className="flex items-center space-x-2" key={category.id}>
                      <Checkbox 
                        id={`category-${category.id}`} 
                        checked={editedPromotion?.categoryIds.includes(category.id) || false}
                        onCheckedChange={(checked: boolean) => handleCategoryChange(category.id, checked)}
                      />
                      <Label htmlFor={`category-${category.id}`} className="text-sm">{category.title}</Label>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  {promotion.categories.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {promotion.categories.map(category => (
                        <Badge key={category.id} variant="secondary">{category.title}</Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Khuyến mãi áp dụng cho tất cả danh mục</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin khuyến mãi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">ID Khuyến mãi</h3>
                  <p className="font-semibold">{promotion.id}</p>
                </div>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Trạng thái</h3>
                  <Badge 
                    variant="outline"
                    className={`${getStatusColor(promotion.status)} text-white border-none`}
                  >
                    {promotion.status}
                  </Badge>
                </div>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Thời gian</h3>
                  <div className="space-y-1">
                    <p className="text-sm">Từ: <span className="font-medium">{formatDate(promotion.startDate)}</span></p>
                    <p className="text-sm">Đến: <span className="font-medium">{formatDate(promotion.endDate)}</span></p>
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Mức giảm giá</h3>
                  <p className="font-semibold">{promotion.discountRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Hướng dẫn</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Thông tin</AlertTitle>
                <AlertDescription>
                  Khuyến mãi sẽ được áp dụng tự động cho các sản phẩm thuộc danh mục đã chọn. Khách hàng không cần nhập mã.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa khuyến mãi</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa khuyến mãi này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePromotion} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Đang xóa...
                </>
              ) : (
                "Xóa"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}





