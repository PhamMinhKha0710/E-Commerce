"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { format } from "date-fns"
import { 
  ArrowLeft, 
  Edit, 
  Trash, 
  Calendar as CalendarIcon, 
  Tag, 
  Clock,
  Percent,
  Users,
  ShoppingCart,
  Save
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

// Type definitions for API integration
interface Promotion {
  id: string
  name: string
  description: string
  discountType: "percentage" | "fixed"
  discountValue: number
  code: string
  startDate: string
  endDate: string
  isActive: boolean
  usageLimit: number
  usageCount: number
  minimumOrderAmount: number
  createdAt: string
  updatedAt: string
  // Extended properties
  status: string
  minPurchase: number
  maxDiscount: number
  isPublic: boolean
  categories: string[]
  banner: string
  appliedProducts: AppliedProduct[]
}

interface Product {
  id: string
  name: string
  price: number
  imageUrl: string
}

interface AppliedProduct {
  id: string
  name: string
  originalPrice: number
  discountedPrice: number
}

// Mock data functions - will be replaced with actual API calls
const fetchPromotion = async (id: string): Promise<Promotion> => {
  // Example API call:
  // return await fetch(`/api/promotions/${id}`).then(res => res.json())
  return {
    id,
    name: "Summer Sale 2023",
    description: "Get 20% off on all summer products",
    discountType: "percentage",
    discountValue: 20,
    code: "SUMMER20",
    startDate: "2023-06-01",
    endDate: "2023-08-31",
    isActive: true,
    usageLimit: 500,
    usageCount: 132,
    minimumOrderAmount: 50,
    createdAt: "2023-05-15",
    updatedAt: "2023-05-15",
    // Extended properties
    status: "Đang hoạt động",
    minPurchase: 50,
    maxDiscount: 100000,
    isPublic: true,
    categories: ["Điện thoại", "Laptop", "Phụ kiện"],
    banner: "/promotions/summer-sale.jpg",
    appliedProducts: [
      { id: "prod1", name: "Summer T-Shirt", originalPrice: 29.99, discountedPrice: 23.99 },
      { id: "prod2", name: "Beach Sandals", originalPrice: 19.99, discountedPrice: 15.99 },
      { id: "prod3", name: "Sunglasses", originalPrice: 49.99, discountedPrice: 39.99 },
      { id: "prod4", name: "Beach Towel", originalPrice: 24.99, discountedPrice: 19.99 }
    ]
  }
}

const fetchApplicableProducts = async (promotionId: string): Promise<Product[]> => {
  // Example API call:
  // return await fetch(`/api/promotions/${promotionId}/products`).then(res => res.json())
  return [
    { id: "prod1", name: "Summer T-Shirt", price: 29.99, imageUrl: "/products/t-shirt.jpg" },
    { id: "prod2", name: "Beach Sandals", price: 19.99, imageUrl: "/products/sandals.jpg" },
    { id: "prod3", name: "Sunglasses", price: 49.99, imageUrl: "/products/sunglasses.jpg" },
    { id: "prod4", name: "Beach Towel", price: 24.99, imageUrl: "/products/towel.jpg" }
  ]
}

const updatePromotion = async (id: string, data: Promotion): Promise<Promotion> => {
  // Example API call:
  // return await fetch(`/api/promotions/${id}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // }).then(res => res.json())
  console.log("Updating promotion:", id, data)
  return data
}

export default function PromotionDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [promotion, setPromotion] = useState<Promotion | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editedPromotion, setEditedPromotion] = useState<Promotion | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch promotion data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPromotion(params.id)
        setPromotion(data)
        setEditedPromotion(data)
      } catch (error) {
        console.error("Failed to fetch promotion:", error)
        // Handle error (show notification, etc)
      }
    }
    
    fetchData()
  }, [params.id])

  const handleEditToggle = () => {
    if (isEditing && editedPromotion) {
      // Save changes
      handleSave()
    } else {
      setIsEditing(!isEditing)
    }
  }

  const handleSave = async () => {
    if (!editedPromotion) return
    
    setIsLoading(true)
    try {
      const updated = await updatePromotion(params.id, editedPromotion)
      setPromotion(updated)
      setIsEditing(false)
      // Show success notification
    } catch (error) {
      console.error("Failed to update promotion:", error)
      // Show error notification
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: keyof Promotion, value: any) => {
    if (!editedPromotion) return
    setEditedPromotion({ ...editedPromotion, [field]: value })
  }

  const handleCategoriesChange = (value: string, checked: boolean) => {
    if (!editedPromotion) return
    
    if (checked) {
      setEditedPromotion({
        ...editedPromotion,
        categories: [...editedPromotion.categories, value]
      })
    } else {
      setEditedPromotion({
        ...editedPromotion,
        categories: editedPromotion.categories.filter((cat: string) => cat !== value)
      })
    }
  }

  const formatCurrency = (value: number | string) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  if (!promotion || !editedPromotion) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Chi tiết khuyến mãi</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Thông tin khuyến mãi</CardTitle>
                <CardDescription>Xem và chỉnh sửa thông tin chi tiết</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <Button onClick={handleEditToggle} className="flex items-center gap-2" disabled={isLoading}>
                    <Save className="h-4 w-4" />
                    {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                  </Button>
                ) : (
                  <Button variant="outline" className="flex items-center gap-2" onClick={handleEditToggle}>
                    <Edit className="h-4 w-4" />
                    Chỉnh sửa
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên khuyến mãi</Label>
                    <Input 
                      id="name" 
                      value={editedPromotion.name} 
                      onChange={e => handleChange("name", e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code">Mã khuyến mãi</Label>
                    <Input 
                      id="code" 
                      value={editedPromotion.code} 
                      onChange={e => handleChange("code", e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discountType">Loại giảm giá</Label>
                    <Select 
                      value={editedPromotion.discountType} 
                      onValueChange={(value: "percentage" | "fixed") => handleChange("discountType", value)}
                    >
                      <SelectTrigger id="discountType">
                        <SelectValue placeholder="Chọn loại giảm giá" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Phần trăm (%)</SelectItem>
                        <SelectItem value="fixed">Số tiền cố định</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discountValue">Giá trị giảm giá</Label>
                    <Input 
                      id="discountValue" 
                      type="number" 
                      value={editedPromotion.discountValue} 
                      onChange={e => handleChange("discountValue", Number(e.target.value))} 
                    />
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
                            {editedPromotion.startDate ? format(new Date(editedPromotion.startDate), "dd/MM/yyyy") : "Chọn ngày"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={new Date(editedPromotion.startDate)}
                            onSelect={(date) => date && handleChange("startDate", format(date, "yyyy-MM-dd"))}
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
                            {editedPromotion.endDate ? format(new Date(editedPromotion.endDate), "dd/MM/yyyy") : "Chọn ngày"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={new Date(editedPromotion.endDate)}
                            onSelect={(date) => date && handleChange("endDate", format(date, "yyyy-MM-dd"))}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minPurchase">Giá trị đơn hàng tối thiểu</Label>
                    <Input 
                      id="minPurchase" 
                      type="number" 
                      value={editedPromotion.minPurchase} 
                      onChange={e => handleChange("minPurchase", parseInt(e.target.value))} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxDiscount">Giảm tối đa</Label>
                    <Input 
                      id="maxDiscount" 
                      type="number" 
                      value={editedPromotion.maxDiscount} 
                      onChange={e => handleChange("maxDiscount", parseInt(e.target.value))} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="usageLimit">Giới hạn sử dụng</Label>
                    <Input 
                      id="usageLimit" 
                      type="number" 
                      value={editedPromotion.usageLimit} 
                      onChange={e => handleChange("usageLimit", parseInt(e.target.value))} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Trạng thái</Label>
                    <Select 
                      value={editedPromotion.status} 
                      onValueChange={(value: string) => handleChange("status", value)}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Đang hoạt động">Đang hoạt động</SelectItem>
                        <SelectItem value="Sắp diễn ra">Sắp diễn ra</SelectItem>
                        <SelectItem value="Đã kết thúc">Đã kết thúc</SelectItem>
                        <SelectItem value="Tạm ngưng">Tạm ngưng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Mô tả</Label>
                    <Textarea 
                      id="description" 
                      rows={4} 
                      value={editedPromotion.description} 
                      onChange={e => handleChange("description", e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="mb-2 block">Áp dụng cho danh mục</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {["Điện thoại", "Laptop", "Máy tính bảng", "Phụ kiện", "Đồng hồ thông minh", "Thiết bị mạng"].map(category => (
                        <div className="flex items-center space-x-2" key={category}>
                          <Checkbox 
                            id={`category-${category}`} 
                            checked={editedPromotion.categories.includes(category)}
                            onCheckedChange={(checked: boolean) => handleCategoriesChange(category, checked)}
                          />
                          <Label htmlFor={`category-${category}`}>{category}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="isPublic" 
                      checked={editedPromotion.isPublic} 
                      onCheckedChange={checked => handleChange("isPublic", checked)} 
                    />
                    <Label htmlFor="isPublic">Hiển thị công khai</Label>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Tên khuyến mãi</p>
                      <p className="font-medium">{promotion.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Mã khuyến mãi</p>
                      <Badge variant="outline" className="bg-primary text-white border-none mt-1">
                        {promotion.code}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Giảm giá</p>
                      <div className="flex items-center mt-1">
                        <Badge className="bg-red-500 text-white border-none mr-2">
                          <Percent className="h-3 w-3 mr-1" />
                          {promotion.discountType === "percentage" 
                            ? `${promotion.discountValue}%` 
                            : `${formatCurrency(promotion.discountValue)} đ`}
                        </Badge>
                        {promotion.maxDiscount > 0 && (
                          <span className="text-xs text-muted-foreground">
                            (Tối đa {formatCurrency(promotion.maxDiscount)} đ)
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Trạng thái</p>
                      <Badge variant="outline" className={`${
                        promotion.status === "Đang hoạt động" 
                          ? "bg-green-500" 
                          : promotion.status === "Sắp diễn ra" 
                            ? "bg-blue-500" 
                            : promotion.status === "Đã kết thúc" 
                              ? "bg-gray-500" 
                              : "bg-yellow-500"
                      } text-white border-none mt-1`}>
                        {promotion.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Thời gian áp dụng</p>
                      <p className="font-medium">
                        {format(new Date(promotion.startDate), "dd/MM/yyyy")} - {format(new Date(promotion.endDate), "dd/MM/yyyy")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Áp dụng cho đơn hàng từ</p>
                      <p className="font-medium">{formatCurrency(promotion.minPurchase)} đ</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Giới hạn sử dụng</p>
                      <p className="font-medium">{promotion.usageCount}/{promotion.usageLimit} lượt</p>
                      <div className="w-full bg-muted rounded-full h-2 mt-1">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${Math.min(100, (promotion.usageCount / promotion.usageLimit) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Hiển thị công khai</p>
                      <p className="font-medium">{promotion.isPublic ? "Có" : "Không"}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground">Mô tả</p>
                      <p className="font-medium">{promotion.description}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground mb-1">Áp dụng cho danh mục</p>
                      <div className="flex flex-wrap gap-2">
                        {promotion.categories.map((category: string) => (
                          <Badge key={category} variant="secondary">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Banner khuyến mãi</CardTitle>
              <CardDescription>Hình ảnh hiển thị cho chương trình khuyến mãi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Image
                  src={promotion.banner}
                  alt={promotion.name}
                  width={500}
                  height={200}
                  className="w-full h-auto object-cover"
                />
              </div>
              {isEditing && (
                <Button variant="outline" className="mt-4 w-full">Thay đổi banner</Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm áp dụng</CardTitle>
              <CardDescription>Danh sách các sản phẩm được áp dụng khuyến mãi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left font-medium">Mã SP</th>
                      <th className="py-3 px-4 text-left font-medium">Tên sản phẩm</th>
                      <th className="py-3 px-4 text-left font-medium">Giá gốc</th>
                      <th className="py-3 px-4 text-left font-medium">Giá sau KM</th>
                    </tr>
                  </thead>
                  <tbody>
                    {promotion.appliedProducts.map((product: AppliedProduct) => (
                      <tr key={product.id} className="border-b">
                        <td className="py-3 px-4 text-sm">{product.id}</td>
                        <td className="py-3 px-4 text-sm font-medium">{product.name}</td>
                        <td className="py-3 px-4 text-sm">{formatCurrency(product.originalPrice)}</td>
                        <td className="py-3 px-4 text-sm font-medium text-primary">{formatCurrency(product.discountedPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thống kê khuyến mãi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-md">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="font-medium">Lượt sử dụng</span>
                  </div>
                  <p className="text-2xl font-bold mt-2">{promotion.usageCount} / {promotion.usageLimit}</p>
                  <p className="text-xs text-muted-foreground">
                    Còn {promotion.usageLimit - promotion.usageCount} lượt có thể sử dụng
                  </p>
                </div>

                <div className="bg-muted p-4 rounded-md">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                    <span className="font-medium">Đơn hàng</span>
                  </div>
                  <p className="text-2xl font-bold mt-2">435</p>
                  <p className="text-xs text-green-500">+12.5% so với khuyến mãi trước</p>
                </div>

                <div className="bg-muted p-4 rounded-md">
                  <div className="flex items-center gap-2">
                    <Percent className="h-5 w-5 text-primary" />
                    <span className="font-medium">Tổng giá trị giảm</span>
                  </div>
                  <p className="text-2xl font-bold mt-2">152.250.000 đ</p>
                  <p className="text-xs text-muted-foreground">Trung bình 350.000 đ/đơn</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin hệ thống</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Mã khuyến mãi</p>
                  <p className="font-medium">{promotion.id}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Ngày tạo</p>
                  <p className="font-medium">{promotion.createdAt}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Cập nhật lần cuối</p>
                  <p className="font-medium">{promotion.updatedAt}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Xóa khuyến mãi</CardTitle>
              <CardDescription>Hành động này không thể khôi phục</CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-full flex items-center gap-2">
                    <Trash className="h-4 w-4" />
                    Xóa khuyến mãi
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Bạn có chắc chắn muốn xóa?</DialogTitle>
                    <DialogDescription>
                      Hành động này sẽ xóa vĩnh viễn khuyến mãi "{promotion.name}" và không thể khôi phục.
                    </DialogDescription>
                  </DialogHeader>
                  <Alert variant="destructive">
                    <AlertTitle>Cảnh báo</AlertTitle>
                    <AlertDescription>
                      Khuyến mãi này đang áp dụng cho {promotion.appliedProducts.length} sản phẩm.
                      Xóa khuyến mãi sẽ ảnh hưởng đến giá của các sản phẩm này.
                    </AlertDescription>
                  </Alert>
                  <DialogFooter className="mt-4">
                    <Button variant="outline">Hủy</Button>
                    <Button variant="destructive">Xóa vĩnh viễn</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
