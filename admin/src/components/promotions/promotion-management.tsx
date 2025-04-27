"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, ChevronDown, Filter, MoreHorizontal, Percent, Search, Tag, Trash } from "lucide-react"

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

const promotions = [
  {
    id: "PROMO-1001",
    name: "Giảm giá mùa hè",
    code: "SUMMER2023",
    type: "Phần trăm",
    value: "15%",
    minOrder: "₫500,000",
    maxDiscount: "₫200,000",
    startDate: "01/06/2023",
    endDate: "30/06/2023",
    status: "Sắp diễn ra",
    usageLimit: 1000,
    usageCount: 0,
  },
  {
    id: "PROMO-1002",
    name: "Khuyến mãi Flash Sale",
    code: "FLASH50",
    type: "Phần trăm",
    value: "50%",
    minOrder: "₫1,000,000",
    maxDiscount: "₫500,000",
    startDate: "15/04/2023",
    endDate: "16/04/2023",
    status: "Đang diễn ra",
    usageLimit: 200,
    usageCount: 87,
  },
  {
    id: "PROMO-1003",
    name: "Miễn phí vận chuyển",
    code: "FREESHIP",
    type: "Cố định",
    value: "₫30,000",
    minOrder: "₫300,000",
    maxDiscount: "₫30,000",
    startDate: "01/04/2023",
    endDate: "30/04/2023",
    status: "Đang diễn ra",
    usageLimit: 5000,
    usageCount: 1245,
  },
  {
    id: "PROMO-1004",
    name: "Giảm giá cho khách hàng mới",
    code: "NEWUSER",
    type: "Phần trăm",
    value: "20%",
    minOrder: "₫200,000",
    maxDiscount: "₫100,000",
    startDate: "01/01/2023",
    endDate: "31/12/2023",
    status: "Đang diễn ra",
    usageLimit: 10000,
    usageCount: 3456,
  },
  {
    id: "PROMO-1005",
    name: "Giảm giá sinh nhật",
    code: "BIRTHDAY",
    type: "Phần trăm",
    value: "25%",
    minOrder: "₫0",
    maxDiscount: "₫300,000",
    startDate: "01/01/2023",
    endDate: "31/12/2023",
    status: "Đang diễn ra",
    usageLimit: 0,
    usageCount: 567,
  },
  {
    id: "PROMO-1006",
    name: "Khuyến mãi Tết",
    code: "TET2023",
    type: "Phần trăm",
    value: "30%",
    minOrder: "₫1,000,000",
    maxDiscount: "₫500,000",
    startDate: "15/01/2023",
    endDate: "05/02/2023",
    status: "Đã kết thúc",
    usageLimit: 3000,
    usageCount: 2879,
  },
  {
    id: "PROMO-1007",
    name: "Giảm giá Black Friday",
    code: "BLACK70",
    type: "Phần trăm",
    value: "70%",
    minOrder: "₫2,000,000",
    maxDiscount: "₫1,000,000",
    startDate: "24/11/2023",
    endDate: "27/11/2023",
    status: "Sắp diễn ra",
    usageLimit: 500,
    usageCount: 0,
  },
  {
    id: "PROMO-1008",
    name: "Giảm giá cho đơn hàng lớn",
    code: "BIGORDER",
    type: "Cố định",
    value: "₫500,000",
    minOrder: "₫5,000,000",
    maxDiscount: "₫500,000",
    startDate: "01/04/2023",
    endDate: "30/04/2023",
    status: "Đang diễn ra",
    usageLimit: 100,
    usageCount: 23,
  },
]

export function PromotionManagement() {
  const [selectedPromotions, setSelectedPromotions] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("all")

  const toggleSelectAll = () => {
    if (selectedPromotions.length === promotions.length) {
      setSelectedPromotions([])
    } else {
      setSelectedPromotions(promotions.map((promotion) => promotion.id))
    }
  }

  const toggleSelectPromotion = (promotionId: string) => {
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
      default:
        return "bg-yellow-500"
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý khuyến mãi</h2>
        <div className="flex items-center gap-2">
          <Button className="flex items-center gap-2">
            <Percent className="h-4 w-4" />
            Tạo khuyến mãi
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Tạo mã giảm giá
          </Button>
        </div>
      </div>
      <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="active">Đang diễn ra</TabsTrigger>
          <TabsTrigger value="upcoming">Sắp diễn ra</TabsTrigger>
          <TabsTrigger value="ended">Đã kết thúc</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Danh sách khuyến mãi</CardTitle>
              <CardDescription>Quản lý tất cả khuyến mãi và mã giảm giá trong hệ thống</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <div className="flex flex-1 items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input type="search" placeholder="Tìm kiếm khuyến mãi..." className="pl-8 w-full" />
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
                  <div className="flex items-center gap-2 bg-muted p-2 rounded-md">
                    <span className="text-sm">{selectedPromotions.length} khuyến mãi đã chọn</span>
                    <Button variant="outline" size="sm" className="gap-1 ml-auto">
                      <Trash className="h-3 w-3" />
                      Xóa
                    </Button>
                  </div>
                )}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40px]">
                          <Checkbox
                            checked={selectedPromotions.length === promotions.length}
                            onCheckedChange={toggleSelectAll}
                          />
                        </TableHead>
                        <TableHead>Tên khuyến mãi</TableHead>
                        <TableHead>Mã</TableHead>
                        <TableHead>Giá trị</TableHead>
                        <TableHead>Thời gian</TableHead>
                        <TableHead>Sử dụng</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead className="text-right">Hành động</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {promotions.map((promotion) => (
                        <TableRow key={promotion.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedPromotions.includes(promotion.id)}
                              onCheckedChange={() => toggleSelectPromotion(promotion.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{promotion.name}</span>
                              <span className="text-xs text-muted-foreground">{promotion.id}</span>
                            </div>
                          </TableCell>
                          <TableCell>{promotion.code}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{promotion.value}</span>
                              <span className="text-xs text-muted-foreground">
                                Min: {promotion.minOrder} | Max: {promotion.maxDiscount}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm">Từ: {promotion.startDate}</span>
                              <span className="text-sm">Đến: {promotion.endDate}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm">
                                {promotion.usageCount} / {promotion.usageLimit > 0 ? promotion.usageLimit : "∞"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {promotion.usageLimit > 0
                                  ? `${Math.round((promotion.usageCount / promotion.usageLimit) * 100)}%`
                                  : ""}
                              </span>
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
                                {promotion.status === "Đang diễn ra" ? (
                                  <DropdownMenuItem className="text-red-600">Dừng khuyến mãi</DropdownMenuItem>
                                ) : promotion.status === "Sắp diễn ra" ? (
                                  <DropdownMenuItem className="text-green-600">Kích hoạt ngay</DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem>Tạo mới tương tự</DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Hiển thị 1-8 của 24 khuyến mãi</div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Trước
                    </Button>
                    <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                      1
                    </Button>
                    <Button variant="outline" size="sm">
                      2
                    </Button>
                    <Button variant="outline" size="sm">
                      3
                    </Button>
                    <Button variant="outline" size="sm">
                      Sau
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Khuyến mãi đang diễn ra</CardTitle>
              <CardDescription>Danh sách các khuyến mãi đang hoạt động</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">Đang tải dữ liệu...</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Khuyến mãi sắp diễn ra</CardTitle>
              <CardDescription>Danh sách các khuyến mãi đã lên lịch</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">Đang tải dữ liệu...</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="ended" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Khuyến mãi đã kết thúc</CardTitle>
              <CardDescription>Danh sách các khuyến mãi đã hết hạn</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">Đang tải dữ liệu...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
