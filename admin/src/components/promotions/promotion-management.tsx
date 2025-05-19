"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Calendar, ChevronDown, Filter, MoreHorizontal, Percent, Search, Trash } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { PromotionDto, deletePromotion, getAllPromotions } from "@/lib/api/promotions"

export function PromotionManagement() {
  const [promotions, setPromotions] = useState<PromotionDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPromotions, setSelectedPromotions] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [promotionToDelete, setPromotionToDelete] = useState<number | null>(null)
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)

  // Fetch promotions
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true)
        const data = await getAllPromotions()
        setPromotions(data)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch promotions:", err)
        setError("Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.")
      } finally {
        setLoading(false)
      }
    }

    fetchPromotions()
  }, [])

  const toggleSelectAll = () => {
    if (selectedPromotions.length === filteredPromotions.length) {
      setSelectedPromotions([])
    } else {
      setSelectedPromotions(filteredPromotions.map((promotion) => promotion.id))
    }
  }

  const toggleSelectPromotion = (promotionId: number) => {
    if (selectedPromotions.includes(promotionId)) {
      setSelectedPromotions(selectedPromotions.filter((id) => id !== promotionId))
    } else {
      setSelectedPromotions([...selectedPromotions, promotionId])
    }
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

  // Handle promotion deletion
  const handleDeletePromotion = async () => {
    if (promotionToDelete) {
      try {
        await deletePromotion(promotionToDelete)
        setPromotions(promotions.filter(p => p.id !== promotionToDelete))
        toast.success("Đã xóa khuyến mãi thành công")
      } catch (err) {
        console.error("Failed to delete promotion:", err)
        toast.error("Không thể xóa khuyến mãi. Vui lòng thử lại sau.")
      } finally {
        setPromotionToDelete(null)
        setDeleteDialogOpen(false)
      }
    }
  }

  // Handle bulk deletion
  const handleBulkDelete = async () => {
    try {
      // Using Promise.all to delete multiple promotions in parallel
      await Promise.all(selectedPromotions.map(id => deletePromotion(id)))
      setPromotions(promotions.filter(p => !selectedPromotions.includes(p.id)))
      setSelectedPromotions([])
      toast.success(`Đã xóa ${selectedPromotions.length} khuyến mãi thành công`)
    } catch (err) {
      console.error("Failed to delete promotions:", err)
      toast.error("Có lỗi xảy ra khi xóa khuyến mãi. Vui lòng thử lại sau.")
    } finally {
      setBulkDeleteDialogOpen(false)
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, 'dd/MM/yyyy')
  }

  // Filter promotions based on active tab and search query
  const filteredPromotions = promotions.filter(promotion => {
    // Filter by tab
    const tabFilter = 
      activeTab === "all" ? true :
      activeTab === "active" ? promotion.status === "Đang diễn ra" :
      activeTab === "upcoming" ? promotion.status === "Sắp diễn ra" :
      activeTab === "ended" ? promotion.status === "Đã kết thúc" : true;
    
    // Filter by search query
    const searchFilter = searchQuery === "" || 
      promotion.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promotion.code.toLowerCase().includes(searchQuery.toLowerCase());
    
    return tabFilter && searchFilter;
  });

  // Loading state content
  if (loading) {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Quản lý khuyến mãi</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-2" asChild>
              <Link href="/dashboard/promotions/tools">
                <Search className="h-4 w-4" />
                Công cụ
              </Link>
            </Button>
            <Button className="flex items-center gap-2" asChild>
              <Link href="/dashboard/promotions/create">
                <Percent className="h-4 w-4" />
                Tạo khuyến mãi
              </Link>
            </Button>
          </div>
        </div>
        <Card className="border-none shadow-sm">
          <CardHeader className="px-5 py-4 border-b bg-muted/30">
            <CardTitle className="text-lg">Đang tải dữ liệu...</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-[300px]">
              <div className="text-center">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-muted mb-4">
                  <Percent className="h-6 w-6 text-primary animate-pulse" />
                </div>
                <h3 className="text-lg font-medium mb-2">Đang tải thông tin khuyến mãi</h3>
                <p className="text-muted-foreground">Vui lòng đợi trong giây lát</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error state content
  if (error) {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Quản lý khuyến mãi</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-2" asChild>
              <Link href="/dashboard/promotions/tools">
                <Search className="h-4 w-4" />
                Công cụ
              </Link>
            </Button>
            <Button className="flex items-center gap-2" asChild>
              <Link href="/dashboard/promotions/create">
                <Percent className="h-4 w-4" />
                Tạo khuyến mãi
              </Link>
            </Button>
          </div>
        </div>
        <Card className="border-none shadow-sm">
          <CardHeader className="px-5 py-4 border-b bg-muted/30">
            <CardTitle className="text-lg text-red-500">Lỗi</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-[300px]">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2 text-red-500">Không thể tải dữ liệu</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>Thử lại</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý khuyến mãi</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2" asChild>
            <Link href="/dashboard/promotions/tools">
              <Search className="h-4 w-4" />
              Công cụ
            </Link>
          </Button>
          <Button className="flex items-center gap-2" asChild>
            <Link href="/dashboard/promotions/create">
              <Percent className="h-4 w-4" />
              Tạo khuyến mãi
            </Link>
          </Button>
        </div>
      </div>
      <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
        <div className="border-b">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="all" className="flex-1 sm:flex-none">Tất cả</TabsTrigger>
            <TabsTrigger value="active" className="flex-1 sm:flex-none">Đang diễn ra</TabsTrigger>
            <TabsTrigger value="upcoming" className="flex-1 sm:flex-none">Sắp diễn ra</TabsTrigger>
            <TabsTrigger value="ended" className="flex-1 sm:flex-none">Đã kết thúc</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="all" className="space-y-4">
          <Card className="border-none shadow-sm">
            <CardHeader className="px-5 py-4 border-b bg-muted/30">
              <CardTitle className="text-lg">Danh sách khuyến mãi</CardTitle>
              <CardDescription>Quản lý tất cả khuyến mãi và mã giảm giá trong hệ thống</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row p-4 gap-4 justify-between border-b">
                  <div className="flex flex-1 items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="search" 
                        placeholder="Tìm kiếm khuyến mãi..." 
                        className="pl-8 w-full" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2">
                          <Filter className="h-4 w-4" />
                          Lọc
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[200px]">
                        <DropdownMenuLabel>Lọc theo</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Loại khuyến mãi</DropdownMenuItem>
                        <DropdownMenuItem>Trạng thái</DropdownMenuItem>
                        <DropdownMenuItem>Ngày bắt đầu</DropdownMenuItem>
                        <DropdownMenuItem>Ngày kết thúc</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="outline" className="gap-2">
                      <Calendar className="h-4 w-4" />
                      Ngày
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="10">
                      <SelectTrigger className="w-[80px]">
                        <SelectValue placeholder="10" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {selectedPromotions.length > 0 && (
                  <div className="flex items-center gap-2 mx-4 p-2 rounded-md bg-muted">
                    <span className="text-sm">{selectedPromotions.length} khuyến mãi đã chọn</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1 ml-auto"
                      onClick={() => setBulkDeleteDialogOpen(true)}
                    >
                      <Trash className="h-3 w-3" />
                      Xóa
                    </Button>
                  </div>
                )}

                {filteredPromotions.length === 0 ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center p-3 rounded-full bg-muted mb-4">
                        <Percent className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">Không tìm thấy khuyến mãi</h3>
                      <p className="text-muted-foreground">Không có khuyến mãi nào phù hợp với tìm kiếm của bạn</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Table>
                      <TableHeader className="bg-muted/40">
                        <TableRow>
                          <TableHead className="w-[40px]">
                            <Checkbox
                              checked={selectedPromotions.length === filteredPromotions.length && filteredPromotions.length > 0}
                              onCheckedChange={toggleSelectAll}
                            />
                          </TableHead>
                          <TableHead>Tên khuyến mãi</TableHead>
                          <TableHead>Mã</TableHead>
                          <TableHead>Giá trị</TableHead>
                          <TableHead>Thời gian</TableHead>
                          <TableHead>Áp dụng cho</TableHead>
                          <TableHead>Trạng thái</TableHead>
                          <TableHead className="hidden md:table-cell">Sử dụng</TableHead>
                          <TableHead className="text-right">Hành động</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPromotions.map((promotion) => (
                          <TableRow key={promotion.id} className="hover:bg-muted/30">
                            <TableCell>
                              <Checkbox
                                checked={selectedPromotions.includes(promotion.id)}
                                onCheckedChange={() => toggleSelectPromotion(promotion.id)}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium text-sm">{promotion.name}</span>
                                <span className="text-xs text-muted-foreground">ID: {promotion.id}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <code className="bg-muted px-1 py-0.5 rounded text-xs">{promotion.code}</code>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">{promotion.discountRate}%</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground">Từ: {formatDate(promotion.startDate)}</span>
                                <span className="text-sm text-muted-foreground">Đến: {formatDate(promotion.endDate)}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="text-sm">
                                  {promotion.categories.length > 0 
                                    ? `${promotion.categories.length} danh mục` 
                                    : "Tất cả sản phẩm"}
                                </span>
                                {promotion.categories.length > 0 && (
                                  <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                                    {promotion.categories.map(c => c.title).join(", ")}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={`${getStatusColor(promotion.status)} text-white border-none`}
                              >
                                {promotion.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="flex flex-col">
                                <div className="flex items-center text-sm font-medium">
                                  {promotion.usedQuantity || 0} / {promotion.totalQuantity > 0 ? promotion.totalQuantity : "∞"}
                                </div>
                                {promotion.totalQuantity > 0 && (
                                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                    <div 
                                      className="bg-primary h-2 rounded-full" 
                                      style={{ 
                                        width: `${Math.min(((promotion.usedQuantity || 0) / promotion.totalQuantity) * 100, 100)}%` 
                                      }}
                                    ></div>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Mở menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <Link href={`/dashboard/promotions/${promotion.id}`}>Xem chi tiết</Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link href={`/dashboard/promotions/${promotion.id}`}>Chỉnh sửa</Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>Sao chép</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-red-600"
                                    onClick={() => {
                                      setPromotionToDelete(promotion.id)
                                      setDeleteDialogOpen(true)
                                    }}
                                  >
                                    Xóa khuyến mãi
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {filteredPromotions.length > 0 && (
                  <div className="flex items-center justify-between p-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Hiển thị {filteredPromotions.length} khuyến mãi
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" disabled>
                        Trước
                      </Button>
                      <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                        1
                      </Button>
                      <Button variant="outline" size="sm" disabled>
                        Sau
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Other tab contents have similar structure, so we'll use the filtered promotions */}
        <TabsContent value="active" className="space-y-4">
          <Card className="border-none shadow-sm">
            <CardHeader className="px-5 py-4 border-b bg-muted/30">
              <CardTitle className="text-lg">Khuyến mãi đang diễn ra</CardTitle>
              <CardDescription>Danh sách các khuyến mãi đang hoạt động</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {filteredPromotions.length === 0 ? (
                <div className="flex items-center justify-center h-[300px]">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center p-3 rounded-full bg-muted mb-4">
                      <Percent className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Không có khuyến mãi đang diễn ra</h3>
                    <p className="text-muted-foreground">Hiện tại không có khuyến mãi nào đang hoạt động</p>
                  </div>
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow>
                      <TableHead>Tên khuyến mãi</TableHead>
                      <TableHead>Mã</TableHead>
                      <TableHead>Giá trị</TableHead>
                      <TableHead>Thời gian</TableHead>
                      <TableHead>Áp dụng cho</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPromotions.map((promotion) => (
                      <TableRow key={promotion.id} className="hover:bg-muted/30">
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">{promotion.name}</span>
                            <span className="text-xs text-muted-foreground">ID: {promotion.id}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="bg-muted px-1 py-0.5 rounded text-xs">{promotion.code}</code>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{promotion.discountRate}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">Từ: {formatDate(promotion.startDate)}</span>
                            <span className="text-sm text-muted-foreground">Đến: {formatDate(promotion.endDate)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm">
                              {promotion.categories.length > 0 
                                ? `${promotion.categories.length} danh mục` 
                                : "Tất cả sản phẩm"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/promotions/${promotion.id}`}>
                              Chi tiết
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="upcoming" className="space-y-4">
          <Card className="border-none shadow-sm">
            <CardHeader className="px-5 py-4 border-b bg-muted/30">
              <CardTitle className="text-lg">Khuyến mãi sắp diễn ra</CardTitle>
              <CardDescription>Danh sách các khuyến mãi đã lên lịch</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {filteredPromotions.length === 0 ? (
                <div className="flex items-center justify-center h-[300px]">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center p-3 rounded-full bg-muted mb-4">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Không có khuyến mãi sắp diễn ra</h3>
                    <p className="text-muted-foreground">Hiện tại không có khuyến mãi nào đã lên lịch</p>
                  </div>
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow>
                      <TableHead>Tên khuyến mãi</TableHead>
                      <TableHead>Mã</TableHead>
                      <TableHead>Giá trị</TableHead>
                      <TableHead>Thời gian</TableHead>
                      <TableHead>Áp dụng cho</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPromotions.map((promotion) => (
                      <TableRow key={promotion.id} className="hover:bg-muted/30">
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">{promotion.name}</span>
                            <span className="text-xs text-muted-foreground">ID: {promotion.id}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="bg-muted px-1 py-0.5 rounded text-xs">{promotion.code}</code>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{promotion.discountRate}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">Từ: {formatDate(promotion.startDate)}</span>
                            <span className="text-sm text-muted-foreground">Đến: {formatDate(promotion.endDate)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm">
                              {promotion.categories.length > 0 
                                ? `${promotion.categories.length} danh mục` 
                                : "Tất cả sản phẩm"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/promotions/${promotion.id}`}>
                              Chi tiết
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ended" className="space-y-4">
          <Card className="border-none shadow-sm">
            <CardHeader className="px-5 py-4 border-b bg-muted/30">
              <CardTitle className="text-lg">Khuyến mãi đã kết thúc</CardTitle>
              <CardDescription>Danh sách các khuyến mãi đã hết hạn</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {filteredPromotions.length === 0 ? (
                <div className="flex items-center justify-center h-[300px]">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center p-3 rounded-full bg-muted mb-4">
                      <Filter className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Không có khuyến mãi đã kết thúc</h3>
                    <p className="text-muted-foreground">Hiện tại không có khuyến mãi nào đã hết hạn</p>
                  </div>
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow>
                      <TableHead>Tên khuyến mãi</TableHead>
                      <TableHead>Mã</TableHead>
                      <TableHead>Giá trị</TableHead>
                      <TableHead>Thời gian</TableHead>
                      <TableHead>Áp dụng cho</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPromotions.map((promotion) => (
                      <TableRow key={promotion.id} className="hover:bg-muted/30">
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">{promotion.name}</span>
                            <span className="text-xs text-muted-foreground">ID: {promotion.id}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="bg-muted px-1 py-0.5 rounded text-xs">{promotion.code}</code>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{promotion.discountRate}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">Từ: {formatDate(promotion.startDate)}</span>
                            <span className="text-sm text-muted-foreground">Đến: {formatDate(promotion.endDate)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm">
                              {promotion.categories.length > 0 
                                ? `${promotion.categories.length} danh mục` 
                                : "Tất cả sản phẩm"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/promotions/${promotion.id}`}>
                              Chi tiết
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa khuyến mãi</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa khuyến mãi này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePromotion}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk delete confirmation dialog */}
      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa nhiều khuyến mãi</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa {selectedPromotions.length} khuyến mãi đã chọn? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
