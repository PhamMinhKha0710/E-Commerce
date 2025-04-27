"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, ChevronDown, Download, Eye, Filter, MoreHorizontal, Search, Trash } from "lucide-react"

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

const orders = [
  {
    id: "ORD-1234",
    customer: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    date: "15/04/2023",
    total: "₫1,250,000",
    status: "Đang xử lý",
    payment: "Đã thanh toán",
    paymentMethod: "Thẻ tín dụng",
  },
  {
    id: "ORD-1235",
    customer: "Trần Thị B",
    email: "tranthib@example.com",
    date: "15/04/2023",
    total: "₫2,345,000",
    status: "Đang xử lý",
    payment: "Đã thanh toán",
    paymentMethod: "Ví điện tử",
  },
  {
    id: "ORD-1236",
    customer: "Lê Văn C",
    email: "levanc@example.com",
    date: "14/04/2023",
    total: "₫890,000",
    status: "Đang vận chuyển",
    payment: "Đã thanh toán",
    paymentMethod: "Chuyển khoản",
  },
  {
    id: "ORD-1237",
    customer: "Phạm Thị D",
    email: "phamthid@example.com",
    date: "14/04/2023",
    total: "₫1,750,000",
    status: "Đã hủy",
    payment: "Hoàn tiền",
    paymentMethod: "Thẻ tín dụng",
  },
  {
    id: "ORD-1238",
    customer: "Hoàng Văn E",
    email: "hoangvane@example.com",
    date: "13/04/2023",
    total: "₫3,450,000",
    status: "Đã giao hàng",
    payment: "Đã thanh toán",
    paymentMethod: "COD",
  },
  {
    id: "ORD-1239",
    customer: "Ngô Thị F",
    email: "ngothif@example.com",
    date: "13/04/2023",
    total: "₫1,890,000",
    status: "Đang xử lý",
    payment: "Chờ thanh toán",
    paymentMethod: "Chuyển khoản",
  },
  {
    id: "ORD-1240",
    customer: "Vũ Văn G",
    email: "vuvang@example.com",
    date: "12/04/2023",
    total: "₫2,150,000",
    status: "Đang vận chuyển",
    payment: "Đã thanh toán",
    paymentMethod: "Ví điện tử",
  },
  {
    id: "ORD-1241",
    customer: "Đặng Thị H",
    email: "dangthih@example.com",
    date: "12/04/2023",
    total: "₫950,000",
    status: "Đã giao hàng",
    payment: "Đã thanh toán",
    paymentMethod: "COD",
  },
]

export function OrderManagement() {
  const { toast } = useToast()
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])

  // Hàm chuyển đổi từ tên trạng thái sang giá trị
  const getStatusValue = (status: string) => {
    switch (status) {
      case "Đang xử lý":
        return "pending"
      case "Đang chuẩn bị hàng":
        return "processing"
      case "Đang vận chuyển":
        return "shipping"
      case "Đã giao hàng":
        return "delivered"
      case "Đã hủy":
        return "cancelled"
      default:
        return "pending"
    }
  }

  const toggleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(orders.map((order) => order.id))
    }
  }

  const toggleSelectOrder = (orderId: string) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter((id) => id !== orderId))
    } else {
      setSelectedOrders([...selectedOrders, orderId])
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đã giao hàng":
        return "bg-green-500"
      case "Đang xử lý":
        return "bg-blue-500"
      case "Đang vận chuyển":
        return "bg-yellow-500"
      case "Đã hủy":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPaymentColor = (payment: string) => {
    switch (payment) {
      case "Đã thanh toán":
        return "bg-green-500"
      case "Chờ thanh toán":
        return "bg-yellow-500"
      case "Hoàn tiền":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý đơn hàng</h2>
        <Button className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Xuất dữ liệu
        </Button>
      </div>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Danh sách đơn hàng</CardTitle>
          <CardDescription>Quản lý tất cả đơn hàng trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex flex-1 items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Tìm kiếm đơn hàng..." className="pl-8 w-full" />
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
                    <DropdownMenuItem>Trạng thái</DropdownMenuItem>
                    <DropdownMenuItem>Thanh toán</DropdownMenuItem>
                    <DropdownMenuItem>Phương thức thanh toán</DropdownMenuItem>
                    <DropdownMenuItem>Ngày đặt hàng</DropdownMenuItem>
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
            {selectedOrders.length > 0 && (
              <div className="flex items-center gap-2 bg-muted p-2 rounded-md">
                <span className="text-sm">{selectedOrders.length} đơn hàng đã chọn</span>
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
                      <Checkbox checked={selectedOrders.length === orders.length} onCheckedChange={toggleSelectAll} />
                    </TableHead>
                    <TableHead>Mã đơn</TableHead>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Ngày đặt</TableHead>
                    <TableHead>Tổng tiền</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thanh toán</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedOrders.includes(order.id)}
                          onCheckedChange={() => toggleSelectOrder(order.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{order.customer}</span>
                          <span className="text-xs text-muted-foreground">{order.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.total}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getStatusColor(order.status)} text-white border-none`}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getPaymentColor(order.payment)} text-white border-none`}>
                          {order.payment}
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
                              <Link href={`/dashboard/orders/${order.id.toLowerCase()}`} className="flex items-center">
                                <Eye className="mr-2 h-4 w-4" />
                                Xem chi tiết
                              </Link>
                            </DropdownMenuItem>
                            <Dialog>
                              <DialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  Cập nhật trạng thái
                                </DropdownMenuItem>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
                                  <DialogDescription>Thay đổi trạng thái đơn hàng {order.id}</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor={`status-${order.id}`}>Trạng thái mới</Label>
                                    <Select defaultValue={getStatusValue(order.status)}>
                                      <SelectTrigger id={`status-${order.id}`}>
                                        <SelectValue placeholder="Chọn trạng thái" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending">
                                          <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                                            <span>Đang xử lý</span>
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="processing">
                                          <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-yellow-500" />
                                            <span>Đang chuẩn bị hàng</span>
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="shipping">
                                          <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-purple-500" />
                                            <span>Đang vận chuyển</span>
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="delivered">
                                          <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-green-500" />
                                            <span>Đã giao hàng</span>
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="cancelled">
                                          <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-red-500" />
                                            <span>Đã hủy</span>
                                          </div>
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor={`note-${order.id}`}>Ghi chú (tùy chọn)</Label>
                                    <Textarea
                                      id={`note-${order.id}`}
                                      placeholder="Nhập ghi chú về việc thay đổi trạng thái..."
                                    />
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox id={`notify-${order.id}`} defaultChecked />
                                    <Label htmlFor={`notify-${order.id}`}>Thông báo cho khách hàng</Label>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button
                                    onClick={() => {
                                      toast({
                                        title: "Cập nhật trạng thái",
                                        description: `Đơn hàng ${order.id} đã được cập nhật trạng thái.`,
                                      })
                                    }}
                                  >
                                    Cập nhật
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Hủy đơn hàng</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Hiển thị 1-8 của 156 đơn hàng</div>
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
