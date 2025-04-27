"use client"
import { useState } from "react"
import Link from "next/link"
import { Check, ChevronDown, Filter, MoreHorizontal, Search, Star, X } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { useToast } from "@/components/ui/use-toast"

const reviews = [
  {
    id: "REV-1001",
    product: "Điện thoại Samsung Galaxy S23",
    productId: "PRD-1001",
    customer: "Nguyễn Văn A",
    customerId: "USR-1001",
    avatar: "/placeholder-user.jpg",
    initials: "NA",
    rating: 5,
    comment: "Sản phẩm rất tốt, đúng như mô tả. Giao hàng nhanh, đóng gói cẩn thận.",
    date: "15/04/2023",
    status: "Đã duyệt",
  },
  {
    id: "REV-1002",
    product: "Laptop Dell XPS 13",
    productId: "PRD-1002",
    customer: "Trần Thị B",
    customerId: "USR-1002",
    avatar: "/placeholder-user.jpg",
    initials: "TB",
    rating: 4,
    comment: "Máy chạy mượt, thiết kế đẹp. Chỉ tiếc là pin không được lâu như mong đợi.",
    date: "14/04/2023",
    status: "Đã duyệt",
  },
  {
    id: "REV-1003",
    product: "Tai nghe Apple AirPods Pro",
    productId: "PRD-1003",
    customer: "Lê Văn C",
    customerId: "USR-1003",
    avatar: "/placeholder-user.jpg",
    initials: "LC",
    rating: 5,
    comment: "Chất lượng âm thanh tuyệt vời, chống ồn hiệu quả. Rất hài lòng với sản phẩm.",
    date: "13/04/2023",
    status: "Đã duyệt",
  },
  {
    id: "REV-1004",
    product: "iPad Pro 12.9 inch",
    productId: "PRD-1004",
    customer: "Phạm Thị D",
    customerId: "USR-1004",
    avatar: "/placeholder-user.jpg",
    initials: "PD",
    rating: 2,
    comment: "Sản phẩm không như mong đợi. Màn hình có điểm chết, pin tụt nhanh.",
    date: "12/04/2023",
    status: "Đã từ chối",
  },
  {
    id: "REV-1005",
    product: "Đồng hồ thông minh Apple Watch Series 8",
    productId: "PRD-1005",
    customer: "Hoàng Văn E",
    customerId: "USR-1005",
    avatar: "/placeholder-user.jpg",
    initials: "HE",
    rating: 4,
    comment: "Đồng hồ đẹp, nhiều tính năng hữu ích. Chỉ tiếc là giá hơi cao.",
    date: "11/04/2023",
    status: "Chờ duyệt",
  },
  {
    id: "REV-1006",
    product: "Máy ảnh Sony Alpha A7 IV",
    productId: "PRD-1006",
    customer: "Ngô Thị F",
    customerId: "USR-1006",
    avatar: "/placeholder-user.jpg",
    initials: "NF",
    rating: 5,
    comment: "Máy ảnh chuyên nghiệp, chất lượng ảnh tuyệt vời. Rất đáng đồng tiền bát gạo.",
    date: "10/04/2023",
    status: "Chờ duyệt",
  },
  {
    id: "REV-1007",
    product: "Loa Bluetooth JBL Charge 5",
    productId: "PRD-1007",
    customer: "Vũ Văn G",
    customerId: "USR-1007",
    avatar: "/placeholder-user.jpg",
    initials: "VG",
    rating: 3,
    comment: "Loa có âm thanh tạm ổn, nhưng không xứng với giá tiền. Kết nối bluetooth thỉnh thoảng bị ngắt.",
    date: "09/04/2023",
    status: "Chờ duyệt",
  },
  {
    id: "REV-1008",
    product: "Màn hình LG UltraGear 27GP950",
    productId: "PRD-1008",
    customer: "Đặng Thị H",
    customerId: "USR-1008",
    avatar: "/placeholder-user.jpg",
    initials: "ĐH",
    rating: 5,
    comment: "Màn hình gaming tuyệt vời, tần số quét cao, màu sắc chính xác. Rất hài lòng.",
    date: "08/04/2023",
    status: "Đã duyệt",
  },
]

export function ReviewManagement() {
  const { toast } = useToast()
  const [reviewsList, setReviewsList] = useState(reviews)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đã duyệt":
        return "bg-green-500"
      case "Chờ duyệt":
        return "bg-yellow-500"
      case "Đã từ chối":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
        ))}
      </div>
    )
  }

  // Xử lý duyệt đánh giá
  const handleApproveReview = (reviewId: string) => {
    setReviewsList(
      reviewsList.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              status: "Đã duyệt",
            }
          : review,
      ),
    )

    toast({
      title: "Đánh giá đã được duyệt",
      description: `Đánh giá ${reviewId} đã được duyệt thành công.`,
    })
  }

  // Xử lý từ chối đánh giá
  const handleRejectReview = (reviewId: string) => {
    setReviewsList(
      reviewsList.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              status: "Đã từ chối",
            }
          : review,
      ),
    )

    toast({
      title: "Đánh giá đã bị từ chối",
      description: `Đánh giá ${reviewId} đã bị từ chối.`,
      variant: "destructive",
    })
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý đánh giá</h2>
      </div>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Danh sách đánh giá</CardTitle>
          <CardDescription>Quản lý tất cả đánh giá sản phẩm trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex flex-1 items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Tìm kiếm đánh giá..." className="pl-8 w-full" />
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
                    <DropdownMenuItem>Sản phẩm</DropdownMenuItem>
                    <DropdownMenuItem>Đánh giá sao</DropdownMenuItem>
                    <DropdownMenuItem>Trạng thái</DropdownMenuItem>
                    <DropdownMenuItem>Ngày đánh giá</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Người dùng</TableHead>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead>Đánh giá</TableHead>
                    <TableHead>Nội dung</TableHead>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviewsList.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.customer} />
                            <AvatarFallback>{review.initials}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{review.customer}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium truncate max-w-[200px]">{review.product}</span>
                          <span className="text-xs text-muted-foreground">{review.productId}</span>
                        </div>
                      </TableCell>
                      <TableCell>{renderStars(review.rating)}</TableCell>
                      <TableCell>
                        <p className="text-sm truncate max-w-[200px]">{review.comment}</p>
                      </TableCell>
                      <TableCell>{review.date}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getStatusColor(review.status)} text-white border-none`}>
                          {review.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {review.status === "Chờ duyệt" && (
                            <>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 text-green-500"
                                onClick={() => handleApproveReview(review.id)}
                              >
                                <Check className="h-4 w-4" />
                                <span className="sr-only">Duyệt</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 text-red-500"
                                onClick={() => handleRejectReview(review.id)}
                              >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Từ chối</span>
                              </Button>
                            </>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Mở menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/reviews/${review.id}`}>Xem chi tiết</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>Phản hồi</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">Xóa đánh giá</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Hiển thị 1-8 của 42 đánh giá</div>
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
    </div>
  )
}
